import { afterEach, describe, expect, it, vi } from 'vitest'
import type { EventItem } from './types'
import {
  areaLabel,
  areaOf,
  areaRank,
  buildThingsAddUrl,
  categoryLabel,
  categoryOf,
  dayLabel,
  formatRange,
  groupByDay,
  inCategory,
  isKidsEvent,
  isLongRunning,
  isOngoingNow,
  isOver,
  isSparseSeries,
  isSpot,
  listingDay,
  localDay,
  nextSeriesDay,
  relativeTime,
  romeDate,
  safeHttpUrl,
  shortDay,
  groupByWeek,
  isoWeekNumber,
  weekStart,
  fetchEventsFile,
  isValidEvent,
} from './model'
import type { DayGroup } from './model'

// Sat 10 Oct 2026, 12:00 in Rome.
const NOW = Date.parse('2026-10-10T10:00:00Z')

const ev = (over: Partial<EventItem> = {}): EventItem => ({
  id: 'e1',
  title: 'Concerto',
  start: '2026-10-10T20:30:00+02:00',
  end: null,
  allDay: false,
  ongoing: false,
  venue: null,
  city: 'Trento',
  url: 'https://example.org/e/1',
  source: 'a',
  sources: ['a'],
  category: 'concerts',
  tags: ['concerts'],
  description: '',
  summary: '',
  image: null,
  occurrences: 1,
  fetchedAt: '2026-10-10T10:00:00Z',
  ...over,
})

describe('categories and tags', () => {
  it('unknown category ids (newer crawler) behave like other', () => {
    expect(categoryOf(ev({ category: 'quidditch' }))).toBe('other')
    expect(categoryLabel('quidditch')).toBe('Other')
    expect(categoryOf(ev())).toBe('concerts')
  })

  it('kids events are detected by tag, tolerating a missing tags array', () => {
    expect(isKidsEvent(ev({ tags: ['theatre', 'kids'] }))).toBe(true)
    expect(isKidsEvent(ev())).toBe(false)
    expect(isKidsEvent({ ...ev(), tags: undefined } as unknown as EventItem)).toBe(false)
  })

  it('a category chip matches the primary category or any tag', () => {
    const e = ev({ category: 'talks', tags: ['talks', 'creative'] })
    expect(inCategory(e, 'talks')).toBe(true)
    expect(inCategory(e, 'creative')).toBe(true)
    expect(inCategory(e, 'theatre')).toBe(false)
  })
})

describe('areas', () => {
  it('uses the event area; older files derive it from the city', () => {
    expect(areaOf(ev({ area: 'veneto' }))).toBe('veneto')
    expect(areaOf(ev({ city: 'Bolzano' }))).toBe('alto-adige')
    expect(areaOf(ev({ city: 'Verona' }))).toBe('verona-garda')
    expect(areaOf(ev({ city: 'Rovereto' }))).toBe('trentino')
  })
  it('labels and ranks: known nearest first, unknown as-is and last', () => {
    expect(areaLabel('alto-adige')).toBe('Alto Adige')
    expect(areaLabel('mars')).toBe('mars')
    expect(areaRank('trentino')).toBeLessThan(areaRank('veneto'))
    expect(areaRank('mars')).toBeGreaterThan(areaRank('abroad'))
  })
  it('isSpot', () => {
    expect(isSpot(ev({ ring: 'spot' }))).toBe(true)
    expect(isSpot(ev())).toBe(false)
  })
})

describe('safeHttpUrl', () => {
  it('passes http(s) only', () => {
    expect(safeHttpUrl('https://example.org/a?b=1')).toBe('https://example.org/a?b=1')
    expect(safeHttpUrl('http://example.org')).toBe('http://example.org/')
  })
  it('blocks script and other schemes from scraped data', () => {
    for (const bad of [
      'javascript:alert(1)',
      'JaVaScRiPt:alert(1)',
      'data:text/html,<script>',
      'file:///etc/passwd',
      'ftp://x.org',
      'things:///add',
    ]) {
      expect(safeHttpUrl(bad)).toBeNull()
    }
  })
  it('null for empty and unparseable values', () => {
    expect(safeHttpUrl(null)).toBeNull()
    expect(safeHttpUrl(undefined)).toBeNull()
    expect(safeHttpUrl('')).toBeNull()
    expect(safeHttpUrl('not a url')).toBeNull()
  })
})

