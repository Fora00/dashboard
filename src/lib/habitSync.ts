import { db, type Habit, type HabitCheck } from './db'
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
}

interface HabitCheckRow {
  id: string
  habit_id: string
  day: string
  created_at: number
}

const habitsTable: TableSync<Habit, HabitRow> = {
  remote: 'habits',
  table: () => db.habits,
  columns: 'id, name, emoji, created_at, archived_at',
  realtime: true,
  toRow: (h) => ({
    id: h.id,
    name: h.name,
    emoji: h.emoji,
    created_at: h.createdAt,
    archived_at: h.archivedAt ?? null,
  }),
  fromRow: (r) => ({
    id: r.id,
    name: r.name,
    emoji: r.emoji,
    createdAt: Number(r.created_at),
    archivedAt: r.archived_at == null ? undefined : Number(r.archived_at),
  }),
}

const habitChecksTable: TableSync<HabitCheck, HabitCheckRow> = {
  remote: 'habit_checks',
  table: () => db.habitChecks,
  columns: 'id, habit_id, day, created_at',
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
  }),
  fromRow: (r) => ({
    id: r.id,
    habitId: r.habit_id,
    day: r.day,
    createdAt: Number(r.created_at),
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

export async function addHabit(name: string, emoji: string): Promise<Habit> {
  const habit: Habit = {
    id: crypto.randomUUID(),
    name: name.trim().slice(0, MAX_NAME_LENGTH),
    emoji: clipEmoji(emoji) || '✅',
    createdAt: Date.now(),
  }
  await engine.upsert('habits', habit)
  return habit
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

// --- Sync engine ------------------------------------------------------------

export const flush = engine.flush
export const syncNow = engine.syncNow

/** The sync engine instance — pass to <SyncCard sync={sync} /> for status UI. */
export const sync = engine

/** Bound React hook: this project's live SyncStatus. */
export const useStatus = () => useSyncStatus(engine)

/** Start syncing (call when a session exists). Returns a stop function. */
export const startHabitSync = engine.start
