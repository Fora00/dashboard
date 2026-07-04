import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'ghost' | 'danger'

const styles: Record<Variant, string> = {
  primary:
    'bg-indigo-500 text-white hover:bg-indigo-400 active:bg-indigo-600 disabled:bg-slate-200 disabled:text-slate-500 dark:disabled:bg-slate-700 dark:disabled:text-slate-400',
  ghost:
    'bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300 disabled:text-slate-500 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:active:bg-slate-600',
  danger:
    'bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 active:bg-rose-500/30 dark:text-rose-400',
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

export function Button({ variant = 'primary', className = '', ...rest }: Props) {
  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg px-3.5 text-sm font-medium transition-colors disabled:cursor-not-allowed ${styles[variant]} ${className}`}
      {...rest}
    />
  )
}
