import type { LifeAnswer, LifeCheckin, LifeEntry, LifePlan, LifePlaybookEntry, LifeTracker } from '../../../lib/db'
import { withCheckinIds } from './checkinIds.ts'
import { SCREEN_IDS } from './screenTime.ts'
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

export interface PlaybookSummary {
  /** This week's uses, oldest first (several per day are allowed by the model). */
  entries: LifePlaybookEntry[]
  total: number
  /** Distinct days used, ascending. */
  days: string[]
}

export interface WeekSummary {
  /** The week's playbook practice use; null when the plan has no playbook. */
  playbook: PlaybookSummary | null
  focusDone: Set<string>
  /** Focus ids cancelled this week: shown struck through, left out of every count. */
  focusCancelled: Set<string>
  /** Focus items still counting: the plan's minus the cancelled ones. */
  focusTotal: number
  /** Every check-in of the plan with its status, by date (then plan order). */
  checkins: CheckinStatus[]
  trackers: TrackerSummary[]
  answers: Map<string, LifeAnswer>
  /** Screen-time answers by reserved id (SCREEN_QUESTIONS); kept apart from `answers`. */
  screen: Map<string, LifeAnswer>
  /** Question ids whose answer was computed from a linked tracker. */
  autoAnswered: Set<string>
  sentTaskIds: Set<string>
  /** Spock test: tracker id -> why it missed its target this week (non-empty only). */
  whys: Map<string, string>
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
    playbook: new Set(plan.playbook ? ['playbook'] : []),
    why: new Set(plan.trackers.map((t) => t.id)),
  }

  const focusDone = new Set<string>()
  const focusCancelled = new Set<string>()
  const answers = new Map<string, LifeAnswer>()
  const screen = new Map<string, LifeAnswer>()
  const sentTaskIds = new Set<string>()
  const checkinValues = new Map<string, { done: boolean; note?: string }>()
  const whys = new Map<string, string>()
  const removed: LifeEntry[] = []

  for (const e of mine) {
    // Ideas belong to the habit across weeks, not to a week (see habitHistory.ts).
    if (e.kind === 'idea' || e.kind === 'upgrade' || e.kind === 'streak' || e.kind === 'chore') continue
    if (e.kind === 'sunday' && SCREEN_IDS.has(e.ref)) {
      if (e.value.answer !== null) screen.set(e.ref, e.value.answer)
      continue
    }
    const known = ids[e.kind].has(e.ref)
    if (!known) {
      if (isMeaningful(e)) removed.push(e)
      continue
    }
    if (e.kind === 'focus' && e.value.cancelled) focusCancelled.add(e.ref)
    else if (e.kind === 'focus' && e.value.done) focusDone.add(e.ref)
    else if (e.kind === 'sunday' && e.value.answer !== null) answers.set(e.ref, e.value.answer)
    else if (e.kind === 'sent' && e.value.sent) sentTaskIds.add(e.ref)
    else if (e.kind === 'checkin') checkinValues.set(e.ref, e.value)
    else if (e.kind === 'why' && e.value.reason.trim()) whys.set(e.ref, e.value.reason.trim())
  }

  const playbookEntries = mine.filter((e): e is LifePlaybookEntry => e.kind === 'playbook' && e.ref === 'playbook')
  const playbook: PlaybookSummary | null = plan.playbook
    ? {
        entries: playbookEntries,
        total: playbookEntries.length,
        days: [...new Set(playbookEntries.map((e) => e.day))].sort(),
      }
    : null

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

  return {
    playbook,
    focusDone,
    focusCancelled,
    focusTotal: plan.focus.filter((f) => !focusCancelled.has(f.id)).length,
    checkins,
    trackers,
    answers,
    screen,
    autoAnswered,
    sentTaskIds,
    whys,
    removed,
  }
}

function isMeaningful(e: LifeEntry): boolean {
  switch (e.kind) {
    case 'tracker':
    case 'playbook':
      return true
    case 'focus':
      return e.value.done
    case 'sunday':
      return e.value.answer !== null
    case 'sent':
      return e.value.sent
    case 'checkin':
      return e.value.done || !!e.value.note?.trim()
    case 'why':
      return !!e.value.reason.trim()
    case 'idea':
    case 'upgrade':
    case 'streak':
    case 'chore':
      return false
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
