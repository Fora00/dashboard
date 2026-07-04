import { db, type Habit, type HabitCheck } from './db'
import { createCloudSync, type TableSync } from './cloudSync'

// Local-first sync for the habits project, built on the generic engine in
// cloudSync.ts. Copies the todo reference integration (src/lib/todoSync.ts):
//   1. define the remote row type + a TableSync per table (mappers, columns),
//   2. createCloudSync({ projectId, tables }),
//   3. export mutation helpers the UI calls instead of raw Dexie writes,
//   4. export startHabitSync = engine.start and wire it in App.tsx.

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

const engine = createCloudSync({
  projectId: 'habits',
  tables: [habitsTable, habitChecksTable],
})

// --- Local mutations (used by the UI; safe with or without sync) -----------

export async function addHabit(name: string, emoji: string): Promise<Habit> {
  const habit: Habit = {
    id: crypto.randomUUID(),
    name,
    emoji: emoji || '✅',
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
  await db.transaction('rw', db.habits, db.habitChecks, db.outbox, async () => {
    await db.habitChecks.where('habitId').equals(habit.id).delete()
    await db.habits.delete(habit.id)
    await db.outbox.add({ table: 'habits', op: 'delete', rowId: habit.id, ts: Date.now() })
  })
  void engine.flush()
}

// Flip a habit's done state for one day (used for today's check-off).
export async function toggleCheck(habitId: string, day: string): Promise<void> {
  const existing = await db.habitChecks.where('[habitId+day]').equals([habitId, day]).first()
  if (existing) {
    await engine.remove('habit_checks', existing.id)
  } else {
    const check: HabitCheck = {
      id: crypto.randomUUID(),
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

/** Start syncing (call when a session exists). Returns a stop function. */
export const startHabitSync = engine.start
