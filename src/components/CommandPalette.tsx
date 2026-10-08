import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { areas } from '../lib/areas'
import { rankItems } from '../lib/fuzzy'
import { shortcutFor } from '../lib/shortcuts'
import { toggleSidebarCollapsed } from '../lib/useSidebarCollapsed'
import { comboLabel } from '../lib/useHotkey'
import { useVisibleProjects } from '../lib/useVisibleProjects'
import { FOCUS_RING_INSET } from './focus'
import { ProjectIcon } from './ProjectIcon'
import type { ProjectMeta } from '../lib/projects'

// Command palette (mod+k): jump to any project the user may open (hidden ones
// included, so everything is reachable) or run a global action. Native
// <dialog> like Sheet: focus trap, Esc, top layer, and focus returns to the
// opener on close. Local data only, so it works offline.

interface Entry {
  key: string
  label: string
  detail?: string
  keywords: string[]
  project?: ProjectMeta
  hint?: string
  run: () => void
}

interface Props {
  open: boolean
  onClose: () => void
  onShowShortcuts: () => void
}

export function CommandPalette({ open, onClose, onShowShortcuts }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const navigate = useNavigate()
  const { permitted } = useVisibleProjects()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const listId = useId()

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) {
      setQuery('')
      setActive(0)
      d.showModal()
      inputRef.current?.focus()
    } else if (!open && d.open) d.close()
  }, [open])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  const entries = useMemo<Entry[]>(() => {
    const go = (path: string) => () => {
      onClose()
      void navigate(path)
    }
    const actions: Entry[] = [
      {
        key: 'a:home',
        label: 'Home',
        keywords: ['dashboard', 'start'],
        run: go('/'),
      },
      {
        key: 'a:sidebar',
        label: 'Toggle sidebar',
        keywords: ['collapse', 'expand', 'menu'],
        hint: comboLabel(shortcutFor('sidebar').combo),
        run: () => {
          onClose()
          toggleSidebarCollapsed()
        },
      },
      {
        key: 'a:help',
        label: 'Show keyboard shortcuts',
        keywords: ['help', 'keys', 'hotkeys'],
        hint: comboLabel(shortcutFor('help').combo),
        run: () => {
          onClose()
          onShowShortcuts()
        },
      },
    ]
    const list: Entry[] = permitted.map((p) => ({
      key: `p:${p.id}`,
      label: p.name,
      detail: areas[p.area].name,
      keywords: [areas[p.area].name, p.id.replace(/-/g, ' '), p.description],
      project: p,
      run: go(p.path),
    }))
    return [...list, ...actions]
  }, [permitted, navigate, onClose, onShowShortcuts])

  const results = useMemo(
    () =>
      rankItems(query, entries, (e) => ({
        label: e.label,
        keywords: e.keywords,
      })),
    [query, entries],
  )
  const idx = Math.min(active, Math.max(results.length - 1, 0))

  useEffect(() => {
    listRef.current?.children[idx]?.scrollIntoView({ block: 'nearest' })
  }, [idx, results])

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.nativeEvent.isComposing) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive(results.length ? (idx + 1) % results.length : 0)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive(results.length ? (idx - 1 + results.length) % results.length : 0)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      results[idx]?.run()
    }
  }

  const optionId = (i: number) => `${listId}-opt-${i}`

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
      aria-label="Command palette"
      className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 text-slate-900 backdrop:bg-black/50 open:flex open:items-start open:justify-center dark:text-slate-100"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="mx-3 mt-[max(1rem,env(safe-area-inset-top))] flex max-h-[min(32rem,80dvh)] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl sm:mt-[12vh] dark:bg-slate-900 dark:ring-1 dark:ring-slate-700"
      >
        <div className="flex shrink-0 items-center gap-2 border-b border-slate-200 px-3 dark:border-slate-700">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            width={18}
            height={18}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            className="shrink-0 text-slate-400"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActive(0)
            }}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={results.length ? optionId(idx) : undefined}
            aria-autocomplete="list"
            aria-label="Search projects and actions"
            placeholder="Jump to a project or action"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            enterKeyHint="go"
            className="h-12 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={`flex size-10 shrink-0 items-center justify-center rounded-lg text-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 ${FOCUS_RING_INSET}`}
          >
            ✕
          </button>
        </div>
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label="Results"
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2"
        >
          {results.map((r, i) => (
            <li
              key={r.key}
              id={optionId(i)}
              role="option"
              aria-selected={i === idx}
              onMouseMove={() => i !== idx && setActive(i)}
              onClick={() => r.run()}
              className={`flex min-h-10 cursor-pointer items-center gap-3 rounded-lg px-3 py-1 text-sm ${
                i === idx
                  ? 'bg-(--accent-soft) font-semibold text-slate-900 dark:text-white'
                  : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              {r.project ? (
                <ProjectIcon project={r.project} size="sm" />
              ) : (
                <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center text-slate-400">
                  ›
                </span>
              )}
              <span className="min-w-0 flex-1 truncate">{r.label}</span>
              {r.detail && (
                <span className="shrink-0 truncate text-xs font-normal text-slate-500 dark:text-slate-400">
                  {r.detail}
                </span>
              )}
              {r.hint && (
                <kbd className="shrink-0 rounded-md border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-sans text-xs font-medium text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {r.hint}
                </kbd>
              )}
            </li>
          ))}
          {results.length === 0 && (
            <li role="presentation" className="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
              Nothing matches “{query}”
            </li>
          )}
        </ul>
        <button
          type="button"
          onClick={() => {
            onClose()
            onShowShortcuts()
          }}
          className={`shrink-0 border-t border-slate-200 px-4 py-2 text-left text-xs text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 ${FOCUS_RING_INSET}`}
        >
          Press{' '}
          <kbd className="rounded border border-slate-300 bg-slate-100 px-1 font-sans dark:border-slate-600 dark:bg-slate-800">
            ?
          </kbd>{' '}
          for all shortcuts
        </button>
      </div>
    </dialog>
  )
}
