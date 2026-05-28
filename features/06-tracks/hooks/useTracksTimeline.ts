'use client';
import { type RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import { gsap } from '@/lib/gsap/register';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';

/**
 * Tracks motion. CINEMA_SPEC §7.4 — THE permanent red/blue split.
 *  - reducedMotion → composed
 *  - mobile → entry-on-view
 *  - desktop → pin + scrub, 400vh (longest pin in Act III)
 *
 * Cinema beat windows:
 *   0.00–0.10  Heading character-stagger + description fade
 *   0.10–0.25  Cyan horizontal beam descends and sweeps to centre
 *   0.25–0.45  THE SPLIT — flash at centre, cyan converts to red+blue
 *              diagonals; background gains subtle red/blue tint
 *   0.45–0.70  Four cards materialise (stagger), red cards on red beam side,
 *              blue cards on blue beam side
 *   0.70–0.90  Hold; team labels at full intensity
 *   0.90–1.00  Lock-in — red+blue beams persist (no foreshadow this time —
 *              the split IS the resolution; later sections inherit the split)
 */
export function useTracksTimeline(containerRef: RefObject<HTMLElement | null>) {
  const reducedMotion = useReducedMotion();
  const isDesktop = useIsDesktop();

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      // ── Reduced motion: composed final state ───────────────────────────
      if (reducedMotion) {
        gsap.set(
          ['.split-h-beam', '.split-red-beam', '.split-blue-beam'],
          { opacity: 1 },
        );
        gsap.set('.split-h-beam', { scaleX: 1 });
        gsap.set('.split-flash-el', { opacity: 0 });
        gsap.set('.track-card-el', { opacity: 1 });
        gsap.set(['.tracks-heading-el', '.tracks-desc-el', '.tracks-bg-tint-el'],
                 { opacity: 1 });
        return;
      }

      // Headline split (shared)
      const headingEl = container.querySelector<HTMLElement>('.tracks-heading-el');
      const split = headingEl
        ? new SplitType(headingEl, { types: 'words,chars' })
        : null;
      split?.words?.forEach((w) => ((w as HTMLElement).style.whiteSpace = 'nowrap'));
      if (headingEl) gsap.set(headingEl, { opacity: 1 });

      // ──────────────────────────────────────────────────────────────────
      //  MOBILE PATH — entry-on-view (preserved)
      // ──────────────────────────────────────────────────────────────────
      if (!isDesktop) {
        gsap.set(['.split-red-beam', '.split-blue-beam', '.split-flash-el'], { opacity: 0 });
        gsap.set('.split-h-beam', { scaleX: 0, opacity: 0 });
        gsap.set('.track-card-el', { opacity: 0, y: 30 });
        gsap.set('.tracks-bg-tint-el', { opacity: 1 });
        if (split) gsap.set(split.chars, { opacity: 0, y: 20 });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: container, start: 'top 60%', toggleActions: 'play none none reverse' },
        });
        tl.to(split?.chars ?? [], { opacity: 1, y: 0, stagger: 0.02, duration: 0.5, ease: 'power3.out' })
          .to('.split-h-beam', { scaleX: 1, opacity: 1, duration: 0.5, ease: 'power2.out' }, '<0.2')
          .to('.split-flash-el', { opacity: 1, scale: 1.5, duration: 0.15, ease: 'power3.out' }, '<0.3')
          .to('.split-flash-el', { opacity: 0, scale: 1, duration: 0.2 }, '<0.15')
          .to('.split-h-beam', { opacity: 0, duration: 0.2 }, '<')
          .to('.split-red-beam', { opacity: 0.7, duration: 0.6, ease: 'power2.out' }, '<')
          .to('.split-blue-beam', { opacity: 0.7, duration: 0.6, ease: 'power2.out' }, '<')
          .to('.track-card-el', { opacity: 1, y: 0, stagger: 0.12, duration: 0.7, ease: 'power2.out' }, '<0.2');

        return () => { split?.revert(); };
      }

      // ──────────────────────────────────────────────────────────────────
      //  DESKTOP CINEMA PATH — pin + scrub, 400vh
      // ──────────────────────────────────────────────────────────────────

      // Initial state
      if (split) gsap.set(split.chars, { opacity: 0, yPercent: 100 });
      gsap.set('.tracks-desc-el', { opacity: 0 });
      gsap.set('.tracks-bg-tint-el', { opacity: 0 });
      gsap.set('.split-h-beam', { scaleX: 0, opacity: 0, transformOrigin: 'left' });
      gsap.set('.split-flash-el', { opacity: 0, scale: 1 });
      gsap.set('.split-red-beam', { opacity: 0, scaleY: 0, transformOrigin: 'top center' });
      gsap.set('.split-blue-beam', { opacity: 0, scaleY: 0, transformOrigin: 'top center' });
      gsap.set('.track-card-el', { opacity: 0, y: 30, scale: 0.92 });
      gsap.set('.tracks-camera-el', { scale: 1, transformOrigin: 'center center' });

      const tl = makePinnedTimeline({
        trigger: container,
        end: PIN_DURATIONS.tracks,
        scrub: 1,
        enabled: true,
      });

      // 0.00 – 0.10 Heading + description
      if (split) {
        tl.to(split.chars,
              { opacity: 1, yPercent: 0, stagger: 0.005, duration: 0.10, ease: 'power3.out' }, 0);
      }
      tl.to('.tracks-desc-el', { opacity: 1, duration: 0.08, ease: 'power2.out' }, 0.06);

      // 0.10 – 0.25 Horizontal cyan beam sweeps to centre
      tl.to('.split-h-beam',
            { scaleX: 1, opacity: 1, duration: 0.15, ease: 'power2.out' }, 0.10);

      // 0.25 – 0.30 Flash at split point
      tl.to('.split-flash-el',
            { opacity: 1, scale: 1.5, duration: 0.05, ease: 'power3.out' }, 0.25)
        .to('.split-flash-el',
            { opacity: 0, scale: 1, duration: 0.05, ease: 'power2.in' }, 0.30);

      // 0.25 – 0.45 THE SPLIT — h-beam fades; red+blue beams flare outward
      tl.to('.split-h-beam',
            { opacity: 0, duration: 0.10, ease: 'power2.in' }, 0.27);

      // Red+blue beams scale-grow from centre (they're rotated ±35° already)
      tl.to('.split-red-beam',
            { opacity: 0.75, scaleY: 1, duration: 0.20, ease: 'power2.out' }, 0.25)
        .to('.split-blue-beam',
            { opacity: 0.75, scaleY: 1, duration: 0.20, ease: 'power2.out' }, 0.25);

      // Background tint fades in subtly as the split lands
      tl.to('.tracks-bg-tint-el',
            { opacity: 1, duration: 0.20, ease: 'power2.out' }, 0.30);

      // 0.45 – 0.70 Cards materialise — natural left-to-right stagger via index
      tl.to('.track-card-el',
            { opacity: 1, y: 0, scale: 1, stagger: 0.06, duration: 0.18, ease: 'back.out(1.4)' }, 0.45);

      // 0.70 – 0.90 Hold — no tweens. Cards composed at full intensity.

      // 0.90 – 1.00 Lock-in — beams settle to slightly higher intensity to
      // emphasise permanence into the next sections.
      tl.to(['.split-red-beam', '.split-blue-beam'],
            { opacity: 0.9, duration: 0.10, ease: 'power2.inOut' }, 0.90);

      return () => { split?.revert(); };
    },
    { scope: containerRef, dependencies: [reducedMotion, isDesktop] },
  );
}
