import { cookies } from 'next/headers'
import { getAdminSupabase } from '@/lib/supabase-admin'
import { getRegisterableActivity } from '@/lib/data'

export async function GET(req: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD
  const cookieStore = await cookies()
  if (!adminPassword || cookieStore.get('admin_auth')?.value !== adminPassword) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const activityId = searchParams.get('activity_id')
  if (!activityId) {
    return new Response('Missing activity_id', { status: 400 })
  }

  const supabase = getAdminSupabase()

  const { data: regs, error } = await supabase
    .from('activity_registrations')
    .select('user_id, created_at')
    .eq('activity_id', activityId)
    .order('created_at', { ascending: true })

  if (error) return new Response(error.message, { status: 500 })

  const userIds = (regs ?? []).map((r: { user_id: string }) => r.user_id)
  const { data: profiles } = userIds.length > 0
    ? await supabase.from('profiles').select('id, first_name, last_name').in('id', userIds)
    : { data: [] }

  // .in() doesn't preserve input order, so look profiles up by id instead of
  // zipping by index — numbering has to follow registration order, not
  // whatever order Postgres happens to return profiles in.
  const profileById = new Map(
    (profiles ?? []).map((p: { id: string; first_name: string; last_name: string }) => [p.id, p]),
  )
  const rows = (regs ?? []).flatMap((r: { user_id: string }, i: number) => {
    const p = profileById.get(r.user_id)
    if (!p) return []
    return [`${i + 1},"${p.first_name}","${p.last_name}"`]
  })
  const csv = ['Číslo,Meno,Priezvisko', ...rows].join('\n')

  // Activity name for the filename comes from lib/data.ts, not the DB.
  const name = getRegisterableActivity(activityId)?.title.sk ?? activityId
  const filename = name.replace(/[^a-z0-9\-]/gi, '_') + '-ucastnici.csv'

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
