// "Oggi" at the top of the Learning home: pick up where you left off (any course, any device) + Ripasso.
import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../../../components/Card'
import { FOCUS_RING_INSET } from '../../../components/focus'
import { db } from '../../../lib/db'
import { courseMetaById, loadCourse, loadedCourse } from '../courses/registry'
import { today, useQueue } from '../review/useQueue'

const TAB_LABEL = { lesson: 'lezione', quiz: 'quiz', cards: 'flashcard', practice: 'pratica' } as const

function Row({
  to,
  icon,
  title,
  sub,
  badge,
}: {
  to: string
  icon: string
  title: string
  sub: string
  badge?: ReactNode
}) {
  return (
    <Link
      to={to}
      className={`flex min-h-14 items-center gap-3 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 ${FOCUS_RING_INSET}`}
    >
      <span className="text-xl" aria-hidden>
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium">{title}</span>
        <span className="block truncate text-sm text-slate-500 dark:text-slate-400">{sub}</span>
      </span>
      {badge}
      <span aria-hidden className="text-slate-400">
        ›
      </span>
    </Link>
  )
}

/** The most recently opened module across all courses (synced), with its title once the course chunk loads. */
function useLastPosition() {
  const last = useLiveQuery(async () => {
    const all = await db.learningPosition.toArray()
    return all.filter((p) => courseMetaById(p.courseId)).sort((a, b) => b.updatedAt - a.updatedAt)[0] ?? null
  }, [])
  const [, setLoaded] = useState(0)
  useEffect(() => {
    if (!last || loadedCourse(last.courseId)) return
    let live = true
    void loadCourse(last.courseId)
      .catch(() => undefined)
      .then(() => live && setLoaded((n) => n + 1))
    return () => {
      live = false
    }
  }, [last])
  return last
}

export function TodayBlock() {
  const [day] = useState(today)
  const q = useQueue(day)
  const last = useLastPosition()
  const n = q?.items.length ?? 0
  const meta = last ? courseMetaById(last.courseId) : undefined
  const mod = last ? loadedCourse(last.courseId)?.modules.find((m) => m.id === last.moduleId) : undefined
  return (
    <section aria-labelledby="learning-oggi">
      <h2
        id="learning-oggi"
        className="mb-2 px-1 text-sm font-semibold tracking-wide text-slate-600 uppercase dark:text-slate-300"
      >
        Oggi
      </h2>
      <Card className="divide-y divide-slate-200 overflow-hidden p-0! dark:divide-slate-800">
        {last && meta && (
          <Row
            to={`/learning/${last.courseId}/${last.moduleId}?tab=${last.tab}`}
            icon="▶️"
            title={`Continua: ${mod?.title ?? '…'}`}
            sub={`${meta.emoji} ${meta.title.split(':')[0]} · ${TAB_LABEL[last.tab]}`}
          />
        )}
        <Row
          to="/learning/ripasso"
          icon="🔁"
          title="Ripasso"
          sub={
            !q
              ? '…'
              : n > 0
                ? `${n} da ripassare oggi`
                : q.doneToday > 0
                  ? `Fatto per oggi ✓ (${q.doneToday})`
                  : 'Niente da ripassare oggi'
          }
          badge={
            n > 0 ? (
              <span className="rounded-full bg-(color:--accent) px-2.5 py-0.5 text-sm font-semibold text-(color:--accent-fg) tabular-nums">
                {n}
              </span>
            ) : undefined
          }
        />
      </Card>
    </section>
  )
}
