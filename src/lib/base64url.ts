// base64url (RFC 4648 §5, no padding) of raw bytes. Shared by the import links
// (Life's week link, the events interest seed link) and the scripts that print
// them, so it must stay free of browser-only or Vite-only imports.

export function toBase64Url(bytes: Uint8Array): string {
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/** The bytes, or null when `s` is not base64url. */
export function fromBase64Url(s: string): Uint8Array | null {
  if (!/^[A-Za-z0-9_-]*$/.test(s) || s.length % 4 === 1) return null
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (s.length % 4)) % 4)
  try {
    const bin = atob(b64)
    return Uint8Array.from(bin, (c) => c.charCodeAt(0))
  } catch {
    return null
  }
}

/** The UTF-8 JSON text of a link parameter, or why it can't be read. Never parses the JSON. */
export function decodeLinkParam(d: string): { ok: true; text: string } | { ok: false; errors: string[] } {
  const bytes = fromBase64Url(d.trim())
  if (!bytes) return { ok: false, errors: ['The import link is damaged (not base64url)'] }
  try {
    return { ok: true, text: new TextDecoder('utf-8', { fatal: true }).decode(bytes) }
  } catch {
    return { ok: false, errors: ['The import link is damaged (not UTF-8 text)'] }
  }
}
