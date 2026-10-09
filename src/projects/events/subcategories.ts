// Mirror of SUBCATEGORIES in scripts/events/subcategories.ts (the app cannot
// import from scripts/: its tsconfig lacks import.meta.env, see the note on
// InterestValue in types.ts). Keep the two in sync, add ids only; the pin in
// subcategories.test.ts fails when this copy changes unnoticed.

export interface Subcategory {
  /** lowercase-kebab slug, as published in events.json */
  id: string
  label: string
}

/** Category -> its subcategories, in display order. Other categories have none. */
export const SUBCATEGORIES: Record<string, Subcategory[]> = {
  theatre: [
    { id: 'prosa', label: 'Prosa' },
    { id: 'stand-up', label: 'Stand-up e cabaret' },
    { id: 'danza', label: 'Danza' },
    { id: 'musical-opera', label: 'Musical e opera' },
    { id: 'ragazzi', label: 'Teatro ragazzi' },
  ],
  concerts: [
    { id: 'classica', label: 'Classica' },
    { id: 'jazz-blues', label: 'Jazz e blues' },
    { id: 'rock-pop', label: 'Rock e pop' },
    { id: 'folk-cori', label: 'Folk e cori' },
    { id: 'elettronica', label: 'Elettronica' },
  ],
  exhibitions: [
    { id: 'arte', label: 'Arte' },
    { id: 'fotografia', label: 'Fotografia' },
    { id: 'storia', label: 'Storia' },
    { id: 'scienza', label: 'Scienza' },
  ],
  talks: [
    { id: 'conferenze', label: 'Conferenze' },
    { id: 'libri', label: 'Libri' },
    { id: 'dibattiti', label: 'Dibattiti' },
  ],
}

/** The subcategories of a category (empty for the ones without). */
export function subcategoriesOf(category: string): Subcategory[] {
  return SUBCATEGORIES[category] ?? []
}

/** Label of a subcategory id within its category; null when unknown (e.g. a newer crawler). */
export function subcategoryLabel(category: string, id: string | undefined): string | null {
  if (!id) return null
  return subcategoriesOf(category).find((s) => s.id === id)?.label ?? null
}

/** The category an id belongs to (ids are unique across categories); null when unknown. */
export function categoryOfSubcategory(id: string): string | null {
  for (const [cat, list] of Object.entries(SUBCATEGORIES)) if (list.some((s) => s.id === id)) return cat
  return null
}

/** Label of a subcategory id wherever its category is not at hand (chips, summaries); the id when unknown. */
export function subLabel(id: string): string {
  const cat = categoryOfSubcategory(id)
  return (cat && subcategoryLabel(cat, id)) || id
}
