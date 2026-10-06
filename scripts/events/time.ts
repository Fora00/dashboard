// Europe/Rome time helpers. Offsets always come from Intl, so DST is right
// for any date; nothing here hardcodes +01:00/+02:00.

export const TZ = 'Europe/Rome'
const DAY_MS = 86_400_000

const offsetFormatters = new Map<string, Intl.DateTimeFormat>()

/** Offset of `timeZone` at the instant `ms`, in minutes east of UTC. */
export function offsetMinutes(ms: number, timeZone = TZ): number {
  let f = offsetFormatters.get(timeZone)
  if (!f) {
    f = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'longOffset' })
    offsetFormatters.set(timeZone, f)
  }
  const name = f.formatToParts(ms).find((p) => p.type === 'timeZoneName')?.value ?? 'GMT'
  const m = name.match(/GMT([+-])(\d{2}):?(\d{2})?/)
  if (!m) return 0
  const mins = Number(m[2]) * 60 + Number(m[3] ?? 0)
  return m[1] === '-' ? -mins : mins
}

const pad = (n: number, w = 2) => String(n).padStart(w, '0')

function fmtOffset(mins: number): string {
  const sign = mins < 0 ? '-' : '+'
  const a = Math.abs(mins)
  return `${sign}${pad(Math.floor(a / 60))}:${pad(a % 60)}`
}

/** Local wall time in `timeZone` → ISO with that zone's offset. */
export function wallToIso(y: number, mo: number, d: number, h = 0, mi = 0, s = 0, timeZone = TZ): string {
  const wallAsUtc = Date.UTC(y, mo - 1, d, h, mi, s)
  let off = offsetMinutes(wallAsUtc, timeZone)
  const off2 = offsetMinutes(wallAsUtc - off * 60_000, timeZone)
  if (off2 !== off) off = off2
  // Re-derive the wall clock from the instant so a time inside the spring-
  // forward gap comes out as a real local time.
  return instantToIso(wallAsUtc - off * 60_000, timeZone)
}

/** Absolute instant → ISO with the local wall time and offset of `timeZone`. */
export function instantToIso(ms: number, timeZone = TZ): string {
  const off = offsetMinutes(ms, timeZone)
  const local = new Date(ms + off * 60_000)
  return (
    `${local.getUTCFullYear()}-${pad(local.getUTCMonth() + 1)}-${pad(local.getUTCDate())}` +
    `T${pad(local.getUTCHours())}:${pad(local.getUTCMinutes())}:${pad(local.getUTCSeconds())}` +
    fmtOffset(off)
  )
}

/** Local midnight (Rome) of a YYYY-MM-DD date, as ISO with offset. */
export function dateToIso(date: string): string {
  const [y, m, d] = parseYmd(date)
  return wallToIso(y, m, d)
}

export function parseYmd(date: string): [number, number, number] {
  const m = date.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) throw new Error(`bad date: ${date}`)
  return [Number(m[1]), Number(m[2]), Number(m[3])]
}

/** Add days to a YYYY-MM-DD date (calendar arithmetic, no DST involved). */
export function addDays(date: string, days: number): string {
  const [y, m, d] = parseYmd(date)
  const t = new Date(Date.UTC(y, m - 1, d) + days * DAY_MS)
  return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}`
}

/** Today's date in Rome for an instant. */
export function romeDate(ms: number): string {
  return instantToIso(ms).slice(0, 10)
}

/**
 * Any ISO string with an explicit offset (or Z) → the same instant expressed
 * in Rome time. A bare date (YYYY-MM-DD) → Rome midnight of that date.
 * Returns null when unparseable.
 */
export function normalizeIso(value: string | null | undefined): string | null {
  if (!value) return null
  const v = value.trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return dateToIso(v)
  const ms = Date.parse(v)
  if (Number.isNaN(ms)) return null
  return instantToIso(ms)
}

/** Local wall time string ("YYYY-MM-DDTHH:MM[:SS]", no offset) in Rome → ISO with offset. */
export function localToIso(date: string, time = '00:00:00'): string {
  const [y, m, d] = parseYmd(date)
  const t = time.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?/)
  return wallToIso(y, m, d, Number(t?.[1] ?? 0), Number(t?.[2] ?? 0), Number(t?.[3] ?? 0))
}

export const DAY = DAY_MS
