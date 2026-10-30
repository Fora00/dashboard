// Rule-based suggestions for one habit, from its own numbers. Pure, no AI: each
// rule is a line from the playbook (anchor, floor, shrink it, never twice,
// up/stay/down, judge at 8-10 weeks) applied to the data. At most a few come
// back, most useful first. An action is a patch the user can apply with a tap.

import type { Habit, HabitDayState } from '../../lib/db'
import { daysBetween, shiftDayKey, type HabitStats } from './habitStats'
import { reasonLabel } from './habitStates'

export interface Suggestion {
  id: string
  text: string
  /** A change to the habit the user can apply with one tap. */
  action?: { label: string; patch: Partial<Habit> }
}

interface Input {
  habit: Habit
  stats: HabitStats
  states: ReadonlyMap<string, HabitDayState>
  notes: ReadonlyMap<string, string>
  today: string
  /** How many habits are open (not archived), this one included. */
  openCount: number
}

const WEEKDAYS = ['Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays', 'Sundays']
const MAX = 3

export function suggest({ habit, stats, states, notes, today, openCount }: Input): Suggestion[] {
  const out: Suggestion[] = []
  const avoid = habit.direction === 'avoid'
  const weeks = stats.lastWeeks.slice(-4)
  const full = weeks.length >= 3
  const hitRate = weeks.length ? weeks.filter((w) => w.hit).length / weeks.length : null

  // Reasons given in the last 30 days.
  const since = shiftDayKey(today, -29)
  const reasons: Record<string, number> = {}
  for (const [day, note] of notes) if (day >= since) reasons[note] = (reasons[note] ?? 0) + 1
  const [topReason, topN] = Object.entries(reasons).sort((a, b) => b[1] - a[1])[0] ?? ['', 0]

  // Cycle: ended or ending without a verdict.
  if (habit.cycleEnd && !habit.verdict) {
    const left = daysBetween(today, habit.cycleEnd)
    if (left < 0)
      out.push({
        id: 'verdict-late',
        text: 'The cycle ended and has no verdict yet. Look at the numbers and choose: up, stay, down or closed.',
      })
    else if (left <= 3)
      out.push({
        id: 'verdict-soon',
        text: `The cycle ends in ${left} day${left === 1 ? '' : 's'}. Decide the verdict on Sunday with the numbers in front of you.`,
      })
  }
  if (habit.cycleStart && daysBetween(habit.cycleStart, today) >= 56 && !habit.verdict) {
    out.push({
      id: 'judge',
      text: 'Eight weeks in: the point to judge a habit, not week 3. Keep it, change it, or close it.',
    })
  }

  // Two-day rule: a real gap.
  if (!avoid && stats.gap >= 2) {
    out.push({
      id: 'gap',
      text: `${stats.gap} days without it. Not a flaw: the setup slipped. Shrink the floor, move the anchor, or pause it.`,
    })
  }

  // Reasons point at a fix.
  if (topN >= 3) {
    const fix: Record<string, string> = {
      anchor: 'The anchor keeps failing: move it to something you already do every day, or make the cue visible.',
      energy: 'Energy keeps getting in the way: move it earlier in the day, or shrink the floor.',
      plan: 'The plan keeps failing: put it in the calendar with a time, not just in intention.',
      forgot:
        'You keep forgetting: attach it to an anchor, or put the thing in sight (book on the pillow, shoes by the door).',
      tired: 'Tired comes up often: move it earlier, or shrink the floor to something that costs nothing.',
      sick: 'Illness is not a failing: pause the cycle if it is long.',
      away: 'Travel breaks it often: write a travel version of the floor.',
    }
    out.push({
      id: `reason-${topReason}`,
      text: `${reasonLabel(topReason)} ×${topN} this month. ${fix[topReason] ?? 'Look at what repeats.'}`,
    })
  }

  // A weekday that keeps failing.
  if (!avoid && stats.target === 7) {
    const miss = [0, 0, 0, 0, 0, 0, 0]
    const from = shiftDayKey(today, -55)
    for (let day = from; day < today; day = shiftDayKey(day, 1)) {
      if (day < (habit.cycleStart ?? from)) continue
      const st = states.get(day)
      if (st === 'done' || st === 'floor' || st === 'skip') continue
      miss[(new Date(`${day}T12:00:00`).getDay() + 6) % 7]!++
    }
    const worst = miss.indexOf(Math.max(...miss))
    const rest = (miss.reduce((a, b) => a + b, 0) - miss[worst]!) / 6
    if (miss[worst]! >= 3 && miss[worst]! >= rest * 2) {
      out.push({
        id: 'weekday',
        text: `${WEEKDAYS[worst]} are where it breaks (${miss[worst]} misses in 8 weeks). Give that day its own anchor or a lighter floor.`,
      })
    }
  }

  // Too hard: shrink. Too easy: go up.
  if (full && hitRate !== null && hitRate <= 0.25 && !avoid) {
    if (stats.target > 1) {
      out.push({
        id: 'shrink-target',
        text: `You reached the weekly target in ${weeks.filter((w) => w.hit).length} of the last ${weeks.length} weeks. If you stopped, it was not small enough: aim lower for a while.`,
        action: { label: `Lower to ${stats.target - 1}× a week`, patch: { target: stats.target - 1 } },
      })
    } else {
      out.push({
        id: 'shrink-floor',
        text: 'It keeps slipping even once a week: shrink the floor until it is ridiculous.',
      })
    }
  }
  if (full && hitRate === 1 && !habit.verdict) {
    out.push({
      id: 'go-up',
      text: 'Four weeks in a row on target. Rule: go up one level, or leave it and add nothing. One lever at a time.',
      action: { label: 'Mark verdict: up', patch: { verdict: 'up' } },
    })
  }

  // Multi-tap: usually one short.
  if ((habit.perDay ?? 1) > 1 && stats.rate30 !== null && stats.rate30 < 0.4) {
    out.push({
      id: 'per-day',
      text: `Reaching ${habit.perDay} taps is rare. Try ${Math.max(1, (habit.perDay ?? 2) - 1)} for a month.`,
      action: {
        label: `Lower to ${Math.max(1, (habit.perDay ?? 2) - 1)} taps`,
        patch: { perDay: Math.max(1, (habit.perDay ?? 2) - 1) },
      },
    })
  }

  // Setup is missing pieces.
  if (!habit.anchor?.trim()) {
    out.push({
      id: 'no-anchor',
      text: avoid
        ? 'Write what you do instead when the urge comes: the replacement makes it easier.'
        : 'No anchor yet: say after what, and where. Habits with an anchor survive.',
    })
  }
  if (!habit.floor?.trim()) {
    out.push({
      id: 'no-floor',
      text: avoid
        ? 'No limit yet: decide the most you allow on a bad day, so a bad day is not a full slip.'
        : 'No floor yet: on your worst day you will have nothing small enough to do.',
    })
  }
  if (!habit.why?.trim())
    out.push({
      id: 'no-why',
      text: 'No “why” yet: what it serves and what it costs. Without a price it is dropped in the first bad week.',
    })

  // Solo habits are the fragile ones.
  if (habit.social === 'alone' && stats.rate30 !== null && stats.rate30 < 0.5 && !avoid) {
    out.push({
      id: 'add-person',
      text: 'Alone and slipping. Habits with a person hold: can someone do it with you, or hear about it on Sunday?',
    })
  }

  // Too many rest days.
  if (stats.restWeek >= 3)
    out.push({
      id: 'rest-many',
      text: `${stats.restWeek} rest days this week. A break, or avoiding something? If it is avoidance, the floor is enough.`,
    })

  // Too many open.
  if (openCount > 3 && !habit.verdict) {
    out.push({
      id: 'too-many',
      text: `${openCount} habits are open. Past 3, none gets finished: close one, or make this an experiment.`,
      ...(habit.kind === 'forever'
        ? { action: { label: 'Make it an experiment', patch: { kind: 'experiment' as const } } }
        : {}),
    })
  }

  // Good news, so it is not only warnings.
  if (out.length === 0 && stats.rate30 !== null && stats.rate30 >= 0.8) {
    out.push({ id: 'steady', text: 'Steady. Leave it as it is: no need to add anything.' })
  }
  return out.slice(0, MAX)
}
