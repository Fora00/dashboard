import { describe, expect, it } from 'vitest'
import type { Adapter, Event, RawEvent } from './types.ts'
import type { DropCounts } from './pipeline.ts'
import {
  dedup, effectiveEnd, HORIZON_DAYS, inWindow, isOngoing, LONG_SERIES, MAX_OCCURRENCES, sortEvents, toEvents, withPlace,
} from './pipeline.ts'

const NOW = Date.parse('2026-10-10T10:00:00Z') // Sat 12:00 in Rome
const DAY = 86_400_000
const FETCHED = '2026-10-10T10:00:00Z'

const adapter = (over: Partial<Adapter> = {}): Adapter => ({
  id: 'src',
  name: 'Source',
  defaultCategory: 'other',
  run: async () => [],
  ...over,
})

const raw = (over: Partial<RawEvent> = {}): RawEvent => ({
  nativeId: 'n1',
  title: 'Serata giochi da tavolo',
  start: '2026-10-20T20:30:00+02:00',
  end: null,
  allDay: false,
  venue: null,
  city: 'Trento',
  url: 'https://example.org/e/1',
  description: '',
  ...over,
})

const event = (over: Partial<Event> = {}): Event => ({
  id: 'id1',
  title: 'Concerto',
  start: '2026-10-20T20:30:00+02:00',
  end: null,
  allDay: false,
  ongoing: false,
  venue: null,
  city: 'Trento',
  area: 'trentino',
  ring: 'home',
  url: 'https://example.org/e/1',
  source: 'a',
  sources: ['a'],
  category: 'concerts',
  tags: ['concerts'],
  description: '',
  summary: '',
  image: null,
  occurrences: 1,
  fetchedAt: FETCHED,
  ...over,
})

describe('window', () => {
  it('effectiveEnd: timed = end, else start', () => {
    expect(effectiveEnd({ start: '2026-10-20T20:00:00+02:00', end: '2026-10-20T22:00:00+02:00', allDay: false })).toBe(
      Date.parse('2026-10-20T22:00:00+02:00'),
    )
    expect(effectiveEnd({ start: '2026-10-20T20:00:00+02:00', end: null, allDay: false })).toBe(
      Date.parse('2026-10-20T20:00:00+02:00'),
    )
  })

  it('effectiveEnd: all-day = midnight after the LAST day (end is inclusive)', () => {
    expect(effectiveEnd({ start: '2026-10-20T00:00:00+02:00', end: '2026-10-22T00:00:00+02:00', allDay: true })).toBe(
      Date.parse('2026-10-23T00:00:00+02:00'),
    )
    expect(effectiveEnd({ start: '2026-10-25T00:00:00+02:00', end: null, allDay: true })).toBe(
      Date.parse('2026-10-26T00:00:00+01:00'),
    )
  })

  it('inWindow keeps a one-day grace after the end', () => {
    const e = { start: '2026-10-09T20:00:00+02:00', end: null, allDay: false }
    // ended ~16 h ago
    expect(inWindow(e, NOW)).toBe(true)
    const old = { start: '2026-10-05T20:00:00+02:00', end: null, allDay: false }
    expect(inWindow(old, NOW)).toBe(false)
  })

  it('inWindow stops at the horizon', () => {
    const inside = { start: new Date(NOW + (HORIZON_DAYS - 1) * DAY).toISOString(), end: null, allDay: false }
    const beyond = { start: new Date(NOW + (HORIZON_DAYS + 1) * DAY).toISOString(), end: null, allDay: false }
    expect(inWindow(inside, NOW)).toBe(true)
    expect(inWindow(beyond, NOW)).toBe(false)
  })

  it('isOngoing: started and not yet over', () => {
    const span = { start: '2026-10-01T00:00:00+02:00', end: '2026-10-31T00:00:00+01:00', allDay: true }
    expect(isOngoing(span, NOW)).toBe(true)
    expect(isOngoing({ ...span, start: '2026-10-20T00:00:00+02:00' }, NOW)).toBe(false)
    expect(isOngoing({ start: '2026-10-10T09:00:00Z', end: '2026-10-10T09:30:00Z', allDay: false }, NOW)).toBe(false)
  })
})

