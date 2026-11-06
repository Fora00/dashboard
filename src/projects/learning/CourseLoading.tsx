import { Skeleton, SkeletonList } from '../../components/Skeleton'

// Placeholder while a course chunk loads (first open of a course on this device).
export function CourseLoading() {
  return (
    <div aria-busy="true" aria-label="Caricamento corso">
      <Skeleton className="mb-4 h-8 w-2/3" />
      <SkeletonList rows={5} rowClassName="h-14" />
    </div>
  )
}
