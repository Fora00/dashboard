import { areas } from './areas'
import { projects, type ProjectMeta } from './projects'

// Per-project accent (IC3). Pure: colour maths plus the CSS custom properties
// Layout puts on its root. Raw values come in light/dark pairs; index.css
// picks the right one per colour scheme and holds the indigo defaults used
// when the route is not a project (Home, join pages).

/** The registry project whose page (or sub-page, e.g. /life/edit) this is. */
export function projectForPath(pathname: string): ProjectMeta | undefined {
  return projects.find((p) => pathname === p.path || pathname.startsWith(`${p.path}/`))
}

type Rgb = [number, number, number]

function parseHex(hex: string): Rgb {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.replace(/./g, '$&$&') : h
  if (!/^[0-9a-f]{6}$/i.test(full)) throw new Error(`Not a hex colour: ${hex}`)
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as Rgb
}

function toHex([r, g, b]: Rgb): string {
  return `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`
}

/** WCAG 2.x relative luminance of a hex colour. */
export function luminance(hex: string): number {
  const [r, g, b] = parseHex(hex).map((v) => {
    const c = v / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }) as Rgb
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** WCAG contrast ratio, 1..21. */
export function contrastRatio(a: string, b: string): number {
  const la = luminance(a)
  const lb = luminance(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

/** Mix `a` toward `b` by `amount` (0 = a, 1 = b), in sRGB. */
export function mixHex(a: string, b: string, amount: number): string {
  const [r1, g1, b1] = parseHex(a)
  const [r2, g2, b2] = parseHex(b)
  return toHex([r1 + (r2 - r1) * amount, g1 + (g2 - g1) * amount, b1 + (b2 - b1) * amount])
}

export const WHITE = '#ffffff'
/** slate-900: the dark text colour and the dark page background. */
export const SLATE_900 = '#0f172a'

/** Text colour for a filled `bg`: white or slate-900, whichever contrasts more. */
export function readableForeground(bg: string): string {
  return contrastRatio(bg, WHITE) >= contrastRatio(bg, SLATE_900) ? WHITE : SLATE_900
}

/**
 * `color` nudged toward black (on a light page) or white (on a dark page) in
 * 5% steps until it reaches `min` contrast against `page`. Used for focus
 * rings, which need 3:1 against the background (WCAG 1.4.11).
 */
export function ensureContrast(color: string, page: string, min: number): string {
  const toward = luminance(page) > 0.5 ? '#000000' : WHITE
  for (let step = 0; step <= 20; step++) {
    const c = mixHex(color, toward, step * 0.05)
    if (contrastRatio(c, page) >= min) return c
  }
  return toward
}

/** Filled-surface hover/pressed shades: always move AWAY from the text colour, so contrast only grows. */
function pressShades(bg: string, fg: string): { hover: string; active: string } {
  const away = fg === WHITE ? '#000000' : WHITE
  return { hover: mixHex(bg, away, 0.1), active: mixHex(bg, away, 0.2) }
}

const VAR_NAMES = [
  '--accent',
  '--accent-2',
  '--accent-fg',
  '--accent-hover',
  '--accent-active',
  '--accent-selected-light',
  '--accent-selected-dark',
  '--accent-border-light',
  '--accent-border-dark',
  '--accent-ring-light',
  '--accent-ring-dark',
  '--accent-soft-light',
  '--accent-soft-dark',
] as const

export type AccentVars = Record<(typeof VAR_NAMES)[number], string>

/** CSS custom properties for a project: --accent is the AREA colour, --accent-2 the project's own. */
export function accentVars(p: ProjectMeta): AccentVars {
  const accent = areas[p.area].color
  const fg = readableForeground(accent)
  const { hover, active } = pressShades(accent, fg)
  return {
    '--accent': accent,
    '--accent-2': p.color,
    '--accent-fg': fg,
    '--accent-hover': hover,
    '--accent-active': active,
    '--accent-selected-light': accent,
    '--accent-selected-dark': accent,
    '--accent-border-light': mixHex(accent, '#000000', 0.25),
    '--accent-border-dark': mixHex(accent, WHITE, 0.4),
    '--accent-ring-light': ensureContrast(accent, WHITE, 3),
    '--accent-ring-dark': ensureContrast(accent, SLATE_900, 3),
    '--accent-soft-light': mixHex(accent, WHITE, 0.88),
    '--accent-soft-dark': mixHex(accent, SLATE_900, 0.8),
  }
}
