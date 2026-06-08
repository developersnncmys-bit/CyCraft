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
        const morphs = container.querySelectorAll<HTMLElement>('.le-heading-morph');
        morphs.forEach((m, i) => {
          gsap.set(m, { opacity: i === morphs.length - 1 ? 1 : 0 });
        });
        return;
      }

      // First morph visible on entry; later morphs only swap in via the
      // desktop scrub timeline (or stay hidden on mobile).
      const headingMorphs = container.querySelectorAll<HTMLElement>('.le-heading-morph');
      headingMorphs.forEach((m, i) => {
        gsap.set(m, { opacity: i === 0 ? 1 : 0 });
      });

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
      // Heading + description stay at default opacity:1 (Approach B).
      // Camera Y pan, phase nodes, dots, and beam KEEP their reveals.
      gsap.set('.le-camera-el',  { y: 0, opacity: 1 });
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

      // Heading + description reveals removed (Approach B — start opacity:1).

      // 0.00 – 0.18 Headline morph — swap three phrases. Each fade-in is
      // followed by a snap-out of the previous phrase (0-duration tl.set)
      // 1ms before the next fades in, so exactly one phrase is visible at
      // any scroll position (no two-line stack flicker under bidirectional
      // scrub).
      const MORPH_GAP = 0.06;
      const MORPH_FADE = 0.025;
      headingMorphs.forEach((el, i) => {
        const inAt = i * MORPH_GAP;
        if (i > 0) {
          tl.fromTo(
            el,
            { opacity: 0, yPercent: 30, filter: 'blur(8px)' },
            { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: MORPH_FADE, ease: 'power3.out' },
            inAt,
          );
        }
        if (i < headingMorphs.length - 1) {
          const nextInAt = (i + 1) * MORPH_GAP;
          tl.set(el, { opacity: 0, yPercent: -30, filter: 'blur(8px)' }, nextInAt - 0.001);
        }
      });

      // 0.08 – 0.88 Camera pans so the phase nodes scroll through the
      // pinned viewport. Stretched to 0.88 (was 0.75) so the pan fills more
      // of the trimmed +=250% pin window — the previous 0.75 end on the old
      // +=320% pin left ~80vh of dead-tail scroll where the final phase sat
      // motionless (read by users as a blank gap after the section). Now
      // ends with ~30vh of dwell before pin release.
      if (cameraEl) {
        tl.to(cameraEl, { y: () => -panDistance(), duration: 0.80, ease: 'none' }, 0.08);
      }

      if (beam) {
        tl.to(beam, { scaleY: 1, duration: 0.80, ease: 'none' }, 0.08);
      }

      // Per-phase reveals distributed across 0.12 – 0.83 (was 0.12 – 0.67)
      // so the final phase reveals near the end of the pan instead of
      // mid-window.
      const total = nodes.length || 1;
      nodes.forEach((node, i) => {
        const revealAt = 0.12 + (0.71 * (i / Math.max(total - 1, 1)));
        const dot = node.querySelector('.phase-dot-el');
        tl.to(node, { opacity: 1, duration: 0.06, ease: 'power3.out' }, revealAt);
        if (dot) {
          tl.to(dot, { scale: 1, duration: 0.05, ease: 'back.out(1.7)' }, revealAt + 0.02);
        }
      });

      // Previously: faded the camera-el to opacity 0 over the last 5% of
      // the timeline. The SectionWrapper renders a solid void-black
      // background, so that fade became ~16vh of pure black scroll inside
      // the pin — perceived as a "blank gap between sections". Removed:
      // the camera stays visible until the pin releases and the next
      // section's content slides up over it naturally.

      const refreshIds = [120, 400, 1000].map((ms) =>
        window.setTimeout(() => ScrollTrigger.refresh(), ms),
      );
      return () => refreshIds.forEach((id) => window.clearTimeout(id));
    },
    { scope: containerRef, dependencies: [reducedMotion, isDesktop] },
  );
}
