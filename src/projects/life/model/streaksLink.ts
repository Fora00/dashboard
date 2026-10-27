import { decodeLinkParam, toBase64Url } from '../../../lib/base64url.ts'
import type { LifeStreakValue } from '../../../lib/db'
import { LIFE_IMPORT_BASE } from './importLink.ts'

// "Streaks" link: the Streaks-app snapshot alone (no week plan) rides in the
// URL fragment as base64url of the JSON array. The /life/streaks screen
// decodes it, shows the preview, and only saves on an explicit tap. Built by
// scripts/life-streaks-link.ts (/streaks, also run by /oggi).

/** `${base}#/life/streaks?d=<base64url(UTF-8 JSON)>`. */
export function encodeStreaksLink(streaks: readonly LifeStreakValue[], base: string = LIFE_IMPORT_BASE): string {
  const d = toBase64Url(new TextEncoder().encode(JSON.stringify(streaks)))
  return `${base}#/life/streaks?d=${d}`
}

export function decodeStreaksParam(d: string): { ok: true; text: string } | { ok: false; errors: string[] } {
  return decodeLinkParam(d)
}
