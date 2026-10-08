import { useMemo, type ReactNode } from 'react'
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
import { ProgressAside } from './ProgressAside'
import { useSections } from './useSections'

// Week body (shared by the current week and read-only History). Sections are
// collapsible (per-device preference, see useSections.ts).

interface WeekBodyProps {
  week: string
  plan: LifePlan
  entries: LifeEntry[]
  readOnly: boolean
  /** On a read-only past week: the Sunday check and check-ins still take
   *  answers (last week, until Tuesday — see lateEdit.ts). */
  lateEdit?: boolean
}

/** Keeps the phone's single-column order (`order-N`, the grandchildren of the
 * `contents` columns being flex items of the root) and drops it from `lg`,
 * where the columns take over. */
function Slot({ n, children }: { n: number; children: ReactNode }) {
  return (
    <div style={{ order: n }} className="lg:order-none!">
      {children}
    </div>
  )
}

export function WeekBody({ week, plan, entries, readOnly, lateEdit = false }: WeekBodyProps) {
  const summary = useMemo(() => summarizeWeek(plan, entries), [plan, entries])
  // The meal diary's entries for this week (read-only here), live.
  const meals = useLiveQuery(() => db.meals.where('day').between(week, addDays(week, 6), true, true).toArray(), [week])
  const food = useMemo(() => summarizeMealsWeek(meals ?? [], week), [meals, week])
  const { pending, trigger, confirmUndo } = useUndoSnackbar()
  const { sections, sundayOpen, toggleSection, toggleSunday } = useSections(week, readOnly)
  // Sunday answers and check-ins: editable on the live week, or late.
  const answersReadOnly = readOnly && !lateEdit
  const sentCount = plan.tasks.filter((t) => summary.sentTaskIds.has(t.id)).length

  // Phone: one column in this order. From lg: 2 columns (xl: 3) — focus +
  // trackers | Things + check-ins + Sunday | food + export + progress chart.
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-6 xl:grid-cols-3">
      <div className="contents lg:block">
        {plan.focus.length > 0 && (
          <Slot n={1}>
            <FocusSection
              week={week}
              focus={plan.focus}
              focusDone={summary.focusDone}
              open={sections.focus}
              onToggle={() => toggleSection('focus')}
              readOnly={readOnly}
            />
          </Slot>
        )}

        {plan.trackers.length > 0 && (
          <Slot n={2}>
            <TrackersSection
              week={week}
              trackers={summary.trackers}
              open={sections.trackers}
              onToggle={() => toggleSection('trackers')}
              readOnly={readOnly}
              trigger={trigger}
            />
          </Slot>
        )}

        {plan.rules.length > 0 && (
          <Slot n={3}>
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
          </Slot>
        )}
      </div>

      <div className="contents lg:block">
        {!readOnly && plan.tasks.length > 0 && (
          <Slot n={6}>
            <ThingsSection
              week={week}
              plan={plan}
              entries={entries}
              summary={summary}
              open={sections.things}
              onToggle={() => toggleSection('things')}
            />
          </Slot>
        )}

        {summary.checkins.length > 0 && (
          <Slot n={4}>
            <CollapsibleSection
              title="Check-ins"
              summary={`Check-ins · ${summary.checkins.filter((c) => c.done).length}/${summary.checkins.length} done`}
              open={sections.checkins}
              onToggle={() => toggleSection('checkins')}
              readOnly={readOnly}
            >
              <ul className="space-y-2">
                {summary.checkins.map((cs) => (
                  <CheckinRow key={cs.checkin.id} week={week} status={cs} readOnly={answersReadOnly} />
                ))}
              </ul>
            </CollapsibleSection>
          </Slot>
        )}

        {plan.sundayCheck.length > 0 && (
          <Slot n={5}>
            <SundaySection
              week={week}
              plan={plan}
              summary={summary}
              tasksSent={sentCount}
              open={sundayOpen}
              onToggle={toggleSunday}
              readOnly={readOnly}
              editable={!answersReadOnly}
            />
          </Slot>
        )}
      </div>

      <div className="contents lg:col-span-2 lg:block xl:col-span-1">
        <Slot n={7}>
          <FoodSection
            week={week}
            food={food}
            open={sections.food}
            onToggle={() => toggleSection('food')}
            readOnly={readOnly}
          />
        </Slot>

        <Slot n={8}>
          <ExportSection
            plan={plan}
            entries={entries}
            meals={meals ?? []}
            open={sections.export}
            onToggle={() => toggleSection('export')}
            readOnly={readOnly}
          />
        </Slot>

        {/* Wide screens only: the progress chart History has, beside the week. */}
        {!readOnly && (
          <div className="hidden lg:block lg:max-w-md xl:max-w-none">
            <ProgressAside week={week} />
          </div>
        )}
      </div>

      {!readOnly && pending && <Snackbar label={pending.label} onUndo={confirmUndo} />}
    </div>
  )
}
