// Spot events: big, specific events in far cities, curated by hand in
// scripts/events/spot.json (no network). See "Spot events" in docs/EVENTS.md.
import { readFile } from 'node:fs/promises'
import type { Adapter, RawEvent } from '../types.ts'
import type { CategoryId } from '../tags.ts'
import { SpotFileSchema, parseOrThrow } from '../schemas.ts'
import { dateToIso } from '../time.ts'

export const spot: Adapter = {
  id: 'spot',
  name: 'Spot (hand-curated)',
  defaultCategory: 'other',
  mayBeEmpty: true,
  // Hand-picked big events are wanted however far ahead (Arte Fiera, Play...).
  horizonDays: 540,
  // Area comes from the city map in areas.ts (add new towns there);
  // 'abroad' only for a town it does not know yet.
  area: 'abroad',
  ring: 'spot',
  async run() {
    const file = parseOrThrow(SpotFileSchema, JSON.parse(await readFile(new URL('../spot.json', import.meta.url), 'utf8')), 'spot.json')
    return file.events.map((e): RawEvent => ({
      nativeId: e.id,
      title: e.title,
      start: dateToIso(e.start),
      // All-day: end is local midnight of the LAST day, inclusive.
      end: dateToIso(e.end),
      allDay: true,
      venue: e.venue ?? null,
      city: e.city,
      url: e.url,
      image: e.image ?? null,
      description: e.summary,
      summary: e.summary,
      ...(e.category ? { categoryHint: e.category as CategoryId } : {}),
      ...(e.verified ? {} : { datesTentative: true }),
      tagText: (e.tags ?? []).join(' '),
    }))
  },
}
