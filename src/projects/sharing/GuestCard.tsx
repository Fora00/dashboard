import { shareable } from './shareable'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { chip, type Area, type Guest } from './shared'

interface GuestCardProps {
  guest: Guest
  areas: Area[]
  busy: boolean
  onRemove: () => void
  // `shopEnabled` current state: true means the tap turns it off.
  onToggleShop: (enabled: boolean) => void
  onToggleMembership: (projectId: string) => void
  onToggleArea: (areaId: string) => void
}

export function GuestCard({
  guest: g,
  areas,
  busy,
  onRemove,
  onToggleShop,
  onToggleMembership,
  onToggleArea,
}: GuestCardProps) {
  const shopEnabled = g.areas.length > 0 || g.memberships.includes('shop-list')
  return (
    <li>
      <Card className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <span className="min-w-0 truncate text-sm">{g.email}</span>
          <Button variant="danger" disabled={busy} onClick={onRemove}>
            Remove
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => onToggleShop(shopEnabled)}
            className={chip(shopEnabled, 'emerald')}
          >
            🛒 Shop List {shopEnabled ? '✓' : ''}
          </button>
          {shareable.map((p) => {
            const on = g.memberships.includes(p.id)
            return (
              <button
                key={p.id}
                type="button"
                disabled={busy}
                onClick={() => onToggleMembership(p.id)}
                className={chip(on, 'emerald')}
              >
                {p.emoji} {p.name} {on ? '✓' : ''}
              </button>
            )
          })}
        </div>
        {shopEnabled && areas.length > 0 && (
          <div className="space-y-2 border-t border-slate-200 pt-3 dark:border-slate-800">
            <p className="text-xs text-slate-500">Shop areas this guest can use</p>
            <div className="flex flex-wrap gap-2">
              {areas.map((a) => {
                const on = g.areas.includes(a.id)
                return (
                  <button
                    key={a.id}
                    type="button"
                    disabled={busy}
                    onClick={() => onToggleArea(a.id)}
                    className={chip(on, 'emerald')}
                  >
                    {a.name} {on ? '✓' : ''}
                  </button>
                )
              })}
            </div>
            {g.areas.length === 0 && (
              <p className="text-xs text-amber-700 dark:text-amber-400">
                No area granted yet — tap one above so this guest can see items.
              </p>
            )}
          </div>
        )}
      </Card>
    </li>
  )
}
