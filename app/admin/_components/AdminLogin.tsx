'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      router.refresh()
    } else {
      setError('Nesprávne heslo.')
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 pt-16">
      <h1
        className="mb-6 text-4xl leading-tight text-foreground"
        style={{ fontFamily: 'var(--font-alfa)' }}
      >
        Admin
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="Heslo"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border-2 border-foreground bg-background px-4 py-3 text-base text-foreground placeholder:text-foreground/40 focus:outline-none"
          style={{ fontFamily: 'var(--font-barlow-condensed)' }}
          autoFocus
        />
        {error && (
          <p
            className="text-sm font-bold text-red-500"
            style={{ fontFamily: 'var(--font-barlow-condensed)' }}
          >
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading || !password}
          className="w-full border-2 border-foreground bg-foreground py-3 text-sm font-bold text-background disabled:opacity-40"
          style={{ fontFamily: 'var(--font-barlow-condensed)' }}
        >
          {loading ? 'Prihlasujem...' : 'Prihlásiť'}
        </button>
      </form>
    </div>
  )
}
