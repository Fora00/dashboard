import { afterEach, describe, expect, it, vi } from 'vitest'
import type { EventItem } from './types'
import { cleanFormats, formatLabel, matchesFormat } from './format'
import {
  EMPTY_FILTERS, chipRange, loadFilters, matchesChip, matchesQuery, matchesRange, normalizeText, saveFilters,
  type StoredFilters,
} from './filters'

const ev = (over: Partial<EventItem> = {}): EventItem => ({
  id: 'e1',
  title: 'Serata giochi da tavolo',
  start: '2026-10-10T20:30:00+02:00',
  end: null,
  allDay: false,
  ongoing: false,
  venue: 'Caffè Bookique',
  city: 'Trento',
  url: 'https://example.org',
  source: 'a',
  sources: ['a'],
  category: 'boardgames',
  tags: ['boardgames'],
  description: '',
  summary: 'Un pomeriggio di meeple',
  image: null,
  occurrences: 1,
  fetchedAt: '2026-10-10T10:00:00Z',
  ...over,
})

describe('text search', () => {
  it('normalizeText lowercases, strips accents and trims', () => {
    expect(normalizeText('  Caffè ')).toBe('caffe')
    expect(normalizeText('ÜBER')).toBe('uber')
  })

  it('an empty query matches everything', () => {
    expect(matchesQuery(ev(), '')).toBe(true)
  })

  it('every word must appear somewhere in title/venue/city/summary', () => {
    const e = ev()
    expect(matchesQuery(e, 'giochi')).toBe(true)
    expect(matchesQuery(e, 'caffe trento')).toBe(true) // accent-free: venue "Caffè", city
    expect(matchesQuery(e, 'meeple tavolo')).toBe(true) // summary + title
    expect(matchesQuery(e, 'giochi rovereto')).toBe(false)
  })

  it('does not search the description or url', () => {
    expect(matchesQuery(ev({ description: 'segretissimo' }), 'segretissimo')).toBe(false)
  })

  it('null venue does not break the haystack', () => {
    expect(matchesQuery(ev({ venue: null }), 'trento')).toBe(true)
  })
})

describe('chipRange (today is Sat 10 Oct 2026)', () => {
  const sat = Date.parse('2026-10-10T10:00:00Z')
  it('today / tomorrow', () => {
    expect(chipRange('today', sat)).toEqual(['2026-10-10', '2026-10-10'])
    expect(chipRange('tomorrow', sat)).toEqual(['2026-10-11', '2026-10-11'])
  })
  it('weekend: Saturday gives what is left of it', () => {
    expect(chipRange('weekend', sat)).toEqual(['2026-10-10', '2026-10-11'])
  })
  it('weekend: Sunday gives just today', () => {
    expect(chipRange('weekend', Date.parse('2026-10-11T10:00:00Z'))).toEqual(['2026-10-11', '2026-10-11'])
  })
  it('weekend: Monday..Friday give the coming Sat+Sun', () => {
    expect(chipRange('weekend', Date.parse('2026-10-05T10:00:00Z'))).toEqual(['2026-10-10', '2026-10-11'])
    expect(chipRange('weekend', Date.parse('2026-10-09T10:00:00Z'))).toEqual(['2026-10-10', '2026-10-11'])
  })
  it('uses the Rome day, not the UTC day, near midnight', () => {
    // Sat 23:30 UTC is already Sunday in Rome.
    expect(chipRange('today', Date.parse('2026-10-10T23:30:00Z'))).toEqual(['2026-10-11', '2026-10-11'])
  })
  it('crosses month and year ends', () => {
    expect(chipRange('tomorrow', Date.parse('2026-12-31T10:00:00Z'))).toEqual(['2027-01-01', '2027-01-01'])
  })
})

describe('matchesRange', () => {
  const now = Date.parse('2026-10-10T10:00:00Z')
  const today: [string, string] = ['2026-10-10', '2026-10-10']

  it('a timed event matches its own day only', () => {
    expect(matchesRange(ev(), today, now)).toBe(true)
    expect(matchesRange(ev({ start: '2026-10-11T20:00:00+02:00' }), today, now)).toBe(false)
  })

  it('a multi-day event matches any day it covers', () => {
    const show = ev({ allDay: true, start: '2026-10-01T00:00:00+02:00', end: '2026-10-31T00:00:00+01:00' })
    expect(matchesRange(show, today, now)).toBe(true)
    expect(matchesRange(show, ['2026-11-01', '2026-11-02'], now)).toBe(false)
  })

  it('a sparse series is judged by its next date, not its whole span', () => {
    const weekly = ev({ allDay: true, start: '2026-09-01T00:00:00+02:00', end: '2026-12-29T00:00:00+01:00', occurrences: 18 })
    expect(matchesRange(weekly, today, now)).toBe(false) // next date is Tue 13 Oct
    expect(matchesRange(weekly, ['2026-10-13', '2026-10-13'], now)).toBe(true)
  })
})

