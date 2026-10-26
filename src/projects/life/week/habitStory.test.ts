import { describe, expect, it } from 'vitest'
import type { LifeEntry, LifePlan, LifeWeek } from '../../../lib/db'
import { buildHabitHistory } from './habitStory'

const plan = (week: string, trackers: LifePlan['trackers']): LifeWeek => ({
  id: week,
  week,
  importedAt: 0,
  updatedAt: 0,
  plan: { version: 1, week, focus: [], rules: [], tasks: [], trackers, sundayCheck: [], checkins: [] },
})
const water = { id: 'water', emoji: '💧', label: 'Water', target: 3, max: null, energy: false }
let n = 0
const base = (week: string) => ({ id: `e${n++}`, week, ref: 'water', day: week, createdAt: n, updatedAt: n })
const tracker = (week: string): LifeEntry => ({ ...base(week), kind: 'tracker', value: {} })
const why = (week: string, reason: string): LifeEntry => ({ ...base(week), kind: 'why', value: { reason } })
const idea = (week: string, text: string, status: 'open' | 'done' | 'dropped'): LifeEntry => ({
  ...base(week),
  kind: 'idea',
  value: { text, status },
})

describe('buildHabitHistory', () => {
  const weeks = [plan('2026-10-12', [water]), plan('2026-10-19', [{ ...water, target: 2 }]), plan('2026-10-26', [])]

  it('lists the weeks that have the habit, newest first, with counts and reasons', () => {
    const h = buildHabitHistory('water', weeks, [
      tracker('2026-10-12'),
      tracker('2026-10-19'),
      tracker('2026-10-19'),
      why('2026-10-12', ' too busy '),
    ])
    expect(h.weeks.map((w) => w.week)).toEqual(['2026-10-19', '2026-10-12'])
    expect(h.weeks[0]).toMatchObject({ total: 2, target: 2, reached: true, reason: null })
    expect(h.weeks[1]).toMatchObject({ total: 1, target: 3, reached: false, reason: 'too busy' })
    expect(h.tracker?.target).toBe(2)
  })

  it('ignores other habits and empty reasons; orders ideas active first', () => {
    const other = { ...tracker('2026-10-12'), ref: 'run' } as LifeEntry
    const h = buildHabitHistory('water', weeks, [
      other,
      why('2026-10-12', '  '),
      idea('2026-10-12', 'old', 'dropped'),
      idea('2026-10-19', 'bottle', 'open'),
      idea('2026-10-12', 'alarm', 'done'),
    ])
    expect(h.weeks[1]).toMatchObject({ total: 0, reason: null })
    expect(h.ideas.map((i) => i.value.text)).toEqual(['bottle', 'alarm', 'old'])
  })

  it('honours the week limit and returns nothing for an unknown habit', () => {
    expect(buildHabitHistory('water', weeks, [], 1).weeks).toHaveLength(1)
    expect(buildHabitHistory('nope', weeks, [])).toEqual({ tracker: null, weeks: [], ideas: [] })
  })
})
