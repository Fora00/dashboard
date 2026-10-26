import type { EventMark, LifeAnswer, LifeEntry, LifePlan, LifeQuestion, MealEntry } from '../../../lib/db'
import { withCheckinIds } from './checkinIds.ts'
import { dayKey, weekDays } from './dates.ts'
import { summarizeSavedEvents } from './events.ts'
import { parseApps } from './apps.ts'
import { fenceFor } from './fence.ts'
import { describeLearningActivity, type LearningWeek } from './learning.ts'
import { summarizeMealsWeek } from './meals.ts'
import { SCREEN_QUESTIONS } from './screenTime.ts'
import { summarizeWeek } from './summary.ts'
import { doneLast7, sortStreaks, streaksForExport } from './streaks.ts'
import { summarizeUpgrades, upgradesForExport } from './upgrades.ts'

// --- Export ---------------------------------------------------------------------

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function formatAnswer(q: LifeQuestion | undefined, a: LifeAnswer): string {
  if (a === null) return '—'
  if (typeof a === 'boolean') return a ? 'yes' : 'no'
  if (q?.type === 'scale5') return `${a}/5`
  if (q?.type === 'apps')
    return (
      parseApps(a)
        .map((r) => `${r.app} ${r.minutes}m`)
        .join(', ') || '—'
    )
  if (q?.type === 'duration' && typeof a === 'number') {
    const h = Math.floor(a / 60)
    const m = a % 60
    return h && m ? `${h}h ${m}m` : h ? `${h}h` : `${m}m`
  }
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
  savedEvents: {
    marks: readonly EventMark[]
    favouriteCategories: readonly string[]
  } = {
    marks: [],
    favouriteCategories: [],
  },
  learning: LearningWeek | null = null,
): string {
  const plan = withCheckinIds(planIn)
  const s = summarizeWeek(plan, entries, today)
  const mine = entries.filter((e) => e.week === plan.week)
  const out: string[] = [`# Week of ${plan.week}`, '']
  // Ideas travel across weeks (the caller passes them along with the week's entries).
  const ideasByHabit = new Map<string, Extract<LifeEntry, { kind: 'idea' }>[]>()
  for (const e of entries) {
    if (e.kind !== 'idea' || e.value.status === 'dropped') continue
    ideasByHabit.set(e.ref, [...(ideasByHabit.get(e.ref) ?? []), e])
  }
  // When it was done: the local day the keyed entry was last written on.
  const doneOn = (kind: LifeEntry['kind'], ref: string): string => {
    const e = mine.find((x) => x.kind === kind && x.ref === ref)
    return e ? ` (${DAY_NAMES[(new Date(`${e.day}T12:00:00Z`).getUTCDay() + 6) % 7]} ${e.day})` : ''
  }

  if (plan.focus.length) {
    out.push('## Focus', '')
    for (const f of plan.focus)
      out.push(
        `- [${s.focusDone.has(f.id) ? 'x' : ' '}] ${f.title}${s.focusDone.has(f.id) ? doneOn('focus', f.id) : ''}`,
      )
    out.push('')
  }

  if (s.playbook) {
    const pb = plan.playbook!
    out.push('## Playbook', '')
    out.push(`- Section: ${oneLine(pb.section)}`, `- Practice: ${oneLine(pb.practice)}`)
    if (pb.plan) out.push(`- Plan: ${oneLine(pb.plan)}`)
    const uses = s.playbook.total
    out.push(
      `- Uses: ${uses}${uses ? ` (${s.playbook.days.map((d) => `${DAY_NAMES[weekDays(plan.week).indexOf(d)] ?? ''} ${d}`.trim()).join(', ')})` : ''}`,
    )
    // One line per day: that day's notes collapsed together.
    for (const d of s.playbook.days) {
      const notes = s.playbook.entries
        .filter((e) => e.day === d && e.value.note?.trim())
        .map((e) => oneLine(e.value.note!))
      if (notes.length) out.push(`  - ${d}: ${notes.join(' · ')}`)
    }
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
      const why = s.whys.get(tracker.id)
      if (why) out.push(`  - why not: ${oneLine(why)}`)
      const ideas = ideasByHabit.get(tracker.id)
      if (ideas?.length)
        out.push(`  - ideas: ${ideas.map((i) => `${oneLine(i.value.text)} [${i.value.status}]`).join('; ')}`)
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

  if (plan.recap?.length) {
    out.push('## Recap', '')
    for (const r of plan.recap) out.push(`- ${recapLine(r)}`)
    out.push('')
  }

  const upgrades = summarizeUpgrades(entries, plan.week)
  if (upgrades.openCount || upgrades.doneThisWeek.length || upgrades.droppedThisWeek.length) {
    const line = (e: (typeof upgrades.quick)[number]) => `  - ${oneLine(e.value.text)} (added ${e.week})`
    out.push('## Upgrade list', '')
    if (upgrades.quick.length) out.push('- Open, quick:', ...upgrades.quick.map(line))
    if (upgrades.big.length) out.push('- Open, bigger:', ...upgrades.big.map(line))
    if (upgrades.doneThisWeek.length)
      out.push(
        '- Done this week:',
        ...upgrades.doneThisWeek.map(
          (e) => `  - ${oneLine(e.value.text)} (${e.value.size}, ${e.value.doneAt ?? e.day})`,
        ),
      )
    if (upgrades.droppedThisWeek.length)
      out.push('- Dropped this week:', ...upgrades.droppedThisWeek.map((e) => `  - ${oneLine(e.value.text)}`))
    out.push('')
  }

  // The Streaks app's habits (read-only snapshot from the Mac), not this week's trackers.
  const streaks = sortStreaks(entries)
  if (streaks.length) {
    out.push('## Streaks', '')
    for (const { value: v } of streaks) {
      const best = v.best !== undefined ? ` (best ${v.best})` : ''
      out.push(
        `- ${v.emoji ? `${v.emoji} ` : ''}${oneLine(v.name)}: streak ${v.streak}${best} · ${doneLast7(v.days)}/7 done in the last 7 days · as of ${v.asOf}`,
      )
    }
    out.push('')
  }

  if (s.screen.size) {
    out.push('## Screen time', '')
    for (const q of SCREEN_QUESTIONS) {
      if (s.screen.has(q.id)) out.push(`- ${q.label}: ${formatAnswer(q, s.screen.get(q.id) ?? null)}`)
    }
    out.push('')
  }

  if (s.checkins.length) {
    out.push('## Check-ins', '')
    for (const c of s.checkins) {
      const flag = c.overdue ? ' (overdue)' : ''
      const note = c.note ? ` — ${oneLine(c.note)}` : ''
      out.push(
        `- [${c.done ? 'x' : ' '}] ${c.checkin.date} ${c.checkin.label}${flag}${c.done ? doneOn('checkin', c.checkin.id) : ''}${note}`,
      )
    }
    out.push('')
  }

  if (plan.tasks.length) {
    out.push('## Tasks', '')
    for (const t of plan.tasks) {
      out.push(
        `- ${t.title}${s.sentTaskIds.has(t.id) ? ` (sent to Things${doneOn('sent', t.id).replace(' (', ', ').replace(')', '')})` : ''}`,
      )
    }
    out.push('')
  }

  const food = summarizeMealsWeek(meals, plan.week)
  if (food.days.length) {
    const approx = food.approximate ? '≈ ' : ''
    out.push('## Food', '')
    if (food.average) {
      const a = food.average
      out.push(
        `- Average over ${food.loggedDays} logged day${food.loggedDays === 1 ? '' : 's'}: ${approx}${a.kcal} kcal · P ${a.proteinG} · C ${a.carbsG} · F ${a.fatG}`,
      )
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

  if (learning?.courses.length) {
    out.push('## Learning', '')
    for (const c of learning.courses) {
      out.push(
        `- ${c.emoji ? `${c.emoji} ` : ''}${c.title}: ${c.percent}% overall (${c.done}/${c.total}) · this week: ${describeLearningActivity(c)}${c.days.length ? ` on ${c.days.length} day${c.days.length === 1 ? '' : 's'}` : ''}`,
      )
      if (c.next) out.push(`  - next: ${c.next.title} (${c.next.percent}%)`)
    }
    out.push('')
  }

  const saved = summarizeSavedEvents(savedEvents.marks, plan.week, savedEvents.favouriteCategories)
  if (saved.events.length || saved.favouriteCategories.length) {
    out.push('## Saved events next week', '')
    for (const e of saved.events) {
      const day = e.start.slice(0, 10)
      const dow = DAY_NAMES[(new Date(`${day}T12:00:00Z`).getUTCDay() + 6) % 7]
      const time = e.allDay ? '' : ` ${e.start.slice(11, 16)}`
      const where = [e.venue, e.city].filter(Boolean).join(', ')
      out.push(`- ${dow} ${day}${time} · ${oneLine(e.title)}${where ? ` — ${oneLine(where)}` : ''}`)
    }
    if (saved.favouriteCategories.length) out.push(`Favourite categories: ${saved.favouriteCategories.join(', ')}`)
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
      .filter((e) => e.kind !== 'upgrade' && e.kind !== 'streak')
      .slice()
      .sort((a, b) => a.createdAt - b.createdAt)
      // `at` is the moment it was first logged (ISO, UTC), `day` the local day.
      .map(({ kind, ref, day, value, createdAt }) => ({
        kind,
        ref,
        day,
        at: new Date(createdAt).toISOString(),
        value,
      })),
    // Present only when the diary has entries this week.
    ...(food.days.length
      ? {
          meals: food.days.flatMap((d) =>
            d.entries.map(({ day, meal, text, weighed, mood, grams, kcal, proteinG, carbsG, fatG, estimated }) => ({
              day,
              meal,
              text,
              weighed: weighed === true,
              mood: mood ?? null,
              grams,
              kcal,
              proteinG,
              carbsG,
              fatG,
              estimated,
            })),
          ),
        }
      : {}),
    // Present only when the Upgrade list has something to say (open items, done/dropped this week).
    ...(upgrades.openCount || upgrades.doneThisWeek.length || upgrades.droppedThisWeek.length
      ? { upgrades: upgradesForExport(upgrades) }
      : {}),
    // Present only when there are Streaks habits; same shape the import's `streaks` takes.
    ...(streaks.length ? { streaks: streaksForExport(streaks) } : {}),
    // Present only when there are saved events next week.
    ...(saved.events.length
      ? {
          savedEvents: saved.events.map(({ id, title, start, end, allDay, city, venue, url, category }) => ({
            id,
            title,
            start,
            end,
            allDay,
            city,
            venue,
            url,
            category,
          })),
        }
      : {}),
  }
  const jsonText = JSON.stringify(json, null, 2)
  const fence = fenceFor(jsonText)
  out.push('<details>', '<summary>JSON</summary>', '', `${fence}json`, jsonText, fence, '', '</details>', '')
  return out.join('\n')
}

function recapLine(r: NonNullable<LifePlan['recap']>[number]): string {
  const parts: string[] = []
  if (r.weeks) parts.push(`${r.weeks.map((w) => `${w.done}/${w.of}`).join(', ')} (oldest to newest)`)
  if (r.returns !== undefined) parts.push(`${r.returns} return${r.returns === 1 ? '' : 's'}`)
  if (r.points?.length) {
    const first = r.points[0]!.value
    const last = r.points[r.points.length - 1]!.value
    parts.push(`${first} → ${last}${r.unit ? ` ${r.unit}` : ''}`)
  }
  if (r.criterion) parts.push(`${r.criterion.text}: ${r.criterion.met} of ${r.criterion.of}`)
  if (r.closed) parts.push('closed on purpose')
  return `${r.label}: ${parts.join(' · ')}`
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
    case 'playbook':
      return `playbook: used on ${e.day}${e.value.note?.trim() ? ` — ${oneLine(e.value.note)}` : ''}`
    case 'why':
      return `why not ${e.ref}: ${oneLine(e.value.reason)}`
    case 'upgrade':
      return `upgrade: ${oneLine(e.value.text)}`
    case 'streak':
      return `streak ${e.ref}: ${oneLine(e.value.name)}`
    case 'idea':
      return `idea ${e.ref}: ${oneLine(e.value.text)}`
    case 'checkin': {
      const parts = [e.value.done ? 'done' : null, e.value.note?.trim() ? oneLine(e.value.note) : null]
      return `check-in ${e.ref}: ${parts.filter(Boolean).join(' — ')}`
    }
  }
}
