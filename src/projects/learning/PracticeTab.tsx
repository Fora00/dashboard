import { useEffect, useRef, useState } from 'react'
import { Button } from '../../components/Button'
import { FOCUS_RING_FIELD } from '../../components/focus'
import { HtmlText } from './HtmlText'
import type { CourseState } from './progress'
import { MAX_NOTES_LENGTH, setPracticeDone, setPracticeNotes } from '../../lib/learningSync'
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
}: {
  courseId: string
  moduleId: string
  item: PracticeItem
  done: boolean
  initialNotes: string
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
      {shown && (
        <p className="mt-3 border-t border-slate-200 pt-3 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-300">
          <strong>Traccia di risposta.</strong> <HtmlText html={item.answer} />
        </p>
      )}
    </div>
  )
}

export function PracticeTab({ courseId, mod, state }: Props) {
  const rows = new Map(
    state.practice.filter((r) => r.courseId === courseId && r.moduleId === mod.id).map((r) => [r.itemId, r]),
  )
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Rispondi a voce alta, come in colloquio, anche solo per un minuto. Scrivi i punti chiave se vuoi, poi confronta
        con la traccia.
      </p>
      {mod.practice.map((item) => (
        <Item
          key={item.id}
          courseId={courseId}
          moduleId={mod.id}
          item={item}
          done={rows.get(item.id)?.done === 1}
          initialNotes={rows.get(item.id)?.notes ?? ''}
        />
      ))}
    </div>
  )
}
