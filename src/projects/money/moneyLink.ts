import { fromBase64Url, toBase64Url } from '../../lib/base64url.ts'
import { LIFE_IMPORT_BASE } from '../life/model/importLink.ts'
import { checkLines, isMonthKey, sortLines, validateLine, type MoneyLine } from './moneyCsv.ts'

// Soldi import link: scripts/life-money-link.ts parses monthly-totals.csv and
// prints `#/soldi/import?d=<base64url(deflate-raw(UTF-8 JSON))>`; /soldi/import
// decodes it, previews it against the device and writes only on a tap.
//
// Compressed because the CSV repeats category names: years of monthly totals
// deflate to a fraction of their size, so a whole history usually fits one
// link. When a payload
// is still longer than MONEY_LINK_MAX_PARAM the script splits it by whole
// years, one link per chunk. Each payload carries the month range it covers
// (`from`..`to`): importing it replaces exactly those months, so a month (or a
// category) deleted in GreenBooks disappears from the mirror too.
//
// Wire JSON: { v: 1, from: 'YYYY-MM', to: 'YYYY-MM',
//              rows: [[month, category, kind, amountCents, budgetCents | null], ...] }
// Pure apart from CompressionStream/DecompressionStream (browsers and node 22+).

export interface MoneyPayload {
  from: string
  to: string
  lines: MoneyLine[]
}

/** Longest `d` the import screen accepts (and the script prints), same as the habits link. */
export const MONEY_LINK_MAX_PARAM = 20_000
/** Uncompressed JSON cap, so a crafted link can't inflate into something huge. */
const MAX_JSON_CHARS = 2_000_000

type WireRow = [string, string, string, number, number | null]

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const out = new Blob([bytes as BlobPart]).stream().pipeThrough(stream)
  return new Uint8Array(await new Response(out).arrayBuffer())
}

export function payloadJson(p: MoneyPayload): string {
  const rows: WireRow[] = p.lines.map((l) => [l.month, l.category, l.kind, l.amount, l.budget])
  return JSON.stringify({ v: 1, from: p.from, to: p.to, rows })
}

/** The `d` parameter for a payload. */
export async function encodeMoneyParam(p: MoneyPayload): Promise<string> {
  const z = await pipe(new TextEncoder().encode(payloadJson(p)), new CompressionStream('deflate-raw'))
  return toBase64Url(z)
}

/** `${base}#/soldi/import?d=…`. */
export async function encodeMoneyLink(p: MoneyPayload, base: string = LIFE_IMPORT_BASE): Promise<string> {
  return `${base}#/soldi/import?d=${await encodeMoneyParam(p)}`
}

export type PayloadResult = { ok: true; payload: MoneyPayload } | { ok: false; errors: string[] }

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)

/** Validate the payload JSON (the link's content). Never trusts the script: every row is re-checked. */
export function parseMoneyPayloadJson(text: string): PayloadResult {
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    return { ok: false, errors: ['The import link is damaged (not JSON)'] }
  }
  if (!isObj(raw) || raw.v !== 1) return { ok: false, errors: ['Unknown import link format (expected v 1)'] }
  const errors: string[] = []
  const err = (m: string) => errors.push(m)
  if (!isMonthKey(raw.from)) err('from must be YYYY-MM')
  if (!isMonthKey(raw.to)) err('to must be YYYY-MM')
  if (isMonthKey(raw.from) && isMonthKey(raw.to) && raw.to < raw.from)
    err(`to (${raw.to}) is before from (${raw.from})`)
  const lines: MoneyLine[] = []
  if (!Array.isArray(raw.rows)) err('rows must be an array')
  else
    raw.rows.forEach((r, i) => {
      if (!Array.isArray(r) || r.length !== 5) {
        err(`rows[${i}] must be [month, category, kind, amount, budget]`)
        return
      }
      const [month, category, kind, amount, budget] = r as unknown[]
      const line = validateLine({ month, category, kind, amount, budget }, `rows[${i}]`, err)
      if (!line) return
      if (isMonthKey(raw.from) && isMonthKey(raw.to) && (line.month < raw.from || line.month > raw.to))
        err(`rows[${i}]: ${line.month} is outside ${raw.from}..${raw.to}`)
      lines.push(line)
    })
  if (errors.length === 0) checkLines(lines, err)
  if (errors.length > 0) return { ok: false, errors }
  return { ok: true, payload: { from: raw.from as string, to: raw.to as string, lines: sortLines(lines) } }
}

