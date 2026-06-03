'use client'

import { useState, useEffect } from 'react'
import { Bell, BellOff } from 'lucide-react'
import { Button } from '@/components/ui/button'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i)
  return outputArray
}

export function NotificationButton() {
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
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      disabled={loading}
      aria-label={subscribed ? 'Vypnúť notifikácie' : 'Zapnúť notifikácie'}
      className="h-9 w-9"
    >
      {subscribed ? (
        <Bell className="h-5 w-5 fill-current" />
      ) : (
        <BellOff className="h-5 w-5" />
      )}
    </Button>
  )
}
