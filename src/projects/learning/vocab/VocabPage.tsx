import { useEffect, useState } from 'react'
import { Link, Route, Routes, useParams } from 'react-router-dom'
import { Button } from '../../../components/Button'
import { Card } from '../../../components/Card'
import { Chip } from '../../../components/Chip'
import { FOCUS_RING, FOCUS_RING_FIELD, FOCUS_RING_INSET } from '../../../components/focus'
import type { LearningCard } from '../../../lib/db'
import { useLazyChunk } from '../../../lib/useLazyChunk'
import { CourseLoading } from '../ui/CourseLoading'
import { HtmlText } from '../engine/HtmlText'
import { NotFound } from '../ui/NotFound'
import { ProgressBar } from '../ui/ProgressBar'
import { percent } from '../engine/progress'
import { loadAllThemes, loadedTheme, loadedThemes, loadTheme, themeMetaById, visibleThemes } from './index'
import { wordLangs } from './merge'
import { LEGEND, LEGEND_FULL } from './legend'
import { POS_FILTERS, posMatches, searchThemes, type Hit, type PosFilter } from './search'
import { knownIn, themeCount, vocabDeck, vocabItemId } from './progress'
import { resetThemeLangs, setWordKnown, useVocabCards } from './store'
import { nextInDeck } from '../engine/progress'
import {
  GENDER_LABEL,
  LANG_FLAG,
  LANG_LABEL,
  LANGS,
  type Lang,
  type VocabTheme,
  type VocabWord,
  type WordEntry,
} from './types'

// Route /learning/vocabolario: theme list -> one theme (dictionary + flashcards). Lazily loaded by Learning.tsx.
// Content comes only through ./index.ts (one chunk per language's words file, merged by id); marks are
// learningCards rows (./progress.ts). A word missing in a chosen language shows "—" and skips that language's card.

const LANGS_KEY = 'learning.vocab.langs'

/** Chosen languages: a per-device convenience (browser storage), all four by default. */
function useLangs(): [Lang[], (l: Lang) => void] {
  const [langs, setLangs] = useState<Lang[]>(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(LANGS_KEY) ?? 'null') as unknown
      if (Array.isArray(raw)) {
        const ok = LANGS.filter((l) => raw.includes(l))
        if (ok.length) return ok
      }
    } catch {
      /* storage unavailable: defaults */
    }
    return [...LANGS]
  })
  const toggle = (l: Lang) =>
    setLangs((cur) => {
      const next = cur.includes(l) ? cur.filter((x) => x !== l) : LANGS.filter((x) => x === l || cur.includes(x))
      if (next.length === 0) return cur // at least one language
      try {
        localStorage.setItem(LANGS_KEY, JSON.stringify(next))
      } catch {
        /* ignore */
      }
      return next
    })
  return [langs, toggle]
}

function LangPicker({ langs, toggle }: { langs: Lang[]; toggle: (l: Lang) => void }) {
  return (
    <div role="group" aria-label="Lingue" className="flex flex-wrap gap-2">
      {LANGS.map((l) => (
        <Chip key={l} active={langs.includes(l)} onClick={() => toggle(l)}>
          {LANG_FLAG[l]} {LANG_LABEL[l]}
        </Chip>
      ))}
    </div>
  )
}

const backLink = 'mb-3 inline-block text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'

