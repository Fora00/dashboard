import type {
  LifeCheckin,
  LifeChoreValue,
  LifeFocus,
  LifePlan,
  LifeQuestion,
  LifeQuestionType,
  LifePlaybook,
  LifeRecapItem,
  LifeStreakValue,
  LifeTask,
  LifeTracker,
} from '../../../lib/db'
import { assignCheckinIds } from './checkinIds.ts'
import { AUTO_QUESTION_TYPES, LIFE_CAPS, QUESTION_TYPES, THINGS_WHEN_KEYWORDS } from './constants.ts'
import { isDateKey, isMondayKey } from './dates.ts'
import { streakRef } from './streaks.ts'

// --- Validation --------------------------------------------------------------

/**
 * `streaks` is the optional Streaks-app snapshot riding along with the week
 * (not part of the plan: it's stored as life_entries, see importWeek).
 * Undefined when the JSON has no `streaks` field (existing rows untouched).
 */
export type ParseResult = { ok: true; plan: LifePlan; streaks?: LifeStreakValue[] } | { ok: false; errors: string[] }

/** Raw pasted text beyond this is rejected before JSON.parse. */
const MAX_INPUT_CHARS = 200_000

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
  if (text.length > MAX_INPUT_CHARS) {
    return {
      ok: false,
      errors: [`The input is too large (over ${MAX_INPUT_CHARS / 1000} KB) to be a week plan`],
    }
  }
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

  const allowed = [
    'version',
    'week',
    'focus',
    'rules',
    'tasks',
    'trackers',
    'sundayCheck',
    'checkins',
    'recap',
    'playbook',
    'streaks',
  ]
  unknownKeys(value, allowed, '', err)

  if (value.version !== 1) err(`version must be 1 (got ${JSON.stringify(value.version) ?? 'nothing'})`)

  const week = value.week
  if (!isDateKey(week)) err('week must be a date written YYYY-MM-DD')
  else if (!isMondayKey(week)) err(`week ${week} is not a Monday`)

  const focus = arrayField(value, 'focus', LIFE_CAPS.focus, err).map((raw, i): LifeFocus => {
    const p = `focus[${i}]`
    const o = itemObj(raw, p, ['id', 'title'], err)
    return {
      id: idField(o, p, err),
      title: textField(o, 'title', p, LIFE_CAPS.focusTitle, true, err),
    }
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
    if (hasControl(t, false)) err(`${p} must not contain line breaks or control characters`)
    return t
  })

  const tasks = arrayField(value, 'tasks', LIFE_CAPS.tasks, err).map((raw, i): LifeTask => {
    const p = `tasks[${i}]`
    const o = itemObj(raw, p, ['id', 'title', 'when', 'deadline', 'area', 'project', 'listId', 'tags', 'notes'], err)
    const when = o.when ?? null
    if (when !== null && !isDateKey(when) && !(THINGS_WHEN_KEYWORDS as readonly unknown[]).includes(when)) {
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
    const task: LifeTask = {
      id: idField(o, p, err),
      title: textField(o, 'title', p, LIFE_CAPS.taskTitle, true, err),
      when: typeof when === 'string' ? when : null,
      deadline: typeof deadline === 'string' ? deadline : null,
      area: nullableText(o, 'area', p, LIFE_CAPS.areaProject, err),
      project: nullableText(o, 'project', p, LIFE_CAPS.areaProject, err),
      tags,
      notes: textField(o, 'notes', p, LIFE_CAPS.taskNotes, false, err, true),
    }
    const listId = o.listId
    if (listId !== undefined && listId !== null && listId !== '') {
      if (typeof listId !== 'string' || !LIFE_CAPS.thingsIdPattern.test(listId)) {
        err(`${p}.listId must be a Things id (letters, digits and "-")`)
      } else {
        task.listId = listId
      }
    }
    return task
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

  const sundayCheck = arrayField(value, 'sundayCheck', LIFE_CAPS.questions, err).map((raw, i): LifeQuestion => {
    const p = `sundayCheck[${i}]`
    const o = itemObj(raw, p, ['id', 'label', 'type', 'tracker'], err)
    const type = o.type
    if (!(QUESTION_TYPES as readonly unknown[]).includes(type)) {
      err(`${p}.type must be one of ${QUESTION_TYPES.join(', ')}`)
    }
    const q: LifeQuestion = {
      id: idField(o, p, err),
      label: textField(o, 'label', p, LIFE_CAPS.questionLabel, true, err),
      type: (QUESTION_TYPES as readonly unknown[]).includes(type) ? (type as LifeQuestionType) : 'text',
    }
    const link = o.tracker
    if (link !== undefined && link !== null && link !== '') {
      if (typeof link !== 'string' || !trackers.some((t) => t.id === link)) {
        err(`${p}.tracker must be the id of one of this week's trackers`)
      } else if (!(AUTO_QUESTION_TYPES as readonly string[]).includes(q.type)) {
        err(`${p}.tracker only works with a number or boolean question`)
      } else {
        q.tracker = link
      }
    }
    return q
  })
  uniqueIds(sundayCheck, 'sundayCheck', err)

  // Check-in ids are optional in the input (plans written before 2026-09-28
  // have none); a missing one is derived from date + label, see
  // withCheckinIds(). Explicit ids are validated like every other id.
  const checkinsRaw = arrayField(value, 'checkins', LIFE_CAPS.checkins, err).map((raw, i) => {
    const p = `checkins[${i}]`
    const o = itemObj(raw, p, ['id', 'date', 'label'], err)
    if (!isDateKey(o.date)) err(`${p}.date must be YYYY-MM-DD`)
    return {
      id: o.id === undefined || o.id === null || o.id === '' ? undefined : idField(o, p, err),
      date: typeof o.date === 'string' ? o.date : '',
      label: textField(o, 'label', p, LIFE_CAPS.checkinLabel, true, err),
    }
  })
  uniqueIds(
    checkinsRaw.filter((c): c is LifeCheckin => c.id !== undefined),
    'checkins',
    err,
  )
  const checkins = assignCheckinIds(checkinsRaw)

  const recap = arrayField(value, 'recap', LIFE_CAPS.recap, err).map((raw, i) => recapItem(raw, `recap[${i}]`, err))
  uniqueIds(recap, 'recap', err)

  // Optional: plans written before the playbook existed have none.
  let playbook: LifePlaybook | undefined
  if (value.playbook !== undefined && value.playbook !== null) {
    const o = itemObj(value.playbook, 'playbook', ['section', 'practice', 'plan'], err)
    const section = textField(o, 'section', 'playbook', LIFE_CAPS.playbookSection, true, err)
    const practice = textField(o, 'practice', 'playbook', LIFE_CAPS.playbookPractice, true, err)
    const how = nullableText(o, 'plan', 'playbook', LIFE_CAPS.playbookPlan, err)
    playbook = { section, practice, ...(how ? { plan: how } : {}) }
  }

  const streaks = value.streaks === undefined || value.streaks === null ? undefined : streaksField(value, err)

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
    // Only present when given: most plans have no recap.
    ...(recap.length > 0 ? { recap } : {}),
    ...(playbook ? { playbook } : {}),
  }
  const bytes = utf8Bytes(JSON.stringify(plan))
  if (bytes > LIFE_CAPS.planBytes) {
    return {
      ok: false,
      errors: [`The week is too large (${bytes} bytes, max ${LIFE_CAPS.planBytes})`],
    }
  }
  return { ok: true, plan, ...(streaks ? { streaks } : {}) }
}

/**
 * A bare Streaks snapshot (the `/streaks` link): a JSON array of the same
 * items as the week JSON's `streaks`, validated by the same rules.
 */
export function parseStreaksJson(
  text: string,
): { ok: true; streaks: LifeStreakValue[] } | { ok: false; errors: string[] } {
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    return { ok: false, errors: ['Not valid JSON'] }
  }
  const errors: string[] = []
  const streaks = streaksField({ streaks: raw }, (m) => errors.push(m))
  if (errors.length > 0) return { ok: false, errors }
  return { ok: true, streaks }
}

