import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase, syncEnabled, requestLoginCode, verifyLoginCode } from '../../lib/sync'
import { useAuth } from '../../lib/useAuth'
import { projects } from '../../lib/projects'
import { syncProjectAfterJoin } from '../../lib/projectInvites'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { InstallHint } from '../../components/InstallHint'
import { PageHeader } from '../../components/PageHeader'

// Landing page for a per-project invite link (…#/join/p/<token>), the
// project-level twin of shop-list/JoinArea.tsx. The link IS the invitation:
// a new guest enters her email, gets whitelisted for THIS project only
// (redeem_project_invite RPC → a project_members row), signs in with the
// emailed code, and lands on the project. Someone already signed in joins
// directly (join_project). Everything else in the app keeps working signed
// out; this page is the only one that needs the network.

type Lookup =
  | { state: 'loading' }
  | { state: 'ok'; projectId: string }
  | { state: 'invalid' }
  | { state: 'error'; message: string }

const inputClass =
  'min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-base placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none sm:text-sm dark:border-slate-700 dark:bg-slate-800'

function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  if (err && typeof err === 'object' && 'message' in err) return String(err.message)
  return String(err)
}

// supabase-js reports fetch failures as a plain "TypeError: Failed to fetch"
// (or "Load failed" on Safari) — make that readable.
function friendly(message: string): string {
  if (/failed to fetch|load failed|network/i.test(message)) {
    return "Couldn't reach the server. Check your connection and try again."
  }
  return message
}

export function JoinProject() {
  const { token } = useParams()
  const navigate = useNavigate()
  const session = useAuth()
  const [lookup, setLookup] = useState<Lookup>({ state: 'loading' })
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [stage, setStage] = useState<'email' | 'code'>('email')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)
  const joining = useRef(false)

  const projectId = lookup.state === 'ok' ? lookup.projectId : null
  const project = projectId ? projects.find((p) => p.id === projectId) : undefined

  // Which project is this invite for? Works signed out (anon RPC). A network
  // failure is kept distinct from a dead link so the guest can retry.
  const load = useCallback(async () => {
    if (!supabase || !token) return
    setLookup({ state: 'loading' })
    try {
      const { data, error: err } = await supabase.rpc('get_project_invite', { token })
      if (err) {
        // A malformed token is a dead link, not an outage (22P02 = bad uuid).
        if (err.code === '22P02') setLookup({ state: 'invalid' })
        else setLookup({ state: 'error', message: friendly(err.message) })
        return
      }
      setLookup(data ? { state: 'ok', projectId: data } : { state: 'invalid' })
    } catch (err) {
      setLookup({ state: 'error', message: friendly(errorMessage(err)) })
    }
  }, [token])

  useEffect(() => {
    void load()
  }, [load])

  // Signed in (already, or once the code is verified): join, kick that
  // project's sync, and land on it with the install hint.
  useEffect(() => {
    if (!supabase || !session || !projectId || !token || joining.current) return
    joining.current = true
    void supabase.rpc('join_project', { token }).then(({ error: err }) => {
      if (err) {
        joining.current = false
        setBusy(false)
        setError(friendly(err.message))
        return
      }
      syncProjectAfterJoin(projectId)
      const path = projects.find((p) => p.id === projectId)?.path ?? '/'
      void navigate(path, { replace: true, state: { joined: true } })
    })
  }, [session, projectId, token, navigate, attempt])

  async function redeem(e: FormEvent) {
    e.preventDefault()
    if (!supabase || !token) return
    setBusy(true)
    setError(null)
    try {
      const guest = email.trim().toLowerCase()
      const { error: err } = await supabase.rpc('redeem_project_invite', {
        token,
        guest_email: guest,
      })
      if (err) throw err
      await requestLoginCode(guest)
      setStage('code')
    } catch (err) {
      setError(friendly(errorMessage(err)))
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
      setError(friendly(errorMessage(err)))
      setBusy(false)
    }
  }

  const header = <PageHeader emoji="🔗" title="Invitation" />

  if (!syncEnabled || !token) {
    return (
      <div>
        {header}
        <Card className="text-sm text-slate-500 dark:text-slate-400">
          This link can't be used right now.
        </Card>
      </div>
    )
  }

  if (lookup.state === 'loading') {
    return (
      <div>
        {header}
        <Card className="text-sm text-slate-500 dark:text-slate-400">Checking your invitation…</Card>
      </div>
    )
  }

  if (lookup.state === 'error') {
    return (
      <div>
        {header}
        <Card className="space-y-3 text-sm">
          <p className="text-slate-500 dark:text-slate-400">📡 {lookup.message}</p>
          <Button variant="ghost" onClick={() => void load()}>
            Try again
          </Button>
        </Card>
      </div>
    )
  }

  if (lookup.state === 'invalid') {
    return (
      <div>
        {header}
        <Card className="text-sm text-slate-500 dark:text-slate-400">
          🚫 This invite link isn't valid (it may have been reset). Ask for a new one.
        </Card>
      </div>
    )
  }

  const name = project?.name ?? 'a shared project'

  return (
    <div>
      <PageHeader
        emoji={project?.emoji ?? '🔗'}
        title={`Join ${name}`}
        subtitle="You've been invited to a shared project on Francesco's dashboard."
      />
      <InstallHint />
      {session ? (
        <Card className="space-y-3 text-sm">
          {error ? (
            <>
              <p className="text-rose-600 dark:text-rose-400">{error}</p>
              <Button
                variant="ghost"
                onClick={() => {
                  setError(null)
                  setAttempt((n) => n + 1)
                }}
              >
                Try again
              </Button>
            </>
          ) : (
            <p className="text-slate-500 dark:text-slate-400">Joining…</p>
          )}
        </Card>
      ) : (
        <Card className="space-y-3 text-sm">
          {project?.description && (
            <p className="text-slate-600 dark:text-slate-300">{project.description}</p>
          )}
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
                  aria-label="Email"
                  required
                  className={inputClass}
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
                  aria-label="Sign-in code"
                  required
                  className={inputClass}
                />
                <Button type="submit" disabled={busy || code.trim().length < 6}>
                  {busy ? '…' : 'Join'}
                </Button>
              </form>
              <button
                type="button"
                onClick={() => {
                  setStage('email')
                  setCode('')
                  setError(null)
                }}
                className="min-h-10 text-slate-500 underline-offset-2 hover:underline dark:text-slate-400"
              >
                Use a different email
              </button>
            </>
          )}
          {error && <p className="text-rose-600 dark:text-rose-400">{error}</p>}
        </Card>
      )}
    </div>
  )
}
