import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Link, useParams } from 'react-router-dom'
import { EmptyState } from '../../components/EmptyState'
import { courseSketches } from '../../lib/learningLocal'
import { courseById } from './courses'
import { NotFound } from './NotFound'
import { courseHasChecklist } from './progress'
import { SketchThumb, SketchViewer } from './Sketches'
import type { Course } from './types'

/** Every photo of a course's sheets, oldest first: watch the hand improve. Local-only. */
function DiaryView({ course }: { course: Course }) {
  const sketches = useLiveQuery(() => courseSketches(course.id), [course.id])
  const [openId, setOpenId] = useState<string | null>(null)
  const label = (moduleId: string, itemId: string) => {
    const m = course.modules.find((x) => x.id === moduleId)
    if (!m) return undefined
    const n = m.practice.findIndex((p) => p.id === itemId)
    return n >= 0 ? `${m.title} · es. ${n + 1}` : m.title
  }
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Link
          to={`/learning/${course.id}`}
          className="mb-3 inline-block text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        >
          ← {course.title}
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Diario</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Le foto dei tuoi fogli, dalla più vecchia. Restano solo su questo dispositivo.
        </p>
      </div>
      {sketches === undefined ? null : sketches.length === 0 ? (
        <EmptyState
          emoji="📷"
          title="Ancora nessuna foto"
          hint="Negli esercizi di pratica, tocca 'Foto del foglio' dopo aver disegnato."
        />
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {sketches.map((s) => (
            <li key={s.id}>
              <SketchThumb sketch={s} caption={label(s.moduleId, s.itemId)} onOpen={() => setOpenId(s.id)} />
            </li>
          ))}
        </ul>
      )}
      <SketchViewer sketch={sketches?.find((s) => s.id === openId)} onClose={() => setOpenId(null)} />
    </div>
  )
}

export function DiaryPage() {
  const { courseId } = useParams()
  const course = courseId ? courseById(courseId) : undefined
  return course && courseHasChecklist(course) ? <DiaryView course={course} /> : <NotFound what="Diario" />
}
