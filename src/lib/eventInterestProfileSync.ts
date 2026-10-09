import { db, type EventInterestProfile } from './db'
import { createCloudSync, type TableSync } from './cloudSync'
import { useSyncStatus } from './useSyncStatus'
import { featureKeyProblem } from '../projects/events/featureKeys'
import type { InterestPin } from '../projects/events/types'

// Local-first sync for the owner's interest profile on /events
// (db.eventInterestProfile): per feature key, the SEED (a starting guess in
// [-1, 1] that fades as signals arrive) and a manual PIN (up / down / mute)
// that overrides what was learned. Scoring: src/projects/events/interestScore.ts.
// Copied from src/lib/eventInterestSync.ts, on the generic engine in cloudSync.ts.
//
// OWNER ONLY, like event_interest: gated by is_owner()
// (supabase/migrations/20261009170000_event_interest_profile.sql), while the
// /events pages are public. On anyone else's device every push is rejected
// (42501) and dead-lettered by the engine, which keeps the local row. Signed
// out, writes queue in the outbox and nothing is sent.
//
// Semantics:
//   * One row per feature key. A row with neither seed nor pin is DELETED (an
//     outbox tombstone), so clearing propagates.
//   * Saving a seed REPLACES the previous one: keys it leaves out lose their
//     seed (and their row, unless pinned). Pins are never touched by a seed.
//   * Last-writer-wins by updatedAt, client-side (realtime) and server-side
//     (ignore_stale_update trigger). Every write stamps max(now, previous + 1).

export interface EventInterestProfileRow {
  id: string
  seed: number | null
  pin: InterestPin | null
  updated_at: number
}

/** A pin value, or null for anything else. */
export function asPin(v: unknown): InterestPin | null {
  return v === 'up' || v === 'down' || v === 'mute' ? v : null
}

/** A seed in [-1, 1], null for null; undefined when the value is not a valid seed. */
function asSeed(v: unknown): number | null | undefined {
  if (v === null) return null
  const n = typeof v === 'string' ? Number(v) : v
  return typeof n === 'number' && Number.isFinite(n) && n >= -1 && n <= 1 ? n : undefined
}

export const eventInterestProfileTable: TableSync<EventInterestProfile, EventInterestProfileRow> = {
  remote: 'event_interest_profile',
  table: () => db.eventInterestProfile,
  columns: 'id, seed, pin, updated_at',
  realtime: true,
  updatedAt: (r) => r.updatedAt,
  toRow: (r) => {
    const seed = asSeed(r.seed)
    // Throwing counts as a retryable local error and dead-letters after the
    // engine's cap; the local row is kept either way.
    if (featureKeyProblem(r.id) !== null || seed === undefined || (r.pin !== null && asPin(r.pin) === null)) {
      throw new Error('event_interest_profile: bad row')
    }
    return { id: r.id, seed, pin: r.pin, updated_at: r.updatedAt }
  },
  fromRow: (r) => {
    const seed = asSeed(r.seed)
    const pin = asPin(r.pin)
    if (seed === undefined || (r.pin !== null && pin === null)) throw new Error('event_interest_profile: bad row')
    return { id: r.id, seed, pin, updatedAt: Number(r.updated_at) }
  },
}

const engine = createCloudSync({
  projectId: 'events',
  tables: [eventInterestProfileTable],
})

// --- Local mutations (used by the UI; safe with or without sync) -----------

/** A write stamp that is newer than now AND than the row it replaces. */
function stamp(prev?: number): number {
  return Math.max(Date.now(), (prev ?? 0) + 1)
}

/** Pin a feature up / down / mute, or clear its pin (null). Keeps its seed. */
export async function setPin(key: string, pin: InterestPin | null): Promise<void> {
  if (featureKeyProblem(key) !== null) return
  await db.transaction('rw', db.eventInterestProfile, db.outbox, async () => {
    const prev = await db.eventInterestProfile.get(key)
    const seed = prev?.seed ?? null
    if (pin === null && seed === null) {
      if (prev) await engine.remove('event_interest_profile', key)
      return
    }
    await engine.upsert('event_interest_profile', { id: key, seed, pin, updatedAt: stamp(prev?.updatedAt) })
  })
}

/**
 * Save a validated seed (parseSeedJson) as THE seed: its keys get their
 * value, every other key loses its seed (its row goes unless pinned). Pins
 * are kept. Unchanged rows are not rewritten.
 */
export async function saveSeed(seed: Record<string, number>): Promise<void> {
  const entries = Object.entries(seed).filter(([k, v]) => featureKeyProblem(k) === null && asSeed(v) !== undefined)
  const next = new Map(entries)
  await db.transaction('rw', db.eventInterestProfile, db.outbox, async () => {
    const rows = await db.eventInterestProfile.toArray()
    const byId = new Map(rows.map((r) => [r.id, r]))
    const upserts: EventInterestProfile[] = []
    const deletes: string[] = []
    for (const [id, value] of next) {
      const prev = byId.get(id)
      if (prev?.seed === value) continue
      upserts.push({ id, seed: value, pin: prev?.pin ?? null, updatedAt: stamp(prev?.updatedAt) })
    }
    for (const r of rows) {
      if (next.has(r.id) || r.seed === null) continue
      if (r.pin === null) deletes.push(r.id)
      else upserts.push({ ...r, seed: null, updatedAt: stamp(r.updatedAt) })
    }
    await engine.upsertMany('event_interest_profile', upserts)
    await engine.removeMany('event_interest_profile', deletes)
  })
}

/** Remove the whole seed (pins stay). */
export function clearSeed(): Promise<void> {
  return saveSeed({})
}

// --- Sync engine ------------------------------------------------------------

export const flush = engine.flush
export const syncNow = engine.syncNow

/** The sync engine instance — pass to <SyncCard sync={sync} /> for status UI. */
export const sync = engine

/** Bound React hook: this engine's live SyncStatus. */
export const useStatus = () => useSyncStatus(engine)

/** Start syncing (call when a session exists). Returns a stop function. */
export const startEventInterestProfileSync = engine.start
