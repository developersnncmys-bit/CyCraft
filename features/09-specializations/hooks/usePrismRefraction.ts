'use client';
import { type RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';

/**
 * Specializations motion. CINEMA_SPEC §2.2 ("Prism refracts beam into 6 cards").
 *  - reducedMotion / mobile → composed (mobile uses grid layout, no prism)
 *  - desktop → pin + scrub, 300vh
 *
 * Cinema beat windows:
 *   0.00–0.10  Heading + badge + description reveal
 *   0.10–0.25  Prism spins into existence (rotate + scale + fade)
 *   0.25–0.45  Six refracted beams shoot out staggered (hex order)
 *   0.40–0.65  Six cards materialise at beam endpoints
 *   0.65–0.85  Hold; prism gently counter-rotates
 *   0.85–1.00  Camera nudge as we leave Act III
 */
export function usePrismRefraction(containerRef: RefObject<HTMLElement | null>) {
  const reducedMotion = useReducedMotion();
  const isDesktop = useIsDesktop();

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      if (reducedMotion) {
        gsap.set('.spec-card-el', { opacity: 1, scale: 1 });
        gsap.set('.prism-hex-el', { rotate: 0, opacity: 1, scale: 1 });
        gsap.set('[class^="spec-beam-"]', { opacity: 0.4 });
        gsap.set(['.spec-heading-el', '.spec-badge-el', '.spec-desc-el'], { opacity: 1 });
        return;
      }

      if (!isDesktop) {
        // Mobile path: simple entry-on-view (no prism)
        gsap.fromTo('.spec-card-el',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.05, duration: 0.5, ease: 'power2.out',
            scrollTrigger: { trigger: container, start: 'top 70%', toggleActions: 'play none none reverse' } });
        gsap.set(['.spec-heading-el', '.spec-badge-el', '.spec-desc-el'], { opacity: 1 });
        return;
      }

      // ──────────────────────────────────────────────────────────────────
      //  DESKTOP CINEMA PATH — pin + scrub, 300vh
      // ──────────────────────────────────────────────────────────────────

      // Initial state. Heading + badge + description stay at default
      // opacity:1 (Approach B). Prism, refracted beams, and 6 cards KEEP
      // their reveals — they are the cinema beats.
      gsap.set('.prism-hex-el',    { opacity: 0, rotate: 0, scale: 0.5 });
      gsap.set('[class^="spec-beam-"]', { opacity: 0 });
      gsap.set('.spec-card-el',    { opacity: 0, scale: 0.8 });
      gsap.set('.spec-camera-el',  { scale: 1, transformOrigin: 'center center' });

      const tl = makePinnedTimeline({
        trigger: container,
        end: PIN_DURATIONS.specializations,
        scrub: 1,
        enabled: true,
        unpinned: true,
      });

      // Header reveals removed (Approach B — start at opacity:1).

      // 0.10 – 0.25 Prism spins into existence
      tl.to('.prism-hex-el',
            { opacity: 1, scale: 1, rotate: 60, duration: 0.15, ease: 'back.out(1.5)' }, 0.10)

      // 0.25 – 0.45 Refracted beams shoot out
        .to('[class^="spec-beam-"]',
            { opacity: 0.4, stagger: 0.025, duration: 0.10, ease: 'power2.out' }, 0.25)

      // 0.32 – 0.82 Cards materialise at endpoints (hex stagger). Per-card
      // stagger widened 0.03 → 0.07 so each of the 6 specialization cards has
      // real scroll-time before the next appears (was ~5vh between cards —
      // way too fast for cards with titles + icons).
        .to('.spec-card-el',
            { opacity: 1, scale: 1, stagger: { each: 0.07, from: 'start' },
              duration: 0.14, ease: 'back.out(1.3)' }, 0.32)

      // 0.65 – 0.85 Hold; prism gently counter-rotates
        .to('.prism-hex-el',
            { rotate: 30, duration: 0.20, ease: 'power1.inOut' }, 0.65)

      // 0.85 – 1.00 Camera nudge
        .to('.spec-camera-el',
            { scale: 0.98, duration: 0.15, ease: 'power2.inOut' }, 0.85);

      void ScrollTrigger;
    },
    { scope: containerRef, dependencies: [reducedMotion, isDesktop] },
  );
}
