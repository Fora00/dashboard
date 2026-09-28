import { db, type ProjectStat } from './db'
import { useAuth } from './useAuth'
import { useOwner } from './useOwner'

// Per-device usage stats for the home grid's ordering (see db.ts's
// ProjectStat). This is the only place that writes db.projectStats — plain
// Dexie writes are correct here, there is no sync engine for a local-only
// table.

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
// An explicit per-device choice always wins over the defaults.
export function isHidden(id: string, stat: ProjectStat | undefined, applyDefaults: boolean): boolean {
  if (NEVER_HIDDEN.has(id)) return false
  if (stat?.hidden !== undefined) return stat.hidden === 1
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
// race and lose a count. Spreads `existing` so fields it doesn't own (starred,
// hidden) survive.
export async function recordOpen(projectId: string): Promise<void> {
  await db.transaction('rw', db.projectStats, async () => {
    const existing = await db.projectStats.get(projectId)
    await db.projectStats.put({
      ...existing,
      id: projectId,
      opens: (existing?.opens ?? 0) + 1,
      starred: existing?.starred ?? 0,
      lastOpenedAt: Date.now(),
    })
  })
}

// Toggles the starred flag, preserving opens. Must work for a project that
// has never been opened (no pre-existing row).
export async function toggleStar(projectId: string): Promise<void> {
  await db.transaction('rw', db.projectStats, async () => {
    const existing = await db.projectStats.get(projectId)
    await db.projectStats.put({
      ...existing,
      id: projectId,
      opens: existing?.opens ?? 0,
      starred: existing?.starred === 1 ? 0 : 1,
      lastOpenedAt: existing?.lastOpenedAt ?? Date.now(),
    })
  })
}

// Writes an explicit show/hide choice, which from then on beats the defaults.
// Same upsert shape as toggleStar.
export async function setHidden(projectId: string, hidden: boolean): Promise<void> {
  await db.transaction('rw', db.projectStats, async () => {
    const existing = await db.projectStats.get(projectId)
    await db.projectStats.put({
      ...existing,
      id: projectId,
      opens: existing?.opens ?? 0,
      starred: existing?.starred ?? 0,
      lastOpenedAt: existing?.lastOpenedAt ?? 0,
      hidden: hidden ? 1 : 0,
    })
  })
}
