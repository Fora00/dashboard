// M6: Dexie upgrade paths. A device that last opened the app at an old schema
// version must reach the current one with every row intact, plus the upgrade
// callbacks' backfills. Each test writes the old database with a throwaway
// Dexie instance declaring only that old version, then opens the real `db`.
// Three starting points cover the upgrade callbacks that move real data: v2
// (v3 default shop area), v4 (v5 todos.updatedAt backfill) and v14 (v15
// queues existing event marks/prefs once; v16 adds the meals table).
// fake-indexeddb must be installed before Dexie loads (Dexie captures
// indexedDB when its module initialises), so this side-effect import is first.
import 'fake-indexeddb/auto'
import Dexie from 'dexie'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../test/fakeDb'
import { DEFAULT_AREA_ID } from './db'

const V4_STORES = {
  files: 'id, name, createdAt, synced',
  shopItems: 'id, done, createdAt, areaId',
  shopAreas: 'id, createdAt',
  outbox: '++seq, rowId',
  climbSessions: 'id, date',
  climbs: 'id, sessionId, date',
  habits: 'id, createdAt',
  habitChecks: 'id, habitId, day, [habitId+day]',
  todos: 'id, done, createdAt',
}

const V14_STORES = {
  ...V4_STORES,
  bookIdeas: 'id, createdAt',
  boardgameIdeas: 'id, createdAt',
  links: 'id, read, createdAt, *tags',
  projectStats: 'id, starred, opens',
  lifeWeeks: 'id, importedAt',
  lifeEntries: 'id, week, [week+kind]',
  eventsCache: 'id',
  eventMarks: 'id, state, updatedAt',
  eventPrefs: 'id',
  tripIdeas: 'id, done, createdAt, *companionIds',
  tripCompanions: 'id, createdAt',
  customEvents: 'id, start, updatedAt',
}

/** Create the on-disk database at `version` with `stores`, seed it, close it. */
async function writeOld(version: number, stores: Record<string, string>, seed: (old: Dexie) => Promise<void>) {
  const old = new Dexie(db.name)
  old.version(version).stores(stores)
  await old.open()
  await seed(old)
  old.close()
}

beforeEach(async () => {
  db.close()
  await db.delete()
})

describe('db upgrade paths', () => {
  it('v2 → current: shop items move into the default area; outbox kept', async () => {
    await writeOld(
      2,
      { files: 'id, name, createdAt, synced', shopItems: 'id, done, createdAt', outbox: '++seq, rowId' },
      async (old) => {
        await old.table('shopItems').bulkAdd([
          { id: 's1', text: 'milk', done: 0, createdAt: 1, updatedAt: 1 },
          { id: 's2', text: 'eggs', done: 1, createdAt: 2, updatedAt: 2 },
        ])
        await old.table('outbox').add({ table: 'shop_items', op: 'upsert', rowId: 's1', ts: 1 })
      },
    )
    await db.open()
    expect(db.verno).toBe(16)
    expect((await db.shopAreas.get(DEFAULT_AREA_ID))?.name).toBe('Groceries')
    const items = await db.shopItems.orderBy('createdAt').toArray()
    expect(items.map((i) => [i.id, i.text, i.areaId])).toEqual([
      ['s1', 'milk', DEFAULT_AREA_ID],
      ['s2', 'eggs', DEFAULT_AREA_ID],
    ])
    expect(await db.shopItems.where('areaId').equals(DEFAULT_AREA_ID).count()).toBe(2)
    expect((await db.outbox.toArray()).map((e) => e.rowId)).toEqual(['s1'])
  })

  it('v4 → current: todos get updatedAt from createdAt; habits and checks kept', async () => {
    await writeOld(4, V4_STORES, async (old) => {
      await old.table('todos').bulkAdd([
        { id: 't1', text: 'old', done: 0, createdAt: 100 },
        { id: 't2', text: 'has it', done: 1, createdAt: 100, updatedAt: 200 },
      ])
      await old.table('habits').add({ id: 'h1', name: 'Read', emoji: 'B', createdAt: 1 })
      await old.table('habitChecks').add({ id: 'c1', habitId: 'h1', day: '2026-01-01', createdAt: 1 })
    })
    await db.open()
    expect((await db.todos.get('t1'))?.updatedAt).toBe(100)
    expect((await db.todos.get('t2'))?.updatedAt).toBe(200)
    expect(await db.habits.get('h1')).toMatchObject({ name: 'Read' })
    expect(await db.habitChecks.where('[habitId+day]').equals(['h1', '2026-01-01']).count()).toBe(1)
    // v15 had nothing to queue.
    expect(await db.outbox.count()).toBe(0)
  })

  it('v14 → current: existing marks and prefs are queued once; nothing lost', async () => {
    const mark = (id: string, state: string) => ({ id, state, event: { id, title: id }, updatedAt: 5 })
    await writeOld(14, V14_STORES, async (old) => {
      await old.table('eventMarks').bulkAdd([mark('e1', 'saved'), mark('e2', 'hidden')])
      await old.table('eventPrefs').add({ id: 'prefs', favouriteCategories: ['music'] })
      await old
        .table('links')
        .add({ id: 'l1', url: 'https://x.y', title: 'x', notes: '', read: 0, tags: ['a'], createdAt: 1, updatedAt: 1 })
      await old.table('lifeWeeks').add({ id: '2026-10-05', week: '2026-10-05', plan: {}, importedAt: 1, updatedAt: 1 })
      await old.table('outbox').add({ table: 'links', op: 'upsert', rowId: 'l1', ts: 1 })
    })
    await db.open()
    expect(db.verno).toBe(16)
    expect(await db.eventMarks.count()).toBe(2)
    // Prefs written before v15 get updatedAt 0 ("merge me" on the server).
    expect(await db.eventPrefs.get('prefs')).toEqual({ id: 'prefs', favouriteCategories: ['music'], updatedAt: 0 })
    const queued = (await db.outbox.orderBy('seq').toArray()).map((e) => `${e.table} ${e.op} ${e.rowId}`)
    expect(queued).toEqual([
      'links upsert l1',
      'event_marks upsert e1',
      'event_marks upsert e2',
      'event_prefs upsert prefs',
    ])
    const prefsEntry = (await db.outbox.toArray()).find((e) => e.table === 'event_prefs')
    expect(prefsEntry?.payload).toEqual({ id: 'prefs', favouriteCategories: ['music'], updatedAt: 0 })
    expect((await db.links.get('l1'))?.tags).toEqual(['a'])
    expect(await db.lifeWeeks.count()).toBe(1)
    expect(await db.meals.count()).toBe(0)

    // Re-opening at the current version must not queue them a second time.
    db.close()
    await db.open()
    expect(await db.outbox.count()).toBe(4)
  })
})
