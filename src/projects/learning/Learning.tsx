import { useEffect, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { Card } from '../../components/Card'
import { EmptyState } from '../../components/EmptyState'
import { PageHeader } from '../../components/PageHeader'
import { SyncCard } from '../../components/SyncCard'
import { sync } from '../../lib/learningSync'
import { courseMetas, loadCourse, loadedCourse, type CourseMeta } from './courses/registry'
import { CoursePage } from './CoursePage'
import { DiaryPage } from './DiaryPage'
import { ModulePage } from './ModulePage'
import { ProgressBar } from './ProgressBar'
import { courseProgress } from './progress'
import { useCourseState, useResume } from './store'

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
          <h2 className="font-medium">
            <span className="mr-2">{meta.emoji}</span>
            {meta.title}
          </h2>
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
      {courseMetas.length === 0 ? (
        <EmptyState emoji="🎓" title="No courses yet" />
      ) : (
        <div className="flex flex-col gap-3">
          {courseMetas.map((m) => (
            <CourseCard key={m.id} meta={m} />
          ))}
        </div>
      )}
    </div>
  )
}

export function Learning() {
  return (
    <Routes>
      <Route index element={<CourseList />} />
      <Route path=":courseId" element={<CoursePage />} />
      {/* Static segment: ranks above :moduleId, so no module can shadow it. */}
      <Route path=":courseId/diario" element={<DiaryPage />} />
      <Route path=":courseId/:moduleId" element={<ModulePage />} />
    </Routes>
  )
}
