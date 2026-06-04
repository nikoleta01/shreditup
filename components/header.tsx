'use client'

import { FESTIVAL_NAME } from '@/lib/data'
import { NotificationButton } from '@/components/notification-button'
import { useLang } from '@/components/language-provider'
import { ChainBorder } from '@/components/chain-border'

export function Header() {
  const { lang, t, setLang } = useLang()

  return (
    <header className="sticky top-0 z-40">
      <div className="flex h-14 items-center justify-between px-4" style={{ background: '#3D8DC5' }}>
        <span className="text-lg font-bold tracking-tight text-white">{FESTIVAL_NAME}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/70">{t.festivalDates}</span>
          <button
            onClick={() => setLang(lang === 'sk' ? 'en' : 'sk')}
            className="rounded px-1.5 py-0.5 text-xs font-medium text-white ring-1 ring-white/30 hover:bg-white/10"
            aria-label="Switch language"
          >
            {lang === 'sk' ? 'EN' : 'SK'}
          </button>
          <NotificationButton />
        </div>
      </div>
      <ChainBorder />
    </header>
  )
}
