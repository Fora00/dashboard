import { describe, expect, it } from 'vitest'
import type { Habit, HabitDayState } from '../../lib/db'
import {
  boxSpan,
  buildKindBoards,
  buildLifeboard,
  byMonth,
  colorsFor,
  groupByEngine,
  habitKind,
  NO_ENGINE_LABEL,
  PALETTE,
  splitByKind,
  winsOn,
} from './lifeboardData'

const habit = (id: string, createdAt: number): Habit => ({
  id,
  name: id,
  emoji: '✅',
  createdAt,
})
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
        [
          'a',
          data({
            '2026-10-01': 'done',
            '2026-10-02': 'fail',
            '2026-10-03': 'floor',
          }),
        ],
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
    const later = new Map([
      [
        'a',
        data({
          '2026-10-01': 'done',
          '2026-10-02': 'fail',
          '2026-10-03': 'done',
        }),
      ],
    ])
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

describe('kind boards (EN3)', () => {
  const mk = (id: string, createdAt: number, extra: Partial<Habit> = {}): Habit => ({
    ...habit(id, createdAt),
    ...extra,
  })
  const legacy = mk('legacy', 1)
  const fit = mk('fit', 2, { kind: 'forever', engine: 'physical-health' })
  const cash = mk('cash', 3, { kind: 'forever', engine: 'money' })
  const read = mk('read', 4, { kind: 'forever', engine: 'mind' })
  const trial = mk('trial', 5, { kind: 'experiment', engine: 'emotions' })
  const trial2 = mk('trial2', 6, { kind: 'experiment' })
  const all = [legacy, fit, cash, read, trial, trial2]
  const days = new Map([
    ['legacy', data({ '2026-09-01': 'done', '2026-10-01': 'done' })],
    [
      'fit',
      data({
        '2026-10-01': 'done',
        '2026-10-02': 'floor',
        '2026-10-03': 'fail',
      }),
    ],
    ['cash', data({ '2026-10-02': 'done' })],
    ['read', data({}, { '2026-10-04': 3 })],
    ['trial', data({ '2026-10-05': 'done' })],
    ['trial2', data({ '2026-10-05': 'skip' })],
  ])

  it('legacy habits without a kind are forever', () => {
    expect(habitKind(legacy)).toBe('forever')
    const split = splitByKind(all)
    expect(split.forever.map((h) => h.id)).toEqual(['legacy', 'fit', 'cash', 'read'])
    expect(split.experiment.map((h) => h.id)).toEqual(['trial', 'trial2'])
  })

  it('groups by engine in the engines order, untagged last, with group totals', () => {
    const boards = buildKindBoards(all, days)
    expect(boards.forever.groups.map((g) => [g.engine, g.total])).toEqual([
      ['physical-health', 2],
      ['mind', 3],
      ['money', 1],
      [null, 2],
    ])
    expect(boards.forever.groups.at(-1)!.label).toBe(NO_ENGINE_LABEL)
    expect(boards.experiment.groups.map((g) => [g.engine, g.total])).toEqual([
      ['emotions', 1],
      [null, 0],
    ])
    expect(boards.forever.total).toBe(8)
    expect(boards.experiment.total).toBe(1)
    expect(boards.experiment.habitCount).toBe(2)
  })

  it('lifetime counts per habit and colours are the same as on one board of all habits', () => {
    const whole = buildLifeboard(all, days)
    const boards = buildKindBoards(all, days)
    const split = [...boards.forever.legend, ...boards.experiment.legend]
    for (const row of whole.legend) {
      const mine = split.find((r) => r.habit.id === row.habit.id)!
      expect([mine.total, mine.color]).toEqual([row.total, row.color])
    }
    expect(boards.forever.total + boards.experiment.total).toBe(whole.total)
    expect(boards.forever.boxes.every((b) => b.habitId !== 'trial')).toBe(true)
  })

  it('an unknown engine key falls into the untagged group; empty groups are left out', () => {
    const odd = mk('odd', 7, { engine: 'nope' as Habit['engine'] })
    const groups = groupByEngine([{ habit: odd, color: '#000', total: 4 }])
    expect(groups).toEqual([
      {
        engine: null,
        label: NO_ENGINE_LABEL,
        rows: [expect.anything()],
        total: 4,
      },
    ])
    expect(groupByEngine([])).toEqual([])
  })
})
