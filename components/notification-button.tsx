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
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setSupported(true)
      navigator.serviceWorker
        .register('/sw.js', { scope: '/', updateViaCache: 'none' })
        .then((reg) => reg.pushManager.getSubscription())
        .then((sub) => setSubscribed(!!sub))
    }
  }, [])

  async function toggle() {
    setLoading(true)
    try {
      const reg = await navigator.serviceWorker.ready
      if (subscribed) {
        const sub = await reg.pushManager.getSubscription()
        await sub?.unsubscribe()
        await fetch('/api/push/unsubscribe', {
          method: 'POST',
          body: JSON.stringify({ endpoint: sub?.endpoint }),
          headers: { 'Content-Type': 'application/json' },
        })
        setSubscribed(false)
      } else {
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
          ),
        })
        await fetch('/api/push/subscribe', {
          method: 'POST',
          body: JSON.stringify(JSON.parse(JSON.stringify(sub))),
          headers: { 'Content-Type': 'application/json' },
        })
        setSubscribed(true)
      }
    } finally {
      setLoading(false)
    }
  }

  if (!supported) return null

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label={subscribed ? t.notifications.disable : t.notifications.enable}
      className={`flex items-center justify-center rounded border-2 px-1.5 py-0.5 transition-colors disabled:opacity-50 ${
        subscribed
          ? 'border-card-foreground bg-card-foreground text-card'
          : 'border-card-foreground/40 bg-transparent text-card-foreground hover:border-card-foreground hover:bg-card-foreground hover:text-card'
      }`}
    >
      {subscribed ? (
        <Bell className="h-4 w-4 fill-current" aria-hidden />
      ) : (
        <BellOff className="h-4 w-4" aria-hidden />
      )}
    </button>
  )
}
