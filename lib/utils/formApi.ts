/**
 * Resolves the URL each form should POST to.
 *
 * Why this exists — the same codebase ships to two hosts:
 *
 *   1. Vercel (cy-craft.vercel.app)
 *      — Next.js SSR + /api/* route handlers run as serverless functions.
 *      — Forms can POST to a RELATIVE path: "/api/apply".
 *
 *   2. Hostinger (cycraft.in)
 *      — Pure static `out/` folder. No server, no /api/*.
 *      — Forms must POST CROSS-ORIGIN to the Vercel deployment.
 *
 * `NEXT_PUBLIC_FORM_API_BASE` selects which mode each build targets:
 *
 *   - Unset / empty   → relative URL (Vercel build)
 *   - "https://..."   → absolute URL (Hostinger static build)
 *
 * The npm script `build:static` sets this to `https://cy-craft.vercel.app`
 * before running `next build`, so the static HTML in `out/` bakes in the
 * absolute URL at build time.
 */
const RAW_BASE = process.env.NEXT_PUBLIC_FORM_API_BASE ?? '';

// Strip a trailing slash so we can always concat with a leading-slash path.
const FORM_API_BASE = RAW_BASE.replace(/\/+$/, '');

/**
 * Build the URL a form should POST to (e.g. `formApiUrl('apply')`).
 *
 * Trailing slash matters: next.config.ts sets `trailingSlash: true`, so the
 * canonical endpoint is `/api/apply/`. Hitting `/api/apply` would 308-redirect
 * to it, which strips the POST body in some browsers' CORS preflight flows.
 */
export function formApiUrl(endpoint: 'apply' | 'contact' | 'enquiry'): string {
  return `${FORM_API_BASE}/api/${endpoint}/`;
}
