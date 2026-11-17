// The Learning home: Oggi (continue + Ripasso), search across courses, course groups; sync status at the bottom.
import { useEffect, useState } from 'react'
import { EmptyState } from '../../../components/EmptyState'
import { FOCUS_RING_FIELD } from '../../../components/focus'
import { PageHeader } from '../../../components/PageHeader'
import { SyncCard } from '../../../components/SyncCard'
import { sync } from '../../../lib/learningSync'
import { courseMetas, loadCourse } from '../courses/registry'
import { CourseGroups } from './CourseRows'
import { SearchResults } from './SearchResults'
import { TodayBlock } from './TodayBlock'

// Course content is lazy (own chunk per course). The list shows the lightweight meta at once and
// fills in the progress percentages as chunks arrive, one at a time while the browser is idle
// (all at once while searching).
const idle = () =>
  new Promise<void>((resolve) => {
    if (typeof requestIdleCallback === 'function') requestIdleCallback(() => resolve())
    else setTimeout(resolve, 200)
  })

export function HomePage() {
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
      <PageHeader emoji="🎓" title="Learning" subtitle="Lezioni, quiz, flashcard e ripasso, anche offline." />
      {courseMetas.length === 0 ? (
        <EmptyState emoji="🎓" title="Nessun corso" />
      ) : (
        <div className="flex flex-col gap-5">
          <TodayBlock />
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
      <div className="mt-8">
        <SyncCard sync={sync} />
      </div>
    </div>
  )
}
