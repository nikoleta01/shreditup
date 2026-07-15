'use client'

import { useState, useEffect } from 'react'
import { Bell, BellOff } from 'lucide-react'
import { useLang } from '@/components/language-provider'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i)
  return outputArray
}

export function NotificationButton() {
  const { t } = useLang()
  const [supported, setSupported] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [hinted, setHinted] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setSupported(true)
      setHinted(!!localStorage.getItem('notif-hinted'))
      navigator.serviceWorker
        .register('/sw.js', { scope: '/', updateViaCache: 'none' })
        .then((reg) => reg.pushManager.getSubscription())
        .then((sub) => setSubscribed(!!sub))
    }
  }, [])

  async function toggle() {
    setErr(null)
    if (!hinted) {
      localStorage.setItem('notif-hinted', '1')
      setHinted(true)
    }
    const next = !subscribed
    setSubscribed(next)
    try {
      const reg = await navigator.serviceWorker.ready
      if (!next) {
        const sub = await reg.pushManager.getSubscription()
        await sub?.unsubscribe()
        const res = await fetch('/api/push/unsubscribe', {
          method: 'POST',
          body: JSON.stringify({ endpoint: sub?.endpoint }),
          headers: { 'Content-Type': 'application/json' },
        })
        if (!res.ok) throw new Error(`unsubscribe failed (HTTP ${res.status})`)
      } else {
        const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        if (!key) throw new Error('VAPID public key missing from this build')
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(key),
        })
        const res = await fetch('/api/push/subscribe', {
          method: 'POST',
          body: JSON.stringify(JSON.parse(JSON.stringify(sub))),
          headers: { 'Content-Type': 'application/json' },
        })
        if (!res.ok) throw new Error(`save failed (HTTP ${res.status})`)
      }
    } catch (e) {
      // Revert the optimistic toggle and surface the reason. On an installed
      // iOS PWA there's no devtools, so a visible message is the only way to
      // see why subscribing failed (permission denied, missing key, 500, …).
      setSubscribed(!next)
      setErr(e instanceof Error ? e.message : String(e))
    }
  }

  if (!supported) return null

  const pulsing = !subscribed && !hinted

  return (
    <span className="relative inline-flex">
      <button
        onClick={toggle}
        aria-label={subscribed ? t.notifications.disable : t.notifications.enable}
        className="inline-flex h-7 w-7 items-center justify-center rounded border-2 border-foreground bg-foreground text-background transition-colors hover:bg-transparent hover:text-foreground"
      >
        {subscribed ? (
          <Bell className="h-[14px] w-[14px] fill-current" aria-hidden />
        ) : (
          <BellOff
            className={`h-[14px] w-[14px] ${pulsing ? 'animate-bell-ring' : ''}`}
            aria-hidden
          />
        )}
      </button>
      {err && (
        <span
          role="alert"
          onClick={() => setErr(null)}
          className="absolute right-0 top-full z-50 mt-1 max-w-[70vw] cursor-pointer whitespace-normal rounded bg-red-600 px-2 py-1 text-[10px] leading-tight text-white shadow-lg"
        >
          {err}
        </span>
      )}
    </span>
  )
}
