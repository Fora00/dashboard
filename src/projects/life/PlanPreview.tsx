import type { ReactNode } from 'react'
import type { LifePlan } from '../../lib/db'
import { diffPlans } from './model'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'

// The counts + diff-against-the-stored-plan card shown before a save, shared
// by LifeImport (paste JSON) and LifeEditor (build by hand) — same content,
// same order, so the two entry points feel identical at the point of save.

interface PlanPreviewProps {
  plan: LifePlan
  /** The currently stored plan for this week, or null (first import). */
  existingPlan: LifePlan | null
  saving: boolean
  saveError: string | null
  onConfirm: () => void
  confirmLabel?: string
  /** Extra buttons next to the confirm button, e.g. "Back to edit". */
  extraActions?: ReactNode
}

export function PlanPreview({
  plan,
  existingPlan,
  saving,
  saveError,
  onConfirm,
  confirmLabel = 'Save',
  extraActions,
}: PlanPreviewProps) {
  const diff = diffPlans(existingPlan, plan)
  return (
    <Card className="mb-4 space-y-3 text-sm">
      <p className="font-medium text-slate-800 dark:text-slate-100">Week of {plan.week}</p>
      <ul className="space-y-0.5 text-slate-600 dark:text-slate-300">
        <li>
          {plan.focus.length} focus item{plan.focus.length === 1 ? '' : 's'}
        </li>
        <li>
          {plan.tasks.length} task{plan.tasks.length === 1 ? '' : 's'}
        </li>
        <li>
          {plan.trackers.length} tracker{plan.trackers.length === 1 ? '' : 's'}
        </li>
        <li>
          {plan.sundayCheck.length} Sunday question{plan.sundayCheck.length === 1 ? '' : 's'}
        </li>
        <li>
          {plan.rules.length} rule{plan.rules.length === 1 ? '' : 's'}
        </li>
        <li>
          {plan.checkins.length} check-in{plan.checkins.length === 1 ? '' : 's'}
        </li>
      </ul>

      <div className="border-t border-slate-200 pt-2 dark:border-slate-800">
        {diff.firstImport ? (
          <p className="text-slate-500 dark:text-slate-400">First import for this week.</p>
        ) : diff.unchanged ? (
          <p className="text-slate-500 dark:text-slate-400">Identical to the saved plan — nothing will change.</p>
        ) : (
          <ul className="list-disc space-y-0.5 pl-5 text-slate-600 dark:text-slate-300">
            {diff.summary.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        )}
      </div>

      {saveError && <p className="text-rose-600 dark:text-rose-400">{saveError}</p>}

      <div className="flex flex-wrap gap-2">
        <Button onClick={onConfirm} disabled={saving}>
          {saving ? 'Saving…' : confirmLabel}
        </Button>
        {extraActions}
      </div>
    </Card>
  )
}
