// H2: the same habit checked on two devices must never get stuck or
// duplicate. Check ids are deterministic (habit + day), a 23505 from a
// pre-deterministic check counts as done, and local duplicates are harmless
// (unchecking removes them all; every pull collapses them).
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { db, resetDb } from '../test/fakeDb'
import { drain } from '../test/drain'
import type { FakeSupabase } from '../test/fakeSupabase'
import { addHabit, checkId, dedupeChecks, setDayState, setSlipCount, sync, toggleCheck, updateHabit } from './habitSync'
import type { HabitCheck, LifeEngineKey } from './db'

const fake = await vi.hoisted(async () => {
  const { createFakeSupabase } = await import('../test/fakeSupabase')
  return createFakeSupabase() as FakeSupabase
})
vi.mock('./sync', () => ({
  get supabase() {
    return fake.client
  },
  syncEnabled: true,
}))

const settle = () => drain(async () => `${fake.calls.length}|${JSON.stringify(await db.outbox.toArray())}`)
const DAY = '2026-10-08'
const check = (id: string, createdAt = 1): HabitCheck => ({ id, habitId: 'h1', day: DAY, createdAt })
const checkRow = (c: HabitCheck) => ({ id: c.id, habit_id: c.habitId, day: c.day, created_at: c.createdAt })

beforeEach(async () => {
  await resetDb()
  fake.reset()
  vi.unstubAllGlobals()
  vi.stubGlobal('navigator', { onLine: true })
})
afterEach(async () => {
  await settle()
  vi.unstubAllGlobals()
})

describe('deterministic check ids', () => {
  it('the same habit and day give the same id; another day or habit does not', () => {
    expect(checkId('h1', DAY)).toBe(checkId('h1', DAY))
    expect(checkId('h1', DAY)).not.toBe(checkId('h1', '2026-10-09'))
    expect(checkId('h1', DAY)).not.toBe(checkId('h2', DAY))
    expect(checkId('h1', DAY)).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
  })

  it('two devices checking offline push the same row: one server row, no error', async () => {
    await toggleCheck('h1', DAY) // device A
    await settle()
    // Device B: same check made independently (same id by construction).
    await db.habitChecks.clear()
    await toggleCheck('h1', DAY)
    await settle()
    expect(fake.remote.habit_checks?.map((r) => r.id)).toEqual([checkId('h1', DAY)])
    expect(await db.outbox.count()).toBe(0)
    expect(sync.getStatus().dead).toBe(0)
  })
})

describe('legacy duplicates', () => {
  it('a 23505 on habit_checks is treated as already done, not dead-lettered', async () => {
    fake.rejectWith((t, op) =>
      t === 'habit_checks' && op === 'upsert' ? { code: '23505', message: 'duplicate key', status: 409 } : null,
    )
    await toggleCheck('h1', DAY)
    await settle()
    expect(await db.outbox.count()).toBe(0)
    expect(sync.getStatus().dead).toBe(0)
  })

  it('unchecking removes every local check of that habit and day', async () => {
    await db.habitChecks.bulkPut([check('legacy-a'), check('legacy-b')])
    vi.stubGlobal('navigator', { onLine: false })
    await toggleCheck('h1', DAY)
    await settle()
    expect(await db.habitChecks.count()).toBe(0)
    const dels = (await db.outbox.toArray()).map((e) => `${e.op} ${e.rowId}`).sort()
    expect(dels).toEqual(['delete legacy-a', 'delete legacy-b'])
  })

  it('a pull collapses a dead-lettered local duplicate onto the server copy', async () => {
    // Before this fix: device B's random-id check was refused with 23505 and
    // dead-lettered, so it stayed next to the server's row forever.
    const server = check(checkId('h1', DAY), 5)
    fake.remote.habit_checks = [checkRow(server)]
    await db.habitChecks.put(check('legacy', 1))
    await db.outbox.add({
      table: 'habit_checks',
      op: 'upsert',
      rowId: 'legacy',
      payload: check('legacy'),
      ts: 1,
      dead: 1,
      tries: 1,
    })
    await sync.syncNow()
    await settle()
    expect((await db.habitChecks.toArray()).map((c) => c.id)).toEqual([server.id])
    expect(await db.outbox.count()).toBe(0)
    expect(sync.getStatus().dead).toBe(0)
  })

  it('dedupeChecks keeps the deterministic id when no copy is on the server yet', async () => {
    const det = check(checkId('h1', DAY), 9)
    await db.habitChecks.bulkPut([check('legacy', 1), det, { ...check('other'), day: '2026-10-07' }])
    await db.outbox.bulkAdd([
      { table: 'habit_checks', op: 'upsert', rowId: 'legacy', payload: check('legacy'), ts: 1 },
      { table: 'habit_checks', op: 'upsert', rowId: det.id, payload: det, ts: 2 },
    ])
    await dedupeChecks()
    expect((await db.habitChecks.toArray()).map((c) => c.id).sort()).toEqual([det.id, 'other'].sort())
    expect((await db.outbox.toArray()).map((e) => e.rowId)).toEqual([det.id])
  })
})

