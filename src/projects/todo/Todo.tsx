import { useState, type FormEvent } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Todo as TodoItem } from '../../lib/db'
import { addTodo as createTodo, clearDoneTodos, deleteTodo, toggleTodo } from '../../lib/todoSync'
import { Button } from '../../components/Button'
import { PageHeader } from '../../components/PageHeader'
import { EmptyState } from '../../components/EmptyState'
import { SyncCard } from '../../components/SyncCard'

export function Todo() {
  const [text, setText] = useState('')
  const todos = useLiveQuery(() => db.todos.orderBy('createdAt').toArray())

  const open = todos?.filter((t) => t.done === 0) ?? []
  const done = todos?.filter((t) => t.done === 1) ?? []

  async function addTodo(e: FormEvent) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    await createTodo(trimmed)
    setText('')
  }

  async function toggle(t: TodoItem) {
    await toggleTodo(t)
  }

  async function remove(t: TodoItem) {
    await deleteTodo(t.id)
  }

  async function clearDone() {
    await clearDoneTodos()
  }

  const renderTodo = (t: TodoItem) => (
    <li key={t.id} className="flex items-stretch gap-2">
      <button
        type="button"
        onClick={() => void toggle(t)}
        className="flex min-h-12 w-full min-w-0 flex-1 items-center gap-3 rounded-lg border border-slate-800 bg-slate-800/50 px-4 text-left transition-colors hover:border-slate-600 active:bg-slate-800"
      >
        <span
          className={`flex size-5 shrink-0 items-center justify-center rounded-full border text-xs ${
            t.done === 1
              ? 'border-emerald-400 bg-emerald-400 text-slate-900'
              : 'border-slate-500'
          }`}
        >
          {t.done === 1 && '✓'}
        </span>
        <span className={`min-w-0 flex-1 truncate ${t.done === 1 ? 'text-slate-500 line-through' : ''}`}>
          {t.text}
        </span>
      </button>
      <Button
        variant="danger"
        onClick={() => void remove(t)}
        aria-label={`Delete ${t.text}`}
        className="min-w-10"
      >
        ✕
      </Button>
    </li>
  )

  return (
    <div>
      <PageHeader
        emoji="📝"
        title="Todo"
        subtitle="A simple list — tap to mark done. Saved on this device."
      />

      <SyncCard />

      <form onSubmit={addTodo} className="mb-6 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add something to do…"
          autoComplete="off"
          enterKeyHint="done"
          className="min-h-10 w-full rounded-lg border border-slate-700 bg-slate-800 px-3.5 text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
        />
        <Button type="submit" disabled={!text.trim()}>
          Add
        </Button>
      </form>

      {todos === undefined ? null : todos.length === 0 ? (
        <EmptyState
          emoji="🌤️"
          title="Nothing to do"
          hint="Todos you add are saved on this device and work offline."
        />
      ) : (
        <div className="space-y-6">
          {open.length > 0 && (
            <section>
              <h2 className="mb-2 text-sm font-medium text-slate-400">
                Open · {open.length}
              </h2>
              <ul className="space-y-2">{open.map(renderTodo)}</ul>
            </section>
          )}
          {done.length > 0 && (
            <section>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-medium text-slate-400">
                  Done · {done.length}
                </h2>
                <Button variant="danger" onClick={() => void clearDone()}>
                  Clear done
                </Button>
              </div>
              <ul className="space-y-2">{done.map(renderTodo)}</ul>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
