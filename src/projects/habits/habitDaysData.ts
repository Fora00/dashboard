// Everything the Habits views derive from the stored habits and checks, in one
// place: per-habit day maps, the lifeboard data, lifetime wins, the active and
// archived lists and today's done count. Pure; `useHabitDays` is the live hook.

import type { Habit, HabitCheck } from '../../lib/db'
import { habitDaysMaps, type HabitDaysMaps } from './habitDayStates'
import { hasStarted } from './habitStates'
import { buildLifeboard, type DayData } from './lifeboardData'

export interface HabitDaysData extends HabitDaysMaps {
  /** Every habit, archived too, oldest first. */
  habits: Habit[]
  checks: HabitCheck[]
  boardData: Map<string, DayData>
  /** Lifetime wins (lifeboard boxes) per habit id. */
  wins: Map<string, number>
  /** Not archived and started (a planned cycle stays hidden until its start day). */
  active: Habit[]
  archived: Habit[]
  /** Active habits done (or floor) today. */
  doneToday: number
}

export function deriveHabitDays(habits: readonly Habit[], checks: readonly HabitCheck[], today: string): HabitDaysData {
  const maps = habitDaysMaps(habits, checks, today)
  const boardData = new Map<string, DayData>()
  for (const h of habits) boardData.set(h.id, { states: maps.states.get(h.id)!, counts: maps.counts.get(h.id)! })
  const wins = new Map(buildLifeboard(habits, boardData).legend.map((l) => [l.habit.id, l.total]))
  const active = habits.filter((h) => h.archivedAt === undefined && hasStarted(h, today))
  const archived = habits.filter((h) => h.archivedAt !== undefined)
  const doneToday = active.filter((h) => {
    const st = maps.states.get(h.id)?.get(today)
    return st === 'done' || st === 'floor'
  }).length
  return { ...maps, habits: [...habits], checks: [...checks], boardData, wins, active, archived, doneToday }
}