/** A bare chores snapshot (inside the /oggi link): a JSON array of chores. */
export function parseChoresJson(
  text: string,
): { ok: true; chores: LifeChoreValue[] } | { ok: false; errors: string[] } {
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    return { ok: false, errors: ['Not valid JSON'] }
  }
  const errors: string[] = []
  const chores = choresField({ chores: raw }, (m) => errors.push(m))
  if (errors.length > 0) return { ok: false, errors }
  return { ok: true, chores }
}

/** The `chores` snapshot: Things project "Casa catia" as the Mac read it. */
export function choresField(value: Obj, err: (m: string) => void): LifeChoreValue[] {
  if (!Array.isArray(value.chores)) {
    err('chores must be an array')
    return []
  }
  const items = arrayField(value, 'chores', LIFE_CAPS.chores, err).map((raw, i): LifeChoreValue => {
    const p = `chores[${i}]`
    const o = itemObj(raw, p, ['name', 'repeat', 'done', 'count', 'last', 'wk', 'asOf'], err)
    const name = textField(o, 'name', p, LIFE_CAPS.choreName, true, err)
    if (typeof o.repeat !== 'boolean') err(`${p}.repeat must be true or false`)
    if (typeof o.done !== 'boolean') err(`${p}.done must be true or false`)
    if (!intIn(o.count, 0, LIFE_CAPS.choreMax)) err(`${p}.count must be an integer 0–${LIFE_CAPS.choreMax}`)
    const last = o.last === undefined || o.last === null ? undefined : o.last
    if (last !== undefined && !(typeof last === 'string' && isDateKey(last))) err(`${p}.last must be YYYY-MM-DD`)
    const wk = o.wk === undefined || o.wk === null ? undefined : o.wk
    if (wk !== undefined && !(typeof wk === 'string' && CHORE_WK_RE.test(wk)))
      err(`${p}.wk must be ${LIFE_CAPS.choreWeeks} characters, each "0" or "1"`)
    if (typeof o.asOf !== 'string' || !isDateKey(o.asOf)) err(`${p}.asOf must be YYYY-MM-DD`)
    return {
      name,
      repeat: o.repeat === true,
      done: o.done === true,
      count: typeof o.count === 'number' ? o.count : 0,
      ...(typeof last === 'string' ? { last } : {}),
      ...(typeof wk === 'string' ? { wk } : {}),
      asOf: typeof o.asOf === 'string' ? o.asOf : '',
    }
  })
  const seen = new Map<string, string>()
  for (const c of items) {
    if (!c.name) continue
    const ref = streakRef(c.name)
    const other = seen.get(ref)
    if (other !== undefined) err(`chores: "${other}" and "${c.name}" are the same chore (rename one in Things)`)
    else seen.set(ref, c.name)
  }
  return items
}

