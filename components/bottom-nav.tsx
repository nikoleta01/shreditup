'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarDays, List, ClipboardList } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLang } from '@/components/language-provider'
import { ChainBorder } from '@/components/chain-border'

export function BottomNav() {
  const pathname = usePathname()
  const { t } = useLang()

  const links = [
    { href: '/program', label: t.program, icon: List },
    { href: '/timetable', label: t.timetable, icon: CalendarDays },
    { href: '/registration', label: t.registration, icon: ClipboardList },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      {/* Wave border: background (orange) → card (blue) */}
      <ChainBorder flip />
      <div className="flex h-16 items-center justify-around bg-card px-4">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 rounded px-6 py-2 transition-colors',
                active
                  ? 'text-card-foreground'
                  : 'text-card-foreground/50 hover:text-card-foreground/80'
              )}
              style={{ fontFamily: 'var(--font-barlow-condensed)' }}
            >
              <Icon
                className={cn('h-5 w-5', active && 'stroke-[2.5]')}
                aria-hidden
              />
              <span className="text-xs font-semibold">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
