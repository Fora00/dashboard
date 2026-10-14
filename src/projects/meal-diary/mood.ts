// Optional mood after a meal: 1 (low) to 5 (great); empty = indifferent.
export const MOODS = [
  { value: 1, face: '😞', label: 'Very low' },
  { value: 2, face: '🙁', label: 'Low' },
  { value: 3, face: '😐', label: 'Okay' },
  { value: 4, face: '🙂', label: 'Good' },
  { value: 5, face: '😄', label: 'Great' },
] as const

export function moodFace(mood: number | null | undefined): string | null {
  return MOODS.find((m) => m.value === mood)?.face ?? null
}
