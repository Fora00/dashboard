import { z } from 'zod'
import { decodeLinkParam, toBase64Url } from '../../lib/base64url.ts'
import { FEATURE_KEY_RE, featureKeyProblem } from './featureKeys.ts'

// The owner's interest SEED file for /events: its zod schema, the prefill
// link and the import preview. Shared by the app (Interests.tsx, a lazy
// chunk: zod never reaches the Events page) and scripts/events-seed-link.ts,
// so both validate with the same schema. Feature-key rules: featureKeys.ts.
//
// Keep this file free of model.ts / Vite imports: scripts are type-checked by
// tsconfig.node.json, which has no `import.meta.env` (model.ts uses it).
//
// The seed is the owner's personal starting guess (-1..1 per feature) and
// arrives only through the paste box or a link; real values never live in
// the repo.

export const MAX_SEED_KEYS = 200
/** Hard cap on pasted / linked seed text, checked before decode and JSON.parse. */
export const MAX_SEED_INPUT_CHARS = 50_000

export const SEED_LINK_BASE = 'https://fora00.github.io/dashboard/'

export const seedFileSchema = z
  .object({
    seed: z
      .record(z.string().regex(FEATURE_KEY_RE, 'key must be <kind>:<value>'), z.number().min(-1).max(1))
      .refine((s) => Object.keys(s).length <= MAX_SEED_KEYS, `at most ${MAX_SEED_KEYS} keys`),
  })
  .strict()

export type SeedResult = { ok: true; seed: Record<string, number> } | { ok: false; errors: string[] }

/** Validate a seed file's JSON text: `{ "seed": { "<featureKey>": number in [-1, 1] } }`. */
export function parseSeedJson(text: string): SeedResult {
  if (text.length > MAX_SEED_INPUT_CHARS) return { ok: false, errors: ['The seed is too large (over 50 KB).'] }
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    return { ok: false, errors: ['Not valid JSON.'] }
  }
  const parsed = seedFileSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.issues
        .slice(0, 20)
        .map((i) => (i.path.length ? `${i.path.join('.')}: ${i.message}` : i.message)),
    }
  }
  const errors = Object.keys(parsed.data.seed)
    .map(featureKeyProblem)
    .filter((p): p is string => p !== null)
  if (errors.length) return { ok: false, errors: errors.slice(0, 20) }
  return { ok: true, seed: parsed.data.seed }
}

/** `${base}#/events/interests?seed=<base64url(UTF-8 JSON)>` for a validated seed. */
export function encodeSeedLink(seed: Record<string, number>, base: string = SEED_LINK_BASE): string {
  const d = toBase64Url(new TextEncoder().encode(JSON.stringify({ seed })))
  return `${base}#/events/interests?seed=${d}`
}

/** The JSON text of a `seed` link parameter (feed it to parseSeedJson). Never saves anything. */
export function decodeSeedParam(d: string): { ok: true; text: string } | { ok: false; errors: string[] } {
  if (d.length > MAX_SEED_INPUT_CHARS * 2) return { ok: false, errors: ['The seed link is too large.'] }
  return decodeLinkParam(d)
}

export interface SeedDiff {
  added: string[]
  changed: string[]
  /** Keys with a seed now that the new seed leaves out: their seed is cleared (pins stay). */
  removed: string[]
  unchanged: string[]
}

/** What saving `seed` over the current profile would do (the import preview). A seed REPLACES the old one. */
export function seedDiff(
  current: readonly { id: string; seed: number | null }[],
  seed: Record<string, number>,
): SeedDiff {
  const old = new Map(current.filter((r) => r.seed !== null).map((r) => [r.id, r.seed]))
  const d: SeedDiff = { added: [], changed: [], removed: [], unchanged: [] }
  for (const [k, v] of Object.entries(seed)) {
    if (!old.has(k)) d.added.push(k)
    else if (old.get(k) !== v) d.changed.push(k)
    else d.unchanged.push(k)
  }
  for (const k of old.keys()) if (!Object.hasOwn(seed, k)) d.removed.push(k)
  for (const list of Object.values(d)) list.sort()
  return d
}
