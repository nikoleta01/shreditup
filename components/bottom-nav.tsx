'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarDays, List, CalendarCheck, Compass } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLang } from '@/components/language-provider'

export function BottomNav() {
  const pathname = usePathname()
  const { t } = useLang()

  const links = [
    { href: '/program', label: t.program, icon: List },
    { href: '/timetable', label: t.timetable, icon: CalendarDays },
    { href: '/map', label: t.map, icon: Compass },
    { href: '/registration', label: t.myActivities, icon: CalendarCheck },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="border-t-2 border-foreground bg-nav pb-[env(safe-area-inset-bottom)]">
        <div className="flex h-16 items-center px-2">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                // flex-1 splits the bar into four equal columns. The old px-6
                // burned ~192px of a ~360px screen on padding alone, which is
                // what squeezed the longest label.
                'flex flex-1 min-w-0 flex-col items-center gap-1 px-2 py-1.5',
                // Every item stays at full ink — 4.98:1 on the olive ground.
                // Don't reintroduce opacity to dim the inactive ones: ink on
                // this olive is only 4.98:1 at full strength, so even a 10%
                // fade drops under AA, and a translucent currentColor makes
                // the icon's overlapping strokes stack into a marker-pen look.
                'text-nav-foreground'
              )}
              style={{ fontFamily: 'var(--font-barlow-condensed)' }}
            >
              <Icon
                className={cn('h-5 w-5 shrink-0', active && 'stroke-[2.5]')}
                aria-hidden
              />
              {/* Weights mirror DayTabs: 700 when active, 500 when not */}
              <span
                className="truncate text-xs"
                style={{ fontWeight: active ? 700 : 500 }}
              >
                {label}
              </span>
            </Link>
          )
        })}
        </div>
      </div>
    </nav>
  )
}
