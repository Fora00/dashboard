import { useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type CustomEvent, type EventInterest, type EventInterestProfile, type EventMark } from '../../lib/db'
import { customToEventItem } from './custom'
import { buildInterestModel, collectEvidence, type InterestModel } from './interestScore'

// Glue between Dexie and the pure scoring model (interestScore.ts), shared by
// the Events page and /events/interests. Dexie only: works signed out/offline.

export interface InterestRows {
  signals: readonly EventInterest[]
  marks: readonly EventMark[]
  custom: readonly CustomEvent[]
  profile: readonly EventInterestProfile[]
}

/** The model from the stored rows (hand-added events count with their row's updatedAt). */
export function interestModelFrom({ signals, marks, custom, profile }: InterestRows, now: number): InterestModel {
  const evidence = collectEvidence({
    signals,
    marks,
    manual: custom.map((r) => ({ event: customToEventItem(r), updatedAt: r.updatedAt })),
  })
  return buildInterestModel(evidence, profile, now)
}

/** Every row the model reads, live; undefined while Dexie is loading. */
export function useInterestRows(): InterestRows | undefined {
  const signals = useLiveQuery(() => db.eventInterest.toArray())
  const marks = useLiveQuery(() => db.eventMarks.toArray())
  const custom = useLiveQuery(() => db.customEvents.toArray())
  const profile = useLiveQuery(() => db.eventInterestProfile.toArray())
  return useMemo(
    () => (signals && marks && custom && profile ? { signals, marks, custom, profile } : undefined),
    [signals, marks, custom, profile],
  )
}
