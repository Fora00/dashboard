import {
  db,
  type LifeAnswer,
  type LifeCheckinEntry,
  type LifeEntry,
  type LifeFocusEntry,
  type LifePlan,
  type LifeSentEntry,
  type LifeSundayEntry,
  type LifeTrackerEntry,
  type LifeWeek,
} from './db'
import { createCloudSync, type TableSync } from './cloudSync'
import { useSyncStatus } from './useSyncStatus'
import { LIFE_CAPS, dayKey, entryId, isEnergy, validatePlan, withCheckinIds } from '../projects/life/model'

// Local-first sync for the Life project (owner-only), built on the generic
// engine in cloudSync.ts. Copied from src/lib/linksSync.ts — see
// docs/NEW_PROJECT.md. Spec: docs/HANDOFF-life.md.
//
// Two tables so concurrent logging never collides:
//   life_weeks    one row per week, replaced wholesale on import (plan only).
//   life_entries  one row per logged thing. Tracker +1s are append-only rows
//                 with random ids; focus-done / Sunday answer / task-sent /
//                 check-in done+note use
//                 a deterministic id `${week}:${kind}:${ref}` and are flipped
//                 in place (never deleted), so two devices toggling the same
//                 thing converge by last-writer-wins on updatedAt.
//
// Remote access is is_owner() only (see the migration). On a guest's device
// every push is rejected with 42501 and dead-lettered by the engine, which
// keeps the local row; pull() and realtime simply see no rows.

interface LifeWeekRow {
  id: string
  week: string
  plan: LifePlan
  imported_at: number
  updated_at: number
}

interface LifeEntryRow {
  id: string
  week: string
  kind: LifeEntry['kind']
  ref: string
  day: string
  value: LifeEntry['value']
  created_at: number
  updated_at: number
}

const weeksTable: TableSync<LifeWeek, LifeWeekRow> = {
  remote: 'life_weeks',
  table: () => db.lifeWeeks,
  columns: 'id, week, plan, imported_at, updated_at',
  realtime: true,
  updatedAt: (w) => w.updatedAt,
  toRow: (w) => ({
    id: w.id,
    week: w.week ?? w.id,
    plan: w.plan,
    imported_at: w.importedAt,
    updated_at: w.updatedAt,
  }),
  fromRow: (r) => ({
    id: r.id,
    week: r.week,
    // Rows imported before check-ins had ids get the same derived ids the
    // client computes everywhere else (model.ts withCheckinIds).
    plan: r.plan ? withCheckinIds(r.plan) : r.plan,
    importedAt: Number(r.imported_at),
    updatedAt: Number(r.updated_at),
  }),
}

const entriesTable: TableSync<LifeEntry, LifeEntryRow> = {
  remote: 'life_entries',
  table: () => db.lifeEntries,
  columns: 'id, week, kind, ref, day, value, created_at, updated_at',
  realtime: true,
  updatedAt: (e) => e.updatedAt,
  toRow: (e) => ({
    id: e.id,
    week: e.week,
    kind: e.kind,
    ref: e.ref,
    day: e.day,
    // `?? {}` guards value against a malformed queued payload: undefined would
    // hit a NOT NULL column and dead-letter the entry.
    value: e.value ?? {},
    created_at: e.createdAt,
    updated_at: e.updatedAt,
  }),
  // The kind/value pairing is enforced by the writers below; the cast only
  // re-attaches the discriminated union the row type can't express.
  fromRow: (r) =>
    ({
      id: r.id,
      week: r.week,
      kind: r.kind,
      ref: r.ref,
      day: r.day,
      value: r.value ?? {},
      createdAt: Number(r.created_at),
      updatedAt: Number(r.updated_at),
    }) as LifeEntry,
}

const engine = createCloudSync({
  projectId: 'life',
  tables: [weeksTable, entriesTable],
})

// --- Local mutations (used by the UI; safe with or without sync) -----------

/**
 * Save an imported week: replaces the week's plan entirely and never touches
 * life_entries (entries whose ref left the plan are kept). Re-validates, so
 * nothing invalid is ever written; throws with the errors otherwise.
 */
export async function importWeek(plan: LifePlan): Promise<LifeWeek> {
  const result = validatePlan(plan)
  if (!result.ok) throw new Error(result.errors.join('\n'))
  const now = Date.now()
  const week: LifeWeek = {
    id: result.plan.week,
    week: result.plan.week,
    plan: result.plan,
    importedAt: now,
    updatedAt: now,
  }
  await engine.upsert('life_weeks', week)
  return week
}

export interface LogTrackerOptions {
  /** Local day key to log on; defaults to today. */
  day?: string
  /** Energy before/after, integers 1–5 (only for trackers with energy: true). */
  energyBefore?: number
  energyAfter?: number
}

function energyValue(opts: { energyBefore?: number | undefined; energyAfter?: number | undefined }) {
  const value: LifeTrackerEntry['value'] = {}
  if (opts.energyBefore !== undefined) {
    if (!isEnergy(opts.energyBefore)) throw new Error('energyBefore must be an integer 1–5')
    value.energyBefore = opts.energyBefore
  }
  if (opts.energyAfter !== undefined) {
    if (!isEnergy(opts.energyAfter)) throw new Error('energyAfter must be an integer 1–5')
    value.energyAfter = opts.energyAfter
  }
  return value
}

/** A tracker +1: a new append-only row. Returns it (keep it for Undo). */
export async function logTracker(
  week: string,
  trackerId: string,
  opts: LogTrackerOptions = {},
): Promise<LifeTrackerEntry> {
  const now = Date.now()
  const entry: LifeTrackerEntry = {
    id: crypto.randomUUID(),
    week,
    kind: 'tracker',
    ref: trackerId,
    day: opts.day ?? dayKey(new Date()),
    value: energyValue(opts),
    createdAt: now,
    updatedAt: now,
  }
  await engine.upsert('life_entries', entry)
  return entry
}

