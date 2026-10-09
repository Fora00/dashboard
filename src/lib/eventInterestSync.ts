import { db, type EventInterest, type EventMark } from './db'
import { createCloudSync, type TableSync } from './cloudSync'
import { useSyncStatus } from './useSyncStatus'
import { hideEventWithStamp, removeEventMark, restoreEventMark } from './eventMarksSync'
import { isValidMarkId } from '../projects/events/marks'
import {
  asInterestValue,
  interestFeatures,
  isOwnHide,
  sanitizeFeatures,
  type InterestFeatures,
  type InterestValue,
} from '../projects/events/interest'
import type { EventItem } from '../projects/events/types'

// Local-first sync for the owner's 👍 / 👎 on /events (db.eventInterest), on
// the generic engine in cloudSync.ts. Copied from src/lib/eventMarksSync.ts.
// Step 1 of the interest signal: collect only, nothing ranks by it yet.
//
// OWNER ONLY, like event_marks: gated by is_owner()
// (supabase/migrations/20261009150000_event_interest.sql), while the /events
// page itself is public. On anyone else's device every push is rejected
// (42501) and dead-lettered by the engine, which keeps the local row: the
// buttons still work there, the signals just never leave the device. Signed
// out, writes queue in the outbox and nothing is sent.
//
// Semantics:
//   * Tapping the pressed button again DELETES the signal (an outbox
//     tombstone), so it propagates. Rows are never pruned with the events: the
//     `features` snapshot is what keeps them useful after events.json drops
//     the event.
//   * Last-writer-wins by updatedAt, client-side (realtime) and server-side
//     (ignore_stale_update trigger). Every write stamps
//     max(now, previous + 1) so a device with a slow clock still moves forward.
//
// 👎 and Hide. A 👎 also hides the event, through event_marks, exactly like
// the Hide button (it replaces a saved mark, and "show hidden" brings it
// back). Leaving the 👎 (tapping it again, or switching to 👍) un-hides the
// event ONLY IF the hide is the one the 👎 made. The rule, with no extra
// column: when a 👎 creates the hide, the mark and the signal are written with
// the SAME updatedAt; the hide is "ours" while the hidden mark still carries
// exactly the signal's updatedAt. So:
//   * the event was already hidden (by Hide) when 👎 was tapped: the mark is
//     left alone, its stamp differs, undoing the 👎 keeps it hidden;
//   * the owner un-hides and re-hides with Hide afterwards: the new hide has a
//     new stamp, so it is the owner's and stays;
//   * the owner un-hides with Hide: there is no hidden mark, nothing to undo.
// Both stamps sync, so the rule holds on every device. 👍 never touches marks.

export interface EventInterestRow {
  id: string
  value: number
  features: InterestFeatures
  updated_at: number
}

export const eventInterestTable: TableSync<EventInterest, EventInterestRow> = {
  remote: 'event_interest',
  table: () => db.eventInterest,
  columns: 'id, value, features, updated_at',
  realtime: true,
  updatedAt: (r) => r.updatedAt,
  toRow: (r) => {
    const features = sanitizeFeatures(r.features)
    const value = asInterestValue(r.value)
    // Throwing counts as a retryable local error and dead-letters after the
    // engine's cap; the local row is kept either way.
    if (!features || value === null || !isValidMarkId(r.id)) throw new Error('event_interest: bad row')
    return { id: r.id, value, features, updated_at: r.updatedAt }
  },
  fromRow: (r) => {
    // A realtime UPDATE may arrive without the jsonb (TOAST, or the no-op
    // update the LWW trigger emits). Never let that wipe the local snapshot:
    // throwing makes the engine skip the event; the next pull reconciles.
    const value = asInterestValue(r.value)
    const features = sanitizeFeatures(r.features)
    if (value === null || !features) throw new Error('event_interest: bad row')
    return { id: r.id, value, features, updatedAt: Number(r.updated_at) }
  },
}

const engine = createCloudSync({
  projectId: 'events',
  tables: [eventInterestTable],
})