describe('toEvents', () => {
  it('derives id, sources, ring, area, category and tags', () => {
    const [e] = toEvents(adapter({ id: 'ludimus' }), [raw()], NOW, FETCHED)
    expect(e).toMatchObject({
      source: 'ludimus',
      sources: ['ludimus'],
      ring: 'home',
      area: 'trentino',
      category: 'boardgames',
      occurrences: 1,
      fetchedAt: FETCHED,
      image: null,
    })
    expect(e?.id).toMatch(/^[0-9a-f]{16}$/)
    expect(e?.tags).toContain('boardgames')
  })

  it('drops an end before the start instead of publishing a backwards range (bibcom, mart)', () => {
    const [e] = toEvents(adapter(), [raw({ start: '2026-10-20T20:00:00+02:00', end: '2026-10-20T18:00:00+02:00' })], NOW, FETCHED)
    expect(e?.end).toBeNull()
  })

  it('keeps a valid end', () => {
    const [e] = toEvents(adapter(), [raw({ end: '2026-10-20T22:00:00+02:00' })], NOW, FETCHED)
    expect(e?.end).toBe('2026-10-20T22:00:00+02:00')
  })

  it('skips events without a title and events outside the window', () => {
    const out = toEvents(
      adapter(),
      [raw({ nativeId: 'a', title: '' }), raw({ nativeId: 'b', start: '2025-01-01T20:00:00+01:00' }), raw({ nativeId: 'c' })],
      NOW,
      FETCHED,
    )
    expect(out).toHaveLength(1)
  })

  it('collapses duplicate native ids of one adapter', () => {
    expect(toEvents(adapter(), [raw(), raw()], NOW, FETCHED)).toHaveLength(1)
  })

  it('the same native id in two adapters yields two different ids', () => {
    const a = toEvents(adapter({ id: 'a' }), [raw()], NOW, FETCHED)[0]
    const b = toEvents(adapter({ id: 'b' }), [raw()], NOW, FETCHED)[0]
    expect(a?.id).not.toBe(b?.id)
  })

  it('normalises whitespace in title and venue, blank city becomes Trentino', () => {
    const [e] = toEvents(adapter(), [raw({ title: '  Serata   giochi  ', venue: '  Sala \n Rossa ', city: ' ' })], NOW, FETCHED)
    expect(e?.title).toBe('Serata giochi')
    expect(e?.venue).toBe('Sala Rossa')
    expect(e?.city).toBe('Trentino')
  })

  it('area comes from the city map, then the adapter', () => {
    expect(toEvents(adapter({ area: 'veneto' }), [raw({ city: 'Bolzano' })], NOW, FETCHED)[0]?.area).toBe('alto-adige')
    expect(toEvents(adapter({ area: 'veneto' }), [raw({ city: 'Nowhere' })], NOW, FETCHED)[0]?.area).toBe('veneto')
  })

  it('ongoing is computed at crawl time', () => {
    const [e] = toEvents(
      adapter(),
      [raw({ start: '2026-10-01T00:00:00+02:00', end: '2026-10-31T00:00:00+01:00', allDay: true })],
      NOW,
      FETCHED,
    )
    expect(e?.ongoing).toBe(true)
  })

  it('summary defaults to the start of the description', () => {
    const [e] = toEvents(adapter(), [raw({ description: '<p>Prima riga.</p><p>Seconda.</p>' })], NOW, FETCHED)
    expect(e?.description).toBe('Prima riga.\n\nSeconda.')
    expect(e?.summary).toBe('Prima riga. Seconda.')
  })

  it('drop rules apply and are counted', () => {
    const drops: DropCounts = new Map()
    const out = toEvents(
      adapter(),
      [raw({ nativeId: 'a', title: 'Convocazione consiglio circoscrizione' }), raw({ nativeId: 'b', title: '...' }), raw({ nativeId: 'c' })],
      NOW,
      FETCHED,
      drops,
    )
    expect(out).toHaveLength(1)
    expect(drops.get('civic-notice')).toBe(1)
    expect(drops.get('no-title')).toBe(1)
  })

  describe('ring 2 (near) sources', () => {
    it('keep interests, drop the rest and kids', () => {
      const near = adapter({ ring: 'near' })
      const out = toEvents(
        near,
        [
          raw({ nativeId: 'a', title: 'Serata giochi da tavolo' }),
          raw({ nativeId: 'b', title: 'Assemblea condominiale' }),
          raw({ nativeId: 'c', title: 'Serata giochi da tavolo per bambini' }),
        ],
        NOW,
        FETCHED,
      )
      expect(out.map((e) => e.ring)).toEqual(['near'])
      expect(out).toHaveLength(1)
    })
  })

  describe('series folding', () => {
    const dates = (n: number) => Array.from({ length: n }, (_, i) => {
      const day = String(12 + i).padStart(2, '0')
      return raw({ nativeId: `o${i}`, seriesKey: 's1', start: `2026-10-${day}T20:00:00+02:00`, end: `2026-10-${day}T22:00:00+02:00` })
    })

    it(`up to ${MAX_OCCURRENCES} dates stay separate`, () => {
      const out = toEvents(adapter(), dates(MAX_OCCURRENCES), NOW, FETCHED)
      expect(out).toHaveLength(MAX_OCCURRENCES)
      expect(out.every((e) => e.occurrences === 1)).toBe(true)
    })

    it('more dates fold into one all-day record from the first to the last day', () => {
      const out = toEvents(adapter(), dates(MAX_OCCURRENCES + 2), NOW, FETCHED)
      expect(out).toHaveLength(1)
      expect(out[0]).toMatchObject({
        allDay: true,
        occurrences: MAX_OCCURRENCES + 2,
        start: '2026-10-12T00:00:00+02:00',
        end: '2026-10-21T00:00:00+02:00',
      })
    })

    it('a folded series keeps a stable id however the dates are ordered', () => {
      const d = dates(MAX_OCCURRENCES + 1)
      const a = toEvents(adapter(), d, NOW, FETCHED)[0]?.id
      const b = toEvents(adapter(), [...d].reverse(), NOW, FETCHED)[0]?.id
      expect(a).toBe(b)
    })

    it('events without a seriesKey are never folded', () => {
      const many = Array.from({ length: 12 }, (_, i) => raw({ nativeId: `x${i}` }))
      expect(toEvents(adapter(), many, NOW, FETCHED)).toHaveLength(12)
    })

    it('a long series nothing classifies takes the adapter longSeriesCategory', () => {
      const series = Array.from({ length: LONG_SERIES }, (_, i) =>
        raw({ nativeId: `o${i}`, seriesKey: 's', title: 'Qualcosa di speciale', start: `2026-10-${String(12 + i).padStart(2, '0')}T10:00:00+02:00` }),
      )
      const [e] = toEvents(adapter({ longSeriesCategory: 'exhibitions' }), series, NOW, FETCHED)
      expect(e?.category).toBe('exhibitions')
      expect(e?.tags).toContain('exhibitions')
      const [plain] = toEvents(adapter(), series, NOW, FETCHED)
      expect(plain?.category).toBe('other')
    })
  })
})

