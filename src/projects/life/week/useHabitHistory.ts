import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../lib/db'
import { buildHabitHistory, type HabitHistory } from './habitStory'

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
