import type { Discipline } from '../../lib/db'

// Ordered grade scales, easiest → hardest. Grade "difficulty" anywhere in the
// project is simply the index into its discipline's array.

// French / Fontainebleau boulder scale.
const BOULDER_GRADES = [
  '4', '5', '5+',
  '6a', '6a+', '6b', '6b+', '6c', '6c+',
  '7a', '7a+', '7b', '7b+', '7c', '7c+',
  '8a', '8a+', '8b', '8b+', '8c', '8c+',
]

// French sport (lead) scale.
const LEAD_GRADES = [
  '4a', '4b', '4c',
  '5a', '5b', '5c',
  '6a', '6a+', '6b', '6b+', '6c', '6c+',
  '7a', '7a+', '7b', '7b+', '7c', '7c+',
  '8a', '8a+', '8b', '8b+', '8c', '8c+',
  '9a',
]

export const GRADES: Record<Discipline, string[]> = {
  boulder: BOULDER_GRADES,
  lead: LEAD_GRADES,
}

export const DISCIPLINES: Discipline[] = ['boulder', 'lead']

export const DISCIPLINE_LABEL: Record<Discipline, string> = {
  boulder: 'Boulder',
  lead: 'Lead',
}

export function gradeIndex(discipline: Discipline, grade: string): number {
  return GRADES[discipline].indexOf(grade)
}

// 0..1 fraction of the scale, used for progress bar widths.
export function gradeFraction(discipline: Discipline, grade: string): number {
  const idx = gradeIndex(discipline, grade)
  if (idx < 0) return 0
  return (idx + 1) / GRADES[discipline].length
}
