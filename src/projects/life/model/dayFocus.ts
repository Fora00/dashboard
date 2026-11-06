import { LIFE_CAPS } from './constants.ts'

// Today's focus ("Focus di oggi"): pure helpers. Lines are free text; the
// rows live in life_day_focus (see lifeSync.ts). Not part of the week plan,
// summary or export.

/** Deterministic id of a day-focus row: `${day}:${slot}`, slot 0-2. */
export function dayFocusId(day: string, slot: number): string {
  return `${day}:${slot}`
}

// Leading list markers a paste may carry: bullets, dashes, checkboxes, "1." /
// "1)" numbering and the 🎯 tag.
const LEAD = /^(?:[-*•▪◦]\s+|\[[ xX]?\]\s*|\d+[.)]\s+|🎯\s*)+/u

/**
 * One title per non-empty line, list markers stripped, trimmed, each cut to
 * LIFE_CAPS.dayFocusTitle. No limit here: the caller takes what fits.
 */
export function parseFocusLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim().replace(LEAD, '').trim().slice(0, LIFE_CAPS.dayFocusTitle))
    .filter((l) => l.length > 0)
}

/** Free focus slots (0-2) given the slots already taken, lowest first. */
export function freeSlots(taken: Iterable<number>): number[] {
  const used = new Set(taken)
  return Array.from({ length: LIFE_CAPS.dayFocus }, (_, i) => i).filter((i) => !used.has(i))
}

/** Urgent lines ("Urgenze") live in slots 3-8, outside the 3-line focus. */
export const URGENT_FIRST_SLOT = LIFE_CAPS.dayFocus

/** Overdue lines ("In ritardo", Things tag 🐌) live in slots 9-14, after the urgent ones. */
export const LATE_FIRST_SLOT = URGENT_FIRST_SLOT + LIFE_CAPS.dayFocusUrgent

export function isUrgentSlot(slot: number): boolean {
  return slot >= URGENT_FIRST_SLOT && slot < LATE_FIRST_SLOT
}

export function isLateSlot(slot: number): boolean {
  return slot >= LATE_FIRST_SLOT
}

/** Free urgent slots (3-8) given the slots already taken, lowest first. */
export function freeUrgentSlots(taken: Iterable<number>): number[] {
  const used = new Set(taken)
  return Array.from({ length: LIFE_CAPS.dayFocusUrgent }, (_, i) => URGENT_FIRST_SLOT + i).filter((i) => !used.has(i))
}

/** Free late slots (9-14) given the slots already taken, lowest first. */
export function freeLateSlots(taken: Iterable<number>): number[] {
  const used = new Set(taken)
  return Array.from({ length: LIFE_CAPS.dayFocusLate }, (_, i) => LATE_FIRST_SLOT + i).filter((i) => !used.has(i))
}

/** A title starting with "~" is overdue ("In ritardo"): `{ late: true, title }` without the mark. */
export function splitLate(raw: string): { late: boolean; title: string } {
  const t = raw.trim()
  return t.startsWith('~') ? { late: true, title: t.replace(/^~+\s*/, '') } : { late: false, title: t }
}

/** A title starting with "!" is urgent: `{ urgent: true, title }` without the mark. */
export function splitUrgent(raw: string): { urgent: boolean; title: string } {
  const t = raw.trim()
  return t.startsWith('!') ? { urgent: true, title: t.replace(/^!+\s*/, '') } : { urgent: false, title: t }
}
