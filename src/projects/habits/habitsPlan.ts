import type { Habit } from '../../lib/db'
import { decodeLinkParam, toBase64Url } from '../../lib/base64url.ts'
import {
  MAX_EMOJI_LENGTH,
  MAX_GRACE,
  MAX_NAME_LENGTH,
  MAX_PER_DAY,
  MAX_TARGET,
  MAX_TEXT_LENGTH,
  MAX_LIMIT_APP_LENGTH,
  MAX_LIMIT_MINUTES,
  MAX_MEASURE_LIMITS,
  clipEmoji,
} from '../../lib/habitCaps.ts'
import { LIFE_IMPORT_BASE } from '../life/model/importLink.ts'
import { ENGINES, engineLabel, isEngineKey } from '../life/model/engines.ts'
import { isDateKey } from '../life/model/dates.ts'

// Habits import link (EN4): Claude in ~/life writes ~/life/_sync/habits-plan.json
// (new habits and edits to existing ones), scripts/life-habits-link.ts
// validates it and prints `#/habits/import?d=<base64url(UTF-8 JSON)>`, and the
// /habits/import screen previews it and applies only on an explicit tap (via
// habitsPlanApply.ts). Copies the streaks link (streaksLink.ts). Pure: no
// React, no Dexie, loadable by plain node.
//
// Plan JSON: { asOf?: 'YYYY-MM-DD', habits: [{ name, emoji?, ...fields }] }
// where fields are HabitDetails (src/lib/habitSync.ts). A row matches an
// existing, non-archived habit by name (trimmed, case-insensitive): then only
// the fields present change ("" or null clears one); otherwise it is a new
// habit and `emoji` is required. Invalid values are reported, never clipped.

/** The HabitDetails keys a plan row may carry, in display order. */
export const DETAIL_KEYS = [
  'engine',
  'kind',
  'direction',
  'target',
  'perDay',
  'grace',
  'graceScope',
  'social',
  'anchor',
  'normal',
  'floor',
  'why',
  'cycleStart',
  'cycleEnd',
  'verdict',
  'measure',
  'measureLimits',
] as const satisfies readonly (keyof Habit)[]

export type DetailKey = (typeof DETAIL_KEYS)[number]
export type Details = Partial<Pick<Habit, DetailKey>>

/** One plan row: null (or "" for text) on a detail = clear it on an update. */
export type HabitPlanItem = { name: string; emoji?: string } & { [K in DetailKey]?: Habit[K] | null }

export interface HabitsPlan {
  asOf?: string
  habits: HabitPlanItem[]
}

export const HABITS_PLAN_MAX = 30
/** Longest `d` the import screen accepts (and the script will print). */
export const HABITS_LINK_MAX_PARAM = 20_000

const TEXT_KEYS = ['anchor', 'normal', 'floor', 'why'] as const
const ENUMS = {
  kind: ['forever', 'experiment'],
  direction: ['do', 'avoid'],
  graceScope: ['day', 'week'],
  social: ['person', 'alone'],
  verdict: ['up', 'stay', 'down', 'closed'],
  measure: ['app-limits'],
} as const
const INTS = { target: [1, MAX_TARGET], perDay: [1, MAX_PER_DAY], grace: [0, MAX_GRACE] } as const

/** The match key of a habit name: trimmed, case-insensitive. */
export function nameKey(name: string): string {
  return name.trim().toLocaleLowerCase()
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)

