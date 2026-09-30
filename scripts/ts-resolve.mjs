// Node --import hook for scripts that import app sources (src/**), which use
// Vite-style extensionless relative imports ('../habits/habitStore'). Node's
// native type stripping needs the real filename, so retry such a specifier
// with `.ts`. Usage: node --import ./scripts/ts-resolve.mjs script.ts
import { register } from 'node:module'

register(
  'data:text/javascript,' +
    encodeURIComponent(`
export async function resolve(specifier, context, next) {
  try {
    return await next(specifier, context)
  } catch (err) {
    if (err && err.code === 'ERR_MODULE_NOT_FOUND' && specifier.startsWith('.') && !/\\.[cm]?[jt]s$/.test(specifier)) {
      return next(specifier + '.ts', context)
    }
    throw err
  }
}`),
)