describe('dedup', () => {
  it('merges the same title + day + city from two sources, keeping the richer record', () => {
    const a = event({ id: 'a', source: 'a', sources: ['a'], image: null, venue: null })
    const b = event({ id: 'b', source: 'b', sources: ['b'], image: 'https://img/x.jpg', venue: 'Sala', end: '2026-10-20T22:00:00+02:00' })
    const out = dedup([a, b])
    expect(out).toHaveLength(1)
    expect(out[0]).toMatchObject({ id: 'b', image: 'https://img/x.jpg', venue: 'Sala', sources: ['a', 'b'] })
  })

  it('fills the gaps of the kept record from the duplicate', () => {
    const rich = event({ id: 'rich', end: '2026-10-20T22:00:00+02:00', venue: 'Sala', image: 'https://i/1.jpg', description: 'x'.repeat(400) })
    const poor = event({ id: 'poor', source: 'b', sources: ['b'], summary: 'Un riassunto' })
    const [m] = dedup([rich, poor])
    expect(m?.id).toBe('rich')
    expect(m?.summary).toBe('Un riassunto')
  })

  it('matches across case, accents and punctuation of the title', () => {
    const out = dedup([event({ id: 'a', title: 'Caffè, Concerto!' }), event({ id: 'b', source: 'b', sources: ['b'], title: 'CAFFE CONCERTO' })])
    expect(out).toHaveLength(1)
  })

  it('prefers the natural-case title over SHOUTING', () => {
    const out = dedup([
      event({ id: 'a', title: 'IL SEGRETO DI FRANCESCO' }),
      event({ id: 'b', source: 'b', sources: ['b'], title: 'Il segreto di Francesco' }),
    ])
    expect(out[0]?.title).toBe('Il segreto di Francesco')
  })

  it('different day or different city is a different event', () => {
    expect(dedup([event({ id: 'a' }), event({ id: 'b', start: '2026-10-21T20:30:00+02:00' })])).toHaveLength(2)
    expect(dedup([event({ id: 'a' }), event({ id: 'b', city: 'Rovereto' })])).toHaveLength(2)
  })

  it('keeps the closer ring', () => {
    const [m] = dedup([event({ id: 'a', ring: 'near' }), event({ id: 'b', source: 'b', sources: ['b'], ring: 'home' })])
    expect(m?.ring).toBe('home')
  })

  it('a duplicate that knows the category replaces other', () => {
    const [m] = dedup([
      event({ id: 'a', category: 'other', tags: ['other'] }),
      event({ id: 'b', source: 'b', sources: ['b'], category: 'theatre', tags: ['theatre'], venue: 'Teatro' }),
    ])
    expect(m?.category).toBe('theatre')
    expect(m?.tags).not.toContain('other')
  })

  it('kids on either side wins and creative is dropped', () => {
    const [m] = dedup([
      event({ id: 'a', category: 'theatre', tags: ['theatre', 'creative'] }),
      event({ id: 'b', source: 'b', sources: ['b'], category: 'theatre', tags: ['theatre', 'kids'] }),
    ])
    expect(m?.tags).toContain('kids')
    expect(m?.tags).not.toContain('creative')
  })

  describe('subtitled titles at the same instant (Il segreto di Francesco)', () => {
    const short = event({ id: 'a', title: 'Il segreto di Francesco', source: 'cultura', sources: ['cultura'] })
    const long = event({
      id: 'b', title: 'Il segreto di Francesco. Lo spirito del Santo di Assisi, oggi', source: 'rovereto', sources: ['rovereto'],
      venue: 'Teatro',
    })

    it('folds a longer title into its 3-word prefix from another source', () => {
      const out = dedup([short, long])
      expect(out).toHaveLength(1)
      expect(out[0]?.sources).toEqual(['cultura', 'rovereto'])
    })

    it('does not fold within one source', () => {
      const same = { ...long, source: 'cultura', sources: ['cultura'] }
      expect(dedup([short, same])).toHaveLength(2)
    })

    it('does not fold a prefix shorter than 3 words', () => {
      const a = event({ id: 'a', title: 'Il segreto', source: 'x', sources: ['x'] })
      const b = event({ id: 'b', title: 'Il segreto di Francesco', source: 'y', sources: ['y'] })
      expect(dedup([a, b])).toHaveLength(2)
    })

    it('does not fold at different times or for all-day events', () => {
      expect(dedup([short, { ...long, start: '2026-10-20T21:30:00+02:00' }])).toHaveLength(2)
      expect(dedup([{ ...short, allDay: true }, { ...long, allDay: true }])).toHaveLength(2)
    })
  })
})

