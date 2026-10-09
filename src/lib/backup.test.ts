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
  it('restores a pre-v17 backup: starred/hidden move to project prefs, queued once; existing prefs win', async () => {
    await db.projectPrefs.put({ id: 'life', starred: 0, hidden: 1, updatedAt: 5 })
    const backup = parseBackup(
      JSON.stringify({
        format: 'dashboard-backup',
        version: 16,
        exportedAt: '',
        tables: {
          projectStats: [
            { id: 'events', opens: 3, starred: 1, lastOpenedAt: 9 },
            { id: 'links', opens: 1, starred: 0, lastOpenedAt: 9, hidden: 1 },
            { id: 'life', opens: 2, starred: 1, lastOpenedAt: 9 },
            { id: 'todo', opens: 0, starred: 0, lastOpenedAt: 9 },
          ],
        },
      }),
    )
    await restoreBackup(backup)
    expect(await db.projectPrefs.get('events')).toMatchObject({ starred: 1, hidden: null, updatedAt: 0 })
    expect(await db.projectPrefs.get('links')).toMatchObject({ starred: 0, hidden: 1 })
    expect(await db.projectPrefs.get('life')).toMatchObject({ starred: 0, hidden: 1, updatedAt: 5 }) // kept
    expect(await db.projectPrefs.get('todo')).toBeUndefined() // no choice
    expect(await db.projectStats.get('events')).toEqual({ id: 'events', opens: 3, lastOpenedAt: 9 })
    expect((await db.outbox.toArray()).filter((e) => e.table === 'project_prefs').length).toBe(2)
  })
  it('rejects files that are not backups or are newer', () => {
    expect(() => parseBackup('nope')).toThrow(/not JSON/)
    expect(() => parseBackup('{"a":1}')).toThrow(/not a dashboard backup/i)
    expect(() => parseBackup(JSON.stringify({ format: 'dashboard-backup', version: 9999, tables: {} }))).toThrow(
      /newer/,
    )
  })
})
