#!/usr/bin/env node
/**
 * Static build orchestrator for the Hostinger deployment.
 *
 * Why a script — Next.js' `output: 'export'` refuses to build if there are
 * route handlers under app/api/ (static export can't include server code).
 * But our /api/* routes must keep existing for the Vercel deployment.
 *
 * This script:
 *   1. Moves `app/api/` to `app/_api_static_skipped/` so the static build
 *      doesn't see it.
 *   2. Runs `next build` with STATIC_EXPORT=1 (config switches output to
 *      'export') and NEXT_PUBLIC_FORM_API_BASE set so the baked-in form
 *      fetch URLs point at the Vercel deployment.
 *   3. Restores `app/api/` no matter what — wrapped in try/finally so the
 *      tree is never left in a broken state, even on build failure or
 *      Ctrl+C.
 *
 * After this finishes successfully the `out/` folder is ready to drop into
 * Hostinger's File Manager (or sync via FTP/SFTP) at the public_html root.
 */
import { execSync } from 'node:child_process';
import { existsSync, renameSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();
const API_DIR = resolve(ROOT, 'app/api');
const API_DIR_HIDDEN = resolve(ROOT, 'app/_api_static_skipped');
const FORM_API_BASE = 'https://cy-craft.vercel.app';

let moved = false;

function moveApiAside() {
  if (existsSync(API_DIR)) {
    if (existsSync(API_DIR_HIDDEN)) {
      throw new Error(
        `Refusing to overwrite existing ${API_DIR_HIDDEN}. ` +
          `A previous build was interrupted — manually rename it back to app/api before re-running.`,
      );
    }
    renameSync(API_DIR, API_DIR_HIDDEN);
    moved = true;
    console.log('• Moved app/api → app/_api_static_skipped');
  }
}

function restoreApi() {
  if (moved && existsSync(API_DIR_HIDDEN)) {
    renameSync(API_DIR_HIDDEN, API_DIR);
    console.log('• Restored app/_api_static_skipped → app/api');
  }
}

// Last-ditch safety net: if the Node process is killed (Ctrl+C, terminal close,
// etc.) we still want app/api/ back in place.
process.on('SIGINT', () => {
  restoreApi();
  process.exit(130);
});
process.on('SIGTERM', () => {
  restoreApi();
  process.exit(143);
});

try {
  console.log('▶ Building static export for Hostinger…');
  moveApiAside();

  execSync('npx next build', {
    stdio: 'inherit',
    env: {
      ...process.env,
      STATIC_EXPORT: '1',
      NEXT_PUBLIC_FORM_API_BASE: FORM_API_BASE,
    },
  });

  console.log('\n✓ Static build complete.');
  console.log('  • Output folder: out/');
  console.log(`  • Forms in this build POST to: ${FORM_API_BASE}/api/*`);
  console.log('  • Upload the contents of out/ to Hostinger public_html/');
} catch (err) {
  console.error('\n✗ Static build failed:', err.message || err);
  process.exitCode = 1;
} finally {
  restoreApi();
}
