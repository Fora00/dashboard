import { useState } from 'react'
import { readJSON, writeJSON } from '../../../lib/safeStorage'

// --- Collapsible sections (per-device UI preference, guarded localStorage) --
// Every section except Rules starts open; Rules keeps its pre-existing
// default of closed. Sunday check is special: its default depends on the day
// of week (open on Sat/Sun), so only an explicit choice made THIS week
// (sundayWeek matches the current week key) overrides that default — next
// week it falls back to the day-of-week default again. Read-only history
// pages never read or write this: they always render fully expanded (see
// CollapsibleSection's readOnly branch).


const SECTIONS_KEY = 'dashboard:life-sections'

export type SectionId = 'focus' | 'trackers' | 'rules' | 'checkins' | 'things' | 'export'

interface SectionsState {
  focus: boolean
  trackers: boolean
  rules: boolean
  checkins: boolean
  things: boolean
  export: boolean
  sundayWeek: string | null
  sundayOpen: boolean
}

const DEFAULT_SECTIONS: SectionsState = {
  focus: true,
  trackers: true,
  rules: false,
  checkins: true,
  things: true,
  export: true,
  sundayWeek: null,
  sundayOpen: false,
}

function isBool(v: unknown): v is boolean {
  return typeof v === 'boolean'
}

function sanitizeSections(raw: unknown): SectionsState {
  if (typeof raw !== 'object' || raw === null) return DEFAULT_SECTIONS
  const r = raw as Record<string, unknown>
  return {
    focus: isBool(r.focus) ? r.focus : DEFAULT_SECTIONS.focus,
    trackers: isBool(r.trackers) ? r.trackers : DEFAULT_SECTIONS.trackers,
    rules: isBool(r.rules) ? r.rules : DEFAULT_SECTIONS.rules,
    checkins: isBool(r.checkins) ? r.checkins : DEFAULT_SECTIONS.checkins,
    things: isBool(r.things) ? r.things : DEFAULT_SECTIONS.things,
    export: isBool(r.export) ? r.export : DEFAULT_SECTIONS.export,
    sundayWeek: typeof r.sundayWeek === 'string' ? r.sundayWeek : null,
    sundayOpen: isBool(r.sundayOpen) ? r.sundayOpen : DEFAULT_SECTIONS.sundayOpen,
  }
}

/** Section open/closed state for the week screen. Storage access goes through
 * safeStorage (a blocked or malformed store behaves like an empty one). */
export function useSections(week: string, readOnly: boolean) {
  // Read-only history never persists or reads localStorage.
  const [sections, setSections] = useState<SectionsState>(() =>
    readOnly ? DEFAULT_SECTIONS : readJSON(SECTIONS_KEY, sanitizeSections, DEFAULT_SECTIONS),
  )

  function toggleSection(id: SectionId) {
    setSections((s) => {
      const next = { ...s, [id]: !s[id] }
      if (!readOnly) writeJSON(SECTIONS_KEY, next)
      return next
    })
  }

  const dow = new Date().getDay()
  const isWeekendToday = dow === 0 || dow === 6
  // Only an explicit choice made THIS week overrides the day-of-week default.
  const sundayOpen = readOnly
    ? true
    : sections.sundayWeek === week
      ? sections.sundayOpen
      : isWeekendToday

  function toggleSunday() {
    setSections((s) => {
      const currentOpen = s.sundayWeek === week ? s.sundayOpen : isWeekendToday
      const next = { ...s, sundayWeek: week, sundayOpen: !currentOpen }
      writeJSON(SECTIONS_KEY, next)
      return next
    })
  }

  return { sections, sundayOpen, toggleSection, toggleSunday }
}
