// Reading the learner's state: pages use useLiveQuery over Dexie and mutate only
// through src/lib/learningSync.ts (which also queues the cloud sync).
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../lib/db'
import type { CourseState } from './progress'

/** Live state of one course; `undefined` while the first read is loading. */
export function useCourseState(courseId: string): CourseState | undefined {
  return useLiveQuery(async () => {
    const [quiz, cards, practice] = await Promise.all([
      db.learningQuiz.where('courseId').equals(courseId).toArray(),
      db.learningCards.where('courseId').equals(courseId).toArray(),
      db.learningPractice.where('courseId').equals(courseId).toArray(),
    ])
    return { quiz, cards, practice }
  }, [courseId])
}
