// Recap of every habit by category (Life engine), split into present, past and
// future: the "Categorie" tab (owner, 2026-11-25). Pure, Dexie-free.

import type { Habit, HabitDayState, LifeEngineKey } from '../../lib/db'
import { ENGINES } from '../life/model/engines'
import { habitEndDay } from './habitStore'
import { habitStats, shiftDayKey, weekStart } from './habitStats'

export type HabitPhase = 'present' | 'past' | 'future'

/** past = archived or judged 'closed'; future = cycle starts after today;
 *  present = everything else (a cycle past its end with no verdict still runs). */
export function habitPhase(habit: Habit, today: string): HabitPhase {
  if (habit.archivedAt !== undefined || habit.verdict === 'closed') return 'past'
  if (habit.cycleStart && habit.cycleStart > today) return 'future'
  return 'present'
}

export interface CategoryGroup {
  /** null = habits with no engine. */
  engine: LifeEngineKey | null
  label: string
  present: Habit[]
  past: Habit[]
  future: Habit[]
}

const endOf = (h: Habit) => habitEndDay(h) ?? h.cycleEnd ?? ''

/** Engines in their fixed order, then "Senza engine"; empty groups left out.
 *  Present: soonest cycle end first (open-ended last). Past: most recent end
 *  first. Future: soonest start first. */
export function groupByCategory(habits: readonly Habit[], today: string): CategoryGroup[] {
  const keys: (LifeEngineKey | null)[] = [...ENGINES.map((e) => e.key), null]
  const groups = keys.map((engine): CategoryGroup => ({
    engine,
    label: engine ? ENGINES.find((e) => e.key === engine)!.label : 'Senza engine',
    present: [],
    past: [],
    future: [],
  }))
  for (const h of habits) {
    const g = groups.find((x) => x.engine === (h.engine ?? null)) ?? groups.at(-1)!
    g[habitPhase(h, today)].push(h)
  }
  const byName = (a: Habit, b: Habit) => a.name.localeCompare(b.name)
  for (const g of groups) {
    g.present.sort((a, b) => (a.cycleEnd ?? '9999').localeCompare(b.cycleEnd ?? '9999') || byName(a, b))
    g.past.sort((a, b) => endOf(b).localeCompare(endOf(a)) || byName(a, b))
    g.future.sort((a, b) => (a.cycleStart ?? '').localeCompare(b.cycleStart ?? '') || byName(a, b))
  }
  return groups.filter((g) => g.present.length + g.past.length + g.future.length > 0)
}

/** Weeks hit out of the complete weeks of the habit's cycle (or of the last
 *  8 weeks for an open-ended habit), up to its end for a past habit.
 *  null when no complete week counts yet. Ticks only: callers skip measured habits. */
export function cycleWeeks(
  habit: Habit,
  states: ReadonlyMap<string, HabitDayState>,
  today: string,
): { hit: number; total: number } | null {
  const end = habitEndDay(habit)
  // Stats as of a week after the end (never past today), so the end's own week counts as complete.
  const later = end ? shiftDayKey(end, 7) : today
  const asOf = later < today ? later : today
  const weeks = habitStats(habit, states, asOf).lastWeeks.filter(
    (w) => (!habit.cycleStart || w.start >= weekStart(habit.cycleStart)) && (!end || w.start <= end),
  )
  return weeks.length ? { hit: weeks.filter((w) => w.hit).length, total: weeks.length } : null
}
