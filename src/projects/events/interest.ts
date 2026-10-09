import type { EventItem, InterestFeatures, InterestValue } from './types'
import { areaOf, categoryOf } from './model'
import { str, strList } from './marks'

// Pure helpers for the owner's 👍 / 👎 interest signal on /events, synced
// owner-only by src/lib/eventInterestSync.ts. No React, no Dexie.
//
// Step 1 only COLLECTS: a signal stores the event's features as they were at
// click time, so a later learning step still has them after the event has
// left events.json (signals are never pruned with the events). The snapshot is
// rebuilt and capped here before it is stored or pushed; the caps keep its
// JSON well under the server's 8,192-byte check on `event_interest.features`
// (supabase/migrations/20261009150000_event_interest.sql).

export type { InterestFeatures, InterestValue }

export const FEATURE_CAPS = {
  /** category, source, ring, area */
  short: 64,
  city: 100,
  tags: 20,
  tagLength: 40,
  sources: 10,
  sourceLength: 64,
} as const
/** Server-side cap on the features' JSON text, in bytes (mirrored in SQL). */
export const MAX_FEATURES_BYTES = 8192
/** Client-side target: leaves room for jsonb's own spacing. */
const FEATURES_BUDGET = 7000

const ROME = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Europe/Rome',
  weekday: 'short',
  hour: '2-digit',
  hourCycle: 'h23',
})
const WEEKDAYS: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 }

/**
 * Weekday and hour of an events.json start in Europe/Rome. A date-only start
 * ('YYYY-MM-DD') or an all-day event has no hour; anything unparseable gives
 * nulls rather than a wrong guess.
 */
export function romeWeekdayHour(start: string, allDay: boolean): { weekday: number | null; hour: number | null } {
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(start)
  if (dateOnly) {
    const day = new Date(Date.UTC(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))).getUTCDay()
    return Number.isNaN(day) ? { weekday: null, hour: null } : { weekday: day === 0 ? 7 : day, hour: null }
  }
  const ms = Date.parse(start)
  if (!/^\d{4}-\d{2}-\d{2}T/.test(start) || Number.isNaN(ms)) return { weekday: null, hour: null }
  const parts = ROME.formatToParts(new Date(ms))
  const weekday = WEEKDAYS[parts.find((p) => p.type === 'weekday')?.value ?? ''] ?? null
  const h = Number(parts.find((p) => p.type === 'hour')?.value)
  return { weekday, hour: allDay || !Number.isInteger(h) || h < 0 || h > 23 ? null : h }
}

/** The features of a live event, as stored with a 👍 / 👎. */
export function interestFeatures(e: EventItem): InterestFeatures {
  const { weekday, hour } = romeWeekdayHour(typeof e.start === 'string' ? e.start : '', e.allDay === true)
  // Through sanitizeFeatures so the live path and the remote path share caps.
  return sanitizeFeatures({
    v: 1,
    category: categoryOf(e),
    tags: e.tags,
    city: e.city,
    source: e.source,
    sources: e.sources,
    ring: e.ring || 'home',
    area: areaOf(e),
    weekday,
    hour,
    subcategory: e.subcategory,
  })!
}

const SUBCATEGORY_ID = /^[a-z][a-z0-9-]{0,39}$/

function intIn(v: unknown, min: number, max: number): number | null {
  return typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max ? v : null
}

function utf8Bytes(s: string): number {
  return new TextEncoder().encode(s).length
}

/**
 * Rebuild a features snapshot from anything (a live builder result, a stored
 * row, a remote jsonb value): known fields only, typed, capped. Returns null
 * for a non-object (e.g. a realtime update that arrived without the jsonb).
 */
export function sanitizeFeatures(raw: unknown): InterestFeatures | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const r = raw as Record<string, unknown>
  const C = FEATURE_CAPS
  const out: InterestFeatures = {
    v: 1,
    category: str(r.category, C.short) || 'other',
    tags: strList(r.tags, C.tags, C.tagLength),
    city: str(r.city, C.city),
    source: str(r.source, C.short),
    sources: strList(r.sources, C.sources, C.sourceLength),
    ring: str(r.ring, C.short) || 'home',
    area: str(r.area, C.short),
    weekday: intIn(r.weekday, 1, 7),
    hour: intIn(r.hour, 0, 23),
  }
  if (typeof r.subcategory === 'string' && SUBCATEGORY_ID.test(r.subcategory)) out.subcategory = r.subcategory
  // Belt and braces: the caps already fit the budget in the worst case.
  if (utf8Bytes(JSON.stringify(out)) > FEATURES_BUDGET) out.tags = out.tags.slice(0, 5)
  return out
}

/** A stored / remote interest value, or null when it is not one. */
export function asInterestValue(v: unknown): InterestValue | null {
  const n = typeof v === 'string' ? Number(v) : v
  return n === 1 || n === -1 ? n : null
}

/**
 * Is `mark` the hide that `signal`'s 👎 made? A 👎 that creates a hide writes
 * the mark and the signal with the SAME updatedAt, and the hide stays "the
 * 👎's own" while the hidden mark still carries exactly that stamp (full rule
 * in src/lib/eventInterestSync.ts). Structural types: pure, no Dexie.
 */
export function isOwnHide(
  signal: { value: number; updatedAt: number } | undefined,
  mark: { state: string; updatedAt: number } | undefined,
): boolean {
  return signal?.value === -1 && mark?.state === 'hidden' && mark.updatedAt === signal.updatedAt
}
