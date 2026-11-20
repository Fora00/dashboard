// Saddle-stitch imposition and print options for the zine (pure, tested).

export type PrintMode = 'booklet' | 'single'
export type PrintSides = 'all' | 'fronts' | 'backs' | 'backs-rev'

export interface PrintOptions {
  mode: PrintMode
  sides: PrintSides
  creep: number
  marks: boolean
  paper: boolean
}

export interface SheetSide {
  // Sheet index: 0 = outermost sheet.
  i: number
  side: 'front' | 'back'
  // Page indexes (0-based), left then right.
  pages: [number, number]
}

// n pages (multiple of 4) -> n/4 A4 sheets, each with a front and a back holding two A5 pages.
// 8 pages: 8|1, 2|7, 6|3, 4|5 (1-based).
export function imposition(n: number): SheetSide[] {
  const sheets: SheetSide[] = []
  for (let i = 0; i < n / 4; i++) {
    sheets.push({ i, side: 'front', pages: [n - 1 - 2 * i, 2 * i] })
    sheets.push({ i, side: 'back', pages: [2 * i + 1, n - 2 - 2 * i] })
  }
  return sheets
}

// The sheet sides to output for the chosen "Lati" option (booklet mode).
export function selectSides(n: number, sides: PrintSides): SheetSide[] {
  let out = imposition(n)
  if (sides === 'fronts') out = out.filter((s) => s.side === 'front')
  if (sides === 'backs' || sides === 'backs-rev') out = out.filter((s) => s.side === 'back')
  if (sides === 'backs-rev') out.reverse()
  return out
}

export const slug = (s: string) =>
  (s || 'zine')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^\w]+/g, '-')
    .replace(/^-|-$/g, '') || 'zine'
