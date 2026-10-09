import { db } from './db'

// Whole-device backup: every Dexie table as one JSON file. The sync outbox is
// left out (a restored outbox would replay stale writes); everything else is
// restored with put, so importing merges into, and never wipes, current data.

const SKIPPED = new Set(['outbox'])
const FORMAT = 'dashboard-backup'

export interface Backup {
  format: typeof FORMAT
  version: number
  exportedAt: string
  tables: Record<string, unknown[]>
}

export async function buildBackup(): Promise<Backup> {
  const tables: Record<string, unknown[]> = {}
  for (const t of db.tables) {
    if (!SKIPPED.has(t.name)) tables[t.name] = await t.toArray()
  }
  return { format: FORMAT, version: db.verno, exportedAt: new Date().toISOString(), tables }
}

/** Parses and validates a backup file's text; throws a readable message when it is not one. */
export function parseBackup(text: string): Backup {
  let data: unknown
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error('Not a valid backup file (not JSON)')
  }
  const b = data as Partial<Backup> | null
  if (!b || b.format !== FORMAT || typeof b.tables !== 'object' || b.tables === null) {
    throw new Error('Not a dashboard backup file')
  }
  if (typeof b.version === 'number' && b.version > db.verno) {
    throw new Error('This backup comes from a newer version of the app. Update first.')
  }
  return b as Backup
}

/** Merges a backup into the local db; returns the number of rows written. Unknown tables are ignored. */
export async function restoreBackup(backup: Backup): Promise<number> {
  const known = db.tables.filter((t) => !SKIPPED.has(t.name) && Array.isArray(backup.tables[t.name]))
  let rows = 0
  await db.transaction('rw', known, async () => {
    for (const t of known) {
      const list = backup.tables[t.name]!
      await t.bulkPut(list)
      rows += list.length
    }
  })
  return rows
}
