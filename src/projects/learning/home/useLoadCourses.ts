import { useEffect, useState } from 'react'
import { loadCourse } from '../courses/registry'

// Course content is lazy (own chunk per course). The list shows the lightweight meta at once and
// fills in the progress percentages as chunks arrive, one at a time while the browser is idle
// (all at once while searching).
const idle = () =>
  new Promise<void>((resolve) => {
    if (typeof requestIdleCallback === 'function') requestIdleCallback(() => resolve())
    else setTimeout(resolve, 200)
  })

/**
 * Loads these course chunks one per idle tick (all at once when `eager`), so progress percentages fill in without
 * blocking the first paint. Returns how many are ready.
 */
export function useLoadCourses(ids: readonly string[], eager = false): number {
  const [ready, setReady] = useState(0)
  const key = ids.join(',')
  useEffect(() => {
    let live = true
    const list = key ? key.split(',') : []
    void (async () => {
      for (let i = 0; i < list.length && live; i++) {
        if (!eager) await idle()
        if (!live) return
        await loadCourse(list[i]!).catch(() => undefined)
        if (live) setReady(i + 1)
      }
    })()
    return () => {
      live = false
    }
    // Restarts (without the idle waits) once `eager` turns on; loaded chunks resolve at once.
  }, [key, eager])
  return ready
}
