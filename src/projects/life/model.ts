import type {
  LifeAnswer,
  LifeCheckin,
  LifeEntry,
  LifeEntryKind,
  LifeFocus,
  LifePlan,
  LifeQuestion,
  LifeQuestionType,
  LifeTask,
  LifeTracker,
} from '../../lib/db'
import { dayKey } from '../habits/habitStore'

// Pure logic for the Life project (spec: docs/HANDOFF-life.md). No React, no
// Dexie: validation/normalization of the imported week, the import-preview
// diff, week/day keys, the Things URL, the Markdown export and the import
// link codec. Mutations live in src/lib/lifeSync.ts.

export { dayKey }

// --- Caps -------------------------------------------------------------------
// Mirrored by CHECKs in supabase/migrations/20260928120000_life.sql. The
// client side is the stricter one: the plan's JSON is capped at 64 KiB here
// and pg_column_size(plan) at 128 KiB there, so anything that passes here is
// always accepted by the server.

export const LIFE_CAPS = {
  /** Plan item ids: 1–40 chars of [A-Za-z0-9_.-] (SQL: life_entries.ref). */
  idPattern: /^[A-Za-z0-9_.-]{1,40}$/,
  /** UTF-8 bytes of the normalized plan's JSON (SQL: pg_column_size ≤ 128 KiB). */
  planBytes: 65536,
  focus: 3,
  focusTitle: 200,
  rules: 20,
  rule: 300,
  tasks: 50,
  taskTitle: 300,
  taskNotes: 2000,
  areaProject: 100,
  tags: 10,
  tag: 50,
  trackers: 20,
  trackerLabel: 100,
  emoji: 16,
  /** target / max are integers in 1..countMax. */
  countMax: 1000,
  questions: 20,
  questionLabel: 300,
  checkins: 20,
  checkinLabel: 200,
  /** Sunday text answers (SQL: pg_column_size(value) ≤ 16 KiB). */
  answerText: 2000,
  /** |number| answers. */
  answerNumber: 1_000_000_000,
} as const

/** Things `when` keywords accepted besides a 'YYYY-MM-DD' date. */
export const THINGS_WHEN_KEYWORDS = ['today', 'tonight', 'evening', 'anytime', 'someday'] as const

const QUESTION_TYPES: readonly LifeQuestionType[] = ['number', 'boolean', 'text', 'scale5']

// --- Dates ------------------------------------------------------------------
// Day keys are local-time 'YYYY-MM-DD' (Habits' dayKey); weeks run Monday to
// Sunday and are keyed by their Monday.

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/

/** True for a real calendar date written as 'YYYY-MM-DD' (rejects 2026-02-30). */
export function isDateKey(s: unknown): s is string {
  if (typeof s !== 'string') return false
  const m = DATE_RE.exec(s)
  if (!m) return false
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])]
  const t = new Date(Date.UTC(y, mo - 1, d))
  return t.getUTCFullYear() === y && t.getUTCMonth() === mo - 1 && t.getUTCDate() === d
}

