import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { supabase, syncEnabled } from '../../lib/sync'
import { useAuth } from '../../lib/useAuth'
import { useOwner } from '../../lib/useOwner'
import type { ProjectMeta } from '../../lib/projects'
import { publicProjects, shareable } from './shareable'
import { APP_URL, projectInviteUrl, projectUrl, shareOrCopy } from '../../lib/projectInvites'
import { Button } from '../../components/Button'
import { runSafe } from '../../lib/runSafe'
import { GuestCard } from './GuestCard'
import { ProjectInviteRow, PublicLinkRow } from './InviteRows'
import { chip, listBox, type Area, type Guest } from './shared'
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

// The fixed-id default area created by the shop_areas migration (matches the
// id the client uses when migrating pre-area local data).
const DEFAULT_AREA_ID = '00000000-0000-0000-0000-000000000001'

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
  // Per-project feedback after a share/copy ("Copied"), and the project whose
  // "Reset" is armed (two taps: resetting kills links already sent out).
  const [notice, setNotice] = useState<{ id: string; text: string } | null>(null)
  const [armedReset, setArmedReset] = useState<string | null>(null)

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
    setAreas(
      areaRows.data.map((a) => ({
        id: a.id as string,
        name: a.name as string,
      })),
    )
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
    // oxlint-disable-next-line react/set-state-in-effect -- fetch-on-mount: syncs guest lists from the server once the owner is known
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
  // Each area goes through revoke_area_guest (rotates that area's invite link
  // and cleans up an invite-created whitelist row), not a direct delete.
  async function revokeAllShop(guest: Guest) {
    for (const aid of guest.areas) {
      const { error: e1 } = await supabase!.rpc('revoke_area_guest', {
        aid,
        guest_email: guest.email,
      })
      if (e1) throw e1
    }
    const { error: e2 } = await supabase!
      .from('project_members')
      .delete()
      .eq('project_id', 'shop-list')
      .eq('email', guest.email)
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
        const rows = selected.map((project_id) => ({
          project_id,
          email: guest,
        }))
        const { error: e2 } = await supabase!.from('project_members').upsert(rows, {
          onConflict: 'project_id,email',
          ignoreDuplicates: true,
        })
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
      // Removal goes through revoke_project_guest: it also undoes an
      // invite-created whitelist row when no access is left, and rotates the
      // project's invite link so the old one can't re-add the guest.
      const { error: err } = has
        ? await supabase!.rpc('revoke_project_guest', {
            pid: projectId,
            guest_email: guest.email,
          })
        : await supabase!.from('project_members').insert({ project_id: projectId, email: guest.email })
      if (err) throw err
    })
  }

  // Master Shop List toggle: on = grant default area, off = revoke everything.
  async function toggleShop(guest: Guest, on: boolean) {
    await run(async () => {
      if (on) await revokeAllShop(guest)
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
        const { error: err } = await supabase!.rpc('revoke_area_guest', {
          aid: areaId,
          guest_email: guest.email,
        })
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
      // Revoke through the RPCs first so every invite link that could re-add
      // this guest (each project they're in, each shop area) is rotated.
      for (const pid of guest.memberships) {
        const { error: err } = await supabase!.rpc('revoke_project_guest', {
          pid,
          guest_email: guest.email,
        })
        if (err) throw err
      }
      for (const aid of guest.areas) {
        const { error: err } = await supabase!.rpc('revoke_area_guest', {
          aid,
          guest_email: guest.email,
        })
        if (err) throw err
      }
      // Then drop whatever is left, including an owner-invited whitelist row.
      const { error: e0 } = await supabase!.from('shop_area_members').delete().eq('email', guest.email)
      if (e0) throw e0
      const { error: e1 } = await supabase!.from('project_members').delete().eq('email', guest.email)
      if (e1) throw e1
      const { error: e2 } = await supabase!.from('allowed_emails').delete().eq('email', guest.email)
      if (e2) throw e2
    })
  }

  async function shareAppLink() {
    const text = `You're invited to my dashboard — open it and sign in with your email: ${APP_URL}`
    await shareOrCopy(text).catch(() => {})
  }

  // Share (or copy) a text and confirm it next to the project row.
  async function shareFor(id: string, text: string) {
    const outcome = await shareOrCopy(text)
    if (outcome === 'copied') setNotice({ id, text: 'Link copied' })
    else if (outcome === 'shared') setNotice({ id, text: 'Shared' })
  }

  async function shareInvite(p: ProjectMeta) {
    setArmedReset(null)
    await run(async () => {
      const { data, error: err } = await supabase!.rpc('project_invite_token', {
        pid: p.id,
      })
      if (err) throw err
      if (!data) throw new Error('Could not get the invite link.')
      await shareFor(
        p.id,
        `Join my ${p.emoji} ${p.name} on my dashboard — open the link and sign in with your email: ${projectInviteUrl(data)}`,
      )
    })
  }

  // Rotate the project's token: every previously sent link dies (guests who
  // already joined keep access), then share the fresh one.
  async function resetInvite(p: ProjectMeta) {
    if (armedReset !== p.id) {
      setArmedReset(p.id)
      setNotice(null)
      return
    }
    setArmedReset(null)
    await run(async () => {
      const { data, error: err } = await supabase!.rpc('rotate_project_invite', { pid: p.id })
      if (err) throw err
      if (!data) throw new Error('Could not reset the invite link.')
      setNotice({ id: p.id, text: 'Old link reset' })
      await shareFor(
        p.id,
        `Join my ${p.emoji} ${p.name} on my dashboard — open the link and sign in with your email: ${projectInviteUrl(data)}`,
      )
    })
  }

  async function sharePublic(p: ProjectMeta) {
    await shareFor(p.id, `${p.emoji} ${p.name}: ${projectUrl(p.path)}`).catch((err) =>
      setError(err instanceof Error ? err.message : String(err)),
    )
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
        <Card className="text-sm text-slate-500 dark:text-slate-400">
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
        <Card className="text-sm text-slate-500 dark:text-slate-400">
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
            aria-label="Guest email"
            autoComplete="off"
            required
            className="min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
          />
          <Button type="submit" disabled={busy || !email.trim() || (selected.length === 0 && !shopOn)}>
            Invite
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setShopOn((s) => !s)} className={chip(shopOn, 'indigo')}>
            🛒 Shop List
          </button>
          {shareable.map((p) => {
            const on = selected.includes(p.id)
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelected((s) => (on ? s.filter((id) => id !== p.id) : [...s, p.id]))}
                className={chip(on, 'indigo')}
              >
                {p.emoji} {p.name}
              </button>
            )
          })}
        </div>
      </form>

      {error && <p className="mb-4 text-sm text-rose-600 dark:text-rose-400">{error}</p>}

      {guests === null ? null : guests.length === 0 ? (
        <EmptyState
          emoji="🫥"
          title="No guests yet"
          hint="Invite someone above, then send them the app link — they sign in with their email and a code."
        />
      ) : (
        <ul className="space-y-3">
          {guests.map((g) => (
            <GuestCard
              key={g.email}
              guest={g}
              areas={areas}
              busy={busy}
              onRemove={() => void runSafe(removeGuest)(g)}
              onToggleShop={(on) => void runSafe(toggleShop)(g, on)}
              onToggleMembership={(pid) => void runSafe(toggleMembership)(g, pid)}
              onToggleArea={(aid) => void runSafe(toggleArea)(g, aid)}
            />
          ))}
        </ul>
      )}

      <section className="mt-6">
        <h2 className="mb-1 text-sm font-semibold">Invite links</h2>
        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
          One link per project. Whoever opens it enters their email and gets that project only. Removing a guest resets
          the link; Reset kills links you already sent. Shop areas have their own links in the Shop List.
        </p>
        <div className={listBox}>
          {shareable.map((p) => (
            <ProjectInviteRow
              key={p.id}
              project={p}
              notice={notice?.id === p.id ? notice.text : null}
              busy={busy}
              armed={armedReset === p.id}
              onReset={() => void runSafe(resetInvite)(p)}
              onInvite={() => void runSafe(shareInvite)(p)}
            />
          ))}
        </div>
      </section>

      {publicProjects.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-1 text-sm font-semibold">Public — no invite needed</h2>
          <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
            Anyone with the plain link can use these, no sign-in.
          </p>
          <div className={listBox}>
            {publicProjects.map((p) => (
              <PublicLinkRow
                key={p.id}
                project={p}
                notice={notice?.id === p.id ? notice.text : null}
                onShare={() => void runSafe(sharePublic)(p)}
              />
            ))}
          </div>
        </section>
      )}

      <Card className="mt-6 flex items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
        <span>Send guests the app link — they sign in with their email.</span>
        <Button variant="ghost" onClick={() => void runSafe(shareAppLink)()}>
          Share link
        </Button>
      </Card>
    </div>
  )
}
