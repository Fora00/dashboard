import { SectionTitle } from '../../../components/SectionTitle'
import { INPUT } from '../../../components/field'
import { LIFE_CAPS } from '../model'
import { Button } from '../../../components/Button'
import { Card } from '../../../components/Card'
import { newKey, removeAt, removeBtnClass, updateAt, type RuleRow } from './rows'

export function RulesSection({ rules, setRules }: { rules: RuleRow[]; setRules: (v: RuleRow[]) => void }) {
  return (
    <section className="mb-6">
      <SectionTitle>Rules</SectionTitle>
      <Card className="space-y-2">
        {rules.map((r, i) => (
          <div key={r.key} className="flex items-center gap-2">
            <input
              value={r.text}
              onChange={(e) => setRules(updateAt(rules, i, { text: e.target.value }))}
              maxLength={LIFE_CAPS.rule}
              placeholder="Rule…"
              aria-label={`Rule ${i + 1}`}
              className={INPUT}
            />
            <button
              type="button"
              onClick={() => setRules(removeAt(rules, i))}
              aria-label="Remove rule"
              className={removeBtnClass}
            >
              ✕
            </button>
          </div>
        ))}
        {rules.length < LIFE_CAPS.rules && (
          <Button variant="ghost" onClick={() => setRules([...rules, { key: newKey(), text: '' }])}>
            + Add rule
          </Button>
        )}
      </Card>
    </section>
  )
}
