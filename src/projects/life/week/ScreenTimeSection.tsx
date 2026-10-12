import { setSundayAnswer } from '../../../lib/lifeSync'
import type { LifeAnswer } from '../../../lib/db'
import { Card } from '../../../components/Card'
import { describeAnswer } from '../format'
import { SCREEN_QUESTIONS, validateAnswer, type WeekSummary } from '../model'
import { CollapsibleSection } from './CollapsibleSection'
import { AppsInput, DurationInput } from './SundayQuestion'

/** Phone screen time for the week (from iOS Screen Time): the daily average,
 *  the three categories and the most-used apps. Always available — the
 *  questions are fixed (SCREEN_QUESTIONS), not part of the imported plan. */
export function ScreenTimeSection({
  week,
  summary,
  open,
  onToggle,
  readOnly,
  editable = !readOnly,
}: {
  week: string
  summary: WeekSummary
  open: boolean
  onToggle: () => void
  readOnly: boolean
  editable?: boolean
}) {
  const answered = SCREEN_QUESTIONS.filter((q) => summary.screen.has(q.id)).length
  const save = (id: string, type: (typeof SCREEN_QUESTIONS)[number]['type']) => async (next: LifeAnswer) => {
    if (validateAnswer(type, next)) return
    await setSundayAnswer(week, id, next)
  }

  return (
    <CollapsibleSection
      title="📱 Screen time"
      summary={`${answered}/${SCREEN_QUESTIONS.length}`}
      open={open}
      onToggle={onToggle}
      readOnly={readOnly}
    >
      <Card className="space-y-3">
        {SCREEN_QUESTIONS.map((q) => {
          const value = summary.screen.get(q.id) ?? null
          return (
            <div key={`${q.id}:${JSON.stringify(value)}`}>
              <p className="mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">{q.label}</p>
              {!editable ? (
                <p className="text-sm text-slate-800 dark:text-slate-100">{describeAnswer(q, value)}</p>
              ) : q.type === 'apps' ? (
                <AppsInput label={q.label} value={value} onSave={save(q.id, q.type)} />
              ) : (
                <DurationInput label={q.label} value={value} onSave={save(q.id, q.type)} />
              )}
            </div>
          )
        })}
      </Card>
    </CollapsibleSection>
  )
}
