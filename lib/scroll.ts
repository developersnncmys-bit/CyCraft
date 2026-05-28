'use client';

import type Lenis from 'lenis';

/* Shared handle to the active Lenis instance (created in SmoothScrollProvider).
 * Lenis owns the scroll position via its own rAF loop, so resetting scroll has
 * to go through Lenis when it's active — a native window.scrollTo gets clobbered
 * on the next frame. Falls back to the window when Lenis is off (mobile /
 * reduced-motion). */
let lenisInstance: Lenis | null = null;

export function setLenisInstance(instance: Lenis | null) {
  lenisInstance = instance;
}

export function scrollToTop({ immediate = true }: { immediate?: boolean } = {}) {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { immediate, force: true });
    return;
  }
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, left: 0, behavior: immediate ? 'auto' : 'smooth' });
  }
}
