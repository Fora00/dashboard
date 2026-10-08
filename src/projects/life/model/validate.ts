import type {
  LifeCheckin,
  LifeFocus,
  LifePlan,
  LifeQuestion,
  LifeQuestionType,
  LifeTask,
  LifeTracker,
} from '../../../lib/db'
import { assignCheckinIds } from './checkinIds.ts'
import { AUTO_QUESTION_TYPES, LIFE_CAPS, QUESTION_TYPES, THINGS_WHEN_KEYWORDS } from './constants.ts'
import { isDateKey, isMondayKey } from './dates.ts'

// --- Validation --------------------------------------------------------------

export type ParseResult = { ok: true; plan: LifePlan } | { ok: false; errors: string[] }

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
    return { ok: false, errors: [`The input is too large (over ${MAX_INPUT_CHARS / 1000} KB) to be a week plan`] }
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
