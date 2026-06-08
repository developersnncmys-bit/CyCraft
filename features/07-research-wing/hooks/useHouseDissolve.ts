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

      // Initial state. Heading stays at default opacity:1 (Approach B —
      // header text composed from the start). The workstation block, house
      // block, terminal rotation, walls dissolve, interior reveal, camera
      // Y pan are all cinema beats and keep their reveals.
      gsap.set('.rw-camera-el', { y: 0, willChange: 'transform' });
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
        unpinned: true,
        // `invalidateOnRefresh` removed — camera-pan uses a static `y: '-100vh'`
        // string literal (parsed by GSAP at init), not a function, so refresh-
        // time re-evaluation was a no-op and only caused the trigger to
        // recompute start/end mid-scroll. See useTracksTimeline for full
        // context on the pause/jerk + unpin symptom.
      });

      // Heading reveal removed (Approach B — starts at opacity:1).

      // Beat positions re-spread across the full 0.05–0.92 of pin so the
      // animation reads as deliberate at the trimmed +=220% pin (was +=300%
      // with the same beat positions, which under shrink would have read as
      // "rushed"). Final state (interior) lands at 0.92, leaving 0.08 of pin
      // (~18vh) of breathing room before pin release.

      // 0.05 – 0.22 Workstation block fades in + terminal un-tilts
      tl.to('.rw-block-workstation-el', { opacity: 1, duration: 0.17, ease: 'power2.out' }, 0.05)
        .to('.workstation-frame-el',    { rotateY: 0, duration: 0.20, ease: 'power2.out' }, 0.05)

      // 0.25 – 0.60 Camera pans 0 → -100vh so the house block scrolls into
      // the pinned viewport. Slowed and started earlier so the pan reads as
      // a deliberate camera move rather than a fast cut.
        .to('.rw-camera-el', { y: '-100vh', duration: 0.35, ease: 'none' }, 0.25)

      // 0.55 – 0.72 House reveals + camera zooms in (overlaps the tail of
      // the camera pan so the house arrives at exactly the right framing)
        .to('.rw-block-house-el', { opacity: 1, duration: 0.12, ease: 'power2.out' }, 0.55)
        .to('.hacker-house-el',   { scale: 1.6, duration: 0.17, ease: 'power2.inOut' }, 0.55)

      // 0.72 – 0.92 Walls dissolve, interior revealed — stretched so the
      // final beat lands near pin end instead of leaving 30vh of dead tail.
        .to('.house-wall-el',     { opacity: 0, duration: 0.14, ease: 'none' }, 0.72)
        .to('.house-interior-el', { opacity: 1, duration: 0.16, ease: 'power1.out' }, 0.76);

      // 0.92 – 1.00 Composed hold — house stays visible through pin release
      // so the section hands off directly to the next one (no blank gap).
    },
    { scope: containerRef, dependencies: [reducedMotion, isDesktop] },
  );
}
