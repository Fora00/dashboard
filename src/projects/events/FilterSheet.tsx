import { Sheet } from '../../components/Sheet'
import { Button } from '../../components/Button'
import { FilterPanel, type FilterPanelProps } from './FilterPanel'

interface Props extends FilterPanelProps {
  open: boolean
  onClose: () => void
}

/** Filters in a bottom sheet (below lg); the rail on wide screens renders the same FilterPanel inline. */
export function FilterSheet({ open, onClose, ...p }: Props) {
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Filters"
      footer={
        <div className="flex gap-2">
          <Button variant="ghost" onClick={p.onClearAll}>
            Clear all
          </Button>
          <Button className="flex-1" onClick={onClose}>
            Show {p.total} {p.total === 1 ? 'event' : 'events'}
          </Button>
        </div>
      }
    >
      {open && <FilterPanel variant="sheet" {...p} />}
    </Sheet>
  )
}
