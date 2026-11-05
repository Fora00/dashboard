import { useEffect, useRef, useState } from 'react'
import { Button } from '../../components/Button'
import { FOCUS_RING_FIELD } from '../../components/focus'
import { HtmlText } from './HtmlText'
import { figures } from './figures'
import type { CourseState } from './progress'
import { toggleCheck } from '../../lib/learningLocal'
import { MAX_NOTES_LENGTH, setPracticeDone, setPracticeNotes } from '../../lib/learningSync'
import { ItemSketches } from './Sketches'
import type { CourseModule, PracticeItem } from './types'

interface Props {
  courseId: string
  mod: CourseModule
  state: CourseState
}

function Item({
  courseId,
  moduleId,
  item,
  done,
  initialNotes,
  checked,
}: {
  courseId: string
  moduleId: string
  item: PracticeItem
  done: boolean
  initialNotes: string
  /** Ticked checklist indices (local-only, saved on every tap). */
  checked: readonly number[]
}) {
  const [notes, setNotes] = useState(initialNotes)
  const [shown, setShown] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const pending = useRef<string | null>(null)

  const flush = () => {
    clearTimeout(timer.current)
    if (pending.current !== null) void setPracticeNotes(courseId, moduleId, item.id, pending.current)
    pending.current = null
  }
  // Save on a short pause, and never lose the last keystrokes on unmount.
  useEffect(() => flush, []) // eslint-disable-line react-hooks/exhaustive-deps
  const onChange = (value: string) => {
    setNotes(value)
    pending.current = value
    clearTimeout(timer.current)
    timer.current = setTimeout(flush, 500)
  }

  return (
    <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
      <p className="font-medium">
        <HtmlText html={item.question} />
      </p>
      {item.minutes && (
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">⏱ {item.minutes} minuti, poi fermati.</p>
      )}
      {item.checklist && (
        <fieldset className="mt-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
          <legend className="px-1 text-sm font-medium">Guarda il tuo foglio</legend>
          {item.checklist.map((c, i) => (
            <label key={i} className="flex min-h-10 items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="size-5"
                checked={checked.includes(i)}
                onChange={(e) => void toggleCheck(courseId, moduleId, item.id, i, e.target.checked)}
              />
              {c}
            </label>
          ))}
        </fieldset>
      )}
      {item.checklist && <ItemSketches courseId={courseId} moduleId={moduleId} itemId={item.id} />}
      {item.modelFig && figures[item.modelFig] && (
        <div className="mt-3 [&_svg]:mx-auto [&_svg]:max-w-sm">{figures[item.modelFig]}</div>
      )}
      <textarea
        value={notes}
        maxLength={MAX_NOTES_LENGTH}
        onChange={(e) => onChange(e.target.value)}
        onBlur={flush}
        aria-label="I tuoi appunti"
        placeholder="I tuoi punti chiave (opzionale)"
        className={`mt-3 min-h-24 w-full resize-y rounded-lg border border-slate-300 bg-white p-2.5 text-base dark:border-slate-700 dark:bg-slate-900 ${FOCUS_RING_FIELD}`}
      />
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <Button variant="ghost" aria-expanded={shown} onClick={() => setShown((s) => !s)}>
          {shown ? 'Nascondi la traccia' : 'Mostra la traccia'}
        </Button>
        <label className="flex min-h-10 items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={done}
            onChange={(e) => void setPracticeDone(courseId, moduleId, item.id, e.target.checked)}
            className="size-5"
          />
          Fatta
        </label>
      </div>
      {item.checklist && done && checked.length === 0 && (
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Spunta almeno un criterio che il tuo foglio rispetta: così conta nel &quot;saper fare&quot;.
        </p>
      )}
      {shown && (
        <div className="mt-3 border-t border-slate-200 pt-3 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-300">
          <strong>Traccia di risposta.</strong>{' '}
          {/* Answers with a code block get the lesson typography (styled <pre>, horizontal scroll). */}
          <HtmlText html={item.answer} block={item.answer.includes('<pre')} />
        </div>
      )}
    </div>
  )
}

export function PracticeTab({ courseId, mod, state }: Props) {
  const rows = new Map(
    state.practice.filter((r) => r.courseId === courseId && r.moduleId === mod.id).map((r) => [r.itemId, r]),
  )
  const checks = new Map(
    (state.checks ?? []).filter((r) => r.courseId === courseId && r.moduleId === mod.id).map((r) => [r.itemId, r]),
  )
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        {mod.practice.some((p) => p.checklist)
          ? 'Fai l\'esercizio su carta, con il tempo indicato. Poi controlla il foglio con i criteri: contano i sì, non il "bello".'
          : 'Rispondi a voce alta, come in colloquio, anche solo per un minuto. Scrivi i punti chiave se vuoi, poi confronta con la traccia.'}
      </p>
      {mod.practice.map((item) => (
        <Item
          key={item.id}
          courseId={courseId}
          moduleId={mod.id}
          item={item}
          done={rows.get(item.id)?.done === 1}
          initialNotes={rows.get(item.id)?.notes ?? ''}
          checked={checks.get(item.id)?.checked ?? []}
        />
      ))}
    </div>
  )
}
