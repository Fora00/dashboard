import { useState } from 'react'
import { useAuth } from '../../lib/useAuth'
import { useOwner } from '../../lib/useOwner'
import { Button } from '../../components/Button'
import { PageHeader } from '../../components/PageHeader'
import { EmptyState } from '../../components/EmptyState'
import { SyncCard } from '../../components/SyncCard'
import { addHabit, sync } from '../../lib/habitSync'
import { resetDemoHabits } from './demoHabits'
import { MAX_OPEN } from './habitStates'
import { HabitRules } from './HabitRules'
import { Sheet } from '../../components/Sheet'
import { HabitForm } from './HabitForm'
import { newForm } from './habitFormDefaults'
import { HabitsPanel } from './HabitsPanel'
import { useHabitDays } from './useHabitDays'
import { Kbd } from '../../components/Kbd'
import { useListHotkeys } from '../../lib/useListHotkeys'
import { runSafe } from '../../lib/runSafe'
import { useToday } from '../life/useToday'

/** The Habits page: header, sync, New habit and How it works around the
 *  shared HabitsPanel (the same panel Life shows). */
export function Habits() {
  const [adding, setAdding] = useState(false)
  // No search here: '/' and 'n' both open the new-habit sheet.
  useListHotkeys({ onSearch: () => setAdding(true), onNew: () => setAdding(true) })
  const session = useAuth()
  const owner = useOwner()
  const isGuestViewer = Boolean(session) && owner === false
  const today = useToday()
  const data = useHabitDays(today)
  const habits = data?.habits
  const active = data?.active ?? []
  const [rulesOpen, setRulesOpen] = useState(false)

  return (
    <div>
      <PageHeader emoji="✅" title="Habits" subtitle="Tap a tile to check it off for today. Saved on this device." />

      {import.meta.env.DEV && !session && habits !== undefined && (
        <Button variant="ghost" className="mb-4" onClick={() => void runSafe(resetDemoHabits, 'Could not fill')()}>
          🧪 {habits.length === 0 ? 'Fill with' : 'Reset to'} demo data (dev only, this browser only)
        </Button>
      )}

      <SyncCard sync={sync} />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button onClick={() => setAdding(true)}>
          + New habit <Kbd>n</Kbd>
        </Button>
        <Button variant="ghost" onClick={() => setRulesOpen(true)}>
          ℹ️ How it works
        </Button>
      </div>

      <HabitsPanel
        data={data}
        today={today}
        viewKey="habits:view"
        empty={
          <EmptyState
            emoji="🌱"
            title="No habits yet"
            hint={
              isGuestViewer
                ? 'Nothing shared with you yet — ask Francesco to invite you from the Sharing page.'
                : 'Add a habit above — check it off each day to grow a streak.'
            }
          />
        }
      />

      <Sheet open={adding} onClose={() => setAdding(false)} title="New habit">
        {adding && (
          <HabitForm
            initial={newForm(
              today,
              active.filter((h) => h.kind === 'forever').length < MAX_OPEN ? 'forever' : 'experiment',
            )}
            submitLabel="Create habit"
            presets
            onSubmit={async (v) => {
              await addHabit(v.name, v.emoji, v)
              setAdding(false)
            }}
          />
        )}
        {adding && active.length >= MAX_OPEN && (
          <p className="mt-3 text-xs text-amber-700 dark:text-amber-300">
            {active.length} habits are open already: past {MAX_OPEN} none gets finished. Make this one an experiment, or
            close one.
          </p>
        )}
      </Sheet>

      <Sheet open={rulesOpen} onClose={() => setRulesOpen(false)} title="How it works">
        {rulesOpen && <HabitRules />}
      </Sheet>
    </div>
  )
}
