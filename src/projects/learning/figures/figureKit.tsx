/* oxlint-disable react/only-export-components -- figure data file, not a hot-reloaded component module */
import type { ReactNode } from 'react'

// Shared helpers for the drawing course figures (figures*.tsx).
// Figures for the drawing course are drawn in code as SVG. Lessons reference them
// with <fig id="name">; the parser never lets raw SVG through. Outlines use
// currentColor (follows the theme); tones are fixed greys so a "light" value is
// light in both themes. Anything geometric is computed here, not typed by hand.

export const S = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const
export const DASH = { ...S, strokeWidth: 1.5, strokeDasharray: '4 4', opacity: 0.6 } as const
export const T = {
  fill: 'currentColor',
  fontSize: 14,
  fontFamily: 'system-ui, sans-serif',
  textAnchor: 'middle',
} as const

export const f = (n: number) => Math.round(n * 10) / 10

export function Svg({ w, h, label, children }: { w: number; h: number; label: string; children: ReactNode }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label}>
      {children}
    </svg>
  )
}

/** Elliptical arc from angle a0 to a1 (degrees, 0 = right, 90 = bottom/front). */
export function arc(cx: number, cy: number, rx: number, ry: number, a0: number, a1: number): string {
  const p = (a: number) => `${f(cx + rx * Math.cos((a * Math.PI) / 180))} ${f(cy + ry * Math.sin((a * Math.PI) / 180))}`
  return `M${p(a0)} A${rx} ${ry} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} ${a1 > a0 ? 1 : 0} ${p(a1)}`
}

/** Small numbered marker used instead of far-away labels. */
export function Dot({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={9} fill="#fff" stroke="#222" strokeWidth={1.5} />
      <text
        x={x}
        y={y + 5}
        fill="#111"
        fontSize={13}
        fontWeight={700}
        fontFamily="system-ui, sans-serif"
        textAnchor="middle"
      >
        {n}
      </text>
    </g>
  )
}
