import type { LifePlan } from '../../../lib/db'
import { decodeLinkParam, toBase64Url } from '../../../lib/base64url.ts'

// --- Import link -----------------------------------------------------------------
// The week rides in the URL fragment (never sent to a server) as base64url of
// the UTF-8 JSON, so emoji and accents survive. The import screen decodes it,
// shows the preview, and only saves on an explicit tap.

export const LIFE_IMPORT_BASE = 'https://fora00.github.io/dashboard/'

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
  return decodeLinkParam(d)
}
