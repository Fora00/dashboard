// Turns a habit's stored check rows into the per-day states the stats and the
// views read. Two derived behaviours live here, nowhere else:
//  - multi-tap habits (perDay > 1): a day is done only when its taps reach
//    perDay; fewer taps is progress, not a state; taps past perDay are the
//    overshoot (any habit: a day with count 2 on a once-a-day habit = done twice);
//  - "don't" habits (direction 'avoid'): a day is kept unless a slip ('fail')
//    is marked, but only on days the app was used at all (any habit logged
//    that day). Otherwise a stopped log would look like a perfect streak.

import type { Habit, HabitCheck, HabitDayState } from '../../lib/db'
import { dayKey } from './habitStore'
import { shiftDayKey } from './habitStats'

export interface HabitDays {
  states: Map<string, HabitDayState>
  notes: Map<string, string>
  /** Taps so far per day: partial days of multi-tap habits, and done days (past perDay = overshoot). */
  counts: Map<string, number>
  /** Slips per day for a "don't" habit with a daily grace. */
  slips: Map<string, number>
}

export function habitDayStates(
  habit: Habit,
  checks: readonly HabitCheck[],
  activeDays: ReadonlySet<string>,
  today: string,
): HabitDays {
  const states = new Map<string, HabitDayState>()
  const notes = new Map<string, string>()
  const counts = new Map<string, number>()
  const slips = new Map<string, number>()
  const perDay = habit.perDay ?? 1
  for (const c of checks) {
    if (c.habitId !== habit.id) continue
    if (c.note) notes.set(c.day, c.note)
    if (habit.direction === 'avoid' && habit.graceScope === 'day' && c.status === 'fail') {
      // Each tap is a slip: within the daily grace the day is kept (like a floor day), past it it is a slip.
      // A tap on the tile writes a count; a miss marked by hand (calendar) has none and is a full slip.
      const n = c.count ?? (habit.grace ?? 0) + 1
      slips.set(c.day, n)
      states.set(c.day, n <= (habit.grace ?? 0) ? 'floor' : 'fail')
    } else if (c.status === undefined && habit.direction !== 'avoid') {
      // No count = marked done by hand (the goal exactly); a count past perDay is an overshoot.
      const n = c.count ?? perDay
      counts.set(c.day, n)
      if (n >= perDay) states.set(c.day, 'done')
    } else {
      states.set(c.day, c.status ?? 'done')
    }
  }
  if (habit.direction === 'avoid') {
    const marked = [...states.keys()].sort()[0]
    const created = dayKey(new Date(habit.createdAt))
    let from = marked && marked < created ? marked : created
    if (habit.cycleStart && habit.cycleStart < from) from = habit.cycleStart
    for (let day = from; day <= today; day = shiftDayKey(day, 1)) {
      if (!states.has(day) && (activeDays.has(day) || day === today)) states.set(day, 'done')
    }
  }
  return { states, notes, counts, slips }
}

/** Days on which any habit has a check: proof the app was used that day. */
export function activeDaysOf(checks: readonly HabitCheck[]): Set<string> {
  return new Set(checks.map((c) => c.day))
}
