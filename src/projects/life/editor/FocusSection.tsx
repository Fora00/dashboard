import { SectionTitle } from '../../../components/SectionTitle'
import { INPUT } from '../../../components/field'
import { LIFE_CAPS } from '../model'
import { Button } from '../../../components/Button'
import { Card } from '../../../components/Card'
import { newId, removeAt, removeBtnClass, updateAt, type FocusRow } from './rows'

export function FocusSection({ focus, setFocus }: { focus: FocusRow[]; setFocus: (v: FocusRow[]) => void }) {
  return (
    <section className="mb-6">
      <SectionTitle>Focus</SectionTitle>
      <Card className="space-y-2">
        {focus.map((f, i) => (
          <div key={f.id} className="flex items-center gap-2">
            <input
              value={f.title}
              onChange={(e) => setFocus(updateAt(focus, i, { title: e.target.value }))}
              maxLength={LIFE_CAPS.focusTitle}
              placeholder="Focus title…"
              aria-label={`Focus ${i + 1}`}
              className={INPUT}
            />
            <button
              type="button"
              onClick={() => setFocus(removeAt(focus, i))}
              aria-label="Remove focus item"
              className={removeBtnClass}
            >
              ✕
            </button>
          </div>
        ))}
        {focus.length < LIFE_CAPS.focus && (
          <Button variant="ghost" onClick={() => setFocus([...focus, { id: newId(), title: '' }])}>
            + Add focus
          </Button>
        )}
      </Card>
    </section>
  )
}
