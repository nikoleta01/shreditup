import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function POST(req: Request) {
  const sub = await req.json()
  const { endpoint, keys } = sub

  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 })
  }

  await getSupabase().from('push_subscriptions').upsert(
    { endpoint, p256dh: keys.p256dh, auth: keys.auth },
    { onConflict: 'endpoint' }
  )

  return NextResponse.json({ success: true })
}
