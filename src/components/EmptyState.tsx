interface Props {
  emoji: string
  title: string
  hint?: string
}

export function EmptyState({ emoji, title, hint }: Props) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-700 px-6 py-12 text-center">
      <span className="text-4xl">{emoji}</span>
      <p className="font-medium text-slate-300">{title}</p>
      {hint && <p className="text-sm text-slate-500">{hint}</p>}
    </div>
  )
}