const CHORE_WK_RE = new RegExp(`^[01]{${LIFE_CAPS.choreWeeks}}$`)

const STREAK_DAYS_RE = new RegExp(`^[dm-]{${LIFE_CAPS.streakDays}}$`)

/** The optional `streaks` snapshot: habits from the Streaks app, read-only here. */
export function streaksField(value: Obj, err: (m: string) => void): LifeStreakValue[] {
  if (!Array.isArray(value.streaks)) {
    err('streaks must be an array')
    return []
  }
  const items = arrayField(value, 'streaks', LIFE_CAPS.streaks, err).map((raw, i): LifeStreakValue => {
    const p = `streaks[${i}]`
    const o = itemObj(raw, p, ['name', 'emoji', 'days', 'streak', 'best', 'asOf'], err)
    const name = textField(o, 'name', p, LIFE_CAPS.streakName, true, err)
    const emoji = textField(o, 'emoji', p, LIFE_CAPS.emoji, false, err)
    const days = o.days
    if (typeof days !== 'string' || !STREAK_DAYS_RE.test(days))
      err(`${p}.days must be ${LIFE_CAPS.streakDays} characters, each "d" (done), "m" (missed) or "-"`)
    if (!intIn(o.streak, 0, LIFE_CAPS.streakMax)) err(`${p}.streak must be an integer 0–${LIFE_CAPS.streakMax}`)
    if (o.best !== undefined && o.best !== null && !intIn(o.best, 0, LIFE_CAPS.streakMax))
      err(`${p}.best must be an integer 0–${LIFE_CAPS.streakMax}`)
    if (!isDateKey(o.asOf)) err(`${p}.asOf must be a date written YYYY-MM-DD`)
    return {
      name,
      ...(emoji ? { emoji } : {}),
      days: typeof days === 'string' ? days : '',
      streak: typeof o.streak === 'number' ? o.streak : 0,
      ...(typeof o.best === 'number' ? { best: o.best } : {}),
      asOf: typeof o.asOf === 'string' ? o.asOf : '',
    }
  })
  // The ref is a slug of the name: two names that slug alike would overwrite each other.
  const seen = new Map<string, string>()
  for (const s of items) {
    if (!s.name) continue
    const ref = streakRef(s.name)
    const other = seen.get(ref)
    if (other !== undefined) err(`streaks: "${other}" and "${s.name}" are the same habit (rename one in Streaks)`)
    else seen.set(ref, s.name)
  }
  return items
}

function intIn(v: unknown, min: number, max: number): v is number {
  return typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max
}

/** A recap series: ascending, unique dates, length-capped. */
function seriesField(o: Obj, key: string, cap: number, path: string, err: (m: string) => void): Obj[] {
  const v = o[key]
  if (!Array.isArray(v) || v.length === 0) {
    err(`${path}.${key} must be a non-empty array`)
    return []
  }
  if (v.length > cap) {
    err(`${path}.${key} has ${v.length} items (max ${cap})`)
    return []
  }
  return v.map((raw, j) =>
    itemObj(raw, `${path}.${key}[${j}]`, key === 'weeks' ? ['week', 'done', 'of'] : ['date', 'value'], err),
  )
}

