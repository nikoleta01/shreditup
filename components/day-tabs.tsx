'use client'

import { useLang } from '@/components/language-provider'

interface DayTabsProps {
  activeDay: 1 | 2 | 3
  onChange: (day: 1 | 2 | 3) => void
}

export function DayTabs({ activeDay, onChange }: DayTabsProps) {
  const { t } = useLang()

  return (
    <div className="grid grid-cols-3 gap-1 border-2 border-foreground bg-card p-1">
      {([1, 2, 3] as const).map((day) => (
        <button
          key={day}
          onClick={() => onChange(day)}
          className="relative py-1.5 text-xs font-bold transition-all"
          style={{
            fontFamily: 'var(--font-barlow-condensed)',
            color: 'var(--card-foreground)',
            ...(activeDay === day
              ? {
                  backgroundColor: 'var(--secondary)',
                  transform: 'translate(-3px, -3px)',
                  zIndex: 1,
                }
              : { backgroundColor: 'transparent' }),
          }}
        >
          {t.days[day].short}
        </button>
      ))}
    </div>
  )
}
