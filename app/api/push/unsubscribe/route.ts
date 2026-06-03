import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function POST(req: Request) {
  const { endpoint } = await req.json()

  if (!endpoint) {
    return NextResponse.json({ error: 'Missing endpoint' }, { status: 400 })
  }

  await getSupabase().from('push_subscriptions').delete().eq('endpoint', endpoint)

  return NextResponse.json({ success: true })
}
