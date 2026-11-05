import {
  db,
  type LifeAnswer,
  type LifeCheckinEntry,
  type LifeDayFocus,
  type LifeEngine,
  type LifeEngineKey,
  type LifeEntry,
  type LifeFocusEntry,
  type LifeIdeaEntry,
  type LifeIdeaStatus,
  type LifePlan,
  type LifePlaybookEntry,
  type LifeSentEntry,
  type LifeChoreEntry,
  type LifeChoreValue,
  type LifeStreakEntry,
  type LifeStreakValue,
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
  addDays,
  dayFocusId,
  freeUrgentSlots,
  splitUrgent,
  dayKey,
  emptyEngine,
  engineId,
  entryId,
  isEngineKey,
  isEngineScore,
  isMonthKey,
  normalizeIceberg,
  planLead,
  type IcebergInput,
  freeSlots,
  isEnergy,
  planChoreImport,
  planStreakImport,
  toggleChoreValue,
  cancelChoreValue,
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
//   life_engines  Life Engines (Life → Month): one row per month and engine, id
//                 `${YYYY-MM}:${engine}`, edited in place, never deleted.
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
  cancelled: boolean
  created_at: number
  updated_at: number
}

const dayFocusTable: TableSync<LifeDayFocus, LifeDayFocusRow> = {
  remote: 'life_day_focus',
  table: () => db.lifeDayFocus,
  columns: 'id, day, slot, title, done, cancelled, created_at, updated_at',
  realtime: true,
  updatedAt: (f) => f.updatedAt,
  toRow: (f) => ({
    id: f.id,
    day: f.day,
    slot: f.slot,
    title: f.title,
    done: f.done,
    cancelled: f.cancelled ?? false,
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
      ...(r.cancelled ? { cancelled: true } : {}),
      createdAt: Number(r.created_at),
      updatedAt: Number(r.updated_at),
    }
  },
}

interface LifeEngineRow {
  id: string
  month: string
  engine: string
  score: number | null
  lead: boolean
  event: string
  pattern: string
  system: string
  belief: string
  whys: string[]
  lever: string
  link: string
  updated_at: number
}

const enginesTable: TableSync<LifeEngine, LifeEngineRow> = {
  remote: 'life_engines',
  table: () => db.lifeEngines,
  columns: 'id, month, engine, score, lead, event, pattern, system, belief, whys, lever, link, updated_at',
  realtime: true,
  updatedAt: (e) => e.updatedAt,
  toRow: (e) => ({
    id: e.id,
    month: e.month,
    engine: e.engine,
    score: e.score ?? null,
    lead: e.lead === true,
    event: e.event ?? '',
    pattern: e.pattern ?? '',
    system: e.system ?? '',
    belief: e.belief ?? '',
    whys: e.whys ?? [],
    lever: e.lever ?? '',
    link: e.link ?? '',
    updated_at: e.updatedAt,
  }),
  fromRow: (r) => {
    if (!isMonthKey(r.month) || !isEngineKey(r.engine)) throw new Error('life_engines: bad row')
    const score = r.score === null || r.score === undefined ? null : Number(r.score)
    return {
      id: r.id,
      month: r.month,
      engine: r.engine,
      score: isEngineScore(score) ? score : null,
      lead: Boolean(r.lead),
      event: r.event ?? '',
      pattern: r.pattern ?? '',
      system: r.system ?? '',
      belief: r.belief ?? '',
      whys: Array.isArray(r.whys) ? r.whys.filter((w): w is string => typeof w === 'string') : [],
      lever: r.lever ?? '',
      link: r.link ?? '',
      updatedAt: Number(r.updated_at),
    }
  },
}

const engine = createCloudSync({
  projectId: 'life',
  tables: [weeksTable, entriesTable, dayFocusTable, enginesTable],
})

// --- Local mutations (used by the UI; safe with or without sync) -----------

/**
 * Save an imported week: replaces the week's plan entirely and never touches
 * the week's life_entries (entries whose ref left the plan are kept). When
 * `streaks` is given (the JSON's optional Streaks snapshot) the streak rows
 * are synced to it too (importStreaks). Re-validates, so
 * nothing invalid is ever written; throws with the errors otherwise.
 */
export async function importWeek(plan: LifePlan, streaks?: readonly LifeStreakValue[]): Promise<LifeWeek> {
  const result = validatePlan(streaks === undefined ? plan : { ...plan, streaks })
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
  if (result.streaks) await importStreaks(result.plan.week, result.streaks)
  return week
}

