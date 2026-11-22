import { useState } from 'react'
import { confirm } from '../../lib/confirm'
import { type Habit, type HabitDayState } from '../../lib/db'
import { Button } from '../../components/Button'
import { deleteHabit, setArchived, updateHabit } from '../../lib/habitSync'
import { runSafe } from '../../lib/runSafe'
import { habitStats } from './habitStats'
import { HabitForm } from './HabitForm'
import { HabitSuggestionList } from './HabitSuggestionList'
import { suggest } from './habitSuggestions'
import { toForm } from './habitFormDefaults'
import { engineLabel } from '../life/model/engines'
import { AppLimitsView } from './AppLimitsView'
import { MeasureBadge } from './MeasureBadge'
import { HabitOverview } from './HabitOverview'
import type { AppsByWeek } from './habitMeasure'

const noSlips = new Map<string, number>()
const noApps: AppsByWeek = new Map()

interface Props {
  habit: Habit
  states: ReadonlyMap<string, HabitDayState>
  notes: ReadonlyMap<string, string>
  /** Days with a stored check (the rest of `states` is derived). */
  storedDays: ReadonlySet<string>
  openCount: number
  /** Lifetime wins of this habit: its boxes on the lifeboard. */
  wins: number
  today: string
  /** Measured habits: this habit's slips per day and the Sunday apps answers by week. */
  slips?: ReadonlyMap<string, number> | undefined
  apps?: AppsByWeek | undefined
}

/** The body of the habit page `/habits/:id` (M2): overview first (badges,
 *  suggestions, the per-measure view, numbers, the month calendar), then the
 *  granular management (rest ranges, the full settings form, archive, delete). */
export function HabitDetail({ habit, states, notes, storedDays, openCount, wins, today, slips, apps }: Props) {
  const s = habitStats(habit, states, today)
  const archived = habit.archivedAt !== undefined

  return (
    <div className="space-y-6">
      {(habit.engine || habit.measure || archived) && (
        <div className="flex flex-wrap items-center gap-2">
          {habit.engine && (
            <p
              data-testid="habit-engine"
              aria-label={`Engine: ${engineLabel(habit.engine)}`}
              className="inline-flex rounded-full border border-slate-300 px-2.5 py-0.5 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-300"
            >
              {engineLabel(habit.engine)}
            </p>
          )}
          {habit.measure && <MeasureBadge habit={habit} />}
          {archived && (
            <span className="inline-flex rounded-full bg-slate-200 px-2.5 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300">
              🗄 Archiviata
            </span>
          )}
        </div>
      )}

      {!archived && (
        <HabitSuggestionList
          suggestions={suggest({ habit, stats: s, states, notes, today, openCount })}
          onApply={(sg) => {
            if (sg.action)
              void runSafe(updateHabit, 'Could not save')(habit, habit.name, habit.emoji, {
                ...toForm(habit),
                ...sg.action.patch,
              })
          }}
        />
      )}

      {habit.measure === 'app-limits' && (
        <AppLimitsView habit={habit} states={states} slips={slips ?? noSlips} apps={apps ?? noApps} today={today} />
      )}

      <HabitOverview
        habit={habit}
        states={states}
        storedDays={storedDays}
        slips={slips}
        apps={apps}
        wins={wins}
        today={today}
      />

      <HabitSettings habit={habit} />

      <HabitManage habit={habit} />
    </div>
  )
}

/** The full edit form; stays on the page after saving. */
function HabitSettings({ habit }: { habit: Habit }) {
  const [saved, setSaved] = useState(false)
  return (
    <section aria-label="Cycle and settings" className="space-y-3">
      <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Cycle and settings</h3>
      <HabitForm
        key={habit.id}
        initial={toForm(habit)}
        submitLabel="Save"
        verdict
        onSubmit={async (v) => {
          await updateHabit(habit, v.name, v.emoji, v)
          setSaved(true)
        }}
        extra={
          saved ? (
            <span role="status" className="self-center text-sm text-emerald-700 dark:text-emerald-300">
              Salvato ✓
            </span>
          ) : undefined
        }
      />
    </section>
  )
}

/** Archive / restore and delete (with its whole history). Once deleted the
 *  id no longer resolves and the page goes back by itself (HabitPage). */
function HabitManage({ habit }: { habit: Habit }) {
  const archived = habit.archivedAt !== undefined
  async function remove() {
    const ok = await confirm({
      title: `Delete “${habit.name}”?`,
      body: 'Its whole history is deleted too.',
      confirmLabel: 'Delete',
      danger: true,
    })
    if (ok) void runSafe(deleteHabit, 'Could not delete habit')(habit)
  }
  return (
    <section aria-label="Gestione" className="space-y-2">
      <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Gestione</h3>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="ghost"
          onClick={() =>
            void runSafe(setArchived, archived ? 'Could not restore' : 'Could not archive')(habit, !archived)
          }
        >
          {archived ? '↩ Ripristina' : '🗄 Archivia'}
        </Button>
        <Button variant="danger" onClick={() => void remove()}>
          Elimina
        </Button>
      </div>
      <p className="text-xs text-slate-500">
        {archived
          ? 'Archiviata: la storia resta sulla Board. Ripristina per rimetterla tra le abitudini di oggi.'
          : 'Archivia per toglierla da oggi tenendo la storia; elimina cancella anche la storia.'}
      </p>
    </section>
  )
}
