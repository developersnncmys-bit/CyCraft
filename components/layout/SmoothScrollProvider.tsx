'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { configureScrollTrigger } from '@/lib/gsap/scrollTriggerConfig';
import { setLenisInstance, scrollToTop } from '@/lib/scroll';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { useIsomorphicLayoutEffect } from '@/lib/hooks/useIsomorphicLayoutEffect';

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const reducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const pathname = usePathname();

  useEffect(() => {
    configureScrollTrigger();

    if (reducedMotion || !isDesktop) {
      // Native scroll — no Lenis to drive, so reset the shared handle
      setLenisInstance(null);
      // still refresh so ScrollTrigger positions are correct
      const id = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => cancelAnimationFrame(id);
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;
    setLenisInstance(lenis);

    // Arrow wrapper — preserves ScrollTrigger.update's 'this' context
    lenis.on('scroll', () => ScrollTrigger.update());

    const rafHandler = (time: number) => {
      // GSAP ticker passes seconds; Lenis.raf expects milliseconds
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(rafHandler);
    gsap.ticker.lagSmoothing(0);

    // Give lazy sections one frame to mount before computing scroll positions
    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refreshId);
      gsap.ticker.remove(rafHandler);
      lenis.destroy();
      lenisRef.current = null;
      setLenisInstance(null);
    };
  }, [reducedMotion, isDesktop]);

  // On client-side route changes, land the new page at the top. Next.js resets
  // scroll natively, but Lenis re-applies its own scroll on the next frame, so
  // the reset has to go through Lenis here. Layout effect runs before paint to
  // avoid a one-frame flash of the new page at the old scroll offset.
  useIsomorphicLayoutEffect(() => {
    scrollToTop({ immediate: true });
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return <>{children}</>;
}