// --- Local mutations (used by the UI; safe with or without sync) -----------

/** A write stamp that is newer than now AND than every row it is compared with. */
function stamp(...prev: Array<number | undefined>): number {
  return Math.max(Date.now(), ...prev.map((p) => (p ?? 0) + 1))
}

/** Is `mark` the hide that `signal`'s 👎 made? (Shared stamp, see above; pure rule in interest.ts.) */
export { isOwnHide }

export interface InterestResult {
  /** The tap hid the event (a new 👎 on an event that wasn't hidden). */
  hid: boolean
  /** Put the signal and the mark back as they were before the tap. */
  undo: () => Promise<void>
}

/**
 * Tap 👍 (1) or 👎 (-1) on an event: the pressed value again clears the
 * signal, the other value replaces it. A 👎 hides the event; leaving a 👎
 * un-hides it if the hide was the 👎's own (rule at the top of this file).
 */
export async function toggleInterest(e: EventItem, value: InterestValue): Promise<InterestResult> {
  const id = e.id
  if (!isValidMarkId(id)) return { hid: false, undo: async () => {} }
  let prev: EventInterest | undefined
  let prevMark: EventMark | undefined
  let hid = false
  await db.transaction('rw', db.eventInterest, db.eventMarks, db.outbox, async () => {
    prev = await db.eventInterest.get(id)
    prevMark = await db.eventMarks.get(id)
    // Leaving a 👎 (either button): drop the hide it made, keep any other.
    if (isOwnHide(prev, prevMark)) await removeEventMark(id)
    if (prev?.value === value) {
      await engine.remove('event_interest', id)
      return
    }
    const at = stamp(prev?.updatedAt, prevMark?.updatedAt)
    if (value === -1 && prevMark?.state !== 'hidden') hid = await hideEventWithStamp(e, at)
    await engine.upsert('event_interest', { id, value, features: interestFeatures(e), updatedAt: at })
  })
  const before = prev
  const beforeMark = prevMark
  return {
    hid,
    undo: () =>
      db.transaction('rw', db.eventInterest, db.eventMarks, db.outbox, async () => {
        const cur = await db.eventInterest.get(id)
        // Fresh stamps throughout, so the server's LWW accepts the restore.
        if (beforeMark && before && isOwnHide(before, beforeMark)) {
          // The 👎 and the hide it made come back linked (one shared stamp).
          const at = stamp(before.updatedAt, cur?.updatedAt, (await db.eventMarks.get(id))?.updatedAt)
          await hideEventWithStamp(beforeMark.event, at)
          await engine.upsert('event_interest', { ...before, updatedAt: at })
          return
        }
        await restoreEventMark(id, beforeMark)
        if (before) {
          // Stamped after the restored mark, so it never looks like its hide.
          const mark = await db.eventMarks.get(id)
          await engine.upsert('event_interest', {
            ...before,
            updatedAt: stamp(before.updatedAt, cur?.updatedAt, mark?.updatedAt),
          })
        } else if (cur) {
          await engine.remove('event_interest', id)
        }
      }),
  }
}

/**
 * "Reset what was learned" on /events/interests: delete EVERY 👍 / 👎 (one
 * tombstone each, so it propagates). Marks are never touched: a 👎's hide
 * stays a hide, saved stays saved. Returns how many signals were deleted.
 */
export async function clearAllInterest(): Promise<number> {
  const ids = (await db.eventInterest.toCollection().primaryKeys()) as string[]
  await engine.removeMany('event_interest', ids)
  return ids.length
}

// --- Sync engine ------------------------------------------------------------

export const flush = engine.flush
export const syncNow = engine.syncNow

/** The sync engine instance — pass to <SyncCard sync={sync} /> for status UI. */
export const sync = engine

/** Bound React hook: this engine's live SyncStatus. */
export const useStatus = () => useSyncStatus(engine)

/** Start syncing (call when a session exists). Returns a stop function. */
export const startEventInterestSync = engine.start
