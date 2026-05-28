'use client';
import { type RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap/register';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';

/**
 * Research Wing motion. CINEMA_SPEC §2.2 ("camera goes INSIDE the Hacker House").
 *  - reducedMotion → composed
 *  - mobile → entry-on-view
 *  - desktop → pin + scrub, 300vh (tightened from spec's 450vh — the camera-pan
 *    architecture already moves 200vh, so 450vh of scroll left long static
 *    holds that read as "stuck")
 *
 * Cinema architecture: camera-el contains three 100vh blocks (heading,
 * workstation, house). The camera-el translates Y from 0 → -200vh across
 * the pin, so each block scrolls into the pinned viewport in turn. Per-block
 * reveals (terminal un-tilt, house dissolve) overlay the pan.
 *
 * Beat windows (in 300vh pin):
 *   0.00–0.10  Heading reveals (camera y=0) — 30vh
 *   0.10–0.40  Camera pans 0 → -100vh (workstation enters) — 90vh
 *   0.30–0.42  Workstation fades in; terminal un-tilts
 *   0.42–0.50  Workstation hold (short — keep momentum) — 24vh
 *   0.50–0.75  Camera pans -100vh → -200vh (house enters) — 75vh
 *   0.60–0.75  House fades in; camera zooms in (scale 1 → 1.6)
 *   0.75–0.92  Walls dissolve, interior revealed
 *   0.92–1.00  Inside hold — 24vh
 */
export function useHouseDissolve(containerRef: RefObject<HTMLElement | null>) {
  const reducedMotion = useReducedMotion();
  const isDesktop = useIsDesktop();

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      // ── Reduced motion ─────────────────────────────────────────────────
      if (reducedMotion) {
        gsap.set('.house-wall-el', { opacity: 0 });
        gsap.set('.house-interior-el', { opacity: 1 });
        gsap.set('.workstation-frame-el', { rotateY: 0 });
        gsap.set(['.rw-heading-el', '.rw-block-workstation-el', '.rw-block-house-el'],
                 { opacity: 1, y: 0 });
        return;
      }

      // ──────────────────────────────────────────────────────────────────
      //  MOBILE PATH — entry-on-view
      // ──────────────────────────────────────────────────────────────────
      if (!isDesktop) {
        gsap.fromTo('.workstation-frame-el',
          { rotateY: -15 },
          { rotateY: 0, duration: 1.2, ease: 'power2.out',
            scrollTrigger: { trigger: '.workstation-frame-el', start: 'top 65%', toggleActions: 'play none none reverse' } });

        gsap.timeline({
          scrollTrigger: { trigger: '.hacker-house-el', start: 'top 70%', end: 'bottom 30%', scrub: 1.5 },
        })
          .to('.hacker-house-el',   { scale: 1.6, ease: 'none' }, 0)
          .to('.house-wall-el',     { opacity: 0, ease: 'none' }, 0.2)
          .to('.house-interior-el', { opacity: 1, ease: 'power1.out' }, 0.4);
        return;
      }

      // ──────────────────────────────────────────────────────────────────
      //  DESKTOP CINEMA PATH — pin + scrub + camera-pan, 450vh
      // ──────────────────────────────────────────────────────────────────

      // Initial state
      gsap.set('.rw-camera-el', { y: 0, willChange: 'transform' });
      gsap.set('.rw-heading-el',           { opacity: 0, y: 30 });
      gsap.set('.rw-block-workstation-el', { opacity: 0 });
      gsap.set('.workstation-frame-el',    { rotateY: -15 });
      gsap.set('.rw-block-house-el',       { opacity: 0 });
      gsap.set('.hacker-house-el',         { scale: 1 });
      gsap.set('.house-wall-el',           { opacity: 1 });
      gsap.set('.house-interior-el',       { opacity: 0 });

      const tl = makePinnedTimeline({
        trigger: container,
        end: PIN_DURATIONS.researchWing,
        scrub: 1,
        enabled: true,
        invalidateOnRefresh: true,
      });

      // 0.00 – 0.10 Heading reveals
      tl.to('.rw-heading-el', { opacity: 1, y: 0, duration: 0.10, ease: 'power3.out' }, 0)

      // 0.10 – 0.40 Camera pans 0 → -100vh (workstation enters)
        .to('.rw-camera-el', { y: () => -window.innerHeight, duration: 0.30, ease: 'none' }, 0.10)

      // 0.30 – 0.42 Workstation reveals + terminal un-tilts
        .to('.rw-block-workstation-el', { opacity: 1, duration: 0.10, ease: 'power2.out' }, 0.30)
        .to('.workstation-frame-el',    { rotateY: 0, duration: 0.12, ease: 'power2.out' }, 0.30)

      // 0.42 – 0.50 Brief workstation hold

      // 0.50 – 0.75 Camera pans -100vh → -200vh (house enters)
        .to('.rw-camera-el', { y: () => -window.innerHeight * 2, duration: 0.25, ease: 'none' }, 0.50)

      // 0.60 – 0.75 House reveals + camera zooms in
        .to('.rw-block-house-el', { opacity: 1, duration: 0.10, ease: 'power2.out' }, 0.60)
        .to('.hacker-house-el',   { scale: 1.6, duration: 0.15, ease: 'power2.inOut' }, 0.60)

      // 0.75 – 0.92 Walls dissolve, interior revealed
        .to('.house-wall-el',     { opacity: 0, duration: 0.10, ease: 'none' }, 0.75)
        .to('.house-interior-el', { opacity: 1, duration: 0.10, ease: 'power1.out' }, 0.78);

      // 0.92 – 1.00 Inside hold — house stays composed through pin release so the
      // section hands off directly to the next one (no blank-screen gap).
    },
    { scope: containerRef, dependencies: [reducedMotion, isDesktop] },
  );
}
