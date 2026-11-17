// One area of Learning (/learning/lingue, /learning/sviluppo, ...): its courses as compact rows.
import { Link } from 'react-router-dom'
import { courseGroups, courseMetas, type CourseGroupId } from '../courses/registry'
import { GroupRows } from './CourseRows'
import { useLoadCourses } from './useLoadCourses'

export function GroupPage({ groupId }: { groupId: CourseGroupId }) {
  const g = courseGroups.find((x) => x.id === groupId)!
  useLoadCourses(courseMetas.filter((m) => m.group === groupId).map((m) => m.id))
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Link
          to="/learning"
          className="mb-3 inline-block text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        >
          ← Learning
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">
          <span className="mr-2">{g.emoji}</span>
          {g.title}
        </h1>
      </div>
      <GroupRows groupId={groupId} />
    </div>
  )
}
