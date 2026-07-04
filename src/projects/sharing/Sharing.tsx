import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { supabase, syncEnabled } from '../../lib/sync'
import { useAuth } from '../../lib/useAuth'
import { useOwner } from '../../lib/useOwner'
import { projects } from '../../lib/projects'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { PageHeader } from '../../components/PageHeader'
import { EmptyState } from '../../components/EmptyState'
import { SyncCard } from '../../components/SyncCard'

// Owner-only guest management: whitelist an email and pick which projects it
// can use. Guests then just open the app and sign in with their email — the
// code email is sent automatically. All writes go through RLS policies that
// only allow the owner, so this page is a convenience, not a security gate.

const APP_URL = 'https://fora00.github.io/dashboard/'
const shareable = projects.filter((p) => !p.ownerOnly)

interface Guest {
  email: string
  memberships: string[]
}

export function Sharing() {
  const session = useAuth()
  const owner = useOwner()
  const [guests, setGuests] = useState<Guest[] | null>(null)
  const [email, setEmail] = useState('')
  const [selected, setSelected] = useState<string[]>(['shop-list'])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!supabase) return
    const [allowed, members] = await Promise.all([
      supabase.from('allowed_emails').select('email').eq('role', 'guest'),
      supabase.from('project_members').select('project_id, email'),
    ])
    if (allowed.error || members.error) {
      setError((allowed.error ?? members.error)!.message)
      return
    }
    const byEmail = new Map<string, string[]>()
    for (const g of allowed.data) byEmail.set(g.email, [])
    for (const m of members.data) byEmail.get(m.email)?.push(m.project_id)
    setGuests([...byEmail.entries()].map(([e, p]) => ({ email: e, memberships: p })))
  }, [])

  useEffect(() => {
    if (owner) void load()
  }, [owner, load])

  async function run(action: () => Promise<void>) {
    if (!supabase) return
    setBusy(true)
    setError(null)
    try {
      await action()
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  async function invite(e: FormEvent) {
    e.preventDefault()
    const guest = email.trim().toLowerCase()
    if (!guest) return
    await run(async () => {
      const { error: e1 } = await supabase!
        .from('allowed_emails')
        .upsert({ email: guest, role: 'guest' }, { onConflict: 'email', ignoreDuplicates: true })
      if (e1) throw e1
      if (selected.length > 0) {
        const rows = selected.map((project_id) => ({ project_id, email: guest }))
        const { error: e2 } = await supabase!
          .from('project_members')
          .upsert(rows, { onConflict: 'project_id,email', ignoreDuplicates: true })
        if (e2) throw e2
      }
      setEmail('')
    })
  }

  async function toggleMembership(guest: Guest, projectId: string) {
    await run(async () => {
      const has = guest.memberships.includes(projectId)
      const q = has
        ? supabase!
            .from('project_members')
            .delete()
            .eq('project_id', projectId)
            .eq('email', guest.email)
        : supabase!.from('project_members').insert({ project_id: projectId, email: guest.email })
      const { error: err } = await q
      if (err) throw err
    })
  }

  async function removeGuest(guest: Guest) {
    await run(async () => {
      const { error: e1 } = await supabase!
        .from('project_members')
        .delete()
        .eq('email', guest.email)
      if (e1) throw e1
      const { error: e2 } = await supabase!
        .from('allowed_emails')
        .delete()
        .eq('email', guest.email)
      if (e2) throw e2
    })
  }

  async function shareAppLink() {
    const text = `You're invited to my dashboard — open it and sign in with your email: ${APP_URL}`
    if (navigator.share) {
      await navigator.share({ text }).catch(() => {})
    } else {
      await navigator.clipboard.writeText(text)
    }
  }

  const header = (
    <PageHeader
      emoji="👥"
      title="Sharing"
      subtitle="Invite guests by email and choose which projects they can use."
    />
  )

  if (!syncEnabled) {
    return (
      <div>
        {header}
        <Card className="text-sm text-slate-400">
          ☁️ Cloud sync isn't configured in this build, so there's nothing to share.
        </Card>
      </div>
    )
  }

  if (!session) {
    return (
      <div>
        {header}
        <SyncCard />
      </div>
    )
  }

  if (owner === false) {
    return (
      <div>
        {header}
        <Card className="text-sm text-slate-400">
          🔒 Only the dashboard owner can manage sharing.
        </Card>
      </div>
    )
  }

  if (owner === undefined) return <div>{header}</div>

  return (
    <div>
      {header}

      <form onSubmit={invite} className="mb-6 space-y-3">
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="guest@example.com"
            autoComplete="off"
            required
            className="min-h-10 w-full rounded-lg border border-slate-700 bg-slate-800 px-3.5 text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
          />
          <Button type="submit" disabled={busy || !email.trim() || selected.length === 0}>
            Invite
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {shareable.map((p) => {
            const on = selected.includes(p.id)
            return (
              <button
                key={p.id}
                type="button"
                onClick={() =>
                  setSelected((s) => (on ? s.filter((id) => id !== p.id) : [...s, p.id]))
                }
                className={`min-h-10 rounded-full border px-3.5 text-sm transition-colors ${
                  on
                    ? 'border-indigo-400 bg-indigo-500/20 text-indigo-300'
                    : 'border-slate-700 text-slate-400'
                }`}
              >
                {p.emoji} {p.name}
              </button>
            )
          })}
        </div>
      </form>

      {error && <p className="mb-4 text-sm text-rose-400">{error}</p>}

      {guests === null ? null : guests.length === 0 ? (
        <EmptyState
          emoji="🫥"
          title="No guests yet"
          hint="Invite someone above, then send them the app link — they sign in with their email and a code."
        />
      ) : (
        <ul className="space-y-3">
          {guests.map((g) => (
            <li key={g.email}>
              <Card className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="min-w-0 truncate text-sm">{g.email}</span>
                  <Button variant="danger" disabled={busy} onClick={() => void removeGuest(g)}>
                    Remove
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {shareable.map((p) => {
                    const on = g.memberships.includes(p.id)
                    return (
                      <button
                        key={p.id}
                        type="button"
                        disabled={busy}
                        onClick={() => void toggleMembership(g, p.id)}
                        className={`min-h-10 rounded-full border px-3.5 text-sm transition-colors ${
                          on
                            ? 'border-emerald-400 bg-emerald-500/15 text-emerald-300'
                            : 'border-slate-700 text-slate-500'
                        }`}
                      >
                        {p.emoji} {p.name} {on ? '✓' : ''}
                      </button>
                    )
                  })}
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <Card className="mt-6 flex items-center justify-between gap-3 text-sm text-slate-400">
        <span>Send guests the app link — they sign in with their email.</span>
        <Button variant="ghost" onClick={() => void shareAppLink()}>
          Share link
        </Button>
      </Card>
    </div>
  )
}
