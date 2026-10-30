import { db, type Habit, type HabitCheck, type HabitDayState, type HabitKind, type HabitVerdict } from './db'
import { createCloudSync, type TableSync } from './cloudSync'
import { useSyncStatus } from './useSyncStatus'
import { uuidV5 } from './uuidV5'

// Local-first sync for the habits project, built on the generic engine in
// cloudSync.ts. Copies the todo reference integration (src/lib/todoSync.ts):
//   1. define the remote row type + a TableSync per table (mappers, columns),
//   2. createCloudSync({ projectId, tables }),
//   3. export mutation helpers the UI calls instead of raw Dexie writes,
//   4. export startHabitSync = engine.start and wire it in App.tsx.

// Caps — MUST match the CHECK constraints in
// supabase/migrations/20260930160100_text_caps.sql and the inputs' maxLength.
export const MAX_NAME_LENGTH = 300
export const MAX_EMOJI_LENGTH = 8
export const MAX_TEXT_LENGTH = 300 // anchor, normal, floor, why
export const MAX_NOTE_LENGTH = 100
export const MAX_PER_DAY = 20
export const MAX_GRACE = 7

/** Cap an emoji without leaving half a surrogate pair at the cut. */
export function clipEmoji(raw: string): string {
  return Array.from(raw.trim().slice(0, MAX_EMOJI_LENGTH))
    .filter((c) => c.length === 2 || !/[\ud800-\udfff]/.test(c))
    .join('')
}

interface HabitRow {
  id: string
  name: string
  emoji: string
  created_at: number
  archived_at: number | null
  anchor: string | null
  why: string | null
  social: string | null
  direction: string | null
  per_day: number | null
  grace: number | null
  grace_scope: string | null
  normal: string | null
  floor: string | null
  target: number | null
  kind: string | null
  cycle_start: string | null
  cycle_end: string | null
  verdict: string | null
}

interface HabitCheckRow {
  id: string
  habit_id: string
  day: string
  created_at: number
  status: string | null
  note: string | null
  count: number | null
}

const habitsTable: TableSync<Habit, HabitRow> = {
  remote: 'habits',
  table: () => db.habits,
  columns:
    'id, name, emoji, created_at, archived_at, anchor, why, social, direction, per_day, grace, grace_scope, normal, floor, target, kind, cycle_start, cycle_end, verdict',
  realtime: true,
  toRow: (h) => ({
    id: h.id,
    name: h.name,
    emoji: h.emoji,
    created_at: h.createdAt,
    archived_at: h.archivedAt ?? null,
    anchor: h.anchor ?? null,
    why: h.why ?? null,
    social: h.social ?? null,
    direction: h.direction ?? null,
    per_day: h.perDay ?? null,
    grace: h.grace ?? null,
    grace_scope: h.graceScope ?? null,
    normal: h.normal ?? null,
    floor: h.floor ?? null,
    target: h.target ?? null,
    kind: h.kind ?? null,
    cycle_start: h.cycleStart ?? null,
    cycle_end: h.cycleEnd ?? null,
    verdict: h.verdict ?? null,
  }),
  fromRow: (r) => ({
    id: r.id,
    name: r.name,
    emoji: r.emoji,
    createdAt: Number(r.created_at),
    archivedAt: r.archived_at == null ? undefined : Number(r.archived_at),
    anchor: r.anchor ?? undefined,
    why: r.why ?? undefined,
    social: r.social === 'person' || r.social === 'alone' ? r.social : undefined,
    direction: r.direction === 'avoid' ? 'avoid' : r.direction === 'do' ? 'do' : undefined,
    perDay: r.per_day == null ? undefined : Number(r.per_day),
    grace: r.grace == null ? undefined : Number(r.grace),
    graceScope: r.grace_scope === 'day' || r.grace_scope === 'week' ? r.grace_scope : undefined,
    normal: r.normal ?? undefined,
    floor: r.floor ?? undefined,
    target: r.target == null ? undefined : Number(r.target),
    kind: (r.kind as HabitKind | null) ?? undefined,
    cycleStart: r.cycle_start ?? undefined,
    cycleEnd: r.cycle_end ?? undefined,
    verdict: (r.verdict as HabitVerdict | null) ?? undefined,
  }),
}

