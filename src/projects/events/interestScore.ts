import type { EventItem, InterestFeatures, InterestPin } from './types'
import { interestFeatures, isOwnHide } from './interest'
import { featureKey, kindOf, type FeatureKind, type HourBucket } from './featureKeys'
import { categoryLabel } from './model'
import { subLabel } from './subcategories'

// Step 2 of the events interest signal: a small, explainable scoring model.
// Pure: no React, no Dexie. Inputs are the owner's 👍 / 👎
// (db.eventInterest), the saved/hidden marks (db.eventMarks), the hand-added
// events (db.customEvents) and the profile (db.eventInterestProfile: the
// seed, a starting guess that fades, and manual pins).
//
// 1. Every event becomes a set of feature keys (featureKeysOf): its category,
//    subcategory, tags, city, source, ring, weekday and time of day.
// 2. Evidence (collectEvidence): 👍 = +1, 👎 = -1, saved = +2, hidden = -0.5
//    (but not the hide a 👎 made: that one is the 👎, see isOwnHide), a
//    hand-added event = +1. Each evidence counts in full for EVERY feature of
//    its event, decayed by age (half-life INTEREST_WEIGHTS.halfLifeDays).
// 3. Per feature f, with decayed weights d_i = 0.5^(age_i / halfLife):
//        learned_f = Σ v_i·d_i / (Σ d_i + K)
//        score_f   = clamp((Σ v_i·d_i + s·K·seed_f) / (Σ d_i + K), -1, 1)
//    K = smoothing (one signal never dominates), s = seed strength
//    max(0, 1 - nSignals / seedFadeSignals): with no evidence the score IS
//    the seed, and the seed weighs like K pseudo-signals that fade to 0.
//    A pin overrides it all: up = 1, down = -1, mute = 0 and never explains.
// 4. Event score = Σ over its features of kind[k] · score_f / (number of
//    features of that kind on the event): tags are averaged, so ten tags
//    don't outweigh the category.

export type Pin = InterestPin

/** One profile row as the model needs it (db.eventInterestProfile). */
export interface ProfileEntry {
  id: string
  seed: number | null
  pin: Pin | null
}

/** Every tunable number of the model, in one place. */
export const INTEREST_WEIGHTS = {
  /** Value of each kind of evidence. */
  evidence: { explicit: 1, saved: 2, hidden: -0.5, manual: 1 },
  /** Evidence loses half its weight every this many days (from its updatedAt). */
  halfLifeDays: 90,
  /** K in the smoothed mean sum / (n + K); also the seed's pseudo-count. */
  smoothing: 3,
  /** The seed has no weight left once this many signals exist. */
  seedFadeSignals: 60,
  /** Weight of each feature kind in the event score. */
  kind: { cat: 1, sub: 1, tag: 0.5, city: 0.3, src: 0.3, ring: 0.3, wd: 0.2, hour: 0.2 } satisfies Record<
    FeatureKind,
    number
  >,
  /** "Ordina per te" can only be switched on from this many signals (explicit + implicit). */
  minSignalsForOrdering: 30,
  /** A feature explains an event only above this |contribution|. */
  explainMin: 0.05,
  /** At most this many features in an explanation. */
  explainMax: 3,
} as const

const DAY_MS = 86_400_000

// --- Feature keys ------------------------------------------------------------------

/** Time-of-day bucket of a Europe/Rome hour. */
export function hourBucket(hour: number): HourBucket {
  if (hour >= 5 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 18) return 'afternoon'
  if (hour >= 18 && hour < 22) return 'evening'
  return 'night'
}

/** The feature keys of a snapshot (de-duplicated; a tag equal to the category is the category). */
export function featureKeysOf(f: InterestFeatures): string[] {
  const keys: (string | null)[] = [featureKey('cat', f.category)]
  if (f.subcategory) keys.push(featureKey('sub', f.subcategory))
  for (const t of f.tags) if (t !== f.category) keys.push(featureKey('tag', t))
  if (f.city) keys.push(featureKey('city', f.city))
  if (f.source) keys.push(featureKey('src', f.source))
  if (f.ring) keys.push(featureKey('ring', f.ring))
  if (f.weekday !== null) keys.push(featureKey('wd', f.weekday))
  if (f.hour !== null) keys.push(featureKey('hour', hourBucket(f.hour)))
  return [...new Set(keys.filter((k): k is string => k !== null))]
}

const EVENT_KEYS = new WeakMap<EventItem, string[]>()

/** The feature keys of a live event (cached per event object). */
export function eventKeys(e: EventItem): string[] {
  let keys = EVENT_KEYS.get(e)
  if (!keys) {
    keys = featureKeysOf(interestFeatures(e))
    EVENT_KEYS.set(e, keys)
  }
  return keys
}

// --- Evidence ----------------------------------------------------------------------

export type EvidenceKind = keyof typeof INTEREST_WEIGHTS.evidence