/** Set (or replace) the energy pair on an existing tracker +1. */
export async function setTrackerEnergy(
  entry: LifeTrackerEntry,
  energy: { energyBefore?: number; energyAfter?: number },
): Promise<void> {
  await engine.upsert('life_entries', {
    ...entry,
    value: energyValue({ ...entry.value, ...energy }),
    updatedAt: Date.now(),
  })
}

/** Remove a tracker +1 (Undo). Only tracker rows are ever deleted. */
export async function removeTrackerEntry(id: string): Promise<void> {
  await engine.remove('life_entries', id)
}

/** Put a removed entry back with the same id (the Undo of an Undo). */
export async function restoreEntry(entry: LifeEntry): Promise<void> {
  await engine.upsert('life_entries', { ...entry, updatedAt: Date.now() })
}

async function existing<E extends LifeEntry>(id: string): Promise<E | undefined> {
  return (await db.lifeEntries.get(id)) as E | undefined
}

/** Mark a focus item done / not done for the week. */
export async function setFocusDone(week: string, focusId: string, done: boolean): Promise<void> {
  const id = entryId(week, 'focus', focusId)
  const prev = await existing<LifeFocusEntry>(id)
  const now = Date.now()
  const entry: LifeFocusEntry = {
    id,
    week,
    kind: 'focus',
    ref: focusId,
    day: dayKey(new Date()),
    value: { done },
    createdAt: prev?.createdAt ?? now,
    updatedAt: now,
  }
  await engine.upsert('life_entries', entry)
}

/** Flip a focus item's done state. Returns the new state. */
export async function toggleFocus(week: string, focusId: string): Promise<boolean> {
  const prev = await existing<LifeFocusEntry>(entryId(week, 'focus', focusId))
  const done = !(prev?.value.done ?? false)
  await setFocusDone(week, focusId, done)
  return done
}

/**
 * Save the answer to a Sunday question (null clears it). The caller checks
 * the answer against the question type with validateAnswer() from model.ts.
 */
export async function setSundayAnswer(week: string, questionId: string, answer: LifeAnswer): Promise<void> {
  const id = entryId(week, 'sunday', questionId)
  const prev = await existing<LifeSundayEntry>(id)
  const now = Date.now()
  const entry: LifeSundayEntry = {
    id,
    week,
    kind: 'sunday',
    ref: questionId,
    day: dayKey(new Date()),
    value: { answer },
    createdAt: prev?.createdAt ?? now,
    updatedAt: now,
  }
  await engine.upsert('life_entries', entry)
}

export interface CheckinInput {
  done: boolean
  /** Optional note; trimmed, empty/omitted clears it. ≤ LIFE_CAPS.checkinNote chars. */
  note?: string | null
}

/**
 * Mark a check-in done / not done, with an optional note. A keyed toggle
 * (`${week}:checkin:${checkinId}`): updated in place, never deleted. Throws
 * if the note is over LIFE_CAPS.checkinNote characters (the UI caps the
 * input with maxLength, so this is a backstop). Returns the saved entry.
 */
export async function setCheckin(week: string, checkinId: string, input: CheckinInput): Promise<LifeCheckinEntry> {
  const note = (input.note ?? '').trim()
  if (note.length > LIFE_CAPS.checkinNote) {
    throw new Error(`Keep the note under ${LIFE_CAPS.checkinNote} characters`)
  }
  const id = entryId(week, 'checkin', checkinId)
  const prev = await existing<LifeCheckinEntry>(id)
  const now = Date.now()
  const value: LifeCheckinEntry['value'] = { done: input.done === true }
  if (note) value.note = note
  const entry: LifeCheckinEntry = {
    id,
    week,
    kind: 'checkin',
    ref: checkinId,
    day: dayKey(new Date()),
    value,
    createdAt: prev?.createdAt ?? now,
    updatedAt: now,
  }
  await engine.upsert('life_entries', entry)
  return entry
}

/**
 * Mark tasks as sent to Things (or not, for "Resend selected"), in one
 * transaction. "Sent" only means the things:// link was opened.
 */
export async function markTasksSent(week: string, taskIds: string[], sent = true): Promise<void> {
  if (taskIds.length === 0) return
  const now = Date.now()
  const today = dayKey(new Date())
  const ids = taskIds.map((t) => entryId(week, 'sent', t))
  const prev = (await db.lifeEntries.bulkGet(ids)) as (LifeSentEntry | undefined)[]
  const rows = taskIds.map((taskId, i): LifeSentEntry => ({
    id: ids[i] ?? entryId(week, 'sent', taskId),
    week,
    kind: 'sent',
    ref: taskId,
    day: today,
    // Every send is recorded (last 10), so a resend of a batch that had in
    // fact worked shows up as a duplicate instead of hiding the first one.
    value: {
      sent,
      sends: sent ? [...(prev[i]?.value.sends ?? []), now].slice(-10) : (prev[i]?.value.sends ?? []),
    },
    createdAt: prev[i]?.createdAt ?? now,
    updatedAt: now,
  }))
  await engine.upsertMany('life_entries', rows)
}

// --- Sync engine ------------------------------------------------------------

export const flush = engine.flush
export const syncNow = engine.syncNow

/** The sync engine instance — pass to <SyncCard sync={sync} /> for status UI. */
export const sync = engine

/** Bound React hook: this project's live SyncStatus. */
export const useStatus = () => useSyncStatus(engine)

/** Start syncing (call when a session exists). Returns a stop function. */
export const startLifeSync = engine.start
