import type { LifePlan } from '../../../lib/db'

// --- Import link -----------------------------------------------------------------
// The week rides in the URL fragment (never sent to a server) as base64url of
// the UTF-8 JSON, so emoji and accents survive. The import screen decodes it,
// shows the preview, and only saves on an explicit tap.

export const LIFE_IMPORT_BASE = 'https://fora00.github.io/dashboard/'

function toBase64Url(bytes: Uint8Array): string {
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(s: string): Uint8Array | null {
  if (!/^[A-Za-z0-9_-]*$/.test(s) || s.length % 4 === 1) return null
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (s.length % 4)) % 4)
  try {
    const bin = atob(b64)
    return Uint8Array.from(bin, (c) => c.charCodeAt(0))
  } catch {
    return null
  }
}

/** `${base}#/life/import?d=<base64url(UTF-8 JSON)>` for a plan. */
export function encodeImportLink(plan: LifePlan, base: string = LIFE_IMPORT_BASE): string {
  const d = toBase64Url(new TextEncoder().encode(JSON.stringify(plan)))
  return `${base}#/life/import?d=${d}`
}

/**
 * Decode the `d` param of an import link back to the JSON text (feed it to
 * parseWeekJson for the preview). Never saves anything.
 */
export function decodeImportParam(d: string): { ok: true; text: string } | { ok: false; errors: string[] } {
  const bytes = fromBase64Url(d.trim())
  if (!bytes) return { ok: false, errors: ['The import link is damaged (not base64url)'] }
  try {
    return { ok: true, text: new TextDecoder('utf-8', { fatal: true }).decode(bytes) }
  } catch {
    return { ok: false, errors: ['The import link is damaged (not UTF-8 text)'] }
  }
}
