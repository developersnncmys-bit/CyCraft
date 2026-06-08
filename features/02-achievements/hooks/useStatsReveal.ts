'use client';
import { type RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';

/**
 * Achievements motion has three paths:
 *  - reducedMotion → instant reveal, no animation
 *  - mobile (< 1024px) → entry-on-view per-stat triggers (original model)
 *  - desktop → pin + scrub per CINEMA_SPEC §7.2 (250vh pin)
 *
 * Cinema beat windows (progress space):
 *   0.00–0.10  Beam arrives from above; badge enters
 *   0.10–0.25  Heading + description reveal
 *   0.25–0.40  Stat 1 ignites (fade, counter 0→target, underline draws)
 *   0.40–0.55  Stat 2 ignites
 *   0.55–0.70  Stat 3 ignites
 *   0.70–0.85  Stat 4 ignites — all four glowing
 *   0.85–1.00  Constellation hold + camera zoom-out 5%; beam pulses brighter
 *              as a foreshadow of the next section's prism
 */
export function useStatsReveal(containerRef: RefObject<HTMLElement | null>) {
  const reducedMotion = useReducedMotion();
  const isDesktop = useIsDesktop();

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const waypoints = container.querySelectorAll<HTMLElement>('.stat-waypoint-el');
      const tracerActive = container.querySelector<HTMLElement>('.beam-tracer-active');

      // ── Reduced motion: instant composed state ─────────────────────────
      // Headline morph collapses to just the last phrase so the user sees the
      // most descriptive copy without any swapping animation.
      if (reducedMotion) {
        waypoints.forEach((wp) => {
          const target = Number(wp.dataset.target ?? 0);
          const valueEl = wp.querySelector<HTMLElement>('.stat-value-el');
          const underEl = wp.querySelector<HTMLElement>('.stat-underline-el');
          if (valueEl) valueEl.textContent = String(target);
          gsap.set(wp, { opacity: 1 });
          if (underEl) gsap.set(underEl, { scaleX: 1 });
        });
        if (tracerActive) gsap.set(tracerActive, { scaleY: 1 });
        gsap.set(['.achv-badge-el', '.achv-heading-el', '.achv-desc-el'], { opacity: 1 });
        const morphs = container.querySelectorAll<HTMLElement>('.achv-heading-morph');
        morphs.forEach((m, i) => {
          gsap.set(m, { opacity: i === morphs.length - 1 ? 1 : 0 });
        });
        return;
      }

      // Mobile + desktop both need the first morph visible; later morphs are
      // hidden initially and only swap in on the desktop scrub timeline.
      const headingMorphs = container.querySelectorAll<HTMLElement>('.achv-heading-morph');
      headingMorphs.forEach((m, i) => {
        gsap.set(m, { opacity: i === 0 ? 1 : 0 });
      });

      // ──────────────────────────────────────────────────────────────────
      //  MOBILE PATH — entry-on-view per-stat. Preserved from landing-page model.
      // ──────────────────────────────────────────────────────────────────
      if (!isDesktop) {
        waypoints.forEach((wp) => {
          const target = Number(wp.dataset.target ?? 0);
          const valueEl = wp.querySelector<HTMLElement>('.stat-value-el');
          const underEl = wp.querySelector<HTMLElement>('.stat-underline-el');

          gsap.fromTo(
            wp,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: wp,
                start: 'top 80%',
                toggleActions: 'play none none reset',
              } as ScrollTrigger.Vars,
            },
          );

          if (valueEl) {
            const obj = { val: 0 };
            gsap.to(obj, {
              val: target,
              duration: 1.5,
              ease: 'power2.out',
              onUpdate() {
                valueEl.textContent = String(Math.round(obj.val));
              },
              scrollTrigger: {
                trigger: wp,
                start: 'top 75%',
                toggleActions: 'play none none reset',
              } as ScrollTrigger.Vars,
            });
          }

          if (underEl) {
            gsap.to(underEl, {
              scaleX: 1,
              duration: 0.6,
              ease: 'power2.out',
              delay: 0.3,
              scrollTrigger: {
                trigger: wp,
                start: 'top 75%',
                toggleActions: 'play none none reset',
              } as ScrollTrigger.Vars,
            });
          }
        });
        return;
      }

      // ──────────────────────────────────────────────────────────────────
      //  DESKTOP CINEMA PATH — pin + scrub per CINEMA_SPEC §7.2
      // ──────────────────────────────────────────────────────────────────

      // Initial state. Header elements (badge / heading / desc) stay at
      // their default opacity:1 — NO fade-in on pin engage. The ×2.5 scrub
      // multiplier made progress-0 fade-ins trail the scroll perceptibly,
      // reading as a "pinned-but-blank" window at section entry. With the
      // headers composed from the start, content is visible the instant the
      // pin engages. Cinematic scrub-driven motion below (beam tracer scaleY,
      // stat ignitions, counter, underlines, camera scale) is preserved.
      gsap.set('.achv-camera-el', { scale: 1, transformOrigin: 'center center' });
      if (tracerActive) gsap.set(tracerActive, { scaleY: 0, transformOrigin: 'top' });
      waypoints.forEach((wp) => {
        const valueEl = wp.querySelector<HTMLElement>('.stat-value-el');
        const underEl = wp.querySelector<HTMLElement>('.stat-underline-el');
        gsap.set(wp, { opacity: 0, y: 30 });
        if (underEl) gsap.set(underEl, { scaleX: 0, transformOrigin: 'left' });
        if (valueEl) valueEl.textContent = '0';
      });

      const tl = makePinnedTimeline({
        trigger: container,
        end: PIN_DURATIONS.achievements,
        scrub: 1,
        enabled: true,
        unpinned: true,
      });

      // 0.00 – 0.10 Beam tracer enters (headers already composed, no fade-in)
      if (tracerActive) {
        tl.to(tracerActive, { scaleY: 1, duration: 0.10, ease: 'none' }, 0);
      }

      // 0.00 – 0.20 Headline morph — fade each phrase in, then SNAP the
      // previous out 1ms before the next fades in. The snap (tl.set, 0 dur)
      // instead of a fade-out avoids stacking two morphs visible at the same
      // scroll position, which under scrub would read as overlapping text.
      const MORPH_GAP = 0.07;
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

      // Per-stat ignition windows: 0.25, 0.40, 0.55, 0.70
      const STAT_STARTS = [0.25, 0.40, 0.55, 0.70];
      const IGNITE_DUR = 0.12;

      waypoints.forEach((wp, i) => {
        const start = STAT_STARTS[i] ?? STAT_STARTS[STAT_STARTS.length - 1];
        const target = Number(wp.dataset.target ?? 0);
        const valueEl = wp.querySelector<HTMLElement>('.stat-value-el');
        const underEl = wp.querySelector<HTMLElement>('.stat-underline-el');

        // Fade + lift
        tl.to(wp,
              { opacity: 1, y: 0, duration: IGNITE_DUR, ease: 'power2.out' }, start);

        // Counter — onUpdate fires every scrub frame
        if (valueEl) {
          const obj = { val: 0 };
          tl.to(obj, {
            val: target,
            duration: IGNITE_DUR,
            ease: 'power2.out',
            onUpdate() {
              valueEl.textContent = String(Math.round(obj.val));
            },
          }, start);
        }

        // Underline draws in slightly trailing the counter
        if (underEl) {
          tl.to(underEl,
                { scaleX: 1, duration: IGNITE_DUR * 0.6, ease: 'power2.out' },
                start + IGNITE_DUR * 0.4);
        }
      });

      // 0.85 – 1.00 Constellation hold + camera zoom-out + beam foreshadow
      tl.to('.achv-camera-el',
            { scale: 0.95, duration: 0.15, ease: 'power2.inOut' }, 0.85);
      if (tracerActive) {
        tl.to(tracerActive,
              { filter: 'brightness(1.4)', duration: 0.15, ease: 'power2.inOut' }, 0.85);
      }
    },
    { scope: containerRef, dependencies: [reducedMotion, isDesktop] },
  );
}
