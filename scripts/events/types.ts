// Shared shapes for the events crawler. The public contract (events.json) is
// documented field by field in docs/EVENTS.md — keep the two in sync, and only
// make additive changes while schemaVersion is 1.
import type { CategoryId } from './tags.ts'

/** One event as published in events.json. */
export interface Event {
  /** Stable id: 16 hex chars of sha1(source + source-native key). */
  id: string
  title: string
  /** ISO 8601 with the explicit Europe/Rome offset, e.g. 2026-10-04T20:30:00+02:00. */
  start: string
  /** Same format as `start`; null when the source gives no end. For allDay events: the LAST day (inclusive) at local midnight. */
  end: string | null
  allDay: boolean
  /** True when the event had already started and not yet ended at `generatedAt`. */
  ongoing: boolean
  venue: string | null
  city: string
  url: string
  /** Adapter id of the record that was kept. */
  source: string
  /** Every adapter id that listed this event (dedup across sources); includes `source`. */
  sources: string[]
  category: CategoryId
  tags: CategoryId[]
  /** Full plain text (HTML stripped, entities decoded), paragraphs separated by "\n\n", at most ~2000 chars. '' when none. */
  description: string
  /** One-line plain-text snippet, at most ~300 chars. '' when none. */
  summary: string
  /** Absolute https URL of the source's image for the event; never re-hosted. */
  image: string | null
  /** 1 normally; N when a series with many dates was folded into one span record. */
  occurrences: number
  /** When this record was last fetched from its source (ISO, UTC). */
  fetchedAt: string
}

/**
 * What an adapter returns: the source-specific part of an Event. The
 * orchestrator derives id, category, tags, ongoing, sources, occurrences and
 * fetchedAt, and applies the time window.
 */
export interface RawEvent {
  /** Source-native key, unique per occurrence (e.g. object id + start, or the URL). */
  nativeId: string
  /** Groups occurrences of one series (e.g. the object id); omit for one-off events. */
  seriesKey?: string
  title: string
  start: string
  end: string | null
  allDay: boolean
  venue: string | null
  city: string
  url: string
  /** Full text: HTML or plain text; the pipeline strips, keeps paragraphs and caps it. */
  description: string
  /** Short text from the source (abstract/intro); defaults to the start of `description`. */
  summary?: string
  image?: string | null
  /** Primary category decided by the source itself (e.g. Mart "Mostra"). */
  categoryHint?: CategoryId
  /** Extra text used only for tag matching (typologies, topics, German title…). */
  tagText?: string
}

export interface FetchResult {
  status: number
  /** Final URL after redirects. */
  url: string
  text: string
}

export interface AdapterContext {
  /** Polite GET: robots.txt, per-host delay, timeout, per-source request cap. Throws on non-2xx. */
  fetchText(url: string): Promise<FetchResult>
  fetchJson<T = unknown>(url: string): Promise<T>
  /** Crawl time (ms since epoch) and the window adapters should ask their source for. */
  now: number
  horizonDays: number
}

export interface Adapter {
  id: string
  name: string
  /** Used when neither the source nor the tag rules decide a category. */
  defaultCategory: CategoryId
  /** A run with 0 events is a success (e.g. a stale calendar), not a failure. */
  mayBeEmpty?: boolean
  /** Per-run cap on source requests (default 60). */
  maxRequests?: number
  run(ctx: AdapterContext): Promise<RawEvent[]>
}

export interface SourceStatus {
  id: string
  name: string
  ok: boolean
  count: number
  error?: string
  lastSuccess: string | null
}

export interface EventsFile {
  schemaVersion: 1
  generatedAt: string
  sources: SourceStatus[]
  events: Event[]
}
