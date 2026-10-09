import { describe, expect, it } from 'vitest'
import {
  FEATURE_CAPS,
  MAX_FEATURES_BYTES,
  asInterestValue,
  interestFeatures,
  romeWeekdayHour,
  sanitizeFeatures,
} from './interest'
import type { EventItem } from './types'

const ev = (over: Partial<EventItem> = {}): EventItem => ({
  id: 'abcdef0123456789',
  title: 'Serata giochi',
  start: '2026-10-09T20:30:00+02:00',
  end: null,
  allDay: false,
  ongoing: false,
  venue: 'Ludimus',
  city: 'Trento',
  area: 'trentino',
  ring: 'home',
  url: 'https://example.org/e/1',
  source: 'ludimus',
  sources: ['ludimus', 'trentinoeventi'],
  category: 'boardgames',
  tags: ['boardgames', 'social'],
  description: 'Giochi da tavolo',
  summary: 'Giochi da tavolo',
  image: null,
  occurrences: 1,
  fetchedAt: '2026-10-01T04:23:00Z',
  ...over,
})

describe('romeWeekdayHour', () => {
  it('reads weekday and hour in Europe/Rome, whatever the offset written', () => {
    // Friday 9 Oct 2026, 20:30 in Rome (CEST, +02:00).
    expect(romeWeekdayHour('2026-10-09T20:30:00+02:00', false)).toEqual({ weekday: 5, hour: 20 })
    // The same instant in UTC.
    expect(romeWeekdayHour('2026-10-09T18:30:00Z', false)).toEqual({ weekday: 5, hour: 20 })
    // 23:30 UTC on a Saturday is already Sunday 01:30 in Rome (winter, +01:00).
    expect(romeWeekdayHour('2026-12-05T23:30:00Z', false)).toEqual({ weekday: 7, hour: 0 })
    expect(romeWeekdayHour('2026-12-06T00:30:00Z', false)).toEqual({ weekday: 7, hour: 1 })
  })

  it('date-only and all-day starts have a weekday and no hour', () => {
    expect(romeWeekdayHour('2026-10-12', false)).toEqual({ weekday: 1, hour: null })
    expect(romeWeekdayHour('2026-10-11', true)).toEqual({ weekday: 7, hour: null })
    expect(romeWeekdayHour('2026-10-09T00:00:00+02:00', true)).toEqual({ weekday: 5, hour: null })
  })

  it('garbage gives nulls, never a guess', () => {
    expect(romeWeekdayHour('', false)).toEqual({ weekday: null, hour: null })
    expect(romeWeekdayHour('next friday', false)).toEqual({ weekday: null, hour: null })
    expect(romeWeekdayHour('2026-13-45T99:00:00Z', false)).toEqual({ weekday: null, hour: null })
  })
})

describe('interestFeatures', () => {
  it('snapshots the fields learning needs, nothing else', () => {
    expect(interestFeatures(ev())).toEqual({
      v: 1,
      category: 'boardgames',
      tags: ['boardgames', 'social'],
      city: 'Trento',
      source: 'ludimus',
      sources: ['ludimus', 'trentinoeventi'],
      ring: 'home',
      area: 'trentino',
      weekday: 5,
      hour: 20,
    })
  })

  it('unknown category -> other; missing ring -> home; area derived like areaOf', () => {
    const { ring: _r, area: _a, ...old } = ev({ category: 'from-a-newer-crawler' })
    const f = interestFeatures(old as EventItem)
    expect(f.category).toBe('other')
    expect(f.ring).toBe('home')
    expect(f.area).toBe('trentino')
  })

  it('is bounded: long lists and strings are capped well under the server limit', () => {
    const f = interestFeatures(
      ev({
        city: 'C'.repeat(500),
        source: 's'.repeat(500),
        tags: Array.from({ length: 200 }, (_, i) => `${'€'.repeat(60)}${i}`),
        sources: Array.from({ length: 200 }, (_, i) => `${'😀'.repeat(60)}${i}`),
      }),
    )
    expect(f.tags.length).toBeLessThanOrEqual(FEATURE_CAPS.tags)
    expect(f.sources.length).toBeLessThanOrEqual(FEATURE_CAPS.sources)
    expect(f.city).toHaveLength(FEATURE_CAPS.city)
    expect(f.source).toHaveLength(FEATURE_CAPS.short)
    expect(f.tags.every((t) => t.length <= FEATURE_CAPS.tagLength)).toBe(true)
    expect(new TextEncoder().encode(JSON.stringify(f)).length).toBeLessThan(MAX_FEATURES_BYTES)
  })
})

describe('sanitizeFeatures', () => {
  it('rebuilds known fields only and rejects non-objects', () => {
    expect(sanitizeFeatures(null)).toBeNull()
    expect(sanitizeFeatures('unchanged_toast')).toBeNull()
    expect(sanitizeFeatures([1])).toBeNull()
    const f = sanitizeFeatures({ category: 'music', weekday: 9, hour: 7.5, extra: 'x', tags: ['a', 'a', 3] })
    expect(f).toEqual({
      v: 1,
      category: 'music',
      tags: ['a'],
      city: '',
      source: '',
      sources: [],
      ring: 'home',
      area: '',
      weekday: null,
      hour: null,
    })
  })
})

describe('asInterestValue', () => {
  it('accepts 1 / -1 (also as a numeric string from PostgREST), nothing else', () => {
    expect(asInterestValue(1)).toBe(1)
    expect(asInterestValue(-1)).toBe(-1)
    expect(asInterestValue('-1')).toBe(-1)
    expect(asInterestValue(0)).toBeNull()
    expect(asInterestValue(2)).toBeNull()
    expect(asInterestValue(null)).toBeNull()
  })
})
