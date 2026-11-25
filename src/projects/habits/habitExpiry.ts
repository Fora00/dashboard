// Habits whose cycle is about to end (or ended without a verdict): the
// "Scadenze" tab on /habits and in Life. Pure, Dexie-free.

import type { Habit } from '../../lib/db'
import { daysBetween } from './habitStats'

/** Days before `cycleEnd` a habit starts showing (owner, 2026-11-25). */
export const EXPIRING_WINDOW = 14

export interface ExpiringHabit {
  habit: Habit
  /** Days from today to cycleEnd: 0 = ends today, negative = ended that many days ago. */
  left: number
}

/** Active habits with a cycle end within `window` days, or past it with no
 *  verdict yet. Overdue first, then by end date, then by name. */
export function expiringHabits(habits: readonly Habit[], today: string, window = EXPIRING_WINDOW): ExpiringHabit[] {
  return habits
    .filter((h) => h.archivedAt === undefined && h.cycleEnd && !h.verdict)
    .map((habit) => ({ habit, left: daysBetween(today, habit.cycleEnd!) }))
    .filter((e) => e.left <= window)
    .sort((a, b) => a.left - b.left || a.habit.name.localeCompare(b.habit.name))
}

/** "finisce oggi", "finisce domani", "finisce tra 11 giorni", "scaduta da 3 giorni". */
export function expiringLabel(left: number): string {
  if (left === 0) return 'finisce oggi'
  if (left === 1) return 'finisce domani'
  if (left > 1) return `finisce tra ${left} giorni`
  return left === -1 ? 'scaduta ieri' : `scaduta da ${-left} giorni`
}
