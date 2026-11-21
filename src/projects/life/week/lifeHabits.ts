import type { HabitDaysData } from '../../habits/habitDaysData'
import { buildRecap, type RecapPeriod } from '../../habits/habitRecapData'
import { reasonLabel } from '../../habits/habitStates'
import { toLifeHabit, type LifeHabit } from '../model'

/** The live (active) Habits-page habits over a period, as the Life exports carry them. */
export function lifeHabitsFor(data: HabitDaysData | undefined, period: RecapPeriod, today: string): LifeHabit[] {
  if (!data) return []
  return buildRecap(data.active, data.states, data.notes, period, today, data.counts, data.slips).map((r) =>
    toLifeHabit(r, reasonLabel),
  )
}