describe('days in Rome time', () => {
  it('romeDate is the Rome calendar day', () => {
    expect(romeDate(Date.parse('2026-10-10T22:30:00Z'))).toBe('2026-10-11')
    expect(romeDate(Date.parse('2026-10-10T21:30:00Z'))).toBe('2026-10-10')
    expect(romeDate(Date.parse('2026-01-01T00:30:00+01:00'))).toBe('2026-01-01')
  })
  it('localDay is the first 10 chars of the event string', () => {
    expect(localDay('2026-10-10T23:59:00+02:00')).toBe('2026-10-10')
  })
})

describe('isOver / isOngoingNow', () => {
  it('timed with an end: over at the end', () => {
    const e = ev({ start: '2026-10-10T09:00:00+02:00', end: '2026-10-10T11:00:00+02:00' })
    expect(isOver(e, Date.parse('2026-10-10T08:59:00Z'))).toBe(false) // 10:59 Rome
    expect(isOver(e, Date.parse('2026-10-10T09:00:00Z'))).toBe(true)
    expect(isOngoingNow(e, Date.parse('2026-10-10T08:00:00Z'))).toBe(true)
    expect(isOngoingNow(e, Date.parse('2026-10-10T06:00:00Z'))).toBe(false) // not started
  })

  it('timed without an end stays until the end of its start day (does not vanish as it starts)', () => {
    const e = ev({ start: '2026-10-10T09:00:00+02:00', end: null })
    expect(isOver(e, NOW)).toBe(false)
    expect(isOver(e, Date.parse('2026-10-10T21:59:00Z'))).toBe(false) // 23:59 Rome
    expect(isOver(e, Date.parse('2026-10-10T22:00:00Z'))).toBe(true) // 00:00 next day
  })

  it('all-day: the last day is inclusive', () => {
    const e = ev({ allDay: true, start: '2026-10-08T00:00:00+02:00', end: '2026-10-10T00:00:00+02:00' })
    expect(isOver(e, NOW)).toBe(false)
    expect(isOver(e, Date.parse('2026-10-10T22:30:00Z'))).toBe(true) // 11 Oct in Rome
    expect(isOngoingNow(e, NOW)).toBe(true)
    expect(isOngoingNow(e, Date.parse('2026-10-07T12:00:00Z'))).toBe(false)
  })

  it('ignores the stale `ongoing` flag of the file', () => {
    expect(isOngoingNow(ev({ ongoing: true, start: '2026-10-20T20:00:00+02:00' }), NOW)).toBe(false)
  })
})

describe('series', () => {
  const weekly = ev({
    allDay: true,
    start: '2026-09-01T00:00:00+02:00',
    end: '2026-12-29T00:00:00+01:00',
    occurrences: 18,
  })
  it('sparse: fewer than one date every two days', () => {
    expect(isSparseSeries(weekly)).toBe(true)
  })
  it('a near-daily folded record is an exhibition, not a series', () => {
    expect(
      isSparseSeries(
        ev({ allDay: true, start: '2026-09-01T00:00:00+02:00', end: '2026-09-30T00:00:00+02:00', occurrences: 26 }),
      ),
    ).toBe(false)
  })
  it('single occurrences and missing counts are not series', () => {
    expect(isSparseSeries(ev())).toBe(false)
    expect(isSparseSeries({ ...ev(), occurrences: undefined } as unknown as EventItem)).toBe(false)
  })
  it('nextSeriesDay: the start while it is in the future', () => {
    expect(nextSeriesDay({ ...weekly, start: '2026-10-20T00:00:00+02:00' }, NOW)).toBe('2026-10-20')
  })
  it('nextSeriesDay: estimates the cadence from the span, never past the last day', () => {
    // 2026-09-01 .. 2026-12-29 is 119 days / 17 gaps = 7-day step; Tuesdays.
    expect(nextSeriesDay(weekly, NOW)).toBe('2026-10-13')
    expect(nextSeriesDay(weekly, Date.parse('2027-03-01T12:00:00Z'))).toBe('2026-12-29')
  })
  it('listingDay: start for plain events, next date for running series', () => {
    expect(listingDay(ev(), NOW)).toBe('2026-10-10')
    expect(listingDay(weekly, NOW)).toBe('2026-10-13')
  })
  it('isLongRunning: started before today, still on, not a sparse series', () => {
    const show = ev({ allDay: true, start: '2026-09-01T00:00:00+02:00', end: '2026-10-31T00:00:00+01:00' })
    expect(isLongRunning(show, NOW)).toBe(true)
    expect(isLongRunning(weekly, NOW)).toBe(false)
    expect(isLongRunning(ev(), NOW)).toBe(false) // starts today
  })
})

