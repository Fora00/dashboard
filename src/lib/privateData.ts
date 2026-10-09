import { db, type OutboxTable } from './db'

// Owner-only data that stays readable in IndexedDB after the owner signs out
// (local-first: signing out never deletes anything by itself). SyncCard offers
// to remove it from the device right after a sign-out; it is NEVER run
// automatically. Keep in sync with the owner-only synced tables (Life, Meal
// Diary, the owner's custom events, event marks/prefs, event interests and the interest profile).

/** Local Dexie tables holding owner-only data. */
const PRIVATE_TABLES = [
  db.lifeWeeks,
  db.lifeEntries,
  db.meals,
  db.customEvents,
  db.eventMarks,
  db.eventPrefs,
  db.eventInterest,
  db.eventInterestProfile,
] as const

/** Their remote tables: outbox entries for these carry the same private rows. */
const PRIVATE_REMOTES = new Set<OutboxTable>([
  'life_weeks',
  'life_entries',
  'meal_entries',
  'custom_events',
  'event_marks',
  'event_prefs',
  'event_interest',
  'event_interest_profile',
])

export interface PrivateDataSummary {
  /** Private rows stored on this device. */
  rows: number
  /** Outbox entries (pending or rejected) for them: changes the server has
   *  never received, lost for good if the data is removed. */
  unsynced: number
}

export async function privateDataSummary(): Promise<PrivateDataSummary> {
  const counts = await Promise.all(PRIVATE_TABLES.map((t) => t.count()))
  const unsynced = (await db.outbox.toArray()).filter((e) => PRIVATE_REMOTES.has(e.table)).length
  return { rows: counts.reduce((a, b) => a + b, 0), unsynced }
}

/** Delete every owner-only row from this device, plus its outbox entries (they
 *  hold the same data, and would otherwise push it again on the next sign-in).
 *  One transaction: all or nothing. The cloud copy is untouched. */
export async function clearPrivateData(): Promise<void> {
  await db.transaction('rw', [...PRIVATE_TABLES, db.outbox], async () => {
    for (const t of PRIVATE_TABLES) await t.clear()
    const seqs = (await db.outbox.toArray()).filter((e) => PRIVATE_REMOTES.has(e.table)).map((e) => e.seq!)
    await db.outbox.bulkDelete(seqs)
  })
}
