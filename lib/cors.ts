/**
 * CORS helper for the form-submit route handlers.
 *
 * Why this exists — the static `out/` folder hosted on cycraft.in (Hostinger)
 * needs to POST to the API routes deployed on cy-craft.vercel.app. That's a
 * cross-origin request, which requires:
 *
 *   1. The browser sends an OPTIONS preflight first — handle it.
 *   2. The actual POST response must carry `Access-Control-Allow-Origin`.
 *
 * Allowed origins are pinned to the production hostnames + localhost dev.
 * If the request's `Origin` header isn't in this list, no ACAO header is
 * sent and the browser blocks the response — bots calling the API directly
 * still go through but browser-based abuse from other domains is blocked.
 */
import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_ORIGINS = new Set([
  'https://cycraft.in',
  'https://www.cycraft.in',
  'https://cy-craft.vercel.app',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
]);

/** Build the headers we attach to every response (including preflight). */
export function corsHeaders(req: NextRequest): Record<string, string> {
  const origin = req.headers.get('origin');
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  return headers;
}

/** Standard preflight handler — call from each route's exported OPTIONS(). */
export function handleOptions(req: NextRequest): NextResponse {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
}

/** Attach CORS headers to an existing NextResponse and return it. */
export function withCors(req: NextRequest, res: NextResponse): NextResponse {
  const headers = corsHeaders(req);
  for (const [k, v] of Object.entries(headers)) {
    res.headers.set(k, v);
  }
  return res;
}
