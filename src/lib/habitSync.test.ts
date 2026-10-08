// H2: the same habit checked on two devices must never get stuck or
// duplicate. Check ids are deterministic (habit + day), a 23505 from a
// pre-deterministic check counts as done, and local duplicates are harmless
// (unchecking removes them all; every pull collapses them).
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { db, resetDb } from '../test/fakeDb'
import { drain } from '../test/drain'
import type { FakeSupabase } from '../test/fakeSupabase'
import { checkId, dedupeChecks, sync, toggleCheck } from './habitSync'
import type { HabitCheck } from './db'

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
