import { ProjectLink } from '../../../components/ProjectLink'
import { ProgressBar } from '../../learning/ProgressBar'
import { describeLearningActivity, type LearningWeek } from '../model'
import { CollapsibleSection } from './CollapsibleSection'

// The week's Learning activity (quiz answers, cards known, practice ticked),
// read-only: Learning is where you study. Same idea as FoodSection. The
// progress bar is overall progress NOW; the activity line is the week's.
export function LearningSection({
  learning,
  open,
  onToggle,
  readOnly,
}: {
  learning: LearningWeek | null
  open: boolean
  onToggle: () => void
  readOnly: boolean
}) {
  if (!learning || learning.courses.length === 0) return null
  const items = learning.courses.reduce((n, c) => n + c.quiz + c.cards + c.practice, 0)
  const summary = learning.active ? `${items} item${items === 1 ? '' : 's'} this week` : 'nothing yet this week'
  return (
    <CollapsibleSection title="🎓 Learning" summary={summary} open={open} onToggle={onToggle} readOnly={readOnly}>
      <ul className="space-y-4">
        {learning.courses.map((c) => (
          <li key={c.courseId} className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="min-w-0 truncate font-medium">
                {c.emoji} {c.title}
              </span>
              <span className="shrink-0 text-slate-500 tabular-nums dark:text-slate-400">{c.percent}%</span>
            </div>
            <ProgressBar percent={c.percent} label={`${c.title}: progress`} />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              This week: {describeLearningActivity(c)}
              {c.days.length > 0 && (
                <span className="text-slate-500 dark:text-slate-400">
                  {' '}
                  · {c.days.length} day{c.days.length === 1 ? '' : 's'}
                </span>
              )}
            </p>
            {!readOnly && c.next && (
              <div className="-ml-2">
                <ProjectLink id="learning" path={`/${c.courseId}/${c.next.moduleId}`}>
                  Continue: {c.next.title} ({c.next.percent}%)
                </ProjectLink>
              </div>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        From Learning; study there. Progress is overall, activity is this week's.
      </p>
      {!readOnly && (
        <div className="mt-1 -ml-2">
          <ProjectLink id="learning">Open Learning</ProjectLink>
        </div>
      )}
    </CollapsibleSection>
  )
}
