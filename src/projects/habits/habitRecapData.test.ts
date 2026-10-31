import { describe, expect, it } from 'vitest'
import type { Habit, HabitDayState } from '../../lib/db'
import { buildRecap, recapPeriod, shiftPeriod, tallyReasons } from './habitRecapData'

const habit = (id: string, target: number | undefined, created = '2026-10-01'): Habit => ({
  id,
  name: id,
  emoji: '✅',
  createdAt: new Date(`${created}T12:00:00`).getTime(),
  target,
})
const st = (o: Record<string, HabitDayState>) => new Map(Object.entries(o))

describe('recapPeriod', () => {
  it('week is Monday..Sunday, month is the whole month, and both shift', () => {
    const w = recapPeriod('week', '2026-11-01')
    expect([w.from, w.to, w.days.length]).toEqual(['2026-10-26', '2026-11-01', 7])
    expect(shiftPeriod(w, -1).from).toBe('2026-10-19')
    const m = recapPeriod('month', '2026-10-15')
    expect([m.from, m.to, m.days.length]).toEqual(['2026-10-01', '2026-10-31', 31])
    expect(shiftPeriod(m, 1).from).toBe('2026-11-01')
  })
})

describe('buildRecap grace', () => {
  const week = recapPeriod('week', '2026-10-28')
  const avoid = (grace: number): Habit => ({ ...habit('a', 7, '2026-10-01'), direction: 'avoid', grace })
  const states = new Map([
    ['a', st({ '2026-10-26': 'done', '2026-10-27': 'fail', '2026-10-28': 'fail', '2026-10-29': 'done' })],
  ])

  it('slips inside the grace do not fail the week; one past it does', () => {
    const [ok] = buildRecap([avoid(2)], states, new Map(), week, '2026-10-30')
    expect(ok).toMatchObject({ hit: true, graceUsed: 2 })
    const [past] = buildRecap([avoid(1)], states, new Map(), week, '2026-10-30')
    expect(past).toMatchObject({ hit: false, graceUsed: 1 })
  })
})

describe('buildRecap', () => {
  const week = recapPeriod('week', '2026-10-28') // 26 Oct .. 1 Nov
  it('counts states, reasons, expected and hit for a daily habit', () => {
    const states = new Map([
      ['d', st({ '2026-10-26': 'done', '2026-10-27': 'floor', '2026-10-28': 'skip', '2026-10-29': 'fail' })],
    ])
    const notes = new Map([
      [
        'd',
        new Map([
          ['2026-10-28', 'sick'],
          ['2026-10-29', 'anchor'],
        ]),
      ],
    ])
    const [row] = buildRecap([habit('d', 7)], states, notes, week, '2026-10-30')
    expect(row).toMatchObject({ done: 2, floor: 1, skip: 1, fail: 1, empty: 1, expected: 4, hit: false })
    expect(row!.reasons).toEqual({ sick: 1, anchor: 1 })
    expect(row!.cells.at(-1)?.state).toBe('future')
  })

  it('weekly habit expects its target; a full week hits at target', () => {
    const states = new Map([['w', st({ '2026-10-26': 'done', '2026-10-28': 'floor', '2026-10-30': 'done' })]])
    const [row] = buildRecap([habit('w', 3)], states, new Map(), week, '2026-11-01')
    expect(row).toMatchObject({ done: 3, expected: 3, hit: true })
  })

  it('days before the habit existed are not misses', () => {
    const [row] = buildRecap([habit('n', 7, '2026-10-29')], new Map(), new Map(), week, '2026-10-30')
    expect(row).toMatchObject({ empty: 2, expected: 2 })
    expect(row!.cells[0]?.state).toBe('before')
  })

  it('tallies reasons across habits, most frequent first', () => {
    const a = { reasons: { sick: 1, anchor: 2 } } as never
    const b = { reasons: { sick: 2 } } as never
    expect(tallyReasons([a, b])).toEqual([
      ['sick', 3],
      ['anchor', 2],
    ])
  })
})

describe('buildRecap overshoot', () => {
  it('sums the taps above the goal over the period', () => {
    const week = recapPeriod('week', '2026-10-28')
    const counts = new Map([
      [
        'd',
        new Map([
          ['2026-10-26', 2],
          ['2026-10-27', 1],
          ['2026-10-28', 4],
        ]),
      ],
    ])
    const [row] = buildRecap([habit('d', 7)], new Map(), new Map(), week, '2026-10-30', counts)
    expect(row?.extra).toBe(4) // (2-1) + (4-1)
  })
})
