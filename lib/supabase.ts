import { createBrowserClient } from '@supabase/ssr'

export type PushSubscriptionRow = {
  id: string
  endpoint: string
  p256dh: string
  auth: string
  created_at: string
}

export function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function ensureAnonymousSession() {
  const supabase = getSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    const { data, error } = await supabase.auth.signInAnonymously()
    console.log('[supabase] signInAnonymously result:', data, error)
    if (error) throw error
  }
  return supabase
}
