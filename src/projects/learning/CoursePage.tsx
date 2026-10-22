import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { courseById } from './courses'
import { NotFound } from './NotFound'
import { ProgressBar } from './ProgressBar'
import { courseProgress, EMPTY_STATE } from './progress'
import { resetCourse } from '../../lib/learningSync'
import { useCourseState } from './store'
import type { Course } from './types'

function ResetCourse({ course }: { course: Course }) {
  const [armed, setArmed] = useState(false)
  return armed ? (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="danger"
        onClick={() => {
          void resetCourse(course.id)
          setArmed(false)
        }}
      >
        Conferma: azzera tutto
      </Button>
      <Button variant="ghost" onClick={() => setArmed(false)}>
        Annulla
      </Button>
    </div>
  ) : (
    <Button variant="ghost" onClick={() => setArmed(true)}>
      Azzera i progressi
    </Button>
  )
}

function CourseView({ course }: { course: Course }) {
  const state = useCourseState(course.id) ?? EMPTY_STATE
  const progress = courseProgress(course, state)
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          to="/learning"
          className="mb-3 inline-block text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        >
          ← Learning
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">
          <span className="mr-2">{course.emoji}</span>
          {course.title}
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{course.intro}</p>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1">
            <ProgressBar percent={progress.percent} label="Progresso complessivo" />
          </div>
          <span className="text-sm text-slate-500 tabular-nums">
            {progress.percent}% · {progress.done}/{progress.total}
          </span>
        </div>
        {course.notes?.map((n) => (
          <p key={n} className="mt-3 text-xs text-slate-500">
            {n}
          </p>
        ))}
      </div>

      {course.groups.map((g) => {
        const mods = course.modules.filter((m) => (m.group ?? course.groups[0]?.id) === g.id)
        if (mods.length === 0) return null
        return (
          <section key={g.id} aria-labelledby={`g-${g.id}`}>
            <h2 id={`g-${g.id}`} className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">
              {g.label}
            </h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {mods.map((m) => {
                const p = progress.modules[m.id]
                return (
                  <li key={m.id}>
                    <Link
                      to={`/learning/${course.id}/${m.id}`}
                      className="block h-full rounded-xl focus-visible:outline-none"
                    >
                      <Card className="flex h-full min-h-10 flex-col gap-1.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
                        <div className="flex items-start justify-between gap-2">
                          <strong className="font-medium">{m.title}</strong>
                          <span className="text-sm text-slate-500 tabular-nums">{p?.percent ?? 0}%</span>
                        </div>
                        <span className="text-sm text-slate-500 dark:text-slate-400">{m.subtitle}</span>
                        {m.verify && (
                          <span className="w-fit rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-500/20 dark:text-amber-300">
                            ⚠ da verificare
                          </span>
                        )}
                        <ProgressBar percent={p?.percent ?? 0} label={`${m.title}: progresso`} />
                      </Card>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}

      {course.references?.map((r) => (
        <p key={r.path} className="text-xs text-slate-500">
          <strong>{r.label}:</strong> <code>{r.path}</code>
          {r.note && <> — {r.note}</>}
        </p>
      ))}

      <div>
        <ResetCourse course={course} />
      </div>
    </div>
  )
}

export function CoursePage() {
  const { courseId } = useParams()
  const course = courseId ? courseById(courseId) : undefined
  return course ? <CourseView course={course} /> : <NotFound what="Course" />
}
