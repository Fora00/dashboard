import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../lib/db'
import { useToday } from '../../../lib/useToday'
import { habitWeekRows, type HabitWeekRow } from './liveHabitRatios'

/** Habits-page rows per week (Monday key), live; undefined while loading. */
export function useHabitWeekRows(weeks: readonly string[]): Map<string, HabitWeekRow[]> | undefined {
  const today = useToday()
  const key = weeks.join(',')
  return useLiveQuery(async () => {
    const [habits, checks] = await Promise.all([db.habits.toArray(), db.habitChecks.toArray()])
    return habitWeekRows(habits, checks, key ? key.split(',') : [], today)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, today])
}
