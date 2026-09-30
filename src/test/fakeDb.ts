// Dexie under test: importing this file installs fake-indexeddb globally, so
// only import it from tests that touch the real `db` (src/lib/db.ts). Pure
// tests stay on the default node environment without it.
//
//   import { resetDb } from '../test/fakeDb'
//   beforeEach(resetDb)
import 'fake-indexeddb/auto'
import { db } from '../lib/db'

/** A brand-new empty database (all versions/upgrades re-applied on open). */
export async function resetDb(): Promise<void> {
  db.close()
  await db.delete()
  await db.open()
}

export { db }
