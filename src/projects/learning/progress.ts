import type { LearningCard, LearningPractice, LearningQuizAnswer } from '../../lib/db'
import type { Course, CourseModule } from './types'

/** Row id for one item of a module (quiz question, card or practice item). */
export const itemKey = (courseId: string, moduleId: string, itemId: string) => `${courseId}:${moduleId}:${itemId}`

/** The learner's rows for one course (what the Dexie tables hold). */
export interface CourseState {
  quiz: LearningQuizAnswer[]
  cards: LearningCard[]
  practice: LearningPractice[]
}

export const EMPTY_STATE: CourseState = { quiz: [], cards: [], practice: [] }

export interface Count {
  done: number
  total: number
}

export interface ModuleProgress {
  quiz: Count
  cards: Count
  practice: Count
  done: number
  total: number
  /** 0-100, rounded; 0 for a module with nothing to do. */
  percent: number
}

export const percent = (done: number, total: number) => (total === 0 ? 0 : Math.round((done * 100) / total))

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
  const p = count(mod.practice, of(state.practice), (r) => r.done === 1)
  const done = q.done + c.done + p.done
  const total = q.total + c.total + p.total
  return { quiz: q, cards: c, practice: p, done, total, percent: percent(done, total) }
}

export interface CourseProgress {
  modules: Record<string, ModuleProgress>
  done: number
  total: number
  percent: number
}

/** Overall progress is items done / items total over the whole course, not an average of module percentages. */
export function courseProgress(course: Course, state: CourseState): CourseProgress {
  const modules: Record<string, ModuleProgress> = {}
  let done = 0
  let total = 0
  for (const m of course.modules) {
    const p = moduleProgress(course.id, m, state)
    modules[m.id] = p
    done += p.done
    total += p.total
  }
  return { modules, done, total, percent: percent(done, total) }
}

/** Positions (in the module's cards) of the cards still to review, in order: the deck only shows unknown cards. */
export function deckOrder(cards: readonly { id: string }[], known: ReadonlySet<string>): number[] {
  return cards.flatMap((c, i) => (known.has(c.id) ? [] : [i]))
}

/** Next card after "review again": wraps round the remaining deck. */
export const nextInDeck = (position: number, deckLength: number) => (deckLength === 0 ? 0 : (position + 1) % deckLength)

/** Whether `selected` is the right option (and a valid one) for a question. */
export const isCorrect = (answer: number, selected: number) => selected === answer