/**
 * "Start the week" from the phone: a minimal plan for `week` (no Mac, no
 * /settimana). Keeps the previous week's rules and Sunday questions (their
 * tracker links dropped); no focus, tasks, trackers or check-ins. Does nothing
 * when the week already has a plan.
 */
export async function startQuickWeek(week: string): Promise<boolean> {
  if (await db.lifeWeeks.get(week)) return false
  const prev = await db.lifeWeeks.get(addDays(week, -7))
  const plan = prev?.plan
  await importWeek({
    version: 1,
    week,
    focus: [],
    rules: plan?.rules ?? [],
    tasks: [],
    trackers: [],
    sundayCheck: (plan?.sundayCheck ?? []).map(({ id, label, type }) => ({
      id,
      label,
      type,
    })),
    checkins: [],
  } as LifePlan)
  return true
}

/**
 * Apply a Streaks-app snapshot (already validated by parseWeekJson/validatePlan):
 * upsert each habit by ref, delete the habits no longer in it. Unchanged
 * habits write nothing. See planStreakImport for the rules.
 */
export async function importStreaks(week: string, streaks: readonly LifeStreakValue[]): Promise<void> {
  const existing = (await db.lifeEntries.filter((e) => e.kind === 'streak').toArray()) as LifeStreakEntry[]
  const { upserts, deletes } = planStreakImport(existing, streaks, week, dayKey(new Date()), Date.now())
  for (const e of upserts) await engine.upsert('life_entries', e)
  for (const id of deletes) await engine.remove('life_entries', id)
}

/**
 * Apply a chores snapshot (the /oggi link, already validated): upsert each
 * chore by ref, delete the ones no longer in it. See planChoreImport.
 */
export async function importChores(week: string, chores: readonly LifeChoreValue[]): Promise<void> {
  const existing = (await db.lifeEntries.filter((e) => e.kind === 'chore').toArray()) as LifeChoreEntry[]
  const { upserts, deletes } = planChoreImport(existing, chores, week, dayKey(new Date()), Date.now())
  for (const e of upserts) await engine.upsert('life_entries', e)
  for (const id of deletes) await engine.remove('life_entries', id)
}

/** Tick / untick a chore (a recurring one also moves its counter). Returns the new `done` (null if gone). */
export async function toggleChore(id: string): Promise<boolean | null> {
  const row = await db.lifeEntries.get(id)
  if (!row || row.kind !== 'chore') return null
  const value = toggleChoreValue(row.value, dayKey(new Date()))
  await engine.upsert('life_entries', { ...row, value, updatedAt: Date.now() })
  return value.done
}

