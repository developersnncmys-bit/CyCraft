'use client';
import { type RefObject, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap/register';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';

/**
 * Program Overview motion. CINEMA_SPEC §2.2 ("Terminal types out boot sequence
 * char-by-char on scroll"). Returns `terminalStarted` so the section can defer
 * mounting the typing component until the scrubbed scroll reaches the right
 * window — keeping the cinema path scroll-anchored even though the typing
 * itself remains time-based.
 *
 *  - reducedMotion → composed immediately
 *  - mobile → entry-on-view; terminal types on viewport entry; cards on bootComplete
 *  - desktop → pin + scrub, 250vh; terminal starts at progress 0.20; cards
 *    materialise via scroll-bound tween at 0.55–0.75 (independent of bootComplete)
 */
export function useTerminalBoot(
  containerRef: RefObject<HTMLElement | null>,
  bootComplete: boolean,
) {
  const [terminalStarted, setTerminalStarted] = useState(false);
  const reducedMotion = useReducedMotion();
  const isDesktop = useIsDesktop();

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      // ── Reduced motion: instant composed state ─────────────────────────
      if (reducedMotion) {
        gsap.set(['.detail-card-el'], { opacity: 1, y: 0 });
        gsap.set(['.detail-bar-el'], { scaleX: 1 });
        gsap.set(['.po-heading-el', '.po-badge-el', '.po-terminal-el'], { opacity: 1 });
        setTerminalStarted(true);
        return;
      }

      // ──────────────────────────────────────────────────────────────────
      //  MOBILE PATH — preserved landing-page behaviour
      // ──────────────────────────────────────────────────────────────────
      if (!isDesktop) {
        // Terminal starts immediately on mount; cards revealed when typing finishes
        setTerminalStarted(true);

        if (bootComplete) {
          gsap.to('.detail-card-el',
            { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power2.out' });
          gsap.to('.detail-bar-el',
            { scaleX: 1, stagger: 0.12, duration: 0.8, ease: 'power2.inOut', delay: 0.3 });
        } else {
          gsap.set('.detail-card-el', { opacity: 0, y: 20 });
          gsap.set('.detail-bar-el', { scaleX: 0, transformOrigin: 'left' });
        }
        return;
      }

      // ──────────────────────────────────────────────────────────────────
      //  DESKTOP CINEMA PATH — pin + scrub
      //  Beat windows (250vh pin):
      //    0.00–0.10  Heading + badge reveal
      //    0.10–0.20  Terminal window scales in (opacity + scale)
      //    0.20       Terminal typing begins (autonomous after this point)
      //    0.55–0.75  Detail cards materialise (scroll-bound, decoupled from
      //               bootComplete so fast-scrollers still see them)
      //    0.75–1.00  Hold + camera nudge 2%
      // ──────────────────────────────────────────────────────────────────

      // Initial state
      gsap.set(['.po-heading-el', '.po-badge-el'], { opacity: 0, y: 20 });
      gsap.set('.po-terminal-el', { opacity: 0, scale: 0.96 });
      gsap.set('.detail-card-el', { opacity: 0, y: 30 });
      gsap.set('.detail-bar-el', { scaleX: 0, transformOrigin: 'left' });
      gsap.set('.po-camera-el', { scale: 1, transformOrigin: 'center center' });

      const tl = makePinnedTimeline({
        trigger: container,
        end: PIN_DURATIONS.programOverview,
        scrub: 1,
        enabled: true,
        unpinned: true,
        onUpdate: (self) => {
          // Latch terminal start at progress 0.20 — does not re-disable on scroll-back
          if (self.progress >= 0.20) setTerminalStarted(true);
        },
      });

      // 0.00 – 0.10 Heading + badge
      tl.to('.po-heading-el', { opacity: 1, y: 0, duration: 0.08, ease: 'power3.out' }, 0)
        .to('.po-badge-el',   { opacity: 1, y: 0, duration: 0.08, ease: 'power3.out' }, 0.04)

      // 0.10 – 0.20 Terminal window scales in
        .to('.po-terminal-el', { opacity: 1, scale: 1, duration: 0.10, ease: 'power2.out' }, 0.10)

      // 0.55 – 0.75 Detail cards materialise (scroll-bound)
        .to('.detail-card-el',
            { opacity: 1, y: 0, stagger: 0.04, duration: 0.15, ease: 'power2.out' }, 0.55)

      // Bars trail the cards slightly
        .to('.detail-bar-el',
            { scaleX: 1, stagger: 0.04, duration: 0.12, ease: 'power2.inOut' }, 0.62)

      // 0.75 – 1.00 Camera nudge
        .to('.po-camera-el', { scale: 0.98, duration: 0.25, ease: 'power2.inOut' }, 0.75);

      // bootComplete is observed but doesn't drive card reveal in cinema mode —
      // referenced here to satisfy the dependencies array.
      void bootComplete;
    },
    { scope: containerRef, dependencies: [bootComplete, reducedMotion, isDesktop] },
  );

  return { terminalStarted };
}
