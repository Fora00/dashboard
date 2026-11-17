import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { Card } from '../../components/Card'
import { FOCUS_RING_FIELD } from '../../components/focus'
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
import ReviewPage, { ReviewHomeCard } from './ReviewPage'
import { countCourseHits, searchCourses, type CourseHit } from './courseSearch'
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

const KIND_LABEL: Record<CourseHit['kind'], string> = {
  module: 'Modulo',
  section: 'Lezione',
  lesson: 'Lezione',
  quiz: 'Quiz',
  card: 'Flashcard',
  practice: 'Pratica',
}

const hitLink = (h: CourseHit) =>
  `${h.course.id}/${h.module.id}?tab=${h.tab}${h.section === undefined ? '' : `&sec=${h.section}`}`

function SearchResults({ query, ready }: { query: string; ready: number }) {
  // Courses already loaded (all of them once `ready` reaches the total).
  const loaded = courseMetas.map((m) => loadedCourse(m.id)).filter((c) => c !== undefined)
  const hits = searchCourses(loaded, query)
  const total = hits.length < 60 ? hits.length : countCourseHits(loaded, query)
  const loading = ready < courseMetas.length
  return (
    <div className="flex flex-col gap-2" aria-live="polite">
      <p className="text-sm text-slate-500">
        {query.trim().length < 2
          ? 'Scrivi almeno 2 lettere.'
          : `${total} risultati${total > hits.length ? ` (primi ${hits.length})` : ''}${loading ? ` · carico i corsi ${ready}/${courseMetas.length}…` : ''}`}
      </p>
      <ul className="flex flex-col gap-2">
        {hits.map((h, i) => (
          <li key={i}>
            <Link to={hitLink(h)} className="block rounded-xl focus-visible:outline-none">
              <Card className="flex flex-col gap-1 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
                <p className="text-xs text-slate-500">
                  {h.course.emoji} {h.course.title} · {h.module.title} · {KIND_LABEL[h.kind]}
                </p>
                <p className="text-sm font-medium">{h.label}</p>
                {h.snippet && (
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {h.snippet.before}
                    <mark className="rounded bg-amber-100 px-0.5 text-inherit dark:bg-amber-500/30">
                      {h.snippet.match}
                    </mark>
                    {h.snippet.after}
                  </p>
                )}
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CourseList() {
  const [query, setQuery] = useState('')
  const searching = query.trim() !== ''
  const [ready, setReady] = useState(0)
  useEffect(() => {
    let live = true
    void (async () => {
      for (let i = 0; i < courseMetas.length && live; i++) {
        if (!searching) await idle()
        if (!live) return
        await loadCourse(courseMetas[i]!.id).catch(() => undefined)
        if (live) setReady(i + 1)
      }
    })()
    return () => {
      live = false
    }
    // Restarts (without the idle waits) once a search begins; loaded chunks resolve at once.
  }, [searching])
  return (
    <div>
      <PageHeader emoji="🎓" title="Learning" subtitle="Corsi a moduli: lezione, quiz, flashcard e pratica a voce." />
      <div className="mb-4">
        <SyncCard sync={sync} />
      </div>
      {courseMetas.length === 0 ? (
        <EmptyState emoji="🎓" title="No courses yet" />
      ) : (
        <div className="flex flex-col gap-4">
          <ReviewHomeCard />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca in tutti i corsi"
            aria-label="Cerca in tutti i corsi"
            className={`min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-base dark:border-slate-700 dark:bg-slate-800 ${FOCUS_RING_FIELD}`}
          />
          {searching ? <SearchResults query={query} ready={ready} /> : <CourseGroups />}
        </div>
      )}
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
      <Route path="ripasso" element={<ReviewPage />} />
      <Route path=":courseId" element={<CoursePage />} />
      {/* Static segment: ranks above :moduleId, so no module can shadow it. */}
      <Route path=":courseId/diario" element={<DiaryPage />} />
      <Route path=":courseId/:moduleId" element={<ModulePage />} />
    </Routes>
  )
}
