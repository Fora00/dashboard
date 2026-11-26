import { fromBase64Url, toBase64Url } from '../../lib/base64url.ts'
import { normalizeUrl } from '../../lib/normalizeUrl.ts'
import type { SitePagesStatus } from '../../lib/db.ts'
import { LIFE_IMPORT_BASE } from '../life/model/importLink.ts'

// Siti import link (SI1): scripts/sites-link.ts asks GitHub (gh CLI, on the
// Mac) for the owner's repos with Pages and prints
// `#/siti/import?d=<base64url(deflate-raw(UTF-8 JSON))>`; /siti/import decodes
// it, previews it against the device and writes only on a tap. Same transport
// as the Soldi links (moneyLink.ts, balancesLink.ts), its own format tag.
//
// One link always carries the WHOLE list: a repo missing from it is marked
// "gone from GitHub" on import, so the list is never split across links (a
// split would flag the other half as gone). The script refuses a list that
// does not fit instead.
//
// Wire JSON: { v: 'sites-1', fetchedAt: epochMs,
//              rows: [[repo, url, description, private 0|1, pushedAt | null,
//                      pagesStatus | null, pagesBuiltAt | null], ...] }
// No token or secret is ever part of it.
// Pure apart from CompressionStream/DecompressionStream (browsers and node 22+).

export const SITES_LINK_VERSION = 'sites-1'

/** Longest `d` the import screen accepts (and the script prints), same as the Soldi links. */
export const SITES_LINK_MAX_PARAM = 20_000
/** Uncompressed JSON cap, so a crafted link can't inflate into something huge. */
const MAX_JSON_CHARS = 2_000_000
/** Most repos one link may carry. */
export const MAX_SITES = 500
/** Caps mirrored by supabase/migrations/20261126180000_sites.sql. */
export const MAX_REPO_LENGTH = 200
export const MAX_DESCRIPTION_LENGTH = 2000
export const MAX_URL_LENGTH = 2000

const REPO_RE = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/

/** One repo with GitHub Pages, as GitHub describes it (the GitHub fields of a Site). */
export interface SiteFromGithub {
  /** `owner/name` */
  repo: string
  url: string
  description: string
  private: boolean
  pushedAt: number | null
  pagesStatus: SitePagesStatus | null
  pagesBuiltAt: number | null
}

export interface SitesPayload {
  /** When the script read GitHub (epoch ms). */
  fetchedAt: number
  sites: SiteFromGithub[]
}

type WireRow = [string, string, string, 0 | 1, number | null, SitePagesStatus | null, number | null]

export function isRepoName(v: unknown): v is string {
  return typeof v === 'string' && v.length >= 3 && v.length <= MAX_REPO_LENGTH && REPO_RE.test(v)
}

/** GitHub's Pages build status → ours: queued counts as building, anything unknown as null. */
export function pagesStatusFrom(github: unknown): SitePagesStatus | null {
  if (github === 'built' || github === 'errored' || github === 'building') return github
  if (github === 'queued') return 'building'
  return null
}

/** A GitHub deployment status state (Pages built by an Actions workflow) → ours. */
export function pagesStatusFromDeployment(state: unknown): SitePagesStatus | null {
  if (state === 'success') return 'built'
  if (state === 'failure' || state === 'error') return 'errored'
  if (state === 'in_progress' || state === 'queued' || state === 'pending') return 'building'
  return null
}

/** The repo's short name (`owner/name` → `name`). */
export function repoShortName(repo: string): string {
  const i = repo.indexOf('/')
  return i >= 0 ? repo.slice(i + 1) : repo
}

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const out = new Blob([bytes as BlobPart]).stream().pipeThrough(stream)
  return new Uint8Array(await new Response(out).arrayBuffer())
}

export function sitesPayloadJson(p: SitesPayload): string {
  const rows: WireRow[] = p.sites.map((s) => [
    s.repo,
    s.url,
    s.description,
    s.private ? 1 : 0,
    s.pushedAt,
    s.pagesStatus,
    s.pagesBuiltAt,
  ])
  return JSON.stringify({ v: SITES_LINK_VERSION, fetchedAt: p.fetchedAt, rows })
}

