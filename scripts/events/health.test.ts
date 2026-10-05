import { describe, expect, it } from 'vitest'
import { countDelta, staleSources, upcomingTentative } from './health.ts'
import type { Event, SourceStatus } from './types.ts'

const NOW = Date.parse('2026-10-05T12:00:00Z')
const src = (o: Partial<SourceStatus>): SourceStatus => ({ id: 'a', name: 'A', ok: false, count: 0, lastSuccess: null, ...o })

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
  const ev = (id: string, start: string, tentative = true) => ({ id, start, ...(tentative ? { datesTentative: true as const } : {}) }) as Event
  it('keeps only tentative events starting within the window', () => {
    const list = [ev('soon', '2026-10-10T00:00:00+02:00'), ev('far', '2026-12-10T00:00:00+01:00'), ev('past', '2026-09-01T00:00:00+02:00'), ev('sure', '2026-10-10T00:00:00+02:00', false)]
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
