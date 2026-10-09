// M4: removing owner-only data from a device after sign-out clears exactly the
// private tables and their outbox entries, and nothing else.
import { beforeEach, describe, expect, it } from 'vitest'
import { db, resetDb } from '../test/fakeDb'
import { clearPrivateData, privateDataSummary } from './privateData'
import type { EventInterest, EventMark, LifeWeek, MealEntry, Todo } from './db'

beforeEach(resetDb)

const meal: MealEntry = {
  id: 'm1',
  day: '2026-10-08',
  meal: 'lunch',
  text: 'pasta',
  weighed: false,
  grams: null,
  kcal: null,
  proteinG: null,
  carbsG: null,
  fatG: null,
  estimated: false,
  createdAt: 1,
  updatedAt: 1,
}
const week = { id: '2026-10-05', week: '2026-10-05', plan: {}, importedAt: 1, updatedAt: 1 } as unknown as LifeWeek
const mark = { id: 'e1', state: 'saved', event: {}, updatedAt: 1 } as unknown as EventMark
const signal = { id: 'e1', value: -1, features: {}, updatedAt: 1 } as unknown as EventInterest
const todo: Todo = { id: 't1', text: 'shared', done: 0, createdAt: 1, updatedAt: 1 }

async function seed() {
  await db.meals.put(meal)
  await db.lifeWeeks.put(week)
  await db.eventMarks.put(mark)
  await db.eventPrefs.put({ id: 'prefs', favouriteCategories: ['music'], updatedAt: 1 })
  await db.eventInterest.put(signal)
  await db.todos.put(todo)
  await db.outbox.bulkAdd([
    { table: 'meal_entries', op: 'upsert', rowId: 'm1', payload: meal, ts: 1 },
    { table: 'life_weeks', op: 'upsert', rowId: week.id, payload: week, ts: 2, dead: 1 },
    { table: 'todos', op: 'upsert', rowId: 't1', payload: todo, ts: 3 },
    { table: 'event_interest', op: 'delete', rowId: 'e2', ts: 4, dead: 1 },
  ])
}

describe('private data on this device', () => {
  it('summary counts private rows and their unsynced outbox entries only', async () => {
    expect(await privateDataSummary()).toEqual({ rows: 0, unsynced: 0 })
    await seed()
    expect(await privateDataSummary()).toEqual({ rows: 5, unsynced: 3 })
  })

  it('clearPrivateData removes private rows and outbox entries, keeps everything else', async () => {
    await seed()
    await clearPrivateData()
    expect(await privateDataSummary()).toEqual({ rows: 0, unsynced: 0 })
    expect(await db.todos.get('t1')).toBeDefined()
    expect((await db.outbox.toArray()).map((e) => e.table)).toEqual(['todos'])
  })
})
