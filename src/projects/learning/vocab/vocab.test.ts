import { describe, expect, it } from 'vitest'
import { words as esWords } from '../courses/spagnolo/words'
import { words as frWords } from '../courses/francese/words'
import { words as deWords } from '../courses/tedesco/words'
import { words as ruWords } from '../courses/russo/words'
import { vsec as esVsec } from '../courses/spagnolo/pron'
import { vsec as deVsec } from '../courses/tedesco/pron'
import { vsec as ruVsec } from '../courses/russo/pron'
import { vsecW as deVsecW } from '../courses/tedesco/vsecw'
import { vsecW as ruVsecW } from '../courses/russo/vsecw'
import { tableRow, vsecWFor } from '../courses/vocabTable'
import { FALLBACK_THEME, loadAllThemes, loadedWord, themeMetas, visibleThemes, wordLoaders } from './index'
import { groupThemes, mergeWords, wordLangs } from './merge'
import {
  isOldVocabRow,
  knownIn,
  themeCount,
  vocabCardId,
  vocabDeck,
  vocabItemId,
  VOCAB_COURSE_ID,
  VOCAB_MODULE_ID,
  vocabRekeyPlan,
  wordKnown,
} from './progress'
import { buildQueue, sourcesOf } from '../engine/review'
import type { LearningCard, LearningReview } from '../../../lib/db'
import { LANGS, type Lang, type VocabWord, type WordEntry } from './types'
import { normalize, posMatches, searchThemes, wordMatches } from './search'
import { expected as esExpected } from '../courses/spagnolo/respell'
import {
  cyrSkeleton,
  cyrStressIndex,
  cyrVowelCount,
  pronSyllables,
  skeleton,
  stressIndex,
  stripAcute,
} from '../courses/russo/respell'

// The four words files, imported statically here (the app loads them lazily through ./index.ts).
const LISTS: Record<Lang, WordEntry[]> = { es: esWords, fr: frWords, de: deWords, ru: ruWords }
const THEMES = groupThemes(themeMetas, mergeWords(LISTS), FALLBACK_THEME)
const theme = (id: string) => THEMES.find((t) => t.id === id)!
const cibo = theme('cibo-bevande')

/** Every entry of every language. */
const entries = LANGS.flatMap((l) => LISTS[l].map((e) => ({ l, e, tag: `${e.id}.${l}` })))
/** Every entry with its respelling, plus the plural pair when present. */
const prons = entries.flatMap(({ l, e, tag }) => {
  const out = [{ id: tag, l, w: e.w, pron: e.pron, pos: e.pos }]
  if (e.pl && e.plPron) out.push({ id: `${tag} pl`, l, w: e.pl, pron: e.plPron, pos: e.pos })
  return out
})
const of = (l: Lang) => prons.filter((p) => p.l === l)
/** Alternatives "a / b" split into parallel pieces. */
const alts = (s: string) => s.split(' / ')

