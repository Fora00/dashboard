import { useEffect, useState } from 'react'
import { dayKey, isMondayKey, weekKey } from './model'

/** Milliseconds from `now` to the next local midnight (at least 1 s, so a
 *  timer firing a hair early never re-arms for 0 ms). */
export function msUntilNextMidnight(now: Date): number {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  return Math.max(1000, next.getTime() - now.getTime())
}

/** Today's local day key and what derives from it. Pure, for tests. */
export function todayInfo(now: Date): {
  today: string
  week: string
  isMonday: boolean
  dow: number
} {
  const today = dayKey(now)
  return {
    today,
    week: weekKey(now),
    isMonday: isMondayKey(today),
    dow: now.getDay(),
  }
}

/**
 * Today's local day key ('YYYY-MM-DD'). Re-evaluates when the app returns to
 * the foreground (visibilitychange / focus) and by a timer at the next local
 * midnight, so an app left open overnight never logs onto yesterday.
 */
export function useToday(): string {
  const [today, setToday] = useState(() => dayKey(new Date()))

  useEffect(() => {
    const refresh = () => setToday(dayKey(new Date()))
    let timer: ReturnType<typeof setTimeout>
    const arm = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        refresh()
        arm()
      }, msUntilNextMidnight(new Date()))
    }
    const onWake = () => {
      refresh()
      arm()
    }
    arm()
    document.addEventListener('visibilitychange', onWake)
    window.addEventListener('focus', onWake)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('visibilitychange', onWake)
      window.removeEventListener('focus', onWake)
    }
  }, [])

  return today
}
