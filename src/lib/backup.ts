import { db, type ProjectPref } from './db'
import { sync as projectPrefsEngine } from './projectPrefsSync'

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

/** Backups from before Dexie v17 kept starred/hidden on projectStats rows. Returns
 *  those rows without the two fields, and the prefs they stand for (updatedAt 0 =
 *  predates sync, like the v17 upgrade; ids that already have a pref are kept). */
function migrateLegacyStats(
  stats: unknown[],
  existing: ReadonlySet<string>,
): { stats: unknown[]; prefs: ProjectPref[] } {
  const prefs: ProjectPref[] = []
  const cleaned = stats.map((raw) => {
    const { starred, hidden, ...rest } = raw as { id: string; starred?: 0 | 1; hidden?: 0 | 1 }
    const chosen = starred === 1 || hidden !== undefined
    if (chosen && !existing.has(rest.id)) {
      prefs.push({ id: rest.id, starred: starred === 1 ? 1 : 0, hidden: hidden ?? null, updatedAt: 0 })
    }
    return rest
  })
  return { stats: cleaned, prefs }
}

/** Merges a backup into the local db; returns the number of rows written. Unknown tables are ignored. */
export async function restoreBackup(backup: Backup): Promise<number> {
  const tables = { ...backup.tables }
  let legacy: ProjectPref[] = []
  if (Array.isArray(tables.projectStats)) {
    const have = new Set<string>(await db.projectPrefs.toCollection().primaryKeys())
    for (const p of (tables.projectPrefs ?? []) as { id: string }[]) have.add(p.id)
    const m = migrateLegacyStats(tables.projectStats, have)
    tables.projectStats = m.stats
    legacy = m.prefs
  }
  const known = db.tables.filter((t) => !SKIPPED.has(t.name) && Array.isArray(tables[t.name]))
  let rows = 0
  await db.transaction('rw', known, async () => {
    for (const t of known) {
      const list = tables[t.name]!
      await t.bulkPut(list)
      rows += list.length
    }
  })
  // Through the engine so they are queued for sync, like the v17 upgrade does.
  if (legacy.length > 0) {
    await projectPrefsEngine.upsertMany('project_prefs', legacy)
    rows += legacy.length
  }
  return rows
}
