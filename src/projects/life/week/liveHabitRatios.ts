import type { Habit, HabitCheck } from '../../../lib/db'
import { activeDaysOf, habitDayStates } from '../../habits/habitDayStates'
import { hasStarted } from '../../habits/habitStates'
import { buildRecap, recapPeriod } from '../../habits/habitRecapData'
import { habitTarget } from '../../habits/habitStats'

/**
 * Per week (Monday), the share of its expected days each live Habits-page habit
 * got done (0-1), for the progress line "Habits". A habit with nothing
 * expected that week (too new, only rest days) or that overshot its target (more done days than expected) is left out. Pure.
 */
export function liveHabitRatiosByWeek(
  habits: readonly Habit[],
  checks: readonly HabitCheck[],
  weeks: readonly string[],
  today: string,
): Map<string, number[]> {
  const out = new Map<string, number[]>()
  const live = habits.filter((h) => h.archivedAt === undefined && hasStarted(h, today))
  if (live.length === 0) return out
  const activeDays = activeDaysOf(checks)
  const days = new Map(live.map((h) => [h.id, habitDayStates(h, checks, activeDays, today)]))
  const states = new Map([...days].map(([id, d]) => [id, d.states]))
  const notes = new Map([...days].map(([id, d]) => [id, d.notes]))
  for (const week of weeks) {
    const ratios = buildRecap(live, states, notes, recapPeriod('week', week), today)
      // Overshoot (more done days than the week's target) is left out, not counted as a full 100%.
      .filter((r) => r.expected > 0 && r.done <= r.expected)
      .map((r) => r.done / r.expected)
    if (ratios.length > 0) out.set(week, ratios)
  }
  return out
}

/** One Habits-page habit in a week's recap line. */
export interface HabitWeekRow {
  id: string
  emoji: string
  name: string
  /** Done (or floor) days in the week. */
  done: number
  /** Times per week the habit asks for (1-7). */
  target: number
  /** "Don't" habit: `slips` counts the misses past its grace, `hit` = kept. */
  avoid: boolean
  slips: number
  hit: boolean | null
}

/**
 * Per week (Monday), the Habits-page habits as they went that week: the live
 * ones that had started, plus archived ones that still got something done
 * there. Replaces the Life plan's own trackers in the recaps. Pure.
 */
export function habitWeekRows(
  habits: readonly Habit[],
  checks: readonly HabitCheck[],
  weeks: readonly string[],
  today: string,
): Map<string, HabitWeekRow[]> {
  const out = new Map<string, HabitWeekRow[]>()
  if (habits.length === 0) return out
  const activeDays = activeDaysOf(checks)
  const days = new Map(habits.map((h) => [h.id, habitDayStates(h, checks, activeDays, today)]))
  const states = new Map([...days].map(([id, d]) => [id, d.states]))
  const notes = new Map([...days].map(([id, d]) => [id, d.notes]))
  for (const week of weeks) {
    const rows = buildRecap(habits, states, notes, recapPeriod('week', week), today)
      .filter((r) => {
        // Not yet created / started that week: nothing to show.
        if (r.cells.every((c) => c.state === 'before' || c.state === 'future') && r.done === 0 && r.fail === 0)
          return false
        return r.habit.archivedAt === undefined || r.done > 0 || r.fail > 0
      })
      .map((r): HabitWeekRow => ({
        id: r.habit.id,
        emoji: r.habit.emoji,
        name: r.habit.name,
        done: r.done,
        target: habitTarget(r.habit),
        avoid: r.habit.direction === 'avoid',
        slips: Math.max(0, r.fail - r.graceUsed),
        hit: r.hit,
      }))
    if (rows.length > 0) out.set(week, rows)
  }
  return out
}
