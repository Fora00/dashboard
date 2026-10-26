import { courseProgress, moduleProgress, type CourseState } from '../../learning/progress.ts'
import type { Course } from '../../learning/types.ts'
import { dayKey, weekDays } from './dates.ts'

// What the Learning project did this week, for the Life week screen and the
// /settimana export. Pure: callers pass the courses and the learner's rows
// (any week; only rows touched in the week count as activity).

export interface LearningCourseWeek {
  courseId: string
  title: string
  emoji: string
  /** Overall progress now (items done / total), whatever the week. */
  percent: number
  done: number
  total: number
  /** Activity inside the week: rows written (quiz answers, cards marked known, practice ticked). */
  quiz: number
  quizCorrect: number
  cards: number
  practice: number
  /** Distinct days with activity, ascending. */
  days: string[]
  /** The first module (course order) not finished yet; null when all are done. */
  next: { moduleId: string; title: string; percent: number } | null
}

export interface LearningWeek {
  courses: LearningCourseWeek[]
  /** Any activity in the week, across courses. */
  active: boolean
}

export function summarizeLearningWeek(
  courses: readonly Course[],
  states: ReadonlyMap<string, CourseState>,
  week: string,
): LearningWeek {
  const days = new Set(weekDays(week))
  const inWeek = (updatedAt: number) => days.has(dayKey(new Date(updatedAt)))
  const out = courses.map((course): LearningCourseWeek => {
    const state = states.get(course.id) ?? { quiz: [], cards: [], practice: [] }
    const p = courseProgress(course, state)
    const quiz = state.quiz.filter((r) => inWeek(r.updatedAt))
    const cards = state.cards.filter((r) => inWeek(r.updatedAt))
    const practice = state.practice.filter((r) => r.done === 1 && inWeek(r.updatedAt))
    const touched = [...quiz, ...cards, ...practice].map((r) => dayKey(new Date(r.updatedAt)))
    const nextModule = course.modules.find((m) => {
      const mp = moduleProgress(course.id, m, state)
      return mp.total > 0 && mp.percent < 100
    })
    return {
      courseId: course.id,
      title: course.title,
      emoji: course.emoji,
      percent: p.percent,
      done: p.done,
      total: p.total,
      quiz: quiz.length,
      quizCorrect: quiz.filter((r) => r.correct === 1).length,
      cards: cards.length,
      practice: practice.length,
      days: [...new Set(touched)].sort(),
      next: nextModule
        ? {
            moduleId: nextModule.id,
            title: nextModule.title,
            percent: moduleProgress(course.id, nextModule, state).percent,
          }
        : null,
    }
  })
  return { courses: out, active: out.some((c) => c.days.length > 0) }
}

/** "3 quiz (2 right) · 5 cards · 1 practice", or "nothing this week". */
export function describeLearningActivity(c: LearningCourseWeek): string {
  const parts = [
    c.quiz ? `${c.quiz} quiz (${c.quizCorrect} right)` : null,
    c.cards ? `${c.cards} card${c.cards === 1 ? '' : 's'}` : null,
    c.practice ? `${c.practice} practice` : null,
  ].filter(Boolean)
  return parts.length ? parts.join(' · ') : 'nothing this week'
}
