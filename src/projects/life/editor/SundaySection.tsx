import type { LifeQuestionType } from '../../../lib/db'
import { AUTO_QUESTION_TYPES, LIFE_CAPS } from '../model'
import { Button } from '../../../components/Button'
import { Card } from '../../../components/Card'
import { inputClass, newId, removeAt, removeBtnClass, updateAt, type QuestionRow, type TrackerRow } from './rows'

const QUESTION_TYPE_OPTIONS: { value: LifeQuestionType; label: string }[] = [
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Yes / No' },
  { value: 'text', label: 'Text' },
  { value: 'scale5', label: '1–5' },
]

export function SundaySection({
  sundayCheck,
  setSundayCheck,
  trackers,
}: {
  sundayCheck: QuestionRow[]
  setSundayCheck: (v: QuestionRow[]) => void
  trackers: TrackerRow[]
}) {
  return (
    <section className="mb-6">
      <h2 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Sunday questions</h2>
      <Card className="space-y-3">
        {sundayCheck.map((q, i) => (
          <div key={q.id} className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              value={q.label}
              onChange={(e) => setSundayCheck(updateAt(sundayCheck, i, { label: e.target.value }))}
              maxLength={LIFE_CAPS.questionLabel}
              placeholder="Question…"
              aria-label="Question label"
              className={`${inputClass} flex-1`}
            />
            <select
              value={q.type}
              onChange={(e) => setSundayCheck(updateAt(sundayCheck, i, { type: e.target.value as LifeQuestionType }))}
              aria-label="Question type"
              className={`${inputClass} w-32`}
            >
              {QUESTION_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setSundayCheck(removeAt(sundayCheck, i))}
              aria-label="Remove question"
              className={removeBtnClass}
            >
              ✕
            </button>
          </div>
          {AUTO_QUESTION_TYPES.includes(q.type) && trackers.length > 0 && (
            <select
              value={trackers.some((t) => t.id === q.tracker) ? q.tracker : ''}
              onChange={(e) => setSundayCheck(updateAt(sundayCheck, i, { tracker: e.target.value }))}
              aria-label="Answer source"
              className={inputClass}
            >
              <option value="">Answered by hand</option>
              {trackers.map((t) => (
                <option key={t.id} value={t.id}>
                  {`Auto from ${t.emoji ? `${t.emoji} ` : ''}${t.label || 'unnamed habit'} ${
                    q.type === 'number' ? '(count)' : '(goal reached)'
                  }`}
                </option>
              ))}
            </select>
          )}
          </div>
        ))}
        {sundayCheck.length < LIFE_CAPS.questions && (
          <Button
            variant="ghost"
            onClick={() => setSundayCheck([...sundayCheck, { id: newId(), label: '', type: 'text', tracker: '' }])}
          >
            + Add question
          </Button>
        )}
      </Card>
    </section>
  )
}
