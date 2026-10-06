import type { LifeCheckin, LifePlan } from '../../../lib/db'

// --- Check-in ids -------------------------------------------------------------
// Check-ins got ids on 2026-09-28. For a check-in without one, the id is
// derived from what the owner sees — `c-<date>-<label slug>` — never from its
// position, so it survives reordering and re-importing the same JSON, and the
// same legacy plan read on two devices yields the same ids. Renaming a legacy
// check-in (no stored id) before it's ever saved with one would change it;
// once a plan passes validatePlan()/importWeek() the ids are stored with it.

/** Lowercase ASCII slug of a label ("Café review!" → "cafe-review"). */
function slug(label: string): string {
  return label
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** The deterministic id of a check-in with no id of its own (≤ 40 chars). */
export function derivedCheckinId(date: string, label: string, n = 1): string {
  const suffix = n > 1 ? `-${n}` : ''
  const head = `c-${date}`
  const room = 40 - head.length - 1 - suffix.length
  const s = slug(label).slice(0, room).replace(/-+$/, '')
  return `${head}${s ? `-${s}` : ''}${suffix}`
}

/**
 * Give every check-in an id: explicit ids are kept; missing ones are derived
 * from date + label, skipping ids already taken (explicit ones first, then
 * earlier derived ones — identical date + label pairs get `-2`, `-3`, …).
 */
export function assignCheckinIds(
  list: readonly { id?: string | undefined; date: string; label: string }[],
): LifeCheckin[] {
  const taken = new Set(list.map((c) => c.id).filter((id): id is string => !!id))
  return list.map((c) => {
    if (c.id) return { id: c.id, date: c.date, label: c.label }
    let n = 1
    let id = derivedCheckinId(c.date, c.label, n)
    while (taken.has(id)) id = derivedCheckinId(c.date, c.label, ++n)
    taken.add(id)
    return { id, date: c.date, label: c.label }
  })
}

/**
 * A plan with every check-in carrying an id. Plans validated before check-in
 * ids existed are still stored without them (Dexie and life_weeks); every
 * reader goes through this (summarizeWeek, nextCheckin, the export, the
 * editor, the sync pull). Returns the same object when nothing is missing.
 */
export function withCheckinIds(plan: LifePlan): LifePlan {
  const checkins = plan.checkins ?? []
  if (checkins.every((c) => typeof c.id === 'string' && c.id)) return plan
  return { ...plan, checkins: assignCheckinIds(checkins) }
}
