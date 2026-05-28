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

      // Initial state
      gsap.set('.spec-heading-el', { opacity: 0, y: 30 });
      gsap.set('.spec-badge-el',   { opacity: 0 });
      gsap.set('.spec-desc-el',    { opacity: 0, y: 20 });
      gsap.set('.prism-hex-el',    { opacity: 0, rotate: 0, scale: 0.5 });
      gsap.set('[class^="spec-beam-"]', { opacity: 0 });
      gsap.set('.spec-card-el',    { opacity: 0, scale: 0.8 });
      gsap.set('.spec-camera-el',  { scale: 1, transformOrigin: 'center center' });

      const tl = makePinnedTimeline({
        trigger: container,
        end: PIN_DURATIONS.specializations,
        scrub: 1,
        enabled: true,
      });

      // 0.00 – 0.10 Header
      tl.to('.spec-heading-el', { opacity: 1, y: 0, duration: 0.10, ease: 'power3.out' }, 0)
        .to('.spec-badge-el',   { opacity: 1, duration: 0.06, ease: 'power2.out' }, 0.02)
        .to('.spec-desc-el',    { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0.06)

      // 0.10 – 0.25 Prism spins into existence
        .to('.prism-hex-el',
            { opacity: 1, scale: 1, rotate: 60, duration: 0.15, ease: 'back.out(1.5)' }, 0.10)

      // 0.25 – 0.45 Refracted beams shoot out
        .to('[class^="spec-beam-"]',
            { opacity: 0.4, stagger: 0.025, duration: 0.10, ease: 'power2.out' }, 0.25)

      // 0.40 – 0.65 Cards materialise at endpoints (hex stagger)
        .to('.spec-card-el',
            { opacity: 1, scale: 1, stagger: { each: 0.03, from: 'start' },
              duration: 0.18, ease: 'back.out(1.3)' }, 0.40)

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
