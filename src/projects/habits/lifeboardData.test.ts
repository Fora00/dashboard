import { describe, expect, it } from 'vitest'
import type { Habit, HabitDayState } from '../../lib/db'
import { boxSpan, buildLifeboard, byMonth, colorsFor, PALETTE, winsOn } from './lifeboardData'

const habit = (id: string, createdAt: number): Habit => ({ id, name: id, emoji: '✅', createdAt })
const data = (states: Record<string, HabitDayState>, counts: Record<string, number> = {}) => ({
  states: new Map(Object.entries(states)),
  counts: new Map(Object.entries(counts)),
})

describe('winsOn', () => {
  it('only successes are wins: failures, rest and empty days are never drawn', () => {
    expect([
      winsOn('done', undefined),
      winsOn('floor', undefined),
      winsOn('skip', undefined),
      winsOn('fail', undefined),
      winsOn(undefined, undefined),
    ]).toEqual([1, 1, 0, 0, 0])
  })
  it('multi-tap days count their taps, partial ones too', () => {
    expect(winsOn('done', 4)).toBe(4)
    expect(winsOn(undefined, 2)).toBe(2)
  })
})

describe('buildLifeboard', () => {
  const a = habit('a', 1)
  const b = habit('b', 2)

  it('writes the lifetime count in each box, per habit, and totals', () => {
    const board = buildLifeboard(
      [a, b],
      new Map([
        ['a', data({ '2026-10-01': 'done', '2026-10-02': 'fail', '2026-10-03': 'floor' })],
        ['b', data({ '2026-10-01': 'done' }, { '2026-10-02': 2 })],
      ]),
    )
    expect(board.boxes.filter((x) => x.habitId === 'a').map((x) => x.n)).toEqual([1, 2])
    expect(board.boxes.filter((x) => x.habitId === 'b').map((x) => x.n)).toEqual([1, 2, 3])
    expect(board.total).toBe(5)
    expect(board.legend[0]!.habit.id).toBe('b')
  })

  it('a miss never removes a box: more days only adds', () => {
    const base = new Map([['a', data({ '2026-10-01': 'done' })]])
    const later = new Map([['a', data({ '2026-10-01': 'done', '2026-10-02': 'fail', '2026-10-03': 'done' })]])
    expect(buildLifeboard([a], later).total).toBeGreaterThanOrEqual(buildLifeboard([a], base).total)
  })

  it('orders boxes by day, then by habit', () => {
    const board = buildLifeboard(
      [a, b],
      new Map([
        ['a', data({ '2026-10-02': 'done' })],
        ['b', data({ '2026-10-01': 'done', '2026-10-02': 'done' })],
      ]),
    )
    expect(board.boxes.map((x) => `${x.day}${x.habitId}`)).toEqual(['2026-10-01b', '2026-10-02a', '2026-10-02b'])
  })
})

describe('colorsFor / byMonth', () => {
  it('colours are stable by creation order and cycle through the palette', () => {
    const hs = Array.from({ length: PALETTE.length + 1 }, (_, i) => habit(`h${i}`, i))
    const c = colorsFor(hs)
    expect(c.get('h0')).toBe(PALETTE[0])
    expect(c.get(`h${PALETTE.length}`)).toBe(PALETTE[0])
    expect(colorsFor([habit('x', -1), ...hs]).get('h0')).toBe(PALETTE[1]) // an older habit shifts later ones
  })

  it('groups newest month first', () => {
    const months = byMonth([
      { day: '2026-09-30', habitId: 'a', n: 1 },
      { day: '2026-10-01', habitId: 'a', n: 2 },
    ])
    expect(months.map(([m]) => m)).toEqual(['2026-10', '2026-09'])
  })
})

describe('boxSpan', () => {
  it('grows with the number and never shrinks, up to a cap', () => {
    expect([1, 8, 9, 35, 36, 80, 81, 143, 144, 224, 225, 5000].map(boxSpan)).toEqual([
      1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6,
    ])
    let prev = 0
    for (let n = 1; n < 400; n++) {
      expect(boxSpan(n)).toBeGreaterThanOrEqual(prev)
      prev = boxSpan(n)
    }
  })
})