/** A 'YYYY-MM-DD' key as a local-midnight Date (never UTC-parsed). */
export function parseDayKey(key: string): Date {
  const [y = 1970, m = 1, d = 1] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** True if the date key falls on a Monday (calendar-only, timezone-free). */
export function isMondayKey(key: string): boolean {
  if (!isDateKey(key)) return false
  const [y = 0, m = 1, d = 1] = key.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay() === 1
}

/** Shift a day key by n days (local calendar arithmetic, DST-safe). */
export function addDays(key: string, n: number): string {
  const date = parseDayKey(key)
  date.setDate(date.getDate() + n)
  return dayKey(date)
}

/** The week key (its Monday, local time) of the week containing `date`. */
export function weekKey(date: Date = new Date()): string {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const sinceMonday = (copy.getDay() + 6) % 7 // Sun=0 → 6, Mon=1 → 0
  copy.setDate(copy.getDate() - sinceMonday)
  return dayKey(copy)
}

/** The seven day keys (Mon..Sun) of a week key. */
export function weekDays(week: string): string[] {
  return Array.from({ length: 7 }, (_, i) => addDays(week, i))
}

// --- Validation --------------------------------------------------------------

export type ParseResult = { ok: true; plan: LifePlan } | { ok: false; errors: string[] }

type Obj = Record<string, unknown>

function isObj(v: unknown): v is Obj {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function utf8Bytes(s: string): number {
  return new TextEncoder().encode(s).length
}

/**
 * Parse and fully validate pasted week JSON. Returns the normalized plan
 * (every array present, absent task fields as null, text trimmed) or every
 * error found — never a partial plan.
 */
export function parseWeekJson(text: string): ParseResult {
  let value: unknown
  try {
    value = JSON.parse(text)
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err)
    return { ok: false, errors: [`Not valid JSON: ${reason}`] }
  }
  return validatePlan(value)
}

/** Validate an already-parsed value (see parseWeekJson). */
export function validatePlan(value: unknown): ParseResult {
  const errors: string[] = []
  const err = (msg: string) => errors.push(msg)

  if (!isObj(value)) return { ok: false, errors: ['The week must be a JSON object'] }

  const allowed = ['version', 'week', 'focus', 'rules', 'tasks', 'trackers', 'sundayCheck', 'checkins']
  unknownKeys(value, allowed, '', err)

  if (value.version !== 1) err(`version must be 1 (got ${JSON.stringify(value.version) ?? 'nothing'})`)

  const week = value.week
  if (!isDateKey(week)) err('week must be a date written YYYY-MM-DD')
  else if (!isMondayKey(week)) err(`week ${week} is not a Monday`)

  const focus = arrayField(value, 'focus', LIFE_CAPS.focus, err).map((raw, i): LifeFocus => {
    const p = `focus[${i}]`
    const o = itemObj(raw, p, ['id', 'title'], err)
    return { id: idField(o, p, err), title: textField(o, 'title', p, LIFE_CAPS.focusTitle, true, err) }
  })
  uniqueIds(focus, 'focus', err)

  const rules = arrayField(value, 'rules', LIFE_CAPS.rules, err).map((raw, i) => {
    const p = `rules[${i}]`
    if (typeof raw !== 'string') {
      err(`${p} must be a string`)
      return ''
    }
    const t = raw.trim()
    if (!t) err(`${p} must not be empty`)
    if (t.length > LIFE_CAPS.rule) err(`${p} is longer than ${LIFE_CAPS.rule} characters`)
    return t
  })

  const tasks = arrayField(value, 'tasks', LIFE_CAPS.tasks, err).map((raw, i): LifeTask => {
    const p = `tasks[${i}]`
    const o = itemObj(raw, p, ['id', 'title', 'when', 'deadline', 'area', 'project', 'tags', 'notes'], err)
    const when = o.when ?? null
    if (
      when !== null &&
      !isDateKey(when) &&
      !(THINGS_WHEN_KEYWORDS as readonly unknown[]).includes(when)
    ) {
      err(`${p}.when must be YYYY-MM-DD, one of ${THINGS_WHEN_KEYWORDS.join('/')}, or null`)
    }
    const deadline = o.deadline ?? null
    if (deadline !== null && !isDateKey(deadline)) err(`${p}.deadline must be YYYY-MM-DD or null`)
    const tagsRaw = o.tags ?? []
    let tags: string[] = []
    if (!Array.isArray(tagsRaw)) err(`${p}.tags must be an array of strings`)
    else {
      if (tagsRaw.length > LIFE_CAPS.tags) err(`${p}.tags has more than ${LIFE_CAPS.tags} tags`)
      tags = tagsRaw.map((t, j) => {
        if (typeof t !== 'string' || !t.trim()) {
          err(`${p}.tags[${j}] must be a non-empty string`)
          return ''
        }
        if (t.trim().length > LIFE_CAPS.tag) err(`${p}.tags[${j}] is longer than ${LIFE_CAPS.tag} characters`)
        return t.trim()
      })
    }
    return {
      id: idField(o, p, err),
      title: textField(o, 'title', p, LIFE_CAPS.taskTitle, true, err),
      when: typeof when === 'string' ? when : null,
      deadline: typeof deadline === 'string' ? deadline : null,
      area: nullableText(o, 'area', p, LIFE_CAPS.areaProject, err),
      project: nullableText(o, 'project', p, LIFE_CAPS.areaProject, err),
      tags,
      notes: textField(o, 'notes', p, LIFE_CAPS.taskNotes, false, err),
    }
  })
  uniqueIds(tasks, 'tasks', err)

  const trackers = arrayField(value, 'trackers', LIFE_CAPS.trackers, err).map((raw, i): LifeTracker => {
    const p = `trackers[${i}]`
    const o = itemObj(raw, p, ['id', 'emoji', 'label', 'target', 'max', 'energy'], err)
    const energy = o.energy ?? false
    if (typeof energy !== 'boolean') err(`${p}.energy must be true or false`)
    return {
      id: idField(o, p, err),
      emoji: textField(o, 'emoji', p, LIFE_CAPS.emoji, false, err),
      label: textField(o, 'label', p, LIFE_CAPS.trackerLabel, true, err),
      target: countField(o, 'target', p, err),
      max: countField(o, 'max', p, err),
      energy: energy === true,
    }
  })
  uniqueIds(trackers, 'trackers', err)

  const sundayCheck = arrayField(value, 'sundayCheck', LIFE_CAPS.questions, err).map(
    (raw, i): LifeQuestion => {
      const p = `sundayCheck[${i}]`
      const o = itemObj(raw, p, ['id', 'label', 'type'], err)
      const type = o.type
      if (!(QUESTION_TYPES as readonly unknown[]).includes(type)) {
        err(`${p}.type must be one of ${QUESTION_TYPES.join(', ')}`)
      }
      return {
        id: idField(o, p, err),
        label: textField(o, 'label', p, LIFE_CAPS.questionLabel, true, err),
        type: (QUESTION_TYPES as readonly unknown[]).includes(type) ? (type as LifeQuestionType) : 'text',
      }
    },
  )
  uniqueIds(sundayCheck, 'sundayCheck', err)

  const checkins = arrayField(value, 'checkins', LIFE_CAPS.checkins, err).map((raw, i): LifeCheckin => {
    const p = `checkins[${i}]`
    const o = itemObj(raw, p, ['date', 'label'], err)
    if (!isDateKey(o.date)) err(`${p}.date must be YYYY-MM-DD`)
    return {
      date: typeof o.date === 'string' ? o.date : '',
      label: textField(o, 'label', p, LIFE_CAPS.checkinLabel, true, err),
    }
  })

  if (errors.length > 0) return { ok: false, errors }

  const plan: LifePlan = {
    version: 1,
    week: week as string,
    focus,
    rules,
    tasks,
    trackers,
    sundayCheck,
    checkins,
  }
  const bytes = utf8Bytes(JSON.stringify(plan))
  if (bytes > LIFE_CAPS.planBytes) {
    return { ok: false, errors: [`The week is too large (${bytes} bytes, max ${LIFE_CAPS.planBytes})`] }
  }
  return { ok: true, plan }
}

function unknownKeys(o: Obj, allowed: string[], path: string, err: (m: string) => void): void {
  for (const k of Object.keys(o)) {
    if (!allowed.includes(k)) err(`${path ? `${path}.` : ''}${k} is not a known field`)
  }
}

function arrayField(o: Obj, key: string, cap: number, err: (m: string) => void): unknown[] {
  const v = o[key]
  if (v === undefined || v === null) return []
  if (!Array.isArray(v)) {
    err(`${key} must be an array`)
    return []
  }
  if (v.length > cap) err(`${key} has ${v.length} items (max ${cap})`)
  return v
}

function itemObj(raw: unknown, path: string, allowed: string[], err: (m: string) => void): Obj {
  if (!isObj(raw)) {
    err(`${path} must be an object`)
    return {}
  }
  unknownKeys(raw, allowed, path, err)
  return raw
}

function idField(o: Obj, path: string, err: (m: string) => void): string {
  const id = o.id
  if (typeof id !== 'string' || !LIFE_CAPS.idPattern.test(id)) {
    err(`${path}.id must be 1–40 characters of letters, digits, "_", "." or "-"`)
    return typeof id === 'string' ? id : ''
  }
  return id
}

function textField(
  o: Obj,
  key: string,
  path: string,
  cap: number,
  required: boolean,
  err: (m: string) => void,
): string {
  const v = o[key]
  if (v === undefined || v === null) {
    if (required) err(`${path}.${key} is required`)
    return ''
  }
  if (typeof v !== 'string') {
    err(`${path}.${key} must be a string`)
    return ''
  }
  const t = v.trim()
  if (required && !t) err(`${path}.${key} must not be empty`)
  if (t.length > cap) err(`${path}.${key} is longer than ${cap} characters`)
  return t
}

function nullableText(o: Obj, key: string, path: string, cap: number, err: (m: string) => void): string | null {
  const t = textField(o, key, path, cap, false, err)
  return t === '' ? null : t
}

function countField(o: Obj, key: string, path: string, err: (m: string) => void): number | null {
  const v = o[key]
  if (v === undefined || v === null) return null
  if (typeof v !== 'number' || !Number.isInteger(v) || v < 1 || v > LIFE_CAPS.countMax) {
    err(`${path}.${key} must be a positive integer (1–${LIFE_CAPS.countMax})`)
    return null
  }
  return v
}

function uniqueIds(items: { id: string }[], path: string, err: (m: string) => void): void {
  const seen = new Set<string>()
  for (const { id } of items) {
    if (!id) continue
    if (seen.has(id)) err(`${path}: id "${id}" is used more than once`)
    seen.add(id)
  }
}

// --- Entry values -------------------------------------------------------------

/** Deterministic id of a keyed toggle entry (focus done, Sunday answer, task sent). */
export function entryId(week: string, kind: Exclude<LifeEntryKind, 'tracker'>, ref: string): string {
  return `${week}:${kind}:${ref}`
}

/** True for an energy rating: an integer 1–5. */
export function isEnergy(n: unknown): n is number {
  return typeof n === 'number' && Number.isInteger(n) && n >= 1 && n <= 5
}

/** Check a Sunday answer against its question type; null = cleared. Returns an error or null. */
export function validateAnswer(type: LifeQuestionType, answer: LifeAnswer): string | null {
  if (answer === null) return null
  switch (type) {
    case 'boolean':
      return typeof answer === 'boolean' ? null : 'Answer yes or no'
    case 'scale5':
      return isEnergy(answer) ? null : 'Pick a value from 1 to 5'
    case 'number':
      return typeof answer === 'number' && Number.isFinite(answer) && Math.abs(answer) <= LIFE_CAPS.answerNumber
        ? null
        : 'Enter a number'
    case 'text':
      return typeof answer === 'string' && answer.length <= LIFE_CAPS.answerText
        ? null
        : `Keep it under ${LIFE_CAPS.answerText} characters`
  }
}

// --- Week summary (shared by the Week screen and the export) -----------------

export interface TrackerSummary {
  tracker: LifeTracker
  total: number
  /** Count per day, Mon..Sun (index 0 = Monday). */
  perDay: number[]
  /** This week's entries for the tracker, oldest first. */
  entries: Extract<LifeEntry, { kind: 'tracker' }>[]
  /** target reached (null when there's no target). */
  reachedTarget: boolean | null
  /** max reached or exceeded — a soft warning, never a block. */
  atMax: boolean
}

export interface WeekSummary {
  focusDone: Set<string>
  trackers: TrackerSummary[]
  answers: Map<string, LifeAnswer>
  sentTaskIds: Set<string>
  /** Meaningful entries whose ref is no longer in the plan (kept, hidden). */
  removed: LifeEntry[]
}

/** Fold a week's entries onto its plan. Entries of other weeks are ignored. */
export function summarizeWeek(plan: LifePlan, entries: readonly LifeEntry[]): WeekSummary {
  const days = weekDays(plan.week)
  const mine = entries
    .filter((e) => e.week === plan.week)
    .slice()
    .sort((a, b) => a.createdAt - b.createdAt)
  const ids = {
    focus: new Set(plan.focus.map((f) => f.id)),
    tracker: new Set(plan.trackers.map((t) => t.id)),
    sunday: new Set(plan.sundayCheck.map((q) => q.id)),
    sent: new Set(plan.tasks.map((t) => t.id)),
  }

  const focusDone = new Set<string>()
  const answers = new Map<string, LifeAnswer>()
  const sentTaskIds = new Set<string>()
  const removed: LifeEntry[] = []

  for (const e of mine) {
    const known = ids[e.kind].has(e.ref)
    if (!known) {
      if (isMeaningful(e)) removed.push(e)
      continue
    }
    if (e.kind === 'focus' && e.value.done) focusDone.add(e.ref)
    else if (e.kind === 'sunday' && e.value.answer !== null) answers.set(e.ref, e.value.answer)
    else if (e.kind === 'sent' && e.value.sent) sentTaskIds.add(e.ref)
  }

  const trackers = plan.trackers.map((tracker): TrackerSummary => {
    const list = mine.filter(
      (e): e is Extract<LifeEntry, { kind: 'tracker' }> => e.kind === 'tracker' && e.ref === tracker.id,
    )
    const perDay = days.map((d) => list.filter((e) => e.day === d).length)
    const total = list.length
    return {
      tracker,
      total,
      perDay,
      entries: list,
      reachedTarget: tracker.target === null ? null : total >= tracker.target,
      atMax: tracker.max !== null && total >= tracker.max,
    }
  })

  return { focusDone, trackers, answers, sentTaskIds, removed }
}

function isMeaningful(e: LifeEntry): boolean {
  switch (e.kind) {
    case 'tracker':
      return true
    case 'focus':
      return e.value.done
    case 'sunday':
      return e.value.answer !== null
    case 'sent':
      return e.value.sent
  }
}

/** The nearest check-in on or after `today` (a day key), or null. */
export function nextCheckin(
  plan: LifePlan,
  today: string = dayKey(new Date()),
): (LifeCheckin & { daysLeft: number }) | null {
  const next = plan.checkins
    .filter((c) => c.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))[0]
  if (!next) return null
  const ms = parseDayKey(next.date).getTime() - parseDayKey(today).getTime()
  return { ...next, daysLeft: Math.round(ms / 86_400_000) }
}

