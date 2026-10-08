import { Chip } from '../../components/Chip'
import { FOCUS_RING_INSET } from '../../components/focus'

/**
 * Tag filter bar. Scrolls horizontally with a full-bleed gutter so chips
 * don't clip on a phone; Clear sits first so it never scrolls out of reach.
 * Rendered while a selection exists even if its tags are gone, otherwise the
 * filter could get stuck on with no way out.
 */
export function TagFilterBar({
  allTags,
  selectedTags,
  filtering,
  onToggle,
  onClear,
  onManage,
}: {
  allTags: string[]
  selectedTags: string[]
  filtering: boolean
  onToggle: (tag: string) => void
  onClear: () => void
  onManage: () => void
}) {
  if (allTags.length === 0 && !filtering) return null
  return (
    <div className="-mx-4 mb-4 overflow-x-auto px-4 pb-1">
      <div className="flex w-max items-center gap-2">
        {filtering && (
          <Chip toggle={false} active={false} onClick={onClear}>
            ✕ Clear
          </Chip>
        )}
        {allTags.map((tag) => (
          <Chip
            key={tag}
            active={selectedTags.includes(tag)}
            onClick={() => onToggle(tag)}
            className="max-w-48 truncate"
          >
            {tag}
          </Chip>
        ))}
        {allTags.length > 0 && (
          <button
            type="button"
            onClick={() => onManage()}
            className={`min-h-10 shrink-0 rounded-full px-3 text-xs whitespace-nowrap text-slate-500 underline-offset-2 hover:underline dark:text-slate-400 ${FOCUS_RING_INSET}`}
          >
            Manage tags
          </button>
        )}
      </div>
    </div>
  )
}
