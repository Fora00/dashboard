import { useState, type FormEvent } from 'react'
import { syncEnabled, requestLoginCode, verifyLoginCode, signOut } from '../lib/sync'
import { useAuth } from '../lib/useAuth'
import { Button } from './Button'
import { Card } from './Card'

// Sign-in / sync status card. Email OTP flow: request a 6-digit code, then
// verify it. Only whitelisted emails can sign in (enforced server-side).

export function SyncCard() {
  const session = useAuth()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [stage, setStage] = useState<'email' | 'code'>('email')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!syncEnabled) {
    return (
      <Card className="mb-6 text-sm text-slate-400">
        ☁️ Cloud sync isn't configured in this build — the list lives on this
        device only.
      </Card>
    )
  }

  if (session === undefined) return null

  if (session) {
    return (
      <Card className="mb-6 flex items-center justify-between gap-3 text-sm">
        <span className="min-w-0 truncate text-slate-400">
          ☁️ Syncing as{' '}
          <span className="text-slate-200">{session.user.email}</span>
        </span>
        <Button variant="ghost" onClick={() => void signOut()}>
          Sign out
        </Button>
      </Card>
    )
  }

  async function sendCode(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await requestLoginCode(email.trim())
      setStage('code')
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  async function confirmCode(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await verifyLoginCode(email.trim(), code)
      setStage('email')
      setCode('')
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card className="mb-6 space-y-3 text-sm">
      <p className="text-slate-400">
        ☁️ Sign in to sync this list across devices and share it.
      </p>
      {stage === 'email' ? (
        <form onSubmit={sendCode} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
            className="min-h-10 w-full rounded-lg border border-slate-700 bg-slate-800 px-3.5 text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
          />
          <Button type="submit" disabled={busy || !email.trim()}>
            {busy ? '…' : 'Send code'}
          </Button>
        </form>
      ) : (
        <form onSubmit={confirmCode} className="flex gap-2">
          <input
            type="text"
            inputMode="numeric"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="6-digit code from your email"
            autoComplete="one-time-code"
            required
            className="min-h-10 w-full rounded-lg border border-slate-700 bg-slate-800 px-3.5 text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
          />
          <Button type="submit" disabled={busy || code.trim().length < 6}>
            {busy ? '…' : 'Sign in'}
          </Button>
        </form>
      )}
      {stage === 'code' && (
        <button
          type="button"
          onClick={() => {
            setStage('email')
            setError(null)
          }}
          className="text-xs text-slate-500 underline"
        >
          Use a different email
        </button>
      )}
      {error && <p className="text-rose-400">{error}</p>}
    </Card>
  )
}
