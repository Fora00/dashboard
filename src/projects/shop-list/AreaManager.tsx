import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { db, type ShopArea } from '../../lib/db'
import { supabase } from '../../lib/sync'
import { useAuth } from '../../lib/useAuth'
import { useOwner } from '../../lib/useOwner'
import { useUndoSnackbar } from '../../lib/useUndoSnackbar'
import { deleteArea, sync } from '../../lib/shopSync'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { Snackbar } from '../../components/Snackbar'

// Owner controls for the selected area: share an invite link, manage which
// guest emails can access it, delete it. Guests see nothing (RLS enforces
// this server-side too). In local mode (signed out) only delete is offered.

const APP_URL = 'https://fora00.github.io/dashboard/'

export function AreaManager({ area }: { area: ShopArea }) {
  const session = useAuth()
  const owner = useOwner()
  const [members, setMembers] = useState<string[] | null>(null)
  const [showMembers, setShowMembers] = useState(false)
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const { pending, trigger, confirmUndo } = useUndoSnackbar()

  useEffect(() => {
    setShowMembers(false)
    setMembers(null)
    setConfirmDelete(false)
    setError(null)
  }, [area.id])

  const isOwner = Boolean(session && owner)
  const localMode = session === null

  if (!isOwner && !localMode) return null

  async function loadMembers() {
    if (!supabase) return
    const { data, error: err } = await supabase
      .from('shop_area_members')
      .select('email')
      .eq('area_id', area.id)
    if (err) setError(err.message)
    else setMembers(data.map((m) => m.email))
  }

  async function shareLink() {
    if (!supabase) return
    setBusy(true)
    setError(null)
    try {
      const { data, error: err } = await supabase.rpc('area_share_token', { aid: area.id })
      if (err) throw err
      if (!data) throw new Error('Could not get the share link.')
      const url = `${APP_URL}#/join/${data}`
      const text = `Join my "${area.name}" shopping list: ${url}`
      if (navigator.share) await navigator.share({ text }).catch(() => {})
      else await navigator.clipboard.writeText(text)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  async function addMember(e: FormEvent) {
    e.preventDefault()
    if (!supabase) return
    const guest = email.trim().toLowerCase()
    if (!guest) return
    setBusy(true)
    setError(null)
    try {
      const { error: e1 } = await supabase
        .from('allowed_emails')
        .upsert({ email: guest, role: 'guest' }, { onConflict: 'email', ignoreDuplicates: true })
      if (e1) throw e1
      const { error: e2 } = await supabase
        .from('shop_area_members')
        .upsert({ area_id: area.id, email: guest }, { onConflict: 'area_id,email', ignoreDuplicates: true })
      if (e2) throw e2
      setEmail('')
      await loadMembers()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  async function removeMember(guest: string) {
    if (!supabase) return
    setBusy(true)
    setError(null)
    try {
      // Drops the membership, undoes the auto-whitelist if the guest has no
      // access left, and rotates the token so the old invite link dies.
      const { error: err } = await supabase.rpc('revoke_area_guest', {
        aid: area.id,
        guest_email: guest,
      })
      if (err) throw err
      await loadMembers()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  // Rotate the share token: any previously shared #/join/<token> link stops
  // working, and a fresh link is copied/shared.
  async function resetLink() {
    if (!supabase) return
    setBusy(true)
    setError(null)
    try {
      const { data, error: err } = await supabase.rpc('rotate_area_token', { aid: area.id })
      if (err) throw err
      if (!data) throw new Error('Could not reset the link.')
      const url = `${APP_URL}#/join/${data}`
      const text = `Join my "${area.name}" shopping list: ${url}`
      if (navigator.share) await navigator.share({ text }).catch(() => {})
      else await navigator.clipboard.writeText(text)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  async function onDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    // Snapshot the area row and its items before the (unchanged) delete
    // call, so Undo can re-upsert both — area first, then items, same ids.
    const areaSnapshot = area
    const itemsSnapshot = await db.shopItems.where('areaId').equals(area.id).toArray()
    await deleteArea(area.id)
    setConfirmDelete(false)
    trigger(`Deleted "${areaSnapshot.name}" · Undo`, async () => {
      await sync.upsert('shop_areas', areaSnapshot)
      for (const item of itemsSnapshot) await sync.upsert('shop_items', item)
    })
  }

  return (
    <Card className="mb-6 space-y-3 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-auto text-slate-500 dark:text-slate-400">Area settings</span>
        {isOwner && (
          <>
            <Button variant="ghost" disabled={busy} onClick={() => void shareLink()}>
              🔗 Share link
            </Button>
            <Button variant="ghost" disabled={busy} onClick={() => void resetLink()}>
              ♻️ Reset link
            </Button>
            <Button
              variant="ghost"
              disabled={busy}
              onClick={() => {
                setShowMembers((s) => !s)
                if (members === null) void loadMembers()
              }}
            >
              👥 Members
            </Button>
          </>
        )}
        <Button variant="danger" disabled={busy} onClick={() => void onDelete()}>
          {confirmDelete ? 'Really delete?' : 'Delete area'}
        </Button>
      </div>

      {showMembers && (
        <div className="space-y-2 border-t border-slate-200 pt-3 dark:border-slate-800">
          {members === null ? (
            <p className="text-slate-500">Loading…</p>
          ) : members.length === 0 ? (
            <p className="text-slate-500">No guests in this area yet.</p>
          ) : (
            <ul className="space-y-2">
              {members.map((m) => (
                <li key={m} className="flex items-center justify-between gap-3">
                  <span className="min-w-0 truncate">{m}</span>
                  <Button variant="danger" disabled={busy} onClick={() => void removeMember(m)}>
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          )}
          <form onSubmit={addMember} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="guest@example.com"
              autoComplete="off"
              className="min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
            />
            <Button type="submit" disabled={busy || !email.trim()}>
              Add
            </Button>
          </form>
        </div>
      )}

      {error && <p className="text-rose-600 dark:text-rose-400">{error}</p>}

      {pending && <Snackbar label={pending.label} onUndo={confirmUndo} />}
    </Card>
  )
}
