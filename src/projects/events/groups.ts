import type { DayGroup } from './model'
import type { EventItem } from './types'
import { normalizeText } from './filters'

// Repeats of the same thing (a weekly game night listed as separate records,
// a play on 17 evenings) collapse into one row. Pure, no React. Not to be
// confused with the crawler's fold (`occurrences`, foldScreenings): that makes
// ONE record out of many dates; this joins several records that stayed apart.

/** A pair of dates stays as two cards. */
export const MIN_REPEATS = 3

/** Same normalized title in the same city (the venue may differ). */
export function repeatKey(e: Pick<EventItem, 'title' | 'city'>): string {
  return `${normalizeText(e.title)}|${normalizeText(e.city)}`
}

export interface Collapsed {
  /** The day groups with every repeat but the next occurrence removed. */
  days: DayGroup[]
  /** next occurrence's id -> all its dates (the next one first, then the rest in list order). */
  repeats: Map<string, EventItem[]>
}

/**
 * Collapses 3+ records with the same title and city into the first one in
 * list order (their next occurrence), which keeps its position. Only for the
 * dated day groups of the main view: pass `grouped = false` for the Saved and
 * Open-now views; the 'open-now' group is never touched. `standalone` records
 * (saved, hidden, hand-added) and cinema screenings are never grouped, so
 * they stay on their own.
 * Save/Hide on the group's card therefore applies to the next occurrence only
 * (saving it takes it out of the group); there are no group-level marks.
 */
export function collapseRepeats(
  days: DayGroup[],
  grouped: boolean,
  standalone: (e: EventItem) => boolean = () => false,
): Collapsed {
  const repeats = new Map<string, EventItem[]>()
  if (!grouped) return { days, repeats }
  const byKey = new Map<string, EventItem[]>()
  for (const g of days) {
    if (g.key === 'open-now') continue
    for (const e of g.events) {
      if (standalone(e)) continue
      // Cinema screenings are per day by nature: never folded into one row.
      if (e.category === 'cinema') continue
      const k = repeatKey(e)
      const list = byKey.get(k)
      if (list) list.push(e)
      else byKey.set(k, [e])
    }
  }
  const dropped = new Set<string>()
  for (const list of byKey.values()) {
    const [lead, ...rest] = list
    if (!lead || list.length < MIN_REPEATS) continue
    repeats.set(lead.id, list)
    for (const e of rest) dropped.add(e.id)
  }
  if (repeats.size === 0) return { days, repeats }
  const out: DayGroup[] = []
  for (const g of days) {
    const events = g.key === 'open-now' ? g.events : g.events.filter((e) => !dropped.has(e.id))
    if (events.length) out.push(events.length === g.events.length ? g : { ...g, events })
  }
  return { days: out, repeats }
}
