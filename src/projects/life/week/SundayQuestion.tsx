import { useState } from 'react'
import type { LifeAnswer, LifeQuestion } from '../../../lib/db'
import { setSundayAnswer } from '../../../lib/lifeSync'
import { describeAnswer } from '../format'
import { validateAnswer, type TrackerSummary } from '../model'
import { Button } from '../../../components/Button'
import { EnergyScale } from './EnergyScale'

/** A Sunday question answered from its linked habit: shown, never typed. */
export function AutoAnswer({
  question,
  value,
  trackers,
}: {
  question: LifeQuestion
  value: LifeAnswer
  trackers: TrackerSummary[]
}) {
  const t = trackers.find((x) => x.tracker.id === question.tracker)?.tracker
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{question.label}</p>
        {t && (
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Auto, from {t.emoji ? `${t.emoji} ` : ''}
            {t.label}
          </p>
        )}
      </div>
      <span className="shrink-0 text-sm font-medium text-slate-800 dark:text-slate-100">
        {describeAnswer(question, value)}
      </span>
    </div>
  )
}

export function SundayQuestion({ week, question, value }: { week: string; question: LifeQuestion; value: LifeAnswer }) {
  const [error, setError] = useState<string | null>(null)

  async function save(next: LifeAnswer) {
    const err = validateAnswer(question.type, next)
    if (err) {
      setError(err)
      return
    }
    setError(null)
    await setSundayAnswer(week, question.id, next)
  }

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">{question.label}</p>
      {question.type === 'number' && (
        <input
          type="number"
          inputMode="decimal"
          defaultValue={typeof value === 'number' ? value : ''}
          onBlur={(e) => {
            const raw = e.target.value.trim()
            void save(raw === '' ? null : Number(raw))
          }}
          className="min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
        />
      )}
      {question.type === 'boolean' && (
        <div className="flex gap-2">
          <Button
            variant={value === true ? 'primary' : 'ghost'}
            onClick={() => void save(value === true ? null : true)}
          >
            {value === true ? '✓ Yes' : 'Yes'}
          </Button>
          <Button
            variant={value === false ? 'primary' : 'ghost'}
            onClick={() => void save(value === false ? null : false)}
          >
            {value === false ? '✓ No' : 'No'}
          </Button>
        </div>
      )}
      {question.type === 'text' && (
        <textarea
          defaultValue={typeof value === 'string' ? value : ''}
          onBlur={(e) => void save(e.target.value)}
          rows={2}
          maxLength={2000}
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
        />
      )}
      {question.type === 'scale5' && <EnergyScale label="" value={typeof value === 'number' ? value : undefined} onPick={(n) => void save(value === n ? null : n)} />}
      {error && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{error}</p>}
    </div>
  )
}
