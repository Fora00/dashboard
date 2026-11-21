import type { ComponentProps } from 'react'
import { FOCUS_RING } from './focus'

export type ButtonVariant = 'primary' | 'ghost' | 'danger'

// Exported as plain class strings too, so non-React UI (the Zine editor builds its DOM by hand) uses the
// exact same look: buttonClass(), ICON_BUTTON.
const BUTTON_BASE = `inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg px-3.5 text-sm font-medium transition-colors disabled:cursor-not-allowed ${FOCUS_RING}`

const styles: Record<ButtonVariant, string> = {
  primary:
    // Project accent (index.css / lib/accent.ts); indigo-500/400/600 + white off-project.
    'bg-(color:--accent) text-(color:--accent-fg) hover:bg-(color:--accent-hover) active:bg-(color:--accent-active) disabled:bg-slate-200 disabled:text-slate-500 dark:disabled:bg-slate-700 dark:disabled:text-slate-400',
  ghost:
    'bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300 disabled:text-slate-500 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:active:bg-slate-600',
  danger: 'bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 active:bg-rose-500/30 dark:text-rose-400',
}

/** The <Button> classes for a variant, for markup built outside React. */
export function buttonClass(variant: ButtonVariant = 'primary'): string {
  return `${BUTTON_BASE} ${styles[variant]}`
}

/** Square 40px icon-only button (header actions, sheet close). */
export const ICON_BUTTON = `flex size-10 shrink-0 items-center justify-center rounded-lg text-lg text-slate-500 hover:bg-slate-100 active:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:active:bg-slate-700 ${FOCUS_RING}`

interface Props extends ComponentProps<'button'> {
  variant?: ButtonVariant
}

export function Button({ variant = 'primary', className = '', ...rest }: Props) {
  return <button className={`${buttonClass(variant)} ${className}`} {...rest} />
}
