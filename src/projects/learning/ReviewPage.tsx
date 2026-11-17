// Ripasso page (/learning/ripasso) and its Learning-home card. Queue logic: ./review.ts; writes: learningSync.ts.
import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { FOCUS_RING } from '../../components/focus'
import { dayKey } from '../../lib/dates'
import { db } from '../../lib/db'
import { answerReviewQuiz, gradeReview } from '../../lib/learningSync'
import { courseMetaById, loadCourse, loadedCourse } from './courses/registry'
import { CourseLoading } from './CourseLoading'
import { HtmlText } from './HtmlText'
import { buildQueue, gradeDays, sourcesOf, type Grade, type Queue, type QueueItem } from './review'
import { loadAllThemes, loadedThemes } from './vocab/index'
import { VOCAB_COURSE_ID } from './vocab/progress'
import { LANG_FLAG, LANG_LABEL, LANGS, type Lang } from './vocab/types'

/** Live queue for `today`; `undefined` while Dexie loads. `keep` drops items whose content no longer exists. */
function useQueue(today: string, keep?: (i: QueueItem) => boolean): Queue | undefined {
  const rows = useLiveQuery(async () => {
    const [cards, quiz, reviews] = await Promise.all([
      db.learningCards.toArray(),
      db.learningQuiz.toArray(),
      db.learningReviews.toArray(),
    ])
    return { cards, quiz, reviews }
  }, [])
  return useMemo(() => {
    if (!rows) return undefined
    const sources = sourcesOf(rows.cards, rows.quiz).filter((s) => !keep || keep({ ...s, step: 0, due: '' }))
    return buildQueue(sources, rows.reviews, today)
  }, [rows, today, keep])
}

const today = () => dayKey(new Date())

export function ReviewHomeCard() {
  const [day] = useState(today)
  const q = useQueue(day)
  const n = q?.items.length ?? 0
  return (
    <Link to="ripasso" className="block rounded-xl focus-visible:outline-none">
      <Card className="flex items-center gap-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
        <span className="text-2xl" aria-hidden>
          🔁
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-medium">Ripasso</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {!q
              ? '…'
              : n > 0
                ? `${n} da ripassare oggi`
                : q.doneToday > 0
                  ? `Fatto per oggi (${q.doneToday})`
                  : 'Niente da ripassare oggi'}
          </p>
        </div>
        {n > 0 && (
          <span className="rounded-full bg-(color:--accent) px-2.5 py-0.5 text-sm font-semibold text-(color:--accent-fg) tabular-nums">
            {n}
          </span>
        )}
      </Card>
    </Link>
  )
}

// --- Content lookup -------------------------------------------------------------------------

interface Shown {
  context: string
  front: React.ReactNode
  back?: React.ReactNode
  quiz?: { q: string; options: string[]; answer: number; explanation: string }
}

function vocabParts(i: QueueItem): { wordId: string; lang: Lang } | null {
  const dot = i.itemId.lastIndexOf('.')
  const lang = i.itemId.slice(dot + 1) as Lang
  return dot > 0 && (LANGS as readonly string[]).includes(lang) ? { wordId: i.itemId.slice(0, dot), lang } : null
}

/** What to show for an item, from content already loaded; null = content gone (or not loaded yet). */
function lookup(i: QueueItem): Shown | null {
  if (i.courseId === VOCAB_COURSE_ID) {
    const p = vocabParts(i)
    const theme = loadedThemes()?.find((t) => t.id === i.moduleId)
    const word = theme?.words.find((w) => w.id === p?.wordId)
    const t = p && word?.[p.lang]
    if (!p || !theme || !word || !t) return null
    return {
      context: `🗂️ Vocabolario · ${theme.title} · ${LANG_FLAG[p.lang]} ${LANG_LABEL[p.lang]}`,
      front: (
        <>
          {word.it} <span className="text-base font-normal text-slate-500">→ {LANG_FLAG[p.lang]}</span>
        </>
      ),
      back: (
        <>
          <span className="text-xl font-medium" lang={p.lang}>
            {t.w}
          </span>{' '}
          <span className="text-slate-500 dark:text-slate-400">[{t.pron}]</span>
          {t.note && <span className="mt-2 block text-sm text-slate-600 dark:text-slate-400">{t.note}</span>}
        </>
      ),
    }
  }
  const course = loadedCourse(i.courseId)
  const mod = course?.modules.find((m) => m.id === i.moduleId)
  if (!course || !mod) return null
  const context = `${course.emoji} ${course.title} · ${mod.title}`
  if (i.kind === 'quiz') {
    const x = mod.quiz.find((y) => y.id === i.itemId)
    return x ? { context, front: <HtmlText html={x.q} />, quiz: x } : null
  }
  const c = mod.cards.find((y) => y.id === i.itemId)
  return c ? { context, front: <HtmlText html={c.front} />, back: <HtmlText html={c.back} /> } : null
}

/** Loads the course chunks (and Vocabolario) the due items need; true once done. */
function useContent(items: QueueItem[] | undefined): boolean {
  const need = useMemo(() => [...new Set((items ?? []).map((i) => i.courseId))].sort().join(','), [items])
  const [ready, setReady] = useState<string | null>(null)
  useEffect(() => {
    if (items === undefined) return
    let live = true
    const ids = need ? need.split(',') : []
    void Promise.all(
      ids.map((id) =>
        id === VOCAB_COURSE_ID ? loadAllThemes() : courseMetaById(id) ? loadCourse(id) : Promise.resolve(),
      ),
    )
      .catch(() => undefined)
      .then(() => live && setReady(need))
    return () => {
      live = false
    }
  }, [need, items])
  return ready === need
}

