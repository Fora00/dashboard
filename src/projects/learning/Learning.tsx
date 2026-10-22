import { Link, Route, Routes } from 'react-router-dom'
import { Card } from '../../components/Card'
import { EmptyState } from '../../components/EmptyState'
import { PageHeader } from '../../components/PageHeader'
import { SyncCard } from '../../components/SyncCard'
import { sync } from '../../lib/learningSync'
import { courses } from './courses'
import { CoursePage } from './CoursePage'
import { ModulePage } from './ModulePage'
import { ProgressBar } from './ProgressBar'
import { courseProgress } from './progress'
import { useCourseState } from './store'
import type { Course } from './types'

function CourseCard({ course }: { course: Course }) {
  const state = useCourseState(course.id)
  const p = state ? courseProgress(course, state) : null
  return (
    <Link to={course.id} className="block rounded-xl focus-visible:outline-none">
      <Card className="flex flex-col gap-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-medium">
            <span className="mr-2">{course.emoji}</span>
            {course.title}
          </h2>
          <span className="text-sm text-slate-500 tabular-nums">{p?.percent ?? 0}%</span>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{course.summary}</p>
        <ProgressBar percent={p?.percent ?? 0} label={`${course.title}: progresso`} />
        <p className="text-xs text-slate-500">{course.modules.length} moduli</p>
      </Card>
    </Link>
  )
}

function CourseList() {
  return (
    <div>
      <PageHeader emoji="🎓" title="Learning" subtitle="Corsi a moduli: lezione, quiz, flashcard e pratica a voce." />
      <div className="mb-4">
        <SyncCard sync={sync} />
      </div>
      {courses.length === 0 ? (
        <EmptyState emoji="🎓" title="No courses yet" />
      ) : (
        <div className="flex flex-col gap-3">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} />
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
      <Route path=":courseId/:moduleId" element={<ModulePage />} />
    </Routes>
  )
}
