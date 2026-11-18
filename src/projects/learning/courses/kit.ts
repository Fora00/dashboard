import { fnv1a } from '../../../lib/hash'
import type { CourseModule, Flashcard, PracticeItem, QuizQuestion } from '../engine/types'

// Compact builders shared by every course. Lesson text is light HTML
// (see ../html.ts allowlist). Code goes in <pre><code>; write < > & as entities.
// Quiz options are permuted with a PRNG seeded by the question text, so the
// correct answer is not always in the same slot (or the longest) and the order
// is stable across builds. Rewording a question reshuffles it, so stored answers
// keep the AUTHOR-order index (see ../engine/quizAnswer.ts), never the shown one:
// reword freely, but never reorder, insert or remove options of a live question.
function seeded(text: string): () => number {
  let a = fnv1a(text)
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const q = (id: string, text: string, options: string[], answer: number, explanation: string): QuizQuestion => {
  const rand = seeded(id + '|' + text)
  const order = options.map((_, i) => i)
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[order[i], order[j]] = [order[j]!, order[i]!]
  }
  return {
    id,
    q: text,
    options: order.map((i) => options[i]!),
    answer: order.indexOf(answer),
    order,
    explanation,
  }
}
export const card = (id: string, front: string, back: string): Flashcard => ({ id, front, back })
export const prac = (id: string, question: string, answer: string): PracticeItem => ({ id, question, answer })

export function mod(
  id: string,
  title: string,
  subtitle: string,
  group: string,
  lesson: string,
  quiz: QuizQuestion[],
  cards: Flashcard[],
  practice: PracticeItem[],
  vault = 'Nessuna nota collegata: modulo scritto per questo percorso.',
): CourseModule {
  return {
    id,
    title,
    subtitle,
    group,
    vault,
    lesson,
    quiz,
    cards,
    practice,
  }
}
