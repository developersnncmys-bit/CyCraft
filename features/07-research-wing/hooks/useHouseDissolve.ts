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
 * Cinema architecture: camera-el contains two 100vh blocks
 * (heading+workstation, house). The camera-el translates Y from 0 → -100vh
 * across the pin, so the house scrolls into the pinned viewport. Per-block
 * reveals (terminal un-tilt, house dissolve) overlay the pan.
 *
 * Beat windows:
 *   0.00–0.12  Heading reveals (camera y=0)
 *   0.08–0.22  Workstation fades in; terminal un-tilts
 *   0.22–0.32  Hold — let the reader take in the workstation
 *   0.32–0.62  Camera pans 0 → -100vh (house enters)
 *   0.55–0.68  House fades in; camera zooms in (scale 1 → 1.6)
 *   0.68–0.85  Walls dissolve, interior revealed
 *   0.85–1.00  Inside hold
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
      //  DESKTOP CINEMA PATH — pin + scrub + camera-pan (2 blocks)
      // ──────────────────────────────────────────────────────────────────

      // Initial state — heading + workstation share the first block, both
      // composed at camera y=0 so the heading titles the workstation content.
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

      // 0.00 – 0.12 Heading reveals (camera y=0)
      tl.to('.rw-heading-el', { opacity: 1, y: 0, duration: 0.12, ease: 'power3.out' }, 0)

      // 0.08 – 0.22 Workstation block fades in + terminal un-tilts
        .to('.rw-block-workstation-el', { opacity: 1, duration: 0.12, ease: 'power2.out' }, 0.08)
        .to('.workstation-frame-el',    { rotateY: 0, duration: 0.14, ease: 'power2.out' }, 0.08)

      // 0.22 – 0.32 Hold — let the reader take in the workstation

      // 0.32 – 0.62 Camera pans 0 → -100vh (house enters)
        .to('.rw-camera-el', { y: () => -window.innerHeight, duration: 0.30, ease: 'none' }, 0.32)

      // 0.55 – 0.68 House reveals + camera zooms in
        .to('.rw-block-house-el', { opacity: 1, duration: 0.10, ease: 'power2.out' }, 0.55)
        .to('.hacker-house-el',   { scale: 1.6, duration: 0.15, ease: 'power2.inOut' }, 0.55)

      // 0.68 – 0.85 Walls dissolve, interior revealed
        .to('.house-wall-el',     { opacity: 0, duration: 0.10, ease: 'none' }, 0.68)
        .to('.house-interior-el', { opacity: 1, duration: 0.10, ease: 'power1.out' }, 0.71);

      // 0.85 – 1.00 Inside hold — house stays composed through pin release so the
      // section hands off directly to the next one (no blank-screen gap).
    },
    { scope: containerRef, dependencies: [reducedMotion, isDesktop] },
  );
}
