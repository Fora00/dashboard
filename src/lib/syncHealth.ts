import { useCallback, useSyncExternalStore } from 'react'
import type { CloudSync, SyncStatus } from './cloudSync'
import { sync as boardgameIdeas } from './boardgameIdeasSync'
import { sync as bookIdeas } from './bookIdeasSync'
import { sync as climbing } from './climbSync'
import { sync as customEvents } from './customEventsSync'
import { sync as eventInterest } from './eventInterestSync'
import { sync as eventInterestProfile } from './eventInterestProfileSync'
import { sync as eventMarks } from './eventMarksSync'
import { sync as habits } from './habitSync'
import { sync as life } from './lifeSync'
import { sync as links } from './linksSync'
import { sync as mealDiary } from './mealDiarySync'
import { sync as projectPrefs } from './projectPrefsSync'
import { sync as shop } from './shopSync'
import { sync as todo } from './todoSync'
import { sync as trips } from './tripsSync'

// One place that watches every project's sync engine, so a failure shows up
// wherever the user is, not only on the failing project's own page.

export interface WatchedEngine {
  label: string
  path: string
  sync: CloudSync
}

export const watchedEngines: readonly WatchedEngine[] = [
  { label: 'Shop list', path: '/shop-list', sync: shop },
  { label: 'To-do', path: '/todo', sync: todo },
  { label: 'Climbing', path: '/climbing', sync: climbing },
  { label: 'Habits', path: '/habits', sync: habits },
  { label: 'Book ideas', path: '/book-ideas', sync: bookIdeas },
  { label: 'Boardgame ideas', path: '/boardgame-ideas', sync: boardgameIdeas },
  { label: 'Links', path: '/links', sync: links },
  { label: 'Life', path: '/life', sync: life },
  { label: 'Meal diary', path: '/meal-diary', sync: mealDiary },
  { label: 'Trips', path: '/trips', sync: trips },
  { label: 'Events', path: '/events', sync: customEvents },
  { label: 'Events', path: '/events', sync: eventMarks },
  { label: 'Event interests', path: '/events', sync: eventInterest },
  { label: 'Interest profile', path: '/events/interests', sync: eventInterestProfile },
  { label: 'Home layout', path: '/settings', sync: projectPrefs },
]

export type Severity = 'ok' | 'warn' | 'error'

export interface SyncIssue {
  label: string
  path: string
  severity: Severity
  message: string
}

/** A transient problem becomes visible only after this long, so a quick
 *  offline blip or a single retry doesn't flash a warning. */
export const STUCK_AFTER_MS = 2 * 60_000

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`

/** Pure: what, if anything, is wrong with one engine right now.
 *  `stuckFor` is how long this engine has had unsynced changes, in ms. */
export function issueFor(status: SyncStatus, stuckFor: number): { severity: Severity; message: string } {
  if (status.dead > 0) {
    return {
      severity: 'error',
      message: `${plural(status.dead, 'change')} rejected by the server and kept on this device only`,
    }
  }
  if (status.pullFailed) {
    return { severity: 'warn', message: "couldn't fetch the latest data; what you see may be out of date" }
  }
  if (status.retrying > 0) {
    return { severity: 'warn', message: `${plural(status.retrying, 'change')} failed to upload and will be retried` }
  }
  if (status.pending > 0 && stuckFor >= STUCK_AFTER_MS) {
    return { severity: 'warn', message: `${plural(status.pending, 'change')} still waiting to upload` }
  }
  return { severity: 'ok', message: '' }
}

/** Pure: the issues across all engines, worst first. `since` maps an engine
 *  to when it first had pending changes (undefined = none). */
export function collectIssues(
  engines: readonly WatchedEngine[],
  statuses: readonly SyncStatus[],
  since: ReadonlyMap<CloudSync, number>,
  now: number,
): SyncIssue[] {
  const out: SyncIssue[] = []
  engines.forEach((e, i) => {
    const t = since.get(e.sync)
    const { severity, message } = issueFor(statuses[i]!, t === undefined ? 0 : now - t)
    if (severity !== 'ok') out.push({ label: e.label, path: e.path, severity, message })
  })
  return out.sort((a, b) => (a.severity === b.severity ? 0 : a.severity === 'error' ? -1 : 1))
}

// --- React binding ----------------------------------------------------------

const since = new Map<CloudSync, number>()
let cache: { key: string; issues: SyncIssue[] } = { key: '', issues: [] }

function snapshot(): SyncIssue[] {
  const now = Date.now()
  const statuses = watchedEngines.map((e) => e.sync.getStatus())
  statuses.forEach((s, i) => {
    const e = watchedEngines[i]!.sync
    if (s.pending > 0) {
      if (!since.has(e)) since.set(e, now)
    } else since.delete(e)
  })
  const issues = collectIssues(watchedEngines, statuses, since, now)
  // useSyncExternalStore needs a stable reference while nothing changed.
  const key = JSON.stringify(issues)
  if (key !== cache.key) cache = { key, issues }
  return cache.issues
}

/** Live list of sync problems across every project; empty when healthy. */
export function useSyncIssues(): SyncIssue[] {
  const subscribe = useCallback((onChange: () => void) => {
    const unsubs = watchedEngines.map((e) => e.sync.subscribe(onChange))
    // The "stuck for 2 minutes" rule needs a tick even when nothing emits.
    const timer = setInterval(onChange, 30_000)
    return () => {
      unsubs.forEach((u) => u())
      clearInterval(timer)
    }
  }, [])
  return useSyncExternalStore(subscribe, snapshot, snapshot)
}
