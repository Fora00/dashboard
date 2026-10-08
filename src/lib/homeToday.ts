import type { Habit, HabitCheck, LifeEntry, LifePlan } from './db'
import { isLongRunning, isOver, localDay, romeDate } from '../projects/events/model'
import type { EventItem } from '../projects/events/types'
import { summarizeWeek } from '../projects/life/model/summary'

// Pure helpers behind Home's "Today" panel (UI4). No React, no Dexie: the
// panel reads local tables and hands the rows here.

export interface HabitProgress {
  done: number
  total: number
}

/** Active (non-archived) habits and how many are checked on `day`. */
export function habitProgress(habits: readonly Habit[], checks: readonly HabitCheck[], day: string): HabitProgress {
  const active = habits.filter((h) => h.archivedAt === undefined)
  const doneIds = new Set(checks.filter((c) => c.day === day).map((c) => c.habitId))
  return {
    total: active.length,
    done: active.filter((h) => doneIds.has(h.id)).length,
  }
}

/**
 * The next `limit` events still to come: not over, not already running since
 * an earlier day (those are exhibitions, not "next"), soonest first.
 */
export function nextEvents(events: readonly EventItem[], now: number, limit = 3): EventItem[] {
  return events
    .filter((e) => !isOver(e, now) && !isLongRunning(e, now))
    .slice()
    .sort((a, b) => Date.parse(a.start) - Date.parse(b.start) || a.title.localeCompare(b.title))
    .slice(0, limit)
}

/** Short "when" for a card row: "Today 19:30", "Tomorrow", "Sat 12 Oct". */
export function eventWhen(e: EventItem, now: number): string {
  const day = localDay(e.start)
  const today = romeDate(now)
  const tomorrow = romeDate(now + 24 * 3600 * 1000)
  const time = e.allDay ? '' : ` ${e.start.slice(11, 16)}`
  if (day <= today) return `Today${time}`
  if (day === tomorrow) return `Tomorrow${time}`
  const d = new Date(`${day}T12:00:00Z`)
  const label = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  })
  return `${label.format(d).replace(',', '')}${time}`
}

export interface LifeToday {
  focusTotal: number
  focusDone: number
  /** First focus items not yet done, for the card's lines. */
  focusOpen: string[]
  /** Trackers that have a weekly target: logged / target. */
  trackers: { label: string; emoji: string; total: number; target: number }[]
}

/** Life focus + tracker progress of the plan's week (entries are that week's). */
export function lifeToday(plan: LifePlan, entries: readonly LifeEntry[], today: string): LifeToday {
  const s = summarizeWeek(plan, entries, today)
  const open = plan.focus.filter((f) => !s.focusDone.has(f.id))
  return {
    focusTotal: plan.focus.length,
    focusDone: plan.focus.length - open.length,
    focusOpen: open.slice(0, 2).map((f) => f.title),
    trackers: s.trackers
      .filter((t) => t.tracker.target !== null)
      .map((t) => ({
        label: t.tracker.label,
        emoji: t.tracker.emoji,
        total: t.total,
        target: t.tracker.target ?? 0,
      })),
  }
}
