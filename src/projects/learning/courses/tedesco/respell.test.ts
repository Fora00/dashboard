import { describe, expect, it } from 'vitest'
import { courseById } from '../index'

// Mechanical checks of the German respelling convention (legend: PRON_FULL in ./pron.ts). The tedesco course is
// written in several halves (A, B1...), so these rules keep the halves uniform. Add genuine exceptions to ALLOW.

const c = courseById('tedesco')!
const fields = c.modules.flatMap((m) =>
  [
    m.lesson,
    ...m.cards.flatMap((x) => [x.front, x.back]),
    ...m.practice.flatMap((x) => [x.question, x.answer]),
    ...m.quiz.flatMap((x) => [x.q, x.explanation, ...x.options]),
  ].map((f) => [m.id, f] as const),
)

interface Pair {
  word: string
  pron: string
}

// A transcription is bracketed text made of respelling letters; Italian prose in [ ] never has "-", ":" or "ë".
const PRON = /\[([^\][]{2,120})\]/g
const looksLikePron = (p: string): boolean =>
  /[-:ë]|^[A-ZÄÖÜÇ]{2,}$/.test(p) && /^[A-Za-zÄÖÜÉÈäöüëçéèßʼ:\-–\s,.?!'()/…]+$/.test(p)

/** `word [pron]` pairs: the pron's N words are matched with the N words before the bracket (tags stripped). */
export function pairs(html: string): Pair[] {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ')
  const out: Pair[] = []
  for (const m of text.matchAll(/(?:^|\s)((?:\S+\s+){0,14}?\S+)\s*\[([^\][]{2,120})\]/g)) {
    const pron = m[2]!.trim()
    if (!looksLikePron(pron)) continue
    const n = pron.split(/\s+/).length
    const words = m[1]!.split(/\s+/).slice(-n)
    out.push({ word: words.join(' ').replace(/[«»"(),.?!;:]/g, ''), pron })
  }
  return out
}

const allPairs: [string, Pair][] = fields.flatMap(([id, f]) => pairs(f).map((p) => [id, p] as [string, Pair]))
const allProns: [string, string][] = fields.flatMap(([id, f]) =>
  [...f.matchAll(PRON)].map((m) => [id, m[1]!.trim()] as [string, string]).filter(([, p]) => looksLikePron(p)),
)
// vsec rows and dl lines render as `<td>word [pron]</td>` / `<i>[pron]</i>`, so brackets cover them too.

/** Words where the g after n is really pronounced (n and g in two parts of the word). */
const ALLOW_G = /(^|\s)(an|ein|aus|ab|hin|un|zu|auf|um|durch|mit)-?ge|ngang|ENG-?g/i
/** Words whose long open e is not spelled with ä in the word shown before the bracket (alignment noise or wäre-type forms). */
const ALLOW_AE = /lunga \[|würde|zwölf|die \[fer-SHPÈ/
/** Distractor options that deliberately show a wrong respelling. */
const WRONG_ON_PURPOSE = /MIT-te|HAT-te|RIK-te-te|MI-tte|TO:CH-ter|TÖ:K-ter|KOM-pu-ter/

describe('tedesco respelling is uniform across the A and B halves', () => {
  it('finds a sensible number of transcriptions', () => {
    expect(allProns.length).toBeGreaterThan(1000)
    expect(allPairs.length).toBeGreaterThan(500)
  })

  it('never splits "ng" (no syllable starting with g right after a syllable ending in n)', () => {
    for (const [id, p] of allPairs) {
      if (WRONG_ON_PURPOSE.test(p.pron)) continue
      const split =
        /[nN]-[gG]/.test(p.pron) ||
        /(^|-)[nN][gG](ë|a|ën)(-|\s|$)/.test(p.pron) ||
        /-[nN][gG]\w*/.test(p.pron.replace(/-ng(?=\W|$)/g, ''))
      if (!split) continue
      if (!/ng/i.test(p.word) || ALLOW_G.test(p.word)) continue
      expect.fail(`${id}: ${p.word} [${p.pron}]`)
    }
  })

  it('has no lowercase accented e inside brackets (stressed = É:/È:, unstressed = e:)', () => {
    for (const [id, p] of allProns) expect(/[éèà]/.test(p), `${id}: [${p}]`).toBe(false)
  })

  it('writes consonant j as J, never I + vowel', () => {
    for (const [id, p] of allPairs) {
      const first = p.word.split(/\s+/)[0] ?? ''
      if (/^j/i.test(first) && !/^Jän/.test(first))
        expect(/^I[AEOUÜ]/i.test(p.pron.trim()) && /^i/i.test(p.pron), `${id}: ${p.word} [${p.pron}]`).toBe(false)
    }
    for (const [id, p] of allProns) expect(/(^|[-\s(])I[AEOUÜ]/.test(p), `${id}: [${p}]`).toBe(false)
  })

  it('never uses a plain "E:" (long e is É: closed or È: for ä)', () => {
    for (const [id, p] of allProns) {
      if (WRONG_ON_PURPOSE.test(p)) continue
      expect(/(^|[^ÉÈ])E:/.test(p), `${id}: [${p}]`).toBe(false)
    }
  })

  it('writes È: only for ä words', () => {
    const bad: string[] = []
    for (const [id, p] of allPairs) {
      const toks = p.word.split(/\s+/)
      const prs = p.pron.split(/\s+/)
      if (toks.length !== prs.length) continue
      toks.forEach((w, i) => {
        if (/È:/.test(prs[i]!) && !/[äÄ]/.test(w)) bad.push(`${id}: ${w} [${prs[i]}]`)
      })
    }
    expect(bad.filter((b) => !ALLOW_AE.test(b))).toEqual([])
  })

  it('writes a stressed syllable fully in capitals (no "TÜ:r", "HÖ:ç")', () => {
    const bad: string[] = []
    for (const [id, p] of allProns) {
      if (WRONG_ON_PURPOSE.test(p)) continue
      for (const syl of p.split(/[-\s]/)) {
        if (!/[A-ZÄÖÜÉÈ]/.test(syl)) continue
        if (/[a-zçäöü]/.test(syl.replace(/ë/g, ''))) bad.push(`${id}: [${p}] syllable ${syl}`)
      }
    }
    expect(bad).toEqual([])
  })

  it('writes final unstressed -er as a (no "-ter", "-der", "-ker" endings)', () => {
    const bad: string[] = []
    for (const [id, p] of allProns) {
      if (WRONG_ON_PURPOSE.test(p)) continue
      for (const tok of p.split(/\s+/)) {
        const last =
          tok
            .replace(/[,.?!)]+$/, '')
            .split('-')
            .pop() ?? ''
        if (/^[bdfgklmnprstvz]er$/.test(last) && tok.includes('-')) bad.push(`${id}: [${p}] token ${tok}`)
      }
    }
    expect(bad).toEqual([])
  })

  it('writes final voiceless s as "s" (word end, before a consonant); "ss" only between vowels', () => {
    const bad: string[] = []
    for (const [id, p] of allProns) {
      if (WRONG_ON_PURPOSE.test(p)) continue
      for (const tok of p.split(/\s+/)) {
        if (/ss(?![aeiouäöüëéèAEIOUÄÖÜÉÈ]|-[aeiouäöüëéèAEIOUÄÖÜÉÈ])/i.test(tok.replace(/[,.?!)]+$/, '')))
          bad.push(`${id}: [${p}] token ${tok}`)
      }
    }
    expect(bad).toEqual([])
  })

  it('never writes the Zwischenstufe "-a:r" for Januar/Februar and never "ZEÇ-tsé:n"', () => {
    for (const [id, p] of allProns) expect(/ZEÇ-tsé|JA-nu-ar(?!:)|FÉ:-bru-ar(?!:)/.test(p), `${id}: [${p}]`).toBe(false)
  })
})
