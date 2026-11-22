import { useReducer, type Dispatch } from 'react'

/** Which habit sheet is open: one at a time. */
export type HabitSheet =
  | { kind: 'none' }
  /** The habit sheet: quick state, vacation, numbers and calendar, link to /habits/:id. */
  | { kind: 'detail'; id: string }
  /** A slip on a "don't" habit: within the limit, or what was it. */
  | { kind: 'slip'; id: string }
  /** Hold on a tile: today's state; `reasonFor` = the rest / missed reasons step. */
  | { kind: 'pick'; id: string; reasonFor: 'skip' | 'fail' | null }
  /** Two or more empty days: reset the setup. */
  | { kind: 'reset'; id: string }

export type HabitSheetAction = HabitSheet | { kind: 'reason'; reasonFor: 'skip' | 'fail' | null }

export const NO_SHEET: HabitSheet = { kind: 'none' }

export function habitSheetReducer(state: HabitSheet, action: HabitSheetAction): HabitSheet {
  if (action.kind === 'reason') return state.kind === 'pick' ? { ...state, reasonFor: action.reasonFor } : state
  return action
}

export function useHabitSheets(): [HabitSheet, Dispatch<HabitSheetAction>] {
  return useReducer(habitSheetReducer, NO_SHEET)
}
