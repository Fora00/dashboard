import {
  db,
  type LifeAnswer,
  type LifeCheckinEntry,
  type LifeDayFocus,
  type LifeEntry,
  type LifeFocusEntry,
  type LifeIdeaEntry,
  type LifeIdeaStatus,
  type LifePlan,
  type LifePlaybookEntry,
  type LifeSentEntry,
  type LifeSundayEntry,
  type LifeUpgradeEntry,
  type LifeUpgradeSize,
  type LifeUpgradeStatus,
  type LifeTrackerEntry,
  type LifeWeek,
  type LifeWhyEntry,
} from './db'
import { createCloudSync, type TableSync } from './cloudSync'
import { useSyncStatus } from './useSyncStatus'
import {
  LIFE_CAPS,
  dayFocusId,
  dayKey,
  entryId,
  freeSlots,
  isEnergy,
  validatePlan,
  withCheckinIds,
} from '../projects/life/model'

// Local-first sync for the Life project (owner-only), built on the generic
// engine in cloudSync.ts. Copied from src/lib/linksSync.ts — see
// docs/NEW_PROJECT.md. Spec: docs/HANDOFF-life.md.
//
// Two tables so concurrent logging never collides:
//   life_weeks    one row per week, replaced wholesale on import (plan only).
//   life_day_focus  "Focus di oggi": up to 3 free-text lines per day, id
//                 `${day}:${slot}` (slot 0-2, so a day never exceeds 3), edited
//                 in place, deleted for real. Not part of the week plan/export.
//   life_entries  one row per logged thing. Tracker and playbook +1s are append-only rows
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

interface LifeDayFocusRow {
  id: string
  day: string
  slot: number
  title: string
  done: boolean
  created_at: number
  updated_at: number
}

const dayFocusTable: TableSync<LifeDayFocus, LifeDayFocusRow> = {
  remote: 'life_day_focus',
  table: () => db.lifeDayFocus,
  columns: 'id, day, slot, title, done, created_at, updated_at',
  realtime: true,
  updatedAt: (f) => f.updatedAt,
  toRow: (f) => ({
    id: f.id,
    day: f.day,
    slot: f.slot,
    title: f.title,
    done: f.done,
    created_at: f.createdAt,
    updated_at: f.updatedAt,
  }),
  fromRow: (r) => {
    if (typeof r.title !== 'string' || typeof r.day !== 'string') throw new Error('life_day_focus: bad row')
    return {
      id: r.id,
      day: r.day,
      slot: Number(r.slot),
      title: r.title,
      done: Boolean(r.done),
      createdAt: Number(r.created_at),
      updatedAt: Number(r.updated_at),
    }
  },
}

