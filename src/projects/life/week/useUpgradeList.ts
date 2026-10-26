import { useLiveQuery } from 'dexie-react-hooks'
import { db, type LifeUpgradeEntry } from '../../../lib/db'

/** Every Upgrade list item, whatever week it was added in (undefined while loading). */
export function useUpgradeList(): LifeUpgradeEntry[] | undefined {
  return useLiveQuery(
    async () => (await db.lifeEntries.filter((e) => e.kind === 'upgrade').toArray()) as LifeUpgradeEntry[],
    [],
  )
}
