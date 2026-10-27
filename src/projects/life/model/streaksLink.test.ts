import { describe, expect, it } from 'vitest'
import { decodeStreaksParam, encodeStreaksLink, parseStreaksJson } from './index.ts'

const habit = { name: 'Leggere è bello ☀️', days: 'd'.repeat(28), streak: 3, best: 9, asOf: '2026-10-25' }

describe('streaks link', () => {
  it('round-trips a snapshot with accents and emoji', () => {
    const link = encodeStreaksLink([habit], 'x/')
    const dec = decodeStreaksParam(link.split('?d=')[1] ?? '')
    expect(dec.ok && parseStreaksJson(dec.text)).toEqual({ ok: true, streaks: [habit] })
  })

  it('rejects bad days, non-arrays and duplicate habits', () => {
    expect(parseStreaksJson(JSON.stringify([{ ...habit, days: 'ddd' }])).ok).toBe(false)
    expect(parseStreaksJson('{"a":1}').ok).toBe(false)
    expect(parseStreaksJson(JSON.stringify([habit, habit])).ok).toBe(false)
    expect(parseStreaksJson('nope').ok).toBe(false)
  })

  it('accepts an empty snapshot (all habits archived)', () => {
    expect(parseStreaksJson('[]')).toEqual({ ok: true, streaks: [] })
  })
})
