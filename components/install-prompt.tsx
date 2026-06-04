'use client'

import { useState, useEffect } from 'react'
import { X, Share, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
    <div className="mx-4 mt-3 flex items-start gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
      <div className="flex-1 space-y-1">
        {state === 'android' ? (
          <>
            <p className="text-sm font-medium">{t.install.title}</p>
            <p className="text-xs text-muted-foreground">{t.install.desc}</p>
            <Button size="sm" className="mt-2 h-8 text-xs" onClick={installAndroid}>
              <Plus className="mr-1 h-3.5 w-3.5" />
              {t.install.button}
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm font-medium">{t.install.title}</p>
            <p className="text-xs text-muted-foreground">
              {t.install.iosHint}{' '}
              <Share className="inline h-3.5 w-3.5 align-text-bottom" />{' '}
              {t.install.iosThen}
            </p>
          </>
        )}
      </div>
      <button
        onClick={dismiss}
        className="shrink-0 rounded-full p-1 text-muted-foreground hover:text-foreground"
        aria-label={t.install.close}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
