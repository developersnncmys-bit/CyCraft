'use client';
import { type RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';

/**
 * Learning Evolution motion. CINEMA_SPEC §2.2.
 *  - reducedMotion → composed
 *  - mobile → entry-on-view per phase node
 *  - desktop → pin + scrub, 250vh + camera-pan
 *
 * Beat windows (in 250vh pin):
 *   0.00–0.08  Heading + description reveal
 *   0.08–0.90  Camera pans through phase nodes; beam grows alongside
 *              Per-phase reveals fire at distributed progress points
 *   0.90–1.00  Pin-exit fade
 */
export function useTimelineProgress(containerRef: RefObject<HTMLElement | null>) {
  const reducedMotion = useReducedMotion();
  const isDesktop = useIsDesktop();

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const cameraEl = container.querySelector<HTMLElement>('.le-camera-el');
      const nodes = container.querySelectorAll<HTMLElement>('.phase-node-el');
      const beam = container.querySelector<HTMLElement>('.evolution-beam-el');

      if (reducedMotion) {
        gsap.set([...nodes], { opacity: 1, x: 0 });
        if (beam) gsap.set(beam, { scaleY: 1 });
        gsap.set(['.le-heading-el', '.le-desc-el'], { opacity: 1 });
        return;
      }

      // ── Mobile path ────────────────────────────────────────────────────
      if (!isDesktop) {
        if (beam) {
          gsap.fromTo(beam, { scaleY: 0 },
            { scaleY: 1, ease: 'none',
              scrollTrigger: { trigger: container, start: 'top 70%', end: 'bottom 30%', scrub: 1 } });
        }
        nodes.forEach((node) => {
          gsap.to(node, {
            opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: node, start: 'top 80%', toggleActions: 'play none none reset' },
          });
        });
        return;
      }

      // ── Desktop cinema ────────────────────────────────────────────────
      gsap.set('.le-camera-el',  { y: 0, opacity: 1 });
      gsap.set('.le-heading-el', { opacity: 0, y: 24 });
      gsap.set('.le-desc-el',    { opacity: 0, y: 16 });
      gsap.set(nodes, { opacity: 0, x: 0 });
      nodes.forEach((node) => {
        const dot = node.querySelector('.phase-dot-el');
        if (dot) gsap.set(dot, { scale: 0 });
      });
      if (beam) gsap.set(beam, { scaleY: 0, transformOrigin: 'top center' });

      // Function-based pan distance — recomputed on each refresh
      const panDistance = () => {
        if (!cameraEl) return 0;
        return Math.max(0, cameraEl.scrollHeight - window.innerHeight);
      };

      const tl = makePinnedTimeline({
        trigger: container,
        end: PIN_DURATIONS.learningEvolution,
        scrub: 1,
        enabled: true,
        unpinned: true,
        invalidateOnRefresh: true,
      });

      // Heading + description
      tl.to('.le-heading-el', { opacity: 1, y: 0, duration: 0.08, ease: 'power3.out' }, 0)
        .to('.le-desc-el',    { opacity: 1, y: 0, duration: 0.06, ease: 'power2.out' }, 0.04);

      // 0.08 – 0.75 Camera pans so the phase nodes scroll through the
      // pinned viewport. Ends at 0.75 (was 0.90) so the final phase sits
      // stationary for the last 25% of the pin (~80vh of scroll) instead
      // of still drifting upward while the reader is trying to absorb it.
      if (cameraEl) {
        tl.to(cameraEl, { y: () => -panDistance(), duration: 0.67, ease: 'none' }, 0.08);
      }

      if (beam) {
        tl.to(beam, { scaleY: 1, duration: 0.67, ease: 'none' }, 0.08);
      }

      // Per-phase reveals distributed across the first 70% of the pan
      // (was 82%) so the final phase has ~30% of the timeline = ~96vh of
      // dwell scroll for the reader before the section unpins. Final phase
      // was previously revealing with ~40vh of pin left, which read as
      // "jumping to the next section before I could finish reading."
      const total = nodes.length || 1;
      nodes.forEach((node, i) => {
        const revealAt = 0.12 + (0.55 * (i / Math.max(total - 1, 1)));
        const dot = node.querySelector('.phase-dot-el');
        tl.to(node, { opacity: 1, duration: 0.06, ease: 'power3.out' }, revealAt);
        if (dot) {
          tl.to(dot, { scale: 1, duration: 0.05, ease: 'back.out(1.7)' }, revealAt + 0.02);
        }
      });

      const refreshIds = [120, 400, 1000].map((ms) =>
        window.setTimeout(() => ScrollTrigger.refresh(), ms),
      );
      return () => refreshIds.forEach((id) => window.clearTimeout(id));
    },
    { scope: containerRef, dependencies: [reducedMotion, isDesktop] },
  );
}
