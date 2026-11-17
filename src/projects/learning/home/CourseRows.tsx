// Compact rows: the areas on the Learning home, the courses on an area's page (long summaries live on the course page).
import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../../../components/Card'
import { FOCUS_RING_INSET } from '../../../components/focus'
import { courseGroups, courseMetas, loadedCourse, type CourseGroupId, type CourseMeta } from '../courses/registry'
import { courseProgress } from '../engine/progress'
import { useCourseState } from '../engine/store'
import { loadAllThemes, loadedThemes, visibleThemes } from '../vocab/index'

/** "Spagnolo: da A1 a B2" -> name "Spagnolo", detail "da A1 a B2". */
function splitTitle(title: string): { name: string; detail: string } {
  const i = title.indexOf(':')
  return i < 0 ? { name: title, detail: '' } : { name: title.slice(0, i).trim(), detail: title.slice(i + 1).trim() }
}

const rowCls = `flex min-h-14 items-center gap-3 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 ${FOCUS_RING_INSET}`

export function CourseRow({ meta }: { meta: CourseMeta }) {
  const course = loadedCourse(meta.id)
  const state = useCourseState(meta.id)
  const percent = course && state ? courseProgress(course, state).percent : 0
  const { name, detail } = splitTitle(meta.title)
  return (
    <Link to={`/learning/${meta.id}`} className={rowCls}>
      <span className="w-7 text-center text-xl" aria-hidden>
        {meta.emoji}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium">{name}</span>
        <span className="block truncate text-sm text-slate-500 dark:text-slate-400">
          {detail || `${meta.moduleCount} moduli`}
        </span>
      </span>
      <span className="flex w-12 shrink-0 flex-col items-end gap-1" aria-label={`${percent}% completato`}>
        <span className="text-sm text-slate-500 tabular-nums">{percent}%</span>
        <span className="h-1 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700" aria-hidden>
          <span className="block h-full bg-(color:--accent)" style={{ width: `${percent}%` }} />
        </span>
      </span>
    </Link>
  )
}

export function VocabRow() {
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
  const words = themes?.reduce((n, t) => n + t.words.length, 0)
  return (
    <Link to="/learning/vocabolario" className={rowCls}>
      <span className="w-7 text-center text-xl" aria-hidden>
        🗂️
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium">Vocabolario</span>
        <span className="block truncate text-sm text-slate-500 dark:text-slate-400">
          es · fr · de · ru · {visibleThemes(themes).length} temi{words === undefined ? '' : ` · ${words} parole`}
        </span>
      </span>
      <span aria-hidden className="text-slate-400">
        ›
      </span>
    </Link>
  )
}

// Extra rows at the end of a group (not courses).
const groupExtras: Partial<Record<CourseGroupId, { node: ReactNode; name: string }>> = {
  lingue: { node: <VocabRow />, name: 'Vocabolario' },
}

/** One area's rows (its page, /learning/<groupId>). */
export function GroupRows({ groupId }: { groupId: CourseGroupId }) {
  const metas = courseMetas.filter((m) => m.group === groupId)
  return (
    <Card className="divide-y divide-slate-200 overflow-hidden p-0! dark:divide-slate-800">
      {metas.map((m) => (
        <CourseRow key={m.id} meta={m} />
      ))}
      {groupExtras[groupId]?.node}
    </Card>
  )
}

/** The areas on the Learning home: one row each, opening the area's page. */
export function GroupTiles() {
  return (
    <section aria-labelledby="learning-aree">
      <h2
        id="learning-aree"
        className="mb-2 px-1 text-sm font-semibold tracking-wide text-slate-600 uppercase dark:text-slate-300"
      >
        Aree
      </h2>
      <Card className="divide-y divide-slate-200 overflow-hidden p-0! dark:divide-slate-800">
        {courseGroups.map((g) => {
          const names = [
            ...courseMetas.filter((m) => m.group === g.id).map((m) => splitTitle(m.title).name),
            ...(groupExtras[g.id] ? [groupExtras[g.id]!.name] : []),
          ]
          if (names.length === 0) return null
          return (
            <Link key={g.id} to={`/learning/${g.id}`} className={rowCls}>
              <span className="w-7 text-center text-xl" aria-hidden>
                {g.emoji}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{g.title}</span>
                <span className="block truncate text-sm text-slate-500 dark:text-slate-400">{names.join(' · ')}</span>
              </span>
              <span className="text-sm text-slate-500 tabular-nums">{names.length}</span>
              <span aria-hidden className="text-slate-400">
                ›
              </span>
            </Link>
          )
        })}
      </Card>
    </section>
  )
}
