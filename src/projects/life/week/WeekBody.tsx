import { useMemo, useState, type ReactNode } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type LifeEntry, type LifePlan } from '../../../lib/db'
import { summarizeLearningWeek, summarizeMealsWeek, summarizeWeek } from '../model'
import { courses } from '../../learning/courses'
import { addDays } from '../model/dates.ts'
import { useUndoSnackbar } from '../../../lib/useUndoSnackbar'
import { Snackbar } from '../../../components/Snackbar'
import { Button } from '../../../components/Button'
import { BLOCK_IDS, DEFAULT_LAYOUT, moveHorizontal, moveVertical, type BlockId, type BlockLayout } from './blockLayout'
import { clearLayout, saveLayout, useBlockLayout } from './useBlockLayout'
import { CheckinRow } from './CheckinRow'
import { CollapsibleSection } from './CollapsibleSection'
import { ExportSection } from './ExportSection'
import { ChoresSection } from './ChoresSection'
import { DayFocusSection } from './DayFocusSection'
import { PlaybookSection } from './PlaybookSection'
import { FocusSection } from './FocusSection'
import { FoodSection } from './FoodSection'
import { LearningSection } from './LearningSection'
import { ScreenTimeSection } from './ScreenTimeSection'
import { SundaySection } from './SundaySection'
import { ThingsSection } from './ThingsSection'
import { UpgradeList } from './UpgradeList'
import { TrackersSection } from './TrackersSection'
import { RecapSection } from './RecapSection'
import { ProgressAside } from './ProgressAside'
import { useSections } from './useSections'
import { useStreakList } from './useStreakList'
import { HabitsLiveSection } from './HabitsLiveSection'

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
  /** The current week only: today's day key, for "Oggi" (shown right before the weekly Focus). */
  dayFocusDay?: string
}

/** In "Rearrange" mode a block gets its move buttons; otherwise it renders as is. */
function Movable({
  editing,
  onMove,
  children,
}: {
  editing: boolean
  onMove: (axis: 'v' | 'h', dir: -1 | 1) => void
  children: ReactNode
}) {
  if (!editing) return <>{children}</>
  const btn =
    'inline-flex size-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
  return (
    <div className="mb-3 rounded-xl ring-2 ring-slate-300 dark:ring-slate-600">
      <div className="flex justify-end gap-1 p-1">
        <button
          type="button"
          aria-label="Move left"
          className={`${btn} hidden lg:inline-flex`}
          onClick={() => onMove('h', -1)}
        >
          ◀
        </button>
        <button type="button" aria-label="Move up" className={btn} onClick={() => onMove('v', -1)}>
          ▲
        </button>
        <button type="button" aria-label="Move down" className={btn} onClick={() => onMove('v', 1)}>
          ▼
        </button>
        <button
          type="button"
          aria-label="Move right"
          className={`${btn} hidden lg:inline-flex`}
          onClick={() => onMove('h', 1)}
        >
          ▶
        </button>
      </div>
      <div className="pointer-events-none opacity-70 select-none">{children}</div>
    </div>
  )
}