function recapItem(raw: unknown, p: string, err: (m: string) => void): LifeRecapItem {
  const o = itemObj(raw, p, ['id', 'kind', 'label', 'unit', 'weeks', 'returns', 'points', 'criterion', 'closed'], err)
  const kind = o.kind
  if (kind !== 'minimum' && kind !== 'progress') err(`${p}.kind must be "minimum" or "progress"`)
  const item: LifeRecapItem = {
    id: idField(o, p, err),
    kind: kind === 'progress' ? 'progress' : 'minimum',
    label: textField(o, 'label', p, LIFE_CAPS.trackerLabel, true, err),
  }
  const isMin = kind === 'minimum'
  const isProg = kind === 'progress'
  for (const k of isMin ? ['unit', 'points'] : isProg ? ['weeks', 'returns'] : []) {
    if (o[k] !== undefined) err(`${p}.${k} does not belong to a "${String(kind)}" item`)
  }
  if (isMin) {
    let prev = ''
    item.weeks = seriesField(o, 'weeks', LIFE_CAPS.recapWeeks, p, err).map((w, j) => {
      const q = `${p}.weeks[${j}]`
      if (!isDateKey(w.week) || !isMondayKey(w.week)) err(`${q}.week must be a Monday, YYYY-MM-DD`)
      else {
        if (w.week <= prev) err(`${q}.week must come after the previous one`)
        prev = w.week
      }
      if (!intIn(w.of, 1, 7)) err(`${q}.of must be an integer 1–7`)
      if (!intIn(w.done, 0, typeof w.of === 'number' ? w.of : 7)) err(`${q}.done must be an integer 0–of`)
      return { week: String(w.week), done: Number(w.done), of: Number(w.of) }
    })
    if (o.returns !== undefined) {
      if (!intIn(o.returns, 0, LIFE_CAPS.countMax)) err(`${p}.returns must be an integer 0–${LIFE_CAPS.countMax}`)
      else item.returns = o.returns
    }
  }
  if (isProg) {
    const unit = nullableText(o, 'unit', p, LIFE_CAPS.recapUnit, err)
    if (unit) item.unit = unit
    let prev = ''
    item.points = seriesField(o, 'points', LIFE_CAPS.recapPoints, p, err).map((pt, j) => {
      const q = `${p}.points[${j}]`
      if (!isDateKey(pt.date)) err(`${q}.date must be YYYY-MM-DD`)
      else {
        if (pt.date <= prev) err(`${q}.date must come after the previous one`)
        prev = pt.date
      }
      if (typeof pt.value !== 'number' || !Number.isFinite(pt.value) || Math.abs(pt.value) > LIFE_CAPS.answerNumber)
        err(`${q}.value must be a number`)
      return { date: String(pt.date), value: Number(pt.value) }
    })
  }
  if (o.criterion !== undefined && o.criterion !== null) {
    const c = itemObj(o.criterion, `${p}.criterion`, ['text', 'met', 'of'], err)
    const text = textField(c, 'text', `${p}.criterion`, LIFE_CAPS.recapCriterion, true, err)
    if (!intIn(c.of, 1, 100)) err(`${p}.criterion.of must be an integer 1–100`)
    if (!intIn(c.met, 0, typeof c.of === 'number' ? c.of : 100)) err(`${p}.criterion.met must be an integer 0–of`)
    item.criterion = { text, met: Number(c.met), of: Number(c.of) }
  }
  if (o.closed !== undefined) {
    if (typeof o.closed !== 'boolean') err(`${p}.closed must be true or false`)
    else if (o.closed) item.closed = true
  }
  return item
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
  if (v.length > cap) {
    // Over the cap the plan is rejected anyway: don't map every item.
    err(`${key} has ${v.length} items (max ${cap})`)
    return []
  }
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

/** True when `s` has a control character (C0/C1, DEL, line/paragraph separator); newlines and tabs are fine when `multiline`. */
function hasControl(s: string, multiline: boolean): boolean {
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i)
    if (multiline && (c === 0x09 || c === 0x0a || c === 0x0d)) continue
    if (c < 0x20 || (c >= 0x7f && c <= 0x9f) || c === 0x2028 || c === 0x2029) return true
  }
  return false
}

function textField(
  o: Obj,
  key: string,
  path: string,
  cap: number,
  required: boolean,
  err: (m: string) => void,
  multiline = false,
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
  // Control characters (and raw newlines in one-line fields) corrupt the
  // export's Markdown list lines and Things titles.
  if (hasControl(t, multiline)) {
    err(`${path}.${key} must not contain ${multiline ? 'control characters' : 'line breaks or control characters'}`)
  }
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