const habitChecksTable: TableSync<HabitCheck, HabitCheckRow> = {
  remote: 'habit_checks',
  table: () => db.habitChecks,
  columns: 'id, habit_id, day, created_at, status, note, count',
  realtime: true,
  // unique (habit_id, day) on the server: a 23505 means another device already
  // checked this habit that day — the check is done, not rejected. Only hit
  // by checks created before ids became deterministic (checkId below).
  uniqueViolationIsDone: true,
  toRow: (c) => ({
    id: c.id,
    habit_id: c.habitId,
    day: c.day,
    created_at: c.createdAt,
    status: c.status ?? null,
    note: c.note ?? null,
    count: c.count ?? null,
  }),
  fromRow: (r) => ({
    id: r.id,
    habitId: r.habit_id,
    day: r.day,
    createdAt: Number(r.created_at),
    note: r.note ?? undefined,
    count: r.count == null ? undefined : Number(r.count),
    status: r.status === 'floor' || r.status === 'skip' || r.status === 'fail' ? r.status : undefined,
  }),
}

// Namespace for check ids. NEVER change it: every device must derive the same
// id for the same habit and day.
const CHECK_NAMESPACE = '49999a17-c149-43cc-a38c-1cef5b0d684b'

/** The id of the check of `habitId` on `day`: the same on every device, so the
 *  same habit checked offline on two devices is ONE server row (an upsert of
 *  the same id), never a unique (habit_id, day) violation. */
export function checkId(habitId: string, day: string): string {
  return uuidV5(`${habitId}|${day}`, CHECK_NAMESPACE)
}

/** Collapse local duplicate checks (same habit and day, different ids — left
 *  by random ids before checkId existed) into one. Keeps the server's copy
 *  (no outbox entry) if any, else the deterministic id, else the oldest; the
 *  others and their outbox entries go, locally only (the server can't hold a
 *  second row for the same habit and day, so there is nothing to delete
 *  there). Runs after every pull. */
export async function dedupeChecks(): Promise<void> {
  await db.transaction('rw', db.habitChecks, db.outbox, async () => {
    const groups = new Map<string, HabitCheck[]>()
    for (const c of await db.habitChecks.toArray()) {
      const key = `${c.habitId}|${c.day}`
      const g = groups.get(key)
      if (g) g.push(c)
      else groups.set(key, [c])
    }
    const dupes = [...groups.values()].filter((g) => g.length > 1)
    if (dupes.length === 0) return
    const queued = new Set(
      (
        await db.outbox
          .where('rowId')
          .anyOf(dupes.flat().map((c) => c.id))
          .toArray()
      )
        .filter((e) => e.table === 'habit_checks')
        .map((e) => e.rowId),
    )
    const rank = (c: HabitCheck) => [queued.has(c.id) ? 1 : 0, c.id === checkId(c.habitId, c.day) ? 0 : 1, c.createdAt]
    const drop: string[] = []
    for (const g of dupes) {
      const sorted = [...g].sort((a, b) => {
        const ra = rank(a)
        const rb = rank(b)
        for (let i = 0; i < ra.length; i++) if (ra[i] !== rb[i]) return ra[i]! - rb[i]!
        return 0
      })
      for (const c of sorted.slice(1)) drop.push(c.id)
    }
    await db.habitChecks.bulkDelete(drop)
    const dropSet = new Set(drop)
    const entries = await db.outbox.where('rowId').anyOf(drop).toArray()
    await db.outbox.bulkDelete(
      entries.filter((e) => e.table === 'habit_checks' && dropSet.has(e.rowId)).map((e) => e.seq!),
    )
  })
}

const engine = createCloudSync({
  projectId: 'habits',
  tables: [habitsTable, habitChecksTable],
  afterPull: dedupeChecks,
})

// --- Local mutations (used by the UI; safe with or without sync) -----------

export type HabitDetails = Partial<
  Pick<
    Habit,
    | 'anchor'
    | 'why'
    | 'social'
    | 'direction'
    | 'perDay'
    | 'grace'
    | 'graceScope'
    | 'normal'
    | 'floor'
    | 'target'
    | 'kind'
    | 'cycleStart'
    | 'cycleEnd'
    | 'verdict'
  >
>

function cleanDetails(d: HabitDetails): HabitDetails {
  const text = (v: string | undefined) => v?.trim().slice(0, MAX_TEXT_LENGTH) || undefined
  return {
    anchor: text(d.anchor),
    why: text(d.why),
    social: d.social,
    direction: d.direction,
    grace: d.grace === undefined ? undefined : Math.min(MAX_GRACE, Math.max(0, Math.round(d.grace))),
    graceScope: d.graceScope,
    perDay: d.perDay === undefined ? undefined : Math.min(MAX_PER_DAY, Math.max(1, Math.round(d.perDay))),
    normal: text(d.normal),
    floor: text(d.floor),
    target: d.target === undefined ? undefined : Math.min(7, Math.max(1, Math.round(d.target))),
    kind: d.kind,
    cycleStart: d.cycleStart || undefined,
    cycleEnd: d.cycleEnd || undefined,
    verdict: d.verdict,
  }
}

