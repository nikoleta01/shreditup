'use client'

import { useState } from 'react'

const FONT_HEAD = { fontFamily: 'var(--font-geoparody)' }
const FONT_BODY = { fontFamily: 'var(--font-barlow-condensed)' }

function recipientLabel(n: number) {
  if (n === 1) return '1 používateľovi'
  if (n >= 2 && n <= 4) return `${n} používateľom`
  return `${n} používateľom`
}

export function BroadcastForm({ subscriberCount }: { subscriberCount: number }) {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [confirming, setConfirming] = useState(false)
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ sent: number; failed: number } | null>(null)
  const [error, setError] = useState('')

  const canSend = title.trim().length > 0 && message.trim().length > 0

  async function handleSend() {
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message }),
      })
      if (!res.ok) {
        setError('Odoslanie zlyhalo.')
        return
      }
      const data = (await res.json()) as { sent: number; failed: number }
      setResult({ sent: data.sent, failed: data.failed })
      setTitle('')
      setMessage('')
    } catch {
      setError('Odoslanie zlyhalo.')
    } finally {
      setSending(false)
      setConfirming(false)
    }
  }

  return (
    <div className="mb-8 border-2 border-foreground bg-card p-4">
      <h2 className="mb-1 text-lg text-foreground" style={FONT_HEAD}>
        Push notifikácia
      </h2>
      <p className="mb-4 text-xs text-foreground/60" style={FONT_BODY}>
        Odoslať všetkým, ktorí majú zapnuté notifikácie ({subscriberCount})
      </p>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Nadpis"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            setConfirming(false)
            setResult(null)
          }}
          disabled={sending}
          className="w-full border-2 border-foreground bg-background px-4 py-3 text-base text-foreground placeholder:text-foreground/40 focus:outline-none disabled:opacity-50"
          style={FONT_BODY}
        />
        <textarea
          placeholder="Správa"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value)
            setConfirming(false)
            setResult(null)
          }}
          disabled={sending}
          rows={3}
          className="w-full resize-none border-2 border-foreground bg-background px-4 py-3 text-base text-foreground placeholder:text-foreground/40 focus:outline-none disabled:opacity-50"
          style={FONT_BODY}
        />

        {error && (
          <p className="text-sm font-bold text-red-500" style={FONT_BODY}>
            {error}
          </p>
        )}

        {result && (
          <p className="text-sm font-bold text-foreground" style={FONT_BODY}>
            Odoslané {recipientLabel(result.sent)}
            {result.failed > 0 ? ` · ${result.failed} zlyhalo` : ''}
          </p>
        )}

        {!confirming ? (
          <button
            type="button"
            onClick={() => {
              setResult(null)
              setError('')
              setConfirming(true)
            }}
            disabled={!canSend || sending}
            className="w-full border-2 border-foreground bg-foreground py-3 text-sm font-bold text-background disabled:opacity-40"
            style={FONT_BODY}
          >
            Odoslať notifikáciu
          </button>
        ) : (
          <div className="space-y-3 border-2 border-foreground bg-background p-3">
            <p className="text-sm font-bold text-foreground" style={FONT_BODY}>
              {subscriberCount === 0
                ? 'Nikto nemá zapnuté notifikácie.'
                : `Odoslať ${recipientLabel(subscriberCount)}?`}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                disabled={sending}
                className="flex-1 border-2 border-foreground py-3 text-sm font-bold text-foreground disabled:opacity-40"
                style={FONT_BODY}
              >
                Zrušiť
              </button>
              <button
                type="button"
                onClick={handleSend}
                disabled={sending || subscriberCount === 0}
                className="flex-1 border-2 border-foreground bg-foreground py-3 text-sm font-bold text-background disabled:opacity-40"
                style={FONT_BODY}
              >
                {sending ? 'Odosielam...' : 'Potvrdiť'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
