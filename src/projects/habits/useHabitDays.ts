import { useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../lib/db'
import { deriveHabitDays, type HabitDaysData } from './habitDaysData'
import { appsByWeek, type AppsByWeek } from './habitMeasure'

/** Sunday apps answers by week, live (only read when some habit is app-limits; Dexie only). */
export function useAppsByWeek(needed: boolean): AppsByWeek | undefined {
  return useLiveQuery(async () => {
    if (!needed) return new Map()
    const [weeks, entries] = await Promise.all([
      db.lifeWeeks.toArray(),
      db.lifeEntries.filter((e) => e.kind === 'sunday' && e.ref === 'screen-apps').toArray(),
    ])
    return appsByWeek(weeks, entries)
  }, [needed])
}

/** The Habits data, live from Dexie, derived for `today` (see deriveHabitDays).
 *  undefined while loading. One hook for the Habits page and Life. */
export function useHabitDays(today: string): HabitDaysData | undefined {
  const habits = useLiveQuery(() => db.habits.orderBy('createdAt').toArray(), [])
  const checks = useLiveQuery(() => db.habitChecks.toArray(), [])
  const apps = useAppsByWeek(!!habits?.some((h) => h.measure !== undefined))
  return useMemo(
    () => (habits && checks && apps ? deriveHabitDays(habits, checks, today, apps) : undefined),
    [habits, checks, apps, today],
  )
}
