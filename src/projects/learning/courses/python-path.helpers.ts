import type { CourseModule, Flashcard, PracticeItem, QuizQuestion } from '../types'

// Compact builders for the hand-written Python path. Lesson text is light HTML
// (see ../html.ts allowlist). Code goes in <pre><code>; write < > & as entities.
// Quiz options are permuted with a PRNG seeded by the question text, so the
// correct answer is not always in the same slot (or the longest) and the order
// is stable across builds (progress rows store the selected index).
function seeded(text: string): () => number {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619)
  let a = h >>> 0
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
