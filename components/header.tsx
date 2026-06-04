'use client'

import { FESTIVAL_NAME } from '@/lib/data'
import { NotificationButton } from '@/components/notification-button'
import { useLang } from '@/components/language-provider'

export function Header() {
  const { lang, t, setLang } = useLang()

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <span className="text-lg font-bold tracking-tight">{FESTIVAL_NAME}</span>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">{t.festivalDates}</span>
        <button
          onClick={() => setLang(lang === 'sk' ? 'en' : 'sk')}
          className="rounded px-1.5 py-0.5 text-xs font-medium text-muted-foreground ring-1 ring-border hover:text-foreground"
          aria-label="Switch language"
        >
          {lang === 'sk' ? 'EN' : 'SK'}
        </button>
        <NotificationButton />
      </div>
    </header>
  )
}
