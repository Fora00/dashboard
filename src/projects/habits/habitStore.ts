// Pure date helpers for the Habits project. Days are 'YYYY-MM-DD' strings in
// the device's local time zone, so a check belongs to the calendar day the
// user actually saw (no UTC drift around midnight). Mutation helpers live in
// src/lib/habitSync.ts (local-first, optionally cloud-synced).

import type { Habit } from '../../lib/db'
import { dayKey } from '../../lib/dates'
// dayKey lives in src/lib/dates.ts (shared with Life); re-exported so Habits
// imports are untouched.
export { dayKey }

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

/** The first day a habit counts from: the earliest of its creation day, its
 *  cycle start and its first marked day (history imported from before). One
 *  definition for the day states, the recap and the stats. */
export function habitStartDay(
  habit: Pick<Habit, 'createdAt' | 'cycleStart'>,
  markedDays: Iterable<string> = [],
): string {
  let start = dayKey(new Date(habit.createdAt))
  if (habit.cycleStart && habit.cycleStart < start) start = habit.cycleStart
  for (const d of markedDays) if (d < start) start = d
  return start
}

/** The last day a habit counts: the day it was archived, or its cycle end once
 *  the cycle is closed. undefined = still running. A cycle end alone is not an
 *  end: habits keep running past it until judged (verdict up / stay / down). */
export function habitEndDay(habit: Pick<Habit, 'archivedAt' | 'cycleEnd' | 'verdict'>): string | undefined {
  const archived = habit.archivedAt !== undefined ? dayKey(new Date(habit.archivedAt)) : undefined
  const closed = habit.verdict === 'closed' ? habit.cycleEnd : undefined
  if (archived && closed) return archived < closed ? archived : closed
  return archived ?? closed
}
