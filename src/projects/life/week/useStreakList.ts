import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../lib/db'
import { sortStreaks } from '../model'
import type { LifeStreakEntry } from '../../../lib/db'

/** The Streaks-app habits (last imported snapshot), by name (undefined while loading). */
export function useStreakList(): LifeStreakEntry[] | undefined {
  return useLiveQuery(async () => sortStreaks(await db.lifeEntries.filter((e) => e.kind === 'streak').toArray()), [])
}
