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
        // Per-tile reveal — each lab tile gets its OWN scrollTrigger keyed
        // to the tile's own top position, so the user sees each one pop in
        // as they scroll past it. The previous grid-stagger from the
        // section-level trigger animated all 9 tiles in a single 0.8s window
        // when the section header hit 70% of viewport, which left the
        // bottom-row tiles already revealed by the time the user actually
        // scrolled to them.
        tiles.forEach((tile) => {
          gsap.fromTo(
            tile,
            { opacity: 0, y: 28, scale: 0.94 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: tile,
                start: 'top 88%',
                toggleActions: 'play none none reset',
              },
            },
          );
        });
        return;
      }

      // ── Desktop — PINNED scrub-against-scroll ─────────────────────────
      // Badge + heading + description stay at default opacity:1 (Approach B).
      // The 9 lab tiles KEEP their cascade — it is THE cinema beat.
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

      // Header reveals removed (Approach B — start at opacity:1).

      // Tiles cascade ONE BY ONE — scrubbed against scroll so each tile has
      // dwell time as the user scrolls. Re-timed: start earlier (0.15), wider
      // stagger (0.085), longer per-tile reveal (0.15). The previous 0.075
      // stagger + 0.10 duration packed all 9 tiles into ~0.70 of pin =
      // ~140vh of scroll with a ×2.5 scrub trail — the last tile barely
      // finished before pin released, reading as "the cascade is too fast and
      // the 9th tile gets cut off." New shape ends at ~0.94, leaving 0.06 of
      // pin as exit breathing room and giving each tile ~20–25vh of dwell.
      tl.to(tiles,
            { opacity: 1, y: 0, scale: 1, duration: 0.15, ease: 'power2.out',
              stagger: 0.085 }, 0.15);

      // ── Layered parallax — deep + mid layers drift at differing
      // magnitudes across the full pin so the 3×3 lab grid reads as
      // sitting in a scene with depth behind it.
      tl.to('.bgs-bg-deep-el', { yPercent: -5, duration: 1, ease: 'none' }, 0);
      tl.to('.bgs-bg-mid-el',  { yPercent: -18, scale: 1.05, duration: 1, ease: 'none' }, 0);
    },
    { scope: containerRef, dependencies: [reducedMotion, isDesktop] },
  );
}