type CheckRemote = { id: string; day: string; status: string | null; note: string | null }
const remoteChecks = () => (fake.remote.habit_checks ?? []) as unknown as CheckRemote[]

describe('rest-day and missed-day reasons', () => {
  it('a rest day saves its reason locally and on the server', async () => {
    await setDayState('h1', DAY, 'skip', 'sick')
    await settle()
    expect(await db.habitChecks.get(checkId('h1', DAY))).toMatchObject({ status: 'skip', note: 'sick' })
    expect(remoteChecks().map((r) => ({ status: r.status, note: r.note }))).toEqual([{ status: 'skip', note: 'sick' }])
    expect(sync.getStatus().dead).toBe(0)
  })

  it('changing the reason replaces it; marking the day done drops it', async () => {
    await setDayState('h1', DAY, 'skip', 'sick')
    await settle()
    await setDayState('h1', DAY, 'skip', 'tired')
    await settle()
    expect(remoteChecks()[0]).toMatchObject({ status: 'skip', note: 'tired' })
    await setDayState('h1', DAY, 'done')
    await settle()
    expect(remoteChecks()).toHaveLength(1)
    expect(remoteChecks()[0]).toMatchObject({ status: null, note: null })
  })

  it('a missed day keeps its reason too, and no reason stays empty', async () => {
    await setDayState('h1', DAY, 'fail', 'anchor')
    await setDayState('h1', '2026-10-09', 'skip')
    await settle()
    const rows = remoteChecks()
    expect(rows.find((r) => r.day === DAY)).toMatchObject({ status: 'fail', note: 'anchor' })
    expect(rows.find((r) => r.day === '2026-10-09')).toMatchObject({ status: 'skip', note: null })
  })
})

describe('slip counts for habits to avoid', () => {
  it('stores slips as a fail with a count, keeps the reason, and clears at zero', async () => {
    await setSlipCount('h1', DAY, 1, 'forgot')
    await setSlipCount('h1', DAY, 2)
    await settle()
    expect(await db.habitChecks.get(checkId('h1', DAY))).toMatchObject({ status: 'fail', count: 2, note: 'forgot' })
    await setSlipCount('h1', DAY, 0)
    await settle()
    expect(await db.habitChecks.count()).toBe(0)
    expect(sync.getStatus().dead).toBe(0)
  })
})

type HabitRemote = { id: string; name: string; engine: string | null }
const remoteHabits = () => (fake.remote.habits ?? []) as unknown as HabitRemote[]

describe('engine tag (EN2)', () => {
  it('round-trips a tagged and an untagged habit through the server', async () => {
    const tagged = await addHabit('Test habit A', '🅰️', { engine: 'mind' })
    const plain = await addHabit('Test habit B', '🅱️')
    await settle()
    const byId = new Map(remoteHabits().map((r) => [r.id, r]))
    expect(byId.get(tagged.id)?.engine).toBe('mind')
    expect(byId.get(plain.id)?.engine).toBeNull()

    // Pull back from the server as the source of truth.
    await db.habits.clear()
    await sync.syncNow()
    await settle()
    expect((await db.habits.get(tagged.id))?.engine).toBe('mind')
    const back = await db.habits.get(plain.id)
    expect(back).toBeDefined()
    expect(back?.engine).toBeUndefined()
  })

  it('updating can set, change and clear the engine', async () => {
    const h = await addHabit('Test habit C', '🅲')
    await updateHabit(h, h.name, h.emoji, { engine: 'money' })
    expect((await db.habits.get(h.id))?.engine).toBe('money')
    await updateHabit(h, h.name, h.emoji, { engine: undefined })
    await settle()
    expect((await db.habits.get(h.id))?.engine).toBeUndefined()
    expect(remoteHabits().find((r) => r.id === h.id)?.engine).toBeNull()
  })

  it('the writer drops an engine that is not one of the seven', async () => {
    const h = await addHabit('Test habit D', '🅳', { engine: 'hobbies' as LifeEngineKey })
    await settle()
    expect((await db.habits.get(h.id))?.engine).toBeUndefined()
    expect(remoteHabits().find((r) => r.id === h.id)?.engine).toBeNull()
  })

  it('a pulled row with an unknown engine is read as untagged', async () => {
    const row = { id: 'hx', name: 'Test habit E', emoji: '🅴', created_at: 1, engine: 'hobbies' }
    fake.remote.habits = [row]
    await sync.syncNow()
    await settle()
    expect(await db.habits.get('hx')).toMatchObject({ name: 'Test habit E' })
    expect((await db.habits.get('hx'))?.engine).toBeUndefined()
  })
})
