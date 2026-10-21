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

/** Free slots (0-2) given the slots already taken, lowest first. */
export function freeSlots(taken: Iterable<number>): number[] {
  const used = new Set(taken)
  return Array.from({ length: LIFE_CAPS.dayFocus }, (_, i) => i).filter((i) => !used.has(i))
}
