import { describe, expect, it } from 'vitest'
import type { AdapterContext, Event } from './types.ts'
import { OG_MAX_REQUESTS, enrichImages, extractOgImage } from './ogimage.ts'

const PAGE = 'https://www.comune.pergine.tn.it/Eventi/Mostra'
const NOW = Date.parse('2026-10-10T10:00:00Z')

describe('extractOgImage', () => {
  it('reads og:image in either attribute order, resolves relative URLs and decodes entities', () => {
    expect(extractOgImage('<meta property="og:image" content="https://x.it/a.jpg?a=1&amp;b=2" />', PAGE)).toBe('https://x.it/a.jpg?a=1&b=2')
    expect(extractOgImage('<meta content="/var/img.jpg" property="og:image">', PAGE)).toBe('https://www.comune.pergine.tn.it/var/img.jpg')
  })
  it('ignores a missing tag and generic logos / backgrounds', () => {
    expect(extractOgImage('<meta property="og:title" content="x">', PAGE)).toBeNull()
    expect(extractOgImage('<meta property="og:image" content="./assets/images/logo-social.jpeg">', PAGE)).toBeNull()
    expect(extractOgImage('<meta property="og:image" content="https://x.it/sfondo-ocra_opengraph.jpg">', PAGE)).toBeNull()
  })
})

const ev = (id: string, over: Partial<Event> = {}): Event =>
  ({ id, source: 'pergine', url: `https://p.it/${id}`, image: null, ...over }) as Event

const ctxFor = (pages: Record<string, string>, calls: string[] = []): AdapterContext =>
  ({
    fetchText: async (url: string) => {
      calls.push(url)
      const text = pages[url]
      if (text === undefined) throw new Error('HTTP 404')
      return { status: 200, url, text }
    },
  }) as unknown as AdapterContext

describe('enrichImages', () => {
  it('fills from the page, carries over previous images and remembers misses', async () => {
    const calls: string[] = []
    const events = [ev('a'), ev('b'), ev('c'), ev('d', { source: 'bolzano' }), ev('e', { image: 'https://x.it/own.jpg' })]
    const previous = { events: [ev('b', { image: 'https://x.it/old.jpg' })] }
    const ctx = ctxFor({ 'https://p.it/a': '<meta property="og:image" content="https://x.it/a.jpg">', 'https://p.it/c': '<p>none</p>' }, calls)
    const r = await enrichImages(events, previous, ctx, NOW)
    expect(events.map((e) => e.image)).toEqual(['https://x.it/a.jpg', 'https://x.it/old.jpg', null, null, 'https://x.it/own.jpg'])
    expect(calls).toEqual(['https://p.it/a', 'https://p.it/c']) // b carried over, d not an og source
    expect(r.filled).toBe(2)
    expect(r.misses).toEqual({ c: NOW })
  })
  it('does not retry a recent miss, but does after a week', async () => {
    const calls: string[] = []
    const ctx = ctxFor({}, calls)
    await enrichImages([ev('c')], { events: [], ogMisses: { c: NOW - 86_400_000 } }, ctx, NOW)
    expect(calls).toEqual([])
    await enrichImages([ev('c')], { events: [], ogMisses: { c: NOW - 8 * 86_400_000 } }, ctx, NOW)
    expect(calls).toEqual(['https://p.it/c'])
  })
  it('caps the pages fetched per run and drops misses of vanished events', async () => {
    const calls: string[] = []
    const many = Array.from({ length: OG_MAX_REQUESTS + 5 }, (_, i) => ev(`x${i}`))
    const r = await enrichImages(many, { events: [], ogMisses: { gone: NOW } }, ctxFor({}, calls), NOW)
    expect(calls.length).toBe(OG_MAX_REQUESTS)
    expect(r.misses.gone).toBeUndefined()
  })
  it('takes sources in turns so a slow one cannot starve the others', async () => {
    const calls: string[] = []
    const events = [ev('a1', { source: 'cultura-trentino' }), ev('a2', { source: 'cultura-trentino' }), ev('b1'), ev('b2')]
    await enrichImages(events, null, ctxFor({}, calls), NOW, { maxMs: 60_000 })
    expect(calls).toEqual(['https://p.it/a1', 'https://p.it/b1', 'https://p.it/a2', 'https://p.it/b2'])
  })
})
