import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import { FOCUS_RING_INSET } from './focus'

// The bordered, rounded, tappable row of Todo / Links / Trips / Shop list.
// Layout (flex, min-h, padding) stays at the call site; this owns the
// surface, hover/active states and the keyboard focus ring.

const ROW =
  'rounded-lg border border-slate-200 bg-white transition-colors hover:border-slate-400 active:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-600 dark:active:bg-slate-800'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button' }
type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & { as: 'a' }

export function ListRow(props: ButtonProps | AnchorProps) {
  if (props.as === 'a') {
    const { as: _as, className = '', ...rest } = props
    return <a className={`${ROW} ${FOCUS_RING_INSET} ${className}`} {...rest} />
  }
  const { as: _as, className = '', type = 'button', ...rest } = props
  return <button type={type} className={`${ROW} ${FOCUS_RING_INSET} ${className}`} {...rest} />
}