describe('formatting', () => {
  it('formatRange: timed, with end, all-day span, year change', () => {
    expect(formatRange(ev())).toBe('sab 10 ott, 20:30')
    expect(formatRange(ev({ end: '2026-10-10T22:00:00+02:00' }))).toBe('sab 10 ott, 20:30–22:00')
    expect(formatRange(ev({ end: '2026-10-11T01:00:00+02:00' }))).toBe('sab 10 ott, 20:30 – dom 11 ott, 01:00')
    expect(formatRange(ev({ allDay: true, start: '2026-10-10T00:00:00+02:00' }))).toBe('sab 10 ott')
    expect(
      formatRange(ev({ allDay: true, start: '2026-05-16T00:00:00+02:00', end: '2026-10-18T00:00:00+02:00' })),
    ).toBe('16 mag – 18 ott')
    expect(
      formatRange(ev({ allDay: true, start: '2026-12-20T00:00:00+01:00', end: '2027-01-10T00:00:00+01:00' })),
    ).toBe('20 dic 2026 – 10 gen 2027')
  })

  it('dayLabel: Oggi, Domani, else the short date', () => {
    expect(dayLabel('2026-10-10', NOW)).toBe('Oggi')
    expect(dayLabel('2026-10-11', NOW)).toBe('Domani')
    expect(dayLabel('2026-10-13', NOW)).toBe('Mar 13 ott')
    expect(shortDay('2026-10-13')).toBe('mar 13 ott')
  })

  it('relativeTime', () => {
    expect(relativeTime('2026-10-10T09:30:00Z', NOW)).toBe('30 minutes ago')
    expect(relativeTime('2026-10-10T07:00:00Z', NOW)).toBe('3 hours ago')
    expect(relativeTime('2026-10-05T10:00:00Z', NOW)).toBe('5 days ago')
  })
})

describe('groupByDay', () => {
  it('groups by listing day, in day order, keeping order within a day', () => {
    const a = ev({ id: 'a', start: '2026-10-12T20:00:00+02:00' })
    const b = ev({ id: 'b', start: '2026-10-10T21:00:00+02:00' })
    const c = ev({ id: 'c', start: '2026-10-10T19:00:00+02:00' })
    const groups = groupByDay([a, b, c], NOW)
    expect(groups.map((g) => [g.key, g.label, g.events.map((e) => e.id)])).toEqual([
      ['2026-10-10', 'Oggi', ['b', 'c']],
      ['2026-10-12', 'Lun 12 ott', ['a']],
    ])
  })
  it('a running weekly series is listed under its next date', () => {
    const weekly = ev({
      id: 's',
      allDay: true,
      start: '2026-09-01T00:00:00+02:00',
      end: '2026-12-29T00:00:00+01:00',
      occurrences: 18,
    })
    expect(groupByDay([weekly], NOW)[0]?.key).toBe('2026-10-13')
  })
  it('no events, no groups', () => {
    expect(groupByDay([], NOW)).toEqual([])
  })
})