// --- Import preview diff -------------------------------------------------------

export interface ListDiff<T> {
  added: T[]
  removed: T[]
  /** Same id, different content: [old, new]. */
  changed: [T, T][]
}

export interface PlanDiff {
  /** True when there is no previous plan for this week. */
  firstImport: boolean
  focus: ListDiff<LifeFocus>
  tasks: ListDiff<LifeTask>
  trackers: ListDiff<LifeTracker>
  sundayCheck: ListDiff<LifeQuestion>
  rules: { added: string[]; removed: string[] }
  checkins: { added: LifeCheckin[]; removed: LifeCheckin[] }
  /** Human lines for the preview, e.g. "1 tracker removed", "2 tasks added". */
  summary: string[]
  /** True when the new plan is identical to the old one. */
  unchanged: boolean
}

function diffById<T extends { id: string }>(oldList: readonly T[], newList: readonly T[]): ListDiff<T> {
  const oldById = new Map(oldList.map((x) => [x.id, x]))
  const newIds = new Set(newList.map((x) => x.id))
  const added: T[] = []
  const changed: [T, T][] = []
  for (const n of newList) {
    const o = oldById.get(n.id)
    if (!o) added.push(n)
    else if (JSON.stringify(o) !== JSON.stringify(n)) changed.push([o, n])
  }
  return { added, removed: oldList.filter((o) => !newIds.has(o.id)), changed }
}

