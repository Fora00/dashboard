import { describe, expect, it } from 'vitest'
import {
  countDelta,
  degradedReasons,
  staleSources,
  suspiciousZeros,
  upcomingTentative,
  zeroTracking,
} from './health.ts'
import type { Event, SourceStatus } from './types.ts'

const NOW = Date.parse('2026-10-05T12:00:00Z')
const src = (o: Partial<SourceStatus>): SourceStatus => ({
  id: 'a',
  name: 'A',
  ok: false,
  count: 0,
  lastSuccess: null,
  ...o,
})

describe('staleSources', () => {
  it('flags a failing source only after N days without success', () => {
    const rows = [
      src({ id: 'fresh', lastSuccess: '2026-10-04T12:00:00Z' }),
      src({ id: 'old', lastSuccess: '2026-10-01T09:00:00Z' }),
      src({ id: 'never', lastSuccess: null }),
      src({ id: 'fine', ok: true, lastSuccess: '2026-01-01T00:00:00Z' }),
    ]
    expect(staleSources(rows, NOW).map((s) => s.id)).toEqual(['old', 'never'])
    expect(staleSources(rows, NOW)[0]?.days).toBe(4)
  })
})

describe('upcomingTentative', () => {
  const ev = (id: string, start: string, tentative = true) =>
    ({ id, start, ...(tentative ? { datesTentative: true as const } : {}) }) as Event
  it('keeps only tentative events starting within the window', () => {
    const list = [
      ev('soon', '2026-10-10T00:00:00+02:00'),
      ev('far', '2026-12-10T00:00:00+01:00'),
      ev('past', '2026-09-01T00:00:00+02:00'),
      ev('sure', '2026-10-10T00:00:00+02:00', false),
    ]
    expect(upcomingTentative(list, NOW).map((e) => e.id)).toEqual(['soon'])
  })
})

describe('countDelta', () => {
  it('formats the change', () => {
    expect(countDelta(10, 13)).toBe('+3')
    expect(countDelta(10, 4)).toBe('-6')
    expect(countDelta(10, 10)).toBe('')
    expect(countDelta(undefined, 5)).toBe('')
  })
})

describe('zeroTracking', () => {
  const AT = '2026-10-05T04:30:00.000Z'
  it('remembers the last non-zero count and clears zeroSince while delivering', () => {
    expect(zeroTracking(undefined, 12, AT)).toEqual({ lastNonZero: 12 })
    expect(zeroTracking(src({ ok: true, count: 3, lastNonZero: 3, zeroSince: 'x' }), 9, AT)).toEqual({
      lastNonZero: 9,
    })
  })
  it('starts zeroSince on the first 0 after a non-zero run and keeps it', () => {
    const first = zeroTracking(src({ ok: true, count: 20, lastNonZero: 20 }), 0, AT)
    expect(first).toEqual({ lastNonZero: 20, zeroSince: AT })
    const later = zeroTracking(src({ ok: true, count: 0, ...first }), 0, '2026-10-09T04:30:00.000Z')
    expect(later).toEqual({ lastNonZero: 20, zeroSince: AT })
  })
  it('seeds lastNonZero from an older file without the fields', () => {
    expect(zeroTracking(src({ ok: true, count: 7 }), 0, AT)).toEqual({ lastNonZero: 7, zeroSince: AT })
    // A failed run's count is carried-over events, not a fetch: no seed.
    expect(zeroTracking(src({ ok: false, count: 7 }), 0, AT)).toEqual({})
  })
  it('never starts the clock for a source that never delivered', () => {
    expect(zeroTracking(undefined, 0, AT)).toEqual({})
  })
  it('carries both fields over when the adapter threw', () => {
    expect(zeroTracking(src({ lastNonZero: 4, zeroSince: AT }), null, '2026-10-09T00:00:00Z')).toEqual({
      lastNonZero: 4,
      zeroSince: AT,
    })
  })
})

describe('suspiciousZeros', () => {
  it('flags ok sources at 0 that had at least 5, mayBeEmpty or not', () => {
    const rows = [
      src({ id: 'broke', ok: true, count: 0, lastNonZero: 12, zeroSince: '2026-10-03T04:00:00Z' }),
      src({ id: 'tiny', ok: true, count: 0, lastNonZero: 2, zeroSince: '2026-10-03T04:00:00Z' }),
      src({ id: 'failing', ok: false, count: 0, lastNonZero: 12, zeroSince: '2026-10-03T04:00:00Z' }),
      src({ id: 'fine', ok: true, count: 8, lastNonZero: 8 }),
    ]
    expect(suspiciousZeros(rows)).toEqual([{ id: 'broke', since: '2026-10-03T04:00:00Z', had: 12 }])
  })
})

describe('degradedReasons', () => {
  it('is empty for a healthy crawl', () => {
    const rows = [src({ id: 'a', ok: true }), src({ id: 'b', ok: false, lastSuccess: '2026-10-04T00:00:00Z' })]
    expect(degradedReasons(rows, new Set(['a', 'b', 'c', 'd']), NOW)).toEqual([])
  })
  it('reports more than a third failing', () => {
    const rows = ['a', 'b', 'c'].map((id) => src({ id, ok: id === 'a', lastSuccess: '2026-10-05T00:00:00Z' }))
    expect(degradedReasons(rows, new Set(['a', 'b', 'c']), NOW)).toEqual(['2 of 3 sources failed (b, c)'])
  })
  it('reports a source stale for over a week, only among sources that ran', () => {
    const rows = [
      src({ id: 'old', lastSuccess: '2026-09-25T00:00:00Z' }),
      src({ id: 'skipped', lastSuccess: null }),
      ...['p', 'q', 'r'].map((id) => src({ id, ok: true })),
    ]
    expect(degradedReasons(rows, new Set(['old', 'p', 'q', 'r']), NOW)).toEqual(['old has not succeeded for 10 days'])
  })
})
