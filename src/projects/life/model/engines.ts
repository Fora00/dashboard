import type { Habit, LifeEngine, LifeEngineKey } from '../../../lib/db'
import { LIFE_CAPS } from './constants.ts'

// Life Engines: a monthly audit of seven life areas, scored 1-10, at most one
// lead engine per month, and an "iceberg" per engine (event, pattern, system,
// belief, up to three whys, one lever, an optional link to a habit or an
// experiment by name). Rows live in lifeEngines / life_engines (lifeSync.ts).
// Pure helpers only: no React, no Dexie.

export const ENGINES = [
  { key: 'physical-health', label: 'Physical Health' },
  { key: 'emotions', label: 'Emotions' },
  { key: 'mind', label: 'Mind' },
  { key: 'relationships', label: 'Relationships' },
  { key: 'career', label: 'Career' },
  { key: 'money', label: 'Money' },
  { key: 'environment', label: 'Environment' },
] as const satisfies readonly { key: LifeEngineKey; label: string }[]

export type EngineKey = LifeEngineKey

/** The four free-text layers of the iceberg, top (visible) to bottom. */
export const ICEBERG_LAYERS = [
  { key: 'event', label: 'Event', hint: 'What happened, on the surface.' },
  { key: 'pattern', label: 'Pattern', hint: 'What keeps repeating.' },
  { key: 'system', label: 'System', hint: 'What in the setup produces it.' },
  { key: 'belief', label: 'Belief', hint: 'What assumption holds it in place.' },
] as const

export type IcebergLayer = (typeof ICEBERG_LAYERS)[number]['key']

export const ENGINE_SCORE_MIN = 1
export const ENGINE_SCORE_MAX = 10

/** A stored engine row (LifeEngine in lib/db.ts). */
export type EngineRow = LifeEngine

export type IcebergInput = Pick<EngineRow, IcebergLayer | 'whys' | 'lever' | 'link'>

const MONTH = /^[0-9]{4}-(0[1-9]|1[0-2])$/

export function isEngineKey(v: unknown): v is EngineKey {
  return typeof v === 'string' && ENGINES.some((e) => e.key === v)
}

export function isMonthKey(v: unknown): boolean {
  return typeof v === 'string' && MONTH.test(v)
}

export function isEngineScore(v: unknown): v is number {
  return Number.isInteger(v) && (v as number) >= ENGINE_SCORE_MIN && (v as number) <= ENGINE_SCORE_MAX
}

/** Deterministic id of an engine row: `${YYYY-MM}:${engineKey}`. */
export function engineId(month: string, engine: EngineKey): string {
  return `${month}:${engine}`
}

export function engineLabel(engine: EngineKey): string {
  return ENGINES.find((e) => e.key === engine)?.label ?? engine
}

/** A blank row for a month and engine (no score, no iceberg). */
export function emptyEngine(month: string, engine: EngineKey, now: number): EngineRow {
  return {
    id: engineId(month, engine),
    month,
    engine,
    score: null,
    lead: false,
    event: '',
    pattern: '',
    system: '',
    belief: '',
    whys: [],
    lever: '',
    link: '',
    updatedAt: now,
  }
}

/** Score stepper: from no score either direction starts at the middle (5);
 *  otherwise one step, clamped to 1-10. */
export function stepScore(score: number | null, delta: 1 | -1): number {
  if (score === null) return 5
  return Math.min(ENGINE_SCORE_MAX, Math.max(ENGINE_SCORE_MIN, score + delta))
}

export type Trend = 'up' | 'down' | 'same'

/** Direction vs the previous month; null when either score is missing. */
export function engineTrend(now: number | null, before: number | null): Trend | null {
  if (now === null || before === null) return null
  return now > before ? 'up' : now < before ? 'down' : 'same'
}

export const TREND_ARROW: Record<Trend, string> = { up: '↑', down: '↓', same: '→' }

/**
 * Trim, cap and drop blanks: the client side of the life_engines CHECKs. Over-
 * long text is cut (the UI caps inputs with maxLength, so this is a backstop).
 */
export function normalizeIceberg(input: IcebergInput): IcebergInput {
  const cap = (s: string, n: number) => (s ?? '').trim().slice(0, n)
  return {
    event: cap(input.event, LIFE_CAPS.engineLayer),
    pattern: cap(input.pattern, LIFE_CAPS.engineLayer),
    system: cap(input.system, LIFE_CAPS.engineLayer),
    belief: cap(input.belief, LIFE_CAPS.engineLayer),
    whys: (input.whys ?? [])
      .map((w) => cap(w, LIFE_CAPS.engineWhy))
      .filter((w) => w.length > 0)
      .slice(0, LIFE_CAPS.engineWhys),
    lever: cap(input.lever, LIFE_CAPS.engineLever).replace(/\s*\n+\s*/g, ' '),
    link: cap(input.link, LIFE_CAPS.engineLink).replace(/\s*\n+\s*/g, ' '),
  }
}

