'use client'

import { useState, useEffect } from 'react'
import { X, Share, Plus } from 'lucide-react'
import { useLang } from '@/components/language-provider'

type InstallState = 'hidden' | 'android' | 'ios'

export function InstallPrompt() {
  const { t } = useLang()
  const [state, setState] = useState<InstallState>('hidden')
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) return
    if (sessionStorage.getItem('install-dismissed')) return

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    if (isIOS) { setState('ios'); return }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setState('android')
    }
    window.addEventListener('beforeinstallprompt', handler as EventListener)
    return () => window.removeEventListener('beforeinstallprompt', handler as EventListener)
  }, [])

  function dismiss() {
    sessionStorage.setItem('install-dismissed', '1')
    setState('hidden')
  }

  async function installAndroid() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setState('hidden')
    setDeferredPrompt(null)
  }

  if (state === 'hidden') return null

  return (
    <div className="mx-4 mt-3 flex items-start gap-3 border-2 border-foreground bg-card p-3">
      <div className="flex-1 space-y-1.5">
        <p
          className="text-sm font-bold text-card-foreground"
          style={{ fontFamily: 'var(--font-barlow-condensed)' }}
        >
          {t.install.title}
        </p>

        {state === 'android' ? (
          <>
            <p className="text-xs text-card-foreground/70">{t.install.desc}</p>
            <button
              onClick={installAndroid}
              className="mt-1 flex items-center gap-1.5 rounded-sm border-2 border-card-foreground bg-card-foreground px-3 py-1.5 text-xs font-bold text-card transition-opacity hover:opacity-80"
              style={{ fontFamily: 'var(--font-barlow-condensed)' }}
            >
              <Plus className="h-3.5 w-3.5" aria-hidden />
              {t.install.button}
            </button>
          </>
        ) : (
          <p className="text-xs text-card-foreground/70">
            {t.install.iosHint}{' '}
            <Share className="inline h-3.5 w-3.5 align-text-bottom" aria-hidden />{' '}
            {t.install.iosThen}
          </p>
        )}
      </div>

      <button
        onClick={dismiss}
        className="shrink-0 rounded p-1 text-card-foreground/60 hover:text-card-foreground"
        aria-label={t.install.close}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
