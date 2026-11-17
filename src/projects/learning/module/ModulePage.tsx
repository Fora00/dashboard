import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { FOCUS_RING_INSET } from '../../../components/focus'
import { setPosition } from '../../../lib/learningSync'
import { CourseLoading } from '../ui/CourseLoading'
import { CardsTab } from './CardsTab'
import { headingsOf } from '../engine/html'
import { HtmlText } from '../engine/HtmlText'
import { NotFound } from '../ui/NotFound'
import { PracticeTab } from './PracticeTab'
import { ProgressBars } from '../ui/ProgressBar'
import { courseHasChecklist, EMPTY_STATE, moduleProgress } from '../engine/progress'
import { QuizTab } from './QuizTab'
import { useCourseState } from '../engine/store'
import type { Course, CourseModule } from '../engine/types'
import { useCourse } from '../engine/useCourse'

type TabId = 'lesson' | 'quiz' | 'cards' | 'practice'

function tabsFor(m: CourseModule): { id: TabId; label: string }[] {
  return [
    { id: 'lesson' as const, label: 'Lezione' },
    ...(m.quiz.length ? [{ id: 'quiz' as const, label: `Quiz (${m.quiz.length})` }] : []),
    { id: 'cards' as const, label: `Flashcard (${m.cards.length})` },
    { id: 'practice' as const, label: `Pratica (${m.practice.length})` },
  ]
}

const ANCHOR = 'lez-'

/** "In questa lezione": jump list from the lesson's <h3>s (buttons, not #hash links: HashRouter owns the hash). */
function JumpList({ html }: { html: string }) {
  const heads = headingsOf(html)
  if (heads.length < 3) return null
  const go = (i: number) => {
    const el = document.getElementById(`${ANCHOR}${i}`)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    el.focus({ preventScroll: true })
  }
  return (
    <details className="mb-4 rounded-xl border border-slate-200 dark:border-slate-800">
      <summary className={`flex min-h-10 cursor-pointer items-center px-3 text-sm font-medium ${FOCUS_RING_INSET}`}>
        In questa lezione ({heads.length})
      </summary>
      <ol className="flex flex-col pb-2">
        {heads.map((h, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => go(i)}
              className={`flex min-h-10 w-full items-center px-3 text-left text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 ${FOCUS_RING_INSET}`}
            >
              {h}
            </button>
          </li>
        ))}
      </ol>
    </details>
  )
}

/** Previous / next module in course order, shown under every tab. */
function ModuleNav({ course, mod }: { course: Course; mod: CourseModule }) {
  const i = course.modules.findIndex((m) => m.id === mod.id)
  const prev = course.modules[i - 1]
  const next = course.modules[i + 1]
  const cls = `flex min-h-12 flex-1 flex-col justify-center rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 ${FOCUS_RING_INSET}`
  return (
    <nav
      aria-label="Moduli"
      className="mt-2 flex flex-col gap-2 border-t border-slate-200 pt-4 sm:flex-row dark:border-slate-800"
    >
      {prev && (
        <Link to={`/learning/${course.id}/${prev.id}`} className={cls}>
          <span className="text-xs text-slate-500">← Modulo precedente</span>
          <span className="font-medium">{prev.title}</span>
        </Link>
      )}
      {next ? (
        <Link to={`/learning/${course.id}/${next.id}`} className={`${cls} sm:text-right`}>
          <span className="text-xs text-slate-500">Modulo successivo →</span>
          <span className="font-medium">{next.title}</span>
        </Link>
      ) : (
        <Link to={`/learning/${course.id}`} className={`${cls} sm:text-right`}>
          <span className="text-xs text-slate-500">Ultimo modulo</span>
          <span className="font-medium">Torna al corso</span>
        </Link>
      )}
    </nav>
  )
}

function ModuleView({ course, mod }: { course: Course; mod: CourseModule }) {
  const [params] = useSearchParams()
  const wanted = params.get('tab')
  const [tab, setTab] = useState<TabId>(() =>
    tabsFor(mod).some((t) => t.id === wanted) ? (wanted as TabId) : 'lesson',
  )
  // A module opened from the prev/next links starts at the top (the window scrolls, not a container).
  // …unless it came from a search hit inside a lesson section (?sec=n): then scroll there.
  const sec = tab === 'lesson' ? params.get('sec') : null
  useEffect(() => {
    const el = sec === null ? null : document.getElementById(`${ANCHOR}${sec}`)
    if (el) {
      el.scrollIntoView({ block: 'start' })
      el.focus({ preventScroll: true })
    } else window.scrollTo(0, 0)
    // Once per open: switching tabs later must not jump back.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // Remember where I am, so any device can offer "Riprendi da…".
  useEffect(() => {
    void setPosition(course.id, mod.id, tab)
  }, [course.id, mod.id, tab])
  const loaded = useCourseState(course.id)
  const state = loaded ?? EMPTY_STATE
  const p = moduleProgress(course.id, mod, state)
  const tabs = tabsFor(mod)
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Link
          to={`/learning/${course.id}`}
          className="mb-3 inline-block text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        >
          ← {course.title}
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{mod.title}</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{mod.subtitle}</p>
        <div className="mt-3">
          <ProgressBars
            split={courseHasChecklist(course)}
            overall={p}
            know={p.know}
            skill={p.skill}
            label={`${mod.title}: progresso`}
          />
        </div>
      </div>

      {mod.verify && (
        <p
          role="note"
          className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200"
        >
          <strong>⚠ Da verificare.</strong> {mod.verify}
        </p>
      )}

      <div
        role="tablist"
        aria-label="Sezioni del modulo"
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
        {tab === 'lesson' && (
          <div>
            <JumpList html={mod.lesson} />
            <HtmlText html={mod.lesson} block anchorPrefix={ANCHOR} />
            {mod.vault && (
              <p className="mt-6 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                <strong>Dal tuo vault.</strong> <HtmlText html={mod.vault} />
              </p>
            )}
          </div>
        )}
        {/* Mounted only once the saved state has loaded, so inputs start from it. */}
        {tab === 'quiz' && loaded && <QuizTab courseId={course.id} mod={mod} state={loaded} />}
        {tab === 'cards' && loaded && <CardsTab courseId={course.id} mod={mod} state={loaded} />}
        {tab === 'practice' && loaded && <PracticeTab courseId={course.id} mod={mod} state={loaded} />}
      </div>

      <ModuleNav course={course} mod={mod} />
    </div>
  )
}

export function ModulePage() {
  const { courseId, moduleId } = useParams()
  const { course, status } = useCourse(courseId)
  if (status === 'loading') return <CourseLoading />
  const mod = course?.modules.find((m) => m.id === moduleId)
  if (!course || !mod) return <NotFound what="Module" />
  // key: switching module resets the tab and any per-module local state.
  return <ModuleView key={mod.id} course={course} mod={mod} />
}
