import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { db, resetDb } from '../test/fakeDb'
import { drain } from '../test/drain'

import type { LifePlan } from './db'
import { LIFE_CAPS } from '../projects/life/model'
import {
  addDayFocus,
  addIdea,
  addUpgrade,
  editDayFocus,
  importWeek,
  logPlaybook,
  logTracker,
  markTasksSent,
  removeDayFocus,
  removeIdea,
  removeTrackerEntry,
  removeUpgrade,
  restoreEntry,
  setCheckin,
  setFocusDone,
  setPlaybookNote,
  setSundayAnswer,
  setWhy,
  setTrackerEnergy,
  toggleDayFocus,
  toggleFocus,
  updateIdea,
  updateUpgrade,
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

describe('importWeek: Streaks snapshot', () => {
  const s = (name: string, streak = 1, asOf = '2026-10-01') => ({ name, days: 'd'.repeat(28), streak, asOf })
  const streakRows = async () =>
    (await db.lifeEntries.toArray()).filter((e) => e.kind === 'streak').sort((a, b) => a.ref.localeCompare(b.ref))

  it('upserts by ref keeping the id, deletes missing habits, absent leaves them alone', async () => {
    await importWeek(plan(), [s('Read'), s('Walk')])
    const first = await streakRows()
    expect(first.map((e) => [e.id, e.week])).toEqual([
      ['streak:read', WEEK],
      ['streak:walk', WEEK],
    ])
    // No `streaks` in the JSON: untouched.
    await importWeek(plan({ week: '2026-10-05' }))
    expect(await streakRows()).toEqual(first)
    // Walk archived in Streaks, Read moved on: replaced in place, same id and week.
    await importWeek(plan({ week: '2026-10-05' }), [s('Read', 4, '2026-10-06')])
    const after = await streakRows()
    expect(after).toHaveLength(1)
    expect(after[0]).toMatchObject({ id: 'streak:read', week: WEEK, value: { streak: 4, asOf: '2026-10-06' } })
    expect((await entryOps()).filter((o) => o.op === 'delete')).toHaveLength(1)
  })

  it('an unchanged snapshot queues nothing; an invalid one writes nothing at all', async () => {
    await importWeek(plan(), [s('Read')])
    const before = (await entryOps()).length
    await importWeek(plan(), [s('Read')])
    expect((await entryOps()).length).toBe(before)
    await expect(importWeek(plan(), [{ ...s('Walk'), days: 'd' }])).rejects.toThrow(/days/)
    expect((await streakRows()).map((e) => e.ref)).toEqual(['read'])
  })
})

describe('playbook', () => {
  it('each use is a new random-id row with an optional trimmed note; the note can be edited', async () => {
    const a = await logPlaybook(WEEK, { day: '2026-09-29', note: '  worked well  ' })
    const b = await logPlaybook(WEEK)
    expect(a.id).not.toBe(b.id)
    expect(a).toMatchObject({ kind: 'playbook', ref: 'playbook', day: '2026-09-29', value: { note: 'worked well' } })
    expect(b.value).toEqual({})
    await setPlaybookNote(b, 'later note')
    expect((await db.lifeEntries.get(b.id))?.value).toEqual({ note: 'later note' })
    await setPlaybookNote(b, ' ')
    expect((await db.lifeEntries.get(b.id))?.value).toEqual({})
    await expect(logPlaybook(WEEK, { note: 'x'.repeat(LIFE_CAPS.playbookNote + 1) })).rejects.toThrow()
    expect(await db.lifeEntries.count()).toBe(2)
  })

  it('Undo deletes the row', async () => {
    const a = await logPlaybook(WEEK)
    await removeTrackerEntry(a.id)
    expect(await db.lifeEntries.count()).toBe(0)
  })
})

describe('spock test: why not + habit ideas', () => {
  it('a reason is one keyed row per week and habit, edited in place; blank with no row writes nothing', async () => {
    await setWhy(WEEK, 'water', '  not accessible  ')
    await setWhy(WEEK, 'water', 'bottle in the other room')
    expect(await db.lifeEntries.count()).toBe(1)
    expect(await db.lifeEntries.get(`${WEEK}:why:water`)).toMatchObject({
      kind: 'why',
      ref: 'water',
      value: { reason: 'bottle in the other room' },
    })
    await setWhy(WEEK, 'water', ' ')
    expect((await db.lifeEntries.get(`${WEEK}:why:water`))?.value).toEqual({ reason: '' })
    await setWhy(WEEK, 'run', ' ')
    expect(await db.lifeEntries.count()).toBe(1)
    await expect(setWhy(WEEK, 'water', 'x'.repeat(LIFE_CAPS.whyReason + 1))).rejects.toThrow()
  })

  it('ideas start open, can change text and status, and are deleted for real', async () => {
    expect(await addIdea(WEEK, 'water', '  ')).toBeNull()
    const idea = await addIdea(WEEK, 'water', ' 1 L bottle at 08:00 ')
    expect(idea).toMatchObject({ kind: 'idea', ref: 'water', value: { text: '1 L bottle at 08:00', status: 'open' } })
    await updateIdea(idea!, { status: 'trying' })
    expect((await db.lifeEntries.get(idea!.id))?.value).toEqual({ text: '1 L bottle at 08:00', status: 'trying' })
    await updateIdea(idea!, { text: ' ' })
    expect((await db.lifeEntries.get(idea!.id))?.value).toMatchObject({ text: '1 L bottle at 08:00' })
    await removeIdea(idea!.id)
    expect(await db.lifeEntries.count()).toBe(0)
  })
})

describe('upgrade list', () => {
  it('starts open and quick, ignores blank text, enforces the cap', async () => {
    expect(await addUpgrade(WEEK, '  ')).toBeNull()
    const u = await addUpgrade(WEEK, ' fix the loose door handle ')
    expect(u).toMatchObject({
      kind: 'upgrade',
      ref: 'upgrade',
      week: WEEK,
      value: { text: 'fix the loose door handle', size: 'quick', status: 'open' },
    })
    await expect(addUpgrade(WEEK, 'x'.repeat(LIFE_CAPS.upgradeText + 1))).rejects.toThrow()
    expect(await db.lifeEntries.count()).toBe(1)
  })

  it('done stamps doneAt, undo clears it, drop and size change keep one row', async () => {
    const u = (await addUpgrade(WEEK, 'loose door handle'))!
    await updateUpgrade(u, { status: 'done', doneAt: '2026-09-30' })
    const done = (await db.lifeEntries.get(u.id))!
    expect(done.value).toEqual({ text: 'loose door handle', size: 'quick', status: 'done', doneAt: '2026-09-30' })
    // Undo: back to open, no doneAt left behind.
    await updateUpgrade(done as typeof u, { status: 'open' })
    expect((await db.lifeEntries.get(u.id))?.value).toEqual({
      text: 'loose door handle',
      size: 'quick',
      status: 'open',
    })
    await updateUpgrade(u, { size: 'big' })
    await updateUpgrade((await db.lifeEntries.get(u.id)) as typeof u, { status: 'dropped' })
    expect((await db.lifeEntries.get(u.id))?.value).toMatchObject({ size: 'big', status: 'dropped' })
    expect(await db.lifeEntries.count()).toBe(1)
  })

  it('a no-op or empty text writes nothing; delete is for real', async () => {
    const u = (await addUpgrade(WEEK, 'a'))!
    const before = (await db.outbox.count()) as number
    await updateUpgrade(u, { text: ' ' })
    await updateUpgrade(u, { status: 'open' })
    expect(await db.outbox.count()).toBe(before)
    await removeUpgrade(u.id)
    expect(await db.lifeEntries.count()).toBe(0)
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

describe("today's focus (life_day_focus)", () => {
  const DAY = '2026-10-21'
  const ops = async () => (await db.outbox.toArray()).filter((o) => o.table === 'life_day_focus')

  it('adds up to 3 lines per day into slots; the rest does not fit', async () => {
    expect(await addDayFocus(DAY, ['Esempio A', '  Esempio B ', '', 'Esempio C', 'Esempio D'])).toBe(3)
    const rows = await db.lifeDayFocus.where('day').equals(DAY).sortBy('slot')
    expect(rows.map((r) => [r.id, r.title, r.done])).toEqual([
      [`${DAY}:0`, 'Esempio A', false],
      [`${DAY}:1`, 'Esempio B', false],
      [`${DAY}:2`, 'Esempio C', false],
    ])
    expect(await addDayFocus(DAY, ['Esempio E'])).toBe(0)
    expect(await ops()).toHaveLength(3)
  })

  it('toggle, edit and delete; a freed slot is reused', async () => {
    await addDayFocus(DAY, ['Esempio A', 'Esempio B'])
    expect(await toggleDayFocus(`${DAY}:0`)).toBe(true)
    expect(await toggleDayFocus(`${DAY}:0`)).toBe(false)
    await toggleDayFocus(`${DAY}:0`)
    expect((await db.lifeDayFocus.get(`${DAY}:0`))?.done).toBe(true)
    await editDayFocus(`${DAY}:1`, ' Esempio B2 ')
    await editDayFocus(`${DAY}:1`, '   ')
    expect((await db.lifeDayFocus.get(`${DAY}:1`))?.title).toBe('Esempio B2')
    await removeDayFocus(`${DAY}:0`)
    expect(await db.lifeDayFocus.get(`${DAY}:0`)).toBeUndefined()
    expect(await toggleDayFocus(`${DAY}:0`)).toBeNull()
    await addDayFocus(DAY, ['Esempio F'])
    expect((await db.lifeDayFocus.get(`${DAY}:0`))?.title).toBe('Esempio F')
    expect((await ops()).some((o) => o.op === 'delete')).toBe(true)
  })

  it('days are independent: nothing is carried over, and the week log is untouched', async () => {
    await addDayFocus('2026-10-20', ['Esempio A'])
    await addDayFocus(DAY, ['Esempio B'])
    expect((await db.lifeDayFocus.where('day').equals(DAY).toArray()).map((r) => r.title)).toEqual(['Esempio B'])
    expect(await db.lifeEntries.count()).toBe(0)
  })
})
