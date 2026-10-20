import { describe, expect, it } from 'vitest'
import { showKind, stageOn, upcomingShows } from './showList'
import type { EventItem } from './types'

const NOW = Date.parse('2026-10-20T10:00:00Z')

const ev = (id: string, category: string, start: string, over: Partial<EventItem> = {}): EventItem => ({
  id,
  title: id,
  start,
  end: null,
  allDay: false,
  ongoing: false,
  venue: null,
  city: 'Trento',
  url: 'https://example.org',
  source: 'cultura-trentino',
  sources: ['cultura-trentino'],
  category,
  tags: [category],
  description: '',
  summary: '',
  image: null,
  occurrences: 1,
  fetchedAt: '2026-10-20T00:00:00Z',
  ...over,
})

describe('shows', () => {
  const list = [
    ev('film', 'cinema', '2026-10-21T21:00:00+02:00'),
    ev('play', 'theatre', '2026-10-21T20:30:00+02:00'),
    ev('gig', 'concerts', '2026-10-22T21:00:00+02:00', { city: 'Rovereto' }),
    ev('expo', 'exhibitions', '2026-10-21T10:00:00+02:00'),
    ev('old', 'theatre', '2026-10-10T20:30:00+02:00'),
  ]
  it('classifies and keeps only upcoming shows', () => {
    expect(showKind(list[0]!)).toBe('cinema')
    expect(showKind(list[1]!)).toBe('theatre')
    expect(showKind(list[3]!)).toBeNull()
    expect(upcomingShows(list, NOW).map((e) => e.id)).toEqual(['play', 'film', 'gig'])
  })
  it('lists the plays and concerts of a day, by kind and town', () => {
    const shows = upcomingShows(list, NOW)
    expect(stageOn(shows, '2026-10-21', NOW, null, null).map((e) => e.id)).toEqual(['play'])
    expect(stageOn(shows, '2026-10-22', NOW, 'concerts', 'Rovereto').map((e) => e.id)).toEqual(['gig'])
    expect(stageOn(shows, '2026-10-22', NOW, 'theatre', null)).toEqual([])
  })
})
