import type { Habit, HabitCheck } from '../../../lib/db'
import { activeDaysOf, habitDayStates } from '../../habits/habitDayStates'
import { buildRecap, recapPeriod } from '../../habits/habitRecapData'

/**
 * Per week (Monday), the share of its expected days each live Habits-page habit
 * got done (0-1, capped), for the progress line "Habits". A habit with nothing
 * expected that week (too new, only rest days) is left out. Pure.
 */
export function liveHabitRatiosByWeek(
  habits: readonly Habit[],
  checks: readonly HabitCheck[],
  weeks: readonly string[],
  today: string,
): Map<string, number[]> {
  const out = new Map<string, number[]>()
  const live = habits.filter((h) => h.archivedAt === undefined)
  if (live.length === 0) return out
  const activeDays = activeDaysOf(checks)
  const days = new Map(live.map((h) => [h.id, habitDayStates(h, checks, activeDays, today)]))
  const states = new Map([...days].map(([id, d]) => [id, d.states]))
  const notes = new Map([...days].map(([id, d]) => [id, d.notes]))
  for (const week of weeks) {
    const ratios = buildRecap(live, states, notes, recapPeriod('week', week), today)
      .filter((r) => r.expected > 0)
      .map((r) => Math.min(1, r.done / r.expected))
    if (ratios.length > 0) out.set(week, ratios)
  }
  return out
}