describe('matchesChip "ending" (In scadenza, 10 days)', () => {
  const now = Date.parse('2026-10-10T10:00:00Z')
  const show = (start: string, end: string, over: Partial<EventItem> = {}) =>
    ev({ allDay: true, start: `${start}T00:00:00+02:00`, end: `${end}T00:00:00+02:00`, ...over })

  it('a running multi-day event ending within 10 days matches', () => {
    expect(matchesChip(show('2026-09-01', '2026-10-15'), 'ending', now)).toBe(true)
    expect(matchesChip(show('2026-09-01', '2026-10-20'), 'ending', now)).toBe(true)
  })
  it('one ending later, already over, not started, single-day or without end does not', () => {
    expect(matchesChip(show('2026-09-01', '2026-10-21'), 'ending', now)).toBe(false)
    expect(matchesChip(show('2026-09-01', '2026-10-09'), 'ending', now)).toBe(false)
    expect(matchesChip(show('2026-10-12', '2026-10-15'), 'ending', now)).toBe(false)
    expect(matchesChip(ev(), 'ending', now)).toBe(false)
  })
  it('a sparse series is not a deadline', () => {
    expect(matchesChip(show('2026-09-01', '2026-10-15', { occurrences: 8 }), 'ending', now)).toBe(false)
  })
  it('day chips still use the range', () => {
    expect(matchesChip(ev(), 'today', now)).toBe(true)
  })
})

describe('"Come" format filter', () => {
  it('cleanFormats keeps known ids, in chip order, without duplicates', () => {
    expect(cleanFormats(['solo-ok', 'bogus', 'social-friend', 'solo-ok'])).toEqual(['social-friend', 'solo-ok'])
  })
  it('formatLabel falls back to the id', () => {
    expect(formatLabel('solo-ok')).toBe('Da solo va bene')
    expect(formatLabel('whatever')).toBe('whatever')
  })
  it('nothing selected = every event', () => {
    expect(matchesFormat(ev({ tags: [] }), [])).toBe(true)
  })
  it('social chips combine with OR', () => {
    const friend = ev({ tags: ['social-friend'] })
    const girl = ev({ tags: ['social-girl'] })
    const none = ev({ tags: ['concerts'] })
    const sel = ['social-friend', 'social-girl']
    expect(matchesFormat(friend, sel)).toBe(true)
    expect(matchesFormat(girl, sel)).toBe(true)
    expect(matchesFormat(none, sel)).toBe(false)
  })
  it('solo-ok is an AND on top of the social chips', () => {
    const both = ev({ tags: ['social-friend', 'solo-ok'] })
    const onlySocial = ev({ tags: ['social-friend'] })
    expect(matchesFormat(both, ['social-friend', 'solo-ok'])).toBe(true)
    expect(matchesFormat(onlySocial, ['social-friend', 'solo-ok'])).toBe(false)
    expect(matchesFormat(ev({ tags: ['solo-ok'] }), ['solo-ok'])).toBe(true)
  })
})

describe('remembered selection', () => {
  function stubStorage(initial: Record<string, string> = {}) {
    const store = new Map(Object.entries(initial))
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
    })
    return store
  }
  afterEach(() => vi.unstubAllGlobals())

  const KEY = 'dashboard:events-filters'

  it('round-trips', () => {
    stubStorage()
    const f: StoredFilters = { cats: ['theatre'], chip: 'weekend', formats: ['solo-ok'], showHidden: true, maxMin: 50 }
    saveFilters(f)
    expect(loadFilters()).toEqual(f)
  })

  it('nothing stored = the defaults (cats null: favourites apply)', () => {
    stubStorage()
    expect(loadFilters()).toEqual(EMPTY_FILTERS)
    expect(EMPTY_FILTERS.cats).toBeNull()
  })

  it('malformed JSON or a non-object never throws', () => {
    stubStorage({ [KEY]: '{oops' })
    expect(loadFilters()).toEqual(EMPTY_FILTERS)
    stubStorage({ [KEY]: '42' })
    expect(loadFilters()).toEqual(EMPTY_FILTERS)
    stubStorage({ [KEY]: 'null' })
    expect(loadFilters()).toEqual(EMPTY_FILTERS)
  })

  it('cleans bad fields: non-string entries, unknown chip, unknown formats', () => {
    stubStorage({ [KEY]: JSON.stringify({ cats: ['a', 5], chip: 'nextweek', formats: ['solo-ok', 'nope'], showHidden: 'yes', maxMin: 45 }) })
    expect(loadFilters()).toEqual({ cats: ['a'], chip: null, formats: ['solo-ok'], showHidden: false, maxMin: null })
  })

  it('values from before formats existed load with none', () => {
    stubStorage({ [KEY]: JSON.stringify({ cats: null, areas: [], cities: [], chip: 'today', showHidden: false }) })
    expect(loadFilters()).toMatchObject({ cats: null, chip: 'today', formats: [] })
  })

  it('storage that throws (Safari private mode) is survived on read and write', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => { throw new Error('blocked') },
      setItem: () => { throw new Error('blocked') },
    })
    expect(loadFilters()).toEqual(EMPTY_FILTERS)
    expect(() => saveFilters(EMPTY_FILTERS)).not.toThrow()
  })

  it('no localStorage at all is survived too', () => {
    expect(loadFilters()).toEqual(EMPTY_FILTERS)
    expect(() => saveFilters(EMPTY_FILTERS)).not.toThrow()
  })
})
