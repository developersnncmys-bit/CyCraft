'use client';
import { type RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap/register';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';

/**
 * Battlegrounds motion. CINEMA_SPEC §2.2 ("Lab grid reveals diagonally").
 *  - reducedMotion / mobile → composed (no animation on mobile)
 *  - desktop → pin + scrub, 200vh
 *
 * Beat windows:
 *   0.00–0.10  Header reveals
 *   0.15–0.65  9 tiles reveal diagonally (top-left → bottom-right)
 *   0.65–0.90  Composed hold
 *   0.90–1.00  Camera nudge + pin-exit fade
 */
export function useLabsReveal(containerRef: RefObject<HTMLElement | null>) {
  const reducedMotion = useReducedMotion();
  const isDesktop = useIsDesktop();

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const tiles = container.querySelectorAll<HTMLElement>('.lab-tile-el');

      if (reducedMotion) {
        gsap.set(tiles, { opacity: 1, y: 0 });
        gsap.set(['.bg-heading-el', '.bg-badge-el', '.bg-desc-el'], { opacity: 1 });
        return;
      }

      if (!isDesktop) {
        // Mobile: tiles visible by default. Header + tiles fade-in on view.
        gsap.from(tiles,
          { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out',
            stagger: { amount: 0.8, grid: [3, 3], from: 'start' },
            scrollTrigger: { trigger: container, start: 'top 70%', toggleActions: 'play none none none' } });
        return;
      }

      // ── Desktop cinema ────────────────────────────────────────────────
      gsap.set('.bg-heading-el', { opacity: 0, y: 24 });
      gsap.set('.bg-badge-el',   { opacity: 0 });
      gsap.set('.bg-desc-el',    { opacity: 0, y: 16 });
      gsap.set(tiles,            { opacity: 0, y: 20 });
      gsap.set('.bg-camera-el',  { scale: 1, opacity: 1 });

      const tl = makePinnedTimeline({
        trigger: container,
        end: PIN_DURATIONS.battlegrounds,
        scrub: 1,
        enabled: true,
      });

      // 0.00 – 0.10 Header
      tl.to('.bg-badge-el',   { opacity: 1, duration: 0.05, ease: 'power2.out' }, 0)
        .to('.bg-heading-el', { opacity: 1, y: 0, duration: 0.08, ease: 'power3.out' }, 0.02)
        .to('.bg-desc-el',    { opacity: 1, y: 0, duration: 0.06, ease: 'power2.out' }, 0.06)

      // 0.15 – 0.55 All 9 tiles reveal diagonally (top-left → bottom-right)
      // Tighter stagger (amount 0.30) so the last tile is fully revealed by
      // 0.55, leaving 0.55-0.90 as composed hold time. Previously some users
      // saw only 6 reveal because the stagger ran past the pin exit fade.
        .to(tiles,
            { opacity: 1, y: 0, duration: 0.10, ease: 'power2.out',
              stagger: { amount: 0.30, grid: [3, 3], from: 'start' } }, 0.15)

      // 0.55 – 0.90 Hold

      // 0.90 – 1.00 Camera nudge
        .to('.bg-camera-el', { scale: 0.98, duration: 0.10, ease: 'power2.inOut' }, 0.90);
    },
    { scope: containerRef, dependencies: [reducedMotion, isDesktop] },
  );
}
