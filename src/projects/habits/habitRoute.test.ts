import { describe, expect, it } from 'vitest'
import type { Habit, HabitCheck } from '../../lib/db'
import { backTarget, habitForRoute, habitPath, storedDaysOf, storedState } from './habitRoute'

const h = (id: string, over: Partial<Habit> = {}): Habit => ({ id, name: id, emoji: '🙂', createdAt: 1, ...over })

describe('habit route', () => {
  it('builds the path, encoding the id', () => {
    expect(habitPath('abc')).toBe('/habits/abc')
    expect(habitPath('a/b')).toBe('/habits/a%2Fb')
  })

  it('resolves the param: loading, found (archived too), unknown', () => {
    const list = [h('a'), h('b', { archivedAt: 5 })]
    expect(habitForRoute(undefined, 'a')).toBeUndefined()
    expect(habitForRoute(list, 'a')?.id).toBe('a')
    expect(habitForRoute(list, 'b')?.id).toBe('b')
    expect(habitForRoute(list, 'zzz')).toBeNull()
    expect(habitForRoute(list, undefined)).toBeNull()
    expect(habitForRoute([], 'a')).toBeNull()
  })

  it('back goes to the opener when it is an app path, else /habits', () => {
    expect(backTarget({ from: '/life' })).toBe('/life')
    expect(backTarget(null)).toBe('/habits')
    expect(backTarget(undefined)).toBe('/habits')
    expect(backTarget({ from: 'https://evil.example' })).toBe('/habits')
    expect(backTarget({ from: '//evil.example' })).toBe('/habits')
    expect(backTarget({ from: 3 })).toBe('/habits')
  })

  it('stored days tell a marked day from a derived one', () => {
    const checks: HabitCheck[] = [
      { id: '1', habitId: 'a', day: '2026-11-20', createdAt: 1 },
      { id: '2', habitId: 'b', day: '2026-11-21', createdAt: 1 },
    ]
    const days = storedDaysOf(checks, 'a')
    expect([...days]).toEqual(['2026-11-20'])
    const states = new Map([
      ['2026-11-20', 'done' as const],
      ['2026-11-21', 'done' as const],
    ])
    expect(storedState(states, days, '2026-11-20')).toBe('done')
    expect(storedState(states, days, '2026-11-21')).toBeUndefined()
  })
})
