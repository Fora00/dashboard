import { createElement } from 'react'
import { areas } from '../lib/areas'
import type { ProjectMeta } from '../lib/projects'
import { projectIcons } from './projectIcons'

const SIZES = {
  md: {
    box: 'h-11 w-11 rounded-xl',
    glyph: 24,
    dot: 'h-3.5 w-3.5 -bottom-1 -right-1',
    emoji: 'text-2xl',
  },
  sm: {
    box: 'h-8 w-8 rounded-lg',
    glyph: 18,
    dot: 'h-2.5 w-2.5 -bottom-0.5 -right-0.5',
    emoji: 'text-lg',
  },
} as const

// Solid tile in the project's AREA colour, white Lucide glyph, and a small dot
// in the project's own colour at the bottom-right. Decorative: the project
// name is always printed next to it. Unknown icon name => the emoji.
export function ProjectIcon({ project, size = 'md' }: { project: ProjectMeta; size?: 'md' | 'sm' }) {
  const s = SIZES[size]
  const elements = projectIcons[project.icon]
  const base = areas[project.area].color
  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex shrink-0 align-middle items-center justify-center text-white shadow-sm ${s.box}`}
      style={{
        backgroundImage: `linear-gradient(135deg, ${base}, color-mix(in srgb, ${base} 70%, black))`,
      }}
    >
      {elements ? (
        <svg
          viewBox="0 0 24 24"
          width={s.glyph}
          height={s.glyph}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {elements.map(([tag, attrs], i) => createElement(tag, { key: i, ...attrs }))}
        </svg>
      ) : (
        <span className={s.emoji}>{project.emoji}</span>
      )}
      <span
        className={`absolute rounded-full ring-2 ring-white dark:ring-slate-900 ${s.dot}`}
        style={{ backgroundColor: project.color }}
      />
    </span>
  )
}
