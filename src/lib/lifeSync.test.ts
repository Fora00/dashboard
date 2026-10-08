import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { db, resetDb } from '../test/fakeDb'
import { drain } from '../test/drain'

import type { LifePlan } from './db'
import { LIFE_CAPS } from '../projects/life/model'
import {
  importWeek,
  logTracker,
  markTasksSent,
  removeTrackerEntry,
  restoreEntry,
  setCheckin,
  setFocusDone,
  setSundayAnswer,
  setTrackerEnergy,
  toggleFocus,
} from './lifeSync'

beforeEach(resetDb)
afterEach(() => drain(async () => String(await db.outbox.count())))

const WEEK = '2026-09-28' // a Monday
const plan = (over: Partial<LifePlan> = {}): LifePlan => ({
  version: 1,
  week: WEEK,
  focus: [],
  rules: [],
  tasks: [],
  trackers: [],
  sundayCheck: [],
  checkins: [],
  ...over,
})
const entryOps = async () => (await db.outbox.toArray()).filter((o) => o.table === 'life_entries')

describe('importWeek', () => {
  it('stores the week keyed by its Monday and queues an upsert; a re-import replaces the plan', async () => {
    const w = await importWeek(plan({ rules: ['one'] }))
    expect(w.id).toBe(WEEK)
    await importWeek(plan({ rules: ['two'] }))
    expect(await db.lifeWeeks.count()).toBe(1)
    expect((await db.lifeWeeks.get(WEEK))?.plan.rules).toEqual(['two'])
    expect((await db.outbox.toArray()).filter((o) => o.table === 'life_weeks' && o.op === 'upsert')).toHaveLength(2)
  })

  it('rejects an invalid plan without writing anything', async () => {
    await expect(importWeek(plan({ week: '2026-09-29' }))).rejects.toThrow()
    expect(await db.lifeWeeks.count()).toBe(0)
    expect(await db.outbox.count()).toBe(0)
  })

  it('never touches existing entries', async () => {
    await setFocusDone(WEEK, 'f1', true)
    await importWeek(plan())
    expect(await db.lifeEntries.count()).toBe(1)
  })
})

describe('trackers', () => {
  it('each +1 is a new random-id row; energy is validated', async () => {
    const a = await logTracker(WEEK, 't1', {
      day: '2026-09-29',
      energyBefore: 2,
      energyAfter: 4,
    })
    const b = await logTracker(WEEK, 't1')
    expect(a.id).not.toBe(b.id)
    expect(a).toMatchObject({
      kind: 'tracker',
      ref: 't1',
      day: '2026-09-29',
      value: { energyBefore: 2, energyAfter: 4 },
    })
    expect(b.value).toEqual({})
    await expect(logTracker(WEEK, 't1', { energyBefore: 6 })).rejects.toThrow()
    await expect(logTracker(WEEK, 't1', { energyAfter: 1.5 })).rejects.toThrow()
    expect(await db.lifeEntries.count()).toBe(2)
  })

  it('setTrackerEnergy merges into the existing value and bumps updatedAt', async () => {
    const e = await logTracker(WEEK, 't1', { energyBefore: 2 })
    await new Promise((r) => setTimeout(r, 5))
    await setTrackerEnergy(e, { energyAfter: 5 })
    const row = (await db.lifeEntries.get(e.id))!
    expect(row.value).toEqual({ energyBefore: 2, energyAfter: 5 })
    expect(row.updatedAt).toBeGreaterThan(e.updatedAt)
  })

  it('remove then restore brings back the same id', async () => {
    const e = await logTracker(WEEK, 't1')
    await removeTrackerEntry(e.id)
    expect(await db.lifeEntries.count()).toBe(0)
    await restoreEntry(e)
    expect((await db.lifeEntries.get(e.id))?.ref).toBe('t1')
    expect((await entryOps()).map((o) => o.op)).toEqual(['upsert', 'delete', 'upsert'])
  })
})

describe('keyed entries', () => {
  it('focus uses a deterministic id, toggles in place and keeps createdAt', async () => {
    expect(await toggleFocus(WEEK, 'f1')).toBe(true)
    const id = `${WEEK}:focus:f1`
    const first = (await db.lifeEntries.get(id))!
    await new Promise((r) => setTimeout(r, 5))
    expect(await toggleFocus(WEEK, 'f1')).toBe(false)
    const second = (await db.lifeEntries.get(id))!
    expect(second.value).toEqual({ done: false })
    expect(second.createdAt).toBe(first.createdAt)
    expect(second.updatedAt).toBeGreaterThan(first.updatedAt)
    expect(await db.lifeEntries.count()).toBe(1)
  })

  it('sunday answers are stored under their key and null clears in place', async () => {
    await setSundayAnswer(WEEK, 'q1', 4)
    await setSundayAnswer(WEEK, 'q1', null)
    const row = (await db.lifeEntries.get(`${WEEK}:sunday:q1`))!
    expect(row.value).toEqual({ answer: null })
    expect(await db.lifeEntries.count()).toBe(1)
  })

  it('check-in trims the note, drops an empty one, and rejects an over-long one', async () => {
    const a = await setCheckin(WEEK, 'c1', { done: true, note: '  hi  ' })
    expect(a.id).toBe(`${WEEK}:checkin:c1`)
    expect(a.value).toEqual({ done: true, note: 'hi' })
    const b = await setCheckin(WEEK, 'c1', { done: true, note: '   ' })
    expect(b.value).toEqual({ done: true })
    await expect(
      setCheckin(WEEK, 'c1', {
        done: true,
        note: 'x'.repeat(LIFE_CAPS.checkinNote + 1),
      }),
    ).rejects.toThrow()
    expect((await db.lifeEntries.get(a.id))?.value).toEqual({ done: true })
  })

  it('markTasksSent records sends (last 10), resend appends, unsend keeps history, empty is a no-op', async () => {
    await markTasksSent(WEEK, [])
    expect(await db.outbox.count()).toBe(0)
    await markTasksSent(WEEK, ['a', 'b'])
    expect(await entryOps()).toHaveLength(2)
    for (let i = 0; i < 11; i++) await markTasksSent(WEEK, ['a'])
    const a = (await db.lifeEntries.get(`${WEEK}:sent:a`))!
    expect(a.kind === 'sent' && a.value.sends).toHaveLength(10)
    await markTasksSent(WEEK, ['a'], false)
    const after = (await db.lifeEntries.get(`${WEEK}:sent:a`))!
    expect(after.kind === 'sent' && after.value.sent).toBe(false)
    expect(after.kind === 'sent' && after.value.sends).toHaveLength(10)
    const b = (await db.lifeEntries.get(`${WEEK}:sent:b`))!
    expect(b.kind === 'sent' && b.value.sends).toHaveLength(1)
  })
})
