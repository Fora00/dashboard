import { decodeLinkParam, toBase64Url } from '../../../lib/base64url.ts'
import { LIFE_CAPS } from './constants.ts'
import { LIFE_IMPORT_BASE } from './importLink.ts'

// "Oggi" link: the day's lines ride in the URL fragment as base64url of
// {"day","lines"}. The /life/oggi screen decodes it, shows the preview, and
// only saves on an explicit tap. Built by scripts/life-oggi-link.ts (/oggi).

export interface DayFocusPlan {
  day: string
  lines: string[]
}

/** `${base}#/life/oggi?d=<base64url(UTF-8 JSON)>`. */
export function encodeDayFocusLink(plan: DayFocusPlan, base: string = LIFE_IMPORT_BASE): string {
  const d = toBase64Url(new TextEncoder().encode(JSON.stringify(plan)))
  return `${base}#/life/oggi?d=${d}`
}

/** Validate a decoded link / pasted JSON: a YYYY-MM-DD day and 1-3 non-empty lines. */
export function parseDayFocusJson(text: string): { ok: true; plan: DayFocusPlan } | { ok: false; errors: string[] } {
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    return { ok: false, errors: ['Not valid JSON'] }
  }
  const o = raw as { day?: unknown; lines?: unknown } | null
  const errors: string[] = []
  if (typeof o?.day !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(o.day)) errors.push('"day" must be YYYY-MM-DD')
  const lines = Array.isArray(o?.lines) ? o.lines : null
  if (!lines || !lines.every((l) => typeof l === 'string')) errors.push('"lines" must be a list of strings')
  if (errors.length > 0 || !lines) return { ok: false, errors }
  const clean = (lines as string[]).map((l) => l.trim().slice(0, LIFE_CAPS.dayFocusTitle)).filter((l) => l.length > 0)
  if (clean.length === 0) return { ok: false, errors: ['"lines" is empty'] }
  if (clean.length > LIFE_CAPS.dayFocus) return { ok: false, errors: [`At most ${LIFE_CAPS.dayFocus} lines`] }
  return { ok: true, plan: { day: (o as { day: string }).day, lines: clean } }
}

export function decodeDayFocusParam(d: string): { ok: true; text: string } | { ok: false; errors: string[] } {
  return decodeLinkParam(d)
}
