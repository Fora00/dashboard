import { describe, expect, it } from 'vitest'
import type { CustomEvent } from '../../lib/db'
import type { EventItem } from './types'
import {
  MAX_IMAGE_LENGTH,
  MAX_NOTE_LENGTH,
  MAX_TITLE_LENGTH,
  cityArea,
  customToEventItem,
  emptyForm,
  fitWithin,
  formToRow,
  isExpiredCustomEvent,
  isSafeImageDataUrl,
  isValidDate,
  mergeEvents,
  normalizeEventUrl,
  parsePrefill,
  romeIso,
  rowToForm,
  type CustomEventForm,
} from './custom'
import { isKidsEvent, isOver, formatRange, localDay } from './model'

const NOW = Date.parse('2026-10-01T10:00:00Z')
const JPEG = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ=='
const form = (over: Partial<CustomEventForm> = {}): CustomEventForm => ({
  ...emptyForm(),
  title: 'Serata boulder',
  date: '2026-10-09',
  ...over,
})
const build = (over: Partial<CustomEventForm> = {}) => {
  const r = formToRow(form(over), NOW, undefined, () => 'id-1')
  if (!r.ok) throw new Error(r.error)
  return r.row
}

describe('romeIso', () => {
  it('uses the summer offset in summer and the winter one in winter', () => {
    expect(romeIso('2026-10-04', '20:30')).toBe('2026-10-04T20:30:00+02:00')
    expect(romeIso('2026-12-04', '20:30')).toBe('2026-12-04T20:30:00+01:00')
    expect(romeIso('2026-10-25')).toBe('2026-10-25T00:00:00+02:00') // DST ends later that night
    expect(romeIso('2026-10-26')).toBe('2026-10-26T00:00:00+01:00')
    expect(romeIso('2027-03-28', '12:00')).toBe('2027-03-28T12:00:00+02:00')
  })

  it('round-trips to the same wall-clock day and time in Rome', () => {
    const iso = romeIso('2026-07-01', '00:15')
    expect(new Date(iso).toISOString()).toBe('2026-06-30T22:15:00.000Z')
  })
})

describe('isValidDate', () => {
  it('accepts real days only', () => {
    expect(isValidDate('2026-10-09')).toBe(true)
    expect(isValidDate('2026-02-30')).toBe(false)
    expect(isValidDate('9/10/2026')).toBe(false)
    expect(isValidDate('')).toBe(false)
  })
})

describe('formToRow', () => {
  it('no time = all day, single day: end null, start at local midnight', () => {
    const r = build()
    expect(r).toMatchObject({
      id: 'id-1',
      title: 'Serata boulder',
      start: '2026-10-09T00:00:00+02:00',
      end: null,
      allDay: true,
      venue: null,
      city: 'Trento',
      url: '',
      note: '',
      category: 'other',
      image: null,
      createdAt: NOW,
      updatedAt: NOW,
    })
  })

  it('all day over several days: inclusive last-day midnight', () => {
    const r = build({ endDate: '2026-10-11' })
    expect(r.end).toBe('2026-10-11T00:00:00+02:00')
    expect(formatRange(customToEventItem(r))).toMatch(/9 ott – 11 ott/)
  })

  it('timed, with and without an end', () => {
    expect(build({ time: '20:30' })).toMatchObject({ allDay: false, start: '2026-10-09T20:30:00+02:00', end: null })
    expect(build({ time: '20:30', endTime: '23:00' }).end).toBe('2026-10-09T23:00:00+02:00')
    expect(build({ time: '20:30', endDate: '2026-10-10', endTime: '02:00' }).end).toBe('2026-10-10T02:00:00+02:00')
    expect(build({ time: '20:30', endDate: '2026-10-10' }).end).toBe('2026-10-10T23:59:00+02:00')
  })

  it('an end time without a start time is ignored (all day)', () => {
    expect(build({ endTime: '22:00' })).toMatchObject({ allDay: true, end: null })
  })

  it('rejects missing or inconsistent input', () => {
    expect(formToRow(form({ title: '   ' }), NOW)).toEqual({ ok: false, error: 'Add a title.' })
    expect(formToRow(form({ date: '' }), NOW).ok).toBe(false)
    expect(formToRow(form({ endDate: '2026-10-01' }), NOW).ok).toBe(false)
    expect(formToRow(form({ time: '20:30', endTime: '19:00' }), NOW).ok).toBe(false)
    expect(formToRow(form({ time: '25:00' }), NOW).ok).toBe(false)
    expect(formToRow(form({ image: 'data:text/html;base64,PHNjcmlwdD4=' }), NOW).ok).toBe(false)
    expect(formToRow(form({ image: `data:image/jpeg;base64,${'A'.repeat(MAX_IMAGE_LENGTH)}` }), NOW).ok).toBe(false)
  })

  it('trims and caps text, normalises the link, defaults city and category', () => {
    const r = build({
      title: `  ${'x'.repeat(MAX_TITLE_LENGTH + 20)} `,
      note: `  ${'n'.repeat(MAX_NOTE_LENGTH + 5)}`,
      venue: '  Block3   Trento ',
      city: '   ',
      url: 'instagram.com/p/abc',
      category: 'quidditch',
      image: JPEG,
    })
    expect(r.title).toHaveLength(MAX_TITLE_LENGTH)
    expect(r.note).toHaveLength(MAX_NOTE_LENGTH)
    expect(r.venue).toBe('Block3 Trento')
    expect(r.city).toBe('Trento')
    expect(r.url).toBe('https://instagram.com/p/abc')
    expect(r.category).toBe('other')
    expect(r.image).toBe(JPEG)
  })

  it('edit keeps id and createdAt, bumps updatedAt', () => {
    const r = formToRow(form(), NOW + 5, { id: 'old', createdAt: 1 })
    expect(r.ok && r.row).toMatchObject({ id: 'old', createdAt: 1, updatedAt: NOW + 5 })
  })
})

