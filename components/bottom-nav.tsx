'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarDays, List } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/program', label: 'Program', icon: List },
  { href: '/timetable', label: 'Harmonogram', icon: CalendarDays },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-4">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 rounded-lg px-6 py-2 text-xs font-medium transition-colors',
                active
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon
                className={cn('h-5 w-5', active && 'stroke-[2.5]')}
                aria-hidden
              />
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
