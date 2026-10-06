import { useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type LifeEntry, type LifePlan } from '../../../lib/db'
import { summarizeMealsWeek, summarizeWeek } from '../model'
import { addDays } from '../model/dates.ts'
import { useUndoSnackbar } from '../../../lib/useUndoSnackbar'
import { Snackbar } from '../../../components/Snackbar'
import { CheckinRow } from './CheckinRow'
import { CollapsibleSection } from './CollapsibleSection'
import { ExportSection } from './ExportSection'
import { FocusSection } from './FocusSection'
import { FoodSection } from './FoodSection'
import { SundaySection } from './SundaySection'
import { ThingsSection } from './ThingsSection'
import { TrackersSection } from './TrackersSection'
import { useSections } from './useSections'

// Week body (shared by the current week and read-only History). Sections are
// collapsible (per-device preference, see useSections.ts).

interface WeekBodyProps {
  week: string
  plan: LifePlan
  entries: LifeEntry[]
  readOnly: boolean
}

export function WeekBody({ week, plan, entries, readOnly }: WeekBodyProps) {
  const summary = useMemo(() => summarizeWeek(plan, entries), [plan, entries])
  // The meal diary's entries for this week (read-only here), live.
  const meals = useLiveQuery(() => db.meals.where('day').between(week, addDays(week, 6), true, true).toArray(), [week])
  const food = useMemo(() => summarizeMealsWeek(meals ?? [], week), [meals, week])
  const { pending, trigger, confirmUndo } = useUndoSnackbar()
  const { sections, sundayOpen, toggleSection, toggleSunday } = useSections(week, readOnly)
  const sentCount = plan.tasks.filter((t) => summary.sentTaskIds.has(t.id)).length

  return (
    <div>
      {plan.focus.length > 0 && (
        <FocusSection
          week={week}
          focus={plan.focus}
          focusDone={summary.focusDone}
          open={sections.focus}
          onToggle={() => toggleSection('focus')}
          readOnly={readOnly}
        />
      )}

      {plan.trackers.length > 0 && (
        <TrackersSection
          week={week}
          trackers={summary.trackers}
          open={sections.trackers}
          onToggle={() => toggleSection('trackers')}
          readOnly={readOnly}
          trigger={trigger}
        />
      )}

      {plan.rules.length > 0 && (
        <CollapsibleSection
          title="📜 Rules"
          summary={`${plan.rules.length} rule${plan.rules.length === 1 ? '' : 's'}`}
          open={sections.rules}
          onToggle={() => toggleSection('rules')}
          readOnly={readOnly}
        >
          <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
            {plan.rules.map((r, i) => (
              <li key={i}>• {r}</li>
            ))}
          </ul>
        </CollapsibleSection>
      )}

      {summary.checkins.length > 0 && (
        <CollapsibleSection
          title="Check-ins"
          summary={`Check-ins · ${summary.checkins.filter((c) => c.done).length}/${summary.checkins.length} done`}
          open={sections.checkins}
          onToggle={() => toggleSection('checkins')}
          readOnly={readOnly}
        >
          <ul className="space-y-2">
            {summary.checkins.map((cs) => (
              <CheckinRow key={cs.checkin.id} week={week} status={cs} readOnly={readOnly} />
            ))}
          </ul>
        </CollapsibleSection>
      )}

      {plan.sundayCheck.length > 0 && (
        <SundaySection
          week={week}
          plan={plan}
          summary={summary}
          tasksSent={sentCount}
          open={sundayOpen}
          onToggle={toggleSunday}
          readOnly={readOnly}
        />
      )}

      {!readOnly && plan.tasks.length > 0 && (
        <ThingsSection
          week={week}
          plan={plan}
          entries={entries}
          summary={summary}
          open={sections.things}
          onToggle={() => toggleSection('things')}
        />
      )}

      <FoodSection
        week={week}
        food={food}
        open={sections.food}
        onToggle={() => toggleSection('food')}
        readOnly={readOnly}
      />

      <ExportSection
        plan={plan}
        entries={entries}
        meals={meals ?? []}
        open={sections.export}
        onToggle={() => toggleSection('export')}
        readOnly={readOnly}
      />

      {!readOnly && pending && <Snackbar label={pending.label} onUndo={confirmUndo} />}
    </div>
  )
}
