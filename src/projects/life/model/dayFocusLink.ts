import type { LifeChoreValue, LifeStreakValue } from '../../../lib/db'
import { decodeLinkParam, toBase64Url } from '../../../lib/base64url.ts'
import { LIFE_CAPS } from './constants.ts'
import { splitLate, splitUrgent } from './dayFocus.ts'
import { LIFE_IMPORT_BASE } from './importLink.ts'
import { choresField, streaksField } from './validate.ts'

// "Oggi" link: the day's lines ride in the URL fragment as base64url of
// {"day","lines"}; a line starting with "!" is urgent (Urgenze), one starting with "~" is overdue (In ritardo). The /life/oggi screen decodes it, shows the preview, and
// only saves on an explicit tap. Built by scripts/life-oggi-link.ts (/oggi).

export interface DayFocusPlan {
  day: string
  lines: string[]
  /** Optional Streaks snapshot riding in the same link (one Save for everything). */
  streaks?: LifeStreakValue[]
  /** Optional household chores (Things project "Casa catia"). */
  chores?: LifeChoreValue[]
}

/** `${base}#/life/oggi?d=<base64url(UTF-8 JSON)>`. */
export function encodeDayFocusLink(plan: DayFocusPlan, base: string = LIFE_IMPORT_BASE): string {
  const d = toBase64Url(new TextEncoder().encode(JSON.stringify(plan)))
  return `${base}#/life/oggi?d=${d}`
}

/**
 * Validate a decoded link / pasted JSON: a YYYY-MM-DD day and 1-3 non-empty
 * lines, plus the optional `streaks` and `chores` snapshots. With a snapshot
 * present the lines may be empty (the day's focus is then left alone).
 */
export function parseDayFocusJson(text: string): { ok: true; plan: DayFocusPlan } | { ok: false; errors: string[] } {
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    return { ok: false, errors: ['Not valid JSON'] }
  }
  const o = raw as {
    day?: unknown
    lines?: unknown
    streaks?: unknown
    chores?: unknown
  } | null
  const errors: string[] = []
  if (typeof o?.day !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(o.day)) errors.push('"day" must be YYYY-MM-DD')
  const lines = Array.isArray(o?.lines) ? o.lines : null
  if (!lines || !lines.every((l) => typeof l === 'string')) errors.push('"lines" must be a list of strings')
  const hasStreaks = o?.streaks !== undefined && o.streaks !== null
  const hasChores = o?.chores !== undefined && o.chores !== null
  const streaks = hasStreaks ? streaksField({ streaks: o?.streaks }, (m) => errors.push(m)) : undefined
  const chores = hasChores ? choresField({ chores: o?.chores }, (m) => errors.push(m)) : undefined
  if (errors.length > 0 || !lines) return { ok: false, errors }
  const clean = (lines as string[]).map((l) => l.trim().slice(0, LIFE_CAPS.dayFocusTitle)).filter((l) => l.length > 0)
  if (clean.length === 0 && !streaks && !chores) return { ok: false, errors: ['"lines" is empty'] }
  const lateCount = clean.filter((l) => splitLate(l).late).length
  const urgentCount = clean.filter((l) => splitUrgent(l).urgent).length
  if (clean.length - urgentCount - lateCount > LIFE_CAPS.dayFocus)
    return { ok: false, errors: [`At most ${LIFE_CAPS.dayFocus} lines`] }
  if (urgentCount > LIFE_CAPS.dayFocusUrgent)
    return { ok: false, errors: [`At most ${LIFE_CAPS.dayFocusUrgent} urgent lines`] }
  if (lateCount > LIFE_CAPS.dayFocusLate)
    return { ok: false, errors: [`At most ${LIFE_CAPS.dayFocusLate} overdue lines`] }
  return {
    ok: true,
    plan: {
      day: (o as { day: string }).day,
      lines: clean,
      ...(streaks ? { streaks } : {}),
      ...(chores ? { chores } : {}),
    },
  }
}

export function decodeDayFocusParam(d: string): { ok: true; text: string } | { ok: false; errors: string[] } {
  return decodeLinkParam(d)
}
