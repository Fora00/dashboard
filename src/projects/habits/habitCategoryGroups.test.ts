import { describe, expect, it } from 'vitest'
import type { Habit, HabitDayState } from '../../lib/db'
import { cycleWeeks, groupByCategory, habitPhase } from './habitCategoryGroups'

const h = (name: string, extra: Partial<Habit> = {}): Habit => ({
  id: name,
  name,
  emoji: '•',
  createdAt: new Date('2026-10-01T12:00').getTime(),
  ...extra,
})
const today = '2026-11-25'

describe('habitPhase', () => {
  it('splits past, future and present', () => {
    expect(habitPhase(h('a', { archivedAt: 1 }), today)).toBe('past')
    expect(habitPhase(h('b', { verdict: 'closed', cycleEnd: '2026-11-01' }), today)).toBe('past')
    expect(habitPhase(h('c', { cycleStart: '2026-12-07' }), today)).toBe('future')
    expect(habitPhase(h('d', { cycleStart: '2026-11-02', cycleEnd: '2026-11-20' }), today)).toBe('present') // no verdict yet
    expect(habitPhase(h('e', { verdict: 'stay', cycleEnd: '2026-11-20' }), today)).toBe('present')
    expect(habitPhase(h('f'), today)).toBe('present')
  })
})

describe('groupByCategory', () => {
  it('orders engines, puts untagged last, drops empty groups and sorts each phase', () => {
    const groups = groupByCategory(
      [
        h('untagged'),
        h('mind late', { engine: 'mind', cycleEnd: '2026-12-20' }),
        h('mind soon', { engine: 'mind', cycleEnd: '2026-12-06' }),
        h('mind forever', { engine: 'mind' }),
        h('mind old', { engine: 'mind', cycleEnd: '2026-10-01', verdict: 'closed' }),
        h('mind older', { engine: 'mind', cycleEnd: '2026-09-01', verdict: 'closed' }),
        h('mind next', { engine: 'mind', cycleStart: '2026-12-07' }),
        h('body', { engine: 'physical-health' }),
      ],
      today,
    )
    expect(groups.map((g) => g.label)).toEqual(['Physical Health', 'Mind', 'Senza engine'])
    const mind = groups[1]!
    expect(mind.present.map((x) => x.name)).toEqual(['mind soon', 'mind late', 'mind forever'])
    expect(mind.past.map((x) => x.name)).toEqual(['mind old', 'mind older'])
    expect(mind.future.map((x) => x.name)).toEqual(['mind next'])
  })
})

describe('cycleWeeks', () => {
  it('counts complete weeks inside the cycle, up to its end', () => {
    // Daily habit, cycle Mon 2 Nov – Sun 15 Nov 2026, closed; first week all done, second empty.
    const states = new Map<string, HabitDayState>()
    for (let d = 2; d <= 8; d++) states.set(`2026-11-0${d}`, 'done')
    const habit = h('x', { cycleStart: '2026-11-02', cycleEnd: '2026-11-15', verdict: 'closed' })
    expect(cycleWeeks(habit, states, today)).toEqual({ hit: 1, total: 2 })
  })

  it('is null before a full week has passed', () => {
    expect(cycleWeeks(h('y', { cycleStart: '2026-11-24' }), new Map(), today)).toBeNull()
  })
})