function diffBy<T>(oldList: readonly T[], newList: readonly T[], key: (x: T) => string) {
  const oldKeys = new Set(oldList.map(key))
  const newKeys = new Set(newList.map(key))
  return {
    added: newList.filter((x) => !oldKeys.has(key(x))),
    removed: oldList.filter((x) => !newKeys.has(key(x))),
  }
}

function plural(n: number, one: string, many = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`
}

/** What re-importing `next` over `prev` changes (prev null = first import). */
export function diffPlans(prev: LifePlan | null, next: LifePlan): PlanDiff {
  const empty: LifePlan = { ...next, focus: [], rules: [], tasks: [], trackers: [], sundayCheck: [], checkins: [] }
  const old = prev ?? empty
  const d = {
    focus: diffById(old.focus, next.focus),
    tasks: diffById(old.tasks, next.tasks),
    trackers: diffById(old.trackers, next.trackers),
    sundayCheck: diffById(old.sundayCheck, next.sundayCheck),
    rules: diffBy(old.rules, next.rules, (r) => r),
    checkins: diffBy(old.checkins, next.checkins, (c) => `${c.date} ${c.label}`),
  }
  const summary: string[] = []
  const sections: [keyof typeof d, string, string][] = [
    ['focus', 'focus item', 'focus items'],
    ['tasks', 'task', 'tasks'],
    ['trackers', 'tracker', 'trackers'],
    ['sundayCheck', 'Sunday question', 'Sunday questions'],
    ['rules', 'rule', 'rules'],
    ['checkins', 'check-in', 'check-ins'],
  ]
  for (const [key, one, many] of sections) {
    const s = d[key]
    if (s.added.length) summary.push(`${plural(s.added.length, one, many)} added`)
    if (s.removed.length) summary.push(`${plural(s.removed.length, one, many)} removed`)
    if ('changed' in s && s.changed.length) summary.push(`${plural(s.changed.length, one, many)} changed`)
  }
  const unchanged = prev !== null && JSON.stringify(prev) === JSON.stringify(next)
  // Same items, different order: still worth saying before the owner saves.
  if (!unchanged && summary.length === 0) summary.push('order changed')
  return { firstImport: prev === null, ...d, summary: unchanged ? [] : summary, unchanged }
}

// --- Things bridge -------------------------------------------------------------

export interface ThingsTodo {
  type: 'to-do'
  attributes: {
    title: string
    notes?: string
    when?: string
    deadline?: string
    tags?: string[]
    list?: string
  }
}

/** The JSON array handed to Things (exported for the preview and tests). */
export function thingsItems(tasks: readonly LifeTask[]): ThingsTodo[] {
  return tasks.map((t) => {
    const where = [t.area, t.project].filter((x): x is string => !!x).join(' › ')
    const notes = [t.notes, where].filter(Boolean).join('\n\n')
    const list = t.project ?? t.area
    const attributes: ThingsTodo['attributes'] = { title: t.title }
    if (notes) attributes.notes = notes
    if (t.when) attributes.when = t.when
    if (t.deadline) attributes.deadline = t.deadline
    if (t.tags.length) attributes.tags = t.tags
    if (list) attributes.list = list
    return { type: 'to-do', attributes }
  })
}

/**
 * `things:///json?data=…&reveal=true` creating one to-do per task (creation
 * only, no auth token). `list` is the project, else the area; a list or tag
 * that doesn't exist in Things is ignored by Things (to-do lands in the
 * Inbox), so "Area › Project" is always appended to the notes.
 */
