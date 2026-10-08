import { useEffect, useState } from 'react'
import { readJSON, writeJSON } from '../../lib/safeStorage'
import { addDays, dayKey, daysBetween, isDateKey, parseDayKey } from './model'
import { todayInfo, useToday } from './useToday'

// Late answers for last week's Sunday check and check-ins (ROADMAP LF5).
//
// The Sunday check is often filled in on Monday. So the previous week stays
// answerable (Sunday questions and check-ins only, nothing else) until the
// end of Tuesday, local time, or until that week has been exported to
// ~/life, whichever comes first. Anything older is read-only.
//
// "Exported" is the Export/Share button of that week pressed on THIS device
// on or after its Sunday (an earlier export is a preview, not the weekly
// round-trip). The mark lives in guarded localStorage, so it needs no schema
// change and works offline; another device simply falls back to the Tuesday
// cutoff. The answers themselves are the usual keyed entries
// (`${week}:sunday:${ref}`, `${week}:checkin:${ref}`).

/** Days of the new week during which last week stays answerable (Mon, Tue). */
export const LATE_EDIT_DAYS = 2

/** True when an export made at `exportedAt` (ms) closes `week`'s late window:
 *  it was made on or after the week's Sunday, local time. Pure. */
export function countsAsExport(week: string, exportedAt: number | null): boolean {
  if (exportedAt === null || !Number.isFinite(exportedAt)) return false
  return dayKey(new Date(exportedAt)) >= addDays(week, 6)
}

/**
 * Whether `week` (a Monday key) can still take late Sunday answers and
 * check-ins at `now`: it must be the week right before the current one, today
 * must be Monday or Tuesday, and it must not have been exported since its
 * Sunday. Pure, for tests.
 */
export function canEditLate(week: string, now: Date, exportedAt: number | null): boolean {
  const { week: current, today } = todayInfo(now)
  if (addDays(week, 7) !== current) return false
  if (daysBetween(current, today) >= LATE_EDIT_DAYS) return false
  return !countsAsExport(week, exportedAt)
}

/** Why a past week is closed, for the UI. Pure. */
export function lateEditState(week: string, now: Date, exportedAt: number | null): 'open' | 'exported' | 'closed' {
  if (canEditLate(week, now, exportedAt)) return 'open'
  const { week: current, today } = todayInfo(now)
  const inWindow = addDays(week, 7) === current && daysBetween(current, today) < LATE_EDIT_DAYS
  return inWindow ? 'exported' : 'closed'
}

// --- Export marks (per device, guarded localStorage) ----------------------

const EXPORTS_KEY = 'dashboard:life-exported'
const MAX_MARKS = 12

type ExportMarks = Record<string, number>

function sanitizeMarks(raw: unknown): ExportMarks {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return {}
  const out: ExportMarks = {}
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (isDateKey(k) && typeof v === 'number' && Number.isFinite(v)) out[k] = v
  }
  return out
}

function readMarks(): ExportMarks {
  return readJSON(EXPORTS_KEY, sanitizeMarks, {})
}

const listeners = new Set<() => void>()

/** When `week` was last exported on this device (ms), or null. */
export function exportedAt(week: string): number | null {
  return readMarks()[week] ?? null
}

/** Remember that `week` was exported now (keeps only the newest marks). */
export function markExported(week: string, at: number = Date.now()): void {
  const marks = { ...readMarks(), [week]: at }
  const kept = Object.fromEntries(
    Object.entries(marks)
      .sort(([a], [b]) => (a < b ? 1 : -1))
      .slice(0, MAX_MARKS),
  )
  writeJSON(EXPORTS_KEY, kept)
  listeners.forEach((l) => l())
}

/** Live export mark of `week` (updates on export here or in another tab). */
export function useExportedAt(week: string): number | null {
  const [value, setValue] = useState(() => exportedAt(week))
  useEffect(() => {
    const refresh = () => setValue(exportedAt(week))
    refresh()
    listeners.add(refresh)
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === EXPORTS_KEY) refresh()
    }
    window.addEventListener('storage', onStorage)
    return () => {
      listeners.delete(refresh)
      window.removeEventListener('storage', onStorage)
    }
  }, [week])
  return value
}

/** Live late-edit state of `week`: re-evaluates at local midnight / on wake
 *  (useToday) and when the week is exported. */
export function useLateEdit(week: string): 'open' | 'exported' | 'closed' {
  const today = useToday()
  const at = useExportedAt(week)
  return lateEditState(week, parseDayKey(today), at)
}