describe('words files', () => {
  it('has kebab-case ids unique per language, short enough for learning_cards.item_id', () => {
    for (const l of LANGS) {
      const ids = LISTS[l].map((e) => e.id)
      const dup = ids.filter((id, i) => ids.indexOf(id) !== i)
      expect(dup, l).toEqual([])
      for (const id of ids) {
        expect(id, id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
        expect(vocabItemId(id, l).length).toBeLessThanOrEqual(60)
      }
    }
    for (const t of themeMetas) expect(t.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  })

  it('references only existing themes, and one id keeps one theme and one part of speech in every language', () => {
    const themeIds = new Set(themeMetas.map((t) => t.id))
    const first = new Map<string, WordEntry>()
    for (const { e, tag } of entries) {
      expect(themeIds.has(e.theme), `${tag}: theme ${e.theme}`).toBe(true)
      const f = first.get(e.id)
      if (!f) first.set(e.id, e)
      else {
        // Progress rows are keyed by theme: a split theme would split the marks.
        expect(e.theme, `${tag} theme`).toBe(f.theme)
        expect(e.pos, `${tag} pos`).toBe(f.pos)
      }
    }
  })

  it('keeps the ids of the original themes in every language (progress rows on the devices depend on them)', () => {
    // The 81 words of the two themes before the move to words.ts (2026-11-15), in order.
    const ORIGINAL: Record<string, string> = {
      'persone-famiglia':
        'famiglia genitori padre madre papa mamma figlio figlia fratello sorella nonno nonna nipote-nonni-m ' +
        'nipote-nonni-f zio zia cugino cugina marito moglie bambino ragazzo ragazza uomo donna persona amico amica ' +
        'vicino-di-casa nome cognome eta sposato giovane anziano alto basso abitare chiamarsi conoscere',
      'cibo-bevande':
        'cibo bevanda pane acqua latte caffe te vino birra succo carne pesce pollo uovo formaggio burro riso pasta ' +
        'frutta verdura mela arancia banana patata pomodoro insalata zuppa zucchero sale dolce torta colazione ' +
        'pranzo cena mangiare bere cucinare avere-fame avere-sete buono conto',
    }
    for (const [themeId, ids] of Object.entries(ORIGINAL)) {
      const list = ids.split(' ')
      expect(
        theme(themeId)
          .words.map((w) => w.id)
          .slice(0, list.length),
        themeId,
      ).toEqual(list)
      for (const id of list)
        for (const l of LANGS) expect(LISTS[l].find((e) => e.id === id)?.theme, `${id}.${l}`).toBe(themeId)
    }
  })

  it('gives every noun a gender unless it is plural-only, never both; pairs pl with plPron', () => {
    for (const { e, tag } of entries) {
      if (e.pos === 'n') expect(e.g !== undefined || e.plOnly === true, tag).toBe(true)
      expect(e.g !== undefined && e.plOnly, tag).not.toBe(true)
      expect(e.pl === undefined, `${tag} pl/plPron`).toBe(e.plPron === undefined)
    }
  })

  it('has the same number of "/" alternatives in w and pron', () => {
    for (const p of prons) expect(alts(p.pron).length, `${p.id}: ${p.w} [${p.pron}]`).toBe(alts(p.w).length)
  })

  it('has exIt exactly when the entry has an example', () => {
    for (const { e, tag } of entries) expect(Boolean(e.exIt), `${tag} exIt`).toBe(Boolean(e.ex))
  })

  it('carries an article on es/fr/de nouns (vocab form; the course-table form may drop it)', () => {
    const art: Partial<Record<Lang, RegExp>> = {
      es: /^(el|la|los|las) /,
      fr: /^(le|la|les) |^l'/,
      de: /^(der|die|das) /,
    }
    for (const { l, e, tag } of entries) if (e.pos === 'n' && art[l]) expect(e.w, tag).toMatch(art[l])
  })

  it('writes every respelling with at least one stressed (CAPS) syllable and no brackets', () => {
    // Unstressed one-syllable function words (que, si) stay lowercase, as in the courses.
    const clitic = (p: { pos?: string; pron: string }) => p.pos === 'x' && /^[^\s-]+$/.test(p.pron)
    for (const p of prons)
      for (const a of alts(p.pron)) {
        if (clitic(p) && a === a.toLowerCase()) continue
        expect(/[A-ZÄÖÜÉÈÒÕÃẼ]{2,}|(^|[-\s])[A-ZÄÖÜÉÈÒÕÃẼ](?=[-\s:']|$)/.test(a), `${p.id}: [${p.pron}]`).toBe(true)
        expect(/[[\]]/.test(a), `${p.id}`).toBe(false)
      }
  })

  it('reports the gaps per language against the union of ids (information, not a failure)', () => {
    const union = new Set(entries.map(({ e }) => e.id))
    const lines = LANGS.map((l) => {
      const have = new Set(LISTS[l].map((e) => e.id))
      const missing = [...union].filter((id) => !have.has(id))
      const sample = missing.slice(0, 12).join(', ')
      return `${l}: ${have.size}/${union.size} words, ${missing.length} missing${missing.length ? ` (${sample}${missing.length > 12 ? ', …' : ''})` : ''}`
    })
    console.info(`Vocabulary gap report\n${lines.join('\n')}`)
    expect(union.size).toBeGreaterThan(0)
  })
})

describe('vocabulary merge', () => {
  const e = (l: string, id: string, extra: Partial<WordEntry> = {}): WordEntry => ({
    id,
    it: `${id}-${l}`,
    pos: 'n',
    theme: 'cibo-bevande',
    w: `${l} ${id}`,
    pron: 'X',
    g: 'm',
    ...extra,
  })
  it('merges by id in es, fr, de, ru order; the headword is the first available it; gaps stay undefined', () => {
    const ws = mergeWords({ de: [e('de', 'b'), e('de', 'a')], fr: [e('fr', 'a', { itNote: 'n' })] })
    expect(ws.map((w) => w.id)).toEqual(['a', 'b'])
    expect(ws[0]!.it).toBe('a-fr')
    expect(ws[0]!.note).toBe('n')
    expect(ws[0]!.es).toBeUndefined()
    expect(ws[0]!.de?.w).toBe('de a')
    expect(wordLangs(ws[1]!, LANGS)).toEqual(['de'])
  })
  it('shares exIt only when every example has the same Italian', () => {
    const same = mergeWords({ es: [e('es', 'a', { ex: 'x', exIt: 'I' })], ru: [e('ru', 'a', { ex: 'y', exIt: 'I' })] })
    expect(same[0]!.exIt).toBe('I')
    const diff = mergeWords({ es: [e('es', 'a', { ex: 'x', exIt: 'I' })], ru: [e('ru', 'a', { ex: 'y', exIt: 'J' })] })
    expect(diff[0]!.exIt).toBeUndefined()
  })
  it('puts words with an unknown theme in the fallback; the fallback is hidden while empty', () => {
    const ws = mergeWords({ es: [e('es', 'a', { theme: 'nope' }), e('es', 'b')] })
    const ts = groupThemes(themeMetas, ws, FALLBACK_THEME)
    expect(ts.find((t) => t.id === FALLBACK_THEME)!.words.map((w) => w.id)).toEqual(['a'])
    expect(visibleThemes(THEMES).some((t) => t.id === FALLBACK_THEME)).toBe(THEMES.at(-1)!.words.length > 0)
    expect(visibleThemes(undefined).some((t) => t.id === FALLBACK_THEME)).toBe(false)
  })
  it('loads the four words chunks into the same themes', async () => {
    for (const l of LANGS) expect(await wordLoaders[l]()).toBe(LISTS[l])
    const loaded = await loadAllThemes()
    expect(loaded.map((t) => [t.id, t.words.length])).toEqual(THEMES.map((t) => [t.id, t.words.length]))
  })
})

describe('course tables from words.ts (vsecW)', () => {
  it('renders the same HTML as vsec for the vocab form', () => {
    const ids = ['fratello', 'pane', 'acqua']
    const rows = (l: Lang) => ids.map((id) => tableRow(LISTS[l].find((x) => x.id === id)!))
    expect(deVsecW('Test', ids)).toBe(deVsec('Test', rows('de')))
    expect(ruVsecW('Test', ids)).toBe(ruVsec('Test', rows('ru')))
    const fr = LISTS.de.find((x) => x.id === 'fratello')!
    expect(deVsecW('T', ['fratello'])).toBe(deVsec('T', [[fr.w, fr.pron, fr.it]]))
  })
  it('uses the table form t (article dropped, combined forms, course gloss) to stay byte-identical', () => {
    const sample: WordEntry[] = [
      {
        id: 'soggiorno',
        it: 'soggiorno',
        pos: 'n',
        theme: 'dai-corsi',
        w: 'el salón',
        pron: 'el sa-LON',
        g: 'm',
        t: { pron: 'sa-LON' },
      },
      {
        id: 'genitori',
        it: 'genitori',
        pos: 'n',
        theme: 'persone-famiglia',
        w: 'los padres',
        pron: 'los PA-dres',
        plOnly: true,
        t: { pron: 'PA-dres', it: 'i genitori (parenti = los parientes)' },
      },
    ]
    const vsecW = vsecWFor('Spagnolo', sample)
    expect(vsecW('Casa', ['soggiorno', 'genitori'])).toBe(
      esVsec('Casa', [
        ['el salón', 'sa-LON', 'soggiorno'],
        ['los padres', 'PA-dres', 'i genitori (parenti = los parientes)'],
      ]),
    )
    const de = vsecWFor('Tedesco', [
      {
        id: 'panino',
        it: 'panino',
        pos: 'n',
        theme: 'dai-corsi',
        w: 'das Brötchen',
        pron: 'das BRÖT-çën',
        g: 'n',
        t: { w: 'Brötchen – Semmel – Weggli', pron: 'BRÖT-çën – ZE-mël – VE-gli' },
      },
    ])
    expect(de('Cibo e cucina', ['panino'])).toBe(
      deVsec('Cibo e cucina', [['Brötchen – Semmel – Weggli', 'BRÖT-çën – ZE-mël – VE-gli', 'panino']]),
    )
  })
  it('renders an id[] group as one row joined with ", "', () => {
    const w = vsecWFor('Tedesco', [
      { id: 'zero', it: '0', pos: 'x', theme: 'numeri', w: 'null', pron: 'NUL' },
      { id: 'uno', it: '1', pos: 'x', theme: 'numeri', w: 'eins', pron: 'AINS', t: { it: 'uno' } },
    ])
    expect(w('N', [['zero', 'uno']])).toBe(deVsec('N', [['null, eins', 'NUL, AINS', '0, uno']]))
    expect(() => w('N', [['zero', 'nope']])).toThrow(/nope/)
  })
  it('throws on an unknown id', () => {
    expect(() => deVsecW('T', ['nope'])).toThrow(/nope/)
  })
})

describe('russian respelling', () => {
  it('marks the stress on every Cyrillic word of 2+ vowels (also in notes and examples), never on one-vowel words', () => {
    // Cyrillic anywhere: the Russian entries and every note (notes in other languages cite Russian words too).
    const texts = entries.flatMap(({ l, e }) => (l === 'ru' ? [e.w, e.pl, e.ex, e.note, e.itNote] : [e.note, e.itNote]))
    for (const s of texts) {
      if (!s) continue
      for (const m of s.matchAll(/(?:[Ѐ-ӿ]|\u0301)+/g)) {
        const word = m[0]
        if (cyrVowelCount(word) >= 2) expect.soft(cyrStressIndex(word), `${word} in «${s}»`).toBeGreaterThanOrEqual(0)
        else expect.soft(word.includes('\u0301'), `${word} in «${s}»`).toBe(false)
      }
    }
  })

  it('matches syllables, stress and consonant skeleton word by word', () => {
    for (const p of of('ru'))
      alts(p.w).forEach((wa, ai) => {
        const ws = wa.split(/\s+/)
        const ps = alts(p.pron)[ai]!.split(/\s+/)
        expect(ps.length, `${p.id}: word count`).toBe(ws.length)
        ws.forEach((w, i) => {
          const pr = ps[i]!
          const tag = `${p.id}: ${w} [${pr}]`
          expect.soft(pronSyllables(pr), `${tag} syllables`).toBe(cyrVowelCount(w))
          if (cyrVowelCount(w) >= 2) {
            expect.soft(stressIndex(pr), `${tag} stress`).toBe(cyrStressIndex(w))
            expect
              .soft(pr.split('-').filter((s) => /[A-Z]/.test(s) && s === s.toUpperCase()).length, `${tag} one CAPS`)
              .toBe(1)
          }
          expect.soft(skeleton(pr), `${tag} consonants`).toBe(cyrSkeleton(w))
        })
      })
  })

  it('follows the legend rules (y after zh/sh/ts, -ться = tsa, final devoicing, в devoiced)', () => {
    for (const p of of('ru'))
      alts(p.w).forEach((wa, ai) => {
        const ps = alts(p.pron)[ai]!.split(/\s+/)
        wa.split(/\s+/).forEach((w, i) => {
          const pr = ps[i]!
          const x = stripAcute(w).toLowerCase()
          const tag = `${p.id}: ${w} [${pr}]`
          expect.soft(/(zh|sh|ts)i/.test(pr.toLowerCase().replace(/shsh/g, 'SS')), tag).toBe(false)
          if (/т(ь)?ся$/.test(x)) expect.soft(/tsa$/i.test(pr), tag).toBe(true)
          if (x.length >= 3 && /[бвгдзж]$/.test(x))
            expect.soft(/(b|v|g|d|z|zh)$/i.test(pr.replace(/'$/, '')), tag).toBe(false)
          if (/^в[кптфхцчшщс]/.test(x) && x.length > 2) expect.soft(/^f/i.test(pr), tag).toBe(true)
        })
      })
  })
})

describe('spanish respelling', () => {
  // Same normalisation as the course check (seseo th/s, ss/s, dh/d).
  const norm = (s: string) =>
    s
      .toLowerCase()
      .replace(/[-\s']/g, '')
      .replace(/th/g, 's')
      .replace(/ss/g, 's')
      .replace(/dh/g, 'd')
  it('spells out the legend letter by letter', () => {
    for (const p of of('es'))
      alts(p.w).forEach((wa, ai) => {
        const exp = norm(
          wa
            .replace(/[¿?¡!,.]/g, '')
            .split(/\s+/)
            .map(esExpected)
            .join(''),
        )
        expect.soft(norm(alts(p.pron)[ai]!), `${p.id}: ${wa} [${p.pron}]`).toBe(exp)
      })
  })
  it('never writes c before u (c = ch) and writes the initial r as rr', () => {
    for (const p of of('es')) {
      expect.soft(/(^|[ -])[Cc][uU]/.test(p.pron), `${p.id}: [${p.pron}]`).toBe(false)
      if (/^r/i.test(p.w)) expect.soft(/^rr/i.test(p.pron), `${p.id}: [${p.pron}]`).toBe(true)
    }
  })
})

describe('french respelling', () => {
  const sylls = (p: string) => p.split(/[-\s/]+/).filter(Boolean)
  it('uses only the legend symbols (no capital Ë, no IPA nasals, no ó ô â ê î û à)', () => {
    for (const p of of('fr')) {
      expect.soft(p.pron.includes('Ë'), p.id).toBe(false)
      expect.soft(/[̃ɛɑœɔ]/.test(p.pron), p.id).toBe(false)
      expect.soft(/[óôâêîûà]/i.test(p.pron), p.id).toBe(false)
    }
  })
  it('never follows a nasal vowel with n/m in the same syllable, writes the semivowel as y', () => {
    for (const p of of('fr')) {
      for (const s of sylls(p.pron)) expect.soft(/[õãẽÕÃẼ][nmNM]/.test(s), `${p.id}: ${s}`).toBe(false)
      expect.soft(/[iI][õãẽÕÃẼéèÉÈ]/.test(p.pron), `${p.id}: [${p.pron}]`).toBe(false)
    }
  })
  it('stresses the last syllable of the group that does not end in ë, fully in capitals', () => {
    for (const p of of('fr'))
      for (const a of alts(p.pron)) {
        const s = sylls(a)
        const last = s.map((x) => !x.endsWith('ë')).lastIndexOf(true)
        s.forEach((x, i) => {
          const caps = /[A-ZÉÈÒÜÖÕÃẼ]/.test(x)
          expect.soft(caps, `${p.id}: [${a}] syllable ${x}`).toBe(i === last)
          if (caps) expect.soft(/[a-zçéèòüöõãẽ]/.test(x), `${p.id}: [${a}] syllable ${x}`).toBe(false)
        })
      }
  })
  it('writes the weak e of le/de/que... as ë', () => {
    for (const p of of('fr'))
      for (const tok of p.pron.split(/[\s/-]+/))
        expect.soft(/^(le|de|ne|je|me|te|se|ce|que)$/.test(tok), `${p.id}: [${p.pron}]`).toBe(false)
  })
})

describe('german respelling', () => {
  it('has no lowercase é/è/à and no plain E: (long e is É: or È:)', () => {
    for (const p of of('de')) {
      expect.soft(/[éèà]/.test(p.pron), `${p.id}: [${p.pron}]`).toBe(false)
      expect.soft(/(^|[^ÉÈ])E:/.test(p.pron), `${p.id}: [${p.pron}]`).toBe(false)
    }
  })
  it('writes È: only for ä words', () => {
    for (const p of of('de')) {
      const ws = p.w.split(/\s+/)
      p.pron.split(/\s+/).forEach((pr, i) => {
        if (/È:/.test(pr)) expect.soft(/[äÄ]/.test(ws[i] ?? ''), `${p.id}: ${p.w} [${p.pron}]`).toBe(true)
      })
    }
  })
  it('writes a stressed syllable fully in capitals', () => {
    for (const p of of('de'))
      for (const s of p.pron.split(/[-\s]/))
        if (/[A-ZÄÖÜÉÈ]/.test(s)) expect.soft(/[a-zçäöü]/.test(s.replace(/ë/g, '')), `${p.id}: ${s}`).toBe(false)
  })
  it('writes final -er as a, ss only between vowels, and never splits ng', () => {
    for (const p of of('de'))
      for (const tok of p.pron.split(/\s+/)) {
        const last = tok.split('-').pop() ?? ''
        if (tok.includes('-')) expect.soft(/^[bdfgklmnprstvz]er$/.test(last), `${p.id}: ${tok}`).toBe(false)
        expect.soft(/ss(?![aeiouäöüëéèAEIOUÄÖÜÉÈ]|-[aeiouäöüëéèAEIOUÄÖÜÉÈ])/i.test(tok), `${p.id}: ${tok}`).toBe(false)
        expect.soft(/[nN]-[gG]/.test(tok), `${p.id}: ${tok}`).toBe(false)
      }
  })
  it('writes consonant j as J, never I + vowel', () => {
    for (const p of of('de')) expect.soft(/(^|[-\s])I[AEOUÜ]/.test(p.pron), `${p.id}: [${p.pron}]`).toBe(false)
  })
})

describe('vocabulary progress', () => {
  const rows = (ids: string[], moduleId = VOCAB_MODULE_ID, updatedAt = 1): LearningCard[] =>
    ids.map((itemId) => ({
      id: `${VOCAB_COURSE_ID}:${moduleId}:${itemId}`,
      courseId: VOCAB_COURSE_ID,
      moduleId,
      itemId,
      updatedAt,
    }))
  it('reads known marks by word, whatever the theme of the row; course cards are ignored', () => {
    const course = { id: 'x:m:pane.es', courseId: 'x', moduleId: 'm', itemId: 'pane.es', updatedAt: 1 }
    const k = knownIn([...rows(['pane.es']), ...rows(['padre.es'], 'persone-famiglia'), course])
    expect([...k].sort()).toEqual(['padre.es', 'pane.es'])
  })
  it('the fixed moduleId can never be a theme id', () => {
    expect(VOCAB_MODULE_ID).not.toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    expect(themeMetas.some((m) => m.id === VOCAB_MODULE_ID)).toBe(false)
    expect(vocabCardId('pane.es')).toBe(`${VOCAB_COURSE_ID}:${VOCAB_MODULE_ID}:pane.es`)
  })
  const word0 = cibo.words[0]!
  it('a word is known only in every chosen language; the deck skips known words', () => {
    const k = knownIn(rows(['cibo.es', 'cibo.fr', 'bevanda.es']))
    expect(word0.id).toBe('cibo')
    expect(wordKnown(k, word0, ['es', 'fr'])).toBe(true)
    expect(wordKnown(k, word0, ['es', 'de'])).toBe(false)
    expect(wordKnown(k, word0, [])).toBe(false)
    const deck = vocabDeck(cibo.words, k, ['es', 'fr'])
    expect(deck[0]).toBe(1)
    expect(deck.length).toBe(cibo.words.length - 1)
    expect(vocabDeck(cibo.words, k, [])).toEqual([])
  })
  it('counts known pairs over the theme words × languages, ignoring other themes and stale rows', () => {
    const k = knownIn(rows(['cibo.es', 'cibo.fr', 'gone.es', 'padre.es']))
    expect(themeCount(cibo.words, k, ['es', 'de'])).toEqual({ done: 1, total: cibo.words.length * 2 })
  })
  it('skips the languages a word is missing in (count, known, deck)', () => {
    const { de: _de, ...partial } = word0
    void _de
    const ws: VocabWord[] = [partial, cibo.words[1]!]
    const k = knownIn(rows(['cibo.es']))
    expect(themeCount(ws, k, ['es', 'de'])).toEqual({ done: 1, total: 3 })
    expect(wordKnown(k, partial, ['es', 'de'])).toBe(true)
    expect(vocabDeck(ws, k, ['es', 'de'])).toEqual([1])
    expect(vocabDeck(ws, k, ['de'])).toEqual([1])
    expect(wordMatches(partial, 'das essen', ['de'])).toBe(false)
  })
  it('a known word moved to another theme stays known there and Ripasso still finds it', async () => {
    // `pane` marked known while it lived in "saluti" (an old theme-keyed row), then moved to cibo-bevande.
    const old = rows(['pane.es'], 'saluti')
    const pane = cibo.words.find((w) => w.id === 'pane')!
    const plan = vocabRekeyPlan(old, [])
    const now = plan.upsertCards
    expect(now.map((c) => c.id)).toEqual([vocabCardId('pane.es')])
    for (const cards of [old, now]) {
      const k = knownIn(cards)
      expect(wordKnown(k, pane, ['es'])).toBe(true)
      expect(themeCount(cibo.words, k, ['es']).done).toBe(1)
      expect(themeCount(theme('saluti').words, k, ['es']).done).toBe(0)
    }
    // Ripasso: the queue item carries only the word id; the content lookup finds the word in its current theme.
    const q = buildQueue(sourcesOf(now, []), [], '2026-12-31')
    expect(q.items.map((i) => [i.moduleId, i.itemId])).toEqual([[VOCAB_MODULE_ID, 'pane.es']])
    await loadAllThemes()
    expect(loadedWord('pane')?.theme.id).toBe('cibo-bevande')
    expect(loadedWord('gone-word')).toBeUndefined()
  })
})

describe('vocabulary rekey (theme-keyed rows -> word-keyed)', () => {
  const card = (moduleId: string, itemId: string, updatedAt: number): LearningCard => ({
    id: `${VOCAB_COURSE_ID}:${moduleId}:${itemId}`,
    courseId: VOCAB_COURSE_ID,
    moduleId,
    itemId,
    updatedAt,
  })
  const review = (moduleId: string, itemId: string, updatedAt: number, step = 2): LearningReview => ({
    id: `card:${VOCAB_COURSE_ID}:${moduleId}:${itemId}`,
    kind: 'card',
    courseId: VOCAB_COURSE_ID,
    moduleId,
    itemId,
    step,
    due: '2026-12-01',
    reviewedOn: '2026-11-20',
    updatedAt,
  })
  it('moves cards and their Ripasso rows to the fixed key, keeping updatedAt (schedule stays live)', () => {
    const cards = [card('cibo-bevande', 'pane.es', 5), { ...card('m', 'c1', 1), courseId: 'other', id: 'other:m:c1' }]
    const reviews = [review('cibo-bevande', 'pane.es', 7)]
    const p = vocabRekeyPlan(cards, reviews)
    expect(p.upsertCards).toEqual([card(VOCAB_MODULE_ID, 'pane.es', 5)])
    expect(p.removeCards).toEqual(['vocabolario:cibo-bevande:pane.es'])
    expect(p.upsertReviews).toEqual([review(VOCAB_MODULE_ID, 'pane.es', 7)])
    expect(p.removeReviews).toEqual(['card:vocabolario:cibo-bevande:pane.es'])
    // The schedule still applies after the rewrite: review (7) newer than the card (5) -> due 2026-12-01, not tomorrow.
    const q = buildQueue(sourcesOf(p.upsertCards, []), p.upsertReviews, '2026-11-25')
    expect(q.items).toEqual([])
  })
  it('merges a word known in two themes into the newest row; an existing newer word-keyed row wins', () => {
    const p = vocabRekeyPlan([card('saluti', 'pane.es', 3), card('cibo-bevande', 'pane.es', 9)], [])
    expect(p.upsertCards).toEqual([card(VOCAB_MODULE_ID, 'pane.es', 9)])
    expect(p.removeCards.sort()).toEqual(['vocabolario:cibo-bevande:pane.es', 'vocabolario:saluti:pane.es'])
    const q = vocabRekeyPlan([card(VOCAB_MODULE_ID, 'pane.es', 20), card('saluti', 'pane.es', 3)], [])
    expect(q.upsertCards).toEqual([])
    expect(q.removeCards).toEqual(['vocabolario:saluti:pane.es'])
  })
  it('is idempotent: the rewritten rows plan nothing', () => {
    const cards = [card('saluti', 'pane.es', 3), card('numeri', 'uno.ru', 4)]
    const reviews = [review('numeri', 'uno.ru', 6)]
    const p = vocabRekeyPlan(cards, reviews)
    expect([...p.upsertCards, ...p.upsertReviews].some(isOldVocabRow)).toBe(false)
    expect(vocabRekeyPlan(p.upsertCards, p.upsertReviews)).toEqual({
      upsertCards: [],
      removeCards: [],
      upsertReviews: [],
      removeReviews: [],
    })
  })
})

describe('vocabulary search', () => {
  const byId = (id: string): VocabWord => THEMES.flatMap((t) => t.words).find((w) => w.id === id)!
  it('normalizes case, accents, the Russian stress mark and apostrophes', () => {
    expect(normalize('  Caffè ')).toBe('caffe')
    expect(normalize('El Azúcar')).toBe('el azucar')
    expect(normalize('молоко\u0301')).toBe('молоко')
    expect(normalize('счёт')).toBe('счет')
    expect(normalize('l’eau')).toBe(normalize("l'eau"))
    expect(normalize('Großvater')).toBe('großvater')
  })
  it('matches the Italian headword and w of the chosen languages only', () => {
    const caffe = byId('caffe')
    expect(wordMatches(caffe, 'CAFFE', [])).toBe(true)
    expect(wordMatches(caffe, 'kaffee', ['de'])).toBe(true)
    expect(wordMatches(caffe, 'kaffee', ['es', 'fr'])).toBe(false)
    expect(wordMatches(caffe, 'кофе', ['ru'])).toBe(true)
    expect(wordMatches(byId('zucchero'), 'azucar', ['es'])).toBe(true)
    expect(wordMatches(byId('conto'), 'счет', ['ru'])).toBe(true)
    expect(wordMatches(byId('acqua'), "l'eau", ['fr'])).toBe(true)
    expect(wordMatches(caffe, '', ['es'])).toBe(true)
  })
  it('searches across themes with the part-of-speech filter; an empty query finds nothing', () => {
    expect(searchThemes(THEMES, '   ', LANGS, 'all')).toEqual([])
    const hits = searchThemes(THEMES, 'der mann', ['de'], 'all')
    expect(hits.map((h) => h.word.id)).toEqual(['marito', 'uomo'])
    expect(hits.every((h) => h.theme.id === 'persone-famiglia')).toBe(true)
    expect(searchThemes(THEMES, 'are', [], 'v').every((h) => h.word.pos === 'v')).toBe(true)
    expect(searchThemes(THEMES, 'are', [], 'v').length).toBeGreaterThan(0)
    expect(posMatches(byId('pane'), 'all')).toBe(true)
    expect(posMatches(byId('pane'), 'v')).toBe(false)
  })
  it('keeps the static "pronuncia" route free (no theme uses that id)', () => {
    expect(themeMetas.some((m) => m.id === 'pronuncia')).toBe(false)
  })
})
