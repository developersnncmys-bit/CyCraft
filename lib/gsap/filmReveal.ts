'use client';
/**
 * Universal "film-mode" scroll-driven section reveal.
 *
 * Every btech section (2-21) becomes a pinned scrub-driven scene. The hook
 * scans the section for tagged elements and choreographs a single timeline
 * against scroll. Class conventions:
 *
 *   .film-camera         — pinned camera wrapper (scale 1.04 → 1.00 → 0.98)
 *   .film-bg-deep        — back parallax layer (yPercent -8 across pin)
 *   .film-bg-mid         — mid parallax layer  (yPercent -22, scale 1.08 → 1)
 *   .film-bg-front       — front parallax layer (yPercent -38)
 *   .film-image-zoom     — image/video scales 1.18 → 1.0 across pin
 *   .film-headline-morph — sibling phrases swap in/out across first 25%
 *   .film-stat           — counter; reads data-target="<number>" and animates 0→N
 *   .film-fade           — generic fade-up element. Reads data-at and data-dur
 *                          (timeline progress 0-1) for timing. Defaults: at=0.20 dur=0.15
 *
 * All elements with film classes start at composed state visually (opacity:1)
 * via CSS. The hook applies pre-set state in JS BEFORE first paint via
 * useIsomorphicLayoutEffect so there's no flash of composed content.
 */

