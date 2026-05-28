'use client';

import { useMediaQuery } from './useMediaQuery';

/**
 * Cinema-mode gate. Pinning + scrubbing is desktop-and-laptop only.
 * Mobile (< 1024px) falls back to the simpler landing-page motion model
 * per CINEMA_SPEC.md Section 8.2.
 */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}
