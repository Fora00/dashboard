// Markdown code fences around the export's JSON. Dependency-free so the
// scripts (life-things-status.ts) can import it under native Node.

/** A backtick fence longer than any backtick run in `content` (min 4). */
export function fenceFor(content: string): string {
  let longest = 0
  for (const run of content.match(/`+/g) ?? []) longest = Math.max(longest, run.length)
  return '`'.repeat(Math.max(4, longest + 1))
}

/**
 * The JSON text of the first ```json fence in `text`. The closing fence is a
 * line of at least as many backticks as the opening one, so backticks inside
 * the JSON strings never end it. Accepts the older 3-backtick exports too.
 * Returns null when there is no complete fence.
 */
export function extractJsonFence(text: string): string | null {
  const m = /^(`{3,})json[ \t]*\r?\n([\s\S]*?)\r?\n\1`*[ \t]*$/m.exec(text)
  return m?.[2] ?? null
}
