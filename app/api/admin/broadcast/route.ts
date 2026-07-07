import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import webpush from 'web-push'
import { getAdminSupabase } from '@/lib/supabase-admin'

export async function POST(req: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD
  const cookieStore = await cookies()
  if (!adminPassword || cookieStore.get('admin_auth')?.value !== adminPassword) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let parsed: { title?: string; message?: string; url?: string }
  try {
    parsed = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const title = parsed.title?.trim()
  const message = parsed.message?.trim()
  if (!title || !message) {
    return NextResponse.json({ error: 'Title and message are required' }, { status: 400 })
  }

  const supabase = getAdminSupabase()
  const { data: subs } = await supabase.from('push_subscriptions').select('*')
  if (!subs || subs.length === 0) {
    return NextResponse.json({ sent: 0, failed: 0, pruned: 0 })
  }

  webpush.setVapidDetails(
    'mailto:shreditup@leveltrevel.sk',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  )

  const payload = JSON.stringify({
    title,
    body: message,
    url: parsed.url?.trim() || '/',
  })

  // Endpoints that report the subscription is gone — prune them after sending.
  const deadEndpoints: string[] = []

  const results = await Promise.allSettled(
    subs.map((sub) =>
      webpush
        .sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        )
        .catch((err: { statusCode?: number }) => {
          // 404 Not Found / 410 Gone → user uninstalled or revoked, drop the row
          if (err?.statusCode === 404 || err?.statusCode === 410) {
            deadEndpoints.push(sub.endpoint)
          }
          throw err
        })
    )
  )

  const sent = results.filter((r) => r.status === 'fulfilled').length
  const failed = results.length - sent

  if (deadEndpoints.length > 0) {
    await supabase.from('push_subscriptions').delete().in('endpoint', deadEndpoints)
  }

  return NextResponse.json({ sent, failed, pruned: deadEndpoints.length })
}
