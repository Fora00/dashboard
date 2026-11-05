import { useState } from 'react'
import { runSafe } from '../../../lib/runSafe'

// One-line adder for the Daily / Weekly focus, so lines can be added from the
// phone with no Mac. `onAdd` resolves true when the line was stored.
export function AddLine({
  onAdd,
  placeholder,
  maxLength,
}: {
  onAdd: (title: string) => Promise<boolean | number>
  placeholder: string
  maxLength: number
}) {
  const [text, setText] = useState('')
  const submit = () => {
    const t = text.trim()
    if (t.length === 0) return
    void runSafe(async () => {
      if (await onAdd(t)) setText('')
    }, 'Could not save')()
  }
  return (
    <form
      className="flex items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={maxLength}
        placeholder={placeholder}
        enterKeyHint="done"
        aria-label={placeholder}
        className="min-h-12 min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 text-base dark:border-slate-700 dark:bg-slate-800/50"
      />
      <button
        type="submit"
        aria-label="Aggiungi"
        className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-slate-300 text-xl dark:border-slate-700"
      >
        +
      </button>
    </form>
  )
}
