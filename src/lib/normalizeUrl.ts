// Pure URL helper shared by the links project (linksSync.ts re-exports it) and
// the Siti import link, which also runs in node (scripts/sites-link.ts), so
// this file must stay free of Dexie, Supabase or browser-only imports.

function withScheme(raw: string): string {
  const trimmed = raw.trim()
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

/** Trim, add a default scheme, and validate. Returns null if it's not a usable http(s) URL. */
export function normalizeUrl(raw: string): string | null {
  try {
    const url = new URL(withScheme(raw))
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
    return url.toString()
  } catch {
    return null
  }
}
