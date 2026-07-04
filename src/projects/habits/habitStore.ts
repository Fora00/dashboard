import { db, type Habit } from '../../lib/db'

// Local-only data helpers for the Habits project. Days are 'YYYY-MM-DD'
// strings in the device's local time zone, so a check belongs to the calendar
// day the user actually saw (no UTC drift around midnight).

export function dayKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function shiftDay(date: Date, days: number): Date {
  const copy = new Date(date)
  copy.setDate(copy.getDate() + days)
  return copy
}

// The last `n` day keys ending today, oldest first.
export function lastDays(n: number, today = new Date()): string[] {
  return Array.from({ length: n }, (_, i) => dayKey(shiftDay(today, i - (n - 1))))
}

// Consecutive done-days ending today or yesterday (a streak survives until
// the end of today, so it isn't shown as broken before you've had the chance
// to check off the current day).
export function streak(doneDays: ReadonlySet<string>, today = new Date()): number {
  let cursor = doneDays.has(dayKey(today)) ? today : shiftDay(today, -1)
  let count = 0
  while (doneDays.has(dayKey(cursor))) {
    count++
    cursor = shiftDay(cursor, -1)
  }
  return count
}

export async function addHabit(name: string, emoji: string): Promise<Habit> {
  const habit: Habit = {
    id: crypto.randomUUID(),
    name,
    emoji: emoji || '✅',
    createdAt: Date.now(),
  }
  await db.habits.add(habit)
  return habit
}

export async function setArchived(habit: Habit, archived: boolean): Promise<void> {
  await db.habits.update(habit.id, { archivedAt: archived ? Date.now() : undefined })
}

// Deleting a habit also drops its check history.
export async function deleteHabit(habit: Habit): Promise<void> {
  await db.transaction('rw', db.habits, db.habitChecks, async () => {
    await db.habitChecks.where('habitId').equals(habit.id).delete()
    await db.habits.delete(habit.id)
  })
}

// Flip a habit's done state for one day (used for today's check-off).
export async function toggleCheck(habitId: string, day: string): Promise<void> {
  await db.transaction('rw', db.habitChecks, async () => {
    const existing = await db.habitChecks
      .where('[habitId+day]')
      .equals([habitId, day])
      .first()
    if (existing) {
      await db.habitChecks.delete(existing.id)
    } else {
      await db.habitChecks.add({
        id: crypto.randomUUID(),
        habitId,
        day,
        createdAt: Date.now(),
      })
    }
  })
}
