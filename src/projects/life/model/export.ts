import type { LifeAnswer, LifeEntry, LifePlan, LifeQuestion, MealEntry } from '../../../lib/db'
import { withCheckinIds } from './checkinIds.ts'
import { dayKey, weekDays } from './dates.ts'
import { summarizeMealsWeek } from './meals.ts'
import { summarizeWeek } from './summary.ts'

// --- Export ---------------------------------------------------------------------

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function formatAnswer(q: LifeQuestion | undefined, a: LifeAnswer): string {
  if (a === null) return '—'
  if (typeof a === 'boolean') return a ? 'yes' : 'no'
  if (q?.type === 'scale5') return `${a}/5`
  return String(a)
}

function energyPair(e: Extract<LifeEntry, { kind: 'tracker' }>): string | null {
  const { energyBefore: b, energyAfter: a } = e.value
  if (b === undefined && a === undefined) return null
  return `${b ?? '?'}→${a ?? '?'}`
}

/** Markdown for the week: focus, trackers per day + energy, Sunday, check-ins,
 *  tasks, food (the meal diary's entries of the week, when given), entries removed from the plan, and the raw JSON in a <details>
 *  block. `today` (a day key) only marks overdue check-ins. */
export function buildExportMarkdown(
  planIn: LifePlan,
  entries: readonly LifeEntry[],
  today: string = dayKey(new Date()),
  meals: readonly MealEntry[] = [],
): string {
  const plan = withCheckinIds(planIn)
  const s = summarizeWeek(plan, entries, today)
  const mine = entries.filter((e) => e.week === plan.week)
  const out: string[] = [`# Week of ${plan.week}`, '']

  if (plan.focus.length) {
    out.push('## Focus', '')
    for (const f of plan.focus) out.push(`- [${s.focusDone.has(f.id) ? 'x' : ' '}] ${f.title}`)
    out.push('')
  }

  if (s.trackers.length) {
    out.push('## Trackers', '')
    for (const t of s.trackers) {
      const { tracker } = t
      const goal = tracker.target !== null ? ` / ${tracker.target}` : ''
      const cap = tracker.max !== null ? ` (max ${tracker.max}${t.atMax ? ', reached' : ''})` : ''
      out.push(`- ${tracker.emoji ? `${tracker.emoji} ` : ''}${tracker.label}: ${t.total}${goal}${cap}`)
      const days = t.perDay
        .map((n, i) => (n ? `${DAY_NAMES[i]} ${n}` : null))
        .filter(Boolean)
        .join(' · ')
      if (days) out.push(`  - ${days}`)
      const pairs = t.entries.map(energyPair).filter(Boolean)
      if (pairs.length) out.push(`  - energy: ${pairs.join(', ')}`)
    }
    out.push('')
  }

  if (plan.sundayCheck.length) {
    out.push('## Sunday check', '')
    for (const q of plan.sundayCheck) {
      const auto = s.autoAnswered.has(q.id) ? ' (from tracker)' : ''
      out.push(`- ${q.label}: ${formatAnswer(q, s.answers.get(q.id) ?? null)}${auto}`)
    }
    out.push('')
  }

  if (s.checkins.length) {
    out.push('## Check-ins', '')
    for (const c of s.checkins) {
      const flag = c.overdue ? ' (overdue)' : ''
      const note = c.note ? ` — ${oneLine(c.note)}` : ''
      out.push(`- [${c.done ? 'x' : ' '}] ${c.checkin.date} ${c.checkin.label}${flag}${note}`)
    }
    out.push('')
  }

  if (plan.tasks.length) {
    out.push('## Tasks', '')
    for (const t of plan.tasks) {
      out.push(`- ${t.title}${s.sentTaskIds.has(t.id) ? ' (sent to Things)' : ''}`)
    }
    out.push('')
  }

  const food = summarizeMealsWeek(meals, plan.week)
  if (food.days.length) {
    const approx = food.approximate ? '≈ ' : ''
    out.push('## Food', '')
    if (food.average) {
      const a = food.average
      out.push(`- Average over ${food.loggedDays} logged day${food.loggedDays === 1 ? '' : 's'}: ${approx}${a.kcal} kcal · P ${a.proteinG} · C ${a.carbsG} · F ${a.fatG}`)
    } else {
      out.push('- Entries logged, no calories or macros entered')
    }
    for (const d of food.days) {
      const t = d.totals
      const label = DAY_NAMES[weekDays(plan.week).indexOf(d.day)] ?? d.day
      const sum = t.counted
        ? `${t.approximate ? '≈ ' : ''}${t.kcal} kcal · P ${t.proteinG} · C ${t.carbsG} · F ${t.fatG}${t.uncounted ? ` (${t.uncounted} without values)` : ''}`
        : 'no values'
      out.push(`- ${label} ${d.day}: ${sum}`)
      for (const m of d.entries) {
        const kcal = m.kcal === null ? '' : ` — ${m.estimated ? '≈ ' : ''}${m.kcal} kcal`
        out.push(`  - ${m.meal}: ${oneLine(m.text)}${m.weighed ? ' (weighed)' : ''}${kcal}`)
      }
    }
    out.push('')
  }

  if (s.removed.length) {
    out.push('## Removed from plan', '')
    for (const e of s.removed) out.push(`- ${describeRemoved(e)} (removed from plan)`)
    out.push('')
  }

  const json = {
    plan,
    entries: mine
      .slice()
      .sort((a, b) => a.createdAt - b.createdAt)
      .map(({ kind, ref, day, value }) => ({ kind, ref, day, value })),
    // Present only when the diary has entries this week.
    ...(food.days.length
      ? {
          meals: food.days.flatMap((d) =>
            d.entries.map(({ day, meal, text, weighed, grams, kcal, proteinG, carbsG, fatG, estimated }) => ({ day, meal, text, weighed: weighed === true, grams, kcal, proteinG, carbsG, fatG, estimated })),
          ),
        }
      : {}),
  }
  out.push(
    '<details>',
    '<summary>JSON</summary>',
    '',
    '```json',
    JSON.stringify(json, null, 2),
    '```',
    '',
    '</details>',
    '',
  )
  return out.join('\n')
}

/** A note on one Markdown list line (newlines would break the list). */
function oneLine(s: string): string {
  return s.trim().replace(/\s*\n+\s*/g, ' / ')
}

function describeRemoved(e: LifeEntry): string {
  switch (e.kind) {
    case 'tracker': {
      const pair = energyPair(e)
      return `tracker ${e.ref}: +1 on ${e.day}${pair ? `, energy ${pair}` : ''}`
    }
    case 'focus':
      return `focus ${e.ref}: done`
    case 'sunday':
      return `Sunday ${e.ref}: ${formatAnswer(undefined, e.value.answer)}`
    case 'sent':
      return `task ${e.ref}: sent to Things`
    case 'checkin': {
      const parts = [e.value.done ? 'done' : null, e.value.note?.trim() ? oneLine(e.value.note) : null]
      return `check-in ${e.ref}: ${parts.filter(Boolean).join(' — ')}`
    }
  }
}
