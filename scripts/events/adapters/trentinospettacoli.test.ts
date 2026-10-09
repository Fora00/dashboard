import { describe, expect, it } from 'vitest'
import type { AdapterContext } from '../types.ts'
import type { RawEvent } from '../types.ts'
import { categoriesByLink, foldScreenings } from './trentinospettacoli.ts'

const raw = (over: Partial<RawEvent>): RawEvent => ({
  nativeId: 'x',
  title: 'Tony',
  start: '2026-10-03T21:00:00+02:00',
  end: null,
  allDay: false,
  venue: null,
  city: 'Tione di Trento',
  url: 'https://t.it/a',
  description: '',
  categoryHint: 'cinema',
  ...over,
})

describe('foldScreenings', () => {
  it('folds the screenings of a film in one town, subtitle or not, keeping the longer title', () => {
    const out = foldScreenings([
      raw({ nativeId: 'a', title: 'Tony', start: '2026-10-11T17:00:00+02:00' }),
      raw({ nativeId: 'b', title: 'Tony – Diario di un Giovane Cuoco', start: '2026-10-03T21:00:00+02:00' }),
      raw({ nativeId: 'c', title: 'Tony', start: '2026-10-18T17:00:00+02:00' }),
    ])
    expect(out).toHaveLength(1)
    expect(out[0]).toMatchObject({
      title: 'Tony – Diario di un Giovane Cuoco',
      start: '2026-10-03T21:00:00+02:00',
      occurrences: 3,
    })
    expect(out[0]?.description).toMatch(/^Proiezioni: .*·.*·/)
  })
  it('keeps one record per town, and leaves shows and single screenings alone', () => {
    const show = raw({ nativeId: 's', title: 'Tony', categoryHint: 'theatre' })
    const out = foldScreenings([raw({ nativeId: 'a' }), raw({ nativeId: 'b', city: 'Pinzolo' }), show])
    expect(out).toHaveLength(3)
    expect(out.filter((e) => e.categoryHint === 'cinema').map((e) => e.occurrences)).toEqual([1, 1])
    expect(out.find((e) => e.city === 'Pinzolo')?.description).toBe('')
  })
})

describe('categoriesByLink', () => {
  const full = (n: number) =>
    Array.from({ length: 100 }, (_, i) => ({ link: `https://t.it/${n}-${i}`, categorie_eventi: [1] }))
  const ctx = (failAt: number, status: string) =>
    ({
      fetchJson: async (url: string) => {
        if (url.includes('categorie_eventi?')) return [{ id: 1, name: 'Cinema', slug: 'cinema' }]
        const page = Number(/[&?]page=(\d+)/.exec(url)![1])
        if (page >= failAt) throw new Error(`${status} for ${url}`)
        return full(page)
      },
    }) as unknown as AdapterContext

  it('treats the HTTP 400 past the last full page as the end, keeping what it has', async () => {
    expect((await categoriesByLink(ctx(3, 'HTTP 400'))).size).toBe(200)
  })
  it('still fails on other errors, and on a 400 for the first page', async () => {
    await expect(categoriesByLink(ctx(3, 'HTTP 500'))).rejects.toThrow(/500/)
    await expect(categoriesByLink(ctx(1, 'HTTP 400'))).rejects.toThrow(/400/)
  })
})
