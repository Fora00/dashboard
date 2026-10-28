import { describe, expect, it } from 'vitest'
import type { LifeChoreEntry, LifeChoreValue } from '../../../lib/db'
import {
  addDays,
  choreEntryId,
  choresByWeek,
  weekKey,
  parseDayKey,
  choreRef,
  decodeDayFocusParam,
  encodeDayFocusLink,
  parseChoresJson,
  parseDayFocusJson,
  planChoreImport,
  sortChores,
  summarizeChores,
  toggleChoreValue,
} from './index'

const cv = (name: string, over: Partial<LifeChoreValue> = {}): LifeChoreValue => ({
  name,
  repeat: false,
  done: false,
  count: 0,
  asOf: '2026-10-28',
  ...over,
})
let n = 0
const row = (value: LifeChoreValue): LifeChoreEntry => {
  n++
  return {
    id: choreEntryId(choreRef(value.name)),
    week: '2026-10-26',
    kind: 'chore',
    ref: choreRef(value.name),
    day: '2026-10-28',
    value,
    createdAt: n,
    updatedAt: n,
  }
}
const plan = (existing: LifeChoreEntry[], incoming: LifeChoreValue[]) =>
  planChoreImport(existing, incoming, '2026-10-26', '2026-10-28', 99)

describe('planChoreImport', () => {
  it('inserts new chores with id chore:<ref>', () => {
    const p = plan([], [cv('mettere bidoni')])
    expect(p.upserts.map((e) => e.id)).toEqual(['chore:mettere-bidoni'])
    expect(p.deletes).toEqual([])
  })

  it('leaves unchanged chores alone and deletes the ones that left the snapshot', () => {
    const keep = row(cv('a'))
    const gone = row(cv('b'))
    const p = plan([keep, gone], [cv('a')])
    expect(p.upserts).toEqual([])
    expect(p.deletes).toEqual([gone.id])
  })

  it('replaces a changed value (the counter moved)', () => {
    const p = plan([row(cv('a', { repeat: true, count: 3 }))], [cv('a', { repeat: true, count: 4, done: true })])
    expect(p.upserts[0]?.value.count).toBe(4)
  })

  it('never goes backwards: a newer stored asOf wins, an older snapshot deletes nothing', () => {
    const stored = row(cv('a', { asOf: '2026-10-29', count: 5, repeat: true }))
    const other = row(cv('b', { asOf: '2026-10-29' }))
    const p = plan([stored, other], [cv('a', { asOf: '2026-10-28', count: 4, repeat: true })])
    expect(p.upserts).toEqual([])
    expect(p.deletes).toEqual([])
  })

  it('keeps a tick made here today when the same-day snapshot still says open', () => {
    const ticked = row(cv('a', { done: true, repeat: true, count: 4 }))
    const p = plan([ticked], [cv('a', { done: false, repeat: true, count: 3 })])
    expect(p.upserts).toEqual([])
  })
})

describe('toggleChoreValue', () => {
  it('a recurring chore moves its counter and last day', () => {
    const done = toggleChoreValue(cv('a', { repeat: true, count: 2, last: '2026-10-20' }), '2026-10-28')
    expect(done).toMatchObject({ done: true, count: 3, last: '2026-10-28', asOf: '2026-10-28' })
    const back = toggleChoreValue(done, '2026-10-28')
    expect(back).toMatchObject({ done: false, count: 2 })
    expect(back.last).toBeUndefined()
  })

  it('a one-off chore keeps its count', () => {
    expect(toggleChoreValue(cv('a'), '2026-10-28')).toMatchObject({ done: true, count: 0 })
  })
})

describe('sort and summary', () => {
  it('open first, then by name', () => {
    const rows = [row(cv('b', { done: true })), row(cv('z')), row(cv('a'))]
    expect(sortChores(rows).map((e) => e.value.name)).toEqual(['a', 'z', 'b'])
    expect(summarizeChores(rows)).toEqual({ total: 3, done: 1, repeating: 0 })
  })
})

describe('parseChoresJson', () => {
  it('accepts the Mac snapshot shape (last may be null)', () => {
    const ok = JSON.stringify([{ name: 'x', repeat: true, done: false, count: 4, last: null, asOf: '2026-10-28' }])
    const r = parseChoresJson(ok)
    expect(r.ok && r.chores[0]).toEqual({ name: 'x', repeat: true, done: false, count: 4, asOf: '2026-10-28' })
  })

  it('rejects bad values and names that slug alike', () => {
    expect(parseChoresJson(JSON.stringify([{ name: '', repeat: 1, done: false, count: -1, asOf: 'x' }])).ok).toBe(false)
    expect(parseChoresJson(JSON.stringify([cv('Fare  Bidoni'), cv('fare bidoni')])).ok).toBe(false)
  })
})

describe('Oggi link with snapshots', () => {
  it('carries focus and chores in one link', () => {
    const r = parseDayFocusJson(JSON.stringify({ day: '2026-10-28', lines: ['A'], chores: [cv('a')], streaks: [] }))
    expect(r.ok).toBe(true)
    if (!r.ok) return
    const back = decodeDayFocusParam(encodeDayFocusLink(r.plan).split('d=')[1] ?? '')
    expect(back.ok && JSON.parse(back.text).chores).toHaveLength(1)
  })

  it('lines may be empty only when a snapshot rides along', () => {
    expect(parseDayFocusJson(JSON.stringify({ day: '2026-10-28', lines: [] })).ok).toBe(false)
    expect(parseDayFocusJson(JSON.stringify({ day: '2026-10-28', lines: [], chores: [cv('a')] })).ok).toBe(true)
  })

  it('a bad chore invalidates the link', () => {
    expect(parseDayFocusJson(JSON.stringify({ day: '2026-10-28', lines: ['A'], chores: [{ name: 'x' }] })).ok).toBe(
      false,
    )
  })
})

describe('choresByWeek', () => {
  const wk = (strip: string, over: Partial<LifeChoreValue> = {}) => row(cv(`c${strip}`, { wk: strip, ...over }))
  const by = (rows: LifeChoreEntry[]) => choresByWeek(rows, (d) => weekKey(parseDayKey(d)), addDays)

  it('share of chores done per week, ending on the snapshot week', () => {
    const m = by([wk('000000000011'), wk('000000000001')])
    expect(m.get('2026-10-26')).toBe(100)
    expect(m.get('2026-10-19')).toBe(50)
  })

  it('weeks before the first completion are unknown, not 0%', () => {
    const m = by([wk('000000000100')])
    expect([...m.keys()]).toEqual(['2026-10-12', '2026-10-19', '2026-10-26'])
    expect(m.get('2026-10-26')).toBe(0)
  })

  it('a chore ticked today counts in the current week; no history gives nothing', () => {
    expect(by([wk('000000000000', { done: true })]).size).toBe(1)
    expect(by([wk('000000000000')]).size).toBe(0)
    expect(by([]).size).toBe(0)
  })
})
