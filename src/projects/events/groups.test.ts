import { describe, expect, it } from 'vitest'
import { collapseRepeats, MIN_REPEATS, repeatKey } from './groups'
import { groupByDay } from './model'
import type { EventItem } from './types'

const NOW = Date.parse('2026-10-10T10:00:00Z')

const ev = (id: string, day: string, over: Partial<EventItem> = {}): EventItem => ({
  id,
  title: 'Serata giochi',
  start: `${day}T20:30:00+02:00`,
  end: null,
  allDay: false,
  ongoing: false,
  venue: null,
  city: 'Trento',
  url: 'https://example.org',
  source: 'a',
  sources: ['a'],
  category: 'boardgames',
  tags: [],
  description: '',
  summary: '',
  image: null,
  occurrences: 1,
  fetchedAt: '2026-10-10T10:00:00Z',
  ...over,
})

const days = (events: EventItem[]) => groupByDay(events, NOW)
const ids = (d: ReturnType<typeof days>) => d.flatMap((g) => g.events.map((e) => e.id))

describe('collapseRepeats', () => {
  it('collapses 3+ same title and city into the next occurrence', () => {
    const d = days([ev('a', '2026-10-12'), ev('b', '2026-10-19'), ev('c', '2026-10-26')])
    const out = collapseRepeats(d, true)
    expect(ids(out.days)).toEqual(['a'])
    expect(out.repeats.get('a')?.map((e) => e.id)).toEqual(['a', 'b', 'c'])
  })

  it('leaves a pair as two cards', () => {
    expect(MIN_REPEATS).toBe(3)
    const d = days([ev('a', '2026-10-12'), ev('b', '2026-10-19')])
    const out = collapseRepeats(d, true)
    expect(ids(out.days)).toEqual(['a', 'b'])
    expect(out.repeats.size).toBe(0)
  })

  it('keys on normalized title and city, venue may differ', () => {
    expect(repeatKey({ title: ' Caffè  ', city: 'Trento' })).toBe(repeatKey({ title: 'CAFFE', city: 'trento' }))
    const d = days([
      ev('a', '2026-10-12', { title: 'Caffè', venue: 'X' }),
      ev('b', '2026-10-13', { title: 'caffe', venue: 'Y' }),
      ev('c', '2026-10-14', { title: 'CAFFE' }),
    ])
    expect(ids(collapseRepeats(d, true).days)).toEqual(['a'])
  })

  it('does not mix cities', () => {
    const d = days([
      ev('a', '2026-10-12'),
      ev('b', '2026-10-13', { city: 'Rovereto' }),
      ev('c', '2026-10-14'),
      ev('d', '2026-10-15', { city: 'Rovereto' }),
    ])
    const out = collapseRepeats(d, true)
    expect(ids(out.days)).toEqual(['a', 'b', 'c', 'd'])
    expect(out.repeats.size).toBe(0)
  })

  it('keeps the group at its next occurrence position and drops emptied days', () => {
    const d = days([
      ev('x', '2026-10-11', { title: 'Altro' }),
      ev('a', '2026-10-12'),
      ev('y', '2026-10-13', { title: 'Altro 2' }),
      ev('b', '2026-10-14'),
      ev('c', '2026-10-15'),
    ])
    const out = collapseRepeats(d, true)
    expect(ids(out.days)).toEqual(['x', 'a', 'y'])
    expect(out.days.map((g) => g.key)).toEqual(['2026-10-11', '2026-10-12', '2026-10-13'])
  })

  it('never groups outside the main view (saved, open now)', () => {
    const d = days([ev('a', '2026-10-12'), ev('b', '2026-10-19'), ev('c', '2026-10-26')])
    const out = collapseRepeats(d, false)
    expect(ids(out.days)).toEqual(['a', 'b', 'c'])
    expect(out.repeats.size).toBe(0)
  })

  it('never touches the open-now group', () => {
    const d = [
      {
        key: 'open-now',
        label: 'Open now',
        events: [ev('a', '2026-10-01'), ev('b', '2026-10-02'), ev('c', '2026-10-03')],
      },
    ]
    expect(ids(collapseRepeats(d, true).days)).toEqual(['a', 'b', 'c'])
  })

  it('keeps standalone (saved/hidden/manual) records out of the group', () => {
    const d = days([ev('a', '2026-10-12'), ev('b', '2026-10-19'), ev('c', '2026-10-26'), ev('d', '2026-11-02')])
    const out = collapseRepeats(d, true, (e) => e.id === 'a')
    expect(ids(out.days)).toEqual(['a', 'b'])
    expect(out.repeats.get('b')?.map((e) => e.id)).toEqual(['b', 'c', 'd'])
    // With the saved one out and only two left, no group at all.
    const two = collapseRepeats(
      days([ev('a', '2026-10-12'), ev('b', '2026-10-19'), ev('c', '2026-10-26')]),
      true,
      (e) => e.id === 'a',
    )
    expect(ids(two.days)).toEqual(['a', 'b', 'c'])
  })

  it('counts a group as one card for paging', () => {
    const many = Array.from({ length: 10 }, (_, i) => ev(`r${i}`, `2026-10-${String(12 + i).padStart(2, '0')}`))
    expect(collapseRepeats(days(many), true).days.flatMap((g) => g.events)).toHaveLength(1)
  })
})