export async function addHabit(name: string, emoji: string, details: HabitDetails = {}): Promise<Habit> {
  const habit: Habit = {
    id: crypto.randomUUID(),
    name: name.trim().slice(0, MAX_NAME_LENGTH),
    emoji: clipEmoji(emoji) || '✅',
    createdAt: Date.now(),
    ...cleanDetails(details),
  }
  await engine.upsert('habits', habit)
  return habit
}

/** Edit a habit's name, emoji and cycle fields (pass every field: unset ones are cleared). */
export async function updateHabit(habit: Habit, name: string, emoji: string, details: HabitDetails): Promise<void> {
  const updated: Habit = {
    id: habit.id,
    createdAt: habit.createdAt,
    archivedAt: habit.archivedAt,
    name: name.trim().slice(0, MAX_NAME_LENGTH) || habit.name,
    emoji: clipEmoji(emoji) || habit.emoji,
    ...cleanDetails(details),
  }
  await engine.upsert('habits', updated)
}

export async function setArchived(habit: Habit, archived: boolean): Promise<void> {
  const updated: Habit = { ...habit, archivedAt: archived ? Date.now() : undefined }
  await engine.upsert('habits', updated)
}

// Deleting a habit also drops its check history. Server cascades checks on
// habit delete, so one tombstone is enough — but the local check rows must
// go too, in the same transaction.
export async function deleteHabit(habit: Habit): Promise<void> {
  await engine.removeCascade('habits', habit.id, [{ remote: 'habit_checks', key: 'habitId' }])
}

// Flip a habit's done state for one day (used for today's check-off).
// Unchecking removes EVERY check of that habit and day, so a leftover local
// duplicate can't keep the day checked.
export async function toggleCheck(habitId: string, day: string): Promise<void> {
  const existing = await db.habitChecks.where('[habitId+day]').equals([habitId, day]).primaryKeys()
  if (existing.length > 0) {
    await engine.removeMany('habit_checks', existing)
  } else {
    const check: HabitCheck = {
      id: checkId(habitId, day),
      habitId,
      day,
      createdAt: Date.now(),
    }
    await engine.upsert('habit_checks', check)
  }
}

/** Set a day's state (null clears it). A day has one state: setting one
 *  replaces whatever was there. 'done' is stored as no status. */
export async function setDayState(
  habitId: string,
  day: string,
  state: HabitDayState | null,
  note?: string,
): Promise<void> {
  const existing = await db.habitChecks.where('[habitId+day]').equals([habitId, day]).primaryKeys()
  if (existing.length > 0) await engine.removeMany('habit_checks', existing)
  if (state === null) return
  const check: HabitCheck = {
    id: checkId(habitId, day),
    habitId,
    day,
    createdAt: Date.now(),
    status: state === 'done' ? undefined : state,
    note: note?.slice(0, MAX_NOTE_LENGTH),
  }
  await engine.upsert('habit_checks', check)
}

/** Set how many slips a "don't" habit has on a day (0 clears it). Stored as a
 *  'fail' check with a count; whether it is within the daily grace is derived. */
export async function setSlipCount(habitId: string, day: string, slips: number, note?: string): Promise<void> {
  const existing = await db.habitChecks.where('[habitId+day]').equals([habitId, day]).toArray()
  const kept = note ?? existing.find((c) => c.note)?.note
  if (existing.length > 0)
    await engine.removeMany(
      'habit_checks',
      existing.map((c) => c.id),
    )
  if (slips <= 0) return
  await engine.upsert('habit_checks', {
    id: checkId(habitId, day),
    habitId,
    day,
    createdAt: Date.now(),
    status: 'fail',
    count: Math.min(99, Math.round(slips)),
    note: kept?.slice(0, MAX_NOTE_LENGTH),
  })
}

/** Set how many taps a multi-tap habit has today (0 clears the day). The day
 *  is done when the count reaches the habit's perDay: see habitDayStates. */
export async function setDayCount(habitId: string, day: string, count: number): Promise<void> {
  const existing = await db.habitChecks.where('[habitId+day]').equals([habitId, day]).primaryKeys()
  if (existing.length > 0) await engine.removeMany('habit_checks', existing)
  if (count <= 0) return
  await engine.upsert('habit_checks', {
    id: checkId(habitId, day),
    habitId,
    day,
    createdAt: Date.now(),
    count: Math.min(99, Math.round(count)),
  })
}

// --- Sync engine ------------------------------------------------------------

export const flush = engine.flush
export const syncNow = engine.syncNow

/** The sync engine instance — pass to <SyncCard sync={sync} /> for status UI. */
export const sync = engine

/** Bound React hook: this project's live SyncStatus. */
export const useStatus = () => useSyncStatus(engine)

/** Start syncing (call when a session exists). Returns a stop function. */
export const startHabitSync = engine.start
