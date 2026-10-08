import { describe, expect, it } from 'vitest'
import type { AdapterContext } from '../types.ts'
import { padova } from './padova.ts'

const NOW = Date.parse('2026-10-08T10:00:00Z')
const ctx = (json: (url: string) => unknown): AdapterContext =>
  ({
    now: NOW,
    horizonDays: 90,
    fetchJson: async (url: string) => json(url),
  }) as unknown as AdapterContext

describe('padova occurrences', () => {
  it('guesses all-day for local 00:00 to 23:59 (UTC values) and keeps timed ones', async () => {
    const out = await padova.run(
      ctx(() => ({
        data: [
          {
            drupal_internal__nid: 5,
            title: ' Mostra grande ',
            path: { alias: '/mostra' },
            event_type: [{ name: 'Mostre' }],
            event_place: [{ title: 'Città di Padova' }, { title: 'Palazzo Zabarella' }],
            event_date: [
              // 2026-10-10 00:00 Rome (+02:00) to 2026-10-12 23:59 Rome
              {
                value: '2026-10-09T22:00:00+00:00',
                end_value: '2026-10-12T21:59:00+00:00',
              },
              // timed: 19:00 to 21:00 Rome
              {
                value: '2026-10-15T17:00:00+00:00',
                end_value: '2026-10-15T19:00:00+00:00',
              },
              // midnight start but a real end time: not all-day
              {
                value: '2026-10-19T22:00:00+00:00',
                end_value: '2026-10-20T08:00:00+00:00',
              },
              { value: 'garbage' },
            ],
          },
          { drupal_internal__nid: 6, title: '', event_date: [] },
        ],
      })),
    )
    expect(out).toHaveLength(3)
    expect(out[0]).toMatchObject({
      nativeId: '5@2026-10-10T00:00:00+02:00',
      seriesKey: '5',
      title: 'Mostra grande',
      allDay: true,
      start: '2026-10-10T00:00:00+02:00',
      end: '2026-10-12T00:00:00+02:00',
      venue: 'Palazzo Zabarella',
      city: 'Padova',
      url: 'https://www.comune.padova.it/mostra',
      categoryHint: 'exhibitions',
    })
    expect(out[1]).toMatchObject({
      allDay: false,
      start: '2026-10-15T19:00:00+02:00',
      end: '2026-10-15T21:00:00+02:00',
    })
    expect(out[2]).toMatchObject({
      allDay: false,
      start: '2026-10-20T00:00:00+02:00',
    })
  })
  it('treats a single midnight date without an end as all-day, and falls back to /node/ urls', async () => {
    const [e] = await padova.run(
      ctx(() => ({
        data: [
          {
            drupal_internal__nid: 9,
            title: 'X',
            event_date: [{ value: '2026-10-09T22:00:00+00:00' }],
          },
        ],
      })),
    )
    expect(e).toMatchObject({
      allDay: true,
      end: '2026-10-10T00:00:00+02:00',
      url: 'https://www.comune.padova.it/node/9',
    })
  })
  it('follows links.next over https and sends unix-second filters', async () => {
    const urls: string[] = []
    await padova.run(
      ctx((url) => {
        urls.push(url)
        return urls.length === 1
          ? {
              data: [],
              links: {
                next: { href: 'http://www.comune.padova.it/api/events?page=2' },
              },
            }
          : { data: [] }
      }),
    )
    expect(urls[1]).toBe('https://www.comune.padova.it/api/events?page=2')
    const now = Math.floor(NOW / 1000)
    expect(decodeURIComponent(urls[0] ?? '')).toContain(`[value]=${now + 90 * 86_400}`)
  })
})