export function buildThingsUrl(tasks: readonly LifeTask[]): string {
  const data = encodeURIComponent(JSON.stringify(thingsItems(tasks)))
  return `things:///json?data=${data}&reveal=true`
}

// --- Export ---------------------------------------------------------------------

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function formatAnswer(q: LifeQuestion | undefined, a: LifeAnswer): string {
  if (a === null) return '—'
  if (typeof a === 'boolean') return a ? 'yes' : 'no'
  if (q?.type === 'scale5') return `${a}/5`
  return String(a)
}

function energyPair(e: Extract<LifeEntry, { kind: 'tracker' }>): string | null {
  const { energyBefore: b, energyAfter: a } = e.value
  if (b === undefined && a === undefined) return null
  return `${b ?? '?'}→${a ?? '?'}`
}

/** Markdown for the week: focus, trackers per day + energy, Sunday, tasks,
 *  entries removed from the plan, and the raw JSON in a <details> block. */
export function buildExportMarkdown(plan: LifePlan, entries: readonly LifeEntry[]): string {
  const s = summarizeWeek(plan, entries)
  const mine = entries.filter((e) => e.week === plan.week)
  const out: string[] = [`# Week of ${plan.week}`, '']

  if (plan.focus.length) {
    out.push('## Focus', '')
    for (const f of plan.focus) out.push(`- [${s.focusDone.has(f.id) ? 'x' : ' '}] ${f.title}`)
    out.push('')
  }

  if (s.trackers.length) {
    out.push('## Trackers', '')
    for (const t of s.trackers) {
      const { tracker } = t
      const goal = tracker.target !== null ? ` / ${tracker.target}` : ''
      const cap = tracker.max !== null ? ` (max ${tracker.max}${t.atMax ? ', reached' : ''})` : ''
      out.push(`- ${tracker.emoji ? `${tracker.emoji} ` : ''}${tracker.label}: ${t.total}${goal}${cap}`)
      const days = t.perDay
        .map((n, i) => (n ? `${DAY_NAMES[i]} ${n}` : null))
        .filter(Boolean)
        .join(' · ')
      if (days) out.push(`  - ${days}`)
      const pairs = t.entries.map(energyPair).filter(Boolean)
      if (pairs.length) out.push(`  - energy: ${pairs.join(', ')}`)
    }
    out.push('')
  }

  if (plan.sundayCheck.length) {
    out.push('## Sunday check', '')
    for (const q of plan.sundayCheck) {
      out.push(`- ${q.label}: ${formatAnswer(q, s.answers.get(q.id) ?? null)}`)
    }
    out.push('')
  }

  if (plan.tasks.length) {
    out.push('## Tasks', '')
    for (const t of plan.tasks) {
      out.push(`- ${t.title}${s.sentTaskIds.has(t.id) ? ' (sent to Things)' : ''}`)
    }
    out.push('')
  }

  if (s.removed.length) {
    out.push('## Removed from plan', '')
    for (const e of s.removed) out.push(`- ${describeRemoved(e)} (removed from plan)`)
    out.push('')
  }

  const json = {
    plan,
    entries: mine
      .slice()
      .sort((a, b) => a.createdAt - b.createdAt)
      .map(({ kind, ref, day, value }) => ({ kind, ref, day, value })),
  }
  out.push(
    '<details>',
    '<summary>JSON</summary>',
    '',
    '```json',
    JSON.stringify(json, null, 2),
    '```',
    '',
    '</details>',
    '',
  )
  return out.join('\n')
}

