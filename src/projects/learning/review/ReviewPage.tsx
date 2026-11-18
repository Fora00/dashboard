// Ripasso page (/learning/ripasso) and its Learning-home card. Queue logic: ./review.ts; writes: learningSync.ts.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../../components/Button'
import { Card } from '../../../components/Card'
import { FOCUS_RING } from '../../../components/focus'
import { answerReviewQuiz, gradeReview } from '../../../lib/learningSync'
import { useToday } from '../../../lib/useToday'
import { CourseLoading } from '../ui/CourseLoading'
import { HtmlText } from '../engine/HtmlText'
import { gradeDays, type Grade, type QueueItem } from '../engine/review'
import { lookup, useReviewQueue, type Shown } from './content'

// --- Page ---------------------------------------------------------------------------------------

const GRADES: { grade: Grade; label: string; cls: string }[] = [
  {
    grade: 'again',
    label: 'Di nuovo',
    cls: 'bg-rose-500/10 text-rose-700 hover:bg-rose-500/20 dark:text-rose-300',
  },
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
              <Button onClick={() => void answerReviewQuiz(item, picked, quiz, day)}>Avanti</Button>
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
  const day = useToday()
  // Items whose card/word/question no longer exists are dropped (content.tsx), then today's slice.
  const { q, ready } = useReviewQueue(day)
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
