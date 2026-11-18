import { describe, expect, it } from 'vitest'
import { q } from '../courses/kit'
import { AUTHOR_BASE, encodeSelected, pickedShown } from './quizAnswer'

const opts = ['giusta', 'sbagliata 1', 'sbagliata 2', 'sbagliata 3']

/** A rewording of the same question (same id) that lands on a different shuffle. */
function reworded(id: string) {
  const before = q(id, 'Domanda?', opts, 0, 'x')
  for (let i = 0; i < 50; i++) {
    const after = q(id, `Domanda riscritta ${i}?`, opts, 0, 'x')
    if (after.answer !== before.answer) return { before, after }
  }
  throw new Error('no reshuffle found')
}

describe('stored quiz answers survive rewording', () => {
  it('a new row keeps pointing at the same option after the question text is edited', () => {
    const { before, after } = reworded('a')
    for (let shown = 0; shown < before.options.length; shown++) {
      const stored = encodeSelected(before, shown)
      expect(stored).toBeGreaterThanOrEqual(AUTHOR_BASE)
      expect(stored).toBeLessThanOrEqual(20) // learning_quiz.selected check
      const row = { selected: stored, correct: (shown === before.answer ? 1 : 0) as 0 | 1 }
      const now = pickedShown(after, row)!
      expect(after.options[now]).toBe(before.options[shown])
      // never "Esatto." next to a red ✗
      expect(now === after.answer).toBe(row.correct === 1)
    }
  })

  it('works for hand-built questions without a shuffle (identity order)', () => {
    const plain = { answer: 2 }
    expect(pickedShown(plain, { selected: encodeSelected(plain, 1), correct: 0 })).toBe(1)
  })
})

describe('legacy rows (shown index under the old shuffle)', () => {
  it('an unchanged question shows the stored pick as is', () => {
    const x = q('b', 'Domanda?', opts, 0, 'x')
    const wrong = (x.answer + 1) % 4
    expect(pickedShown(x, { selected: x.answer, correct: 1 })).toBe(x.answer)
    expect(pickedShown(x, { selected: wrong, correct: 0 })).toBe(wrong)
  })

  it('a right answer whose slot moved after a rewording maps back to the right option', () => {
    const { before, after } = reworded('c')
    expect(pickedShown(after, { selected: before.answer, correct: 1 })).toBe(after.answer)
  })

  it('a wrong answer that now lands on the right slot is shown as unknown, never as a ✗ on the right one', () => {
    const { after } = reworded('d')
    expect(pickedShown(after, { selected: after.answer, correct: 0 })).toBeNull()
  })
})
