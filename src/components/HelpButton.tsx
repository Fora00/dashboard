import { FOCUS_RING } from './focus'

export const HELP_LABEL = 'Keyboard shortcuts and gestures'

/**
 * The "?" button that opens the help sheet; the same component in the header
 * (below lg) and the sidebar footer (lg+). Native title plus a CSS-only
 * tooltip on hover/focus, only for pointer devices (`pointer-fine`), never
 * on touch.
 */
export function HelpButton({
  onClick,
  placement = 'below',
  className = '',
}: {
  onClick: () => void
  placement?: 'below' | 'above' | 'above-start'
  className?: string
}) {
  const pos =
    placement === 'below'
      ? 'top-full right-0 mt-2'
      : placement === 'above'
        ? 'bottom-full right-0 mb-2'
        : 'bottom-full left-0 mb-2'
  return (
    <span className="group relative inline-flex shrink-0">
      <button
        type="button"
        onClick={onClick}
        aria-label={HELP_LABEL}
        title={`${HELP_LABEL} (?)`}
        className={`flex size-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200/60 active:bg-slate-300/60 dark:text-slate-400 dark:hover:bg-slate-800 dark:active:bg-slate-700 ${FOCUS_RING} ${className}`}
      >
        <span aria-hidden="true" className="text-base font-semibold">
          ?
        </span>
      </button>
      <span
        aria-hidden="true"
        className={`pointer-events-none invisible absolute z-30 w-max rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity pointer-fine:group-focus-within:visible pointer-fine:group-focus-within:opacity-100 pointer-fine:group-hover:visible pointer-fine:group-hover:opacity-100 dark:bg-slate-100 dark:text-slate-900 ${pos}`}
      >
        {HELP_LABEL} (?)
      </span>
    </span>
  )
}