import { type RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from './register';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface FilmRevealOptions {
  /** Scroll distance the section pins for. Default '+=180%' (1.8 viewports). */
  pin?: string;
  /** Set to false to skip pinning (e.g. final CTA section). */
  enablePin?: boolean;
  /** Scrub smoothing factor — higher = laggier/silkier. Default 1.2. */
  scrub?: number;
  /** Camera scale curve. Default zooms in slightly then settles back. */
  camera?: { from: number; to: number };
}

const FILM_DESKTOP_BREAKPOINT = '(min-width: 1024px)';

/**
 * Single entrypoint per section. Pass the section ref + optional config.
 * Returns nothing — hook is a side-effect only.
 *
 * Usage:
 *   useFilmReveal(sectionRef, { pin: '+=220%' });
 */
export function useFilmReveal(
  sectionRef: RefObject<HTMLElement | null>,
  options: FilmRevealOptions = {},
) {
  const reducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery(FILM_DESKTOP_BREAKPOINT);

  const {
    pin = '+=180%',
    enablePin = true,
    scrub = 1.2,
    camera = { from: 1.04, to: 0.98 },
  } = options;

  useGSAP(
    () => {
      const container = sectionRef.current;
      if (!container) return;

      // Tagged elements — query once per setup.
      const cam = container.querySelector<HTMLElement>('.film-camera');
      const bgDeep = container.querySelector<HTMLElement>('.film-bg-deep');
      const bgMid = container.querySelector<HTMLElement>('.film-bg-mid');
      const bgFront = container.querySelector<HTMLElement>('.film-bg-front');
      const zoomImages = container.querySelectorAll<HTMLElement>('.film-image-zoom');
      const morphs = container.querySelectorAll<HTMLElement>('.film-headline-morph');
      const stats = container.querySelectorAll<HTMLElement>('.film-stat');
      const fades = container.querySelectorAll<HTMLElement>('.film-fade');

      // ── Reduced motion: hard-compose every element, no entry animation. ──
      if (reducedMotion) {
        if (cam) gsap.set(cam, { scale: 1 });
        if (bgDeep) gsap.set(bgDeep, { yPercent: 0 });
        if (bgMid) gsap.set(bgMid, { yPercent: 0, scale: 1 });
        if (bgFront) gsap.set(bgFront, { yPercent: 0 });
        zoomImages.forEach((el) => gsap.set(el, { scale: 1 }));
        morphs.forEach((el, i) => {
          gsap.set(el, { opacity: i === morphs.length - 1 ? 1 : 0 });
        });
        stats.forEach((el) => {
          const target = Number(el.dataset.target ?? el.textContent ?? 0);
          el.textContent = String(target);
        });
        fades.forEach((el) => gsap.set(el, { opacity: 1, y: 0, x: 0 }));
        return;
      }

      // ── Mobile (< 1024) path: not pinned, but per-element entry-on-view
      // animations so the page doesn't read as a static wall of text. Each
      // tween is keyed to its own element's scroll position via toggleActions
      // 'play none none reset', so the animation re-fires if the user scrolls
      // back up and then down again. `data-out-at` (used by desktop cross-fades)
      // is intentionally ignored on mobile — all film-fade beats are stacked
      // vertically there and need to remain visible after their entry. ──
      if (!isDesktop) {
        if (cam) gsap.set(cam, { scale: 1 });

        // Light parallax drift on bg layers across the whole section. Cheap
        // single-trigger tween per layer, scrub:0.5 for a forgiving feel.
        if (bgDeep) {
          gsap.fromTo(
            bgDeep,
            { yPercent: 6 },
            {
              yPercent: -6,
              ease: 'none',
              scrollTrigger: {
                trigger: container,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.5,
              },
            },
          );
        }
        if (bgMid) {
          gsap.fromTo(
            bgMid,
            { yPercent: 12, scale: 1.06 },
            {
              yPercent: -10,
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: container,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.5,
              },
            },
          );
        }
        if (bgFront) {
          gsap.fromTo(
            bgFront,
            { yPercent: 18 },
            {
              yPercent: -22,
              ease: 'none',
              scrollTrigger: {
                trigger: container,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.5,
              },
            },
          );
        }

        // Headline morph: show the LAST phrase only (no swap animation on
        // mobile — the cross-fade is a desktop scrub effect).
        morphs.forEach((el, i) => {
          gsap.set(el, { opacity: i === morphs.length - 1 ? 1 : 0 });
        });

        // Image zoom — scale 1.12 → 1 as element enters view.
        zoomImages.forEach((el) => {
          gsap.fromTo(
            el,
            { scale: 1.12 },
            {
              scale: 1,
              duration: 1.1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none reset',
              },
            },
          );
        });

        // Stats — counter ticks 0 → target when the value enters view.
        stats.forEach((el) => {
          const target = Number(el.dataset.target ?? 0);
          if (!Number.isFinite(target) || target === 0) {
            el.textContent = String(target);
            return;
          }
          const prefix = el.dataset.prefix ?? '';
          const decimals = Number(el.dataset.decimals ?? 0);
          el.textContent = `${prefix}${decimals > 0 ? (0).toFixed(decimals) : '0'}`;
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 1.6,
            ease: 'power2.out',
            onUpdate() {
              el.textContent = `${prefix}${decimals > 0 ? obj.val.toFixed(decimals) : Math.round(obj.val)}`;
            },
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reset',
            },
          });
        });

        // Generic fade — group siblings by parent so tiles in the same
        // grid/row reveal one-by-one (rather than all firing the moment any
        // sibling enters view). `data-start-visible` keeps the element
        // composed on first paint (header elements that should be visible
        // immediately on anchor jumps).
        const groupedByParent = new Map<HTMLElement, HTMLElement[]>();
        fades.forEach((el) => {
          const parent = el.parentElement;
          if (!parent) return;
          const list = groupedByParent.get(parent) ?? [];
          list.push(el);
          groupedByParent.set(parent, list);
        });

        groupedByParent.forEach((siblings) => {
          const startVisible = siblings.filter((el) => el.dataset.startVisible === 'true');
          const animatable = siblings.filter((el) => el.dataset.startVisible !== 'true');

          startVisible.forEach((el) => gsap.set(el, { opacity: 1, y: 0 }));

          if (animatable.length === 0) return;

          // Set initial state on the group, then stagger them via a single
          // ScrollTrigger keyed to the first sibling's entry. Total cascade
          // for N siblings = ~(N-1) × 0.12s + 0.7s duration — comfortable
          // pacing for grids up to ~10 tiles before the tail drags.
          gsap.set(animatable, { opacity: 0, y: 28 });
          gsap.to(animatable, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            stagger: 0.12,
            scrollTrigger: {
              trigger: animatable[0],
              start: 'top 88%',
              toggleActions: 'play none none reset',
            },
          });
        });

        return;
      }

      // ── Pre-state: composed at progress 0, ready to scrub.
      // Camera starts slightly zoomed in.
      if (cam) {
        gsap.set(cam, {
          scale: camera.from,
          transformOrigin: 'center center',
          willChange: 'transform',
        });
      }
      // Parallax layers start "below" so they drift up across the pin.
      if (bgDeep) gsap.set(bgDeep, { yPercent: 4, willChange: 'transform' });
      if (bgMid) gsap.set(bgMid, { yPercent: 11, scale: 1.08, willChange: 'transform' });
      if (bgFront) gsap.set(bgFront, { yPercent: 19, willChange: 'transform' });
      // Zoom images start at 1.18× and settle to 1×.
      zoomImages.forEach((el) => {
        gsap.set(el, { scale: 1.18, transformOrigin: 'center center', willChange: 'transform' });
      });
      // Morph stack: first phrase visible, rest hidden.
      morphs.forEach((el, i) => {
        gsap.set(el, {
          opacity: i === 0 ? 1 : 0,
          y: i === 0 ? 0 : 28,
          filter: i === 0 ? 'blur(0px)' : 'blur(6px)',
          willChange: 'transform, opacity, filter',
        });
      });
      // Stats start at 0; will tick up.
      stats.forEach((el) => {
        el.textContent = '0';
      });
      // Fades start invisible, dropped 24px. `data-start-visible="true"`
      // overrides — the element starts composed (used so anchor-link jumps
      // to a pinned section don't land on a blank screen at progress 0).
      fades.forEach((el) => {
        if (el.dataset.startVisible === 'true') {
          gsap.set(el, { opacity: 1, y: 0, willChange: 'transform, opacity' });
        } else {
          gsap.set(el, { opacity: 0, y: 24, willChange: 'transform, opacity' });
        }
      });

      // ── Timeline ─────────────────────────────────────────────────────────
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: pin,
          pin: enablePin,
          pinSpacing: enablePin,
          scrub,
          anticipatePin: 0,
        },
      });

      // Camera: lerp from `from` to 1.0 over the bulk, then to `to` near the
      // end so the next section can rise into the receding camera.
      if (cam) {
        tl.to(cam, { scale: 1, duration: 0.45, ease: 'power2.out' }, 0)
          .to(cam, { scale: camera.to, duration: 0.25, ease: 'power2.inOut' }, 0.75);
      }

      // Parallax layers — linear drift across the full pin.
      if (bgDeep) tl.to(bgDeep, { yPercent: -8, duration: 1, ease: 'none' }, 0);
      if (bgMid) tl.to(bgMid, { yPercent: -22, scale: 1.0, duration: 1, ease: 'none' }, 0);
      if (bgFront) tl.to(bgFront, { yPercent: -38, duration: 1, ease: 'none' }, 0);

      // Image zoom — scale 1.18 → 1 across first 60% of pin.
      zoomImages.forEach((el) => {
        tl.to(el, { scale: 1, duration: 0.60, ease: 'power2.out' }, 0);
      });

      // Headline morph — fade each phrase in, snap previous out.
      // Total window 0 → 0.25; each phrase gets gap of 0.25/N.
      if (morphs.length > 1) {
        const window = 0.25;
        const gap = window / morphs.length;
        const fadeDur = gap * 0.4;
        morphs.forEach((el, i) => {
          if (i > 0) {
            const inAt = i * gap;
            tl.fromTo(
              el,
              { opacity: 0, y: 28, filter: 'blur(6px)' },
              { opacity: 1, y: 0, filter: 'blur(0px)', duration: fadeDur, ease: 'power3.out' },
              inAt,
            );
            const prev = morphs[i - 1];
            tl.set(prev, { opacity: 0, y: -20, filter: 'blur(6px)' }, inAt - 0.001);
          }
        });
      }

      // Stats — counter ticks 0 → target over a moderate window, ignite
      // staggered across 0.30 → 0.70. Supports optional prefix (data-prefix)
      // and decimal places (data-decimals="1" for one decimal).
      const statSpan = 0.40;
      const statWindow = stats.length > 1 ? statSpan / stats.length : statSpan;
      const statStart = 0.30;
      stats.forEach((el, i) => {
        const target = Number(el.dataset.target ?? 0);
        if (!Number.isFinite(target) || target === 0) return;
        const prefix = el.dataset.prefix ?? '';
        const decimals = Number(el.dataset.decimals ?? 0);
        const at = statStart + i * statWindow;
        const obj = { val: 0 };
        el.textContent = `${prefix}${decimals > 0 ? (0).toFixed(decimals) : '0'}`;
        tl.to(
          obj,
          {
            val: target,
            duration: statWindow * 0.7,
            ease: 'power2.out',
            onUpdate() {
              el.textContent = `${prefix}${decimals > 0 ? obj.val.toFixed(decimals) : Math.round(obj.val)}`;
            },
          },
          at,
        );
      });

      // Fade elements — staggered reveal across 0.20 → 0.70.
      // Optional `data-out-at` makes an element fade BACK out at that
      // progress (used for cross-fade beats inside a single pinned section,
      // e.g. Research Wing's Workstation → Hacker House swap).
      if (fades.length > 0) {
        const fadeStart = 0.20;
        const fadeSpan = 0.50;
        const fadeStagger = fades.length > 1 ? fadeSpan / fades.length : 0;
        fades.forEach((el, i) => {
          const startVisible = el.dataset.startVisible === 'true';
          const at = Number(el.dataset.at ?? fadeStart + i * fadeStagger);
          const dur = Number(el.dataset.dur ?? 0.12);
          // Skip the fade-IN tween for start-visible elements (they're
          // already composed). They can still fade OUT later via data-out-at.
          if (!startVisible) {
            tl.to(
              el,
              { opacity: 1, y: 0, duration: dur, ease: 'power2.out' },
              at,
            );
          }
          if (el.dataset.outAt !== undefined) {
            const outAt = Number(el.dataset.outAt);
            const outDur = Number(el.dataset.outDur ?? dur);
            tl.to(
              el,
              { opacity: 0, duration: outDur, ease: 'power2.in' },
              outAt,
            );
          }
        });
      }

      return () => {
        // GSAP context cleanup happens via useGSAP.
      };
    },
    { scope: sectionRef, dependencies: [reducedMotion, isDesktop, pin, enablePin, scrub] },
  );
}

/**
 * Force ScrollTrigger to recompute after window resize or content shifts.
 * Useful inside parent components that mount lazy media.
 */
export function refreshFilmScroll() {
  if (typeof window === 'undefined') return;
  ScrollTrigger.refresh();
}
