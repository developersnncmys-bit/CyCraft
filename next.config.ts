import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // GSAP ships CJS modules; Turbopack needs this to transpile them correctly
  transpilePackages: ['gsap', '@gsap/react'],
};

export default nextConfig;
