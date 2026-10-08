import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../lib/db'
import { ProgressChart } from './ProgressChart'

/** The History progress chart, shown beside the live week on wide screens.
 * Own Dexie reads, so phones (where it is hidden) never pay for it much and
 * WeekBody stays free of History's data. */
export function ProgressAside({ week }: { week: string }) {
  const weeks = useLiveQuery(() => db.lifeWeeks.orderBy('id').reverse().toArray())
  const entries = useLiveQuery(() => db.lifeEntries.toArray())
  if (!weeks || !entries) return null
  return <ProgressChart weeks={weeks} entries={entries} currentWeek={week} />
}
