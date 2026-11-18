import type { KeyboardEvent, ReactNode } from 'react'
import { FOCUS_RING_INSET } from './focus'

export interface SegmentOption<T extends string> {
  id: T
  label: ReactNode
}

type Variant = 'track' | 'chips' | 'joined'

interface Props<T extends string> {
  options: readonly SegmentOption<T>[]
  value: T
  onChange: (id: T) => void
  /** Accessible name of the group. */
  label: string
  /** 'tabs' (default): tablist with a tabpanel. 'choice': radiogroup, for a plain single-choice setting. */
  kind?: 'tabs' | 'choice'
  /**
   * track: pill track with a raised active segment (view tabs).
   * chips: separate accent-filled buttons (pass the grid via `className`).
   * joined: one bordered row of accent-filled segments.
   */
  variant?: Variant
  /** Replaces the container layout classes. */
  className?: string
}

const TRACK = 'flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 dark:bg-slate-800'
const ITEM: Record<Variant, string> = {
  track: 'min-h-10 shrink-0 flex-1 rounded-lg px-3 text-sm font-medium whitespace-nowrap',
  chips: 'min-h-10 rounded-lg px-2 text-sm font-medium transition-colors',
  joined: 'min-h-10 flex-1 border-2 px-3 text-sm font-medium transition-colors first:rounded-l-lg last:rounded-r-lg',
}
const ON: Record<Variant, string> = {
  track: 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100',
  chips: 'bg-(color:--accent-selected) text-(color:--accent-fg)',
  joined: 'border-(color:--accent-border) bg-(color:--accent-selected) text-(color:--accent-fg)',
}
const OFF: Record<Variant, string> = {
  track: 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200',
  chips: 'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700',
  joined:
    'border-slate-200 bg-white text-slate-600 hover:bg-slate-100 active:bg-slate-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800',
}

/** Single-choice segmented control with roving tabindex (Left/Right/Home/End move and select). */
export function SegmentedTabs<T extends string>({
  options,
  value,
  onChange,
  label,
  kind = 'tabs',
  variant = 'track',
  className,
}: Props<T>) {
  const tabs = kind === 'tabs'
  const active = options.some((o) => o.id === value) ? value : options[0]?.id

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const i = options.findIndex((o) => o.id === active)
    let next = -1
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % options.length
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + options.length) % options.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = options.length - 1
    if (next < 0) return
    const o = options[next]
    if (!o) return
    e.preventDefault()
    onChange(o.id)
    e.currentTarget.querySelectorAll<HTMLButtonElement>('button')[next]?.focus()
  }

  return (
    <div
      role={tabs ? 'tablist' : 'radiogroup'}
      aria-label={label}
      onKeyDown={onKeyDown}
      className={className ?? (variant === 'track' ? TRACK : 'flex')}
    >
      {options.map((o) => {
        const on = o.id === value
        return (
          <button
            key={o.id}
            type="button"
            role={tabs ? 'tab' : 'radio'}
            {...(tabs ? { 'aria-selected': on } : { 'aria-checked': on })}
            tabIndex={o.id === active ? 0 : -1}
            onClick={() => onChange(o.id)}
            className={`${ITEM[variant]} ${FOCUS_RING_INSET} ${on ? ON[variant] : OFF[variant]}`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
