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

/** "+3" / "-12" / "" : change in a source's event count against the previous run. */
export function countDelta(previous: number | undefined, count: number): string {
  if (previous === undefined || previous === count) return ''
  return count > previous ? `+${count - previous}` : `${count - previous}`
}
