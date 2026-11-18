/**
 * A Things URL-scheme command: `things:///<command>?k=v&…`, values percent-encoded, in the given order.
 * Every command also takes the x-callback-url parameters (`x-success`, …) as plain extra params.
 */
export function thingsUrl(command: string, params: Record<string, string>): string {
  const query = Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&')
  return `things:///${command}?${query}`
}