export interface Evidence {
  id: string
  kind: EvidenceKind
  value: number
  /** updatedAt of the signal / mark / hand-added event (epoch ms). */
  at: number
  keys: string[]
}

export interface EvidenceInput {
  signals: readonly { id: string; value: number; features: InterestFeatures; updatedAt: number }[]
  marks: readonly { id: string; state: 'saved' | 'hidden'; event: EventItem; updatedAt: number }[]
  /** Hand-added events (customToEventItem) with their row's updatedAt. */
  manual: readonly { event: EventItem; updatedAt: number }[]
}

export interface EvidenceCounts {
  up: number
  down: number
  saved: number
  hidden: number
  manual: number
  /** Everything above: what the seed fade and the ordering gate count. */
  total: number
}

/** All evidence, explicit and implicit. A hidden mark made by a 👎 is not counted twice. */
export function collectEvidence({ signals, marks, manual }: EvidenceInput): Evidence[] {
  const E = INTEREST_WEIGHTS.evidence
  const out: Evidence[] = []
  const bySignal = new Map(signals.map((s) => [s.id, s]))
  for (const s of signals) {
    if (s.value !== 1 && s.value !== -1) continue
    out.push({
      id: s.id,
      kind: 'explicit',
      value: s.value * E.explicit,
      at: s.updatedAt,
      keys: featureKeysOf(s.features),
    })
  }
  for (const m of marks) {
    if (m.state === 'hidden' && isOwnHide(bySignal.get(m.id), m)) continue
    const kind = m.state === 'saved' ? 'saved' : 'hidden'
    out.push({ id: m.id, kind, value: E[kind], at: m.updatedAt, keys: eventKeys(m.event) })
  }
  for (const c of manual) {
    out.push({ id: c.event.id, kind: 'manual', value: E.manual, at: c.updatedAt, keys: eventKeys(c.event) })
  }
  return out
}

export function countEvidence(evidence: readonly Evidence[]): EvidenceCounts {
  const c: EvidenceCounts = { up: 0, down: 0, saved: 0, hidden: 0, manual: 0, total: evidence.length }
  for (const e of evidence) {
    if (e.kind === 'explicit') c[e.value > 0 ? 'up' : 'down']++
    else c[e.kind]++
  }
  return c
}

// --- Model -------------------------------------------------------------------------

export interface FeatureStat {
  key: string
  kind: FeatureKind
  /** Σ value · decay */
  sum: number
  /** Σ decay (the decayed evidence count) */
  weight: number
  /** Raw number of evidence items touching the feature. */
  count: number
  seed: number | null
  pin: Pin | null
  /** sum / (weight + K): what the signals alone say. */
  learned: number
  /** Final score in [-1, 1]: pins, then learned + faded seed. 0 when muted. */
  score: number
}

export interface InterestModel {
  features: Map<string, FeatureStat>
  counts: EvidenceCounts
  /** counts.total: explicit + implicit signals. */
  nSignals: number
  /** How much the seed still counts, 1 (no signals) down to 0. */
  seedStrength: number
}

export function decay(at: number, now: number): number {
  const age = Math.max(0, now - at)
  return 0.5 ** (age / (INTEREST_WEIGHTS.halfLifeDays * DAY_MS))
}

export function seedStrength(nSignals: number): number {
  return Math.max(0, 1 - nSignals / INTEREST_WEIGHTS.seedFadeSignals)
}

const clamp = (x: number) => Math.max(-1, Math.min(1, x))

function finalScore(st: Omit<FeatureStat, 'learned' | 'score'>, strength: number): number {
  if (st.pin === 'mute') return 0
  if (st.pin === 'up') return 1
  if (st.pin === 'down') return -1
  const K = INTEREST_WEIGHTS.smoothing
  return clamp((st.sum + strength * K * (st.seed ?? 0)) / (st.weight + K))
}

export function buildInterestModel(
  evidence: readonly Evidence[],
  profile: readonly ProfileEntry[],
  now: number,
): InterestModel {
  const K = INTEREST_WEIGHTS.smoothing
  const counts = countEvidence(evidence)
  const strength = seedStrength(counts.total)
  const raw = new Map<string, Omit<FeatureStat, 'learned' | 'score'>>()
  const stat = (key: string) => {
    let s = raw.get(key)
    const kind = kindOf(key)
    if (!s && kind) {
      s = { key, kind, sum: 0, weight: 0, count: 0, seed: null, pin: null }
      raw.set(key, s)
    }
    return s
  }
  for (const ev of evidence) {
    const d = decay(ev.at, now)
    for (const key of ev.keys) {
      const s = stat(key)
      if (!s) continue
      s.sum += ev.value * d
      s.weight += d
      s.count++
    }
  }
  for (const p of profile) {
    const s = stat(p.id)
    if (!s) continue
    s.seed = p.seed
    s.pin = p.pin
  }
  const features = new Map<string, FeatureStat>()
  for (const [key, s] of raw) {
    features.set(key, { ...s, learned: s.sum / (s.weight + K), score: finalScore(s, strength) })
  }
  return { features, counts, nSignals: counts.total, seedStrength: strength }
}

