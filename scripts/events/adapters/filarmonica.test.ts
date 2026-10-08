import { describe, expect, it } from 'vitest'
import type { AdapterContext } from '../types.ts'
import { cleanTitle, filarmonica } from './filarmonica.ts'

const NOW = Date.parse('2026-10-08T10:00:00Z')

const item = (post: string, fields: Record<string, string>) =>
  `<item><title>${fields.title ?? 'T'}</title><link>https://www.filarmonicarovereto.it/events/e${post}/</link>` +
  `<guid isPermaLink="false">https://www.filarmonicarovereto.it/?post_type=mec-events&#038;p=${post}</guid>` +
  `<description><![CDATA[<img src="/img/${post}.jpg">]]></description>` +
  `<mec:startDate>${fields.sd ?? ''}</mec:startDate><mec:endDate>${fields.ed ?? ''}</mec:endDate>` +
  `<mec:startHour>${fields.sh ?? ''}</mec:startHour><mec:endHour>${fields.eh ?? ''}</mec:endHour>` +
  `<mec:location>${fields.loc ?? 'Corso Bettini 1, 38068 Rovereto TN'}</mec:location>` +
  `<mec:category>${fields.cat ?? 'Stagione dei Concerti'}</mec:category>` +
  `<content:encoded><![CDATA[<p>Programma [vc_row]</p>]]></content:encoded></item>`

const rss = (...items: string[]) => `<rss><channel>${items.join('')}</channel></rss>`

const venuePage = '<script>"@type":"Place","name":"Auditorium Melotti"</script>'

function ctx(feed: string, rest: unknown[], ics: Record<string, string> = {}): AdapterContext {
  return {
    now: NOW,
    horizonDays: 90,
    fetchText: async (url: string) => {
      if (url.endsWith('/events/feed/')) return { status: 200, url, text: feed }
      const id = url.match(/method=ical&id=(\d+)/)?.[1]
      if (id) return { status: 200, url, text: ics[id] ?? '' }
      return { status: 200, url, text: venuePage }
    },
    fetchJson: async () => rest,
  } as unknown as AdapterContext
}

describe('filarmonica cleanTitle', () => {
  it('strips the date label and the Preludio prefix', () => {
    expect(cleanTitle('Preludio di Stagione &#8211; Camera 02 | 03.10.2026')).toBe('Camera 02')
    expect(cleanTitle('Risonanze – Villa Lagarina| 29-30.01.2026')).toBe('Risonanze – Villa Lagarina')
  })
})

describe('filarmonica RSS', () => {
  it('reads timed and all-day items, skips school concerts, resolves the venue name', async () => {
    const out = await filarmonica.run(
      ctx(
        rss(
          item('1', {
            title: 'Concerto',
            sd: '2026-10-20',
            sh: '20:30',
            eh: '22:00',
            ed: '2026-10-20',
          }),
          item('2', {
            title: 'Giornata',
            sd: '2026-10-22',
            ed: '2026-10-23',
            loc: 'Piazza, Villa Lagarina',
          }),
          item('3', {
            title: 'Scuole',
            sd: '2026-10-21',
            sh: '10:00',
            cat: 'Concerti per le scuole',
          }),
        ),
        [],
      ),
    )
    expect(out).toHaveLength(2)
    expect(out[0]).toMatchObject({
      nativeId: '1@2026-10-20',
      allDay: false,
      start: '2026-10-20T20:30:00+02:00',
      end: '2026-10-20T22:00:00+02:00',
      city: 'Rovereto',
      venue: 'Auditorium Melotti',
      image: 'https://www.filarmonicarovereto.it/img/1.jpg',
    })
    expect(out[0]?.description).not.toContain('[vc_row]')
    expect(out[1]).toMatchObject({
      allDay: true,
      start: '2026-10-22T00:00:00+02:00',
      end: '2026-10-23T00:00:00+02:00',
      city: 'Villa Lagarina',
    })
  })
  it('throws when the feed is not RSS', async () => {
    await expect(filarmonica.run(ctx('<html></html>', []))).rejects.toThrow(/not RSS/)
  })
})

describe('filarmonica iCal fallback', () => {
  const ics = (body: string) => `BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\n${body}\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n`
  const post = (id: number, title: string) => ({
    id,
    date: '2026-09-01T00:00:00',
    link: `https://www.filarmonicarovereto.it/events/p${id}/`,
    title: { rendered: title },
  })

  it('reads upcoming posts missing from the RSS and drops ones outside the window', async () => {
    const out = await filarmonica.run(
      ctx(
        rss(item('1', { sd: '2026-10-20', sh: '20:30' })),
        [
          post(1, 'Già nel feed | 20.10.2026'),
          post(2, 'Dal feed ical | 25.10.2026'),
          post(3, 'Passato | 01.01.2026'),
          post(4, 'Troppo lontano | 01.06.2027'),
        ],
        {
          '2': ics(
            'UID:x\r\nSUMMARY:Ical show\r\nDTSTART;TZID=Europe/Rome:20261025T170000\r\nDTEND;TZID=Europe/Rome:20261025T223000\r\nLOCATION:Via X\\, 38068 Rovereto TN\r\nCATEGORIES:Concerti per le famiglie',
          ),
        },
      ),
    )
    expect(out.map((e) => e.nativeId).sort()).toEqual(['1@2026-10-20', '2@2026-10-25'])
    const e = out.find((x) => x.nativeId === '2@2026-10-25')
    // 5.5 hours: MEC's default end is not trusted.
    expect(e).toMatchObject({
      title: 'Ical show',
      start: '2026-10-25T17:00:00+01:00',
      end: null,
      tagText: 'Concerti per le famiglie',
    })
  })
  it('converts an exclusive all-day DTEND from the per-event iCal', async () => {
    const out = await filarmonica.run(
      ctx(rss(), [post(5, 'Festival | 25.10.2026')], {
        '5': ics('SUMMARY:Fest\r\nDTSTART;VALUE=DATE:20261025\r\nDTEND;VALUE=DATE:20261028'),
      }),
    )
    expect(out[0]).toMatchObject({
      allDay: true,
      start: '2026-10-25T00:00:00+02:00',
      end: '2026-10-27T00:00:00+01:00',
    })
  })
  it('throws when the per-event export is not iCal', async () => {
    await expect(filarmonica.run(ctx(rss(), [post(6, 'X | 25.10.2026')], { '6': 'nope' }))).rejects.toThrow(/not iCal/)
  })
})
