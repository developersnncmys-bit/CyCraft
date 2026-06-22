import type { NextConfig } from 'next';

// Dual-deployment config:
//
//   • Default build (Vercel) — `next build`
//       Outputs a hybrid SSR app. /api/* runs as serverless functions
//       and forms POST to relative `/api/*` URLs.
//
//   • Static build (Hostinger) — `npm run build:static`
//       Sets STATIC_EXPORT=1 (and temporarily moves app/api/ aside via
//       scripts/build-static.mjs) so Next.js produces a pure-static
//       `out/` folder. Forms in that build POST cross-origin to the
//       Vercel deployment (see lib/utils/formApi.ts).
const isStaticExport = process.env.STATIC_EXPORT === '1';

const nextConfig: NextConfig = {
  ...(isStaticExport ? { output: 'export' as const } : {}),
  images: { unoptimized: true },
  trailingSlash: true,
  // GSAP ships CJS modules; Turbopack needs this to transpile them correctly
  transpilePackages: ['gsap', '@gsap/react'],
};

export default nextConfig;
