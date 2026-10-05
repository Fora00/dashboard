import { describe, expect, it } from 'vitest'
import { LookupError, isBarcode, lookupProducts, parseProduct, scaleProduct } from './openFoodFacts'

const json = (body: unknown, status = 200) => Promise.resolve(new Response(JSON.stringify(body), { status }))
const fakeFetch = (impl: (url: string) => Promise<Response>) => ((url: string) => impl(url)) as unknown as typeof fetch

const nutella = { code: '3017620422003', product_name: ' Nutella ', brands: 'Nutella, Ferrero', nutriments: { 'energy-kcal_100g': 539, proteins_100g: 6.3, carbohydrates_100g: 57.5, fat_100g: 30.9 } }

describe('parseProduct', () => {
  it('reads name, first brand and per-100g values', () => {
    expect(parseProduct(nutella)).toEqual({ code: '3017620422003', name: 'Nutella', brand: 'Nutella', per100: { kcal: 539, proteinG: 6.3, carbsG: 57.5, fatG: 30.9 } })
  })
  it('falls back to kJ and keeps missing macros null', () => {
    const p = parseProduct({ product_name: 'X', nutriments: { 'energy_100g': 418.4 } })
    expect(p?.per100).toEqual({ kcal: 100, proteinG: null, carbsG: null, fatG: null })
  })
  it('skips products without a name or any energy value', () => {
    expect(parseProduct({ product_name: '', nutriments: { 'energy-kcal_100g': 10 } })).toBeNull()
    expect(parseProduct({ product_name: 'X', nutriments: {} })).toBeNull()
    expect(parseProduct({ product_name: 'X', nutriments: { 'energy-kcal_100g': -4 } })).toBeNull()
    expect(parseProduct(null)).toBeNull()
  })
  it('accepts numeric strings', () => {
    expect(parseProduct({ product_name: 'X', nutriments: { 'energy-kcal_100g': '120,5' } })?.per100.kcal).toBe(121)
  })
})

describe('scaleProduct', () => {
  const p = parseProduct(nutella)!
  it('scales to grams, or to 100 g when empty', () => {
    expect(scaleProduct(p, 20)).toEqual({ grams: 20, kcal: 108, proteinG: 1, carbsG: 12, fatG: 6 })
    expect(scaleProduct(p, null).grams).toBe(100)
    expect(scaleProduct(parseProduct({ product_name: 'X', nutriments: { 'energy-kcal_100g': 50 } })!, 200)).toEqual({ grams: 200, kcal: 100, proteinG: null, carbsG: null, fatG: null })
  })
})

describe('lookupProducts', () => {
  it('detects barcodes', () => {
    expect(isBarcode('3017620422003')).toBe(true)
    expect(isBarcode(' 8076809529433 ')).toBe(true)
    expect(isBarcode('1234')).toBe(false)
    expect(isBarcode('penne 500')).toBe(false)
  })
  it('a barcode hits the product endpoint, a name hits search', async () => {
    const urls: string[] = []
    const f = fakeFetch((url) => (urls.push(url), json(url.includes('/api/v2/product/') ? { product: nutella } : { products: [nutella, { product_name: '' }] })))
    expect(await lookupProducts('3017620422003', f)).toHaveLength(1)
    expect(await lookupProducts('nutella', f)).toHaveLength(1)
    expect(urls[0]).toContain('/api/v2/product/3017620422003.json')
    expect(urls[1]).toContain('/cgi/search.pl?search_terms=nutella')
  })
  it('an unknown barcode (404) and a blank query are just empty', async () => {
    expect(await lookupProducts('3017620422003', fakeFetch(() => json({}, 404)))).toEqual([])
    expect(await lookupProducts('   ', fakeFetch(() => { throw new Error('no call expected') }))).toEqual([])
  })
  it('maps failures to readable kinds', async () => {
    const kind = async (f: typeof fetch) => lookupProducts('nutella', f).catch((e: LookupError) => e.kind)
    expect(await kind(fakeFetch(() => Promise.reject(new TypeError('Failed to fetch'))))).toBe('offline')
    expect(await kind(fakeFetch(() => json({}, 503)))).toBe('unavailable')
    expect(await kind(fakeFetch(() => json({}, 429)))).toBe('unavailable')
    expect(await kind(fakeFetch(() => json({}, 400)))).toBe('bad')
    expect(await kind(fakeFetch(() => Promise.resolve(new Response('<html>', { status: 200 }))))).toBe('bad')
  })
})
