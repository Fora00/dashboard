import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { Card } from '../../components/Card'
import { EmptyState } from '../../components/EmptyState'
import { PageHeader } from '../../components/PageHeader'
import { SyncCard } from '../../components/SyncCard'
import { sync } from '../../lib/learningSync'
import { usePersistedState } from '../../lib/safeStorage'
import {
  courseGroups,
  courseMetas,
  loadCourse,
  loadedCourse,
  type CourseGroupId,
  type CourseMeta,
} from './courses/registry'
import { CourseLoading } from './CourseLoading'
import { CoursePage } from './CoursePage'
import { DiaryPage } from './DiaryPage'
import { ModulePage } from './ModulePage'
import { ProgressBar } from './ProgressBar'
import { courseProgress } from './progress'
import { useCourseState, useResume } from './store'
import { loadAllThemes, loadedThemes, visibleThemes } from './vocab/index'

// The vocabulary page is its own chunk (its words come in one more chunk per language, see vocab/index.ts).
const VocabPage = lazy(() => import('./vocab/VocabPage'))

// Course content is lazy (own chunk per course). The list shows the lightweight meta at once and
// fills in the progress percentages as chunks arrive, one at a time while the browser is idle.
const idle = () =>
  new Promise<void>((resolve) => {
    if (typeof requestIdleCallback === 'function') requestIdleCallback(() => resolve())
    else setTimeout(resolve, 200)
  })

function CourseCard({ meta }: { meta: CourseMeta }) {
  const course = loadedCourse(meta.id)
  const state = useCourseState(meta.id)
  const p = course && state ? courseProgress(course, state) : null
  const resume = useResume(meta.id)
  const resumeTitle = course?.modules.find((m) => m.id === resume?.moduleId)?.title
  return (
    <Link to={meta.id} className="block rounded-xl focus-visible:outline-none">
      <Card className="flex flex-col gap-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-medium">
            <span className="mr-2">{meta.emoji}</span>
            {meta.title}
          </h3>
          <span className="text-sm text-slate-500 tabular-nums">{p?.percent ?? 0}%</span>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{meta.summary}</p>
        <ProgressBar percent={p?.percent ?? 0} label={`${meta.title}: progresso`} />
        <p className="text-xs text-slate-500">
          {meta.moduleCount} moduli{resumeTitle ? ` · ▶ ${resumeTitle}` : ''}
        </p>
      </Card>
    </Link>
  )
}

function VocabCard() {
  // Counts come from the words themselves (the four small words chunks, precached by the PWA).
  const [themes, setThemes] = useState(loadedThemes)
  useEffect(() => {
    if (themes) return
    let live = true
    void loadAllThemes().then((t) => live && setThemes(t))
    return () => {
      live = false
    }
  }, [themes])
  const shown = visibleThemes(themes)
  const words = themes?.reduce((n, t) => n + t.words.length, 0)
  return (
    <Link to="vocabolario" className="block rounded-xl focus-visible:outline-none">
      <Card className="flex flex-col gap-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
        <h3 className="font-medium">
          <span className="mr-2">🗂️</span>
          Vocabolario
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Le stesse parole in spagnolo, francese, tedesco e russo: dizionario per temi e flashcard.
        </p>
        <p className="text-xs text-slate-500">
          {shown.length} temi{words === undefined ? '' : ` · ${words} parole`}
        </p>
      </Card>
    </Link>
  )
}

// Extra cards shown at the end of a group (not courses).
const groupExtras: Partial<Record<CourseGroupId, ReactNode>> = { lingue: <VocabCard /> }

const COLLAPSED_KEY = 'learning.collapsedGroups'
const asIdList = (raw: unknown): string[] =>
  Array.isArray(raw) ? raw.filter((x): x is string => typeof x === 'string') : []

function CourseGroups() {
  // Per-device convenience: which sections are folded (all open by default).
  const [collapsed, setCollapsed] = usePersistedState<string[]>(COLLAPSED_KEY, [], asIdList)
  const toggle = (id: string) =>
    setCollapsed(collapsed.includes(id) ? collapsed.filter((x) => x !== id) : [...collapsed, id])
  return (
    <div className="flex flex-col gap-5">
      {courseGroups.map((g) => {
        const metas = courseMetas.filter((m) => m.group === g.id)
        const extra = groupExtras[g.id]
        if (metas.length === 0 && !extra) return null
        const open = !collapsed.includes(g.id)
        const panelId = `learning-group-${g.id}`
        return (
          <section key={g.id} aria-labelledby={`${panelId}-h`}>
            <h2 id={`${panelId}-h`}>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => toggle(g.id)}
                className="flex min-h-10 w-full items-center gap-2 rounded-lg px-1 text-left text-sm font-semibold tracking-wide text-slate-600 uppercase hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <span aria-hidden>{g.emoji}</span>
                <span className="flex-1">{g.title}</span>
                <span className="text-xs font-normal text-slate-500 normal-case tabular-nums">
                  {metas.length + (extra ? 1 : 0)}
                </span>
                <span aria-hidden className={`text-slate-400 transition-transform ${open ? 'rotate-90' : ''}`}>
                  ›
                </span>
              </button>
            </h2>
            {open && (
              <div id={panelId} className="mt-2 flex flex-col gap-3">
                {metas.map((m) => (
                  <CourseCard key={m.id} meta={m} />
                ))}
                {extra}
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}

function CourseList() {
  const [, setReady] = useState(0)
  useEffect(() => {
    let live = true
    void (async () => {
      for (let i = 0; i < courseMetas.length && live; i++) {
        await idle()
        if (!live) return
        await loadCourse(courseMetas[i]!.id).catch(() => undefined)
        if (live) setReady(i + 1)
      }
    })()
    return () => {
      live = false
    }
  }, [])
  return (
    <div>
      <PageHeader emoji="🎓" title="Learning" subtitle="Corsi a moduli: lezione, quiz, flashcard e pratica a voce." />
      <div className="mb-4">
        <SyncCard sync={sync} />
      </div>
      {courseMetas.length === 0 ? <EmptyState emoji="🎓" title="No courses yet" /> : <CourseGroups />}
    </div>
  )
}

export function Learning() {
  return (
    <Routes>
      <Route index element={<CourseList />} />
      {/* Static segment: ranks above :courseId. */}
      <Route
        path="vocabolario/*"
        element={
          <Suspense fallback={<CourseLoading />}>
            <VocabPage />
          </Suspense>
        }
      />
      <Route path=":courseId" element={<CoursePage />} />
      {/* Static segment: ranks above :moduleId, so no module can shadow it. */}
      <Route path=":courseId/diario" element={<DiaryPage />} />
      <Route path=":courseId/:moduleId" element={<ModulePage />} />
    </Routes>
  )
}
