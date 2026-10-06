import type { EventItem } from './types'
import { safeHttpUrl } from './model'

// Pure helpers for the owner's saved/hidden marks and favourite categories,
// which sync owner-only (src/lib/eventMarksSync.ts). No React, no Dexie.
//
// A mark carries a snapshot of the event so a saved event outlives
// events.json. Snapshots come from scraped data (or the owner's own hand-added
// events), so before one is stored or pushed it is rebuilt field by field and
// capped: no data URLs (a hand-added event's image lives on its own row), only
// http(s) links, no control characters, bounded arrays. The caps keep the
// JSON well under the server's 32,768-byte check on `event_marks.event`
// (supabase/migrations/20261001130000_event_marks.sql).

export const MAX_MARK_ID_LENGTH = 100
export const SNAPSHOT_CAPS = {
  title: 300,
  venue: 300,
  city: 100,
  url: 2000,
  image: 2000,
  description: 4000,
  summary: 500,
  /** start, end, area, ring, source, category, fetchedAt */
  short: 64,
  tags: 20,
  tagLength: 40,
  sources: 20,
  sourceLength: 64,
} as const
/** Server-side cap on the snapshot's JSON text, in bytes (mirrored in SQL). */
export const MAX_SNAPSHOT_BYTES = 32_768
/** Client-side target: leaves room for jsonb's own spacing. */
const SNAPSHOT_BUDGET = 30_000

export const MAX_FAVOURITES = 50
const CATEGORY_RE = /^[a-z][a-z0-9-]{0,39}$/
const MARK_ID_RE = /^[A-Za-z0-9_-]+$/

// Control characters other than tab and newline (they would be escaped to
// six bytes each in JSON and are never meaningful in an event's text).
// eslint-disable-next-line no-control-regex
const CONTROL = /[\u0000-\u0008\u000B-\u001F\u007F]/g

function str(v: unknown, max: number): string {
  return typeof v === 'string' ? v.replace(CONTROL, '').slice(0, max) : ''
}

function strList(v: unknown, count: number, max: number): string[] {
  if (!Array.isArray(v)) return []
  const out: string[] = []
  for (const x of v) {
    const s = str(x, max)
    if (s && !out.includes(s)) out.push(s)
    if (out.length >= count) break
  }
  return out
}

function link(v: unknown, max: number): string | null {
  const u = typeof v === 'string' ? safeHttpUrl(v) : null
  return u && u.length <= max ? u : null
}

/** A mark id the server accepts (crawler hex ids, uuids, spot slugs). */
export function isValidMarkId(id: unknown): id is string {
  return typeof id === 'string' && id.length > 0 && id.length <= MAX_MARK_ID_LENGTH && MARK_ID_RE.test(id)
}

function utf8Bytes(s: string): number {
  return new TextEncoder().encode(s).length
}

/**
 * Rebuild an event snapshot from anything (a live EventItem, a stored mark, a
 * remote jsonb value): known fields only, typed, capped. Returns null when the
 * essentials (id, title, start) are missing, so a broken value is skipped
 * rather than stored.
 */
export function sanitizeSnapshot(raw: unknown): EventItem | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const r = raw as Record<string, unknown>
  const id = r.id
  if (!isValidMarkId(id)) return null
  const C = SNAPSHOT_CAPS
  const title = str(r.title, C.title)
  const start = str(r.start, C.short)
  if (!title || !start) return null
  const occurrences =
    typeof r.occurrences === 'number' && Number.isFinite(r.occurrences)
      ? Math.max(1, Math.min(10_000, Math.round(r.occurrences)))
      : 1
  const out: EventItem = {
    id,
    title,
    start,
    end: typeof r.end === 'string' && r.end ? str(r.end, C.short) : null,
    allDay: r.allDay === true,
    ongoing: r.ongoing === true,
    venue: typeof r.venue === 'string' && r.venue ? str(r.venue, C.venue) : null,
    city: str(r.city, C.city),
    url: link(r.url, C.url) ?? '',
    source: str(r.source, C.short),
    sources: strList(r.sources, C.sources, C.sourceLength),
    category: str(r.category, C.short) || 'other',
    tags: strList(r.tags, C.tags, C.tagLength),
    description: str(r.description, C.description),
    summary: str(r.summary, C.summary),
    // http(s) only: a hand-added event's data-URL image never rides along.
    image: link(r.image, C.image),
    occurrences,
    fetchedAt: str(r.fetchedAt, C.short),
  }
  if (typeof r.area === 'string' && r.area) out.area = str(r.area, C.short)
  if (typeof r.ring === 'string' && r.ring) out.ring = str(r.ring, C.short)
  if (r.datesTentative === true) out.datesTentative = true
  // Belt and braces: the caps above already fit the budget in the worst case,
  // but never hand the server something it would reject forever.
  if (utf8Bytes(JSON.stringify(out)) > SNAPSHOT_BUDGET) {
    out.description = out.description.slice(0, 500)
    if (utf8Bytes(JSON.stringify(out)) > SNAPSHOT_BUDGET) out.description = ''
  }
  return out
}

/** Favourite category ids: well-formed, de-duplicated, at most MAX_FAVOURITES. */
export function sanitizeFavourites(raw: unknown): string[] {
  if (!Array.isArray(raw)) return []
  const out: string[] = []
  for (const x of raw) {
    if (typeof x === 'string' && CATEGORY_RE.test(x) && !out.includes(x)) out.push(x)
    if (out.length >= MAX_FAVOURITES) break
  }
  return out
}

/** Local calendar date (YYYY-MM-DD) of a timestamp. */
const ymd = (ms: number): string => {
  const d = new Date(ms)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** Is the event over, i.e. its last day (end, else start) before today? */
export function isPastEvent(e: { start: string; end: string | null }, now: number): boolean {
  const last = (e.end ?? e.start).slice(0, 10)
  return /^\d{4}-\d{2}-\d{2}$/.test(last) && last < ymd(now)
}
