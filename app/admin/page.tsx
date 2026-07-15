import { cookies } from 'next/headers'
import { AdminLogin } from './_components/AdminLogin'
import { BroadcastForm } from './_components/BroadcastForm'
import { getAdminSupabase } from '@/lib/supabase-admin'
import { FESTIVAL_DAYS, getRegisterableActivity } from '@/lib/data'
import { WaveChip } from '@/components/wave-chip'

type Activity = {
  id: string
  capacity: number
}

type Profile = {
  id: string
  first_name: string
  last_name: string
}

type Registration = {
  activity_id: string
  user_id: string
}

export default async function AdminPage() {
  const adminPassword = process.env.ADMIN_PASSWORD
  const cookieStore = await cookies()
  const isAuthed = !!adminPassword && cookieStore.get('admin_auth')?.value === adminPassword

  if (!isAuthed) {
    return <AdminLogin />
  }

  const supabase = getAdminSupabase()

  const [{ data: activities }, { data: allRegs }, { count: subscriberCount }] = await Promise.all([
    supabase.from('activities').select('id, capacity'),
    supabase.from('activity_registrations').select('activity_id, user_id'),
    supabase.from('push_subscriptions').select('*', { count: 'exact', head: true }),
  ])

  const userIds = [...new Set(((allRegs ?? []) as Registration[]).map((r) => r.user_id))]
  const { data: profiles } =
    userIds.length > 0
      ? await supabase.from('profiles').select('id, first_name, last_name').in('id', userIds)
      : { data: [] as Profile[] }

  const profileMap = new Map(((profiles ?? []) as Profile[]).map((p) => [p.id, p]))

  // The DB row gives us only id + capacity; the display fields (title, day,
  // time) are resolved from lib/data.ts by id — the single source of truth.
  const activitiesWithParticipants = ((activities ?? []) as Activity[])
    .map((a) => {
      const item = getRegisterableActivity(a.id)
      return {
        id: a.id,
        capacity: a.capacity,
        title: item?.title ?? a.id,
        day: item?.day,
        startTime: item?.startTime,
        participants: ((allRegs ?? []) as Registration[])
          .filter((r) => r.activity_id === a.id)
          .map((r) => profileMap.get(r.user_id))
          .filter((p): p is Profile => !!p),
      }
    })
    .sort((x, y) => (x.day ?? 99) - (y.day ?? 99) || (x.startTime ?? '').localeCompare(y.startTime ?? ''))

  const dayLabel = (day?: number) =>
    day ? FESTIVAL_DAYS[day as 1 | 2 | 3]?.short ?? `Deň ${day}` : ''

  return (
    <div className="mx-auto max-w-md px-4 pt-8 pb-8">
      <h1
        className="mb-1 text-4xl leading-tight text-foreground"
        style={{ fontFamily: 'var(--font-alfa)' }}
      >
        Admin
      </h1>
      <p
        className="mb-6 text-sm text-foreground/60"
        style={{ fontFamily: 'var(--font-barlow-condensed)' }}
      >
        Účastníci aktivít
      </p>

      <BroadcastForm subscriberCount={subscriberCount ?? 0} />

      <div className="space-y-4">
        {activitiesWithParticipants.map((activity) => (
          <div key={activity.id} className="border-2 border-foreground bg-card p-4">
            <div className="mb-1">
              <WaveChip className="text-sm">{activity.title}</WaveChip>
            </div>
            <div
              className="mb-3 flex items-center gap-3 text-xs text-foreground/60"
              style={{ fontFamily: 'var(--font-barlow-condensed)' }}
            >
              <span>{dayLabel(activity.day)}</span>
              <span>{activity.startTime}</span>
              <span className="ml-auto font-bold text-foreground">
                {activity.participants.length} / {activity.capacity}
              </span>
            </div>

            {activity.participants.length === 0 ? (
              <p
                className="mb-3 text-xs text-foreground/40"
                style={{ fontFamily: 'var(--font-barlow-condensed)' }}
              >
                Žiadni účastníci
              </p>
            ) : (
              <ul
                className="mb-3 space-y-1 border-l-2 border-foreground/20 pl-3"
                style={{ fontFamily: 'var(--font-barlow-condensed)' }}
              >
                {activity.participants.map((p, i) => (
                  <li key={i} className="text-sm text-foreground">
                    {p.first_name} {p.last_name}
                  </li>
                ))}
              </ul>
            )}

            <a
              href={`/api/admin/export?activity_id=${activity.id}`}
              className="inline-block border-2 border-foreground px-4 py-2 text-xs font-bold text-foreground transition-colors active:bg-foreground active:text-background"
              style={{ fontFamily: 'var(--font-barlow-condensed)' }}
            >
              Stiahnuť CSV
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
