import { describe, expect, it } from 'vitest'
import { filmKey, filmsOn, hallName, isScreening, screeningDays } from './screenings'
import type { EventItem } from './types'

const NOW = Date.parse('2026-10-16T10:00:00Z')

const ev = (title: string, start: string, over: Partial<EventItem> = {}): EventItem => ({
  id: `${title}${start}${over.city ?? ''}${over.source ?? ''}`,
  title,
  start,
  end: null,
  allDay: false,
  ongoing: false,
  venue: null,
  city: 'Rovereto',
  url: 'https://example.org/film',
  source: 'trentinospettacoli',
  sources: ['trentinospettacoli'],
  category: 'cinema',
  tags: ['cinema'],
  description: '',
  summary: '',
  image: null,
  occurrences: 1,
  fetchedAt: '2026-10-14T00:00:00Z',
  ...over,
})

describe('isScreening', () => {
  it('takes a hall programme and leaves festivals, talks and other sources as events', () => {
    expect(isScreening(ev('Hen', '2026-10-16T21:00:00+02:00'))).toBe(true)
    expect(isScreening(ev('X', '2026-10-16T21:00:00+02:00', { tags: ['cinema', 'talks'] }))).toBe(false)
    expect(isScreening(ev('X', '2026-10-16T21:00:00+02:00', { tags: ['cinema', 'festivals'] }))).toBe(false)
    expect(isScreening(ev('X', '2026-10-16T21:00:00+02:00', { source: 'mart' }))).toBe(false)
    expect(isScreening(ev('X', '2026-10-16T21:00:00+02:00', { category: 'theatre' }))).toBe(false)
  })
  it('keeps every supercinema record even with a stray talks tag', () => {
    expect(
      isScreening(
        ev('Santiago', '2026-10-16T21:00:00+02:00', {
          source: 'supercinema',
          tags: ['cinema', 'talks'],
        }),
      ),
    ).toBe(true)
  })
})

describe('filmKey / hallName', () => {
  it('matches a film across sources despite subtitles and accents', () => {
    expect(filmKey('Hen – Storia di una Gallina')).toBe(filmKey('Hen'))
    expect(filmKey('L’Isola dei Ricordi')).toBe(filmKey("L'Isola dei Ricordi"))
  })
  it('drops the town prefix of a venue', () => {
    expect(
      hallName({
        venue: 'Borgo Valsugana – Cineteatro del Centro scolastico',
        city: 'Borgo',
      }),
    ).toBe('Cineteatro del Centro scolastico')
    expect(hallName({ venue: null, city: 'Tione' })).toBe('Tione')
  })
})

describe('filmsOn', () => {
  const list = [
    ev('Hen', '2026-10-16T21:00:00+02:00', {
      city: 'Mezzolombardo',
      venue: 'Mezzolombardo – Cinema Teatro S. Pietro',
    }),
    ev('Hen – Storia di una Gallina', '2026-10-16T21:00:00+02:00', {
      city: 'Mezzolombardo',
      source: 'cultura-trentino',
    }),
    ev('Hen', '2026-10-16T18:30:00+02:00', {
      city: 'Rovereto',
      source: 'supercinema',
    }),
    ev('Hen', '2026-10-16T00:00:00+02:00', {
      city: 'Rovereto',
      source: 'cultura-trentino',
    }),
    ev('Digger', '2026-10-17T21:00:00+02:00'),
  ]
  it('lists the days', () => {
    expect(screeningDays(list)).toEqual(['2026-10-16', '2026-10-17'])
  })
  it('merges sources into one film with one showing per town, by time', () => {
    const films = filmsOn(list, '2026-10-16', NOW)
    expect(films).toHaveLength(1)
    expect(films[0]?.title).toBe('Hen')
    expect(films[0]?.showings.map((s) => [s.city, s.times])).toEqual([
      ['Rovereto', ['18:30']],
      ['Mezzolombardo', ['21:00']],
    ])
  })
  it('filters by town and hides showings that ended today', () => {
    expect(filmsOn(list, '2026-10-16', NOW, 'Mezzolombardo')[0]?.showings).toHaveLength(1)
    // 22:00 in Rome: the 18:30 show is over, the 21:00 one is still running.
    const late = Date.parse('2026-10-16T20:00:00Z')
    expect(filmsOn(list, '2026-10-16', late)[0]?.showings.map((s) => s.city)).toEqual(['Mezzolombardo'])
  })
})

describe('filmsOn: Trento halls', () => {
  it('keeps each Trento hall as its own showing', () => {
    const list = [
      ev('Naza', '2026-10-20T18:00:00+02:00', { city: 'Trento', venue: 'Supercinema Vittoria', source: 'mymovies' }),
      ev('Naza', '2026-10-20T21:00:00+02:00', { city: 'Trento', venue: 'Multisala Modena', source: 'mymovies' }),
      ev('Naza', '2026-10-20T21:00:00+02:00', { city: 'Tesero', source: 'mymovies' }),
    ]
    const f = filmsOn(list, '2026-10-20', Date.parse('2026-10-20T05:00:00Z'))
    expect(f[0]?.showings.map((s) => [s.city, s.hall, s.times])).toEqual([
      ['Trento', 'Supercinema Vittoria', ['18:00']],
      ['Tesero', 'Tesero', ['21:00']],
      ['Trento', 'Multisala Modena', ['21:00']],
    ])
  })
})