describe('sortEvents', () => {
  it('by start, then title (Italian collation), then id', () => {
    const out = sortEvents([
      event({ id: '3', title: 'B', start: '2026-10-21T20:00:00+02:00' }),
      event({ id: '2', title: 'Zeta', start: '2026-10-20T20:00:00+02:00' }),
      event({ id: '1', title: 'Alfa', start: '2026-10-20T20:00:00+02:00' }),
      event({ id: '0', title: 'Alfa', start: '2026-10-20T20:00:00+02:00' }),
    ])
    expect(out.map((e) => e.id)).toEqual(['0', '1', '2', '3'])
  })

  it('compares instants, not strings (different offsets)', () => {
    const out = sortEvents([
      event({ id: 'late', start: '2026-10-20T20:00:00+01:00' }), // 19:00 UTC
      event({ id: 'early', start: '2026-10-20T20:00:00+02:00' }), // 18:00 UTC
    ])
    expect(out.map((e) => e.id)).toEqual(['early', 'late'])
  })
})

describe('withPlace (events carried over from an old events.json)', () => {
  it('fills area and ring from the adapter, keeps existing ones', () => {
    const old = { ...event({ city: 'Nowhere' }) } as Partial<Event>
    delete old.area
    delete old.ring
    const [a] = withPlace(adapter({ area: 'veneto' }), [old as Event])
    expect(a).toMatchObject({ area: 'veneto', ring: 'home' })
    const [b] = withPlace(adapter({ area: 'veneto' }), [event({ area: 'lombardia', ring: 'spot' })])
    expect(b).toMatchObject({ area: 'lombardia', ring: 'spot' })
  })

  it('re-filters a near source by interests and every event by drop rules', () => {
    const drops: DropCounts = new Map()
    const out = withPlace(
      adapter({ ring: 'near' }),
      [
        event({ id: 'keep', tags: ['festivals'], category: 'festivals' }),
        event({ id: 'no-interest', tags: ['talks'], category: 'talks' }),
        event({ id: 'civic', title: 'Convocazione consiglio comunale', tags: ['festivals'], category: 'festivals' }),
      ],
      drops,
    )
    expect(out.map((e) => e.id)).toEqual(['keep'])
    expect(drops.get('civic-notice')).toBe(1)
  })
})
