import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'ghost' | 'danger'

const styles: Record<Variant, string> = {
  primary:
    'bg-indigo-500 text-white hover:bg-indigo-400 active:bg-indigo-600 disabled:bg-slate-700 disabled:text-slate-400',
  ghost:
    'bg-slate-800 text-slate-200 hover:bg-slate-700 active:bg-slate-600 disabled:text-slate-500',
  danger:
    'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 active:bg-rose-500/30',
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
