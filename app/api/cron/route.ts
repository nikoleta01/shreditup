import { NextResponse } from 'next/server'
import webpush from 'web-push'
import { getAdminSupabase } from '@/lib/supabase-admin'
import { program, FESTIVAL_DAYS } from '@/lib/data'

export async function GET(req: Request) {
  if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()

  const upcoming = program.filter((p) => {
    const festDay = FESTIVAL_DAYS[p.day].date
    const [h, m] = p.startTime.split(':').map(Number)
    const perfDate = new Date(festDay)
    perfDate.setHours(h, m, 0, 0)

    const diffMs = perfDate.getTime() - now.getTime()
    // 28–33 min window — sized for a 5-min cron, centered on 30 min before start
    return diffMs > 28 * 60 * 1000 && diffMs <= 33 * 60 * 1000
  })

  webpush.setVapidDetails(
    'mailto:shreditup@leveltrevel.sk',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  )

  if (upcoming.length === 0) {
    return NextResponse.json({ sent: 0 })
  }

  const { data: subs } = await getAdminSupabase().from('push_subscriptions').select('*')
  if (!subs || subs.length === 0) return NextResponse.json({ sent: 0 })

  let sent = 0

  for (const item of upcoming) {
    const payload = JSON.stringify({
      title: item.title.sk,
      body: `O 30 minút začína · Starting in 30 min · ${item.startTime}`,
      url: '/program',
    })

    await Promise.allSettled(
      subs.map((sub) =>
        webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        )
      )
    )

    sent++
  }

  return NextResponse.json({ sent, program: upcoming.map((p) => p.title.sk) })
}
