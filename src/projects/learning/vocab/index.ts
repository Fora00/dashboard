import { groupThemes, mergeWords, type WordLists } from './merge'
import { LANGS, type Lang, type VocabTheme, type VocabThemeInfo, type WordEntry } from './types'

// Theme list (metadata only) + lazy content. The words live in ONE file per language, `courses/<lang>/words.ts`,
// each its own chunk loaded on demand and merged by id (./merge.ts); a word belongs to the theme its entries name.
// The UI imports ONLY this file and ./types. New theme: one entry here, then words with that `theme` in the
// words files (vocab.test.ts checks every referenced theme exists). Word counts are derived from the loaded words.
export type VocabThemeMeta = VocabThemeInfo

/** Course words with no better theme land here (hidden while empty). */
export const FALLBACK_THEME = 'dai-corsi'

export const themeMetas: VocabThemeMeta[] = [
  { id: 'persone-famiglia', title: 'Persone e famiglia', emoji: '👪', level: 'A1' },
  { id: 'cibo-bevande', title: 'Cibo e bevande', emoji: '🍞', level: 'A1' },
  { id: 'saluti', title: 'Saluti e cortesia', emoji: '👋', level: 'A1' },
  { id: 'numeri', title: 'Numeri', emoji: '🔢', level: 'A1' },
  { id: 'paesi', title: 'Paesi e nazionalità', emoji: '🌍', level: 'A1' },
  { id: 'domande', title: 'Parole interrogative', emoji: '❓', level: 'A1' },
  { id: 'connettivi', title: 'Connettivi e congiunzioni', emoji: '🔗', level: 'B1' },
  { id: 'aggettivi', title: 'Aggettivi e gradi', emoji: '📏' },
  { id: FALLBACK_THEME, title: 'Dai corsi', emoji: '📚' },
]

/** One lazy chunk per language (the leaf words files: no course content comes with them). */
export const wordLoaders: Record<Lang, () => Promise<readonly WordEntry[]>> = {
  es: () => import('../courses/spagnolo/words').then((m) => m.words),
  fr: () => import('../courses/francese/words').then((m) => m.words),
  de: () => import('../courses/tedesco/words').then((m) => m.words),
  ru: () => import('../courses/russo/words').then((m) => m.words),
}

let loaded: VocabTheme[] | undefined
let pending: Promise<VocabTheme[]> | undefined

export const themeMetaById = (id: string): VocabThemeMeta | undefined => themeMetas.find((m) => m.id === id)

/** All themes once the words are loaded (empty themes included), else undefined. */
export const loadedThemes = (): VocabTheme[] | undefined => loaded

export const loadedTheme = (id: string): VocabTheme | undefined => loaded?.find((t) => t.id === id)

/** Loads the four words chunks once and merges them; a language that fails to load is left out (its rows show "—"). */
export async function loadAllThemes(): Promise<VocabTheme[]> {
  if (loaded) return loaded
  if (!pending) {
    pending = Promise.all(LANGS.map((l) => wordLoaders[l]().catch(() => undefined))).then((res) => {
      const lists: WordLists = {}
      LANGS.forEach((l, i) => {
        if (res[i]) lists[l] = res[i]
      })
      loaded = groupThemes(themeMetas, mergeWords(lists), FALLBACK_THEME)
      pending = undefined
      return loaded
    })
  }
  return pending
}

/** One theme (loads every words chunk: themes are cross-cutting); undefined for an unknown id. */
export async function loadTheme(id: string): Promise<VocabTheme | undefined> {
  if (!themeMetaById(id)) return undefined
  return (await loadAllThemes()).find((t) => t.id === id)
}

/** Themes worth listing: with words once loaded; before that every meta but the (usually empty) fallback. */
export const visibleThemes = (themes: readonly VocabTheme[] | undefined): VocabThemeMeta[] =>
  themes ? themes.filter((t) => t.words.length > 0) : themeMetas.filter((m) => m.id !== FALLBACK_THEME)
