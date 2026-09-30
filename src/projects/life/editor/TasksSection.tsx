import { LIFE_CAPS, THINGS_WHEN_KEYWORDS } from '../model'
import { Button } from '../../../components/Button'
import { Card } from '../../../components/Card'
import { inputClass, newId, removeAt, removeBtnClass, textareaClass, updateAt, type TaskRow, type WhenMode } from './rows'

export function TasksSection({ tasks, setTasks }: { tasks: TaskRow[]; setTasks: (v: TaskRow[]) => void }) {
  return (
    <section className="mb-6">
      <h2 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Tasks</h2>
      <div className="space-y-2">
        {tasks.map((t, i) => (
          <Card key={t.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                value={t.title}
                onChange={(e) => setTasks(updateAt(tasks, i, { title: e.target.value }))}
                maxLength={LIFE_CAPS.taskTitle}
                placeholder="Task title…"
                aria-label="Task title"
                className={`${inputClass} flex-1`}
              />
              <button
                type="button"
                onClick={() => setTasks(removeAt(tasks, i))}
                aria-label={`Remove task ${t.title || i + 1}`}
                className={removeBtnClass}
              >
                ✕
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={t.whenMode}
                onChange={(e) => setTasks(updateAt(tasks, i, { whenMode: e.target.value as WhenMode }))}
                aria-label="When"
                className={`${inputClass} w-32`}
              >
                <option value="none">No date</option>
                <option value="date">Date</option>
                <option value="keyword">Keyword</option>
              </select>
              {t.whenMode === 'date' && (
                <input
                  type="date"
                  value={t.whenDate}
                  onChange={(e) => setTasks(updateAt(tasks, i, { whenDate: e.target.value }))}
                  aria-label="When date"
                  className={`${inputClass} w-40`}
                />
              )}
              {t.whenMode === 'keyword' && (
                <select
                  value={t.whenKeyword}
                  onChange={(e) => setTasks(updateAt(tasks, i, { whenKeyword: e.target.value }))}
                  aria-label="When keyword"
                  className={`${inputClass} w-32`}
                >
                  {THINGS_WHEN_KEYWORDS.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="w-20 shrink-0 text-xs text-slate-500 dark:text-slate-400">Deadline</span>
              <input
                type="date"
                value={t.deadline}
                onChange={(e) => setTasks(updateAt(tasks, i, { deadline: e.target.value }))}
                aria-label="Deadline"
                className={`${inputClass} w-40`}
              />
            </div>

            <div className="flex gap-2">
              <input
                value={t.area}
                onChange={(e) => setTasks(updateAt(tasks, i, { area: e.target.value, listId: '' }))}
                maxLength={LIFE_CAPS.areaProject}
                placeholder="Area…"
                aria-label="Area"
                className={inputClass}
              />
              <input
                value={t.project}
                onChange={(e) => setTasks(updateAt(tasks, i, { project: e.target.value, listId: '' }))}
                maxLength={LIFE_CAPS.areaProject}
                placeholder="Project…"
                aria-label="Project"
                className={inputClass}
              />
            </div>

            {t.listId && (
              <p className="text-xs text-slate-400 dark:text-slate-500">
                🔗 Linked to Things: stays in the right list even if you rename it there.
              </p>
            )}

            <input
              value={t.tags}
              onChange={(e) => setTasks(updateAt(tasks, i, { tags: e.target.value }))}
              placeholder="tags, comma, separated…"
              aria-label="Tags"
              className={inputClass}
            />

            <textarea
              value={t.notes}
              onChange={(e) => setTasks(updateAt(tasks, i, { notes: e.target.value }))}
              maxLength={LIFE_CAPS.taskNotes}
              placeholder="Notes…"
              rows={2}
              aria-label="Notes"
              className={textareaClass}
            />
          </Card>
        ))}
      </div>
      {tasks.length < LIFE_CAPS.tasks && (
        <div className="mt-2">
          <Button
            variant="ghost"
            onClick={() =>
              setTasks([
                ...tasks,
                {
                  id: newId(),
                  title: '',
                  whenMode: 'none',
                  whenDate: '',
                  whenKeyword: THINGS_WHEN_KEYWORDS[0],
                  deadline: '',
                  area: '',
                  project: '',
                  listId: '',
                  tags: '',
                  notes: '',
                },
              ])
            }
          >
            + Add task
          </Button>
        </div>
      )}
    </section>
  )
}
