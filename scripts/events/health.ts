// Crawl health checks that need the owner's attention (pure, tested): sources
// failing for days (their events silently age) and unconfirmed spot dates that
// are about to happen.
import type { Event, SourceStatus } from './types.ts'

const DAY = 86_400_000

/** Failing sources whose last success is older than `days` (or never): they keep serving stale events. */
export function staleSources(
  rows: readonly SourceStatus[],
  now: number,
  days = 3,
): { id: string; since: string | null; days: number | null }[] {
  const out: { id: string; since: string | null; days: number | null }[] = []
  for (const s of rows) {
    if (s.ok) continue
    const last = s.lastSuccess ? Date.parse(s.lastSuccess) : NaN
    if (Number.isNaN(last)) out.push({ id: s.id, since: null, days: null })
    else if (now - last > days * DAY) out.push({ id: s.id, since: s.lastSuccess, days: Math.floor((now - last) / DAY) })
  }
  return out
}

/** Events flagged `datesTentative` that start within `days` from now: time to verify them. */
export function upcomingTentative(events: readonly Event[], now: number, days = 7): Event[] {
  return events.filter((e) => {
    if (!e.datesTentative) return false
    const start = Date.parse(e.start)
    return start >= now - DAY && start <= now + days * DAY
  })
}

/** A source that used to deliver at least this many events and now returns 0 is suspicious. */
export const ZERO_ALERT_MIN = 5

/**
 * Zero-tracking fields for this run's status of a source. `fresh` is the
 * number of events the adapter returned this run (after the pipeline), or null
 * when it threw (nothing learned: the previous fields are carried over). A
 * previous file from before these fields existed seeds `lastNonZero` from its
 * successful non-zero `count`.
 */
export function zeroTracking(
  prev: Pick<SourceStatus, 'ok' | 'count' | 'lastNonZero' | 'zeroSince'> | undefined,
  fresh: number | null,
  at: string,
): Pick<SourceStatus, 'lastNonZero' | 'zeroSince'> {
  const lastNonZero = prev?.lastNonZero ?? (prev?.ok && prev.count > 0 ? prev.count : undefined)
  const keep = (n: number | undefined, since: string | undefined) => ({
    ...(n !== undefined ? { lastNonZero: n } : {}),
    ...(since ? { zeroSince: since } : {}),
  })
  if (fresh === null) return keep(lastNonZero, prev?.zeroSince)
  if (fresh > 0) return keep(fresh, undefined)
  // 0 this run: start the clock only if it delivered before.
  return keep(lastNonZero, lastNonZero ? (prev?.zeroSince ?? at) : undefined)
}

/**
 * Sources accepted as ok with 0 events although they delivered at least
 * ZERO_ALERT_MIN before (any source, mayBeEmpty or not): a broken adapter that
 * returns [] looks exactly like this. Failed sources are warned about already.
 */
export function suspiciousZeros(
  rows: readonly SourceStatus[],
  min = ZERO_ALERT_MIN,
): { id: string; since: string; had: number }[] {
  return rows
    .filter((s) => s.ok && s.count === 0 && s.zeroSince && (s.lastNonZero ?? 0) >= min)
    .map((s) => ({ id: s.id, since: s.zeroSince as string, had: s.lastNonZero as number }))
}

/** Stale threshold that makes a crawl "degraded" (an issue is opened, docs/CI.md). */
export const DEGRADED_STALE_DAYS = 7

/**
 * Reasons this crawl needs the owner's attention beyond the per-run
 * annotations: more than a third of the sources that ran failed, or a source
 * has been failing for over DEGRADED_STALE_DAYS. Empty = healthy.
 */
export function degradedReasons(rows: readonly SourceStatus[], ran: ReadonlySet<string>, now: number): string[] {
  const out: string[] = []
  const bad = rows.filter((s) => !s.ok && ran.has(s.id))
  if (ran.size > 0 && bad.length * 3 > ran.size)
    out.push(`${bad.length} of ${ran.size} sources failed (${bad.map((s) => s.id).join(', ')})`)
  for (const st of staleSources(
    rows.filter((s) => ran.has(s.id)),
    now,
    DEGRADED_STALE_DAYS,
  ))
    out.push(`${st.id} has not succeeded ${st.days === null ? 'ever' : `for ${st.days} days`}`)
  return out
}

/** "+3" / "-12" / "" : change in a source's event count against the previous run. */
export function countDelta(previous: number | undefined, count: number): string {
  if (previous === undefined || previous === count) return ''
  return count > previous ? `+${count - previous}` : `${count - previous}`
}