// --- Event score -------------------------------------------------------------------

export interface Reason {
  key: string
  label: string
  contribution: number
}

export interface ScoredEvent {
  score: number
  /** The top contributing features (|contribution| >= explainMin), largest first. */
  reasons: Reason[]
}

export function scoreKeys(keys: readonly string[], model: InterestModel): ScoredEvent {
  const perKind = new Map<FeatureKind, number>()
  for (const k of keys) {
    const kind = kindOf(k)
    if (kind) perKind.set(kind, (perKind.get(kind) ?? 0) + 1)
  }
  let score = 0
  const all: Reason[] = []
  for (const key of keys) {
    const st = model.features.get(key)
    if (!st || st.pin === 'mute' || st.score === 0) continue
    const contribution = (INTEREST_WEIGHTS.kind[st.kind] * st.score) / (perKind.get(st.kind) ?? 1)
    score += contribution
    all.push({ key, label: featureLabel(key), contribution })
  }
  const reasons = all
    .filter((r) => Math.abs(r.contribution) >= INTEREST_WEIGHTS.explainMin)
    .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution) || a.key.localeCompare(b.key))
    .slice(0, INTEREST_WEIGHTS.explainMax)
  return { score, reasons }
}

export function scoreEvent(e: EventItem, model: InterestModel): ScoredEvent {
  return scoreKeys(eventKeys(e), model)
}

/** "perché: Jazz e blues, serata · meno: Verona" ('' when nothing explains it). */
export function explain(reasons: readonly Reason[]): string {
  const pos = reasons.filter((r) => r.contribution > 0).map((r) => r.label)
  const neg = reasons.filter((r) => r.contribution < 0).map((r) => r.label)
  const parts: string[] = []
  if (pos.length) parts.push(`perché: ${pos.join(', ')}`)
  if (neg.length) parts.push(`meno: ${neg.join(', ')}`)
  return parts.join(' · ')
}

/** A per-model scorer that remembers each event object's result. */
export function makeScorer(model: InterestModel): (e: EventItem) => ScoredEvent {
  const cache = new WeakMap<EventItem, ScoredEvent>()
  return (e) => {
    let s = cache.get(e)
    if (!s) {
      s = scoreEvent(e, model)
      cache.set(e, s)
    }
    return s
  }
}

// --- Ordering ----------------------------------------------------------------------

/** Has the owner given enough signals for "Ordina per te"? */
export function canOrderForYou(nSignals: number): boolean {
  return nSignals >= INTEREST_WEIGHTS.minSignalsForOrdering
}

/**
 * "Ordina per te" inside one day: the interest score FIRST (highest first),
 * then `tiebreak` (the page's usual compareInDay: ring, favourites, start,
 * title). Scores are rounded to 1e-6 so float noise never beats the ring.
 */
export function compareForYou(
  scoreOf: (e: EventItem) => number,
  tiebreak: (a: EventItem, b: EventItem) => number,
): (a: EventItem, b: EventItem) => number {
  const r = (e: EventItem) => Math.round(scoreOf(e) * 1e6)
  return (a, b) => r(b) - r(a) || tiebreak(a, b)
}

// --- Labels ------------------------------------------------------------------------

const RING_LABEL: Record<string, string> = { home: 'vicino a casa', near: 'nei dintorni', spot: 'evento speciale' }
const WEEKDAY_LABEL = ['', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato', 'domenica']
const HOUR_LABEL: Record<HourBucket, string> = {
  morning: 'mattina',
  afternoon: 'pomeriggio',
  evening: 'serata',
  night: 'notte',
}

/** Human label of a feature key (Italian, like the rest of the events wording). */
export function featureLabel(key: string): string {
  const kind = kindOf(key)
  const v = key.slice(key.indexOf(':') + 1)
  switch (kind) {
    case 'cat':
      return categoryLabel(v)
    case 'sub':
      return subLabel(v)
    case 'city':
      return v.replace(/(^|[\s-])\p{L}/gu, (m) => m.toUpperCase())
    case 'ring':
      return RING_LABEL[v] ?? v
    case 'wd':
      return WEEKDAY_LABEL[Number(v)] ?? v
    case 'hour':
      return HOUR_LABEL[v as HourBucket] ?? v
    default:
      return v
  }
}

/** How the interests page groups features. */
export const FEATURE_GROUPS: { id: string; label: string; kinds: FeatureKind[] }[] = [
  { id: 'cat', label: 'Categories', kinds: ['cat'] },
  { id: 'sub', label: 'Subcategories', kinds: ['sub'] },
  { id: 'tag', label: 'Tags', kinds: ['tag'] },
  { id: 'city', label: 'Cities', kinds: ['city'] },
  { id: 'src', label: 'Sources', kinds: ['src'] },
  { id: 'ring', label: 'Distance', kinds: ['ring'] },
  { id: 'time', label: 'Time', kinds: ['wd', 'hour'] },
]
