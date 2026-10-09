import { beforeEach, describe, expect, it } from 'vitest'
import { db, resetDb } from '../test/fakeDb'
import { buildBackup, parseBackup, restoreBackup } from './backup'

beforeEach(resetDb)

describe('backup', () => {
  it('round-trips rows, merges on restore and skips the outbox', async () => {
    await db.table('meals').put({ id: 'm1', day: '2026-10-09', createdAt: 1 })
    await db.outbox.add({ table: 'meals', op: 'upsert', rowId: 'm1' } as never)
    const b = parseBackup(JSON.stringify(await buildBackup()))
    expect(b.tables).not.toHaveProperty('outbox')
    expect(b.tables.meals).toHaveLength(1)

    await db.table('meals').clear()
    await db.table('meals').put({ id: 'm2', day: '2026-10-10', createdAt: 2 })
    expect(await restoreBackup(b)).toBeGreaterThan(0)
    expect(await db.table('meals').count()).toBe(2) // merged, m2 kept
  })
  it('rejects files that are not backups or are newer', () => {
    expect(() => parseBackup('nope')).toThrow(/not JSON/)
    expect(() => parseBackup('{"a":1}')).toThrow(/not a dashboard backup/i)
    expect(() => parseBackup(JSON.stringify({ format: 'dashboard-backup', version: 9999, tables: {} }))).toThrow(
      /newer/,
    )
  })
})
