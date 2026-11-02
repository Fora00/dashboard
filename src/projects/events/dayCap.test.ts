import { describe, expect, it } from 'vitest'
import { capDay } from './EventsList'
import type { EventItem } from './types'

const ev = (id: string) => ({ id }) as EventItem

describe('capDay', () => {
  const list = ['a', 'b', 'c', 'd', 'e'].map(ev)
  it('keeps the first N in order and counts the rest', () => {
    const r = capDay(list, 3, () => false)
    expect(r.shown.map((e) => e.id)).toEqual(['a', 'b', 'c'])
    expect(r.hidden).toBe(2)
  })
  it('never hides kept events and does not count them in the cap', () => {
    const r = capDay(list, 2, (e) => e.id === 'e' || e.id === 'a')
    expect(r.shown.map((e) => e.id)).toEqual(['a', 'b', 'c', 'e'])
    expect(r.hidden).toBe(1)
  })
  it('a short day shows everything', () => {
    expect(capDay(list, 8, () => false).hidden).toBe(0)
  })
})