export function WeekBody({ week, plan, entries, readOnly, lateEdit = false, dayFocusDay }: WeekBodyProps) {
  const summary = useMemo(() => summarizeWeek(plan, entries), [plan, entries])
  // The meal diary's entries for this week (read-only here), live.
  const meals = useLiveQuery(() => db.meals.where('day').between(week, addDays(week, 6), true, true).toArray(), [week])
  // Saved events + favourite categories (Events project, local Dexie) ride along in the export.
  const eventMarks = useLiveQuery(() => db.eventMarks.where('state').equals('saved').toArray(), [])
  const eventPrefs = useLiveQuery(() => db.eventPrefs.get('prefs'), [])
  // Habit ideas, the Upgrade list and Streaks habits live across weeks; they ride along in the export for /settimana.
  const ideas = useLiveQuery(
    () => db.lifeEntries.filter((e) => e.kind === 'idea' || e.kind === 'upgrade' || e.kind === 'streak').toArray(),
    [],
  )
  // Streaks-app habits: a current snapshot, shown (read-only) on the live week only.
  const allStreaks = useStreakList()
  const streaks = readOnly ? [] : (allStreaks ?? [])
  const exportEntries = useMemo(() => [...entries, ...(ideas ?? [])], [entries, ideas])
  // Learning's rows (local Dexie, owner-only sync) fold into the week's activity.
  const learningStates = useLiveQuery(async () => {
    const [quiz, cards, practice] = await Promise.all([
      db.learningQuiz.toArray(),
      db.learningCards.toArray(),
      db.learningPractice.toArray(),
    ])
    return new Map(
      courses.map((c) => [
        c.id,
        {
          quiz: quiz.filter((r) => r.courseId === c.id),
          cards: cards.filter((r) => r.courseId === c.id),
          practice: practice.filter((r) => r.courseId === c.id),
        },
      ]),
    )
  }, [])
  const learning = useMemo(
    () => (learningStates ? summarizeLearningWeek(courses, learningStates, week) : null),
    [learningStates, week],
  )
  const food = useMemo(() => summarizeMealsWeek(meals ?? [], week), [meals, week])
  const { pending, trigger, confirmUndo } = useUndoSnackbar()
  const { sections, sundayOpen, toggleSection, toggleSunday } = useSections(week, readOnly)
  // Sunday answers and check-ins: editable on the live week, or late.
  const answersReadOnly = readOnly && !lateEdit
  const sentCount = plan.tasks.filter((t) => summary.sentTaskIds.has(t.id)).length

  // Past weeks always use the default; the live week follows the synced layout.
  const savedLayout = useBlockLayout()
  const layout: BlockLayout = readOnly ? DEFAULT_LAYOUT : savedLayout
  const [editing, setEditing] = useState(false)

  // Blocks that exist for this week; absent ones are skipped when moving.
  const blocks: Partial<Record<BlockId, ReactNode>> = {}
  if (!readOnly && dayFocusDay)
    blocks.oggi = (
      <>
        <DayFocusSection day={dayFocusDay} />
        <ChoresSection />
      </>
    )
  if (plan.playbook && summary.playbook)
    blocks.playbook = (
      <PlaybookSection
        week={week}
        playbook={plan.playbook}
        summary={summary.playbook}
        open={sections.playbook}
        onToggle={() => toggleSection('playbook')}
        readOnly={readOnly}
        trigger={trigger}
      />
    )
  if (plan.focus.length > 0)
    blocks.focus = (
      <FocusSection
        week={week}
        focus={plan.focus}
        focusDone={summary.focusDone}
        focusCancelled={summary.focusCancelled}
        focusTotal={summary.focusTotal}
        open={sections.focus}
        onToggle={() => toggleSection('focus')}
        readOnly={readOnly}
      />
    )
  if (readOnly) {
    // History pages keep the week's own trackers as they were.
    if (plan.trackers.length > 0)
      blocks.trackers = (
        <TrackersSection
          week={week}
          trackers={summary.trackers}
          streaks={[]}
          open={sections.trackers}
          onToggle={() => toggleSection('trackers')}
          readOnly
          trigger={trigger}
        />
      )
  } else {
    // The live week: the Habits project, live. The old trackers and the Streaks
    // snapshot are hidden behind a closed "Old habits" box.
    const oldHabits = plan.trackers.length > 0 || streaks.length > 0
    blocks.trackers = (
      <>
        <HabitsLiveSection open={sections.trackers} onToggle={() => toggleSection('trackers')} readOnly={false} />
        {oldHabits && (
          <details className="mb-6 rounded-xl border border-dashed border-slate-300 p-3 text-sm dark:border-slate-700">
            <summary className="cursor-pointer text-slate-500 dark:text-slate-400">
              Old habits (week trackers and Streaks, read-only)
            </summary>
            <div className="mt-3">
              <TrackersSection
                week={week}
                trackers={summary.trackers}
                streaks={streaks}
                open
                onToggle={() => {}}
                streaksOpen={sections.streaks}
                onToggleStreaks={() => toggleSection('streaks')}
                readOnly={false}
                trigger={trigger}
              />
            </div>
          </details>
        )}
      </>
    )
  }
  if (plan.recap && plan.recap.length > 0)
    blocks.recap = (
      <RecapSection
        week={week}
        items={plan.recap}
        open={sections.recap}
        onToggle={() => toggleSection('recap')}
        readOnly={readOnly}
      />
    )
  if (plan.rules.length > 0)
    blocks.rules = (
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
    )
  if (!readOnly && plan.tasks.length > 0)
    blocks.things = (
      <ThingsSection
        week={week}
        plan={plan}
        entries={entries}
        summary={summary}
        open={sections.things}
        onToggle={() => toggleSection('things')}
      />
    )
  if (summary.checkins.length > 0)
    blocks.checkins = (
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
    )
  if (plan.sundayCheck.length > 0)
    blocks.sunday = (
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
    )
  // The list lives across weeks and is edited on the live week only.
  if (!readOnly)
    blocks.upgrades = (
      <UpgradeList week={week} open={sections.upgrades} onToggle={() => toggleSection('upgrades')} trigger={trigger} />
    )
  if (food.days.length > 0)
    blocks.food = (
      <FoodSection
        week={week}
        food={food}
        open={sections.food}
        onToggle={() => toggleSection('food')}
        readOnly={readOnly}
      />
    )
  if (learning && learning.courses.length > 0)
    blocks.learning = (
      <LearningSection
        learning={learning}
        open={sections.learning}
        onToggle={() => toggleSection('learning')}
        readOnly={readOnly}
      />
    )
  blocks.screen = (
    <ScreenTimeSection
      week={week}
      summary={summary}
      open={sections.screen}
      onToggle={() => toggleSection('screen')}
      readOnly={readOnly}
      editable={!answersReadOnly}
    />
  )
  blocks.export = (
    <ExportSection
      plan={plan}
      entries={exportEntries}
      meals={meals ?? []}
      eventMarks={eventMarks ?? []}
      favouriteCategories={eventPrefs?.favouriteCategories ?? []}
      learning={learning}
      open={sections.export}
      onToggle={() => toggleSection('export')}
      readOnly={readOnly}
    />
  )
  // Wide screens only: the progress chart History has, beside the week.
  if (!readOnly)
    blocks.progress = (
      <div className="hidden lg:block lg:max-w-md xl:max-w-none">
        <ProgressAside week={week} />
      </div>
    )

  const present = new Set(BLOCK_IDS.filter((id) => blocks[id]))

  function move(id: BlockId, axis: 'v' | 'h', dir: -1 | 1) {
    const next = axis === 'v' ? moveVertical(layout, id, dir, present) : moveHorizontal(layout, id, dir)
    void saveLayout(next)
  }

  function reset() {
    void clearLayout()
  }

  // Phone: the columns are `contents`, so the blocks flow as one column in
  // layout order. From lg: 2 columns (xl: 3). Default: focus + trackers |
  // Things + check-ins + Sunday | food + export + progress chart.
  const colClass = ['contents lg:block', 'contents lg:block', 'contents lg:col-span-2 lg:block xl:col-span-1']

  return (
    <>
      {!readOnly && (
        <div className="mb-3 flex justify-end gap-2">
          {editing && (
            <Button variant="ghost" onClick={reset}>
              Reset
            </Button>
          )}
          <Button variant="ghost" onClick={() => setEditing((e) => !e)}>
            {editing ? 'Done' : 'Rearrange'}
          </Button>
        </div>
      )}
      <div className="flex flex-col lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-6 xl:grid-cols-3">
        {layout.map((col, c) => (
          <div key={c} className={colClass[c]}>
            {col.map((id) =>
              blocks[id] ? (
                <Movable key={id} editing={editing && !readOnly} onMove={(axis, dir) => move(id, axis, dir)}>
                  {blocks[id]}
                </Movable>
              ) : null,
            )}
          </div>
        ))}
        {!readOnly && pending && <Snackbar label={pending.label} onUndo={confirmUndo} />}
      </div>
    </>
  )
}
