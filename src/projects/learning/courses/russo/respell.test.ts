import { describe, expect, it } from 'vitest'
import { courseById } from '../index'
import {
  stripAcute,
  cyrSkeleton,
  cyrStressIndex,
  cyrVowelCount,
  pairs,
  pronSyllables,
  skeleton,
  stressIndex,
  unmarked,
} from './respell'

const c = courseById('russo')!
const fields = c.modules.flatMap((m) =>
  [
    m.lesson,
    ...m.cards.flatMap((x) => [x.front, x.back]),
    ...m.practice.flatMap((x) => [x.question, x.answer]),
    ...m.quiz.flatMap((x) => [x.q, x.explanation, ...x.options]),
  ].map((f) => [m.id, f] as const),
)

// Genuine exceptions to the letter-by-letter skeleton (spelling and sound differ in an irregular way).
const SKELETON_OK = new Set(['что', 'чтобы', 'конечно', 'дорого', 'много', 'немного', 'строго', 'шестьсот'])
const wordOk = (w: string) => SKELETON_OK.has(stripAcute(w).toLowerCase())

describe('russo respelling is mechanically consistent', () => {
  it('folds the skeletons as designed', () => {
    expect(cyrSkeleton('хлеб')).toBe(skeleton('HLIEP'))
    expect(cyrSkeleton('мышь')).toBe(skeleton('MYSH'))
    expect(cyrStressIndex('молоко\u0301')).toBe(2)
    expect(stressIndex('ma-la-KO')).toBe(2)
    expect(pronSyllables('ZDRA-stvui-tie')).toBe(3)
  })
  it('every polysyllabic Cyrillic word in a pair carries a stress mark', () => {
    for (const [id, f] of fields)
      for (const p of pairs(f))
        for (const w of p.word.split(/\s+/))
          if (cyrVowelCount(w) >= 2) expect.soft(cyrStressIndex(w), `${id}: ${w} [${p.pron}]`).toBeGreaterThanOrEqual(0)
  })
  it('every polysyllabic Cyrillic word of the course carries a stress mark', () => {
    for (const [id, f] of fields) expect.soft(unmarked(f), id).toEqual([])
  })
  it('syllables, stress and consonants of the respelling match the Cyrillic', () => {
    let n = 0
    for (const [id, f] of fields)
      for (const p of pairs(f)) {
        const ws = p.word.split(/\s+/)
        const ps = p.pron.split(/\s+/)
        ws.forEach((w, i) => {
          const pr = ps[i]!
          const tag = `${id}: ${w} [${pr}]`
          n++
          expect.soft(pronSyllables(pr), `${tag} syllables`).toBe(cyrVowelCount(w))
          if (cyrVowelCount(w) >= 2) {
            expect.soft(stressIndex(pr), `${tag} stress`).toBe(cyrStressIndex(w))
            expect
              .soft(pr.split('-').filter((s) => /[A-Z]/.test(s) && s === s.toUpperCase()).length, `${tag} one CAPS`)
              .toBe(1)
          }
          if (!wordOk(w)) expect.soft(skeleton(pr), `${tag} consonants`).toBe(cyrSkeleton(w))
        })
      }
    expect(n).toBeGreaterThan(300)
  })
})

// --- legend rules (pron.ts): one test per rule so a failure names the rule ---------------------------------------
const wordPairs = fields.flatMap(([id, f]) =>
  pairs(f).flatMap((p) => {
    const ws = p.word.split(/\s+/)
    const ps = p.pron.split(/\s+/)
    return ws.map((w, i) => ({ id, w, pr: ps[i]! }))
  }),
)
const plain = (w: string) => stripAcute(w).toLowerCase()

describe('russo respelling follows the legend', () => {
  it('has no stress mark on one-syllable words', () => {
    for (const [id, f] of fields) {
      const text = f.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ')
      for (const m of text.matchAll(/(?:[Ѐ-ӿ]|́)+/g)) {
        const w = m[0]
        // affixes and endings such as "-а́" or "-у́" are not words
        if (text[m.index - 1] === '-' || text[m.index + w.length] === '-') continue
        if (cyrVowelCount(w) === 1) expect.soft(w.includes('́'), `${id}: ${w}`).toBe(false)
      }
    }
  })
  it('writes an unstressed е/и after ж ш ц as y, and never uses i after zh sh ts', () => {
    for (const { id, w, pr } of wordPairs) {
      const flat = pr.toLowerCase().replace(/shsh/g, 'SS')
      expect.soft(/(zh|sh|ts)i/.test(flat), `${id}: ${w} [${pr}]`).toBe(false)
    }
  })
  it('writes unstressed ча/ща as ci/shshi (reduced а), not cia/shsha', () => {
    for (const { id, w, pr } of wordPairs)
      for (const [i, syl] of pr.split('-').entries()) {
        // a final unstressed -ча/-ща is a schwa written c+ia (ты́сяча [TY-si-cia]); only earlier syllables reduce to ci
        if (syl !== syl.toLowerCase() || i === pr.split('-').length - 1) continue
        expect.soft(/^(cia|cio|ciu|shsha|shshu)/.test(syl), `${id}: ${w} [${pr}]`).toBe(false)
      }
  })
  it('writes ь + vowel as consonant + apostrophe + i-vowel in the next syllable, ъ + vowel as a new i-syllable', () => {
    for (const { id, w, pr } of wordPairs) {
      const x = plain(w)
      if (/^пь[ёюеи]/.test(x)) continue // пью, пьёшь...: written PIU, PIOSH (one syllable, no apostrophe)
      // after ч ш щ ж the soft sign changes nothing (ночью [NO-ciu]), so no apostrophe there
      if (/ь[аеёиоуыэюя]/.test(x.replace(/[чшщж]ь/g, 'X')))
        expect.soft(/'-i/i.test(pr), `${id}: ${w} [${pr}] needs C'-iV`).toBe(true)
      if (/ъ[аеёиоуыэюя]/.test(x)) expect.soft(/-i[aeou]/i.test(pr), `${id}: ${w} [${pr}] needs -iV`).toBe(true)
    }
  })
  it('writes -ться / -тся as tsa', () => {
    for (const { id, w, pr } of wordPairs)
      if (/т(ь)?ся$/.test(plain(w))) expect.soft(/tsa$/.test(pr.toLowerCase()), `${id}: ${w} [${pr}]`).toBe(true)
  })
  it('devoices a final voiced consonant', () => {
    for (const { id, w, pr } of wordPairs) {
      const x = plain(w)
      if (x.length < 3 || !/[бвгдзж]$/.test(x)) continue
      expect.soft(/(b|v|g|d|z|zh)$/i.test(pr.replace(/'$/, '')), `${id}: ${w} [${pr}]`).toBe(false)
    }
  })
  it('devoices в before a voiceless consonant (вход [FHOT], вторник [FTOR-nik])', () => {
    for (const { id, w, pr } of wordPairs)
      if (/^в[кптфхцчшщс]/.test(plain(w)) && plain(w).length > 2)
        expect.soft(/^f/i.test(pr), `${id}: ${w} [${pr}]`).toBe(true)
  })
})