// --- Page ---------------------------------------------------------------------------------------

const GRADES: { grade: Grade; label: string; cls: string }[] = [
  { grade: 'again', label: 'Di nuovo', cls: 'bg-rose-500/10 text-rose-700 hover:bg-rose-500/20 dark:text-rose-300' },
  {
    grade: 'hard',
    label: 'Difficile',
    cls: 'bg-amber-500/10 text-amber-800 hover:bg-amber-500/20 dark:text-amber-300',
  },
  {
    grade: 'easy',
    label: 'Facile',
    cls: 'bg-emerald-500/10 text-emerald-800 hover:bg-emerald-500/20 dark:text-emerald-300',
  },
]

const days = (n: number) => (n === 1 ? 'domani' : `tra ${n} giorni`)

function Item({ item, shown, day }: { item: QueueItem; shown: Shown; day: string }) {
  const [flipped, setFlipped] = useState(false)
  const [picked, setPicked] = useState<number | null>(null)
  const quiz = shown.quiz
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-slate-500">
        {shown.context}
        {quiz ? ' · quiz sbagliato' : ''}
      </p>
      <div className="flex min-h-40 flex-col justify-center gap-3 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/50">
        <div className="text-xl leading-snug font-medium">{shown.front}</div>
        {flipped && shown.back && (
          <div className="border-t border-slate-200 pt-3 text-base leading-relaxed dark:border-slate-700">
            {shown.back}
          </div>
        )}
      </div>

      {quiz ? (
        <>
          <div className="flex flex-col gap-2">
            {quiz.options.map((o, j) => {
              const tone =
                picked === null
                  ? 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-800'
                  : j === quiz.answer
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'
                    : j === picked
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/10'
                      : 'border-slate-200 opacity-60 dark:border-slate-700'
              return (
                <button
                  key={j}
                  type="button"
                  disabled={picked !== null}
                  onClick={() => setPicked(j)}
                  className={`min-h-10 w-full rounded-lg border-2 px-3 py-2 text-left text-sm disabled:cursor-default ${FOCUS_RING} ${tone}`}
                >
                  <HtmlText html={o} />
                </button>
              )
            })}
          </div>
          {picked !== null && (
            <>
              <p className="text-sm text-slate-700 dark:text-slate-300" aria-live="polite">
                <strong>{picked === quiz.answer ? 'Esatto: esce dal ripasso.' : 'Non ancora: torna domani.'}</strong>{' '}
                <HtmlText html={quiz.explanation} />
              </p>
              <Button onClick={() => void answerReviewQuiz(item, picked, quiz.answer, day)}>Avanti</Button>
            </>
          )}
        </>
      ) : flipped ? (
        <div className="grid grid-cols-3 gap-2">
          {GRADES.map((g) => (
            <button
              key={g.grade}
              type="button"
              onClick={() => void gradeReview(item, g.grade, day)}
              className={`flex min-h-12 flex-col items-center justify-center rounded-lg px-2 text-sm font-medium ${FOCUS_RING} ${g.cls}`}
            >
              {g.label}
              <span className="text-xs font-normal opacity-80">{days(gradeDays(item.step, g.grade))}</span>
            </button>
          ))}
        </div>
      ) : (
        <Button onClick={() => setFlipped(true)}>Mostra la risposta</Button>
      )}
    </div>
  )
}

export default function ReviewPage() {
  const [day] = useState(today)
  const raw = useQueue(day)
  const ready = useContent(raw?.items)
  // Once content is loaded, drop items whose card/word/question no longer exists, then take today's slice.
  const keep = useMemo(() => (ready ? (i: QueueItem) => lookup(i) !== null : undefined), [ready])
  const q = useQueue(day, keep)
  const current = ready ? q?.items[0] : undefined
  const shown = current && lookup(current)

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Link
          to="/learning"
          className="mb-3 inline-block text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        >
          ← Learning
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">🔁 Ripasso</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Flashcard che conosci, parole del Vocabolario e domande sbagliate, quando è il momento di rivederle. Al
          massimo {q?.limit ?? 15} al giorno.
        </p>
      </div>
      {!q || !ready ? (
        <CourseLoading />
      ) : current && shown ? (
        <>
          <p className="text-sm text-slate-600 tabular-nums dark:text-slate-400" aria-live="polite">
            Oggi {q.doneToday + 1} di {Math.min(q.limit, q.doneToday + q.items.length)}
          </p>
          <Item key={current.id} item={current} shown={shown} day={day} />
        </>
      ) : (
        <Card className="flex flex-col gap-2">
          <p className="font-medium">
            {q.doneToday > 0 ? `Fatto per oggi ✓ (${q.doneToday})` : 'Niente da ripassare oggi'}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {q.dueCount > 0
              ? `Altri ${q.dueCount} sono in scadenza: arrivano domani, ${q.limit} al giorno.`
              : 'Entrano qui le flashcard che segni «Lo so», le parole che conosci nel Vocabolario e le domande del quiz sbagliate.'}
          </p>
        </Card>
      )}
    </div>
  )
}
