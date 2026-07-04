// Fixed-bottom, safe-area-aware toast with an "Undo" action — same visual
// family as UpdateToast.tsx. Pair with useUndoSnackbar.ts: render
// `pending && <Snackbar label={pending.label} onUndo={confirmUndo} />`.

interface SnackbarProps {
  label: string
  onUndo: () => void
}

export function Snackbar({ label, onUndo }: SnackbarProps) {
  return (
    <div
      className="fixed inset-x-0 z-20 flex justify-center px-4"
      style={{ bottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}
    >
      <div className="flex items-center gap-2 rounded-full bg-white py-2 pl-4 pr-2 text-sm font-medium text-slate-900 shadow-lg ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700">
        <span className="min-w-0 truncate">{label}</span>
        <button
          type="button"
          onClick={onUndo}
          className="min-h-10 shrink-0 rounded-full px-3 font-semibold text-indigo-600 transition-colors hover:text-indigo-500 active:bg-slate-100 dark:text-indigo-300 dark:hover:text-indigo-200 dark:active:bg-slate-700"
        >
          Undo
        </button>
      </div>
    </div>
  )
}
