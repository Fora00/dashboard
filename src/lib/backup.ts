import type { Table } from 'dexie'
import type { CloudSync, SyncedLocalTable } from './cloudSync'
import { db, upgradeRowShape, type ProjectPref } from './db'
import { watchedEngines } from './syncHealth'

// Whole-device backup: every Dexie table as one JSON file. The sync outbox is
// left out (a restored outbox would replay stale writes); everything else is
// merged in (see restoreBackup), so importing never wipes current data.

// learningSketches is left out too: its rows hold the photo as a Blob, which
// JSON cannot carry (it would serialise to {} and a restore would overwrite
// good photos with broken rows). The photo diary is local-only and is NOT in
// the backup; its ticks (learningChecks) are plain JSON and are.
// Blob tables are left out: JSON turns a Blob into {} and a restore would overwrite the real file.
const SKIPPED = new Set(['outbox', 'learningSketches', 'files'])
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

export interface RestoreResult {
  /** Rows written (synced ones also queued for upload). */
  restored: number
  /** Rows left alone: this device already had them, identical or newer. */
  kept: number
}

type Row = Record<string, unknown>

const isRow = (r: unknown): r is Row & { id: string } =>
  typeof r === 'object' && r !== null && !Array.isArray(r) && typeof (r as { id?: unknown }).id === 'string'

/** Deep equality for plain JSON-ish values (what a backup row is made of). */
function sameValue(a: unknown, b: unknown): boolean {
  if (a === b) return true
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false
  if (Array.isArray(a) !== Array.isArray(b)) return false
  const ka = Object.keys(a)
  const kb = Object.keys(b)
  if (ka.length !== kb.length) return false
  return ka.every((k) => Object.hasOwn(b, k) && sameValue((a as Row)[k], (b as Row)[k]))
}

/** The backup rows worth writing: the ones this device lacks, or holds in an
 *  older version. A local row that is identical, or has an updatedAt at least
 *  as recent, wins (restore merges; it never rolls an edit back). */
async function rowsToWrite(
  table: Table,
  list: (Row & { id: string })[],
  updatedAt: (row: Row) => number,
): Promise<(Row & { id: string })[]> {
  const local = (await table.bulkGet(list.map((r) => r.id))) as (Row | undefined)[]
  return list.filter((row, i) => {
    const have = local[i]
    if (!have) return true
    if (sameValue(have, row)) return false
    const mine = updatedAt(have)
    const theirs = updatedAt(row)
    return !(Number.isFinite(mine) && (!Number.isFinite(theirs) || mine >= theirs))
  })
}

const plainUpdatedAt = (r: Row) => (typeof r.updatedAt === 'number' ? r.updatedAt : NaN)

/**
 * Merges a backup into the local db. Unknown tables are ignored; nothing that
 * exists locally is deleted, and a local row at least as recent as the
 * backup's copy is kept.
 *
 * Rows of SYNCED tables go through their engine's upsertMany, so they are
 * queued in the outbox: signed in, they are pushed, and until then the queue
 * shields them from the next pull (remote is source of truth for unqueued
 * rows, so a plain put would be deleted by it). This holds for a guest too:
 * an owner-only row the server refuses is dead-lettered and kept on this
 * device, exactly like a guest's own local edits. Local-only tables keep a
 * plain put. Old row shapes are upgraded first (db.ts rowShapeUpgrades).
 * One transaction: all or nothing.
 */
export async function restoreBackup(backup: Backup): Promise<RestoreResult> {
  const tables: Record<string, unknown[]> = { ...backup.tables }
  // Old shapes → current shape (copies: the caller's object is not mutated).
  for (const name of Object.keys(tables)) {
    const list = tables[name]
    if (!Array.isArray(list)) continue
    tables[name] = list.map((r) => {
      if (!isRow(r)) return r
      const copy = { ...r }
      upgradeRowShape(name, copy)
      return copy
    })
  }
  if (Array.isArray(tables.projectStats)) {
    const have = new Set<string>(await db.projectPrefs.toCollection().primaryKeys())
    const inFile = Array.isArray(tables.projectPrefs) ? tables.projectPrefs : []
    for (const p of inFile) if (isRow(p)) have.add(p.id)
    const m = migrateLegacyStats(tables.projectStats, have)
    tables.projectStats = m.stats
    // Queued with the rest of project_prefs below, like the v17 upgrade does.
    tables.projectPrefs = [...inFile, ...m.prefs]
  }

  // Synced tables, engine by engine in config order (parents before children,
  // so the queue pushes a parent before the rows that reference it).
  const synced: { engine: CloudSync; table: SyncedLocalTable }[] = []
  for (const engine of new Set(watchedEngines.map((w) => w.sync))) {
    for (const table of engine.localTables()) synced.push({ engine, table })
  }
  const syncedNames = new Set(synced.map((s) => s.table.name))
  const present = (name: string) => !SKIPPED.has(name) && Array.isArray(tables[name])
  const localOnly = db.tables.filter((t) => present(t.name) && !syncedNames.has(t.name))
  const touched = [...db.tables.filter((t) => present(t.name)), db.outbox]

  let restored = 0
  let kept = 0
  await db.transaction('rw', touched, async () => {
    for (const { engine, table } of synced) {
      if (!present(table.name)) continue
      const list = tables[table.name]!.filter(isRow)
      const lww = (table.updatedAt as ((r: Row) => number) | undefined) ?? plainUpdatedAt
      const write = await rowsToWrite(db.table(table.name), list, lww)
      // Nested in this transaction (same tables + outbox); the engine's flush
      // runs detached, after the commit.
      await engine.upsertMany(table.remote, write as never[])
      restored += write.length
      kept += list.length - write.length
    }
    for (const t of localOnly) {
      const list = tables[t.name]!
      const withId = list.filter(isRow)
      const write = withId.length === list.length ? await rowsToWrite(t, withId, plainUpdatedAt) : list
      await t.bulkPut(write)
      restored += write.length
      kept += list.length - write.length
    }
  })
  return { restored, kept }
}
