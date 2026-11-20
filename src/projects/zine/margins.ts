// Page margins of the zine, in mm. One set for the whole zine, mirrored on the spine side: page index pi
// even (cover, pages 3, 5, …) sits on the right of a spread with the spine on its left; odd pi on the left.

export const PAGE_W = 148
export const PAGE_H = 210
/** Smallest live area (mm) the margins may leave, on both axes. */
export const MIN_LIVE = 40
/** Largest single margin (mm). */
export const MAX_MARGIN = 60

export type MarginSide = 'top' | 'bottom' | 'outer' | 'spine'
export type Margins = Record<MarginSide, number>
export type Edge = 'top' | 'bottom' | 'left' | 'right'

export const DEFAULT_MARGINS: Margins = { top: 8, bottom: 8, outer: 8, spine: 12 }

/** Spine on the left for this page (cover and odd page numbers sit on the right of the spread). */
export const spineLeft = (pi: number) => pi % 2 === 0

/** The doc's margins; old docs only have `margin` (top/bottom/outer) and `gutter` (spine). */
export function marginsOf(z: { margins?: Partial<Margins> | null; margin?: number; gutter?: number }): Margins {
  const m = z.margins
  const legacy = typeof z.margin === 'number' && isFinite(z.margin) ? z.margin : DEFAULT_MARGINS.top
  const spine = typeof z.gutter === 'number' && isFinite(z.gutter) ? z.gutter : DEFAULT_MARGINS.spine
  const pick = (k: MarginSide, d: number) => {
    const v = m?.[k]
    return typeof v === 'number' && isFinite(v) ? v : d
  }
  return {
    top: pick('top', legacy),
    bottom: pick('bottom', legacy),
    outer: pick('outer', legacy),
    spine: pick('spine', spine),
  }
}

/** Which margin an edge of page pi is. */
export function sideOf(edge: Edge, pi: number): MarginSide {
  if (edge === 'top' || edge === 'bottom') return edge
  return (edge === 'left') === spineLeft(pi) ? 'spine' : 'outer'
}

/** The live-area box of page pi as insets from each page edge (mm). */
export function pageBox(m: Margins, pi: number): Record<Edge, number> {
  const sl = spineLeft(pi)
  return { top: m.top, bottom: m.bottom, left: sl ? m.spine : m.outer, right: sl ? m.outer : m.spine }
}

/** The opposite margin on the same axis. */
const opposite = (s: MarginSide): MarginSide =>
  s === 'top' ? 'bottom' : s === 'bottom' ? 'top' : s === 'outer' ? 'spine' : 'outer'

/** Clamp to 0..max (keeping MIN_LIVE of live area against the opposite margin), rounded to 0.5 mm. */
export function clampMargin(m: Margins, side: MarginSide, v: number): number {
  const size = side === 'top' || side === 'bottom' ? PAGE_H : PAGE_W
  const max = Math.max(0, Math.min(MAX_MARGIN, size - MIN_LIVE - m[opposite(side)]))
  const r = Math.round((isFinite(v) ? v : 0) * 2) / 2
  return Math.max(0, Math.min(max, r))
}

/**
 * Set one margin. `linked`: top, bottom and outer move together (the spine stays its own); each linked
 * value is still clamped against its opposite.
 */
export function setMargin(m: Margins, side: MarginSide, v: number, linked = false): Margins {
  if (!linked || side === 'spine') return { ...m, [side]: clampMargin(m, side, v) }
  // Top and bottom are set to the same value, so each only has to leave half the height free.
  const val = Math.min(clampMargin({ ...m, bottom: (PAGE_H - MIN_LIVE) / 2 }, 'top', v), clampMargin(m, 'outer', v))
  return { ...m, top: val, bottom: val, outer: val }
}