describe('rowToForm', () => {
  it('is the inverse of formToRow for every shape', () => {
    for (const over of [
      {},
      { endDate: '2026-10-12' },
      { time: '19:00' },
      { time: '19:00', endTime: '21:30' },
      { time: '19:00', endDate: '2026-10-10', endTime: '01:00' },
      { venue: 'Campfour', city: 'Bolzano', url: 'https://example.org/', category: 'outdoor', note: 'a\nb', image: JPEG },
    ] as Partial<CustomEventForm>[]) {
      const f = form(over)
      expect(rowToForm(build(over))).toEqual(f)
    }
  })
})

describe('normalizeEventUrl', () => {
  it('keeps http(s), adds https, drops everything else', () => {
    expect(normalizeEventUrl(' https://www.instagram.com/p/x/ ')).toBe('https://www.instagram.com/p/x/')
    expect(normalizeEventUrl('block3.it')).toBe('https://block3.it/')
    expect(normalizeEventUrl('javascript:alert(1)')).toBe('')
    expect(normalizeEventUrl('data:text/html,hi')).toBe('')
    expect(normalizeEventUrl('')).toBe('')
  })
})

describe('isSafeImageDataUrl', () => {
  it('only base64 JPEG/PNG/WebP data URLs', () => {
    expect(isSafeImageDataUrl(JPEG)).toBe(true)
    expect(isSafeImageDataUrl('data:image/png;base64,iVBORw0KGgo=')).toBe(true)
    expect(isSafeImageDataUrl('data:image/svg+xml;base64,PHN2Zz4=')).toBe(false)
    expect(isSafeImageDataUrl('https://example.org/a.jpg')).toBe(false)
    expect(isSafeImageDataUrl('unchanged_toast')).toBe(false)
    expect(isSafeImageDataUrl(undefined)).toBe(false)
  })
})

