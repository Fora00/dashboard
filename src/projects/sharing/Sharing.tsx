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
//
// Shop List is special: since the areas migration, `shop_items` access is
// gated by `shop_area_members` (via can_access_area), NOT by project_members.
// So granting shop-list access here means granting AREA membership — a
// project_members row alone would leave the guest unable to see/add/complete
// items. We default-grant the "Groceries" area and expose per-area toggles.

const APP_URL = 'https://fora00.github.io/dashboard/'
// The fixed-id default area created by the shop_areas migration (matches the
// id the client uses when migrating pre-area local data).
const DEFAULT_AREA_ID = '00000000-0000-0000-0000-000000000001'
// Generic project chips (project_members). Shop List is handled separately via
// area membership below.
const shareable = projects.filter((p) => !p.ownerOnly && p.id !== 'shop-list')

interface Area {
  id: string
  name: string
}

interface Guest {
  email: string
  // Generic project_members rows (excludes the vestigial shop-list one, which
  // we keep in sync with area membership but drive UI off `areas`).
  memberships: string[]
  // shop_area_members the guest belongs to (area ids).
  areas: string[]
}

export function Sharing() {
  const session = useAuth()
  const owner = useOwner()
  const [guests, setGuests] = useState<Guest[] | null>(null)
  const [areas, setAreas] = useState<Area[]>([])
  const [email, setEmail] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [shopOn, setShopOn] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!supabase) return
    const [allowed, members, areaRows, areaMembers] = await Promise.all([
      supabase.from('allowed_emails').select('email').eq('role', 'guest'),
      supabase.from('project_members').select('project_id, email'),
      supabase.from('shop_areas').select('id, name, created_at').order('created_at'),
      supabase.from('shop_area_members').select('area_id, email'),
    ])
    if (allowed.error || members.error || areaRows.error || areaMembers.error) {
      setError((allowed.error ?? members.error ?? areaRows.error ?? areaMembers.error)!.message)
      return
    }
    setAreas(areaRows.data.map((a) => ({ id: a.id as string, name: a.name as string })))
    const proj = new Map<string, string[]>()
    const area = new Map<string, string[]>()
    for (const g of allowed.data) {
      proj.set(g.email, [])
      area.set(g.email, [])
    }
    for (const m of members.data) proj.get(m.email)?.push(m.project_id)
    for (const m of areaMembers.data) area.get(m.email)?.push(m.area_id)
    setGuests(
      [...proj.entries()].map(([e, p]) => ({
        email: e,
        memberships: p,
        areas: area.get(e) ?? [],
      })),
    )
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

  // Grant a guest access to one shop area, and keep the (vestigial but tidy)
  // project_members['shop-list'] row present so is_member('shop-list') is true.
  async function grantArea(guest: string, areaId: string) {
    const { error: e1 } = await supabase!
      .from('shop_area_members')
      .upsert({ area_id: areaId, email: guest }, { onConflict: 'area_id,email', ignoreDuplicates: true })
    if (e1) throw e1
    const { error: e2 } = await supabase!
      .from('project_members')
      .upsert({ project_id: 'shop-list', email: guest }, { onConflict: 'project_id,email', ignoreDuplicates: true })
    if (e2) throw e2
  }

  // Remove ALL shop access for a guest: every area membership plus the
  // project_members row. This is what "disable shop-list" must do, otherwise
  // area RLS would still let the guest in.
  async function revokeAllShop(guest: string) {
    const { error: e1 } = await supabase!.from('shop_area_members').delete().eq('email', guest)
    if (e1) throw e1
    const { error: e2 } = await supabase!
      .from('project_members')
      .delete()
      .eq('project_id', 'shop-list')
      .eq('email', guest)
    if (e2) throw e2
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
      // Shop List access = area membership (default-grant Groceries).
      if (shopOn) await grantArea(guest, DEFAULT_AREA_ID)
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

  // Master Shop List toggle: on = grant default area, off = revoke everything.
  async function toggleShop(guest: Guest, on: boolean) {
    await run(async () => {
      if (on) await revokeAllShop(guest.email)
      else {
        const fallback = areas.find((a) => a.id === DEFAULT_AREA_ID) ?? areas[0]
        if (!fallback) throw new Error('No shop areas exist yet — create one in the Shop List first.')
        await grantArea(guest.email, fallback.id)
      }
    })
  }

  async function toggleArea(guest: Guest, areaId: string) {
    await run(async () => {
      const has = guest.areas.includes(areaId)
      if (has) {
        const { error: err } = await supabase!
          .from('shop_area_members')
          .delete()
          .eq('area_id', areaId)
          .eq('email', guest.email)
        if (err) throw err
        // Last area removed → drop the project_members['shop-list'] row too.
        if (guest.areas.length === 1) {
          const { error: e2 } = await supabase!
            .from('project_members')
            .delete()
            .eq('project_id', 'shop-list')
            .eq('email', guest.email)
          if (e2) throw e2
        }
      } else {
        await grantArea(guest.email, areaId)
      }
    })
  }

  async function removeGuest(guest: Guest) {
    await run(async () => {
      const { error: e0 } = await supabase!
        .from('shop_area_members')
        .delete()
        .eq('email', guest.email)
      if (e0) throw e0
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
      subtitle="Guests and their project access. Shop List access grants a shopping area so guests can actually see and edit items."
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

  const chip = (on: boolean, accent: 'indigo' | 'emerald') =>
    `min-h-10 rounded-full border px-3.5 text-sm transition-colors ${
      on
        ? accent === 'indigo'
          ? 'border-indigo-400 bg-indigo-500/20 text-indigo-300'
          : 'border-emerald-400 bg-emerald-500/15 text-emerald-300'
        : 'border-slate-700 text-slate-500'
    }`

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
          <Button type="submit" disabled={busy || !email.trim() || (selected.length === 0 && !shopOn)}>
            Invite
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShopOn((s) => !s)}
            className={chip(shopOn, 'indigo')}
          >
            🛒 Shop List
          </button>
          {shareable.map((p) => {
            const on = selected.includes(p.id)
            return (
              <button
                key={p.id}
                type="button"
                onClick={() =>
                  setSelected((s) => (on ? s.filter((id) => id !== p.id) : [...s, p.id]))
                }
                className={chip(on, 'indigo')}
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
          {guests.map((g) => {
            const shopEnabled = g.areas.length > 0 || g.memberships.includes('shop-list')
            return (
              <li key={g.email}>
                <Card className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="min-w-0 truncate text-sm">{g.email}</span>
                    <Button variant="danger" disabled={busy} onClick={() => void removeGuest(g)}>
                      Remove
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void toggleShop(g, shopEnabled)}
                      className={chip(shopEnabled, 'emerald')}
                    >
                      🛒 Shop List {shopEnabled ? '✓' : ''}
                    </button>
                    {shareable.map((p) => {
                      const on = g.memberships.includes(p.id)
                      return (
                        <button
                          key={p.id}
                          type="button"
                          disabled={busy}
                          onClick={() => void toggleMembership(g, p.id)}
                          className={chip(on, 'emerald')}
                        >
                          {p.emoji} {p.name} {on ? '✓' : ''}
                        </button>
                      )
                    })}
                  </div>
                  {shopEnabled && areas.length > 0 && (
                    <div className="space-y-2 border-t border-slate-800 pt-3">
                      <p className="text-xs text-slate-500">Shop areas this guest can use</p>
                      <div className="flex flex-wrap gap-2">
                        {areas.map((a) => {
                          const on = g.areas.includes(a.id)
                          return (
                            <button
                              key={a.id}
                              type="button"
                              disabled={busy}
                              onClick={() => void toggleArea(g, a.id)}
                              className={chip(on, 'emerald')}
                            >
                              {a.name} {on ? '✓' : ''}
                            </button>
                          )
                        })}
                      </div>
                      {g.areas.length === 0 && (
                        <p className="text-xs text-amber-400">
                          No area granted yet — tap one above so this guest can see items.
                        </p>
                      )}
                    </div>
                  )}
                </Card>
              </li>
            )
          })}
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
