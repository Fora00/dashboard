import { useLazyChunk, type ChunkStatus } from '../../../lib/useLazyChunk'
import { courseMetaById, loadCourse, loadedCourse } from '../courses/registry'
import type { Course } from './types'

export type CourseStatus = ChunkStatus

/** Lazy course content: sync when the chunk is already loaded, otherwise loads it once. */
export function useCourse(id: string | undefined): { course?: Course; status: CourseStatus } {
  const { value, status } = useLazyChunk(
    id,
    id ? loadedCourse(id) : undefined,
    id ? courseMetaById(id) !== undefined : false,
    loadCourse,
  )
  return value ? { course: value, status } : { status }
}
