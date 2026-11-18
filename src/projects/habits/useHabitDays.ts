import { useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../lib/db'
import { deriveHabitDays, type HabitDaysData } from './habitDaysData'

/** The Habits data, live from Dexie, derived for `today` (see deriveHabitDays).
 *  undefined while loading. One hook for the Habits page and Life. */
export function useHabitDays(today: string): HabitDaysData | undefined {
  const habits = useLiveQuery(() => db.habits.orderBy('createdAt').toArray(), [])
  const checks = useLiveQuery(() => db.habitChecks.toArray(), [])
  return useMemo(() => (habits && checks ? deriveHabitDays(habits, checks, today) : undefined), [habits, checks, today])
}
