import { createClient } from '@supabase/supabase-js'

export type PushSubscriptionRow = {
  id: string
  endpoint: string
  p256dh: string
  auth: string
  created_at: string
}

export function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
