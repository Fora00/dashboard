// Shared multilingual vocabulary (route /learning/vocabolario). ONE source per language: the word lists
// `courses/<lang>/words.ts` (WordEntry[]), merged by `id` at load (./index.ts) into VocabWord (one Italian
// headword, up to four translations). Themes are metadata only (./index.ts). The learner's "known" marks live in
// learningCards (courseId `vocabolario`, see ./progress.ts). Leaf module: no imports (the words files import it).

export const LANGS = ['es', 'fr', 'de', 'ru'] as const
export type Lang = (typeof LANGS)[number]

export type Level = 'A1' | 'A2' | 'B1' | 'B2'

/** Part of speech: noun, verb, adjective, other (adverb, phrase, numeral, greeting...). */
export type Pos = 'n' | 'v' | 'a' | 'x'

export type Gender = 'm' | 'f' | 'n'

/**
 * One translation. Notation = the course legend of that language (./legend.ts), never IPA.
 * - `w`: the word as written. Nouns in es/fr/de carry the definite article (el/la, le/la/l'/les,
 *   der/die/das); Russian carries the stress mark (U+0301) on words of 2+ vowels (ё counts as marked).
 *   Alternatives (m / f forms) are separated by " / " in both `w` and `pron`, same count on each side.
 * - `pron`: respelling of the WHOLE `w` (article included, which is how it is said), no brackets.
 */
export interface Tr {
  w: string
  pron: string
  /** Grammatical gender; required for nouns (all four languages) unless `plOnly`. */
  g?: Gender
  /** The entry is a plural (los padres, die Eltern, роди́тели): no gender shown. */
  plOnly?: boolean
  /** Plural form with article (German always; irregular plurals elsewhere), with its respelling. */
  pl?: string
  plPron?: string
  /** Short Italian note about this translation (false friend, register, irregular form). */
  note?: string
  /** Example sentence in this language; `exIt` is its Italian. */
  ex?: string
}

/**
 * How a course table (vsecW, courses/vocabTable.ts) shows the entry when it differs from the vocab form: course
 * tables often drop the article (Spanish: `el salón [sa-LON]`, German: `Brötchen`), combine forms
 * (`Brötchen – Semmel – Weggli`) or gloss differently. Each field falls back to the entry's own `w`, `pron`, `it`.
 */
export interface TableForm {
  w?: string
  pron?: string
  it?: string
}

/**
 * One word in one language: an element of `courses/<lang>/words.ts`. The same `id` in different languages is the
 * same word (merged into one VocabWord).
 */
export interface WordEntry extends Tr {
  /** Stable kebab-case id of the Italian main sense, shared across languages (progress keys: never rename). */
  id: string
  /** Italian gloss as this language's course shows it; the first available one is the Vocabolario headword. */
  it: string
  pos: Pos
  /** Vocab theme id (./index.ts); `dai-corsi` for course words with no better theme. */
  theme: string
  /** Italian of THIS entry's `ex` (required exactly when `ex` is present). */
  exIt?: string
  /** Italian note about the headword itself (meaning, ambiguity); the first available one is shown. */
  itNote?: string
  /** Course-table form, when it differs from the vocab form. */
  t?: TableForm
}

/** One Vocabolario word: the WordEntries of one `id`, merged; a missing language is `undefined` (shown as "—"). */
export interface VocabWord {
  id: string
  /** Italian headword: the first available `it` in es, fr, de, ru order. */
  it: string
  pos: Pos
  theme: string
  /** Italian note about the headword (first available `itNote`). */
  note?: string
  /** The shared Italian example sentence, when every present example has the same one (else each line shows its own). */
  exIt?: string
  es?: WordEntry
  fr?: WordEntry
  de?: WordEntry
  ru?: WordEntry
}

export interface VocabThemeInfo {
  /** Stable kebab-case id (moduleId of the progress rows: never rename). */
  id: string
  title: string
  emoji: string
  /** Shown on the theme card; omitted for mixed-level themes (the course fallback). */
  level?: Level
}

export interface VocabTheme extends VocabThemeInfo {
  words: VocabWord[]
}

export const LANG_LABEL: Record<Lang, string> = { es: 'Spagnolo', fr: 'Francese', de: 'Tedesco', ru: 'Russo' }
export const LANG_FLAG: Record<Lang, string> = { es: '🇪🇸', fr: '🇫🇷', de: '🇩🇪', ru: '🇷🇺' }
export const GENDER_LABEL: Record<Gender, string> = { m: 'm', f: 'f', n: 'n' }
