// Types and class helpers shared by the Sharing page and its subcomponents.

export interface Area {
  id: string
  name: string
}

export interface Guest {
  email: string
  // Generic project_members rows (excludes the vestigial shop-list one, which
  // we keep in sync with area membership but drive UI off `areas`).
  memberships: string[]
  // shop_area_members the guest belongs to (area ids).
  areas: string[]
}

// Card look without Card's padding, for divided row lists.
export const listBox =
  'divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-800/50'
