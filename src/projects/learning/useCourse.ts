import { useEffect, useState } from 'react'
import { courseMetaById, loadCourse, loadedCourse } from './courses/registry'
import type { Course } from './types'

export type CourseStatus = 'loading' | 'ready' | 'missing'

/** Lazy course content: sync when the chunk is already loaded, otherwise loads it once. */
export function useCourse(id: string | undefined): { course?: Course; status: CourseStatus } {
  const [, bump] = useState(0)
  const cached = id ? loadedCourse(id) : undefined
  const known = id ? courseMetaById(id) !== undefined : false
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    if (!id || cached || !known) return
    let live = true
    loadCourse(id).then(
      () => live && bump((n) => n + 1),
      () => live && setFailed(true),
    )
    return () => {
      live = false
    }
  }, [id, cached, known])
  if (cached) return { course: cached, status: 'ready' }
  if (!known || failed) return { status: 'missing' }
  return { status: 'loading' }
}
