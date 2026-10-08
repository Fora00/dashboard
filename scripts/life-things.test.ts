import { describe, expect, it } from 'vitest'
import { match, matchBatch, norm, sharedWords, BEFORE_MS, type ThingsTodo } from './life-things-match.ts'

const L = [
  { id: 'a1', name: '🏡Casa' },
  { id: 'a2', name: '💼 Lavoro' },
  { id: 'a3', name: 'Lavoro extra' },
]

describe('life-things match (areas / projects)', () => {
  it('ignores emoji, punctuation and case', () => {
    expect(norm('🏡 Casa!')).toBe('casa')
    expect(match('casa', L)).toEqual({ hit: L[0] })
  })
  it('lets an exact match win over a substring match', () => {
    expect(match('lavoro', L)).toEqual({ hit: L[1] })
  })
  it('takes a single substring match', () => {
    expect(match('extra', L)).toEqual({ hit: L[2] })
  })
  it('reports no match, empty input and ambiguity, never guesses', () => {
    expect(match('sport', L)).toEqual({ error: 'no match' })
    expect(match('🏡', L)).toEqual({ error: 'empty after removing emoji' })
    const r = match('a', L)
    expect('error' in r && r.error).toMatch(/^ambiguous: /)
  })
  it('reports duplicate exact names as ambiguous', () => {
    const r = match('casa', [L[0]!, { id: 'x', name: 'Casa' }])
    expect(r).toEqual({ error: 'ambiguous: 🏡Casa, Casa' })
  })
})

describe('life-things sharedWords', () => {
  it('counts shared words longer than 2 letters, case-insensitive', () => {
    expect(sharedWords('Buy the Milk', 'milk and BUY it')).toBe(2)
    expect(sharedWords('a to', 'a to')).toBe(0)
  })
})

describe('life-things matchBatch', () => {
  const AT = 1_000_000_000_000
  const todo = (id: string, name: string, dt = 0): ThingsTodo => ({
    id,
    name,
    status: 'open',
    createdAt: AT + dt,
    completedAt: null,
  })
  const task = (id: string, title: string) => ({ id, title })

  it('matches exact titles regardless of order', () => {
    const r = matchBatch([task('t1', 'Uno'), task('t2', 'Due')], [todo('x2', 'Due'), todo('x1', ' Uno ', 1)], AT)
    expect(r.pairs.map(([t, d]) => [t, d.id]).sort((a, b) => String(a).localeCompare(String(b)))).toEqual([
      ['t1', 'x1'],
      ['t2', 'x2'],
    ])
    expect(r.unmatched).toEqual([])
    expect(r.unexplained).toEqual([])
  })
  it('pairs a single renamed leftover on each side', () => {
    const r = matchBatch([task('t1', 'Uno'), task('t2', 'Due')], [todo('x1', 'Uno'), todo('x2', 'Completely new')], AT)
    expect(r.pairs.find(([t]) => t === 't2')?.[1].id).toBe('x2')
    expect(r.unmatched).toEqual([])
  })
  it('pairs renamed tasks by unique best word overlap, and leaves ties unmatched', () => {
    const tasks = [task('t1', 'Call dentist tomorrow'), task('t2', 'Pay electricity bill')]
    const r = matchBatch(tasks, [todo('x1', 'Dentist call'), todo('x2', 'Electricity invoice')], AT)
    expect(r.pairs.map(([t, d]) => [t, d.id]).sort((a, b) => String(a).localeCompare(String(b)))).toEqual([
      ['t1', 'x1'],
      ['t2', 'x2'],
    ])
    const tie = matchBatch(
      [task('t1', 'Call dentist'), task('t2', 'Other thing')],
      [todo('x1', 'Dentist A'), todo('x2', 'Dentist B')],
      AT,
    )
    expect(tie.pairs).toEqual([])
    expect(tie.unmatched.map((t) => t.id)).toEqual(['t1', 't2'])
    expect(tie.unexplained.map((d) => d.id)).toEqual(['x1', 'x2'])
  })
  it('ignores to-dos outside the send window and reports unclaimed ones', () => {
    const r = matchBatch(
      [task('t1', 'Uno')],
      [todo('old', 'Uno', -BEFORE_MS - 1), todo('late', 'Uno', 5 * 60_000 + 1), todo('extra', 'Zzz', 10)],
      AT,
    )
    // "extra" is the single leftover on each side, so it pairs with t1.
    expect(r.pairs.map(([t, d]) => [t, d.id])).toEqual([['t1', 'extra']])
    const none = matchBatch([task('t1', 'Uno')], [todo('old', 'Uno', -BEFORE_MS - 1)], AT)
    expect(none.pairs).toEqual([])
    expect(none.unmatched.map((t) => t.id)).toEqual(['t1'])
  })
})
