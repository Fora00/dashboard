// M6: Dexie upgrade paths. A device that last opened the app at an old schema
// version must reach the current one with every row intact, plus the upgrade
// callbacks' backfills. Each test writes the old database with a throwaway
// Dexie instance declaring only that old version, then opens the real `db`.
// Three starting points cover the upgrade callbacks that move real data: v2
// (v3 default shop area), v4 (v5 todos.updatedAt backfill) and v14 (v15
// queues existing event marks/prefs once; v16 adds the meals table) and v16
// (v17 moves starred/hidden from projectStats into the synced projectPrefs)
// and v17 (v18 adds the empty eventInterest table, nothing queued).
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

const V16_STORES = { ...V14_STORES, meals: 'id, day, createdAt' }

const V17_STORES = { ...V16_STORES, projectStats: 'id, opens', projectPrefs: 'id' }

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
    expect(db.verno).toBe(18)
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
    expect(db.verno).toBe(18)
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

  it('v16 → current: stars and hidden choices move to projectPrefs, queued once; opens stay local', async () => {
    await writeOld(16, V16_STORES, async (old) => {
      await old.table('projectStats').bulkAdd([
        // starred, never hidden
        { id: 'links', opens: 7, starred: 1, lastOpenedAt: 70 },
        // explicitly shown (hidden 0 beats DEFAULT_HIDDEN) and starred
        { id: 'todo', opens: 2, starred: 1, lastOpenedAt: 20, hidden: 0 },
        // explicitly hidden, not starred
        { id: 'events', opens: 0, starred: 0, lastOpenedAt: 0, hidden: 1 },
        // opened only: no choice to carry over
        { id: 'trips', opens: 3, starred: 0, lastOpenedAt: 30 },
      ])
      await old.table('outbox').add({ table: 'links', op: 'upsert', rowId: 'l1', ts: 1 })
    })
    await db.open()
    expect(db.verno).toBe(18)
    expect(await db.projectPrefs.orderBy('id').toArray()).toEqual([
      { id: 'events', starred: 0, hidden: 1, updatedAt: 0 },
      { id: 'links', starred: 1, hidden: null, updatedAt: 0 },
      { id: 'todo', starred: 1, hidden: 0, updatedAt: 0 },
    ])
    // projectStats keeps only the per-device usage, every row intact.
    expect(await db.projectStats.orderBy('id').toArray()).toEqual([
      { id: 'events', opens: 0, lastOpenedAt: 0 },
      { id: 'links', opens: 7, lastOpenedAt: 70 },
      { id: 'todo', opens: 2, lastOpenedAt: 20 },
      { id: 'trips', opens: 3, lastOpenedAt: 30 },
    ])
    expect(await db.projectStats.where('opens').above(2).count()).toBe(2)
    const queued = (await db.outbox.orderBy('seq').toArray()).map((e) => `${e.table} ${e.op} ${e.rowId}`)
    expect(queued).toEqual([
      'links upsert l1',
      'project_prefs upsert events',
      'project_prefs upsert links',
      'project_prefs upsert todo',
    ])
    const todoEntry = (await db.outbox.toArray()).find((e) => e.rowId === 'todo')
    expect(todoEntry?.payload).toEqual({ id: 'todo', starred: 1, hidden: 0, updatedAt: 0 })

    // Re-opening at the current version must not queue them a second time.
    db.close()
    await db.open()
    expect(await db.outbox.count()).toBe(4)
  })

  it('v16 → current with no stars or hidden choices queues nothing', async () => {
    await writeOld(16, V16_STORES, async (old) => {
      await old.table('projectStats').add({ id: 'trips', opens: 1, starred: 0, lastOpenedAt: 5 })
    })
    await db.open()
    expect(await db.projectPrefs.count()).toBe(0)
    expect(await db.outbox.count()).toBe(0)
    expect(await db.projectStats.get('trips')).toEqual({ id: 'trips', opens: 1, lastOpenedAt: 5 })
  })

  it('v17 → current: an empty eventInterest table appears; every row and the outbox are kept', async () => {
    await writeOld(17, V17_STORES, async (old) => {
      await old.table('eventMarks').add({ id: 'e1', state: 'hidden', event: { id: 'e1', title: 'x' }, updatedAt: 5 })
      await old.table('projectPrefs').add({ id: 'links', starred: 1, hidden: null, updatedAt: 3 })
      await old.table('projectStats').add({ id: 'links', opens: 4, lastOpenedAt: 9 })
      await old.table('outbox').add({ table: 'event_marks', op: 'upsert', rowId: 'e1', ts: 1 })
    })
    await db.open()
    expect(db.verno).toBe(18)
    expect(await db.eventInterest.count()).toBe(0)
    expect(await db.eventMarks.get('e1')).toMatchObject({ state: 'hidden', updatedAt: 5 })
    expect(await db.projectPrefs.get('links')).toEqual({ id: 'links', starred: 1, hidden: null, updatedAt: 3 })
    expect(await db.projectStats.get('links')).toEqual({ id: 'links', opens: 4, lastOpenedAt: 9 })
    expect((await db.outbox.toArray()).map((e) => `${e.table} ${e.rowId}`)).toEqual(['event_marks e1'])
    // The new table is usable, with its value index.
    await db.eventInterest.put({ id: 'e1', value: -1, features: {} as never, updatedAt: 6 })
    expect(await db.eventInterest.where('value').equals(-1).count()).toBe(1)
  })
})
