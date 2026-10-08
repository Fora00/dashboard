import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { FOCUS_RING_INSET } from './focus'
import { rowTone } from './chipTone'

// Shared pill / row toggle. Selected is never colour alone: both states use a
// 2px border and the selected one gets a leading check glyph. All dark:
// variants live here.

const PILL_BASE =
  'min-h-10 shrink-0 rounded-full border-2 px-3.5 text-xs font-medium whitespace-nowrap transition-colors'
// Accent vars (index.css): indigo-700/600 light, 300/500 dark off-project.
const PILL_ON = 'border-(color:--accent-border) bg-(color:--accent-selected) text-(color:--accent-fg)'
const PILL_OFF =
  'border-slate-200 bg-white text-slate-600 hover:bg-slate-100 active:bg-slate-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800'

const ROW_BASE =
  'flex min-h-10 w-full items-center justify-between gap-2 rounded-lg border-2 px-3 text-left text-sm disabled:cursor-not-allowed'

interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onClick'> {
  active: boolean
  onClick: () => void
  count?: number
  /** 'pill' (default) is the compact rounded chip; 'row' a full-width option row with the count at the right. */
  shape?: 'pill' | 'row'
  /** false for plain action chips (Clear, Filters): no aria-pressed, no check glyph. */
  toggle?: boolean
  children: ReactNode
}

export function Chip({
  active,
  onClick,
  count,
  shape = 'pill',
  toggle = true,
  className = '',
  children,
  ...rest
}: Props) {
  const glyph = toggle && active ? '✓ ' : ''
  const shapeClass = shape === 'row' ? `${ROW_BASE} ${rowTone(active)}` : `${PILL_BASE} ${active ? PILL_ON : PILL_OFF}`
  return (
    <button
      type="button"
      aria-pressed={toggle ? active : undefined}
      onClick={onClick}
      className={`${shapeClass} ${FOCUS_RING_INSET} ${className}`}
      {...rest}
    >
      {shape === 'row' ? (
        <>
          <span className="truncate">
            {glyph}
            {children}
          </span>
          {count !== undefined && <span className="text-xs opacity-70">{count}</span>}
        </>
      ) : (
        <>
          {glyph}
          {children}
          {count !== undefined && <span className="ml-1 opacity-70">{count}</span>}
        </>
      )}
    </button>
  )
}
