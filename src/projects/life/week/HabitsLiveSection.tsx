import { HabitsPanel } from '../../habits/HabitsPanel'
import { useHabitDays } from '../../habits/useHabitDays'
import { useToday } from '../../../lib/useToday'
import { CollapsibleSection } from '../../../components/CollapsibleSection'

interface Props {
  open: boolean
  onToggle: () => void
  readOnly: boolean
}

/** The Habits project inside Life: the very same panel as the Habits page
 *  (today / week / month / board, tiles, sheets), its tab remembered apart. */
export function HabitsLiveSection({ open, onToggle, readOnly }: Props) {
  const today = useToday()
  const data = useHabitDays(today)
  if (!data || data.active.length === 0) return null

  return (
    <CollapsibleSection
      title="Habits"
      summary={`Habits · today ${data.doneToday}/${data.active.length}`}
      open={open}
      onToggle={onToggle}
      readOnly={readOnly}
    >
      <HabitsPanel data={data} today={today} viewKey="life:habits-view" />
    </CollapsibleSection>
  )
}
