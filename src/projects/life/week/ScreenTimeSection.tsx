import { useLiveQuery } from 'dexie-react-hooks'
import { setSundayAnswer } from '../../../lib/lifeSync'
import { db, type LifeAnswer } from '../../../lib/db'
import { limitedApps } from '../../habits/habitMeasure'
import { Card } from '../../../components/Card'
import { describeAnswer } from '../format'
import { missingApps, SCREEN_QUESTIONS, validateAnswer, type WeekSummary } from '../model'
import { CollapsibleSection } from '../../../components/CollapsibleSection'
import { AppsInput, DurationInput } from './SundayQuestion'

/** Phone screen time for the week (from iOS Screen Time): total, daily
 *  average, the iPhone's categories (fill only the ones it shows) and the
 *  most-used apps. Always available — the
 *  questions are fixed (SCREEN_QUESTIONS), not part of the imported plan.
 *  The apps in the limits of the app-limits habits (habitMeasure.ts) always
 *  get a locked row each, and the section reads incomplete until each has minutes. */
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
  const habits = useLiveQuery(() => db.habits.toArray(), [])
  const required = limitedApps(habits ?? [])
  const missing = missingApps(summary.screen.get('screen-apps') ?? null, required)
  const answered = SCREEN_QUESTIONS.filter((q) => summary.screen.has(q.id)).length
  const filled = answered === 0 ? 'empty' : `${answered} filled`
  const save = (id: string, type: (typeof SCREEN_QUESTIONS)[number]['type']) => async (next: LifeAnswer) => {
    if (validateAnswer(type, next)) return
    await setSundayAnswer(week, id, next)
  }

  return (
    <CollapsibleSection
      title="📱 Screen time"
      summary={missing.length ? `${filled} · mancano ${missing.length} app con limite` : filled}
      open={open}
      onToggle={onToggle}
      readOnly={readOnly}
    >
      <Card className="space-y-3">
        {SCREEN_QUESTIONS.map((q) => {
          const value = summary.screen.get(q.id) ?? null
          return (
            <div key={`${q.id}:${JSON.stringify(value)}${q.type === 'apps' ? `:${required.join('|')}` : ''}`}>
              <p className="mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">{q.label}</p>
              {!editable ? (
                <p className="text-sm text-slate-800 dark:text-slate-100">{describeAnswer(q, value)}</p>
              ) : q.type === 'apps' ? (
                <>
                  <AppsInput label={q.label} value={value} onSave={save(q.id, q.type)} required={required} />
                  {missing.length > 0 && (
                    <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
                      Da compilare (anche 0): {missing.join(', ')}. Servono a verificare i limiti app.
                    </p>
                  )}
                </>
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
