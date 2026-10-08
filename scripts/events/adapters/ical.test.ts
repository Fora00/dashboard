import { describe, expect, it } from 'vitest'
import type { AdapterContext } from '../types.ts'
import { ical, place } from './ical.ts'

const NOW = Date.parse('2026-10-08T10:00:00Z')
const ctx = (text: string): AdapterContext =>
  ({
    now: NOW,
    horizonDays: 90,
    fetchText: async (url: string) => ({ status: 200, url, text }),
  }) as unknown as AdapterContext

const adapter = ical({
  id: 't',
  name: 'T',
  feed: 'https://x.test/e.ics',
  city: 'Trento',
  home: 'https://x.test/',
})

describe('ical place()', () => {
  it('takes the venue from the first part and the town before the region tail', () => {
    expect(place('Magman, 9 Via San Bernardino, Trento, Trentino-Alto Adige, 38122, Italy', 'Rovereto')).toEqual({
      venue: 'Magman',
      city: 'Trento',
    })
  })
  it('falls back to the configured town for a street or a lone name', () => {
    expect(place('Teatro Sociale, Via Garibaldi', 'Trento')).toEqual({
      venue: 'Teatro Sociale',
      city: 'Trento',
    })
    expect(place('Sala Conferenze', 'Rovereto')).toEqual({
      venue: 'Sala Conferenze',
      city: 'Rovereto',
    })
  })
  it('skips postcodes and country, and works with an empty location', () => {
    expect(place('Auditorium, Arco, 38062, Italia', 'Trento').city).toBe('Arco')
    expect(place('', 'Trento')).toEqual({ venue: null, city: 'Trento' })
  })
})

const vcal = (...events: string[]) => `BEGIN:VCALENDAR\r\nVERSION:2.0\r\n${events.join('\r\n')}\r\nEND:VCALENDAR\r\n`

describe('ical adapter', () => {
  it('converts an exclusive all-day DTEND to the inclusive last day', async () => {
    const [e] = await adapter.run(
      ctx(
        vcal(
          'BEGIN:VEVENT\r\nUID:u1\r\nSUMMARY:Festa\\, grande\r\nDTSTART;VALUE=DATE:20261010\r\nDTEND;VALUE=DATE:20261013\r\nLOCATION:Piazza Duomo\\, Trento\r\nEND:VEVENT',
        ),
      ),
    )
    expect(e).toMatchObject({
      nativeId: 'u1',
      title: 'Festa, grande',
      allDay: true,
      start: '2026-10-10T00:00:00+02:00',
      end: '2026-10-12T00:00:00+02:00',
    })
  })
  it('keeps a one-day all-day event on that day, with or without DTEND', async () => {
    const out = await adapter.run(
      ctx(
        vcal(
          'BEGIN:VEVENT\r\nUID:a\r\nSUMMARY:A\r\nDTSTART;VALUE=DATE:20261010\r\nDTEND;VALUE=DATE:20261011\r\nEND:VEVENT',
          'BEGIN:VEVENT\r\nUID:b\r\nSUMMARY:B\r\nDTSTART;VALUE=DATE:20261010\r\nEND:VEVENT',
        ),
      ),
    )
    expect(out.map((e) => e.end)).toEqual(['2026-10-10T00:00:00+02:00', '2026-10-10T00:00:00+02:00'])
  })
  it('reads timed events (UTC and TZID) and falls back to url@start for the id', async () => {
    const out = await adapter.run(
      ctx(
        vcal(
          'BEGIN:VEVENT\r\nSUMMARY:Utc\r\nDTSTART:20261010T180000Z\r\nDTEND:20261010T200000Z\r\nURL:https://x.test/ev\r\nEND:VEVENT',
          'BEGIN:VEVENT\r\nUID:z\r\nSUMMARY:Tz\r\nDTSTART;TZID=Europe/Rome:20261010T203000\r\nEND:VEVENT',
        ),
      ),
    )
    expect(out[0]).toMatchObject({
      nativeId: 'https://x.test/ev@2026-10-10T20:00:00+02:00',
      allDay: false,
      end: '2026-10-10T22:00:00+02:00',
      city: 'Trento',
      venue: null,
    })
    expect(out[1]).toMatchObject({
      start: '2026-10-10T20:30:00+02:00',
      end: null,
      url: 'https://x.test/',
    })
  })
  it('treats an empty body as 0 events and a non-iCal body as an error', async () => {
    await expect(adapter.run(ctx('  '))).resolves.toEqual([])
    await expect(adapter.run(ctx('<html></html>'))).rejects.toThrow(/not iCalendar/)
  })
})
