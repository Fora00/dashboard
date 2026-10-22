import { Button } from '../../components/Button'
import { FOCUS_RING } from '../../components/focus'
import { HtmlText } from './HtmlText'
import { moduleProgress, type CourseState } from './progress'
import { answerQuiz, resetQuiz } from '../../lib/learningSync'
import type { CourseModule } from './types'

interface Props {
  courseId: string
  mod: CourseModule
  state: CourseState
}

export function QuizTab({ courseId, mod, state }: Props) {
  const answers = new Map(
    state.quiz.filter((a) => a.courseId === courseId && a.moduleId === mod.id).map((a) => [a.itemId, a]),
  )
  const right = moduleProgress(courseId, mod, state).quiz.done
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span aria-live="polite" className="text-sm text-slate-600 tabular-nums dark:text-slate-400">
          {right} / {mod.quiz.length} corrette
        </span>
        <Button variant="ghost" onClick={() => void resetQuiz(courseId, mod.id)} disabled={answers.size === 0}>
          Rifai il quiz
        </Button>
      </div>

      {mod.quiz.map((q, i) => {
        const a = answers.get(q.id)
        return (
          <fieldset key={q.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <legend className="sr-only">Domanda {i + 1}</legend>
            <p className="font-medium">
              {i + 1}. <HtmlText html={q.q} />
            </p>
            <div className="mt-3 flex flex-col gap-2">
              {q.options.map((o, j) => {
                const isRight = j === q.answer
                const isPicked = a?.selected === j
                const tone = !a
                  ? 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-800'
                  : isRight
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'
                    : isPicked
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/10'
                      : 'border-slate-200 opacity-60 dark:border-slate-700'
                return (
                  <button
                    key={j}
                    type="button"
                    disabled={!!a}
                    aria-pressed={isPicked}
                    onClick={() => void answerQuiz(courseId, mod.id, q.id, j, q.answer)}
                    className={`flex min-h-10 w-full items-center justify-between gap-2 rounded-lg border-2 px-3 py-2 text-left text-sm disabled:cursor-default ${FOCUS_RING} ${tone}`}
                  >
                    <span>
                      <HtmlText html={o} />
                    </span>
                    {a && isRight && <span aria-label="risposta corretta">✓</span>}
                    {a && isPicked && !isRight && <span aria-label="risposta sbagliata">✗</span>}
                  </button>
                )
              })}
            </div>
            {a && (
              <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
                <strong>{a.correct === 1 ? 'Esatto.' : 'Non proprio.'}</strong> <HtmlText html={q.explanation} />
              </p>
            )}
          </fieldset>
        )
      })}
    </div>
  )
}
