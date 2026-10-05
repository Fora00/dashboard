// Optional product lookup against Open Food Facts (https://world.openfoodfacts.org,
// open data under the ODbL: show the attribution wherever results appear).
// Public, no key, CORS open. It only ever HELPS: the diary works fully offline
// and signed out without it, and every failure is a message, never a crash.
//
// Search by name uses cgi/search.pl (the v2 search endpoint is often 503);
// a 8-14 digit query is a barcode and uses the product endpoint. Search is
// rate-limited by the service (~10/min): call it from an explicit button, not
// while typing.

export interface Per100 {
  kcal: number
  proteinG: number | null
  carbsG: number | null
  fatG: number | null
}

export interface Product {
  code: string
  name: string
  brand: string
  per100: Per100
}

export type LookupErrorKind = 'offline' | 'unavailable' | 'bad'

export class LookupError extends Error {
  kind: LookupErrorKind
  constructor(kind: LookupErrorKind, message: string) {
    super(message)
    this.kind = kind
  }
}

const BASE = 'https://world.openfoodfacts.org'
const FIELDS = 'code,product_name,brands,nutriments'

export const isBarcode = (q: string) => /^\d{8,14}$/.test(q.trim())

const num = (v: unknown): number | null => {
  const n = typeof v === 'string' ? Number(v.replace(',', '.')) : v
  return typeof n === 'number' && Number.isFinite(n) && n >= 0 ? n : null
}

/** One raw OFF product → Product, or null when it has no name or no usable energy value. */
export function parseProduct(raw: unknown): Product | null {
  if (!raw || typeof raw !== 'object') return null
  const p = raw as { code?: unknown; product_name?: unknown; brands?: unknown; nutriments?: Record<string, unknown> }
  const name = typeof p.product_name === 'string' ? p.product_name.replace(/\s+/g, ' ').trim() : ''
  const n = p.nutriments
  if (!name || !n || typeof n !== 'object') return null
  // Prefer kcal; fall back to kJ (energy_100g is kJ on OFF).
  const kj = num(n['energy-kj_100g']) ?? num(n['energy_100g'])
  const kcal = num(n['energy-kcal_100g']) ?? (kj === null ? null : kj / 4.184)
  if (kcal === null) return null
  const brand = typeof p.brands === 'string' ? (p.brands.split(',')[0] ?? '').trim() : ''
  return {
    code: typeof p.code === 'string' ? p.code : '',
    name,
    brand,
    per100: { kcal: Math.round(kcal), proteinG: num(n['proteins_100g']), carbsG: num(n['carbohydrates_100g']), fatG: num(n['fat_100g']) },
  }
}

/** The values for `grams` (100 g when empty), rounded to whole numbers. Missing macros stay null. */
export function scaleProduct(p: Product, grams: number | null) {
  const g = grams && grams > 0 ? grams : 100
  const k = g / 100
  const r = (v: number | null) => (v === null ? null : Math.round(v * k))
  return { grams: g, kcal: Math.round(p.per100.kcal * k), proteinG: r(p.per100.proteinG), carbsG: r(p.per100.carbsG), fatG: r(p.per100.fatG) }
}

/** Look a product up by barcode or search by name. Throws LookupError. */
export async function lookupProducts(query: string, fetchImpl: typeof fetch = fetch, signal?: AbortSignal): Promise<Product[]> {
  const q = query.trim()
  if (!q) return []
  const url = isBarcode(q)
    ? `${BASE}/api/v2/product/${encodeURIComponent(q)}.json?fields=${FIELDS}`
    : `${BASE}/cgi/search.pl?search_terms=${encodeURIComponent(q)}&search_simple=1&action=process&json=1&page_size=8&lc=it&sort_by=unique_scans_n&fields=${FIELDS}`
  let res: Response
  try {
    res = await fetchImpl(url, signal ? { signal } : {})
  } catch (e) {
    if ((e as Error).name === 'AbortError') throw e
    throw new LookupError('offline', 'Cannot reach Open Food Facts (offline?).')
  }
  if (res.status === 404 && isBarcode(q)) return []
  if (res.status === 429 || res.status >= 500) throw new LookupError('unavailable', 'Open Food Facts is busy: try again in a minute.')
  if (!res.ok) throw new LookupError('bad', `Open Food Facts answered ${res.status}.`)
  let data: { product?: unknown; products?: unknown }
  try {
    data = (await res.json()) as typeof data
  } catch {
    throw new LookupError('bad', 'Open Food Facts sent an unreadable answer.')
  }
  const raws = isBarcode(q) ? (data.product ? [data.product] : []) : Array.isArray(data.products) ? data.products : []
  return raws.map(parseProduct).filter((p): p is Product => p !== null).slice(0, 8)
}
