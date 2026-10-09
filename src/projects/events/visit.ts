import { readJSON, writeJSON } from '../../lib/safeStorage'

const KEY = 'dashboard:events-last-visit'
/** Opens closer together than this are one visit (a reload keeps the same "new" set). */
export const SAME_VISIT_MS = 30 * 60_000

/** `since`: baseline of the current visit; `at`: when the page was last opened. Epoch ms. */
export interface StoredVisit {
  since: number
  at: number
}

/**
 * What a page open at `now` sees: the baseline for "new" (null = first ever
 * visit, nothing is new) and the value to store. Within SAME_VISIT_MS of the
 * previous open the baseline stays, so reloads show the same set; later the
 * previous open becomes the baseline. Pure.
 */
export function nextVisit(stored: StoredVisit | null, now: number): { since: number | null; next: StoredVisit } {
  if (!stored) return { since: null, next: { since: now, at: now } }
  if (now - stored.at < SAME_VISIT_MS) return { since: stored.since, next: { since: stored.since, at: now } }
  return { since: stored.at, next: { since: stored.at, at: now } }
}

function sanitize(v: unknown): StoredVisit | null {
  if (!v || typeof v !== 'object') return null
  const o = v as Record<string, unknown>
  return typeof o.since === 'number' && typeof o.at === 'number' && Number.isFinite(o.since) && Number.isFinite(o.at)
    ? { since: o.since, at: o.at }
    : null
}

/** Reads the previous visit and records this one. Never throws (guarded storage). */
export function recordVisit(now: number): number | null {
  const { since, next } = nextVisit(readJSON(KEY, sanitize, null), now)
  writeJSON(KEY, next)
  return since
}
