import { describe, expect, it } from 'vitest'
import type { Event } from './types.ts'
import { cadenceOf, markSeries } from './series.ts'

const NOW = Date.parse('2026-10-14T10:00:00Z')

function ev(over: Partial<Event> & { start: string }): Event {
  return {
    id: over.id ?? over.start,
    title: 'Serata giochi',
    end: null,
    allDay: false,
    ongoing: false,
    venue: null,
    city: 'Rovereto',
    area: 'trentino',
    ring: 'home',
    url: 'https://example.org/e',
    source: 's',
    sources: ['s'],
    category: 'boardgames',
    tags: ['boardgames'],
    description: '',
    summary: '',
    image: null,
    occurrences: 1,
    fetchedAt: '2026-10-14T00:00:00Z',
    ...over,
  }
}

const thursdays = ['2026-10-15', '2026-10-22', '2026-10-29', '2026-11-05'].map((d) =>
  ev({ start: `${d}T21:00:00+01:00`, id: d }),
)

describe('cadenceOf', () => {
  it('maps typical gaps and rejects runs and irregular gaps', () => {
    expect(cadenceOf(7)).toBe('weekly')
    expect(cadenceOf(14)).toBe('biweekly')
    expect(cadenceOf(28)).toBe('monthly')
    expect(cadenceOf(1)).toBeNull()
    expect(cadenceOf(20)).toBeNull()
  })
})

describe('markSeries', () => {
  it('flags a weekly series on every record with one shared series', () => {
    const out = markSeries([...thursdays, ev({ title: 'Altro', start: '2026-10-16T20:00:00+02:00', id: 'x' })], NOW)
    const flagged = out.filter((e) => e.recurring)
    expect(flagged).toHaveLength(4)
    expect(new Set(flagged.map((e) => e.series?.id)).size).toBe(1)
    expect(flagged[0]?.series).toMatchObject({ cadence: 'weekly', weekday: 3, count: 4 })
    expect(flagged[0]?.series?.next).toHaveLength(4)
    expect(flagged[0]?.tags).toContain('recurring')
    expect(out.find((e) => e.id === 'x')?.recurring).toBeUndefined()
  })
  it('lists only upcoming dates in next', () => {
    const out = markSeries(thursdays, Date.parse('2026-10-23T00:00:00Z'))
    expect(out[0]?.series?.next).toEqual([thursdays[2]?.start, thursdays[3]?.start])
  })
  it('needs three dates, the same city, and a rhythm', () => {
    expect(markSeries(thursdays.slice(0, 2), NOW).some((e) => e.recurring)).toBe(false)
    const mixed = thursdays.map((e, i) => (i === 3 ? { ...e, city: 'Trento' } : e))
    expect(markSeries(mixed.slice(0, 2).concat(mixed.slice(3)), NOW).some((e) => e.recurring)).toBe(false)
    const daily = ['2026-10-15', '2026-10-16', '2026-10-17'].map((d) => ev({ start: `${d}T21:00:00+02:00`, id: d }))
    expect(markSeries(daily, NOW).some((e) => e.recurring)).toBe(false)
  })
  it('never flags performances', () => {
    const play = thursdays.map((e) => ({ ...e, category: 'theatre' as const }))
    expect(markSeries(play, NOW).some((e) => e.recurring)).toBe(false)
  })
  it('judges a folded record by its average gap', () => {
    const folded = ev({
      start: '2026-10-15T00:00:00+02:00',
      end: '2026-12-31T00:00:00+01:00',
      allDay: true,
      occurrences: 12,
      id: 'f',
    })
    const [out] = markSeries([folded], NOW)
    expect(out?.series).toMatchObject({ cadence: 'weekly', weekday: null, count: 12, next: [] })
  })
  it('is idempotent and clears stale flags', () => {
    const once = markSeries(thursdays, NOW)
    expect(markSeries(once, NOW)).toEqual(once)
    const stale = markSeries(thursdays, NOW).slice(0, 2)
    const out = markSeries(stale, NOW)
    expect(out.some((e) => e.recurring || e.tags.includes('recurring'))).toBe(false)
  })
})
