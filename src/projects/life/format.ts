import type { LifeAnswer, LifeEntry, LifeQuestion, LifeTrackerEntry } from '../../lib/db'
import { dayKey, parseDayKey, type TrackerSummary } from './model'

// Pure display helpers for the Life screens (no React, no Dexie).

// --- Trackers summary / Things "Last sent" ---------------------------------

export function trackersSummary(trackers: TrackerSummary[]): string {
  if (trackers.length === 0) return '0/0'
  const onTrack = trackers.filter((t) => (t.tracker.target !== null ? t.reachedTarget : t.total > 0)).length
  return `${onTrack}/${trackers.length}`
}

export interface LastSentInfo {
  at: number
  count: number
}

/** The latest timestamp across every sent entry's `value.sends`, plus how
 * many tasks share that exact timestamp (one send/resend call stamps every
 * task in the batch with the same `Date.now()`, so this counts the batch). */
export function lastSentInfo(entries: readonly LifeEntry[]): LastSentInfo | null {
  let maxAt = 0
  for (const e of entries) {
    if (e.kind !== 'sent') continue
    for (const t of e.value.sends ?? []) {
      if (t > maxAt) maxAt = t
    }
  }
  if (maxAt === 0) return null
  let count = 0
  for (const e of entries) {
    if (e.kind !== 'sent') continue
    if ((e.value.sends ?? []).includes(maxAt)) count++
  }
  return { at: maxAt, count }
}

export function formatLastSent(at: number): string {
  const d = new Date(at)
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  if (dayKey(d) === dayKey(new Date())) return time
  return `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${time}`
}

/** "today" / "tomorrow" / "in N days" / "N days ago" from summarizeWeek's daysLeft. */
export function relativeCheckinDate(daysLeft: number): string {
  if (daysLeft === 0) return 'today'
  if (daysLeft === 1) return 'tomorrow'
  if (daysLeft === -1) return '1 day ago'
  if (daysLeft > 0) return `in ${daysLeft} days`
  return `${-daysLeft} days ago`
}

export function weekdayShort(day: string): string {
  return parseDayKey(day).toLocaleDateString(undefined, { weekday: 'short' })
}

export function describeEnergy(e: LifeTrackerEntry): string {
  const { energyBefore: b, energyAfter: a } = e.value
  if (b === undefined && a === undefined) return 'energy not set · tap to add'
  return `energy ${b ?? '–'} → ${a ?? '–'}`
}

export function describeAnswer(question: LifeQuestion, answer: LifeAnswer): string {
  if (answer === null) return '—'
  if (typeof answer === 'boolean') return answer ? 'Yes' : 'No'
  if (question.type === 'scale5') return `${answer}/5`
  return String(answer)
}

/** One-line form for the compact summary: text answers are clipped. */
export function shortAnswer(question: LifeQuestion, answer: LifeAnswer): string {
  const full = describeAnswer(question, answer)
  return full.length > 24 ? `${full.slice(0, 23)}…` : full
}
