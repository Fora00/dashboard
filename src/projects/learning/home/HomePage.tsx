// The Learning home: Oggi (continue + Ripasso), search across courses, the areas; sync status at the bottom.
// Two taps to a course: area (/learning/<groupId>) then course; Continua covers the usual case in one.
import { useState } from 'react'
import { EmptyState } from '../../../components/EmptyState'
import { FOCUS_RING_FIELD } from '../../../components/focus'
import { PageHeader } from '../../../components/PageHeader'
import { SyncCard } from '../../../components/SyncCard'
import { sync } from '../../../lib/learningSync'
import { courseMetas } from '../courses/registry'
import { GroupTiles } from './CourseRows'
import { OfflineDownload } from './OfflineDownload'
import { SearchResults } from './SearchResults'
import { TodayBlock } from './TodayBlock'
import { useLoadCourses } from './useLoadCourses'

const ALL_IDS = courseMetas.map((m) => m.id)

export function HomePage() {
  const [query, setQuery] = useState('')
  const searching = query.trim() !== ''
  const ready = useLoadCourses(ALL_IDS, searching)
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
          {searching ? <SearchResults query={query} ready={ready} /> : <GroupTiles />}
        </div>
      )}
      <div className="mt-8 flex flex-col gap-4">
        <OfflineDownload />
        <SyncCard sync={sync} />
      </div>
    </div>
  )
}
