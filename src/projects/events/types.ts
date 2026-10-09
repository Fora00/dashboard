// Mirrors the events.json schema (docs/EVENTS.md, schemaVersion 1). Kept
// separate from scripts/events on purpose. Unknown fields are ignored.

export interface EventSource {
  id: string
  name: string
  ok: boolean
  count: number
  error?: string
  lastSuccess: string | null
}

export interface EventItem {
  id: string
  title: string
  start: string
  end: string | null
  allDay: boolean
  ongoing: boolean
  venue: string | null
  city: string
  /** Area id (added 2026-09-29). Missing in older files: see areaOf() in model.ts. */
  area?: string
  /** 'home' | 'near' | 'spot' (added 2026-09-29). Missing in older files = 'home'. */
  ring?: string
  url: string
  source: string
  sources: string[]
  category: string
  tags: string[]
  description: string
  summary: string
  image: string | null
  occurrences: number
  fetchedAt: string
  /** Hand-added spot event whose dates are not confirmed (added 2026-10-05). */
  datesTentative?: true
  /** UTC ISO time the id first appeared in events.json (added 2026-10-09). Absent = never "new". */
  firstSeen?: string
}

export interface EventsFile {
  schemaVersion: 1
  generatedAt: string
  sources: EventSource[]
  events: EventItem[]
}

// The owner's 👍 / 👎 on an event (src/projects/events/interest.ts). Here, not
// there, so src/lib/db.ts can name them without importing the events model.
export type InterestValue = 1 | -1

export interface InterestFeatures {
  /** Snapshot format, bumped if the fields change meaning. */
  v: 1
  /** categoryOf(): unknown crawler categories collapse to 'other'. */
  category: string
  tags: string[]
  city: string
  source: string
  sources: string[]
  /** 'home' | 'near' | 'spot'; missing in old files = 'home'. */
  ring: string
  /** areaOf(): the area id, derived from the city in old files. */
  area: string
  /** Day of the start in Europe/Rome, ISO numbering: 1 = Monday … 7 = Sunday. */
  weekday: number | null
  /** Hour of the start in Europe/Rome (0-23); null for all-day / date-only. */
  hour: number | null
}
