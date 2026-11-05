import type { LearningCard, LearningCheck, LearningPractice, LearningQuizAnswer } from '../../lib/db'
import type { Course, CourseModule, PracticeItem } from './types'

/** Row id for one item of a module (quiz question, card or practice item). */
export const itemKey = (courseId: string, moduleId: string, itemId: string) => `${courseId}:${moduleId}:${itemId}`

/** The learner's rows for one course (what the Dexie tables hold). */
export interface CourseState {
  quiz: LearningQuizAnswer[]
  cards: LearningCard[]
  practice: LearningPractice[]
  /** Checklist ticks (local-only, learningLocal.ts). Optional: absent = no ticks. */
  checks?: LearningCheck[]
}

export const EMPTY_STATE: CourseState = { quiz: [], cards: [], practice: [], checks: [] }

export interface Count {
  done: number
  total: number
}

export interface Bar extends Count {
  /** 0-100, rounded; 0 when there is nothing to do. */
  percent: number
}

export interface ModuleProgress {
  quiz: Count
  cards: Count
  practice: Count
  /** "Sapere": quiz + cards. */
  know: Bar
  /** "Saper fare": practice. */
  skill: Bar
  done: number
  total: number
  /** 0-100, rounded; 0 for a module with nothing to do. */
  percent: number
}

export const percent = (done: number, total: number) => (total === 0 ? 0 : Math.round((done * 100) / total))

const bar = (done: number, total: number): Bar => ({ done, total, percent: percent(done, total) })

/** Whether a practice item is a drawing exercise with yes/no criteria. */
export const hasChecklist = (item: PracticeItem) => (item.checklist?.length ?? 0) > 0

/**
 * Courses with at least one checklist exercise show two bars ("Sapere" and
 * "Saper fare"); every other course keeps the single overall bar.
 */
export const courseHasChecklist = (course: Course) => course.modules.some((m) => m.practice.some(hasChecklist))

/**
 * "Saper fare" rule for one practice item. Without a checklist: marked "Fatta"
 * (unchanged). With a checklist: marked "Fatta" AND at least one criterion
 * ticked, i.e. the learner actually looked at the sheet against the criteria.
 * Chosen as the simplest honest rule: it does not depend on photos (optional,
 * kept per device) nor on ticking every line (a beginner rarely meets all the
 * criteria, and that should not block progress).
 */
export function practiceDone(item: PracticeItem, row: LearningPractice | undefined, check: LearningCheck | undefined) {
  if (row?.done !== 1) return false
  if (!hasChecklist(item)) return true
  const n = item.checklist!.length
  return (check?.checked ?? []).some((i) => i >= 0 && i < n)
}

// Rows for an item the content no longer has (a course edited later) are
// ignored, so progress can never exceed 100%.
export function moduleProgress(courseId: string, mod: CourseModule, state: CourseState): ModuleProgress {
  const of = <T extends { courseId: string; moduleId: string; itemId: string }>(rows: T[]) =>
    new Map(rows.filter((r) => r.courseId === courseId && r.moduleId === mod.id).map((r) => [r.itemId, r]))
  const count = <T>(items: { id: string }[], rows: Map<string, T>, ok: (r: T) => boolean): Count => ({
    done: items.filter((it) => {
      const r = rows.get(it.id)
      return r !== undefined && ok(r)
    }).length,
    total: items.length,
  })
  const q = count(mod.quiz, of(state.quiz), (r) => r.correct === 1)
  const c = count(mod.cards, of(state.cards), () => true)
  const rows = of(state.practice)
  const checks = of(state.checks ?? [])
  const p: Count = {
    done: mod.practice.filter((it) => practiceDone(it, rows.get(it.id), checks.get(it.id))).length,
    total: mod.practice.length,
  }
  const done = q.done + c.done + p.done
  const total = q.total + c.total + p.total
  return {
    quiz: q,
    cards: c,
    practice: p,
    know: bar(q.done + c.done, q.total + c.total),
    skill: bar(p.done, p.total),
    done,
    total,
    percent: percent(done, total),
  }
}

export interface CourseProgress {
  modules: Record<string, ModuleProgress>
  know: Bar
  skill: Bar
  /** True for courses with checklist exercises: show `know` and `skill` instead of the single bar. */
  split: boolean
  done: number
  total: number
  percent: number
}

/** Overall progress is items done / items total over the whole course, not an average of module percentages. */
export function courseProgress(course: Course, state: CourseState): CourseProgress {
  const modules: Record<string, ModuleProgress> = {}
  let done = 0
  let total = 0
  const know = { done: 0, total: 0 }
  const skill = { done: 0, total: 0 }
  for (const m of course.modules) {
    const p = moduleProgress(course.id, m, state)
    modules[m.id] = p
    done += p.done
    total += p.total
    know.done += p.know.done
    know.total += p.know.total
    skill.done += p.skill.done
    skill.total += p.skill.total
  }
  return {
    modules,
    know: bar(know.done, know.total),
    skill: bar(skill.done, skill.total),
    split: courseHasChecklist(course),
    done,
    total,
    percent: percent(done, total),
  }
}

/** Positions (in the module's cards) of the cards still to review, in order: the deck only shows unknown cards. */
export function deckOrder(cards: readonly { id: string }[], known: ReadonlySet<string>): number[] {
  return cards.flatMap((c, i) => (known.has(c.id) ? [] : [i]))
}

/** Next card after "review again": wraps round the remaining deck. */
export const nextInDeck = (position: number, deckLength: number) => (deckLength === 0 ? 0 : (position + 1) % deckLength)

/** Whether `selected` is the right option (and a valid one) for a question. */
export const isCorrect = (answer: number, selected: number) => selected === answer
