'use client';
import { type RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap/register';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';

/**
 * Battlegrounds motion.
 *  - reducedMotion → composed
 *  - mobile       → simple staggered fade-in on enter
 *  - desktop      → pin + scrub. Header reveals, then 9 tiles cascade in DOM
 *                   order as the user scrolls through the pin window.
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

      // ── Desktop — PINNED scrub-against-scroll ─────────────────────────
      gsap.set('.bg-heading-el', { opacity: 0, y: 24 });
      gsap.set('.bg-badge-el',   { opacity: 0 });
      gsap.set('.bg-desc-el',    { opacity: 0, y: 16 });
      gsap.set(tiles,            { opacity: 0, y: 32, scale: 0.94 });
      gsap.set('.bg-camera-el',  { scale: 1, opacity: 1 });

      const tl = makePinnedTimeline({
        trigger: container,
        end: PIN_DURATIONS.battlegrounds,
        scrub: 1,
        enabled: true,
        // `invalidateOnRefresh` removed — every tween here uses static literal
        // values (opacity, y, scale, duration, stagger). No function-based
        // properties to re-evaluate, so refresh-time re-measurement was just
        // recomputing trigger start/end mid-scroll and contributing to the
        // pause/jerk symptom across sections 6+.
      });

      // Header reveals first
      tl.to('.bg-badge-el',   { opacity: 1, duration: 0.08, ease: 'power2.out' }, 0)
        .to('.bg-heading-el', { opacity: 1, y: 0, duration: 0.10, ease: 'power3.out' }, 0.04)
        .to('.bg-desc-el',    { opacity: 1, y: 0, duration: 0.10, ease: 'power2.out' }, 0.12)

      // Tiles cascade ONE BY ONE — scrubbed against scroll so each tile has
      // dwell time as the user scrolls. 9 tiles distributed across 0.25–0.95
      // of the timeline (~70% of pin).
        .to(tiles,
            { opacity: 1, y: 0, scale: 1, duration: 0.10, ease: 'power2.out',
              stagger: 0.075 }, 0.25);
    },
    { scope: containerRef, dependencies: [reducedMotion, isDesktop] },
  );
}
