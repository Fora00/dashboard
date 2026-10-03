import { describe, expect, it } from 'vitest'
import type { RawEvent } from '../types.ts'
import { foldScreenings } from './trentinospettacoli.ts'

const raw = (over: Partial<RawEvent>): RawEvent => ({
  nativeId: 'x', title: 'Tony', start: '2026-10-03T21:00:00+02:00', end: null, allDay: false,
  venue: null, city: 'Tione di Trento', url: 'https://t.it/a', description: '', categoryHint: 'cinema', ...over,
})

describe('foldScreenings', () => {
  it('folds the screenings of a film in one town, subtitle or not, keeping the longer title', () => {
    const out = foldScreenings([
      raw({ nativeId: 'a', title: 'Tony', start: '2026-10-11T17:00:00+02:00' }),
      raw({ nativeId: 'b', title: 'Tony – Diario di un Giovane Cuoco', start: '2026-10-03T21:00:00+02:00' }),
      raw({ nativeId: 'c', title: 'Tony', start: '2026-10-18T17:00:00+02:00' }),
    ])
    expect(out).toHaveLength(1)
    expect(out[0]).toMatchObject({ title: 'Tony – Diario di un Giovane Cuoco', start: '2026-10-03T21:00:00+02:00', occurrences: 3 })
    expect(out[0]?.description).toMatch(/^Proiezioni: .*·.*·/)
  })
  it('keeps one record per town, and leaves shows and single screenings alone', () => {
    const show = raw({ nativeId: 's', title: 'Tony', categoryHint: 'theatre' })
    const out = foldScreenings([raw({ nativeId: 'a' }), raw({ nativeId: 'b', city: 'Pinzolo' }), show])
    expect(out).toHaveLength(3)
    expect(out.filter((e) => e.categoryHint === 'cinema').map((e) => e.occurrences)).toEqual([1, 1])
    expect(out.find((e) => e.city === 'Pinzolo')?.description).toBe('')
  })
})
