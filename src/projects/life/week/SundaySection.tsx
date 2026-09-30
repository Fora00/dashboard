import { useState } from 'react'
import type { LifePlan } from '../../../lib/db'
import { describeAnswer, shortAnswer } from '../format'
import { type WeekSummary } from '../model'
import { Button } from '../../../components/Button'
import { Card } from '../../../components/Card'
import { CollapsibleSection } from './CollapsibleSection'
import { AutoAnswer, SundayQuestion } from './SundayQuestion'
import { WeekRecap } from './WeekRecap'

export function SundaySection({
  week,
  plan,
  summary,
  tasksSent,
  open,
  onToggle,
  readOnly,
}: {
  week: string
  plan: LifePlan
  summary: WeekSummary
  /** How many of the plan's tasks were sent to Things. */
  tasksSent: number
  open: boolean
  onToggle: () => void
  readOnly: boolean
}) {
  const [sundayEditing, setSundayEditing] = useState(false)
  // Questions linked to a habit answer themselves; only the rest need typing.
  const manualQuestions = plan.sundayCheck.filter((q) => !summary.autoAnswered.has(q.id)).length
  const manualAnswered = [...summary.answers.keys()].filter((id) => !summary.autoAnswered.has(id)).length

  return (
    <CollapsibleSection
      title="🗓️ Sunday check"
      summary={`${summary.answers.size}/${plan.sundayCheck.length} answered`}
      open={open}
      onToggle={onToggle}
      readOnly={readOnly}
    >
      <WeekRecap
        focus={[summary.focusDone.size, plan.focus.length]}
        trackers={summary.trackers}
        checkins={[summary.checkins.filter((c) => c.done).length, summary.checkins.length]}
        tasks={[tasksSent, plan.tasks.length]}
      />
      {readOnly ? (
        <Card className="space-y-2 text-sm">
          {plan.sundayCheck.map((q) => (
            <div key={q.id} className="flex items-center justify-between gap-3">
              <span className="text-slate-600 dark:text-slate-300">{q.label}</span>
              <span className="font-medium text-slate-800 dark:text-slate-100">
                {describeAnswer(q, summary.answers.get(q.id) ?? null)}
              </span>
            </div>
          ))}
        </Card>
      ) : sundayEditing ? (
        <Card>
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {plan.sundayCheck.map((q) => (
              <div key={q.id} className="py-3 first:pt-0">
                {summary.autoAnswered.has(q.id) ? (
                  <AutoAnswer question={q} value={summary.answers.get(q.id) ?? null} trackers={summary.trackers} />
                ) : (
                  <SundayQuestion week={week} question={q} value={summary.answers.get(q.id) ?? null} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end border-t border-slate-200 pt-3 dark:border-slate-800">
            <Button onClick={() => setSundayEditing(false)}>Done</Button>
          </div>
        </Card>
      ) : (
        // Compact by default: just the answers on one line, form on demand.
        <Card className="space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {plan.sundayCheck.map((q, i) => (
              <span key={q.id}>
                {i > 0 && <span className="text-slate-300 dark:text-slate-600"> · </span>}
                <span title={q.label}>{shortAnswer(q, summary.answers.get(q.id) ?? null)}</span>
              </span>
            ))}
          </p>
          {manualQuestions > 0 && (
            <Button variant={manualAnswered === 0 ? 'primary' : 'ghost'} onClick={() => setSundayEditing(true)}>
              {manualAnswered === 0 ? 'Answer' : 'Edit answers'}
            </Button>
          )}
        </Card>
      )}
    </CollapsibleSection>
  )
}
