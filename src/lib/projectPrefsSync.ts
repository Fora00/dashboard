import { db, type ProjectPref } from './db'
import { createCloudSync, type TableSync } from './cloudSync'
import { useSyncStatus } from './useSyncStatus'

// Local-first sync for the home grid's per-project `starred` and `hidden`
// choices (db.projectPrefs), on the generic engine in cloudSync.ts. Open
// counts and last-opened times stay in db.projectStats, local-only and per
// device (projectStats.ts).
//
// PER USER, not per project and not owner-only: every signed-in user (owner
// or guest) has their own rows. supabase/migrations/20261009120000_project_prefs.sql
// keys the table by (user_id, id) with user_id defaulting to auth.uid() and
// RLS `user_id = auth.uid()` on every operation, so the client never sends a
// user_id and the row `id` stays the project id, exactly as the engine
// expects (mapRow requires local id === remote id; pull pages by id, which is
// unique inside one user's RLS view; deletes by id only ever reach our row).
//
// Semantics:
//   * Rows are only ever upserted, never deleted: "unstar" is starred = 0,
//     "back to the default" is hidden = null. Realtime DELETEs are ignored
//     (realtimeDeletes: false — Realtime broadcasts other users' deletes, and
//     their ids collide with ours).
//   * Last-writer-wins per row by updatedAt, client-side (realtime) and
//     server-side (project_prefs_merge). Every write stamps
//     max(now, previous + 1) so a device with a slow clock still moves forward.
//   * Choices that predate sync are queued once by the Dexie v17 upgrade with
//     updatedAt 0; the server merges those into its row (a star is kept, a
//     hidden choice fills an unset one), so the first sync is a union.

export interface ProjectPrefRow {
  id: string
  starred: boolean
  hidden: boolean | null
  updated_at: number
}

export const projectPrefsTable: TableSync<ProjectPref, ProjectPrefRow> = {
  remote: 'project_prefs',
  table: () => db.projectPrefs,
  // Never user_id: it is implied by RLS, and the local row has no such field.
  columns: 'id, starred, hidden, updated_at',
  realtime: true,
  realtimeDeletes: false,
  updatedAt: (p) => p.updatedAt,
  toRow: (p) => ({
    id: p.id,
    starred: p.starred === 1,
    hidden: p.hidden === null || p.hidden === undefined ? null : p.hidden === 1,
    updated_at: p.updatedAt,
  }),
  fromRow: (r) => {
    if (typeof r.starred !== 'boolean') throw new Error('project_prefs: bad starred')
    if (r.hidden !== null && typeof r.hidden !== 'boolean') throw new Error('project_prefs: bad hidden')
    return {
      id: r.id,
      starred: r.starred ? 1 : 0,
      hidden: r.hidden === null ? null : r.hidden ? 1 : 0,
      updatedAt: Number(r.updated_at),
    }
  },
}

const engine = createCloudSync({
  projectId: 'project-prefs',
  tables: [projectPrefsTable],
})

// --- Local mutations (used by projectStats.ts; safe with or without sync) --

/** A write stamp that is newer than now AND than the row it replaces. */
function stamp(prev?: number): number {
  return Math.max(Date.now(), (prev ?? 0) + 1)
}

/** Read-modify-write one project's prefs through the outbox. */
async function updatePref(projectId: string, change: (prev: ProjectPref | undefined) => Partial<ProjectPref>) {
  const prev = await db.projectPrefs.get(projectId)
  await engine.upsert('project_prefs', {
    id: projectId,
    starred: prev?.starred ?? 0,
    hidden: prev?.hidden ?? null,
    ...change(prev),
    updatedAt: stamp(prev?.updatedAt),
  })
}

/** Flip the starred flag. Works for a project with no row yet. */
export function toggleStarPref(projectId: string): Promise<void> {
  return updatePref(projectId, (prev) => ({ starred: prev?.starred === 1 ? 0 : 1 }))
}

/** Write an explicit show/hide choice (beats the defaults from then on). */
export function setHiddenPref(projectId: string, hidden: boolean): Promise<void> {
  return updatePref(projectId, () => ({ hidden: hidden ? 1 : 0 }))
}

// --- Sync engine ------------------------------------------------------------

export const flush = engine.flush
export const syncNow = engine.syncNow

/** The sync engine instance — pass to <SyncCard sync={sync} /> for status UI. */
export const sync = engine

/** Bound React hook: this engine's live SyncStatus. */
export const useStatus = () => useSyncStatus(engine)

/** Start syncing (call when a session exists). Returns a stop function. */
export const startProjectPrefsSync = engine.start
