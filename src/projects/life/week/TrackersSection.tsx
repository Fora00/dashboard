import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type LifeStreakEntry, type LifeTrackerEntry } from '../../../lib/db'
import { removeTrackerEntry, restoreEntry } from '../../../lib/lifeSync'
import { trackersSummary } from '../format'
import { addDays, type TrackerSummary } from '../model'
import { useToday } from '../useToday'
import { CollapsibleSection } from './CollapsibleSection'
import { StreakRow } from './StreakRow'
import { TrackerRow, type LastSunday } from './TrackerRow'
import { runSafe } from '../../../lib/runSafe'

export function TrackersSection({
  week,
  trackers,
  streaks = [],
  open,
  onToggle,
  readOnly,
  trigger,
}: {
  week: string
  trackers: TrackerSummary[]
  /** Streaks-app habits (read-only snapshot), shown under the trackers. */
  streaks?: readonly LifeStreakEntry[]
  open: boolean
  onToggle: () => void
  readOnly: boolean
  /** Undo snackbar trigger (useUndoSnackbar). */
  trigger: (label: string, undo: () => void | Promise<void>) => void
}) {
  const [energyPromptId, setEnergyPromptId] = useState<string | null>(null)

  // On Monday, yesterday belongs to last week: habits can still mark last
  // Sunday, written to last week's entries under last week's tracker (same
  // id, e.g. via "Copy last week", else same label).
  const today = useToday()
  const isMonday = !readOnly && today === week
  const prevWeek = addDays(week, -7)
  const prev = useLiveQuery(async () => {
    if (!isMonday) return null
    const [row, prevEntries] = await Promise.all([
      db.lifeWeeks.get(prevWeek),
      db.lifeEntries.where('[week+kind]').equals([prevWeek, 'tracker']).toArray(),
    ])
    return row ? { plan: row.plan, entries: prevEntries as LifeTrackerEntry[] } : null
  }, [isMonday, prevWeek])

  function lastSundayFor(trackerId: string, label: string): LastSunday | null {
    if (!prev) return null
    const match =
      prev.plan.trackers.find((t) => t.id === trackerId) ??
      prev.plan.trackers.find((t) => t.label.trim().toLowerCase() === label.trim().toLowerCase())
    if (!match) return null
    const day = addDays(week, -1)
    return {
      week: prevWeek,
      trackerId: match.id,
      day,
      entries: prev.entries.filter((e) => e.ref === match.id && e.day === day),
    }
  }

  return (
    <CollapsibleSection
      title="Habits"
      summary={`Habits · ${trackersSummary(trackers)}${streaks.length ? ` · 🔥 ${streaks.length} in Streaks` : ''}`}
      open={open}
      onToggle={onToggle}
      readOnly={readOnly}
    >
      <ul className="space-y-2">
        {trackers.map((ts) => (
          <TrackerRow
            key={ts.tracker.id}
            ts={ts}
            week={week}
            readOnly={readOnly}
            energyPromptId={energyPromptId}
            setEnergyPromptId={setEnergyPromptId}
            lastSunday={lastSundayFor(ts.tracker.id, ts.tracker.label)}
            onLogged={(entry) => trigger(`✓ ${ts.tracker.label}`, () => removeTrackerEntry(entry.id))}
            onRemove={(entry) => {
              if (energyPromptId === entry.id) setEnergyPromptId(null)
              void runSafe(removeTrackerEntry, 'Could not remove')(entry.id)
              trigger(`Removed ${ts.tracker.label}`, () => restoreEntry(entry))
            }}
          />
        ))}
      </ul>
      {streaks.length > 0 && (
        <ul
          className={`space-y-2 ${trackers.length ? 'mt-3' : ''}`}
          aria-label="Streaks habits (logged in the Streaks app)"
        >
          {streaks.map((e) => (
            <StreakRow key={e.id} entry={e} today={today} />
          ))}
        </ul>
      )}
    </CollapsibleSection>
  )
}
