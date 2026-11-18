import { beforeEach, describe, expect, it } from 'vitest'
import { db, resetDb } from '../test/fakeDb'
import { buildBackup, parseBackup, restoreBackup, type Backup } from './backup'
import { DEFAULT_AREA_ID } from './db'

const backupOf = (tables: Record<string, unknown[]>, version = 25): Backup => ({
  format: 'dashboard-backup',
  version,
  exportedAt: '',
  tables,
})
const queued = async (table: string) =>
  (await db.outbox.toArray())
    .filter((e) => e.table === table)
    .map((e) => e.rowId)
    .sort()

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
    expect((await restoreBackup(b)).restored).toBeGreaterThan(0)
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
  it('keeps the checklist ticks but leaves out the photo diary (Blobs are not JSON)', async () => {
    await db.learningChecks.put({ id: 'd:m:p', courseId: 'd', moduleId: 'm', itemId: 'p', checked: [1], updatedAt: 1 })
    await db.learningSketches.add({
      id: 's1',
      courseId: 'd',
      moduleId: 'm',
      itemId: 'p',
      photo: new Blob(['x']),
      note: '',
      createdAt: 1,
    })
    const b = parseBackup(JSON.stringify(await buildBackup()))
    expect(b.tables.learningChecks).toHaveLength(1)
    expect(b.tables).not.toHaveProperty('learningSketches')
    // A backup that somehow carries the table never overwrites real photos.
    await restoreBackup({ ...b, tables: { ...b.tables, learningSketches: [{ id: 's1', photo: {} }] } })
    expect((await db.learningSketches.get('s1'))?.photo).toBeInstanceOf(Blob)
  })
  it('leaves out local-transfer files (Blobs) and never overwrites them on restore', async () => {
    await db.files.add({
      id: 'f1',
      name: 'a.txt',
      type: 'text/plain',
      size: 1,
      blob: new Blob(['x']),
      createdAt: 1,
      synced: 0,
    })
    const b = parseBackup(JSON.stringify(await buildBackup()))
    expect(b.tables).not.toHaveProperty('files')
    await restoreBackup({ ...b, tables: { ...b.tables, files: [{ id: 'f1', blob: {} }] } })
    expect((await db.files.get('f1'))?.blob).toBeInstanceOf(Blob)
  })
  it('rejects files that are not backups or are newer', () => {
    expect(() => parseBackup('nope')).toThrow(/not JSON/)
    expect(() => parseBackup('{"a":1}')).toThrow(/not a dashboard backup/i)
    expect(() => parseBackup(JSON.stringify({ format: 'dashboard-backup', version: 9999, tables: {} }))).toThrow(
      /newer/,
    )
  })

  it('queues restored rows of synced tables (parents first); local-only tables are not queued', async () => {
    const r = await restoreBackup(
      backupOf({
        shopItems: [{ id: 'i1', text: 'milk', done: 0, areaId: 'a1', createdAt: 1, updatedAt: 1 }],
        shopAreas: [{ id: 'a1', name: 'Pharmacy', createdAt: 1 }],
        todos: [{ id: 't1', text: 'x', done: 0, createdAt: 1, updatedAt: 1 }],
        projectStats: [{ id: 'todo', opens: 2, lastOpenedAt: 3 }],
      }),
    )
    expect(r).toEqual({ restored: 4, kept: 0 })
    expect(await db.todos.get('t1')).toMatchObject({ text: 'x' })
    expect(await queued('todos')).toEqual(['t1'])
    expect(await queued('shop_items')).toEqual(['i1'])
    // The area is queued before the item that references it.
    const order = (await db.outbox.orderBy('seq').toArray()).map((e) => e.table)
    expect(order.indexOf('shop_areas')).toBeLessThan(order.indexOf('shop_items'))
    expect(await db.projectStats.get('todo')).toMatchObject({ opens: 2 })
    expect((await db.outbox.toArray()).map((e) => e.table)).not.toContain('projectStats')
  })
  it('upgrades old row shapes (v3 areaId, v5 todo updatedAt, v9 tags, v15 prefs updatedAt) before merging', async () => {
    await restoreBackup(
      backupOf(
        {
          shopItems: [{ id: 'i1', text: 'milk', done: 0, createdAt: 1, updatedAt: 1 }],
          todos: [{ id: 't1', text: 'x', done: 0, createdAt: 7 }],
          links: [{ id: 'l1', url: 'https://a.b', title: 'a', notes: '', read: 0, createdAt: 1, updatedAt: 1 }],
          eventPrefs: [{ id: 'prefs', favouriteCategories: ['music'] }],
        },
        2,
      ),
    )
    expect(await db.shopItems.get('i1')).toMatchObject({ areaId: DEFAULT_AREA_ID })
    expect(await db.todos.get('t1')).toMatchObject({ updatedAt: 7 })
    expect(await db.links.get('l1')).toMatchObject({ tags: [] })
    expect(await db.links.where('tags').equals('x').count()).toBe(0) // the index works
    expect(await db.eventPrefs.get('prefs')).toMatchObject({ updatedAt: 0 })
    // The queued payloads carry the upgraded shape too.
    const payload = (await db.outbox.toArray()).find((e) => e.table === 'todos')?.payload
    expect(payload).toMatchObject({ updatedAt: 7 })
  })
  it('a newer (or identical) local row wins and is not queued; an older one is replaced and queued', async () => {
    await db.todos.bulkPut([
      { id: 'newer', text: 'mine', done: 1, createdAt: 1, updatedAt: 50 },
      { id: 'older', text: 'mine', done: 0, createdAt: 1, updatedAt: 5 },
      { id: 'same', text: 'same', done: 0, createdAt: 1, updatedAt: 9 },
    ])
    const r = await restoreBackup(
      backupOf({
        todos: [
          { id: 'newer', text: 'backup', done: 0, createdAt: 1, updatedAt: 10 },
          { id: 'older', text: 'backup', done: 1, createdAt: 1, updatedAt: 10 },
          { id: 'same', text: 'same', done: 0, createdAt: 1, updatedAt: 9 },
        ],
      }),
    )
    expect(r).toEqual({ restored: 1, kept: 2 })
    expect(await db.todos.get('newer')).toMatchObject({ text: 'mine', updatedAt: 50 })
    expect(await db.todos.get('older')).toMatchObject({ text: 'backup', updatedAt: 10 })
    expect(await queued('todos')).toEqual(['older'])
  })
  it('does not mutate the parsed backup', async () => {
    const b = backupOf({ todos: [{ id: 't1', text: 'x', done: 0, createdAt: 7 }] }, 4)
    await restoreBackup(b)
    expect(b.tables.todos![0]).not.toHaveProperty('updatedAt')
  })
})
