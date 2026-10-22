export function ProgressBar({ percent, label }: { percent: number; label: string }) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
    >
      <div className="h-full rounded-full bg-(color:--accent) transition-[width]" style={{ width: `${percent}%` }} />
    </div>
  )
}
