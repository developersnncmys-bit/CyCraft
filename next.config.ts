import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // `output: 'export'` removed so the /api/* route handlers can run as
  // serverless functions on Vercel. The marketing pages still pre-render
  // statically via SSG — only the form-submit endpoints become dynamic.
  // Re-enable the static-only output once forms move to a third-party
  // service if you need the cheaper hosting model.
  images: { unoptimized: true },
  trailingSlash: true,
  // GSAP ships CJS modules; Turbopack needs this to transpile them correctly
  transpilePackages: ['gsap', '@gsap/react'],
};

export default nextConfig;
