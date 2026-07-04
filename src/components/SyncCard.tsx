import { useEffect, useRef, useState, type FormEvent } from 'react'
import { syncEnabled, requestLoginCode, verifyLoginCode, signOut } from '../lib/sync'
import type { CloudSync } from '../lib/cloudSync'
import { useSyncStatus } from '../lib/useSyncStatus'
import { useAuth } from '../lib/useAuth'
import { Button } from './Button'
import { Card } from './Card'

// Sign-in / sync status card. Email OTP flow: request a 6-digit code, then
// verify it. Only whitelisted emails can sign in (enforced server-side).
//
// Pass the project's sync engine (e.g. `import { sync } from '../../lib/todoSync'`)
// as `sync` to show live sync state on the signed-in card: pending-changes
// badge, last-synced time, and a visible error line when a push was rejected.
// Without the prop the card behaves exactly as before.

interface SyncCardProps {
  sync?: CloudSync
}

/** "3m ago"-style relative time for the last successful sync. */
function relativeTime(ts: number): string {
  const s = Math.max(0, Math.round((Date.now() - ts) / 1000))
  if (s < 5) return 'just now'
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export function SyncCard({ sync }: SyncCardProps) {
  const session = useAuth()
  const status = useSyncStatus(sync)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [stage, setStage] = useState<'email' | 'code'>('email')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const codeInput = useRef<HTMLInputElement>(null)

  // Move focus to the code field the moment the code step appears so iOS can
  // offer the one-time code from Mail without a manual tap.
  useEffect(() => {
    if (stage === 'code') codeInput.current?.focus()
  }, [stage])

  if (!syncEnabled) {
    return (
      <Card className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        ☁️ Cloud sync isn't configured in this build — the list lives on this
        device only.
      </Card>
    )
  }

  if (session === undefined) return null

  if (session) {
    // Without a sync engine: original single-row card, unchanged.
    if (!sync) {
      return (
        <Card className="mb-6 flex items-center justify-between gap-3 text-sm">
          <span className="min-w-0 truncate text-slate-500 dark:text-slate-400">
            ☁️ Syncing as{' '}
            <span className="text-slate-800 dark:text-slate-200">{session.user.email}</span>
          </span>
          <Button variant="ghost" onClick={() => void signOut()}>
            Sign out
          </Button>
        </Card>
      )
    }

    return (
      <Card className="mb-6 space-y-2 text-sm">
        <div className="flex items-center justify-between gap-3">
          <span className="min-w-0 truncate text-slate-500 dark:text-slate-400">
            ☁️ Syncing as{' '}
            <span className="text-slate-800 dark:text-slate-200">{session.user.email}</span>
          </span>
          <Button variant="ghost" onClick={() => void signOut()}>
            Sign out
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          {status.pending > 0 && (
            <span className="rounded-full bg-amber-500/15 px-2 py-0.5 font-medium text-amber-700 dark:text-amber-300">
              {status.pending} pending
            </span>
          )}
          {status.syncing && <span>Syncing…</span>}
          {!status.syncing && status.lastSyncedAt && (
            <span>Synced {relativeTime(status.lastSyncedAt)}</span>
          )}
        </div>
        {status.lastError && <p className="text-rose-600 dark:text-rose-400">⚠️ {status.lastError}</p>}
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
      <p className="text-slate-500 dark:text-slate-400">
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
            autoFocus
            required
            className="min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
          />
          <Button type="submit" disabled={busy || !email.trim()}>
            {busy ? '…' : 'Send code'}
          </Button>
        </form>
      ) : (
        <form onSubmit={confirmCode} className="flex gap-2">
          <input
            ref={codeInput}
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            value={code}
            // Strip spaces/non-digits so a pasted "123 456" (iOS Mail) works.
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="6-digit code from your email"
            autoComplete="one-time-code"
            required
            className="min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
          />
          <Button type="submit" disabled={busy || code.length < 6}>
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
      {error && <p className="text-rose-600 dark:text-rose-400">{error}</p>}
    </Card>
  )
}
