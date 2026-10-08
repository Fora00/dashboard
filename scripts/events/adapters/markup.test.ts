import { describe, expect, it } from 'vitest'
import type { AdapterContext } from '../types.ts'
import { tcvi } from './tcvi.ts'
import { padova } from './padova.ts'
import { muse } from './muse.ts'
import { filarmonica } from './filarmonica.ts'

const NOW = Date.parse('2026-10-08T10:00:00Z')

const ctx = (text: (url: string) => string, json: (url: string) => unknown = () => ({})): AdapterContext =>
  ({
    now: NOW,
    horizonDays: 90,
    fetchText: async (url: string) => ({ status: 200, url, text: text(url) }),
    fetchJson: async (url: string) => json(url),
  }) as unknown as AdapterContext

describe('tcvi markup check', () => {
  it('throws when the page has no event cards', async () => {
    await expect(tcvi.run(ctx(() => '<html>maintenance</html>'))).rejects.toThrow(/markup changed/)
  })
  it('throws when cards exist but none parse', async () => {
    const html = '<body><div data-month="ottobre-2026" data-type="prosa" class="uk-event"><p>new layout</p></div>'
    await expect(tcvi.run(ctx(() => html))).rejects.toThrow(/none parsed/)
  })
  it('accepts a page whose only cards are skipped types', async () => {
    const html = '<body><div data-month="ottobre-2026" data-type="family-show" class="uk-event"></div>'
    await expect(tcvi.run(ctx(() => html))).resolves.toEqual([])
  })
})

describe('padova markup check', () => {
  it('throws when the API answer has no data array', async () => {
    await expect(
      padova.run(
        ctx(
          () => '',
          () => ({ errors: [] }),
        ),
      ),
    ).rejects.toThrow(/API changed/)
  })
  it('accepts an empty data array', async () => {
    await expect(
      padova.run(
        ctx(
          () => '',
          () => ({ data: [] }),
        ),
      ),
    ).resolves.toEqual([])
  })
})

describe('muse markup check', () => {
  const calendar =
    '<article><a href="https://www.muse.it/eventi/a/" title="A">x</a></article>' +
    '<article><a href="https://www.muse.it/eventi/b/" title="B">x</a></article>'
  const failing = (): AdapterContext =>
    ({
      now: NOW,
      horizonDays: 90,
      fetchText: async (url: string) => {
        if (url.includes('/eventi/a/') || url.includes('/eventi/b/')) throw new Error('HTTP 500')
        return { status: 200, url, text: calendar }
      },
      fetchJson: async () => [],
    }) as unknown as AdapterContext
  it('throws when every event page fails', async () => {
    await expect(muse.run(failing())).rejects.toThrow(/all 2 event pages failed/)
  })
  it('skips a single bad page', async () => {
    const c = {
      ...failing(),
      fetchText: async (url: string) => {
        if (url.includes('/eventi/a/')) throw new Error('HTTP 500')
        return {
          status: 200,
          url,
          text: url.includes('/eventi/b/') ? '<aside></aside>' : calendar,
        }
      },
    } as unknown as AdapterContext
    await expect(muse.run(c)).resolves.toEqual([])
  })
})

describe('filarmonica markup check', () => {
  const feed = (post: string) => `<rss><channel></channel></rss>${post}`
  it('throws when the iCal export is not iCal', async () => {
    const c = {
      now: NOW,
      horizonDays: 90,
      fetchText: async (url: string) => ({
        status: 200,
        url,
        text: url.includes('method=ical') ? '<html>login</html>' : feed(''),
      }),
      fetchJson: async () => [
        {
          id: 7,
          date: '2026-09-01T00:00:00',
          link: 'https://x/',
          title: { rendered: 'Concerto 20 ottobre' },
        },
      ],
    } as unknown as AdapterContext
    await expect(filarmonica.run(c)).rejects.toThrow(/not iCal/)
  })
})