/** How much of the iceberg is filled in (counts only, never the text). */
export function icebergCounts(row: Pick<EngineRow, IcebergLayer | 'whys' | 'lever'>): {
  layers: number
  whys: number
  hasLever: boolean
} {
  return {
    layers: ICEBERG_LAYERS.filter((l) => row[l.key].trim().length > 0).length,
    whys: row.whys.filter((w) => w.trim().length > 0).length,
    hasLever: row.lever.trim().length > 0,
  }
}

export function hasIceberg(row: Pick<EngineRow, IcebergLayer | 'whys' | 'lever'>): boolean {
  const c = icebergCounts(row)
  return c.layers > 0 || c.whys > 0 || c.hasLever
}

/**
 * Plan the lead change for a month: setting `engine` as lead clears every
 * other lead of that month (at most one per month); unsetting touches only
 * that engine. Returns the rows to write (unchanged rows are left out).
 */
export function planLead(
  rows: readonly EngineRow[],
  month: string,
  engine: EngineKey,
  lead: boolean,
  now: number,
): EngineRow[] {
  const byKey = new Map(rows.filter((r) => r.month === month).map((r) => [r.engine, r]))
  const out: EngineRow[] = []
  const target = byKey.get(engine) ?? emptyEngine(month, engine, now)
  if (target.lead !== lead) out.push({ ...target, lead, updatedAt: now })
  if (lead) {
    for (const r of byKey.values()) {
      if (r.engine !== engine && r.lead) out.push({ ...r, lead: false, updatedAt: now })
    }
  }
  return out
}

/** The fields of a habit the engines audit reads (EN2). */
export type EngineHabit = Pick<Habit, 'name' | 'engine' | 'archivedAt'>

/**
 * The names of the live (not archived) habits tagged with each engine, in the
 * order given. Every engine is present, untagged habits are left out.
 */
export function habitsByEngine(habits: readonly EngineHabit[]): Map<EngineKey, string[]> {
  const out = new Map<EngineKey, string[]>(ENGINES.map((e) => [e.key, []]))
  for (const h of habits) {
    if (h.archivedAt !== undefined || !isEngineKey(h.engine)) continue
    out.get(h.engine)!.push(h.name)
  }
  return out
}

/**
 * The `## Engines` section of the month export: per engine the score, the
 * previous month's score, the lead flag, the lever, and how much of the
 * iceberg exists (counts only), and how many live habits feed it (a count,
 * never their names). NEVER the free-text layers, the whys or the link.
 */
export function buildEnginesMarkdown(
  month: string,
  rows: readonly EngineRow[],
  prevRows: readonly EngineRow[],
  habits: readonly EngineHabit[] = [],
): string {
  const tagged = habitsByEngine(habits)
  const now = new Map(rows.filter((r) => r.month === month).map((r) => [r.engine, r]))
  const before = new Map(prevRows.map((r) => [r.engine, r]))
  const out = ['## Engines (score 1-10, vs the previous month; iceberg as counts only)']
  const lead = ENGINES.find((e) => now.get(e.key)?.lead)
  out.push(`- Lead engine: ${lead ? lead.label : 'none'}`)
  for (const e of ENGINES) {
    const r = now.get(e.key)
    const score = r?.score ?? null
    const prev = before.get(e.key)?.score ?? null
    const trend = engineTrend(score, prev)
    const parts = [`${e.label}: ${score ?? '–'} (before: ${prev ?? '–'}${trend ? `, ${trend}` : ''})`]
    if (r?.lead) parts.push('lead')
    if (r && hasIceberg(r)) {
      const c = icebergCounts(r)
      parts.push(`iceberg: ${c.layers} of ${ICEBERG_LAYERS.length} layers, ${c.whys} whys`)
    } else {
      parts.push('no iceberg')
    }
    const lever = r?.lever.trim()
    if (lever) parts.push(`lever: ${lever}`)
    parts.push(`habits: ${tagged.get(e.key)?.length ?? 0}`)
    out.push(`- ${parts.join('; ')}`)
  }
  return out.join('\n') + '\n'
}