function validateItem(raw: unknown, p: string, err: (m: string) => void): HabitPlanItem | null {
  if (!isObj(raw)) {
    err(`${p} must be an object`)
    return null
  }
  const allowed = new Set<string>(['name', 'emoji', ...DETAIL_KEYS])
  for (const k of Object.keys(raw)) if (!allowed.has(k)) err(`${p}.${k} is not a habit field`)

  const item: HabitPlanItem = { name: '' }
  if (typeof raw.name !== 'string' || !raw.name.trim()) err(`${p}.name is required`)
  else if (raw.name.trim().length > MAX_NAME_LENGTH)
    err(`${p}.name is too long (${raw.name.trim().length} characters, max ${MAX_NAME_LENGTH})`)
  else item.name = raw.name.trim()
  const n = item.name ? `${p} "${item.name}"` : p

  if (raw.emoji !== undefined) {
    const e = typeof raw.emoji === 'string' ? raw.emoji.trim() : null
    if (!e) err(`${n}.emoji must be a non-empty string (leave it out to keep the current one)`)
    else if (e.length > MAX_EMOJI_LENGTH || clipEmoji(e) !== e)
      err(`${n}.emoji is too long (max ${MAX_EMOJI_LENGTH} UTF-16 units, one emoji)`)
    else item.emoji = e
  }

  for (const k of TEXT_KEYS) {
    const v = raw[k]
    if (v === undefined) continue
    if (v === null) item[k] = null
    else if (typeof v !== 'string') err(`${n}.${k} must be a string`)
    else if (v.trim().length > MAX_TEXT_LENGTH)
      err(`${n}.${k} is too long (${v.trim().length} characters, max ${MAX_TEXT_LENGTH})`)
    else item[k] = v.trim() || null
  }
  for (const [k, values] of Object.entries(ENUMS) as [keyof typeof ENUMS, readonly string[]][]) {
    const v = raw[k]
    if (v === undefined) continue
    if (v === null) item[k] = null
    else if (typeof v === 'string' && values.includes(v)) (item as Record<string, unknown>)[k] = v
    else err(`${n}.${k} must be one of ${values.join(', ')}`)
  }
  for (const [k, [min, max]] of Object.entries(INTS) as [keyof typeof INTS, readonly [number, number]][]) {
    const v = raw[k]
    if (v === undefined) continue
    if (v === null) item[k] = null
    else if (Number.isInteger(v) && (v as number) >= min && (v as number) <= max) item[k] = v as number
    else err(`${n}.${k} must be an integer ${min}–${max}`)
  }
  if (raw.engine !== undefined) {
    if (raw.engine === null) item.engine = null
    else if (isEngineKey(raw.engine)) item.engine = raw.engine
    else err(`${n}.engine must be one of ${ENGINES.map((e) => e.key).join(', ')}`)
  }
  for (const k of ['cycleStart', 'cycleEnd'] as const) {
    const v = raw[k]
    if (v === undefined) continue
    if (v === null || v === '') item[k] = null
    else if (isDateKey(v)) item[k] = v
    else err(`${n}.${k} must be YYYY-MM-DD`)
  }
  if (item.cycleStart && item.cycleEnd && item.cycleEnd < item.cycleStart)
    err(`${n}.cycleEnd (${item.cycleEnd}) is before cycleStart (${item.cycleStart})`)
  if (raw.measureLimits !== undefined) {
    const limits = validateLimits(raw.measureLimits, `${n}.measureLimits`, err)
    if (limits !== undefined) item.measureLimits = limits
  }
  if (item.measure === 'app-limits' && item.direction === 'do')
    err(`${n}: measure "app-limits" counts slips, so direction must be avoid (or left out)`)
  return item
}

/** measureLimits: null (clear) or 1-MAX_MEASURE_LIMITS rows of { app, minutes } (daily minutes), apps distinct. */
function validateLimits(
  v: unknown,
  p: string,
  err: (m: string) => void,
): { app: string; minutes: number }[] | null | undefined {
  if (v === null) return null
  if (!Array.isArray(v) || v.length === 0) {
    err(`${p} must be a non-empty array of { app, minutes } (or null to clear)`)
    return undefined
  }
  if (v.length > MAX_MEASURE_LIMITS) {
    err(`${p} has ${v.length} apps (max ${MAX_MEASURE_LIMITS})`)
    return undefined
  }
  const out: { app: string; minutes: number }[] = []
  const seen = new Set<string>()
  let ok = true
  v.forEach((r, i) => {
    const q = `${p}[${i}]`
    if (!isObj(r)) {
      err(`${q} must be an object { app, minutes }`)
      ok = false
      return
    }
    for (const k of Object.keys(r)) if (k !== 'app' && k !== 'minutes') err(`${q}.${k} is not a limit field`)
    const app = typeof r.app === 'string' ? r.app.trim() : ''
    if (!app) err(`${q}.app is required`)
    else if (app.length > MAX_LIMIT_APP_LENGTH) err(`${q}.app is too long (max ${MAX_LIMIT_APP_LENGTH})`)
    else if (seen.has(app.toLowerCase())) err(`${q}.app "${app}" is listed twice`)
    const m = r.minutes
    const minutesOk = Number.isInteger(m) && (m as number) >= 1 && (m as number) <= MAX_LIMIT_MINUTES
    if (!minutesOk) err(`${q}.minutes must be an integer 1–${MAX_LIMIT_MINUTES} (daily limit)`)
    if (!app || app.length > MAX_LIMIT_APP_LENGTH || seen.has(app.toLowerCase()) || !minutesOk) {
      ok = false
      return
    }
    seen.add(app.toLowerCase())
    out.push({ app, minutes: m as number })
  })
  return ok ? out : undefined
}

