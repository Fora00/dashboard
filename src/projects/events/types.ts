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
}

export interface EventsFile {
  schemaVersion: 1
  generatedAt: string
  sources: EventSource[]
  events: EventItem[]
}
