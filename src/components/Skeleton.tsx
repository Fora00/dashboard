// Tiny theme-aware pulse block for loading placeholders. Sized like the real
// content it stands in for (row height, badge width, …) so nothing shifts
// layout once useLiveQuery resolves.

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800 ${className}`}
      aria-hidden
    />
  )
}

interface SkeletonListProps {
  rows?: number
  /** Row height class, e.g. "h-12" to match a real list row. */
  rowClassName?: string
  className?: string
}

// N stacked row-height blocks — drop-in for a list that renders nothing
// while useLiveQuery is still `undefined`. Matches the `space-y-2` rhythm
// used by the real todo/shop-item lists.
export function SkeletonList({ rows = 3, rowClassName = 'h-12', className = '' }: SkeletonListProps) {
  return (
    <div className={`space-y-2 ${className}`} aria-hidden>
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className={`w-full ${rowClassName}`} />
      ))}
    </div>
  )
}
