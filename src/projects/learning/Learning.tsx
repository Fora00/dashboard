import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { CoursePage } from './course/CoursePage'
import { DiaryPage } from './course/DiaryPage'
import { courseGroups } from './courses/registry'
import { GroupPage } from './home/GroupPage'
import { HomePage } from './home/HomePage'
import { ModulePage } from './module/ModulePage'
import ReviewPage from './review/ReviewPage'
import { CourseLoading } from './ui/CourseLoading'
import { useVocabKeyMigration } from './vocab/store'

// Routes only; see docs/COURSES.md for the folder map.
// The vocabulary page is its own chunk (its words come in one more chunk per language, see vocab/index.ts).
const VocabPage = lazy(() => import('./vocab/VocabPage'))

export function Learning() {
  // Rewrites theme-keyed Vocabolario rows to word-keyed ones whenever any are present (vocab/progress.ts).
  useVocabKeyMigration()
  return (
    <Routes>
      <Route index element={<HomePage />} />
      {/* Static segment: ranks above :courseId. */}
      <Route
        path="vocabolario/*"
        element={
          <Suspense fallback={<CourseLoading />}>
            <VocabPage />
          </Suspense>
        }
      />
      <Route path="ripasso" element={<ReviewPage />} />
      {/* Areas: static segments too (a test keeps course ids distinct from these). */}
      {courseGroups.map((g) => (
        <Route key={g.id} path={g.id} element={<GroupPage groupId={g.id} />} />
      ))}
      <Route path=":courseId" element={<CoursePage />} />
      {/* Static segment: ranks above :moduleId, so no module can shadow it. */}
      <Route path=":courseId/diario" element={<DiaryPage />} />
      <Route path=":courseId/:moduleId" element={<ModulePage />} />
    </Routes>
  )
}
