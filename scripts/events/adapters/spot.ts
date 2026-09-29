// Spot events: big, specific events in far cities, curated by hand in
// scripts/events/spot.json (no network). See "Spot events" in docs/EVENTS.md.
import { readFile } from 'node:fs/promises'
import type { Adapter, RawEvent } from '../types.ts'
import type { CategoryId } from '../tags.ts'
import { dateToIso } from '../time.ts'

interface SpotEntry {
  id: string
  title: string
  start: string
  end: string
  city: string
  venue?: string
  url: string
  summary: string
  tags?: string[]
  category?: CategoryId
}

export const spot: Adapter = {
  id: 'spot',
  name: 'Spot (hand-curated)',
  defaultCategory: 'other',
  mayBeEmpty: true,
  // Area comes from the city map in areas.ts (add new towns there);
  // 'abroad' only for a town it does not know yet.
  area: 'abroad',
  ring: 'spot',
  async run() {
    const file = JSON.parse(await readFile(new URL('../spot.json', import.meta.url), 'utf8')) as { events?: SpotEntry[] }
    return (file.events ?? []).map((e): RawEvent => ({
      nativeId: e.id,
      title: e.title,
      start: dateToIso(e.start),
      // All-day: end is local midnight of the LAST day, inclusive.
      end: dateToIso(e.end),
      allDay: true,
      venue: e.venue ?? null,
      city: e.city,
      url: e.url,
      description: e.summary,
      summary: e.summary,
      ...(e.category ? { categoryHint: e.category } : {}),
      tagText: (e.tags ?? []).join(' '),
    }))
  },
}
