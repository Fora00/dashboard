// One tap on a habit: the same behaviour on the Habits tile and in Life.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { db, resetDb } from '../../test/fakeDb'
import { drain } from '../../test/drain'
import type { FakeSupabase } from '../../test/fakeSupabase'
import { checkId } from '../../lib/habitSync'
import type { Habit } from '../../lib/db'
import { tapHabit, type TapContext } from './habitTap'

const fake = await vi.hoisted(async () => {
  const { createFakeSupabase } = await import('../../test/fakeSupabase')
  return createFakeSupabase() as FakeSupabase
})
vi.mock('../../lib/sync', () => ({
  get supabase() {
    return fake.client
  },
  syncEnabled: true,
}))

const DAY = '2026-10-30'
const settle = () => drain(async () => `${fake.calls.length}|${JSON.stringify(await db.outbox.toArray())}`)
const habit = (extra: Partial<Habit> = {}): Habit => ({ id: 'h1', name: 'h', emoji: '✅', createdAt: 1, ...extra })
const ctx = (extra: Partial<TapContext> = {}): TapContext => ({
  state: 'open',
  count: 0,
  slips: 0,
  stats: { gap: 0 },
  today: DAY,
  ...extra,
})
const stored = () => db.habitChecks.get(checkId('h1', DAY))

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

describe('tapHabit', () => {
  it('a normal habit toggles done', async () => {
    await tapHabit(habit(), ctx())
    expect(await stored()).toMatchObject({ habitId: 'h1', day: DAY })
    await tapHabit(habit(), ctx({ state: 'done' }))
    expect(await stored()).toBeUndefined()
  })

  it('after an empty day the tap marks the floor (two-day rule)', async () => {
    await tapHabit(habit(), ctx({ stats: { gap: 1 } }))
    expect((await stored())?.status).toBe('floor')
  })

  it('a multi-tap habit counts up and resets after the last tap', async () => {
    await tapHabit(habit({ perDay: 2 }), ctx({ count: 0 }))
    expect((await stored())?.count).toBe(1)
    await tapHabit(habit({ perDay: 2 }), ctx({ count: 2, state: 'done' }))
    expect(await stored()).toBeUndefined()
  })

  it('a daily-grace habit adds one slip per tap', async () => {
    const h = habit({ direction: 'avoid', grace: 2, graceScope: 'day' })
    await tapHabit(h, ctx({ slips: 0 }))
    await tapHabit(h, ctx({ slips: 1 }))
    expect(await stored()).toMatchObject({ status: 'fail', count: 2 })
  })

  it('a plain habit to avoid asks why (sheet); a slip already marked is undone by the tap', async () => {
    const h = habit({ direction: 'avoid' })
    expect(await tapHabit(h, ctx({ state: 'done' }))).toBe('sheet')
    expect(await stored()).toBeUndefined()
    await db.habitChecks.put({ id: checkId('h1', DAY), habitId: 'h1', day: DAY, createdAt: 1, status: 'fail' })
    expect(await tapHabit(h, ctx({ state: 'fail' }))).toBeUndefined()
    expect(await stored()).toBeUndefined()
  })
})
