import type { EventMark } from '../../../lib/db'
import type { EventItem } from '../../events/types'
import { addDays } from './dates.ts'

// The owner's saved events of the week AFTER the exported one, for the
// /settimana export (the Sunday planning session places them in the coming
// plan). Pure: callers pass the marks and the favourite categories.

export const MAX_SAVED_EVENTS = 30

export interface SavedEventsNextWeek {
  /** Saved events overlapping next Monday..Sunday, by start, at most MAX_SAVED_EVENTS. */
  events: EventItem[]
  /** Favourite category labels, in the owner's order (callers pass labels, not ids: events/model.ts
   *  reads import.meta.env, which the scripts' tsconfig, that also pulls in this folder, lacks). */
  favouriteCategories: string[]
}

/** Local (Rome) day of an event ISO string: its own offset is Rome's. */
const dayOf = (iso: string) => iso.slice(0, 10)

/** `week` is the exported week's Monday; the result covers the following week. */
export function summarizeSavedEvents(
  marks: readonly EventMark[],
  week: string,
  favouriteCategoryLabels: readonly string[] = [],
): SavedEventsNextWeek {
  const from = addDays(week, 7)
  const to = addDays(week, 13)
  const events = marks
    .filter((m) => m.state === 'saved')
    .map((m) => m.event)
    .filter((e) => dayOf(e.start) <= to && dayOf(e.end ?? e.start) >= from)
    .sort((a, b) => (a.start < b.start ? -1 : a.start > b.start ? 1 : a.title.localeCompare(b.title)))
    .slice(0, MAX_SAVED_EVENTS)
  return { events, favouriteCategories: [...favouriteCategoryLabels] }
}
