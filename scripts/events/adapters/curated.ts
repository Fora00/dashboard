// Curated one-off timed events of places that only post a poster (e.g. on
// Instagram), kept by hand in scripts/events/curated.json. No network. See
// "Curated events" in docs/EVENTS.md.
import { readFile } from 'node:fs/promises'
import type { Adapter, RawEvent } from '../types.ts'
import type { CategoryId } from '../tags.ts'
import { CuratedFileSchema, parseOrThrow, type CuratedEntry } from '../schemas.ts'
import { localToIso } from '../time.ts'

export function toRaw(e: CuratedEntry): RawEvent {
  return {
    nativeId: e.id,
    title: e.title,
    start: localToIso(e.date, e.time),
    end: e.endTime ? localToIso(e.date, e.endTime) : null,
    allDay: false,
    venue: e.venue ?? null,
    city: e.city,
    url: e.url,
    image: e.image ?? null,
    description: e.summary,
    summary: e.summary,
    ...(e.category ? { categoryHint: e.category as CategoryId } : {}),
    ...(e.verified ? {} : { datesTentative: true as const }),
    tagText: (e.tags ?? []).join(' '),
  }
}

export const curated: Adapter = {
  id: 'curated',
  name: 'Curated events (hand-curated)',
  defaultCategory: 'other',
  mayBeEmpty: true,
  async run() {
    const file = parseOrThrow(
      CuratedFileSchema,
      JSON.parse(await readFile(new URL('../curated.json', import.meta.url), 'utf8')),
      'curated.json',
    )
    return file.events.map(toRaw)
  },
}
