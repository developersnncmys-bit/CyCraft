import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  // GSAP ships CJS modules; Turbopack needs this to transpile them correctly
  transpilePackages: ['gsap', '@gsap/react'],
};

export default nextConfig;