/** Validate a habits plan (the script's input, and the link's payload). */
export function parseHabitsPlanJson(text: string): { ok: true; plan: HabitsPlan } | { ok: false; errors: string[] } {
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    return { ok: false, errors: ['Not valid JSON'] }
  }
  const errors: string[] = []
  const err = (m: string) => errors.push(m)
  if (!isObj(raw)) return { ok: false, errors: ['The plan must be an object with a "habits" array'] }
  for (const k of Object.keys(raw)) if (k !== 'asOf' && k !== 'habits') err(`${k} is not a plan field`)
  const plan: HabitsPlan = { habits: [] }
  if (raw.asOf !== undefined) {
    if (isDateKey(raw.asOf)) plan.asOf = raw.asOf
    else err('asOf must be YYYY-MM-DD')
  }
  if (!Array.isArray(raw.habits)) err('habits must be an array')
  else if (raw.habits.length === 0) err('habits is empty')
  else if (raw.habits.length > HABITS_PLAN_MAX) err(`habits has ${raw.habits.length} rows (max ${HABITS_PLAN_MAX})`)
  else {
    const seen = new Map<string, string>()
    raw.habits.forEach((h, i) => {
      const item = validateItem(h, `habits[${i}]`, err)
      if (!item?.name) return
      const other = seen.get(nameKey(item.name))
      if (other !== undefined) err(`habits: "${other}" and "${item.name}" are the same habit (names match)`)
      else seen.set(nameKey(item.name), item.name)
      plan.habits.push(item)
    })
  }
  if (errors.length > 0) return { ok: false, errors }
  return { ok: true, plan }
}

// --- Link ---------------------------------------------------------------------

/** `${base}#/habits/import?d=<base64url(UTF-8 JSON)>`. */
export function encodeHabitsLink(plan: HabitsPlan, base: string = LIFE_IMPORT_BASE): string {
  const d = toBase64Url(new TextEncoder().encode(JSON.stringify(plan)))
  return `${base}#/habits/import?d=${d}`
}

export function decodeHabitsParam(d: string): { ok: true; text: string } | { ok: false; errors: string[] } {
  return decodeLinkParam(d)
}

// --- Preview: match by name, merge, diff ---------------------------------------

export interface FieldChange {
  field: 'name' | 'emoji' | DetailKey
  before: string
  after: string
}

export type ImportRow =
  | { kind: 'create'; key: string; name: string; emoji: string; details: Details; fields: FieldChange[] }
  | {
      kind: 'update'
      key: string
      habit: Habit
      name: string
      emoji: string
      /** The habit's details with the plan merged on top: pass ALL of them to updateHabit. */
      details: Details
      changes: FieldChange[]
    }
  | { kind: 'same'; key: string; habit: Habit }
  | { kind: 'invalid'; key: string; name: string; errors: string[] }

export const FIELD_LABELS: Record<FieldChange['field'], string> = {
  name: 'Name',
  emoji: 'Emoji',
  engine: 'Engine',
  kind: 'Kind',
  direction: 'Direction',
  target: 'Times per week',
  perDay: 'Taps per day',
  grace: 'Grace',
  graceScope: 'Grace per',
  social: 'Social',
  anchor: 'Anchor',
  normal: 'Normal',
  floor: 'Floor',
  why: 'Why',
  cycleStart: 'Cycle start',
  cycleEnd: 'Cycle end',
  verdict: 'Verdict',
  measure: 'Verification',
  measureLimits: 'App limits (min/day)',
}

/** How a field value reads in the preview ("—" when unset). */
export function showValue(field: FieldChange['field'], v: unknown): string {
  if (v === undefined || v === null || v === '') return '—'
  if (field === 'measureLimits' && Array.isArray(v))
    return (v as { app: string; minutes: number }[]).map((l) => `${l.app} ${l.minutes}`).join(', ') || '—'
  if (field === 'engine' && isEngineKey(v)) return engineLabel(v)
  return typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean' ? String(v) : JSON.stringify(v)
}

