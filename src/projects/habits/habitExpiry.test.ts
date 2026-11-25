import { describe, expect, it } from 'vitest'
import type { Habit } from '../../lib/db'
import { expiringHabits, expiringLabel } from './habitExpiry'

const h = (name: string, extra: Partial<Habit> = {}): Habit => ({
  id: name,
  name,
  emoji: '•',
  createdAt: 0,
  kind: 'experiment',
  cycleStart: '2026-11-02',
  ...extra,
})

describe('expiringHabits', () => {
  const today = '2026-11-25'

  it('keeps cycles ending within 14 days and overdue ones without a verdict', () => {
    const out = expiringHabits(
      [
        h('far', { cycleEnd: '2026-12-10' }), // 15 days: out
        h('edge', { cycleEnd: '2026-12-09' }), // 14 days: in
        h('soon', { cycleEnd: '2026-12-06' }),
        h('late', { cycleEnd: '2026-11-20' }),
        h('judged', { cycleEnd: '2026-11-20', verdict: 'stay' }),
        h('archived', { cycleEnd: '2026-11-30', archivedAt: 1 }),
        h('forever', { kind: 'forever', cycleStart: undefined }),
      ],
      today,
    )
    expect(out.map((e) => [e.habit.name, e.left])).toEqual([
      ['late', -5],
      ['soon', 11],
      ['edge', 14],
    ])
  })

  it('sorts same-day ends by name and honours a custom window', () => {
    const out = expiringHabits([h('b', { cycleEnd: '2026-11-28' }), h('a', { cycleEnd: '2026-11-28' })], today, 2)
    expect(out).toEqual([])
    expect(
      expiringHabits([h('b', { cycleEnd: '2026-11-28' }), h('a', { cycleEnd: '2026-11-28' })], today).map(
        (e) => e.habit.name,
      ),
    ).toEqual(['a', 'b'])
  })
})

describe('expiringLabel', () => {
  it('reads naturally in Italian', () => {
    expect(expiringLabel(0)).toBe('finisce oggi')
    expect(expiringLabel(1)).toBe('finisce domani')
    expect(expiringLabel(11)).toBe('finisce tra 11 giorni')
    expect(expiringLabel(-1)).toBe('scaduta ieri')
    expect(expiringLabel(-4)).toBe('scaduta da 4 giorni')
  })
})
