import { describe, expect, it } from 'vitest'
import { courseById } from '../index'

// Mechanical checks of the French respelling convention (legend: PRON_FULL in ./b.pron.ts). The course is written in
// several parts (A, B, C), so these rules keep them uniform. Add genuine exceptions to the allowlists.

const c = courseById('francese')!
const fields = c.modules.flatMap((m) =>
  [
    m.lesson,
    ...m.cards.flatMap((x) => [x.front, x.back]),
    ...m.practice.flatMap((x) => [x.question, x.answer]),
    ...m.quiz.flatMap((x) => [x.q, x.explanation, ...x.options]),
  ].map((f) => [m.id, f] as const),
)

const PRON = /\[([^\][]{2,120})\]/g
// A transcription: respelling letters only, with "-" or a capitalised syllable (Italian prose in [ ] has neither).
const looksLikePron = (p: string): boolean =>
  /[-]|[A-ZÉÈÒÜÖÕÃẼ]{2,}/.test(p) && /^[A-Za-zçéèòëüöõãẽÉÈÒÜÖÕÃẼ\-\s/,.?!'()…]+$/.test(p)

const allProns: [string, string][] = fields.flatMap(([id, f]) =>
  [...f.matchAll(PRON)].map((m) => [id, m[1]!.trim()] as [string, string]).filter(([, p]) => looksLikePron(p)),
)
const allText: [string, string][] = fields.map(([id, f]) => [id, f.replace(/<[^>]+>/g, ' ')])

/** Distractor options / quoted wrong forms that deliberately show a wrong respelling. */
const WRONG_ON_PURPOSE = /a-vant-KE|a-van-KUE|a-vã-KI|tabele|bong|trua-ZÃN/

describe('french respelling is uniform across the A, B and C parts', () => {
  it('finds a sensible number of transcriptions', () => {
    expect(allProns.length).toBeGreaterThan(1000)
  })

  it('never writes a capital Ë (the weak e never carries the stress)', () => {
    expect(fields.filter(([, f]) => f.includes('Ë')).map(([id, f]) => `${id}: ${f.slice(0, 80)}`)).toEqual([])
  })

  it('writes nasal vowels with the legend tilde symbols only (no decomposed tilde, no ɛ̃ / œ̃ / ɑ̃)', () => {
    for (const [id, p] of allProns) expect(/[̃ɛɑœɔ]/.test(p), `${id}: [${p}]`).toBe(false)
  })

  it('never follows a nasal vowel with n/m inside the same syllable (BÕN, TÃM)', () => {
    const bad: string[] = []
    for (const [id, p] of allProns) {
      if (WRONG_ON_PURPOSE.test(p)) continue
      for (const syl of p.split(/[-\s/]/)) if (/[õãẽÕÃẼ][nmNM]/.test(syl)) bad.push(`${id}: [${p}] syllable ${syl}`)
    }
    expect(bad).toEqual([])
  })

  it('writes the semivowel with y, never i + vowel in one syllable (IÕ, IÉ, IẼ, IÃ, IÈ)', () => {
    expect(
      allProns
        .filter(([, p]) => !WRONG_ON_PURPOSE.test(p) && /[iI][õãẽÕÃẼéèÉÈ]/.test(p))
        .map(([id, p]) => `${id}: [${p}]`),
    ).toEqual([])
  })

  it("writes j'ai as [zhé] (closed), never [zhè]", () => {
    expect(allText.filter(([, t]) => /j'ai\s*\[\s*zhè[\s\]-]/i.test(t)).map(([id]) => `${id}: j'ai [zhè`)).toEqual([])
  })

  it('writes a stressed syllable fully in capitals (no "TÜr", "BYẼn")', () => {
    const bad: string[] = []
    for (const [id, p] of allProns) {
      if (WRONG_ON_PURPOSE.test(p)) continue
      for (const syl of p.split(/[-\s/]/)) {
        if (!/[A-ZÉÈÒÜÖÕÃẼ]/.test(syl)) continue
        if (/[a-zçéèòüöõãẽ]/.test(syl.replace(/ë/g, ''))) bad.push(`${id}: [${p}] syllable ${syl}`)
      }
    }
    expect(bad).toEqual([])
  })

  it('writes the weak e only as ë, never as plain "e" inside a lowercase syllable that ends a group', () => {
    // le, de, ne, que, je, me, te, se, ce are written lë, dë, në, kë, zhë, më, të, së, së.
    const bad: string[] = []
    for (const [id, p] of allProns) {
      if (WRONG_ON_PURPOSE.test(p)) continue
      for (const tok of p.split(/[\s/]+/)) if (/^(le|de|ne|je|me|te|se|ce|que)$/.test(tok)) bad.push(`${id}: [${p}]`)
    }
    expect(bad).toEqual([])
  })

  it('never uses a capital ò/ó-style variant outside the legend (no ó, no ô)', () => {
    expect(allProns.filter(([, p]) => /[óôâêîûà]/i.test(p)).map(([id, p]) => `${id}: [${p}]`)).toEqual([])
  })
})
