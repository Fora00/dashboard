// Search results across every course (engine/courseSearch.ts); a hit opens the module at its tab/section.
import { Link } from 'react-router-dom'
import { Card } from '../../../components/Card'
import { courseMetas, loadedCourse } from '../courses/registry'
import { countCourseHits, searchCourses, type CourseHit } from '../engine/courseSearch'

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

export function SearchResults({ query, ready }: { query: string; ready: number }) {
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
