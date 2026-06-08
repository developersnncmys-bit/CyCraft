'use client';
/* Project-First Curriculum cinema timeline.
 * Code-window stack shuffles in 3D as scroll advances through the pin. */
import { type RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';

/**
 * Projects motion. CINEMA_SPEC §2.2 ("3 terminal windows shuffle in 3D").
 *  - reducedMotion / mobile → static front window
 *  - desktop → pin + scrub, 300vh
 *
 * Cinema beat windows:
 *   0.00–0.10  Heading + description reveal
 *   0.10–0.30  Code window stack fades + lifts into view
 *   0.20–0.50  Project list items reveal (staggered)
 *   0.50–0.75  3D shuffle — front pushes back, back flies forward
 *   0.75–1.00  Hold + camera nudge
 */
export function useProjectShuffle(containerRef: RefObject<HTMLElement | null>) {
  const reducedMotion = useReducedMotion();
  const isDesktop = useIsDesktop();

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      if (reducedMotion || !isDesktop) {
        gsap.set('.code-window-0', { opacity: 1, zIndex: 3 });
        gsap.set('.code-window-1', { opacity: 0.3 });
        gsap.set('.code-window-2', { opacity: 0.1 });
        gsap.set(['.projects-heading-el', '.projects-desc-el', '.projects-list-item-el', '.projects-stack-wrap-el'],
                 { opacity: 1, y: 0 });

        // Mobile/desktop-non-cinema path: keep original entry+shuffle on view
        if (!reducedMotion && !isDesktop) {
          gsap.from('.code-window-el', {
            opacity: 0, y: 40, stagger: 0.1, duration: 0.8, ease: 'power2.out',
            scrollTrigger: { trigger: container, start: 'top 60%', toggleActions: 'play none none reset' },
          });
        }
        return;
      }

      // ──────────────────────────────────────────────────────────────────
      //  DESKTOP CINEMA PATH — pin + scrub
      // ──────────────────────────────────────────────────────────────────

      // Initial state. Heading + description stay at default opacity:1
      // (Approach B). Code window stack, list items, and 3D shuffle KEEP
      // their reveals — they are the cinema beats.
      gsap.set('.projects-list-item-el', { opacity: 0, x: -20 });
      gsap.set('.projects-stack-wrap-el', { opacity: 0 });
      gsap.set('.code-window-0', { opacity: 1, zIndex: 3 });
      gsap.set('.code-window-1', { opacity: 0.3 });
      gsap.set('.code-window-2', { opacity: 0.1 });
      gsap.set('.projects-camera-el', { scale: 1, transformOrigin: 'center center' });

      const tl = makePinnedTimeline({
        trigger: container,
        end: PIN_DURATIONS.projects,
        scrub: 1,
        enabled: true,
        unpinned: true,
      });

      // Heading + description reveals removed (Approach B — start opacity:1).

      // 0.10 – 0.30 Code window stack fades in (3D presence)
      tl.to('.projects-stack-wrap-el', { opacity: 1, duration: 0.20, ease: 'power2.out' }, 0.10)

      // 0.20 – 0.50 Project list items reveal
        .to('.projects-list-item-el',
            { opacity: 1, x: 0, stagger: 0.06, duration: 0.10, ease: 'power2.out' }, 0.20)

      // 0.50 – 0.75 3D shuffle — window 2 flies forward, window 0 pushes back
        .to('.code-window-2',
            { translateZ: 0, translateX: 0, translateY: 0, opacity: 1, zIndex: 10,
              duration: 0.25, ease: 'power3.out' }, 0.50)
        .to('.code-window-0',
            { translateZ: -360, translateX: 60, translateY: 40, opacity: 0.35, zIndex: 1,
              duration: 0.25, ease: 'power3.out' }, 0.50)

      // 0.75 – 1.00 Hold + camera nudge
        .to('.projects-camera-el', { scale: 0.98, duration: 0.25, ease: 'power2.inOut' }, 0.75);

      void ScrollTrigger;
    },
    { scope: containerRef, dependencies: [reducedMotion, isDesktop] },
  );
}