function describeRemoved(e: LifeEntry): string {
  switch (e.kind) {
    case 'tracker': {
      const pair = energyPair(e)
      return `tracker ${e.ref}: +1 on ${e.day}${pair ? `, energy ${pair}` : ''}`
    }
    case 'focus':
      return `focus ${e.ref}: done`
    case 'sunday':
      return `Sunday ${e.ref}: ${formatAnswer(undefined, e.value.answer)}`
    case 'sent':
      return `task ${e.ref}: sent to Things`
  }
}

// --- Import link -----------------------------------------------------------------
// The week rides in the URL fragment (never sent to a server) as base64url of
// the UTF-8 JSON, so emoji and accents survive. The import screen decodes it,
// shows the preview, and only saves on an explicit tap.

export const LIFE_IMPORT_BASE = 'https://fora00.github.io/dashboard/'

function toBase64Url(bytes: Uint8Array): string {
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(s: string): Uint8Array | null {
  if (!/^[A-Za-z0-9_-]*$/.test(s) || s.length % 4 === 1) return null
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (s.length % 4)) % 4)
  try {
    const bin = atob(b64)
    return Uint8Array.from(bin, (c) => c.charCodeAt(0))
  } catch {
    return null
  }
}

/** `${base}#/life/import?d=<base64url(UTF-8 JSON)>` for a plan. */
export function encodeImportLink(plan: LifePlan, base: string = LIFE_IMPORT_BASE): string {
  const d = toBase64Url(new TextEncoder().encode(JSON.stringify(plan)))
  return `${base}#/life/import?d=${d}`
}

/**
 * Decode the `d` param of an import link back to the JSON text (feed it to
 * parseWeekJson for the preview). Never saves anything.
 */
export function decodeImportParam(d: string): { ok: true; text: string } | { ok: false; errors: string[] } {
  const bytes = fromBase64Url(d.trim())
  if (!bytes) return { ok: false, errors: ['The import link is damaged (not base64url)'] }
  try {
    return { ok: true, text: new TextDecoder('utf-8', { fatal: true }).decode(bytes) }
  } catch {
    return { ok: false, errors: ['The import link is damaged (not UTF-8 text)'] }
  }
}
