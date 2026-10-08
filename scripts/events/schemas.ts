// Runtime validation for the crawler's untrusted inputs (zod is a devDependency:
// scripts only, nothing here ships in the PWA bundle). A source that changes
// its format now fails loudly with the adapter named, instead of returning
// zero events or crashing on `undefined`.
import { z } from 'zod'
import { CATEGORIES } from './tags.ts'

const DAY = /^\d{4}-\d{2}-\d{2}$/

/** One hand-curated entry of spot.json. */
export const SpotEntrySchema = z
  .object({
    id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'id must be kebab-case'),
    title: z.string().min(1),
    start: z.string().regex(DAY, 'start must be YYYY-MM-DD'),
    end: z.string().regex(DAY, 'end must be YYYY-MM-DD'),
    city: z.string().min(1),
    venue: z.string().optional(),
    url: z.url({ protocol: /^https?$/ }),
    image: z.url({ protocol: /^https$/ }).optional(),
    summary: z.string().min(1),
    tags: z.array(z.string()).optional(),
    category: z.string().optional(),
    /** false = dates not confirmed on the official site: shown as "dates to be confirmed". Default true. */
    verified: z.boolean().default(true),
  })
  .refine((e) => e.start <= e.end, { message: 'end is before start', path: ['end'] })

export type SpotEntry = z.infer<typeof SpotEntrySchema>

const CATEGORY_IDS = new Set<string>(CATEGORIES.map((c) => c.id))

/** spot.json: entries as above, ids unique across the file, `category` one of tags.ts CATEGORIES. */
export const SpotFileSchema = z.object({ events: z.array(SpotEntrySchema) }).superRefine((file, ctx) => {
  const seen = new Map<string, number>()
  file.events.forEach((e, i) => {
    const first = seen.get(e.id)
    if (first !== undefined)
      ctx.addIssue({
        code: 'custom',
        message: `duplicate id "${e.id}" (also events.${first}): ids must be unique`,
        path: ['events', i, 'id'],
      })
    else seen.set(e.id, i)
    if (e.category !== undefined && !CATEGORY_IDS.has(e.category))
      ctx.addIssue({
        code: 'custom',
        message: `unknown category "${e.category}" (known: ${[...CATEGORY_IDS].join(', ')})`,
        path: ['events', i, 'category'],
      })
  })
})

/** Top-level shape of a previously published events.json (records are kept as-is). */
export const PreviousFileSchema = z.looseObject({
  schemaVersion: z.literal(1),
  generatedAt: z.string().optional(),
  sources: z.array(z.unknown()),
  events: z.array(z.unknown()),
})

/**
 * The minimum a carried-over record of the previous events.json needs for the
 * pipeline (window, withPlace, dedup) not to crash on it. Missing optional
 * bits get safe defaults; a record without id/title/start/source is dropped.
 */
export const PreviousEventSchema = z
  .looseObject({
    id: z.string().min(1),
    title: z.string().trim().min(1),
    start: z.string().refine((s) => !Number.isNaN(Date.parse(s)), 'start is not a date'),
    source: z.string().min(1),
    end: z
      .string()
      .refine((s) => !Number.isNaN(Date.parse(s)))
      .nullable()
      .catch(null),
    allDay: z.boolean().catch(false),
    city: z.string().catch(''),
    sources: z.array(z.string()).optional().catch(undefined),
    tags: z.array(z.string()).catch([]),
    description: z.string().catch(''),
    summary: z.string().catch(''),
  })
  .transform((e) => ({ ...e, sources: e.sources?.length ? e.sources : [e.source] }))

/** Split the previous file's records into usable ones and a count of dropped ones (with the first problem). */
export function validPreviousEvents(records: readonly unknown[]): {
  events: z.infer<typeof PreviousEventSchema>[]
  dropped: number
  firstBad: string
} {
  const events: z.infer<typeof PreviousEventSchema>[] = []
  let dropped = 0
  let firstBad = ''
  records.forEach((r, i) => {
    const res = PreviousEventSchema.safeParse(r)
    if (res.success) events.push(res.data)
    else {
      dropped++
      firstBad ||= `events.${i}: ${describeIssues(res.error, 2)}`
    }
  })
  return { events, dropped, firstBad }
}

/** Readable "path: message" lines for a failed parse. */
export function describeIssues(error: z.ZodError, max = 5): string {
  const lines = error.issues.slice(0, max).map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`)
  if (error.issues.length > max) lines.push(`…and ${error.issues.length - max} more`)
  return lines.join('; ')
}

/** Parse or throw one Error naming `label` (the adapter / file) and the first problems. */
export function parseOrThrow<S extends z.ZodType>(schema: S, data: unknown, label: string): z.infer<S> {
  const res = schema.safeParse(data)
  if (!res.success) throw new Error(`${label}: unexpected format (${describeIssues(res.error)})`)
  return res.data
}

/**
 * Validate a list of records from a third-party source one by one: a few odd
 * records are skipped, but if more than half do not fit, the source changed
 * its format and the adapter fails (the crawl carries its old events over).
 */
export function parseList<S extends z.ZodType>(schema: S, items: unknown, label: string): z.infer<S>[] {
  if (!Array.isArray(items)) throw new Error(`${label}: expected a list, got ${items === null ? 'null' : typeof items}`)
  const ok: z.infer<S>[] = []
  let firstBad = ''
  let bad = 0
  for (const item of items) {
    const res = schema.safeParse(item)
    if (res.success) ok.push(res.data)
    else {
      bad++
      firstBad ||= describeIssues(res.error, 2)
    }
  }
  if (bad > 0 && bad * 2 > items.length) {
    throw new Error(`${label}: ${bad}/${items.length} records do not match the expected shape (${firstBad})`)
  }
  if (bad > 0) console.log(`  ${label}: skipped ${bad} malformed record(s) (${firstBad})`)
  return ok
}
