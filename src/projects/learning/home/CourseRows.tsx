// Compact course rows grouped by area (Sviluppo, Creatività, Lingue); the long summary lives on the course page.
import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../../../components/Card'
import { FOCUS_RING_INSET } from '../../../components/focus'
import { usePersistedState } from '../../../lib/safeStorage'
import { courseGroups, courseMetas, loadedCourse, type CourseGroupId, type CourseMeta } from '../courses/registry'
import { courseProgress } from '../engine/progress'
import { useCourseState } from '../engine/store'
import { loadAllThemes, loadedThemes, visibleThemes } from '../vocab/index'

/** "Spagnolo: da A1 a B2" -> name "Spagnolo", detail "da A1 a B2". */
export function splitTitle(title: string): { name: string; detail: string } {
  const i = title.indexOf(':')
  return i < 0 ? { name: title, detail: '' } : { name: title.slice(0, i).trim(), detail: title.slice(i + 1).trim() }
}

const rowCls = `flex min-h-14 items-center gap-3 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 ${FOCUS_RING_INSET}`

function CourseRow({ meta }: { meta: CourseMeta }) {
  const course = loadedCourse(meta.id)
  const state = useCourseState(meta.id)
  const percent = course && state ? courseProgress(course, state).percent : 0
  const { name, detail } = splitTitle(meta.title)
  return (
    <Link to={meta.id} className={rowCls}>
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

function VocabRow() {
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
    <Link to="vocabolario" className={rowCls}>
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
const groupExtras: Partial<Record<CourseGroupId, ReactNode>> = { lingue: <VocabRow /> }

const COLLAPSED_KEY = 'learning.collapsedGroups'
const asIdList = (raw: unknown): string[] =>
  Array.isArray(raw) ? raw.filter((x): x is string => typeof x === 'string') : []

export function CourseGroups() {
  // Per-device convenience: which sections are folded (all open by default).
  const [collapsed, setCollapsed] = usePersistedState<string[]>(COLLAPSED_KEY, [], asIdList)
  const toggle = (id: string) =>
    setCollapsed(collapsed.includes(id) ? collapsed.filter((x) => x !== id) : [...collapsed, id])
  return (
    <div className="flex flex-col gap-4">
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
              <Card id={panelId} className="mt-1 divide-y divide-slate-200 overflow-hidden p-0! dark:divide-slate-800">
                {metas.map((m) => (
                  <CourseRow key={m.id} meta={m} />
                ))}
                {extra}
              </Card>
            )}
          </section>
        )
      })}
    </div>
  )
}
