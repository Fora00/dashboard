import { db, type EventMark, type EventPrefs } from './db'
import { createCloudSync, type TableSync } from './cloudSync'
import { useSyncStatus } from './useSyncStatus'
import { isPastEvent, sanitizeFavourites, sanitizeSnapshot } from '../projects/events/marks'
import type { EventItem } from '../projects/events/types'

// Local-first sync for the owner's saved/hidden events (db.eventMarks) and
// favourite categories (db.eventPrefs) on /events, on the generic engine in
// cloudSync.ts. Copied from src/lib/customEventsSync.ts.
//
// OWNER ONLY, like custom_events and life: both tables are gated by is_owner()
// (supabase/migrations/20261001130000_event_marks.sql), while the /events page
// itself is public. On anyone else's device every push is rejected (42501) and
// dead-lettered by the engine, which keeps the local row: saving and hiding
// still work there, they just never leave the device. Signed out, writes queue
// in the outbox and nothing is sent.
//
// Semantics:
//   * Un-saving / un-hiding DELETES the mark (an outbox tombstone), so it
//     propagates; pull and realtime remove it on the other devices.
//   * Last-writer-wins by updatedAt, client-side (realtime) and server-side
//     (ignore_stale_update trigger). Every write stamps
//     max(now, previous + 1) so a device with a slow clock still moves forward.
//   * Marks that existed before sync are queued once by the Dexie v15 upgrade
//     (db.ts), so the first sync is a union, never a wipe.
//   * The snapshot is rebuilt and capped by sanitizeSnapshot (marks.ts) on
//     every write AND in toRow, so a legacy oversized snapshot can't be
//     rejected forever by the server's size check.

export interface EventMarkRow {
  id: string
  state: 'saved' | 'hidden'
  event: EventItem
  updated_at: number
}

export interface EventPrefsRow {
  id: 'prefs'
  favourite_categories: string[]
  updated_at: number
}

export const eventMarksTable: TableSync<EventMark, EventMarkRow> = {
  remote: 'event_marks',
  table: () => db.eventMarks,
  columns: 'id, state, event, updated_at',
  realtime: true,
  updatedAt: (m) => m.updatedAt,
  toRow: (m) => {
    const event = sanitizeSnapshot(m.event)
    // Throwing counts as a retryable local error and dead-letters after the
    // engine's cap; the local mark is kept either way.
    if (!event || event.id !== m.id) throw new Error('event_marks: bad snapshot')
    return { id: m.id, state: m.state, event, updated_at: m.updatedAt }
  },
  fromRow: (r) => {
    // A realtime UPDATE may arrive without the (TOASTed) jsonb snapshot, e.g.
    // the no-op update the LWW trigger emits. Never let that wipe the local
    // snapshot: throwing makes the engine skip the event; the next pull
    // reconciles.
    if (r.state !== 'saved' && r.state !== 'hidden') throw new Error('event_marks: bad state')
    const event = sanitizeSnapshot(r.event)
    if (!event || event.id !== r.id) throw new Error('event_marks: snapshot missing')
    return { id: r.id, state: r.state, event, updatedAt: Number(r.updated_at) }
  },
}

export const eventPrefsTable: TableSync<EventPrefs, EventPrefsRow> = {
  remote: 'event_prefs',
  // db.eventPrefs is keyed by the literal 'prefs'; the engine wants a string
  // key, so take the same table untyped.
  table: () => db.table<EventPrefs, string>('eventPrefs'),
  columns: 'id, favourite_categories, updated_at',
  realtime: true,
  updatedAt: (p) => p.updatedAt ?? 0,
  toRow: (p) => ({
    id: 'prefs',
    favourite_categories: sanitizeFavourites(p.favouriteCategories),
    updated_at: p.updatedAt ?? 0,
  }),
  fromRow: (r) => {
    if (r.id !== 'prefs' || !Array.isArray(r.favourite_categories)) throw new Error('event_prefs: bad row')
    return {
      id: 'prefs',
      favouriteCategories: sanitizeFavourites(r.favourite_categories),
      updatedAt: Number(r.updated_at),
    }
  },
}