/** Cancel / restore a chore for today (Things-style). Returns false if gone or already done. */
export async function toggleChoreCancelled(id: string): Promise<boolean> {
  const row = await db.lifeEntries.get(id)
  if (!row || row.kind !== 'chore') return false
  const value = cancelChoreValue(row.value, dayKey(new Date()))
  if (value === row.value) return false
  await engine.upsert('life_entries', { ...row, value, updatedAt: Date.now() })
  return true
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

/** Add a weekly-focus line from the app (max LIFE_CAPS.focus). Returns false if full/blank/duplicate. */
export async function addFocus(week: string, titleIn: string): Promise<boolean> {
  const row = await db.lifeWeeks.get(week)
  const title = titleIn.trim().slice(0, LIFE_CAPS.focusTitle)
  if (!row || title.length === 0) return false
  if (row.plan.focus.length >= LIFE_CAPS.focus || row.plan.focus.some((f) => f.title === title)) return false
  await engine.upsert('life_weeks', {
    ...row,
    plan: {
      ...row.plan,
      focus: [...row.plan.focus, { id: crypto.randomUUID().slice(0, 8), title }],
    },
    updatedAt: Date.now(),
  })
  return true
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

/** Cancel / restore a focus item (Things-style: kept, struck through, out of the counts). */
export async function toggleFocusCancelled(week: string, focusId: string): Promise<void> {
  const id = entryId(week, 'focus', focusId)
  const prev = await existing<LifeFocusEntry>(id)
  const now = Date.now()
  const entry: LifeFocusEntry = {
    id,
    week,
    kind: 'focus',
    ref: focusId,
    day: dayKey(new Date()),
    value: prev?.value.cancelled ? { done: false } : { done: false, cancelled: true },
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
  await engine.upsert('life_entries', {
    ...entry,
    value: { text, status },
    updatedAt: Date.now(),
  })
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
  change: {
    text?: string
    size?: LifeUpgradeSize
    status?: LifeUpgradeStatus
    doneAt?: string
  },
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
  await engine.upsert('life_entries', {
    ...entry,
    value,
    updatedAt: Date.now(),
  })
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
 * Add lines to a day WITHOUT touching the ones already there: each goes into
 * the lowest free slot (focus 0-2, or 3-8 for "!"-prefixed urgent lines).
 * Blank titles and titles the day already has are skipped; titles are trimmed
 * and capped. Returns how many were added (the rest did not fit).
 */
export async function addDayFocus(day: string, titles: string[]): Promise<number> {
  const rows = await db.lifeDayFocus.where('day').equals(day).toArray()
  const seen = new Set(rows.map((r) => r.title))
  const focus = freeSlots(rows.map((r) => r.slot))
  const urgent = freeUrgentSlots(rows.map((r) => r.slot))
  const now = Date.now()
  const added: LifeDayFocus[] = []
  for (const raw of titles) {
    const { urgent: isUrgent, title: t } = splitUrgent(raw)
    const title = t.slice(0, LIFE_CAPS.dayFocusTitle)
    if (title.length === 0 || seen.has(title)) continue
    const slot = (isUrgent ? urgent : focus).shift()
    if (slot === undefined) continue
    seen.add(title)
    added.push({
      id: dayFocusId(day, slot),
      day,
      slot,
      title,
      done: false,
      createdAt: now,
      updatedAt: now,
    })
  }
  if (added.length > 0) await engine.upsertMany('life_day_focus', added)
  return added.length
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

/** Cancel / restore a day-focus line (Things-style). Cancelling clears done. */
export async function toggleDayFocusCancelled(id: string): Promise<void> {
  const row = await db.lifeDayFocus.get(id)
  if (!row) return
  const { cancelled: _was, ...rest } = row
  await engine.upsert('life_day_focus', {
    ...rest,
    ...(row.cancelled ? {} : { cancelled: true, done: false }),
    updatedAt: Date.now(),
  })
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

// --- Life Engines (Life → Month) --------------------------------------------

function checkEngine(month: string, key: LifeEngineKey): void {
  if (!isMonthKey(month)) throw new Error(`Not a month: ${month}`)
  if (!isEngineKey(key)) throw new Error(`Not an engine: ${String(key)}`)
}

async function engineRow(month: string, key: LifeEngineKey, now: number): Promise<LifeEngine> {
  return (await db.lifeEngines.get(engineId(month, key))) ?? emptyEngine(month, key, now)
}

/** Set (1-10) or clear (null) an engine's score for a month. A no-op writes nothing. */
export async function setEngineScore(month: string, key: LifeEngineKey, score: number | null): Promise<void> {
  checkEngine(month, key)
  if (score !== null && !isEngineScore(score)) throw new Error('The score is a whole number from 1 to 10')
  const now = Date.now()
  const row = await engineRow(month, key, now)
  if (row.score === score) return
  await engine.upsert('life_engines', { ...row, score, updatedAt: now })
}

/**
 * Make an engine the month's lead (clearing any other lead of that month, so
 * there is at most one) or drop its lead flag.
 */
export async function setEngineLead(month: string, key: LifeEngineKey, lead: boolean): Promise<void> {
  checkEngine(month, key)
  const rows = await db.lifeEngines.where('month').equals(month).toArray()
  const changes = planLead(rows, month, key, lead, Date.now())
  if (changes.length > 0) await engine.upsertMany('life_engines', changes)
}

/**
 * Save an engine's iceberg (layers, whys, lever, link): trimmed and capped by
 * normalizeIceberg; score and lead are kept. A no-op writes nothing.
 */
export async function saveEngineIceberg(month: string, key: LifeEngineKey, input: IcebergInput): Promise<void> {
  checkEngine(month, key)
  const now = Date.now()
  const row = await engineRow(month, key, now)
  const next = normalizeIceberg(input)
  const same =
    next.event === row.event &&
    next.pattern === row.pattern &&
    next.system === row.system &&
    next.belief === row.belief &&
    next.lever === row.lever &&
    next.link === row.link &&
    next.whys.length === row.whys.length &&
    next.whys.every((w, i) => w === row.whys[i])
  if (same) return
  await engine.upsert('life_engines', { ...row, ...next, updatedAt: now })
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
