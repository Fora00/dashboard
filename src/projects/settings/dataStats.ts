import { db, type OutboxEntry } from '../../lib/db'

// Pure-ish helpers for Settings → "Data on this device". Counts only, never
// row contents.

export interface TableCount {
  name: string
  rows: number
}

/** Row count per Dexie table, sorted by name (the outbox included). */
export async function tableCounts(): Promise<TableCount[]> {
  const counts = await Promise.all(db.tables.map(async (t) => ({ name: t.name, rows: await t.count() })))
  return counts.sort((a, b) => a.name.localeCompare(b.name))
}

export interface OutboxGroup {
  table: string
  pending: number
  dead: number
}

/** Outbox entries grouped by synced table: live (pending) vs dead-lettered. */
export function groupOutbox(entries: readonly OutboxEntry[]): OutboxGroup[] {
  const groups = new Map<string, OutboxGroup>()
  for (const e of entries) {
    const g = groups.get(e.table) ?? { table: e.table, pending: 0, dead: 0 }
    if (e.dead) g.dead++
    else g.pending++
    groups.set(e.table, g)
  }
  return [...groups.values()].sort((a, b) => a.table.localeCompare(b.table))
}

/** Dead-lettered entries, oldest first, for the recovery list. */
export function deadEntries(entries: readonly OutboxEntry[]): OutboxEntry[] {
  return entries.filter((e) => e.dead).sort((a, b) => (a.seq ?? 0) - (b.seq ?? 0))
}
