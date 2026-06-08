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
  // btech no longer pins (see useIsDesktop.ts override), so each section
  // is a normal scroll surface. A slightly longer Lenis glide here gives
  // each wheel tick more visible glide distance — users get more time to
  // read content before scrolling past. Other pages keep the snappier
  // 0.6s since their pinned/scrub timelines need responsive scrub input.
  const isBtech = pathname?.startsWith('/btech') ?? false;

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
      // Per-page glide duration. btech gets the longer/softer glide because
      // it's a pure content scroll with no scrub-driven timelines that need
      // responsive wheel input — every section is just standard layout with
      // entry-on-view reveals. 1.4s + a softer expo-out easing produces a
      // noticeably smoother, more cinematic scroll than the snappy 0.6s
      // used on the other pages (which need wheel-responsive input for
      // their pinned scrub timelines).
      duration: isBtech ? 1.4 : 0.6,
      // btech easing: sineOut-like decay (softer landing, longer tail).
      // Other pages: original expoOut for snap.
      easing: isBtech
        ? (t) => 1 - Math.pow(1 - t, 3.2)
        : (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Wheel multiplier — slightly lower on btech so each wheel tick
      // translates to less raw scroll distance; combined with the longer
      // glide, scrolling feels deliberate without skipping past content.
      wheelMultiplier: isBtech ? 0.85 : 1,
      touchMultiplier: isBtech ? 1.5 : 2,
      // Lerp acts as a per-frame interpolation factor; lower = smoother.
      // Lenis uses `duration` OR `lerp`, not both — keep duration as the
      // primary control. (Documented here so future tuning starts from
      // the right knob.)
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
  }, [reducedMotion, isDesktop, isBtech]);

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
