// Stand-in for the event photo: a tinted tile with the category's glyph, so
// every card has the same shape whether or not its source gave an image.

const LOOK: Record<string, { glyph: string; tone: string }> = {
  boardgames: { glyph: '🎲', tone: 'from-emerald-200 to-emerald-400 dark:from-emerald-900 dark:to-emerald-700' },
  nerd: { glyph: '🎮', tone: 'from-violet-200 to-violet-400 dark:from-violet-900 dark:to-violet-700' },
  creative: { glyph: '🎨', tone: 'from-pink-200 to-pink-400 dark:from-pink-900 dark:to-pink-700' },
  theatre: { glyph: '🎭', tone: 'from-rose-200 to-rose-400 dark:from-rose-900 dark:to-rose-700' },
  exhibitions: { glyph: '🖼️', tone: 'from-amber-200 to-amber-400 dark:from-amber-900 dark:to-amber-700' },
  concerts: { glyph: '🎵', tone: 'from-indigo-200 to-indigo-400 dark:from-indigo-900 dark:to-indigo-700' },
  cinema: { glyph: '🎬', tone: 'from-slate-300 to-slate-500 dark:from-slate-700 dark:to-slate-500' },
  talks: { glyph: '🎤', tone: 'from-sky-200 to-sky-400 dark:from-sky-900 dark:to-sky-700' },
  food: { glyph: '🍷', tone: 'from-red-200 to-red-400 dark:from-red-900 dark:to-red-700' },
  tours: { glyph: '🧭', tone: 'from-teal-200 to-teal-400 dark:from-teal-900 dark:to-teal-700' },
  outdoor: { glyph: '🥾', tone: 'from-lime-200 to-lime-400 dark:from-lime-900 dark:to-lime-700' },
  festivals: { glyph: '🎪', tone: 'from-orange-200 to-orange-400 dark:from-orange-900 dark:to-orange-700' },
  other: { glyph: '📍', tone: 'from-slate-200 to-slate-400 dark:from-slate-700 dark:to-slate-600' },
}

export function CategoryThumb({ category, className = '' }: { category: string; className?: string }) {
  const look = LOOK[category] ?? LOOK.other
  return (
    <div
      aria-hidden
      className={`flex shrink-0 items-center justify-center bg-gradient-to-br text-3xl ${look?.tone ?? ''} ${className}`}
    >
      {look?.glyph}
    </div>
  )
}