/** The `d` parameter for a payload. */
export async function encodeSitesParam(p: SitesPayload): Promise<string> {
  const z = await pipe(new TextEncoder().encode(sitesPayloadJson(p)), new CompressionStream('deflate-raw'))
  return toBase64Url(z)
}

/** `${base}#/siti/import?d=…`. Throws when the whole list does not fit one link (never split, see above). */
export async function encodeSitesLink(p: SitesPayload, base: string = LIFE_IMPORT_BASE): Promise<string> {
  const d = await encodeSitesParam(p)
  if (d.length > SITES_LINK_MAX_PARAM)
    throw new Error(`The list is too large for one link (${d.length} characters, max ${SITES_LINK_MAX_PARAM})`)
  return `${base}#/siti/import?d=${d}`
}

export type SitesPayloadResult = { ok: true; payload: SitesPayload } | { ok: false; errors: string[] }

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)
const isTime = (v: unknown): v is number => typeof v === 'number' && Number.isSafeInteger(v) && v >= 0
const isTimeOrNull = (v: unknown): v is number | null => v === null || isTime(v)

/** Validate the payload JSON (the link's content). Never trusts the script: every row is re-checked. */
export function parseSitesPayloadJson(text: string): SitesPayloadResult {
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    return { ok: false, errors: ['The import link is damaged (not JSON)'] }
  }
  if (!isObj(raw) || raw.v !== SITES_LINK_VERSION)
    return { ok: false, errors: [`Unknown import link format (expected v ${SITES_LINK_VERSION})`] }
  const errors: string[] = []
  const err = (m: string) => errors.push(m)
  if (!isTime(raw.fetchedAt)) err('fetchedAt must be a time in epoch milliseconds')
  const sites: SiteFromGithub[] = []
  const seen = new Set<string>()
  if (!Array.isArray(raw.rows)) err('rows must be an array')
  else if (raw.rows.length > MAX_SITES) err(`Too many sites (${raw.rows.length}, max ${MAX_SITES})`)
  else
    raw.rows.forEach((r, i) => {
      const at = `rows[${i}]`
      if (!Array.isArray(r) || r.length !== 7) {
        err(`${at} must be [repo, url, description, private, pushedAt, pagesStatus, pagesBuiltAt]`)
        return
      }
      const [repo, url, description, priv, pushedAt, pagesStatus, pagesBuiltAt] = r as unknown[]
      const before = errors.length
      if (!isRepoName(repo)) err(`${at}: repo must be owner/name`)
      const cleanUrl = typeof url === 'string' && url.length <= MAX_URL_LENGTH ? normalizeUrl(url) : null
      if (!cleanUrl || cleanUrl.length > MAX_URL_LENGTH) err(`${at}: url must be an http(s) address`)
      if (typeof description !== 'string' || description.length > MAX_DESCRIPTION_LENGTH)
        err(`${at}: description must be text up to ${MAX_DESCRIPTION_LENGTH} characters`)
      if (priv !== 0 && priv !== 1) err(`${at}: private must be 0 or 1`)
      if (!isTimeOrNull(pushedAt)) err(`${at}: pushedAt must be a time or null`)
      if (pagesStatus !== null && pagesStatusFrom(pagesStatus) !== pagesStatus)
        err(`${at}: pagesStatus must be built, errored, building or null`)
      if (!isTimeOrNull(pagesBuiltAt)) err(`${at}: pagesBuiltAt must be a time or null`)
      if (errors.length > before) return
      const key = (repo as string).toLowerCase()
      if (seen.has(key)) {
        err(`${at}: ${repo as string} is listed twice`)
        return
      }
      seen.add(key)
      sites.push({
        repo: repo as string,
        url: cleanUrl!,
        description: description as string,
        private: priv === 1,
        pushedAt: pushedAt as number | null,
        pagesStatus: pagesStatus as SitePagesStatus | null,
        pagesBuiltAt: pagesBuiltAt as number | null,
      })
    })
  if (errors.length > 0) return { ok: false, errors }
  sites.sort((a, b) => a.repo.localeCompare(b.repo))
  return { ok: true, payload: { fetchedAt: raw.fetchedAt as number, sites } }
}

/** Decode a `d` parameter back to a validated payload. Never writes anything. */
export async function decodeSitesParam(d: string): Promise<SitesPayloadResult> {
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
  return parseSitesPayloadJson(text)
}
