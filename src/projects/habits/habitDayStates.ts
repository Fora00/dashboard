// Turns a habit's stored check rows into the per-day states the stats and the
// views read. Two derived behaviours live here, nowhere else:
//  - multi-tap habits (perDay > 1): a day is done only when its taps reach
//    perDay; fewer taps is progress, not a state; taps past perDay are the
//    overshoot (any habit: a day with count 2 on a once-a-day habit = done twice);
//  - "don't" habits (direction 'avoid'): a day is kept unless a slip ('fail')
//    is marked, but only on days the app was used at all (any habit logged
//    that day). Otherwise a stopped log would look like a perfect streak.

import type { Habit, HabitCheck, HabitDayState } from '../../lib/db'
import { habitEndDay, habitStartDay } from './habitStore'
import { shiftDayKey } from './habitStats'

export { habitEndDay, habitStartDay }

export interface HabitDays {
  states: Map<string, HabitDayState>
  notes: Map<string, string>
  /** Taps so far per day: partial days of multi-tap habits, and done days (past perDay = overshoot). */
  counts: Map<string, number>
  /** Slips per day for a "don't" habit (a plain miss counts 1; with a daily grace, each tap is one). */
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
    } else if (habit.direction === 'avoid' && c.status === 'fail') {
      // Weekly/no grace: a slip is a slip; extra slips the same day are logged as a count (overshoot).
      slips.set(c.day, c.count ?? 1)
      states.set(c.day, 'fail')
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
    // Kept days run from the start to today, never past the day the habit ended (archived).
    const from = habitStartDay(habit, states.keys())
    const end = habitEndDay(habit)
    const last = end !== undefined && end < today ? end : today
    for (let day = from; day <= last; day = shiftDayKey(day, 1)) {
      if (!states.has(day) && (activeDays.has(day) || day === today)) states.set(day, 'done')
    }
  }
  return { states, notes, counts, slips }
}

/** Days on which any habit has a check: proof the app was used that day. */
export function activeDaysOf(checks: readonly HabitCheck[]): Set<string> {
  return new Set(checks.map((c) => c.day))
}

/** Per habit id: day -> state / reason / taps / slips, for a list of habits. Pure. */
export interface HabitDaysMaps {
  states: Map<string, Map<string, HabitDayState>>
  notes: Map<string, Map<string, string>>
  counts: Map<string, Map<string, number>>
  slips: Map<string, Map<string, number>>
}

export function habitDaysMaps(habits: readonly Habit[], checks: readonly HabitCheck[], today: string): HabitDaysMaps {
  const activeDays = activeDaysOf(checks)
  const out: HabitDaysMaps = { states: new Map(), notes: new Map(), counts: new Map(), slips: new Map() }
  for (const h of habits) {
    const d = habitDayStates(h, checks, activeDays, today)
    out.states.set(h.id, d.states)
    out.notes.set(h.id, d.notes)
    out.counts.set(h.id, d.counts)
    out.slips.set(h.id, d.slips)
  }
  return out
}

/** What one day cell shows. 'missed' = a past day of a daily habit left empty
 *  (stats already count it as a miss; this only draws it). 'empty' = blank. */
export type DisplayCell = HabitDayState | 'missed' | 'empty' | 'future' | 'before' | 'after'

export interface HabitBounds {
  start: string
  end: string | undefined
}

export function habitBounds(habit: Habit, states?: ReadonlyMap<string, HabitDayState>): HabitBounds {
  return { start: habitStartDay(habit, states?.keys()), end: habitEndDay(habit) }
}

/**
 * The cell for one day. A stored state always wins (a planned rest day in the
 * future too). Otherwise: after today 'future'; before the habit started
 * 'before'; after it ended 'after'; today blank; a past empty day of a daily
 * (target 7) habit to do is 'missed'; anything else blank. Pure.
 */
export function displayCell(
  habit: Pick<Habit, 'target' | 'direction'>,
  day: string,
  stored: HabitDayState | undefined,
  today: string,
  bounds: HabitBounds,
): DisplayCell {
  if (stored) return stored
  if (day > today) return 'future'
  if (day < bounds.start) return 'before'
  if (bounds.end !== undefined && day > bounds.end) return 'after'
  if (day === today) return 'empty'
  if ((habit.target ?? 7) === 7 && habit.direction !== 'avoid') return 'missed'
  return 'empty'
}
