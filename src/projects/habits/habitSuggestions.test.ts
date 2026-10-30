import { describe, expect, it } from 'vitest'
import type { Habit, HabitDayState } from '../../lib/db'
import { habitStats } from './habitStats'
import { suggest } from './habitSuggestions'

const habit = (extra: Partial<Habit> = {}): Habit => ({
  id: 'h',
  name: 'h',
  emoji: '✅',
  createdAt: new Date('2026-09-01T12:00:00').getTime(),
  anchor: 'after dinner',
  floor: 'one line',
  why: 'because',
  ...extra,
})
const run = (h: Habit, states: Map<string, HabitDayState>, notes = new Map<string, string>(), openCount = 1) =>
  suggest({ habit: h, stats: habitStats(h, states, '2026-10-30'), states, notes, today: '2026-10-30', openCount }).map(
    (s) => s.id,
  )

describe('suggest', () => {
  it('asks for the missing pieces of the setup', () => {
    const young = habit({ anchor: '', floor: '', why: '', createdAt: new Date('2026-10-29T12:00:00').getTime() })
    expect(run(young, new Map([['2026-10-29', 'done']]))).toEqual(['no-anchor', 'no-floor', 'no-why'])
  })

  it('a gap points at the setup, not at the person', () => {
    const states = new Map<string, HabitDayState>([['2026-10-26', 'done']])
    expect(run(habit(), states)).toContain('gap')
  })

  it('a repeated reason points at its fix', () => {
    const notes = new Map([
      ['2026-10-20', 'forgot'],
      ['2026-10-22', 'forgot'],
      ['2026-10-25', 'forgot'],
    ])
    expect(run(habit(), new Map([['2026-10-29', 'done']]), notes)).toContain('reason-forgot')
  })

  it('four hit weeks in a row suggests going up; the verdict silences it', () => {
    const states = new Map<string, HabitDayState>()
    for (let d = new Date('2026-09-28T12:00:00'); d <= new Date('2026-10-30T12:00:00'); d.setDate(d.getDate() + 1)) {
      states.set(d.toISOString().slice(0, 10), 'done')
    }
    expect(run(habit({ target: 3 }), states)).toContain('go-up')
    expect(run(habit({ target: 3, verdict: 'stay' }), states)).not.toContain('go-up')
  })

  it('a weekly target that was mostly missed suggests lowering it, with a tap', () => {
    const h = habit({ target: 3 })
    const states = new Map<string, HabitDayState>([['2026-09-30', 'done']])
    const s = suggest({
      habit: h,
      stats: habitStats(h, states, '2026-10-30'),
      states,
      notes: new Map(),
      today: '2026-10-30',
      openCount: 1,
    })
    expect(s.find((x) => x.id === 'shrink-target')?.action?.patch).toEqual({ target: 2 })
  })

  it('warns about too many open habits and caps at three suggestions', () => {
    const ids = run(habit({ anchor: '', floor: '', why: '', kind: 'forever' }), new Map(), new Map(), 5)
    expect(ids).toHaveLength(3)
  })

  it('a cycle with no verdict reminds the decision', () => {
    expect(
      run(habit({ cycleStart: '2026-10-05', cycleEnd: '2026-11-01' }), new Map([['2026-10-29', 'done']])),
    ).toContain('verdict-soon')
  })
})
