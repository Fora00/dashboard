import { db, type CustomEvent } from './db'
import { createCloudSync, type TableSync } from './cloudSync'
import { useSyncStatus } from './useSyncStatus'
import { isExpiredCustomEvent, isSafeImageDataUrl } from '../projects/events/custom'
import { removeEventMark, restoreEventMark } from './eventMarksSync'

// Local-first sync for the owner's hand-added events (project 12, "Manual
// events" in docs/EVENTS.md), built on the generic engine in cloudSync.ts.
// Copied from src/lib/linksSync.ts — see docs/NEW_PROJECT.md.
//
// OWNER ONLY, like life: the table is gated by is_owner() (see
// supabase/migrations/20261001120000_custom_events.sql), while the /events
// page itself is public. On anyone else's device every push is rejected
// (42501) and dead-lettered by the engine, which keeps the local row: the
// event still works there, it just never leaves the device.

export {
  MAX_CITY_LENGTH,
  MAX_IMAGE_LENGTH,
  MAX_NOTE_LENGTH,
  MAX_TITLE_LENGTH,
  MAX_URL_LENGTH,
  MAX_VENUE_LENGTH,
} from '../projects/events/custom'

export interface CustomEventRow {
  id: string
  title: string
  start_at: string
  end_at: string | null
  all_day: boolean
  venue: string | null
  city: string
  url: string
  note: string
  category: string
  image: string | null
  created_at: number
  updated_at: number
}

export const customEventsTable: TableSync<CustomEvent, CustomEventRow> = {
  remote: 'custom_events',
  table: () => db.customEvents,
  columns: 'id, title, start_at, end_at, all_day, venue, city, url, note, category, image, created_at, updated_at',
  realtime: true,
  updatedAt: (e) => e.updatedAt,
  toRow: (e) => ({
    id: e.id,
    title: e.title,
    start_at: e.start,
    end_at: e.end,
    all_day: e.allDay,
    venue: e.venue,
    city: e.city,
    url: e.url,
    note: e.note,
    category: e.category,
    image: e.image,
    created_at: e.createdAt,
    updated_at: e.updatedAt,
  }),
  fromRow: (r) => {
    // A realtime UPDATE may arrive without the (TOASTed) image or with a
    // placeholder instead of it. Never let that wipe the local image: throwing
    // makes the engine skip the event, and the next pull reconciles.
    if (r.image !== null && !isSafeImageDataUrl(r.image)) throw new Error('custom_events: image missing')
    if (typeof r.title !== 'string' || typeof r.start_at !== 'string') throw new Error('custom_events: bad row')
    return {
      id: r.id,
      title: r.title,
      start: r.start_at,
      end: r.end_at ?? null,
      allDay: Boolean(r.all_day),
      venue: r.venue ?? null,
      city: r.city ?? '',
      url: r.url ?? '',
      note: r.note ?? '',
      category: r.category ?? 'other',
      image: r.image,
      createdAt: Number(r.created_at),
      updatedAt: Number(r.updated_at),
    }
  },
}

const engine = createCloudSync({
  projectId: 'events',
  tables: [customEventsTable],
})

// --- Local mutations (used by the UI; safe with or without sync) -----------
// Rows come validated from formToRow() in src/projects/events/custom.ts.

/** Add or edit (same id) a hand-added event. Bumps updatedAt. */
export async function saveCustomEvent(row: CustomEvent): Promise<void> {
  await engine.upsert('custom_events', { ...row, updatedAt: Math.max(Date.now(), row.updatedAt) })
}

/**
 * Delete a hand-added event, plus its saved/hidden mark (both synced, each by
 * its own engine). Returns an undo that restores both; they go back through
 * the engines with a fresh updatedAt, so the server's LWW trigger accepts them.
 */
export async function deleteCustomEvent(id: string): Promise<() => Promise<void>> {
  const row = await db.customEvents.get(id)
  const mark = await db.eventMarks.get(id)
  await db.transaction('rw', db.customEvents, db.eventMarks, db.outbox, async () => {
    await engine.remove('custom_events', id)
    await removeEventMark(id)
  })
  return async () => {
    if (row) await engine.upsert('custom_events', { ...row, updatedAt: Date.now() })
    if (mark) await restoreEventMark(id, mark)
  }
}

/**
 * Delete hand-added events whose last day is more than two weeks past. Goes
 * through the engine, so the deletion syncs; works signed out too. A saved
 * mark keeps its own snapshot, as for events that drop out of events.json.
 */
export async function pruneCustomEvents(now = Date.now()): Promise<number> {
  const old = (await db.customEvents.toArray()).filter((r) => isExpiredCustomEvent(r, now))
  for (const r of old) await engine.remove('custom_events', r.id)
  return old.length
}

// --- Sync engine ------------------------------------------------------------

export const flush = engine.flush
export const syncNow = engine.syncNow

/** The sync engine instance — pass to <SyncCard sync={sync} /> for status UI. */
export const sync = engine

/** Bound React hook: this project's live SyncStatus. */
export const useStatus = () => useSyncStatus(engine)

/** Start syncing (call when a session exists). Returns a stop function. */
export const startCustomEventsSync = engine.start
