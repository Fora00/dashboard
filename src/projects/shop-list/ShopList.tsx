import { PageHeader } from '../../components/PageHeader'
import { EmptyState } from '../../components/EmptyState'

// Placeholder — next project in ROADMAP.md.
// Planned: groceries todo backed by db.shopItems (schema already exists),
// sharable with whitelisted guest emails once Supabase sync lands.
export function ShopList() {
  return (
    <div>
      <PageHeader
        emoji="🛒"
        title="Shop List"
        subtitle="Sharable groceries list — coming soon."
      />
      <EmptyState
        emoji="🚧"
        title="Not built yet"
        hint="This is the next project on the roadmap. The data schema is already in place."
      />
    </div>
  )
}