const engine = createCloudSync({
  projectId: 'life',
  tables: [weeksTable, entriesTable, dayFocusTable],
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

/**
 * Cancel a focus item: drops it from the week's plan. Its done-entry (if any)
 * is kept, like entries whose ref left the plan on import.
 */
export async function removeFocus(week: string, focusId: string): Promise<void> {
  const row = await db.lifeWeeks.get(week)
  if (!row) return
  await engine.upsert('life_weeks', {
    ...row,
    plan: {
      ...row.plan,
      focus: row.plan.focus.filter((f) => f.id !== focusId),
    },
    updatedAt: Date.now(),
  })
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

/**
 * "Used it today" for the week's playbook practice: a new append-only row
 * (like a tracker +1; random id, deleted on Undo). The optional note is
 * trimmed and capped at LIFE_CAPS.playbookNote (throws if longer).
 */
export async function logPlaybook(
  week: string,
  opts: { day?: string; note?: string } = {},
): Promise<LifePlaybookEntry> {
  const note = (opts.note ?? '').trim()
  if (note.length > LIFE_CAPS.playbookNote) throw new Error(`Keep the note under ${LIFE_CAPS.playbookNote} characters`)
  const now = Date.now()
  const entry: LifePlaybookEntry = {
    id: crypto.randomUUID(),
    week,
    kind: 'playbook',
    ref: 'playbook',
    day: opts.day ?? dayKey(new Date()),
    value: note ? { note } : {},
    createdAt: now,
    updatedAt: now,
  }
  await engine.upsert('life_entries', entry)
  return entry
}

/** Set, replace or clear (empty) the note of an existing playbook use. */
export async function setPlaybookNote(entry: LifePlaybookEntry, noteIn: string): Promise<void> {
  const note = noteIn.trim()
  if (note.length > LIFE_CAPS.playbookNote) throw new Error(`Keep the note under ${LIFE_CAPS.playbookNote} characters`)
  await engine.upsert('life_entries', {
    ...entry,
    value: note ? { note } : {},
    updatedAt: Date.now(),
  })
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

/** Remove a tracker or playbook +1 (Undo). Only those append-only rows are ever deleted. */
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

/**
 * Spock test: why a habit missed its weekly target. A keyed entry
 * (`${week}:why:${trackerId}`), updated in place; an empty reason clears it
 * (the row is kept with an empty reason, so two devices converge by LWW).
 */
export async function setWhy(week: string, trackerId: string, reasonIn: string): Promise<void> {
  const reason = reasonIn.trim()
  if (reason.length > LIFE_CAPS.whyReason) throw new Error(`Keep the reason under ${LIFE_CAPS.whyReason} characters`)
  const id = entryId(week, 'why', trackerId)
  const prev = await existing<LifeWhyEntry>(id)
  if (!prev && !reason) return
  const now = Date.now()
  const entry: LifeWhyEntry = {
    id,
    week,
    kind: 'why',
    ref: trackerId,
    day: dayKey(new Date()),
    value: { reason },
    createdAt: prev?.createdAt ?? now,
    updatedAt: now,
  }
  await engine.upsert('life_entries', entry)
}

/** Add an idea for a habit (status 'open'). Blank text is ignored (returns null). */
export async function addIdea(week: string, trackerId: string, textIn: string): Promise<LifeIdeaEntry | null> {
  const text = textIn.trim()
  if (!text) return null
  if (text.length > LIFE_CAPS.ideaText) throw new Error(`Keep the idea under ${LIFE_CAPS.ideaText} characters`)
  const now = Date.now()
  const entry: LifeIdeaEntry = {
    id: crypto.randomUUID(),
    week,
    kind: 'idea',
    ref: trackerId,
    day: dayKey(new Date()),
    value: { text, status: 'open' },
    createdAt: now,
    updatedAt: now,
  }
  await engine.upsert('life_entries', entry)
  return entry
}

/** Change an idea's text and/or status. An empty text is ignored (use removeIdea). */
export async function updateIdea(
  entry: LifeIdeaEntry,
  change: { text?: string; status?: LifeIdeaStatus },
): Promise<void> {
  const text = change.text === undefined ? entry.value.text : change.text.trim()
  if (!text) return
  if (text.length > LIFE_CAPS.ideaText) throw new Error(`Keep the idea under ${LIFE_CAPS.ideaText} characters`)
  const status = change.status ?? entry.value.status
  if (text === entry.value.text && status === entry.value.status) return
  await engine.upsert('life_entries', { ...entry, value: { text, status }, updatedAt: Date.now() })
}

/** Delete an idea for real. */
export async function removeIdea(id: string): Promise<void> {
  await engine.remove('life_entries', id)
}

/**
 * Upgrade list: add an item (status 'open'; size defaults to 'quick'). Blank
 * text is ignored (returns null). `week` is the week it is added in.
 */
export async function addUpgrade(
  week: string,
  textIn: string,
  size: LifeUpgradeSize = 'quick',
): Promise<LifeUpgradeEntry | null> {
  const text = textIn.trim()
  if (!text) return null
  if (text.length > LIFE_CAPS.upgradeText) throw new Error(`Keep it under ${LIFE_CAPS.upgradeText} characters`)
  const now = Date.now()
  const day = dayKey(new Date())
  const entry: LifeUpgradeEntry = {
    id: crypto.randomUUID(),
    week,
    kind: 'upgrade',
    ref: 'upgrade',
    day,
    value: { text, size, status: 'open' },
    createdAt: now,
    updatedAt: now,
  }
  await engine.upsert('life_entries', entry)
  return entry
}

/**
 * Change an upgrade's text, size and/or status. Setting 'done' stamps `doneAt`
 * (today, or `doneAt`); leaving 'done' (undo, drop) clears it. An empty text is
 * ignored (use removeUpgrade). A no-op writes nothing.
 */
export async function updateUpgrade(
  entry: LifeUpgradeEntry,
  change: { text?: string; size?: LifeUpgradeSize; status?: LifeUpgradeStatus; doneAt?: string },
): Promise<void> {
  const text = change.text === undefined ? entry.value.text : change.text.trim()
  if (!text) return
  if (text.length > LIFE_CAPS.upgradeText) throw new Error(`Keep it under ${LIFE_CAPS.upgradeText} characters`)
  const size = change.size ?? entry.value.size
  const status = change.status ?? entry.value.status
  const value: LifeUpgradeEntry['value'] = { text, size, status }
  if (status === 'done') {
    const doneAt = entry.value.status === 'done' ? entry.value.doneAt : (change.doneAt ?? dayKey(new Date()))
    if (doneAt) value.doneAt = doneAt
  }
  if (
    value.text === entry.value.text &&
    value.size === entry.value.size &&
    value.status === entry.value.status &&
    value.doneAt === entry.value.doneAt
  )
    return
  await engine.upsert('life_entries', { ...entry, value, updatedAt: Date.now() })
}

/** Delete an upgrade for real. */
export async function removeUpgrade(id: string): Promise<void> {
  await engine.remove('life_entries', id)
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

// --- Today's focus ("Focus di oggi") ----------------------------------------

/**
 * Add focus lines to a day, each into the lowest free slot, up to
 * LIFE_CAPS.dayFocus per day. Blank titles are skipped, titles are trimmed and
 * capped. Returns how many were added (the rest did not fit).
 */
export async function addDayFocus(day: string, titles: string[]): Promise<number> {
  const clean = titles.map((t) => t.trim().slice(0, LIFE_CAPS.dayFocusTitle)).filter((t) => t.length > 0)
  const rows = await db.lifeDayFocus.where('day').equals(day).toArray()
  const slots = freeSlots(rows.map((r) => r.slot))
  const now = Date.now()
  const added = clean.slice(0, slots.length).map((title, i): LifeDayFocus => ({
    id: dayFocusId(day, slots[i] ?? 0),
    day,
    slot: slots[i] ?? 0,
    title,
    done: false,
    createdAt: now,
    updatedAt: now,
  }))
  if (added.length > 0) await engine.upsertMany('life_day_focus', added)
  return added.length
}

/**
 * Make a day's focus exactly `titles` (the /oggi command's result): slot i
 * gets titles[i], a line that is unchanged keeps its done state, slots past
 * the end are deleted. Blank titles are skipped, at most LIFE_CAPS.dayFocus.
 */
export async function setDayFocus(day: string, titles: string[]): Promise<void> {
  const clean = titles
    .map((t) => t.trim().slice(0, LIFE_CAPS.dayFocusTitle))
    .filter((t) => t.length > 0)
    .slice(0, LIFE_CAPS.dayFocus)
  const prev = await db.lifeDayFocus.where('day').equals(day).toArray()
  const bySlot = new Map(prev.map((r) => [r.slot, r]))
  const now = Date.now()
  const rows = clean.flatMap((title, slot): LifeDayFocus[] => {
    const old = bySlot.get(slot)
    if (old && old.title === title) return []
    return [
      {
        id: dayFocusId(day, slot),
        day,
        slot,
        title,
        done: false,
        createdAt: old?.createdAt ?? now,
        updatedAt: now,
      },
    ]
  })
  if (rows.length > 0) await engine.upsertMany('life_day_focus', rows)
  const stale = prev.filter((r) => r.slot >= clean.length).map((r) => r.id)
  if (stale.length > 0) await engine.removeMany('life_day_focus', stale)
}

/** Tick / untick a day-focus line. Returns the new state (null if it is gone). */
export async function toggleDayFocus(id: string): Promise<boolean | null> {
  const row = await db.lifeDayFocus.get(id)
  if (!row) return null
  await engine.upsert('life_day_focus', {
    ...row,
    done: !row.done,
    updatedAt: Date.now(),
  })
  return !row.done
}

/** Rename a day-focus line. An empty title is ignored (use removeDayFocus). */
export async function editDayFocus(id: string, title: string): Promise<void> {
  const row = await db.lifeDayFocus.get(id)
  const next = title.trim().slice(0, LIFE_CAPS.dayFocusTitle)
  if (!row || !next || next === row.title) return
  await engine.upsert('life_day_focus', {
    ...row,
    title: next,
    updatedAt: Date.now(),
  })
}

/** Delete a day-focus line (its slot becomes free). */
export async function removeDayFocus(id: string): Promise<void> {
  await engine.remove('life_day_focus', id)
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
