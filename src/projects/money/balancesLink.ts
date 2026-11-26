import { fromBase64Url, toBase64Url } from '../../lib/base64url.ts'
import { LIFE_IMPORT_BASE } from '../life/model/importLink.ts'
import { checkBalanceLines, sortBalanceLines, validateBalanceLine, type BalanceLine } from './balancesCsv.ts'
import { isMonthKey } from './moneyCsv.ts'
import { MONEY_LINK_MAX_PARAM, monthsBetween } from './moneyLink.ts'

// Soldi Patrimonio import link (MO17): scripts/life-money-balances-link.ts
// parses account-balances.csv and prints
// `#/soldi/patrimonio/import?d=<base64url(deflate-raw(UTF-8 JSON))>`;
// /soldi/patrimonio/import decodes it, previews it against the device and
// writes only on a tap. Same transport as the monthly-totals link
// (moneyLink.ts), with its own format tag: a totals link (`v: 1`) is refused
// here, and a balances link (`v: 'balances-1'`) is refused by /soldi/import.
//
// Each payload carries the month range it covers (`from`..`to`): importing it
// replaces exactly those months, so an account removed in GreenBooks
// disappears from the mirror too. Split by whole years only when one link
// would be longer than BALANCES_LINK_MAX_PARAM.
//
// Wire JSON: { v: 'balances-1', from: 'YYYY-MM', to: 'YYYY-MM',
//              rows: [[month, account, group, balanceCents], ...] }
// Pure apart from CompressionStream/DecompressionStream (browsers and node 22+).

export const BALANCES_LINK_VERSION = 'balances-1'

export interface BalancesPayload {
  from: string
  to: string
  lines: BalanceLine[]
}

/** Longest `d` the import screen accepts (and the script prints), same as the totals link. */
export const BALANCES_LINK_MAX_PARAM = MONEY_LINK_MAX_PARAM
/** Uncompressed JSON cap, so a crafted link can't inflate into something huge. */
const MAX_JSON_CHARS = 2_000_000

type WireRow = [string, string, string, number]

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const out = new Blob([bytes as BlobPart]).stream().pipeThrough(stream)
  return new Uint8Array(await new Response(out).arrayBuffer())
}

export function balancesPayloadJson(p: BalancesPayload): string {
  const rows: WireRow[] = p.lines.map((l) => [l.month, l.account, l.group, l.balance])
  return JSON.stringify({ v: BALANCES_LINK_VERSION, from: p.from, to: p.to, rows })
}

/** The `d` parameter for a payload. */
export async function encodeBalancesParam(p: BalancesPayload): Promise<string> {
  const z = await pipe(new TextEncoder().encode(balancesPayloadJson(p)), new CompressionStream('deflate-raw'))
  return toBase64Url(z)
}

/** `${base}#/soldi/patrimonio/import?d=…`. */
export async function encodeBalancesLink(p: BalancesPayload, base: string = LIFE_IMPORT_BASE): Promise<string> {
  return `${base}#/soldi/patrimonio/import?d=${await encodeBalancesParam(p)}`
}

export type BalancesPayloadResult = { ok: true; payload: BalancesPayload } | { ok: false; errors: string[] }

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)

/** Validate the payload JSON (the link's content). Never trusts the script: every row is re-checked. */
export function parseBalancesPayloadJson(text: string): BalancesPayloadResult {
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    return { ok: false, errors: ['The import link is damaged (not JSON)'] }
  }
  if (isObj(raw) && raw.v === 1)
    return { ok: false, errors: ['This is a monthly-totals link: open it on /soldi/import, not here'] }
  if (!isObj(raw) || raw.v !== BALANCES_LINK_VERSION)
    return { ok: false, errors: [`Unknown import link format (expected v ${BALANCES_LINK_VERSION})`] }
  const errors: string[] = []
  const err = (m: string) => errors.push(m)
  const { from, to } = raw
  if (!isMonthKey(from)) err('from must be YYYY-MM')
  if (!isMonthKey(to)) err('to must be YYYY-MM')
  const range = isMonthKey(from) && isMonthKey(to)
  if (range && to < from) err(`to (${to}) is before from (${from})`)
  const lines: BalanceLine[] = []
  if (!Array.isArray(raw.rows)) err('rows must be an array')
  else
    raw.rows.forEach((r, i) => {
      if (!Array.isArray(r) || r.length !== 4) {
        err(`rows[${i}] must be [month, account, group, balance]`)
        return
      }
      const [month, account, group, balance] = r as unknown[]
      const line = validateBalanceLine({ month, account, group, balance }, `rows[${i}]`, err)
      if (!line) return
      if (range && (line.month < from || line.month > to)) err(`rows[${i}]: ${line.month} is outside ${from}..${to}`)
      lines.push(line)
    })
  if (errors.length === 0) checkBalanceLines(lines, err)
  if (errors.length > 0) return { ok: false, errors }
  return { ok: true, payload: { from: from as string, to: to as string, lines: sortBalanceLines(lines) } }
}

/** Decode a `d` parameter back to a validated payload. Never writes anything. */
export async function decodeBalancesParam(d: string): Promise<BalancesPayloadResult> {
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
  return parseBalancesPayloadJson(text)
}

/**
 * The payloads to print for `lines` (sorted), from `since` (default: the first
 * month) to the last month. One payload when it fits in `maxParam`, else whole
 * years packed greedily, oldest first; ranges are contiguous and year-aligned
 * (clipped to the overall range), so no month falls between two links. Same
 * rules as moneyLink.ts chunkPayloads. Throws when a single year alone is too large.
 */
export async function chunkBalancesPayloads(
  lines: readonly BalanceLine[],
  opts: { since?: string; maxParam?: number } = {},
): Promise<{ payload: BalancesPayload; param: string }[]> {
  const max = opts.maxParam ?? BALANCES_LINK_MAX_PARAM
  const chosen = lines.filter((l) => !opts.since || l.month >= opts.since)
  if (chosen.length === 0) throw new Error(opts.since ? `No rows from ${opts.since} on` : 'No rows')
  const from = opts.since ?? chosen[0]!.month
  const to = chosen[chosen.length - 1]!.month
  const make = async (f: string, t: string) => {
    const payload: BalancesPayload = { from: f, to: t, lines: chosen.filter((l) => l.month >= f && l.month <= t) }
    return { payload, param: await encodeBalancesParam(payload) }
  }
  const whole = await make(from, to)
  if (whole.param.length <= max) return [whole]

  const years = [...new Set(chosen.map((l) => l.month.slice(0, 4)))]
  const clipFrom = (y: string) => (`${y}-01` < from ? from : `${y}-01`)
  const clipTo = (y: string) => (`${y}-12` > to ? to : `${y}-12`)
  const out: { payload: BalancesPayload; param: string }[] = []
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
    const gap = monthsBetween(out[i]!.payload.to, out[i + 1]!.payload.from)
    if (gap.length > 2) out[i] = await make(out[i]!.payload.from, gap[gap.length - 2]!)
  }
  return out
}
