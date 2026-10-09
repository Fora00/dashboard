// Feature keys of the events interest model (interestScore.ts). Pure and
// dependency-free on purpose: the Events page, the eager profile sync engine
// and scripts/events-seed-link.ts (via interestSeed.ts) all import it, so it
// must not pull in zod, model.ts or anything Vite-only.
//
// A feature key is `<kind>:<value>`, e.g. `cat:theatre`, `sub:jazz-blues`,
// `city:riva del garda`, `wd:6`, `hour:evening`. The value part is
// canonicalised by keyPart() (lowercase, accents dropped, anything outside
// [a-z0-9 _.-] becomes '-'), so the server's check
// `^[a-z]+:[A-Za-z0-9 _.-]{1,80}$` (event_interest_profile.id) always holds.

export const FEATURE_KINDS = ['cat', 'sub', 'tag', 'city', 'src', 'ring', 'wd', 'hour'] as const
export type FeatureKind = (typeof FEATURE_KINDS)[number]

/** Mirrors the SQL check on event_interest_profile.id. */
export const FEATURE_KEY_RE = /^[a-z]+:[A-Za-z0-9 _.-]{1,80}$/

export const HOUR_BUCKETS = ['morning', 'afternoon', 'evening', 'night'] as const
export type HourBucket = (typeof HOUR_BUCKETS)[number]

/** Canonical value part of a feature key ('' when nothing usable is left). */
export function keyPart(raw: string): string {
  return raw
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9 _.-]+/g, '-')
    .replace(/\s+/g, ' ')
    .replace(/-{2,}/g, '-')
    .replace(/^[\s-]+|[\s-]+$/g, '')
    .slice(0, 80)
    .trim()
}

/** `<kind>:<canonical value>`, or null when the value is empty after canonicalising. */
export function featureKey(kind: FeatureKind, value: string | number): string | null {
  const part = keyPart(String(value))
  return part ? `${kind}:${part}` : null
}

export function kindOf(key: string): FeatureKind | null {
  const kind = key.slice(0, key.indexOf(':'))
  return (FEATURE_KINDS as readonly string[]).includes(kind) ? (kind as FeatureKind) : null
}

/**
 * Why a key is not one the model can ever produce (null = fine): an unknown
 * kind, a non-canonical value, a weekday outside 1-7 or an unknown time bucket.
 */
export function featureKeyProblem(key: string): string | null {
  if (!FEATURE_KEY_RE.test(key)) return `"${key}" is not <kind>:<value>`
  const kind = kindOf(key)
  if (!kind) return `"${key}": unknown kind (use ${FEATURE_KINDS.join(', ')})`
  const value = key.slice(kind.length + 1)
  const canonical = featureKey(kind, value)
  if (canonical !== key) return canonical ? `"${key}": write it as "${canonical}"` : `"${key}": empty value`
  if (kind === 'wd' && !/^[1-7]$/.test(value)) return `"${key}": weekday is 1 (Monday) to 7 (Sunday)`
  if (kind === 'hour' && !(HOUR_BUCKETS as readonly string[]).includes(value)) {
    return `"${key}": hour is one of ${HOUR_BUCKETS.join(', ')}`
  }
  return null
}
