// Live Ripasso queue from Dexie (shared by the page and the Learning home).
import { useLiveQuery } from 'dexie-react-hooks'
import { useMemo } from 'react'
import { dayKey } from '../../../lib/dates'
import { db } from '../../../lib/db'
import { buildQueue, sourcesOf, type Queue, type QueueItem } from '../engine/review'

/** Live queue for `today`; `undefined` while Dexie loads. `keep` drops items whose content no longer exists. */
export function useQueue(today: string, keep?: (i: QueueItem) => boolean): Queue | undefined {
  const rows = useLiveQuery(async () => {
    const [cards, quiz, reviews] = await Promise.all([
      db.learningCards.toArray(),
      db.learningQuiz.toArray(),
      db.learningReviews.toArray(),
    ])
    return { cards, quiz, reviews }
  }, [])
  return useMemo(() => {
    if (!rows) return undefined
    const sources = sourcesOf(rows.cards, rows.quiz).filter((s) => !keep || keep({ ...s, step: 0, due: '' }))
    return buildQueue(sources, rows.reviews, today)
  }, [rows, today, keep])
}

export const today = () => dayKey(new Date())