/** The details a habit carries now (only the plan-editable keys). */
export function detailsOf(h: Habit): Details {
  const d: Details = {}
  for (const k of DETAIL_KEYS) if (h[k] !== undefined) (d as Record<string, unknown>)[k] = h[k]
  return d
}

function planDetails(item: HabitPlanItem): Details {
  const d: Details = {}
  for (const k of DETAIL_KEYS) {
    const v = item[k]
    if (v !== undefined && v !== null && v !== '') (d as Record<string, unknown>)[k] = v
  }
  if (d.measure) d.direction = 'avoid'
  return d
}

/** Values equal for the diff (the limits list by content, not identity). */
function sameValue(a: unknown, b: unknown): boolean {
  return a === b || (Array.isArray(a) && Array.isArray(b) && JSON.stringify(a) === JSON.stringify(b))
}

/** The measure fields as merged must make sense: app-limits needs limits and a habit to avoid. Mutates
 *  `d` to set direction avoid when measured (the writer forces it too; the preview then shows it). */
function measureErrors(d: Details): string[] {
  if (d.measure === 'app-limits') {
    if (!d.measureLimits?.length) return ['measure "app-limits" needs measureLimits (at least one app)']
    if (d.direction === 'do') return ['measure "app-limits" counts slips, so direction must be avoid']
    d.direction = 'avoid'
    return []
  }
  if (d.measureLimits?.length) return ['measureLimits needs measure "app-limits"']
  return []
}

/**
 * Compare a plan with the habits on this device. Never writes. A row is
 * `create` (no live habit of that name; emoji required), `update` (the plan
 * merged onto the habit differs), `same` (nothing would change) or `invalid`.
 */
export function planHabitsImport(plan: HabitsPlan, habits: readonly Habit[]): ImportRow[] {
  const live = new Map<string, Habit[]>()
  for (const h of habits) {
    if (h.archivedAt !== undefined) continue
    const k = nameKey(h.name)
    live.set(k, [...(live.get(k) ?? []), h])
  }
  return plan.habits.map((item): ImportRow => {
    const key = nameKey(item.name)
    const matches = live.get(key) ?? []
    if (matches.length > 1)
      return { kind: 'invalid', key, name: item.name, errors: [`${matches.length} habits are named "${item.name}"`] }
    const habit = matches[0]
    if (!habit) {
      if (!item.emoji) return { kind: 'invalid', key, name: item.name, errors: ['A new habit needs an emoji'] }
      const details = planDetails(item)
      const bad = measureErrors(details)
      if (bad.length) return { kind: 'invalid', key, name: item.name, errors: bad }
      const fields: FieldChange[] = DETAIL_KEYS.filter((k) => details[k] !== undefined).map((k) => ({
        field: k,
        before: '—',
        after: showValue(k, details[k]),
      }))
      return { kind: 'create', key, name: item.name, emoji: item.emoji, details, fields }
    }
    const before = detailsOf(habit)
    const details: Details = { ...before }
    for (const k of DETAIL_KEYS) {
      const v = item[k]
      if (v === undefined) continue
      if (v === null || v === '') delete details[k]
      else (details as Record<string, unknown>)[k] = v
    }
    if (details.cycleStart && details.cycleEnd && details.cycleEnd < details.cycleStart)
      return {
        kind: 'invalid',
        key,
        name: item.name,
        errors: [`Cycle end (${details.cycleEnd}) would be before cycle start (${details.cycleStart})`],
      }
    // Clearing the measure clears its limits too (a habit checked by hand has none).
    if (item.measure === null) delete details.measureLimits
    // Turning a habit into an app-limits one makes it a habit to avoid, unless the plan says otherwise.
    if (item.measure && item.direction === undefined) details.direction = 'avoid'
    const bad = measureErrors(details)
    if (bad.length) return { kind: 'invalid', key, name: item.name, errors: bad }
    const name = item.name
    const emoji = item.emoji ?? habit.emoji
    const changes: FieldChange[] = []
    if (name !== habit.name) changes.push({ field: 'name', before: habit.name, after: name })
    if (emoji !== habit.emoji) changes.push({ field: 'emoji', before: habit.emoji, after: emoji })
    for (const k of DETAIL_KEYS)
      if (!sameValue(before[k], details[k]))
        changes.push({ field: k, before: showValue(k, before[k]), after: showValue(k, details[k]) })
    if (changes.length === 0) return { kind: 'same', key, habit }
    return { kind: 'update', key, habit, name, emoji, details, changes }
  })
}
