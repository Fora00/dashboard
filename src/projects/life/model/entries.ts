import type { LifeAnswer, LifeEntryKind, LifeQuestionType } from '../../../lib/db'
import { LIFE_CAPS } from './constants.ts'

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
