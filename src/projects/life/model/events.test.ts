import { describe, expect, it } from 'vitest'
import type { EventMark, LifePlan } from '../../../lib/db'
import type { EventItem } from '../../events/types'
import { buildExportMarkdown } from './export.ts'
import { MAX_SAVED_EVENTS, summarizeSavedEvents } from './events.ts'

// Fake data only (this repo is public).
const WEEK = '2026-10-12' // a Monday; the planned week is 2026-10-19..25
const plan: LifePlan = {
  version: 1,
  week: WEEK,
  focus: [],
  rules: [],
  tasks: [],
  trackers: [],
  sundayCheck: [],
  checkins: [],
}
const ev = (id: string, start: string, o: Partial<EventItem> = {}): EventItem => ({
  id,
  title: `Event ${id}`,
  start,
  end: null,
  allDay: false,
  ongoing: false,
  venue: 'Venue A',
  city: 'Town A',
  url: `https://example.com/${id}`,
  source: 's',
  sources: ['s'],
  category: 'music',
  tags: [],
  description: 'long text that must not appear',
  summary: '',
  image: null,
  occurrences: 1,
  fetchedAt: '2026-10-01T00:00:00Z',
  ...o,
})
const mark = (e: EventItem, state: EventMark['state'] = 'saved'): EventMark => ({
  id: e.id,
  state,
  event: e,
  updatedAt: 0,
})
const ids = (marks: EventMark[], week = WEEK) => summarizeSavedEvents(marks, week).events.map((e) => e.id)

describe('summarizeSavedEvents', () => {
  it('uses the week after the exported one (Sunday of the exported week out, next Monday in)', () => {
    const sun = mark(ev('sun', '2026-10-18T21:00:00+02:00'))
    const mon = mark(ev('mon', '2026-10-19T09:00:00+02:00'))
    const nextSun = mark(ev('nsun', '2026-10-25T23:00:00+01:00'))
    const after = mark(ev('after', '2026-10-26T10:00:00+01:00'))
    expect(ids([after, nextSun, mon, sun])).toEqual(['mon', 'nsun'])
  })

  it('includes multi-day ranges that overlap the week', () => {
    const covering = mark(ev('a', '2026-10-15T00:00:00+02:00', { end: '2026-10-30T00:00:00+01:00', allDay: true }))
    const endsSunday = mark(ev('b', '2026-10-14T10:00:00+02:00', { end: '2026-10-18T22:00:00+02:00' }))
    const endsMonday = mark(ev('c', '2026-10-14T10:00:00+02:00', { end: '2026-10-19T01:00:00+02:00' }))
    expect(ids([covering, endsSunday, endsMonday])).toEqual(['c', 'a'])
  })

  it('ignores hidden marks and sorts by start', () => {
    const late = mark(ev('late', '2026-10-24T20:00:00+02:00'))
    const early = mark(ev('early', '2026-10-20T20:00:00+02:00'))
    const hidden = mark(ev('hid', '2026-10-21T20:00:00+02:00'), 'hidden')
    expect(ids([late, hidden, early])).toEqual(['early', 'late'])
  })

  it('caps the list', () => {
    const many = Array.from({ length: MAX_SAVED_EVENTS + 5 }, (_, i) =>
      mark(ev(`e${String(i).padStart(2, '0')}`, `2026-10-20T${String(i % 24).padStart(2, '0')}:00:00+02:00`)),
    )
    expect(ids(many)).toHaveLength(MAX_SAVED_EVENTS)
  })

  it('passes favourite category labels through', () => {
    expect(summarizeSavedEvents([], WEEK, ['Music']).favouriteCategories).toEqual(['Music'])
  })
})

describe('export with saved events', () => {
  it('is unchanged without saved events or favourites', () => {
    const base = buildExportMarkdown(plan, [], '2026-10-16')
    expect(base).not.toContain('Saved events')
    expect(base).not.toContain('savedEvents')
    expect(buildExportMarkdown(plan, [], '2026-10-16', [], { marks: [], favouriteCategories: [] })).toBe(base)
    // an event outside next week leaves it identical too
    const out = mark(ev('x', '2026-10-18T21:00:00+02:00'))
    expect(buildExportMarkdown(plan, [], '2026-10-16', [], { marks: [out], favouriteCategories: [] })).toBe(base)
  })

  it('adds a section and a JSON array', () => {
    const timed = mark(ev('t', '2026-10-24T21:00:00+02:00', { title: 'Show\nA' }))
    const allDay = mark(ev('d', '2026-10-21T00:00:00+02:00', { allDay: true, venue: null }))
    const md = buildExportMarkdown(plan, [], '2026-10-16', [], {
      marks: [timed, allDay],
      favouriteCategories: ['Music'],
    })
    expect(md).toContain(
      '## Saved events next week\n\n- Wed 2026-10-21 · Event d — Town A\n- Sat 2026-10-24 21:00 · Show / A — Venue A, Town A\nFavourite categories: ',
    )
    expect(md).toContain('"savedEvents"')
    expect(md).not.toContain('long text that must not appear')
  })
})
