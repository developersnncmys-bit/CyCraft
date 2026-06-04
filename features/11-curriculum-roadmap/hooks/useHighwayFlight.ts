'use client';
import { type RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';

/**
 * Curriculum Roadmap motion. CINEMA_SPEC §7.5 — THE SPINE.
 *  - reducedMotion → composed
 *  - mobile → entry-on-view per checkpoint
 *  - desktop → pin + scrub, 500vh + camera-pan through the highway
 *
 * Cinema architecture: camera-el contains a 100vh header block + the highway
 * (variable height — typically 200–250vh of stacked checkpoints). Camera pans
 * vertically over the pin so the user "flies down" the road.
 *
 * Beat windows (in 500vh pin):
 *   0.00–0.08  Header reveals (camera y=0)
 *   0.08–0.95  Camera pans linearly Y → -(content_height - 100vh)
 *              Per-checkpoint reveals fire as they enter viewport via their
 *              own ScrollTriggers (computed off the pinned timeline).
 *   0.00–0.95  Centre beam grows downward (scaleY 0 → 1) tracking the pan
 *   0.95–1.00  Camera fades for clean pin exit
 */
export function useHighwayFlight(containerRef: RefObject<HTMLElement | null>) {
  const reducedMotion = useReducedMotion();
  const isDesktop = useIsDesktop();

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const cameraEl    = container.querySelector<HTMLElement>('.curriculum-camera-el');
      const headerBlock = container.querySelector<HTMLElement>('.curriculum-block-header-el');
      const highway     = container.querySelector<HTMLElement>('.highway-el');
      const checkpoints = container.querySelectorAll<HTMLElement>('.semester-checkpoint-el');
      const chips       = container.querySelectorAll<HTMLElement>('.subject-chip-el');
      const markers     = container.querySelectorAll<HTMLElement>('.year-marker-el');
      const beamLine    = container.querySelector<HTMLElement>('.highway-beam-line');

      if (reducedMotion) {
        gsap.set([...checkpoints, ...chips, ...markers],
                 { opacity: 1, y: 0, transform: 'none' });
        if (beamLine) gsap.set(beamLine, { scaleY: 1 });
        gsap.set(['.curriculum-heading-el', '.curriculum-badge-el', '.curriculum-desc-el'],
                 { opacity: 1 });
        return;
      }

      // ──────────────────────────────────────────────────────────────────
      //  MOBILE PATH — entry-on-view per checkpoint
      // ──────────────────────────────────────────────────────────────────
      if (!isDesktop) {
        if (beamLine) {
          gsap.fromTo(beamLine,
            { scaleY: 0 },
            { scaleY: 1, ease: 'none',
              scrollTrigger: { trigger: container, start: 'top 60%', end: 'bottom 40%', scrub: 1 } });
        }
        checkpoints.forEach((cp) => {
          const cpChips = cp.querySelectorAll<HTMLElement>('.subject-chip-el');
          const marker = cp.querySelector<HTMLElement>('.year-marker-el');
          const tl = gsap.timeline({
            scrollTrigger: { trigger: cp, start: 'top 85%', toggleActions: 'play none none none' },
          });
          if (marker) tl.fromTo(marker, { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, 0);
          tl.fromTo(cp, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', immediateRender: false }, 0.1);
          if (cpChips.length) {
            tl.fromTo(cpChips, { opacity: 0 }, { opacity: 1, stagger: 0.04, duration: 0.4, immediateRender: false }, 0.35);
          }
        });
        return;
      }

      // ──────────────────────────────────────────────────────────────────
      //  DESKTOP CINEMA PATH — pin + scrub + camera-pan, 500vh
      //  Pan distance computed via function-based GSAP values so it
      //  recomputes when ScrollTrigger refreshes (e.g. after lazy fonts /
      //  images settle and camera-el's scrollHeight changes).
      // ──────────────────────────────────────────────────────────────────

      // Initial state
      gsap.set('.curriculum-camera-el',  { y: 0, opacity: 1 });
      gsap.set('.curriculum-heading-el', { opacity: 0, y: 30 });
      gsap.set('.curriculum-badge-el',   { opacity: 0 });
      gsap.set('.curriculum-desc-el',    { opacity: 0, y: 16 });
      gsap.set(checkpoints,              { opacity: 0, y: 20 });
      gsap.set(markers,                  { opacity: 0 });
      gsap.set(chips,                    { opacity: 0 });
      if (beamLine) gsap.set(beamLine,   { scaleY: 0, transformOrigin: 'top center' });

      // Function-based pan distance — recomputed on every refresh
      const panDistance = () => {
        if (!cameraEl) return 0;
        return Math.max(0, cameraEl.scrollHeight - window.innerHeight);
      };

      const tl = makePinnedTimeline({
        trigger: container,
        end: PIN_DURATIONS.curriculum,
        scrub: 1,
        enabled: true,
        unpinned: true,
        invalidateOnRefresh: true,
      });

      // 0.00 – 0.08 Header reveals (camera at y=0)
      tl.to('.curriculum-badge-el',   { opacity: 1, duration: 0.04, ease: 'power2.out' }, 0)
        .to('.curriculum-heading-el', { opacity: 1, y: 0, duration: 0.08, ease: 'power3.out' }, 0.01)
        .to('.curriculum-desc-el',    { opacity: 1, y: 0, duration: 0.06, ease: 'power2.out' }, 0.04);

      // 0.08 – 0.70 Camera pans linearly so the highway scrolls through the
      // pinned viewport. Ends at 0.70 (was 0.95) so the bottom row (S7/S8)
      // sits stationary for the last 30% of the pin (~96vh of scroll)
      // instead of still drifting upward while the reader is trying to
      // absorb the final semester.
      if (cameraEl) {
        tl.to(cameraEl, { y: () => -panDistance(), duration: 0.62, ease: 'none' }, 0.08);
      }

      // Beam line grows in lockstep with the pan
      if (beamLine) {
        tl.to(beamLine, { scaleY: 1, duration: 0.62, ease: 'none' }, 0.08);
      }

      // Per-row reveals — both checkpoints in a row ignite together.
      //
      // DOM order from querySelectorAll: [L1, L3, L5, L7, R2, R4, R6, R8]
      // Visual row pairs (top→bottom): [L1,R2], [L3,R4], [L5,R6], [L7,R8]
      //
      // Reveals distributed across the front 65% of the timeline (was
      // 20–80%) so the last row (S7/S8) appears with ~35% of the pin
      // remaining for reading. The camera-pan also ends at 0.70 so once
      // S7/S8 reveal at 0.65 the content is stationary almost immediately.
      const ROW_REVEALS = [0.16, 0.32, 0.48, 0.65];
      const half = Math.floor(checkpoints.length / 2);
      for (let row = 0; row < half; row++) {
        const revealAt = ROW_REVEALS[row] ?? 0.85;
        const leftCp = checkpoints[row];          // L1, L3, L5, L7
        const rightCp = checkpoints[row + half];  // R2, R4, R6, R8
        const pair = [leftCp, rightCp].filter(Boolean);
        if (!pair.length) continue;

        tl.to(pair, { opacity: 1, y: 0, duration: 0.06, ease: 'power3.out' }, revealAt);

        pair.forEach((cp) => {
          const marker = cp.querySelector<HTMLElement>('.year-marker-el');
          const cpChips = cp.querySelectorAll<HTMLElement>('.subject-chip-el');
          if (marker) {
            tl.to(marker, { opacity: 1, duration: 0.04, ease: 'power2.out' }, revealAt);
          }
          if (cpChips.length) {
            tl.to(cpChips, { opacity: 1, stagger: 0.01, duration: 0.04, ease: 'power2.out' }, revealAt + 0.02);
          }
        });
      }

      // Fade the camera out over the last 5% of the timeline so it's at
      // opacity 0 by the time the pin releases. Avoids both the
      // "lingering bottom content" tail (when the camera stays at
      // y: -panDistance with full opacity post-pin) AND the abrupt-snap
      // blank space that `hideCameraOnLeave: true` produces. The fade is
      // visible to the reader as a natural close to the section.
      if (cameraEl) {
        tl.to(cameraEl, { opacity: 0, duration: 0.05, ease: 'power2.in' }, 0.95);
      }

      // Trigger several deferred refreshes so the pan distance picks up
      // late-arriving layout (lazy fonts, chip wrapping, dynamic imports).
      const refreshIds = [120, 400, 1000].map((ms) =>
        window.setTimeout(() => ScrollTrigger.refresh(), ms),
      );
      return () => refreshIds.forEach((id) => window.clearTimeout(id));
    },
    { scope: containerRef, dependencies: [reducedMotion, isDesktop] },
  );
}