function ThemeList() {
  const [langs, toggle] = useLangs()
  const cards = useVocabCards() ?? []
  const known = knownIn(cards)
  const [themes, setThemes] = useState<VocabTheme[] | undefined>(loadedThemes)
  const [query, setQuery] = useState('')
  const [pos, setPos] = useState<PosFilter>('all')
  // All words chunks: the progress bars need the word lists and the search scans every theme.
  useEffect(() => {
    if (themes) return
    let live = true
    void loadAllThemes().then((t) => live && setThemes(t))
    return () => {
      live = false
    }
  }, [themes])
  const searching = query.trim() !== ''
  const hits = searchThemes(themes ?? [], query, langs, pos)
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Link to="/learning/lingue" className={backLink}>
          ← Lingue
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">
          <span className="mr-2">🗂️</span>Vocabolario
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Parole italiane in spagnolo, francese, tedesco e russo, con le trascrizioni dei corsi. Scegli le lingue da
          ripassare.
        </p>
      </div>
      <LangPicker langs={langs} toggle={toggle} />
      <Link
        to="pronuncia"
        className="inline-flex min-h-10 w-fit items-center gap-1.5 rounded-lg bg-slate-100 px-3.5 text-sm font-medium text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
      >
        🗣️ Pronuncia: le regole in breve
      </Link>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cerca in italiano o nelle lingue scelte"
        aria-label="Cerca una parola"
        className={`min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-base dark:border-slate-700 dark:bg-slate-800 ${FOCUS_RING_FIELD}`}
      />
      <PosPicker pos={pos} setPos={setPos} />
      {searching ? (
        <SearchResults hits={hits} langs={langs} cards={cards} loading={!themes} />
      ) : (
        <ul className="grid gap-2 sm:grid-cols-2">
          {visibleThemes(themes).map((m) => {
            const t = loadedTheme(m.id)
            const c = t ? themeCount(t.words, known, langs) : { done: 0, total: 0 }
            const p = percent(c.done, c.total)
            const info = [m.level, t && `${t.words.length} parole`].filter(Boolean).join(' · ')
            return (
              <li key={m.id}>
                <Link to={m.id} className="block h-full rounded-xl focus-visible:outline-none">
                  <Card className="flex h-full min-h-10 flex-col gap-1.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
                    <div className="flex items-start justify-between gap-2">
                      <strong className="font-medium">
                        <span className="mr-2">{m.emoji}</span>
                        {m.title}
                      </strong>
                      <span className="text-sm text-slate-500 tabular-nums">{p}%</span>
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">{info || '…'}</span>
                    <ProgressBar percent={p} label={`${m.title}: parole conosciute`} />
                  </Card>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function PosPicker({ pos, setPos }: { pos: PosFilter; setPos: (p: PosFilter) => void }) {
  return (
    <div role="group" aria-label="Tipo di parola" className="flex gap-2 overflow-x-auto">
      {POS_FILTERS.map((f) => (
        <Chip key={f.id} active={pos === f.id} onClick={() => setPos(f.id)}>
          {f.label}
        </Chip>
      ))}
    </div>
  )
}

function SearchResults({
  hits,
  langs,
  cards,
  loading,
}: {
  hits: Hit[]
  langs: Lang[]
  cards: LearningCard[]
  loading: boolean
}) {
  if (loading) return <p className="text-sm text-slate-500">Caricamento…</p>
  if (hits.length === 0) return <p className="text-sm text-slate-500">Nessuna parola trovata.</p>
  const known = knownIn(cards)
  return (
    <ul className="flex flex-col gap-2" aria-label="Risultati">
      {hits.map((h) => (
        <WordRow key={h.word.id} word={h.word} langs={langs} known={known} theme={h.theme} />
      ))}
    </ul>
  )
}

function PronunciationPage() {
  const [langs, toggle] = useLangs()
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Link to="/learning/vocabolario" className={backLink}>
          ← Vocabolario
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">
          <span className="mr-2">🗣️</span>Pronuncia
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Come leggere le trascrizioni [ ]: le stesse regole dei corsi, lingua per lingua.
        </p>
      </div>
      <LangPicker langs={langs} toggle={toggle} />
      {langs.map((l) => (
        <section key={l} aria-labelledby={`pron-${l}`}>
          <Card className="flex flex-col gap-2 text-sm">
            <h2 id={`pron-${l}`} className="text-base font-semibold">
              {LANG_FLAG[l]} {LANG_LABEL[l]}
            </h2>
            <HtmlText html={LEGEND[l]} block />
            <h3 className="mt-1 text-xs font-semibold tracking-wide text-slate-500 uppercase">Tutte le regole</h3>
            <HtmlText html={LEGEND_FULL[l]} block />
          </Card>
        </section>
      ))}
    </div>
  )
}

function Legend({ langs }: { langs: Lang[] }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <Button variant="ghost" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {open ? 'Nascondi la legenda' : 'Come leggere le trascrizioni'}
      </Button>
      {open && (
        <div className="mt-2 flex flex-col gap-2 rounded-xl bg-slate-100 p-3 text-sm dark:bg-slate-800">
          {langs.map((l) => (
            <div key={l}>
              <strong>
                {LANG_FLAG[l]} {LANG_LABEL[l]}
              </strong>
              <HtmlText html={LEGEND[l]} block />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function grammar(t: WordEntry): string {
  const bits: string[] = []
  if (t.plOnly) bits.push('pl')
  else if (t.g) bits.push(GENDER_LABEL[t.g])
  return bits.join(' ')
}

/**
 * One language of a word; `t` undefined = the word is not in that language's list yet ("—"). The language's own
 * Italian gloss shows when it differs from the headword; its Italian example only when the word has no shared one.
 */
function TrLine({ lang, t, word, showEx }: { lang: Lang; t: WordEntry | undefined; word: VocabWord; showEx: boolean }) {
  if (!t)
    return (
      <div className="flex gap-2">
        <span aria-label={LANG_LABEL[lang]} className="shrink-0">
          {LANG_FLAG[lang]}
        </span>
        <span className="text-slate-400 dark:text-slate-500" aria-label="non ancora presente">
          —
        </span>
      </div>
    )
  const g = grammar(t)
  return (
    <div className="flex gap-2">
      <span aria-label={LANG_LABEL[lang]} className="shrink-0">
        {LANG_FLAG[lang]}
      </span>
      <div className="min-w-0">
        <p>
          <span className="font-medium" lang={lang}>
            {t.w}
          </span>{' '}
          <span className="text-slate-500 dark:text-slate-400">[{t.pron}]</span>
          {g && <span className="ml-1.5 text-xs text-slate-500">{g}</span>}
          {t.it !== word.it && <span className="ml-1.5 text-sm text-slate-500">= {t.it}</span>}
        </p>
        {t.pl && (
          <p className="text-sm text-slate-600 dark:text-slate-400">
            pl. <span lang={lang}>{t.pl}</span>
            {t.plPron && <span className="text-slate-500"> [{t.plPron}]</span>}
          </p>
        )}
        {t.note && <p className="text-sm text-slate-600 dark:text-slate-400">{t.note}</p>}
        {showEx && t.ex && (
          <p className="text-sm text-slate-600 italic dark:text-slate-400" lang={lang}>
            {t.ex}
            {!word.exIt && t.exIt && <span className="not-italic"> «{t.exIt}»</span>}
          </p>
        )}
      </div>
    </div>
  )
}

/** One dictionary row: Italian headword and the chosen translations; `theme` adds a theme tag (search results). */
function WordRow({
  word: w,
  langs,
  known,
  theme,
}: {
  word: VocabWord
  langs: Lang[]
  known: Set<string>
  theme?: VocabTheme
}) {
  const present = wordLangs(w, langs)
  const allKnown = present.length > 0 && present.every((l) => known.has(vocabItemId(w.id, l)))
  return (
    <li>
      <Card className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold">{w.it}</h3>
          <span className="flex shrink-0 items-center gap-2 text-xs text-slate-500">
            {allKnown && <span>✓ la sai</span>}
            {theme && (
              <Link
                to={`/learning/vocabolario/${theme.id}`}
                className="inline-flex min-h-10 items-center rounded-full bg-slate-100 px-2.5 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                {theme.emoji} {theme.title}
              </Link>
            )}
          </span>
        </div>
        {w.note && <p className="text-sm text-slate-600 dark:text-slate-400">{w.note}</p>}
        {w.exIt && <p className="text-sm text-slate-600 italic dark:text-slate-400">«{w.exIt}»</p>}
        {langs.map((l) => (
          <TrLine key={l} lang={l} t={w[l]} word={w} showEx />
        ))}
      </Card>
    </li>
  )
}

function Dictionary({
  theme,
  langs,
  known,
  pos,
}: {
  theme: VocabTheme
  langs: Lang[]
  known: Set<string>
  pos: PosFilter
}) {
  const words = theme.words.filter((w) => posMatches(w, pos))
  if (words.length === 0) return <p className="text-sm text-slate-500">Nessuna parola di questo tipo nel tema.</p>
  return (
    <ul className="flex flex-col gap-2">
      {words.map((w) => (
        <WordRow key={w.id} word={w} langs={langs} known={known} />
      ))}
    </ul>
  )
}

function Flashcards({ theme, langs, known }: { theme: VocabTheme; langs: Lang[]; known: Set<string> }) {
  const [position, setPosition] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const deck = vocabDeck(theme.words, known, langs)

  if (deck.length === 0) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-xl border border-slate-200 p-5 dark:border-slate-800">
        <p className="font-medium">Mazzo completato</p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Conosci tutte le parole nelle lingue scelte: da qui in poi te le ripropone{' '}
          <Link to="/learning/ripasso" className="font-medium underline underline-offset-2">
            🔁 Ripasso
          </Link>{' '}
          quando è il momento.
        </p>
        <Button
          onClick={() => {
            void resetThemeLangs(theme.words, known, langs)
            setPosition(0)
            setFlipped(false)
          }}
        >
          Ricomincia il mazzo
        </Button>
      </div>
    )
  }

  const pos = Math.min(position, deck.length - 1)
  const word: VocabWord | undefined = theme.words[deck[pos]!]
  if (!word) return null
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-slate-600 tabular-nums dark:text-slate-400">
        Parola {pos + 1} di {deck.length} da ripassare
      </p>
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-label={flipped ? 'Mostra la parola italiana' : 'Mostra la traduzione'}
        className={`flex min-h-48 w-full flex-col justify-center gap-3 rounded-xl border border-slate-200 bg-white p-6 text-left dark:border-slate-700 dark:bg-slate-800/50 ${FOCUS_RING}`}
      >
        <span className="text-xs font-semibold tracking-wide text-(color:--accent-border) uppercase">
          {flipped ? 'Traduzione' : 'Italiano'}
        </span>
        <span className="text-xl leading-snug font-medium">{word.it}</span>
        {flipped && (
          <span className="flex flex-col gap-2 text-base">
            {wordLangs(word, langs).map((l) => (
              <TrLine key={l} lang={l} t={word[l]} word={word} showEx={false} />
            ))}
          </span>
        )}
      </button>
      {flipped ? (
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => {
              void setWordKnown(word.id, wordLangs(word, langs), true)
              setFlipped(false)
            }}
          >
            Lo so
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setPosition(nextInDeck(pos, deck.length))
              setFlipped(false)
            }}
          >
            Da ripassare
          </Button>
        </div>
      ) : (
        <p className="text-sm text-slate-500">Dilla a voce nelle lingue scelte, poi tocca la carta.</p>
      )}
    </div>
  )
}

type TabId = 'dict' | 'cards'

function ThemeView({ theme }: { theme: VocabTheme }) {
  const [langs, toggle] = useLangs()
  const [tab, setTab] = useState<TabId>('dict')
  const [pos, setPos] = useState<PosFilter>('all')
  const cards = useVocabCards()
  const known = knownIn(cards ?? [])
  const c = themeCount(theme.words, known, langs)
  const p = percent(c.done, c.total)
  const tabs: { id: TabId; label: string }[] = [
    { id: 'dict', label: `Dizionario (${theme.words.length})` },
    { id: 'cards', label: 'Flashcard' },
  ]
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Link to="/learning/vocabolario" className={backLink}>
          ← Vocabolario
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">
          <span className="mr-2">{theme.emoji}</span>
          {theme.title}
        </h1>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1">
            <ProgressBar percent={p} label={`${theme.title}: parole conosciute`} />
          </div>
          <span className="text-sm text-slate-500 tabular-nums">
            {p}% · {c.done}/{c.total}
          </span>
        </div>
      </div>
      <LangPicker langs={langs} toggle={toggle} />
      <Legend langs={langs} />
      <div
        role="tablist"
        aria-label="Sezioni del tema"
        className="flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 dark:bg-slate-800"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`min-h-10 shrink-0 flex-1 rounded-lg px-3 text-sm font-medium whitespace-nowrap ${FOCUS_RING_INSET} ${
              tab === t.id
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel">
        {tab === 'dict' && (
          <div className="flex flex-col gap-3">
            <PosPicker pos={pos} setPos={setPos} />
            <Dictionary theme={theme} langs={langs} known={known} pos={pos} />
          </div>
        )}
        {/* Mounted once the saved marks have loaded, so the deck starts from them. */}
        {tab === 'cards' && cards && <Flashcards theme={theme} langs={langs} known={known} />}
      </div>
    </div>
  )
}

/** Lazy theme content, same shape as useCourse: sync when the chunk is cached, otherwise loads it once. */
function ThemePage() {
  const { themeId = '' } = useParams()
  const { value, status } = useLazyChunk(themeId, loadedTheme(themeId), themeMetaById(themeId) !== undefined, loadTheme)
  if (value) return <ThemeView key={value.id} theme={value} />
  if (status === 'missing') return <NotFound what="Theme" />
  return <CourseLoading />
}

export default function VocabPage() {
  return (
    <Routes>
      <Route index element={<ThemeList />} />
      {/* Static segment: ranks above :themeId (vocab.test.ts keeps "pronuncia" out of the theme ids). */}
      <Route path="pronuncia" element={<PronunciationPage />} />
      <Route path=":themeId" element={<ThemePage />} />
    </Routes>
  )
}
