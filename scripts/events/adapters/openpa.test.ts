import { describe, expect, it } from 'vitest'
import type { AdapterContext } from '../types.ts'
import { openpa } from './openpa.ts'

const NOW = Date.parse('2026-10-08T10:00:00Z')
const ctx = (json: (url: string) => unknown, horizonDays = 30): AdapterContext =>
  ({
    now: NOW,
    horizonDays,
    fetchJson: async (url: string) => json(url),
  }) as unknown as AdapterContext

const cal = openpa({
  id: 'c',
  name: 'C',
  host: 'cal.test',
  mode: 'calendar',
  classes: '[event]',
  city: 'Trento',
})

describe('openpa calendar mode', () => {
  it('turns the exclusive all-day end into an inclusive last day', async () => {
    const out = await cal.run(
      ctx(() => [
        {
          id: 7,
          title: 'Mostra',
          allDay: true,
          start: '2026-10-10',
          end: '2026-10-13',
          extendedProps: { location: '/ev/7' },
        },
        {
          id: 8,
          title: 'Un giorno',
          allDay: true,
          start: '2026-10-11',
          end: '2026-10-12',
        },
        { id: 9, title: 'Senza fine', start: '2026-10-14', end: null },
      ]),
    )
    expect(out.map((e) => [e.nativeId, e.allDay, e.start, e.end])).toEqual([
      ['7@2026-10-10T00:00:00+02:00', true, '2026-10-10T00:00:00+02:00', '2026-10-12T00:00:00+02:00'],
      ['8@2026-10-11T00:00:00+02:00', true, '2026-10-11T00:00:00+02:00', '2026-10-11T00:00:00+02:00'],
      ['9@2026-10-14T00:00:00+02:00', true, '2026-10-14T00:00:00+02:00', '2026-10-14T00:00:00+02:00'],
    ])
    expect(out[0]).toMatchObject({
      url: 'https://cal.test/ev/7',
      seriesKey: '7',
    })
    expect(out[1]?.url).toBe('https://cal.test/openpa/object/8')
  })
  it('keeps timed events as they are and dedupes occurrences repeated across 30-day chunks', async () => {
    const calls: string[] = []
    const out = await cal.run(
      ctx((url) => {
        calls.push(url)
        return [
          {
            id: 1,
            title: "L''Ora",
            start: '2026-10-28T20:30:00+01:00',
            end: '2026-10-28T22:00:00+01:00',
          },
        ]
      }, 60),
    )
    expect(calls).toHaveLength(2)
    expect(calls[0]).toContain('start=2026-10-08&end=2026-11-07')
    expect(calls[1]).toContain('start=2026-11-07&end=2026-12-07')
    expect(out).toHaveLength(1)
    expect(out[0]).toMatchObject({
      title: 'L"Ora',
      allDay: false,
      start: '2026-10-28T20:30:00+01:00',
    })
  })
  it('reads venue, town and tags out of the nested content, honours skipTitle and titlePrefix', async () => {
    const a = openpa({
      id: 'c',
      name: 'C',
      host: 'cal.test',
      mode: 'calendar',
      classes: '[event]',
      city: 'Trento',
      titlePrefix: /^Rassegna:\s*/,
      skipTitle: /ANNULLATO/,
    })
    const out = await a.run(
      ctx(() => [
        {
          id: 1,
          title: 'Rassegna: Concerto',
          start: '2026-10-12T21:00:00+02:00',
          content: {
            data: {
              'ita-IT': {
                takes_place_in: [
                  {
                    name: { 'ita-IT': 'Teatro Zandonai' },
                    address: 'Via Dante 1, 38068 Rovereto TN',
                  },
                ],
                has_public_event_typology: [{ name: 'Musica' }],
                abstract: '<p>Sera di musica</p>',
              },
            },
          },
        },
        {
          id: 2,
          title: 'Serata - ANNULLATO',
          start: '2026-10-12T21:00:00+02:00',
        },
      ]),
    )
    expect(out).toHaveLength(1)
    expect(out[0]).toMatchObject({
      title: 'Concerto',
      venue: 'Teatro Zandonai',
      city: 'Rovereto',
      tagText: 'Musica',
      summary: 'Sera di musica',
    })
  })
  it('throws on an error object instead of a list', async () => {
    await expect(cal.run(ctx(() => ({ error_message: 'nope' })))).rejects.toThrow(/nope/)
  })
})

describe('openpa search mode', () => {
  const s = openpa({
    id: 's',
    name: 'S',
    host: 'search.test',
    mode: 'search',
    classes: '[event]',
    city: 'Rovereto',
  })
  const hit = (id: number, from: string, to: string, extra: Record<string, unknown> = {}) => ({
    metadata: { id, mainNodeId: id + 100, name: { 'ita-IT': `Ev ${id}` } },
    data: { 'ita-IT': { from_time: from, to_time: to, ...extra } },
  })
  it('treats midnight-to-midnight as all-day and keeps the end day', async () => {
    const out = await s.run(
      ctx(() => ({
        totalCount: 2,
        searchHits: [
          hit(1, '2026-10-10T00:00:00+02:00', '2026-10-12T00:00:00+02:00'),
          hit(2, '2026-10-10T20:00:00+02:00', '2026-10-10T22:00:00+02:00'),
        ],
      })),
    )
    expect(out[0]).toMatchObject({
      allDay: true,
      start: '2026-10-10T00:00:00+02:00',
      end: '2026-10-12T00:00:00+02:00',
    })
    expect(out[0]?.url).toBe('https://search.test/content/view/full/101')
    expect(out[1]).toMatchObject({
      allDay: false,
      end: '2026-10-10T22:00:00+02:00',
    })
  })
  it('takes a single-day all-day event time from the free text', async () => {
    const out = await s.run(
      ctx(() => ({
        totalCount: 1,
        searchHits: [
          hit(3, '2026-10-10T00:00:00+02:00', '2026-10-10T23:59:00+02:00', {
            orario_svolgimento: '<p>ore 20.30</p>',
          }),
        ],
      })),
    )
    expect(out[0]).toMatchObject({
      allDay: false,
      start: '2026-10-10T20:30:00+02:00',
      end: null,
    })
  })
  it('does not guess a time from a schedule', async () => {
    const out = await s.run(
      ctx(() => ({
        totalCount: 1,
        searchHits: [
          hit(4, '2026-10-10T00:00:00+02:00', '2026-10-10T00:00:00+02:00', {
            orario_svolgimento: 'ore 11.30, ore 14.30',
          }),
        ],
      })),
    )
    expect(out[0]?.allDay).toBe(true)
  })
  it('surfaces an API error message', async () => {
    await expect(s.run(ctx(() => ({ error_message: 'bad query' })))).rejects.toThrow(/bad query/)
  })
})
