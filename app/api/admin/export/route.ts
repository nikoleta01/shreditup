import { cookies } from 'next/headers'
import { getAdminSupabase } from '@/lib/supabase-admin'

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

  const [{ data: regs, error }, { data: activity }] = await Promise.all([
    supabase.from('activity_registrations').select('user_id').eq('activity_id', activityId),
    supabase.from('activities').select('name').eq('id', activityId).single(),
  ])

  if (error) return new Response(error.message, { status: 500 })

  const userIds = (regs ?? []).map((r: { user_id: string }) => r.user_id)
  const { data: profiles } = userIds.length > 0
    ? await supabase.from('profiles').select('first_name, last_name').in('id', userIds)
    : { data: [] }

  const rows = (profiles ?? []).map((p: { first_name: string; last_name: string }) =>
    `"${p.first_name}","${p.last_name}"`
  )
  const csv = ['Meno,Priezvisko', ...rows].join('\n')

  const filename = (activity?.name ?? activityId).replace(/[^a-z0-9\-]/gi, '_') + '-ucastnici.csv'

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
