import { createBrowserClient } from '@supabase/ssr'
import { isAuthError } from '@supabase/supabase-js'

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

// Codes that mean the server has definitively lost the account or session.
// Everything else — offline, gateway 5xx, captive portal, rate limit — must
// leave the cached session alone: losing signal at the festival is not a logout.
const DEAD_SESSION_CODES = new Set([
  'user_not_found',
  'session_not_found',
  'session_expired',
  'refresh_token_not_found',
  'refresh_token_already_used',
  'bad_jwt',
])

function isDeadSession(error: unknown) {
  return isAuthError(error) && DEAD_SESSION_CODES.has(error.code ?? '')
}

// getSession() only reads localStorage, and a JWT whose user was deleted still
// verifies by signature — so a wiped account keeps looking signed in until the
// token expires, and every write fails on the profiles → auth.users FK
// meanwhile. getUser() is the round trip that actually asks the server.
export async function getLiveSession() {
  const supabase = getSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return { supabase, session: null }

  const { error } = await supabase.auth.getUser()
  if (!isDeadSession(error)) return { supabase, session }

  await supabase.auth.signOut({ scope: 'local' })
  return { supabase, session: null }
}

export async function ensureAnonymousSession() {
  const { supabase, session } = await getLiveSession()
  if (session) return supabase

  const { error } = await supabase.auth.signInAnonymously()
  if (error) throw error
  return supabase
}

// The account can also vanish while a tab sits open for hours, so writes have
// to be able to recover on their own. Local scope: the server-side session is
// already gone, no point asking it to revoke one.
export async function reauthenticateAnonymously() {
  const supabase = getSupabase()
  await supabase.auth.signOut({ scope: 'local' })
  const { data, error } = await supabase.auth.signInAnonymously()
  if (error) throw error
  return data.session?.user ?? null
}
