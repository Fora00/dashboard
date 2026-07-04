import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase, syncEnabled, requestLoginCode, verifyLoginCode } from '../../lib/sync'
import { useAuth } from '../../lib/useAuth'
import { syncNow } from '../../lib/shopSync'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { PageHeader } from '../../components/PageHeader'

// Landing page for an area invite link (…#/join/<token>). The token is the
// invitation: a new guest enters her email, gets whitelisted for this one
// area (redeem_invite RPC), then signs in with the emailed code. Someone
// already signed in just joins directly.

export function JoinArea() {
  const { token } = useParams()
  const navigate = useNavigate()
  const session = useAuth()
  const [areaName, setAreaName] = useState<string | null | undefined>(undefined)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [stage, setStage] = useState<'email' | 'code'>('email')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Look up which area this invite is for (works signed out).
  useEffect(() => {
    if (!supabase || !token) return
    void supabase.rpc('get_invite', { token }).then(({ data, error: err }) => {
      setAreaName(err ? null : ((data as string | null) ?? null))
    })
  }, [token])

  // Already signed in: join and go straight to the list.
  useEffect(() => {
    if (!supabase || !session || !areaName || !token) return
    void supabase
      .rpc('join_area', { token })
      .then(async ({ error: err }) => {
        if (err) {
          setError(err.message)
          return
        }
        await syncNow()
        navigate('/shop-list', { replace: true })
      })
  }, [session, areaName, token, navigate])

  async function redeem(e: FormEvent) {
    e.preventDefault()
    if (!supabase || !token) return
    setBusy(true)
    setError(null)
    try {
      const guest = email.trim().toLowerCase()
      const { error: err } = await supabase.rpc('redeem_invite', {
        token,
        guest_email: guest,
      })
      if (err) throw err
      await requestLoginCode(guest)
      setStage('code')
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  async function confirm(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await verifyLoginCode(email.trim().toLowerCase(), code)
      // The session effect above joins and navigates once auth lands.
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      setBusy(false)
    }
  }

  const header = <PageHeader emoji="🔗" title="Invitation" subtitle="" />

  if (!syncEnabled || !token) {
    return (
      <div>
        {header}
        <Card className="text-sm text-slate-500 dark:text-slate-400">This link can't be used right now.</Card>
      </div>
    )
  }

  if (areaName === undefined) return <div>{header}</div>

  if (areaName === null) {
    return (
      <div>
        {header}
        <Card className="text-sm text-slate-500 dark:text-slate-400">
          🚫 This invite link isn't valid (it may have been revoked).
        </Card>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        emoji="🔗"
        title={`Join “${areaName}”`}
        subtitle="You've been invited to a shared shopping list."
      />
      {session ? (
        <Card className="text-sm text-slate-500 dark:text-slate-400">Joining…</Card>
      ) : (
        <Card className="space-y-3 text-sm">
          {stage === 'email' ? (
            <>
              <p className="text-slate-500 dark:text-slate-400">
                Enter your email — we'll send you a 6-digit sign-in code.
              </p>
              <form onSubmit={redeem} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                />
                <Button type="submit" disabled={busy || !email.trim()}>
                  {busy ? '…' : 'Continue'}
                </Button>
              </form>
            </>
          ) : (
            <>
              <p className="text-slate-500 dark:text-slate-400">
                Check your inbox — enter the 6-digit code we sent to{' '}
                <span className="text-slate-800 dark:text-slate-200">{email.trim()}</span>.
              </p>
              <form onSubmit={confirm} className="flex gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="6-digit code"
                  autoComplete="one-time-code"
                  required
                  className="min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                />
                <Button type="submit" disabled={busy || code.trim().length < 6}>
                  {busy ? '…' : 'Join'}
                </Button>
              </form>
            </>
          )}
          {error && <p className="text-rose-600 dark:text-rose-400">{error}</p>}
        </Card>
      )}
    </div>
  )
}
