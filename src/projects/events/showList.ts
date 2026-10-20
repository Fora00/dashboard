// The Shows page: cinema screenings, theatre and concerts on one day-by-day
// timeline. Screenings are grouped by film (screenings.ts); a play or a concert
// is one entry. Theatre and concerts also stay in the event list.
import type { EventItem } from './types'
import { isLongRunning, isOver, listingDay, localDay } from './model'
import { isScreening } from './screenings'

export type ShowKind = 'cinema' | 'theatre' | 'concerts'

/** How far ahead the day strip goes (the theatre seasons run for months). */
export const HORIZON_DAYS = 60

/** A play or a concert (not a screening, festival or exhibition). */
export function isStage(e: EventItem): boolean {
  return e.category === 'theatre' || e.category === 'concerts'
}

/** Which kind of show a record is; null when it is not one. */
export function showKind(e: EventItem): ShowKind | null {
  if (isScreening(e)) return 'cinema'
  return isStage(e) ? (e.category as ShowKind) : null
}

/** Upcoming shows: screenings, plays and concerts that are not over or long-running runs. */
export function upcomingShows(events: readonly EventItem[], now: number): EventItem[] {
  return events
    .filter((e) => showKind(e) !== null && !isOver(e, now) && !(isStage(e) && isLongRunning(e, now)))
    .sort((a, b) => Date.parse(a.start) - Date.parse(b.start))
}

/** The day a show is listed under (a screening: its start day). */
export function showDay(e: EventItem, now: number): string {
  return isScreening(e) ? localDay(e.start) : listingDay(e, now)
}

/** Plays and concerts of one day, by start time, optionally one kind and one town. */
export function stageOn(
  shows: readonly EventItem[],
  day: string,
  now: number,
  kind: ShowKind | null,
  city: string | null,
): EventItem[] {
  return shows.filter(
    (e) => isStage(e) && (!kind || e.category === kind) && (!city || e.city === city) && showDay(e, now) === day,
  )
}
