import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../lib/db'
import { buildHabitHistory, weekStreak, type HabitHistory, type WeekStreak } from './habitStory'

/** Live history of one habit across weeks (undefined while loading). Local
 * Dexie only; the table is small, so it scans instead of adding an index. */
export function useHabitHistory(trackerId: string, enabled = true): HabitHistory | undefined {
  return useLiveQuery(async () => {
    if (!enabled) return undefined
    const [weeks, entries] = await Promise.all([
      db.lifeWeeks.toArray(),
      db.lifeEntries.filter((e) => e.ref === trackerId).toArray(),
    ])
    return buildHabitHistory(trackerId, weeks, entries)
  }, [trackerId, enabled])
}

/** Weeks in a row the habit held, now and best (0/0 while loading or without a goal). */
export function useWeekStreak(trackerId: string, currentWeek: string): WeekStreak {
  return (
    useLiveQuery(async () => {
      const [weeks, entries] = await Promise.all([
        db.lifeWeeks.toArray(),
        db.lifeEntries.filter((e) => e.ref === trackerId).toArray(),
      ])
      return weekStreak(buildHabitHistory(trackerId, weeks, entries, 104).weeks, currentWeek)
    }, [trackerId, currentWeek]) ?? { current: 0, best: 0 }
  )
}