describe('customToEventItem + mergeEvents', () => {
  const row: CustomEvent = {
    ...build({ venue: 'Block3', note: '\nGara sociale\nIscrizioni in palestra', image: JPEG, category: 'outdoor' }),
    id: 'c1',
  }
  const fileEvent = (over: Partial<EventItem>): EventItem => ({
    ...customToEventItem(row),
    id: 'f1',
    source: 'mart',
    sources: ['mart'],
    image: null,
    ...over,
  })

  it('maps to a manual, home-ring record', () => {
    const e = customToEventItem(row)
    expect(e).toMatchObject({
      id: 'c1',
      source: 'manual',
      sources: ['manual'],
      ring: 'home',
      area: 'trentino',
      category: 'outdoor',
      tags: ['outdoor'],
      venue: 'Block3',
      summary: 'Gara sociale',
      description: 'Gara sociale\nIscrizioni in palestra',
      image: JPEG,
      occurrences: 1,
    })
    expect(localDay(e.start)).toBe('2026-10-09')
    expect(isOver(e, NOW)).toBe(false)
  })

  it('city -> area, unknown towns fall back to Trentino', () => {
    expect(cityArea('Bolzano')).toBe('alto-adige')
    expect(cityArea(' verona ')).toBe('verona-garda')
    expect(cityArea('Salò')).toBe('lombardia')
    expect(cityArea('Arco')).toBe('trentino')
    expect(cityArea('Nowhere')).toBe('trentino')
  })

  it('merges after the file, drops kids from the file only, works with no file', () => {
    const kids = fileEvent({ id: 'k', tags: ['kids'] })
    const keep = fileEvent({ id: 'f1' })
    const mineKids = { ...row, id: 'c2', note: 'kids' }
    const out = mergeEvents([kids, keep], [row, mineKids], isKidsEvent)
    expect(out.map((e) => e.id)).toEqual(['f1', 'c1', 'c2'])
    expect(mergeEvents([], [row], isKidsEvent).map((e) => e.id)).toEqual(['c1'])
  })

  it('an id clash keeps the hand-added event', () => {
    const out = mergeEvents([fileEvent({ id: 'c1', title: 'From file' })], [row], isKidsEvent)
    expect(out).toHaveLength(1)
    expect(out[0]?.source).toBe('manual')
  })
})

describe('parsePrefill', () => {
  const p = (q: string) => parsePrefill(new URLSearchParams(q))

  it('needs add=1', () => {
    expect(p('title=x')).toBeNull()
    expect(p('add=0&title=x')).toBeNull()
    expect(p('add=1')).toEqual({})
  })

  it('reads and validates every field', () => {
    expect(
      p('add=1&title=%20Gara%20&url=https%3A%2F%2Fwww.instagram.com%2Fp%2Fabc%2F&date=2026-10-09&time=20:30&venue=Block3&city=Trento&note=hi&category=outdoor'),
    ).toEqual({
      title: 'Gara',
      url: 'https://www.instagram.com/p/abc/',
      date: '2026-10-09',
      time: '20:30',
      venue: 'Block3',
      city: 'Trento',
      note: 'hi',
      category: 'outdoor',
    })
  })

  it('drops unsafe or malformed values', () => {
    expect(p('add=1&url=javascript:alert(1)&date=2026-13-01&time=8pm&category=nope')).toEqual({})
  })

  it('caps long values', () => {
    const out = p(`add=1&title=${'t'.repeat(MAX_TITLE_LENGTH + 10)}&text=${'n'.repeat(MAX_NOTE_LENGTH + 10)}`)
    expect(out?.title).toHaveLength(MAX_TITLE_LENGTH)
    expect(out?.note).toHaveLength(MAX_NOTE_LENGTH)
  })

  it('`text` is the note, and a link inside it fills the url', () => {
    expect(p('add=1&text=Look%20https%3A%2F%2Finstagram.com%2Fp%2Fz%20!')).toEqual({
      note: 'Look https://instagram.com/p/z !',
      url: 'https://instagram.com/p/z',
    })
  })
})

describe('fitWithin', () => {
  it('scales the long side down to max, never up', () => {
    expect(fitWithin(4032, 3024, 800)).toEqual({ width: 800, height: 600 })
    expect(fitWithin(1080, 1920, 800)).toEqual({ width: 450, height: 800 })
    expect(fitWithin(640, 480, 800)).toEqual({ width: 640, height: 480 })
  })
})

describe('isExpiredCustomEvent', () => {
  const now = new Date(2026, 9, 31, 12).getTime() // 31 Oct 2026, local noon
  it('keeps events up to 14 days after their last day', () => {
    expect(isExpiredCustomEvent({ start: '2026-10-17T00:00:00+02:00', end: null }, now)).toBe(false)
    expect(isExpiredCustomEvent({ start: '2026-10-18T20:00:00+02:00', end: null }, now)).toBe(false)
  })
  it('expires an event past the cutoff, judging by its end when it has one', () => {
    expect(isExpiredCustomEvent({ start: '2026-10-16T20:00:00+02:00', end: null }, now)).toBe(true)
    expect(isExpiredCustomEvent({ start: '2026-10-10T00:00:00+02:00', end: '2026-10-20T00:00:00+02:00' }, now)).toBe(false)
  })
  it('never expires a future event or a malformed date', () => {
    expect(isExpiredCustomEvent({ start: '2027-01-01T00:00:00+01:00', end: null }, now)).toBe(false)
    expect(isExpiredCustomEvent({ start: 'bad', end: null }, now)).toBe(false)
  })
})
