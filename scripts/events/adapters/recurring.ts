// Recurring activities with a fixed weekly timetable (a games night, a
// conversation group, a course), curated by hand in scripts/events/recurring.json
// because their sites publish a timetable, not a calendar. No network. Each
// meeting becomes one dated event; series.ts then recognises them as ONE
// series. See "Recurring activities" in docs/EVENTS.md.
import { readFile } from 'node:fs/promises'
import type { Adapter, AdapterContext, RawEvent } from '../types.ts'
import type { CategoryId } from '../tags.ts'
import { RecurringFileSchema, parseOrThrow, type RecurringEntry } from '../schemas.ts'
import { addDays, instantToIso, localToIso, romeDate } from '../time.ts'

const WEEKDAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

/** Monday = 0 … Sunday = 6 of a YYYY-MM-DD date. */
function weekdayOf(date: string): number {
  return (new Date(`${date}T12:00:00Z`).getUTCDay() + 6) % 7
}

/** Meeting dates of one entry between `today` and the horizon, inside its own run. */
export function meetingDates(a: RecurringEntry, today: string, horizon: string): string[] {
  const first = a.from > today ? a.from : today
  const last = a.until < horizon ? a.until : horizon
  const wanted = new Set(a.weekdays.map((d) => WEEKDAYS.indexOf(d)))
  const skip = new Set(a.skip)
  // Weeks are counted from the Monday of the run's first week, so "every 2 weeks" stays on the same weeks.
  const startMonday = addDays(a.from, -weekdayOf(a.from))
  const out: string[] = []
  for (let d = first; d <= last; d = addDays(d, 1)) {
    if (!wanted.has(weekdayOf(d)) || skip.has(d)) continue
    const weeks = Math.round(
      (Date.parse(`${addDays(d, -weekdayOf(d))}T00:00:00Z`) - Date.parse(`${startMonday}T00:00:00Z`)) / 604_800_000,
    )
    if (weeks % a.everyWeeks === 0) out.push(d)
  }
  return out
}

export function expand(a: RecurringEntry, now: number, horizonDays: number): RawEvent[] {
  const today = romeDate(now)
  return meetingDates(a, today, addDays(today, horizonDays)).map((date): RawEvent => {
    const start = localToIso(date, a.time)
    return {
      nativeId: `${a.id}@${date}`,
      title: a.title,
      start,
      end: a.durationMin ? instantToIso(Date.parse(start) + a.durationMin * 60_000) : null,
      allDay: false,
      venue: a.venue ?? null,
      city: a.city,
      url: a.url,
      description: a.summary,
      summary: a.summary,
      ...(a.category ? { categoryHint: a.category as CategoryId } : {}),
      ...(a.verified ? {} : { datesTentative: true as const }),
      tagText: (a.tags ?? []).join(' '),
    }
  })
}

export const recurring: Adapter = {
  id: 'recurring',
  name: 'Recurring activities (hand-curated)',
  defaultCategory: 'other',
  mayBeEmpty: true,
  async run(ctx: AdapterContext) {
    const file = parseOrThrow(
      RecurringFileSchema,
      JSON.parse(await readFile(new URL('../recurring.json', import.meta.url), 'utf8')),
      'recurring.json',
    )
    return file.activities.flatMap((a) => expand(a, ctx.now, ctx.horizonDays))
  },
}
