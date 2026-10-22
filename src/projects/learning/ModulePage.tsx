import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FOCUS_RING_INSET } from '../../components/focus'
import { courseById } from './courses'
import { CardsTab } from './CardsTab'
import { HtmlText } from './HtmlText'
import { NotFound } from './NotFound'
import { PracticeTab } from './PracticeTab'
import { ProgressBar } from './ProgressBar'
import { EMPTY_STATE, moduleProgress } from './progress'
import { QuizTab } from './QuizTab'
import { useCourseState } from './store'
import type { Course, CourseModule } from './types'

type TabId = 'lesson' | 'quiz' | 'cards' | 'practice'

function tabsFor(m: CourseModule): { id: TabId; label: string }[] {
  return [
    { id: 'lesson' as const, label: 'Lezione' },
    ...(m.quiz.length ? [{ id: 'quiz' as const, label: `Quiz (${m.quiz.length})` }] : []),
    { id: 'cards' as const, label: `Flashcard (${m.cards.length})` },
    { id: 'practice' as const, label: `Pratica (${m.practice.length})` },
  ]
}

function ModuleView({ course, mod }: { course: Course; mod: CourseModule }) {
  const [tab, setTab] = useState<TabId>('lesson')
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
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1">
            <ProgressBar percent={p.percent} label={`${mod.title}: progresso`} />
          </div>
          <span className="text-sm text-slate-500 tabular-nums">{p.percent}%</span>
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
            <HtmlText html={mod.lesson} block />
            <p className="mt-6 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              <strong>Dal tuo vault.</strong> <HtmlText html={mod.vault} />
            </p>
          </div>
        )}
        {/* Mounted only once the saved state has loaded, so inputs start from it. */}
        {tab === 'quiz' && loaded && <QuizTab courseId={course.id} mod={mod} state={loaded} />}
        {tab === 'cards' && loaded && <CardsTab courseId={course.id} mod={mod} state={loaded} />}
        {tab === 'practice' && loaded && <PracticeTab courseId={course.id} mod={mod} state={loaded} />}
      </div>
    </div>
  )
}

export function ModulePage() {
  const { courseId, moduleId } = useParams()
  const course = courseId ? courseById(courseId) : undefined
  const mod = course?.modules.find((m) => m.id === moduleId)
  if (!course || !mod) return <NotFound what="Module" />
  // key: switching module resets the tab and any per-module local state.
  return <ModuleView key={mod.id} course={course} mod={mod} />
}