describe('buildThingsAddUrl', () => {
  const parse = (url: string) => {
    const u = new URL(url.replace('things:///', 'things://x/'))
    return { title: u.searchParams.get('title'), notes: u.searchParams.get('notes'), when: u.searchParams.get('when') }
  }

  it('when is the start day when it is in the future', () => {
    const p = parse(buildThingsAddUrl(ev({ start: '2026-10-20T20:30:00+02:00' }), NOW))
    expect(p.when).toBe('2026-10-20')
    expect(p.title).toBe('Concerto')
  })

  it('when is today for ongoing or same-day events', () => {
    expect(parse(buildThingsAddUrl(ev({ start: '2026-09-01T00:00:00+02:00', allDay: true }), NOW)).when).toBe(
      '2026-10-10',
    )
    expect(parse(buildThingsAddUrl(ev(), NOW)).when).toBe('2026-10-10')
  })

  it('notes: range, place, clipped summary and only a safe URL', () => {
    const p = parse(buildThingsAddUrl(ev({ venue: 'Sala', summary: 'x'.repeat(300), url: 'javascript:alert(1)' }), NOW))
    const lines = (p.notes ?? '').split('\n')
    expect(lines[0]).toBe('sab 10 ott, 20:30')
    expect(lines[1]).toBe('Sala · Trento')
    expect(lines[2]?.length).toBe(200)
    expect(lines[2]?.endsWith('…')).toBe(true)
    expect(lines).toHaveLength(3) // the javascript: URL is left out
  })

  it('encodes awkward titles', () => {
    const url = buildThingsAddUrl(ev({ title: 'Rock & Roll #1 100%' }), NOW)
    expect(url).toContain(encodeURIComponent('Rock & Roll #1 100%'))
    expect(parse(url).title).toBe('Rock & Roll #1 100%')
  })
})

describe('weeks', () => {
  const g = (key: string): DayGroup => ({ key, label: key, events: [{ id: key } as EventItem] })
  const now = Date.parse('2026-10-06T10:00:00+02:00') // Tuesday

  it('weekStart is the Monday, across a month boundary and on Sunday', () => {
    expect(weekStart('2026-10-06')).toBe('2026-10-05')
    expect(weekStart('2026-10-11')).toBe('2026-10-05')
    expect(weekStart('2026-11-01')).toBe('2026-10-26')
  })

  it('isoWeekNumber follows ISO 8601', () => {
    expect(isoWeekNumber('2026-10-19')).toBe(43)
    expect(isoWeekNumber('2026-12-28')).toBe(53)
    expect(isoWeekNumber('2027-01-04')).toBe(1)
  })

  it('groups days into weeks and labels this/next week', () => {
    const w = groupByWeek([g('open-now'), g('2026-10-06'), g('2026-10-11'), g('2026-10-12'), g('2026-10-20')], now)
    expect(w.map((x) => [x.key, x.label, x.count])).toEqual([
      ['open-now', 'open-now', 1],
      ['2026-10-05', 'This week', 2],
      ['2026-10-12', 'Next week', 1],
      ['2026-10-19', 'Week 43 · 19 ott – 25 ott', 1],
    ])
  })
})

describe('fetchEventsFile validation', () => {
  afterEach(() => vi.unstubAllGlobals())
  const respond = (body: unknown) =>
    vi.stubGlobal('fetch', async () => new Response(JSON.stringify(body), { status: 200 }))

  it('isValidEvent needs id, title and a parseable start', () => {
    expect(isValidEvent(ev())).toBe(true)
    expect(isValidEvent(ev({ id: '' }))).toBe(false)
    expect(isValidEvent(ev({ start: 'nope' }))).toBe(false)
    expect(isValidEvent({ id: 'x', title: 3, start: '2026-10-10' })).toBe(false)
    expect(isValidEvent(null)).toBe(false)
  })

  it('drops malformed events and keeps the good ones', async () => {
    respond({ schemaVersion: 1, sources: [], events: [ev(), null, { id: 'x' }, ev({ id: 'e2', start: 'bad' })] })
    const out = await fetchEventsFile('/')
    expect(out.kind).toBe('ok')
    if (out.kind === 'ok') expect(out.file.events.map((e) => e.id)).toEqual(['e1'])
  })
})
