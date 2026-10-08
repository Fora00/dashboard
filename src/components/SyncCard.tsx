import { useEffect, useRef, useState, type FormEvent } from 'react'
import { syncEnabled, requestLoginCode, verifyLoginCode, signOut } from '../lib/sync'
import type { CloudSync } from '../lib/cloudSync'
import { useSyncStatus } from '../lib/useSyncStatus'
import { clearPrivateData, privateDataSummary, type PrivateDataSummary } from '../lib/privateData'
import { useAuth } from '../lib/useAuth'
import { Button } from './Button'
import { Card } from './Card'

// Sign-in / sync status card. Email OTP flow: request a 6-digit code, then
// verify it. Only whitelisted emails can sign in (enforced server-side).
//
// Pass the project's sync engine (e.g. `import { sync } from '../../lib/todoSync'`)
// as `sync` to show live sync state on the signed-in card: pending-changes
// badge, last-synced time, and a visible error line when a push was rejected,
// with Retry (requeue the rejected changes) and Discard (drop them, take the
// server's version — confirmed first). Without the prop the card behaves
// exactly as before.
//
// Right after a sign-out from this card, if owner-only data (Life, Meal Diary,
// the owner's events) is still on the device, the signed-out card offers to
// remove it, warning first about changes that never reached the server. It is
// only ever an offer: nothing is removed without the user's explicit tap.

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
  const [deadBusy, setDeadBusy] = useState(false)
  // Set right after a sign-out that left private data on this device.
  const [privateOffer, setPrivateOffer] = useState<PrivateDataSummary | null>(null)
  const [privateBusy, setPrivateBusy] = useState(false)
  const [privateRemoved, setPrivateRemoved] = useState(false)
  const codeInput = useRef<HTMLInputElement>(null)

  // Move focus to the code field the moment the code step appears so iOS can
  // offer the one-time code from Mail without a manual tap.
  useEffect(() => {
    if (stage === 'code') codeInput.current?.focus()
  }, [stage])

  if (!syncEnabled) {
    return (
      <Card className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        ☁️ Cloud sync isn't configured in this build — the list lives on this device only.
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
            ☁️ Syncing as <span className="text-slate-800 dark:text-slate-200">{session.user.email}</span>
          </span>
          <Button variant="ghost" onClick={() => void handleSignOut()}>
            Sign out
          </Button>
        </Card>
      )
    }

    return (
      <Card className="mb-6 space-y-2 text-sm">
        <div className="flex items-center justify-between gap-3">
          <span className="min-w-0 truncate text-slate-500 dark:text-slate-400">
            ☁️ Syncing as <span className="text-slate-800 dark:text-slate-200">{session.user.email}</span>
          </span>
          <Button variant="ghost" onClick={() => void handleSignOut()}>
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
          {!status.syncing && status.lastSyncedAt && <span>Synced {relativeTime(status.lastSyncedAt)}</span>}
        </div>
        {status.lastError && (
          <div className="space-y-2">
            <p className="text-rose-600 dark:text-rose-400">⚠️ {status.lastError}</p>
            {status.dead > 0 && (
              <div className="flex flex-wrap gap-2">
                <Button variant="ghost" disabled={deadBusy} onClick={() => void retryDead(sync)}>
                  Retry
                </Button>
                <Button variant="danger" disabled={deadBusy} onClick={() => void discardDead(sync)}>
                  Discard
                </Button>
              </div>
            )}
          </div>
        )}
        {status.skipped > 0 && (
          <p className="text-xs text-slate-500">
            {status.skipped} unreadable row{status.skipped === 1 ? '' : 's'} from the server skipped
          </p>
        )}
      </Card>
    )
  }

  async function handleSignOut() {
    setPrivateRemoved(false)
    try {
      await signOut()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      return
    }
    // Best effort: if the count fails, simply don't offer.
    const summary = await privateDataSummary().catch(() => null)
    if (summary && summary.rows + summary.unsynced > 0) setPrivateOffer(summary)
  }

  async function removePrivateData(summary: PrivateDataSummary) {
    const lost =
      summary.unsynced > 0
        ? `\n\n${summary.unsynced} change${summary.unsynced === 1 ? ' was' : 's were'} never synced and will be lost for good.`
        : ''
    const ok = window.confirm(
      'Remove Life, Meal Diary and your events data from this device? The copy in the cloud is kept: ' +
        `sign in again to get it back.${lost}`,
    )
    if (!ok) return
    setPrivateBusy(true)
    setError(null)
    try {
      await clearPrivateData()
      setPrivateOffer(null)
      setPrivateRemoved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setPrivateBusy(false)
    }
  }

  async function retryDead(engine: CloudSync) {
    setDeadBusy(true)
    try {
      await engine.retryDead()
    } finally {
      setDeadBusy(false)
    }
  }

  async function discardDead(engine: CloudSync) {
    const n = status.dead
    const ok = window.confirm(
      `Discard ${n === 1 ? 'this rejected change' : `these ${n} rejected changes`}? ` +
        "This device will take the server's version instead. This can't be undone.",
    )
    if (!ok) return
    setDeadBusy(true)
    try {
      await engine.discardDead()
    } finally {
      setDeadBusy(false)
    }
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
      setPrivateOffer(null)
      setPrivateRemoved(false)
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
      {privateOffer && (
        <div className="space-y-2 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3">
          <p className="text-slate-700 dark:text-slate-200">
            Your private data (Life, Meal Diary, your events) is still on this device. Anyone using it can read it.
          </p>
          {privateOffer.unsynced > 0 && (
            <p className="text-rose-600 dark:text-rose-400">
              ⚠️ {privateOffer.unsynced} change{privateOffer.unsynced === 1 ? ' has' : 's have'} not reached the cloud
              yet. Removing deletes {privateOffer.unsynced === 1 ? 'it' : 'them'} for good: sign in again first to keep{' '}
              {privateOffer.unsynced === 1 ? 'it' : 'them'}.
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <Button variant="danger" disabled={privateBusy} onClick={() => void removePrivateData(privateOffer)}>
              Remove private data from this device
            </Button>
            <Button variant="ghost" disabled={privateBusy} onClick={() => setPrivateOffer(null)}>
              Keep it
            </Button>
          </div>
        </div>
      )}
      {privateRemoved && (
        <p className="text-slate-600 dark:text-slate-300">
          Private data removed from this device. The cloud copy is kept.
        </p>
      )}
      <p className="text-slate-500 dark:text-slate-400">☁️ Sign in to sync this list across devices and share it.</p>
      {stage === 'email' ? (
        <form onSubmit={sendCode} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            aria-label="Email"
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
            aria-label="6-digit code"
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
