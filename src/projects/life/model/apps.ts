// --- Most-used apps (Sunday question type 'apps') ------------------------------
// Stored as a JSON string inside the normal text-shaped answer — no schema
// change. Names are matched case-insensitively against every name used in past
// weeks, so the first spelling typed becomes the canonical one and the series
// stays analyzable.

export const MAX_APPS = 7

export interface AppUsage {
  app: string
  minutes: number
}

/** Parse a stored answer; anything malformed yields []. */
export function parseApps(answer: unknown): AppUsage[] {
  if (typeof answer !== 'string' || !answer) return []
  try {
    const raw: unknown = JSON.parse(answer)
    if (!Array.isArray(raw)) return []
    return raw
      .filter(
        (r): r is AppUsage =>
          !!r &&
          typeof r === 'object' &&
          typeof (r as AppUsage).app === 'string' &&
          typeof (r as AppUsage).minutes === 'number',
      )
      .slice(0, MAX_APPS)
  } catch {
    return []
  }
}

/** Serialize rows (blank names dropped); null when nothing is left. */
export function serializeApps(rows: readonly AppUsage[], known: readonly string[] = []): string | null {
  const canon = new Map(known.map((k) => [k.toLowerCase(), k]))
  const out = rows
    .map((r) => ({
      app: r.app.trim().slice(0, 60),
      minutes: Math.round(r.minutes),
    }))
    .filter((r) => r.app && Number.isFinite(r.minutes) && r.minutes >= 0)
    .slice(0, MAX_APPS)
    .map((r) => ({
      app: canon.get(r.app.toLowerCase()) ?? r.app,
      minutes: r.minutes,
    }))
  return out.length ? JSON.stringify(out) : null
}

export function validateApps(answer: unknown): string | null {
  if (typeof answer !== 'string') return 'Enter your apps'
  const rows = parseApps(answer)
  return rows.length > 0 && JSON.stringify(rows) === answer ? null : 'Enter your apps'
}
