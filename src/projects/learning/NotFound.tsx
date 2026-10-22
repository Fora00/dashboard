import { Link } from 'react-router-dom'
import { EmptyState } from '../../components/EmptyState'

export function NotFound({ what }: { what: string }) {
  return (
    <div>
      <EmptyState emoji="🔎" title={`${what} not found`} />
      <Link to="/learning" className="mt-4 inline-block text-sm text-slate-500 underline">
        ← Learning
      </Link>
    </div>
  )
}
