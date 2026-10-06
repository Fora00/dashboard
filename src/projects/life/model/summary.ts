import type { LifeAnswer, LifeCheckin, LifeEntry, LifePlan, LifeTracker } from '../../../lib/db'
import { withCheckinIds } from './checkinIds.ts'
import { dayKey, daysBetween, weekDays } from './dates.ts'

// --- Week summary (shared by the Week screen and the export) -----------------

export interface TrackerSummary {
  tracker: LifeTracker
  total: number
  /** Count per day, Mon..Sun (index 0 = Monday). */
  perDay: number[]
  /** This week's entries for the tracker, oldest first. */
  entries: Extract<LifeEntry, { kind: 'tracker' }>[]
  /** target reached (null when there's no target). */
  reachedTarget: boolean | null
  /** max reached or exceeded — a soft warning, never a block. */
  atMax: boolean
}

export interface CheckinStatus {
  checkin: LifeCheckin
  done: boolean
  /** The saved note, or null. Independent of `done` (a note can stand alone). */
  note: string | null
  /** Days from `today` to the check-in date: 0 = today, negative = past. */
  daysLeft: number
  /** The date is before today and it isn't done. */
  overdue: boolean
}

export interface WeekSummary {
  focusDone: Set<string>
  /** Every check-in of the plan with its status, by date (then plan order). */
  checkins: CheckinStatus[]
  trackers: TrackerSummary[]
  answers: Map<string, LifeAnswer>
  /** Question ids whose answer was computed from a linked tracker. */
  autoAnswered: Set<string>
  sentTaskIds: Set<string>
  /** Meaningful entries whose ref is no longer in the plan (kept, hidden). */
  removed: LifeEntry[]
}

/**
 * Fold a week's entries onto its plan. Entries of other weeks are ignored.
 * `today` (a local day key) only drives the check-ins' daysLeft/overdue.
 */
export function summarizeWeek(
  planIn: LifePlan,
  entries: readonly LifeEntry[],
  today: string = dayKey(new Date()),
): WeekSummary {
  const plan = withCheckinIds(planIn)
  const days = weekDays(plan.week)
  const mine = entries
    .filter((e) => e.week === plan.week)
    .slice()
    .sort((a, b) => a.createdAt - b.createdAt)
  const ids = {
    focus: new Set(plan.focus.map((f) => f.id)),
    tracker: new Set(plan.trackers.map((t) => t.id)),
    sunday: new Set(plan.sundayCheck.map((q) => q.id)),
    sent: new Set(plan.tasks.map((t) => t.id)),
    checkin: new Set(plan.checkins.map((c) => c.id)),
  }

  const focusDone = new Set<string>()
  const answers = new Map<string, LifeAnswer>()
  const sentTaskIds = new Set<string>()
  const checkinValues = new Map<string, { done: boolean; note?: string }>()
  const removed: LifeEntry[] = []

  for (const e of mine) {
    const known = ids[e.kind].has(e.ref)
    if (!known) {
      if (isMeaningful(e)) removed.push(e)
      continue
    }
    if (e.kind === 'focus' && e.value.done) focusDone.add(e.ref)
    else if (e.kind === 'sunday' && e.value.answer !== null) answers.set(e.ref, e.value.answer)
    else if (e.kind === 'sent' && e.value.sent) sentTaskIds.add(e.ref)
    else if (e.kind === 'checkin') checkinValues.set(e.ref, e.value)
  }

  const checkins = plan.checkins
    .map((checkin, i) => ({ checkin, i }))
    .sort((a, b) => a.checkin.date.localeCompare(b.checkin.date) || a.i - b.i)
    .map(({ checkin }): CheckinStatus => {
      const v = checkinValues.get(checkin.id)
      const done = v?.done === true
      return {
        checkin,
        done,
        note: v?.note?.trim() ? v.note : null,
        daysLeft: daysBetween(today, checkin.date),
        overdue: checkin.date < today && !done,
      }
    })

  const trackers = plan.trackers.map((tracker): TrackerSummary => {
    const list = mine.filter(
      (e): e is Extract<LifeEntry, { kind: 'tracker' }> => e.kind === 'tracker' && e.ref === tracker.id,
    )
    const perDay = days.map((d) => list.filter((e) => e.day === d).length)
    const total = list.length
    return {
      tracker,
      total,
      perDay,
      entries: list,
      reachedTarget: tracker.target === null ? null : total >= tracker.target,
      atMax: tracker.max !== null && total >= tracker.max,
    }
  })

  // Questions linked to a tracker are answered from the log, overriding any
  // stored answer (so the Week screen, history and export all agree).
  const autoAnswered = new Set<string>()
  for (const q of plan.sundayCheck) {
    const t = q.tracker ? trackers.find((x) => x.tracker.id === q.tracker) : undefined
    if (!t) continue
    answers.set(q.id, q.type === 'number' ? t.total : (t.reachedTarget ?? t.total > 0))
    autoAnswered.add(q.id)
  }

  return { focusDone, checkins, trackers, answers, autoAnswered, sentTaskIds, removed }
}

function isMeaningful(e: LifeEntry): boolean {
  switch (e.kind) {
    case 'tracker':
      return true
    case 'focus':
      return e.value.done
    case 'sunday':
      return e.value.answer !== null
    case 'sent':
      return e.value.sent
    case 'checkin':
      return e.value.done || !!e.value.note?.trim()
  }
}

/**
 * The nearest check-in on or after `today` (a day key), or null. Kept for
 * compatibility; summarizeWeek().checkins has every check-in with its status.
 */
export function nextCheckin(
  plan: LifePlan,
  today: string = dayKey(new Date()),
): (LifeCheckin & { daysLeft: number }) | null {
  const next = withCheckinIds(plan)
    .checkins.filter((c) => c.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))[0]
  if (!next) return null
  return { ...next, daysLeft: daysBetween(today, next.date) }
}