const engine = createCloudSync({
  projectId: 'events',
  tables: [eventMarksTable, eventPrefsTable],
})

// --- Local mutations (used by the UI; safe with or without sync) -----------

/** A write stamp that is newer than now AND than the row it replaces. */
function stamp(prev?: number): number {
  return Math.max(Date.now(), (prev ?? 0) + 1)
}

/**
 * Toggle `state` on an event: the same state again clears the mark, another
 * state replaces it. Returns the previous mark (for Undo via restoreEventMark).
 */
export async function toggleEventMark(e: EventItem, state: EventMark['state']): Promise<EventMark | undefined> {
  const prev = await db.eventMarks.get(e.id)
  if (prev?.state === state) {
    await engine.remove('event_marks', e.id)
    return prev
  }
  const event = sanitizeSnapshot(e)
  if (!event) return prev
  await engine.upsert('event_marks', {
    id: event.id,
    state,
    event,
    updatedAt: stamp(prev?.updatedAt),
  })
  return prev
}

/**
 * Put back the mark an event had before (Undo), or clear it when it had none.
 * A restored mark gets a fresh stamp, so the server's LWW accepts it.
 */
export async function restoreEventMark(id: string, prev: EventMark | undefined): Promise<void> {
  if (prev) {
    const cur = await db.eventMarks.get(id)
    await engine.upsert('event_marks', {
      ...prev,
      updatedAt: stamp(Math.max(prev.updatedAt, cur?.updatedAt ?? 0)),
    })
  } else if (await db.eventMarks.get(id)) {
    await engine.remove('event_marks', id)
  }
}

/**
 * Hide several events at once. Events already hidden are left alone. Returns
 * the previous marks of the ones it changed, for a single Undo.
 */
export async function hideEvents(events: EventItem[]): Promise<Array<[string, EventMark | undefined]>> {
  const changed: Array<[string, EventMark | undefined]> = []
  for (const e of events) {
    const prev = await db.eventMarks.get(e.id)
    if (prev?.state === 'hidden') continue
    const event = sanitizeSnapshot(e)
    if (!event) continue
    await engine.upsert('event_marks', {
      id: event.id,
      state: 'hidden',
      event,
      updatedAt: stamp(prev?.updatedAt),
    })
    changed.push([e.id, prev])
  }
  return changed
}

/** Clear an event's mark (no-op, and nothing queued, when it has none). */
export async function removeEventMark(id: string): Promise<void> {
  if (await db.eventMarks.get(id)) await engine.remove('event_marks', id)
}

/**
 * Delete the marks (saved and hidden) of events that are over. Goes through
 * the engine, so the deletion syncs and frees the server row; works signed
 * out too. Every device runs it, deleting an already-deleted row is harmless.
 */
export async function pruneEventMarks(now = Date.now()): Promise<number> {
  const old = (await db.eventMarks.toArray()).filter((m) => isPastEvent(m.event, now))
  for (const m of old) await engine.remove('event_marks', m.id)
  return old.length
}

/** Replace the favourite categories (sanitised, de-duplicated). */
export async function setFavouriteCategories(ids: string[]): Promise<void> {
  const prev = await db.eventPrefs.get('prefs')
  await engine.upsert('event_prefs', {
    id: 'prefs',
    favouriteCategories: sanitizeFavourites(ids),
    updatedAt: stamp(prev?.updatedAt),
  })
}

// --- Sync engine ------------------------------------------------------------

export const flush = engine.flush
export const syncNow = engine.syncNow

/** The sync engine instance — pass to <SyncCard sync={sync} /> for status UI. */
export const sync = engine

/** Bound React hook: this engine's live SyncStatus. */
export const useStatus = () => useSyncStatus(engine)

/** Start syncing (call when a session exists). Returns a stop function. */
export const startEventMarksSync = engine.start