/** Decode a `d` parameter back to a validated payload. Never writes anything. */
export async function decodeMoneyParam(d: string): Promise<PayloadResult> {
  const bytes = fromBase64Url(d.trim())
  if (!bytes) return { ok: false, errors: ['The import link is damaged (not base64url)'] }
  if (typeof DecompressionStream === 'undefined')
    return { ok: false, errors: ['This browser cannot open compressed links (needs iOS 16.4 or later)'] }
  let text: string
  try {
    const raw = await pipe(bytes, new DecompressionStream('deflate-raw'))
    if (raw.length > MAX_JSON_CHARS) return { ok: false, errors: ['The import link is too large once unpacked'] }
    text = new TextDecoder('utf-8', { fatal: true }).decode(raw)
  } catch {
    return { ok: false, errors: ['The import link is damaged (cannot unpack it)'] }
  }
  return parseMoneyPayloadJson(text)
}

// --- Choosing what to send ----------------------------------------------------

/** The months of a payload range, inclusive. */
export function monthsBetween(from: string, to: string): string[] {
  const out: string[] = []
  let [y, m] = from.split('-').map(Number) as [number, number]
  for (;;) {
    const k = `${y}-${String(m).padStart(2, '0')}`
    if (k > to) return out
    out.push(k)
    m++
    if (m > 12) {
      m = 1
      y++
    }
  }
}

/**
 * The payloads to print for `lines` (sorted), from `since` (default: the first
 * month) to the last month. One payload when it fits in `maxParam`, else whole
 * years packed greedily, oldest first; ranges are contiguous and year-aligned
 * (clipped to the overall range), so no month falls between two links.
 * Throws when a single year alone is too large.
 */
export async function chunkPayloads(
  lines: readonly MoneyLine[],
  opts: { since?: string; maxParam?: number } = {},
): Promise<{ payload: MoneyPayload; param: string }[]> {
  const max = opts.maxParam ?? MONEY_LINK_MAX_PARAM
  const chosen = lines.filter((l) => !opts.since || l.month >= opts.since)
  if (chosen.length === 0) throw new Error(opts.since ? `No rows from ${opts.since} on` : 'No rows')
  const from = opts.since ?? chosen[0]!.month
  const to = chosen[chosen.length - 1]!.month
  const make = async (f: string, t: string) => {
    const payload: MoneyPayload = { from: f, to: t, lines: chosen.filter((l) => l.month >= f && l.month <= t) }
    return { payload, param: await encodeMoneyParam(payload) }
  }
  const whole = await make(from, to)
  if (whole.param.length <= max) return [whole]

  const years = [...new Set(chosen.map((l) => l.month.slice(0, 4)))]
  const clipFrom = (y: string) => (`${y}-01` < from ? from : `${y}-01`)
  const clipTo = (y: string) => (`${y}-12` > to ? to : `${y}-12`)
  const out: { payload: MoneyPayload; param: string }[] = []
  let start = 0
  while (start < years.length) {
    let best = await make(clipFrom(years[start]!), clipTo(years[start]!))
    if (best.param.length > max)
      throw new Error(`${years[start]} alone is too large for a link (${best.param.length} characters, max ${max})`)
    let end = start
    while (end + 1 < years.length) {
      const next = await make(clipFrom(years[start]!), clipTo(years[end + 1]!))
      if (next.param.length > max) break
      best = next
      end++
    }
    out.push(best)
    start = end + 1
  }
  // A year with no rows at all between two chunks would leave a gap: stretch each chunk to the next one's start.
  for (let i = 0; i + 1 < out.length; i++) {
    const nextFrom = out[i + 1]!.payload.from
    const prev = monthsBetween(out[i]!.payload.to, nextFrom)
    if (prev.length > 2) {
      const stretchedTo = prev[prev.length - 2]!
      out[i] = await make(out[i]!.payload.from, stretchedTo)
    }
  }
  return out
}
