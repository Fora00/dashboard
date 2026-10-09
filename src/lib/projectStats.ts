import { db, type ProjectPref } from './db'
import { setHiddenPref, toggleStarPref } from './projectPrefsSync'
import { useAuth } from './useAuth'
import { useOwner } from './useOwner'

// The home grid's per-project state, in two tables:
//   * db.projectStats — per-DEVICE usage (opens, lastOpenedAt) for ordering.
//     This is the only place that writes it; plain Dexie writes are correct,
//     there is no sync engine for a local-only table.
//   * db.projectPrefs — per-USER choices (starred, hidden), synced across the
//     user's devices through projectPrefsSync.ts (outbox; works signed out).

// Projects hidden from the home grid until the owner says otherwise (the
// owner's choice, 2026-09-28). Anything not listed — including projects added
// later — defaults to visible.
export const DEFAULT_HIDDEN: ReadonlySet<string> = new Set([
  'todo',
  'habits',
  'climbing',
  'shop-list',
  'boardgame-ideas',
  'book-ideas',
])

// Always on the grid: hiding these would leave no way back to the switches.
export const NEVER_HIDDEN: ReadonlySet<string> = new Set(['settings', 'sharing'])

// Hiding is a view preference only — data, routes and sync are untouched.
// An explicit choice (hidden 0 or 1) always wins over the defaults; null or
// no row means "unset".
export function isHidden(id: string, pref: ProjectPref | undefined, applyDefaults: boolean): boolean {
  if (NEVER_HIDDEN.has(id)) return false
  if (pref?.hidden === 0 || pref?.hidden === 1) return pref.hidden === 1
  return applyDefaults && DEFAULT_HIDDEN.has(id)
}

// DEFAULT_HIDDEN is the owner's layout, so a signed-in guest never gets it —
// otherwise a guest's phone would open with Shop List hidden. Signed-out and
// still-loading both apply it (the owner is the common case; no flash of
// every tile before the owner check resolves).
export function useApplyHiddenDefaults(): boolean {
  const session = useAuth()
  const owner = useOwner()
  return !(session && owner === false)
}

// Called on every arrival at a project's route (see Layout.tsx). Upserts the
// row's open count; wrapped in a transaction so two fast navigations can't
// race and lose a count.
export async function recordOpen(projectId: string): Promise<void> {
  await db.transaction('rw', db.projectStats, async () => {
    const existing = await db.projectStats.get(projectId)
    await db.projectStats.put({
      id: projectId,
      opens: (existing?.opens ?? 0) + 1,
      lastOpenedAt: Date.now(),
    })
  })
}

// Toggles the starred flag. Works for a project that has never been opened
// or starred (no pre-existing row). Synced per user.
export function toggleStar(projectId: string): Promise<void> {
  return toggleStarPref(projectId)
}

// Writes an explicit show/hide choice, which from then on beats the defaults.
// Synced per user.
export function setHidden(projectId: string, hidden: boolean): Promise<void> {
  return setHiddenPref(projectId, hidden)
}
