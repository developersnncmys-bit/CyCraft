'use client';
import { type RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import { gsap } from '@/lib/gsap/register';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';

/**
 * Philosophy motion. CINEMA_SPEC §2.2 ("Fractured text → reassembles. Tight, punchy.")
 *  - reducedMotion → composed state
 *  - mobile → entry-on-view (original landing-page model)
 *  - desktop → pin + scrub, 200vh
 *
 * Cinema beat windows (200vh pin):
 *   0.00–0.10  Heading "OUR PHILOSOPHY" slides up + fades in
 *   0.10–0.40  Fractured sentence reassembles word-by-word (scrubbed stagger)
 *   0.40–0.50  Cyan accent line draws left → right
 *   0.50–0.65  Description fades in
 *   0.40–0.70  Tilted video un-tilts (rotateY -12 → 0, opacity 0.6 → 1)
 *   0.70–1.00  Composed hold — camera nudges 2% on the way out
 */
export function usePhilosophyReveal(containerRef: RefObject<HTMLElement | null>) {
  const reducedMotion = useReducedMotion();
  const isDesktop = useIsDesktop();

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const headingEl   = container.querySelector<HTMLElement>('.philosophy-heading-el');
      const fracturedEl = container.querySelector<HTMLElement>('.fractured-heading-el');
      const videoEl     = container.querySelector<HTMLElement>('.tilted-video-el');
      const lineEl      = container.querySelector<HTMLElement>('.philosophy-line-el');
      const descEl      = container.querySelector<HTMLElement>('.philosophy-desc-el');
      const cameraEl    = container.querySelector<HTMLElement>('.philosophy-camera-el');

      // ── Reduced motion: composed image, no animation ─────────────────────
      if (reducedMotion) {
        gsap.set([headingEl, fracturedEl, lineEl, descEl, videoEl].filter(Boolean),
                 { opacity: 1, y: 0, x: 0 });
        if (videoEl) gsap.set(videoEl, { rotateY: 0 });
        if (lineEl)  gsap.set(lineEl,  { scaleX: 1 });
        return;
      }

      // Word-split the fractured sentence with overflow-mask wrappers
      // so each word can "push up" into view from below.
      let split: SplitType | null = null;
      let words: HTMLElement[] = [];
      if (fracturedEl) {
        split = new SplitType(fracturedEl, { types: 'words' });
        words = (split.words ?? []) as HTMLElement[];
        words.forEach((word) => {
          const wrapper = document.createElement('span');
          wrapper.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;';
          word.parentNode?.insertBefore(wrapper, word);
          wrapper.appendChild(word);
        });
      }

      // ──────────────────────────────────────────────────────────────────
      //  MOBILE PATH — entry-on-view (preserved landing-page behaviour)
      // ──────────────────────────────────────────────────────────────────
      if (!isDesktop) {
        if (headingEl) {
          gsap.fromTo(headingEl, { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
              scrollTrigger: { trigger: headingEl, start: 'top 80%', toggleActions: 'play none none reset' } });
        }
        if (words.length) {
          gsap.fromTo(words, { y: '110%', opacity: 0 },
            { y: '0%', opacity: 1, stagger: 0.06, duration: 0.65, ease: 'power3.out',
              scrollTrigger: { trigger: fracturedEl, start: 'top 75%', toggleActions: 'play none none reset' } });
        }
        if (lineEl) {
          gsap.fromTo(lineEl, { scaleX: 0 },
            { scaleX: 1, duration: 0.9, ease: 'power2.inOut',
              scrollTrigger: { trigger: lineEl, start: 'top 80%', toggleActions: 'play none none reset' } });
        }
        if (descEl) {
          gsap.fromTo(descEl, { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
              scrollTrigger: { trigger: descEl, start: 'top 80%', toggleActions: 'play none none reset' } });
        }
        return () => { split?.revert(); };
      }

      // ──────────────────────────────────────────────────────────────────
      //  DESKTOP CINEMA PATH — pin + scrub
      // ──────────────────────────────────────────────────────────────────

      // Initial state
      if (headingEl) gsap.set(headingEl, { opacity: 0, y: 30 });
      if (words.length) gsap.set(words, { y: '110%', opacity: 0 });
      if (lineEl)  gsap.set(lineEl,  { scaleX: 0, transformOrigin: 'left' });
      if (descEl)  gsap.set(descEl,  { opacity: 0, y: 20 });
      if (videoEl) gsap.set(videoEl, { rotateY: -12, opacity: 0.6 });
      if (cameraEl) gsap.set(cameraEl, { scale: 1, transformOrigin: 'center center' });

      const tl = makePinnedTimeline({
        trigger: container,
        end: PIN_DURATIONS.philosophy,
        scrub: 1,
        enabled: true,
        unpinned: true,
      });

      // 0.00 – 0.10 Heading
      if (headingEl) {
        tl.to(headingEl, { opacity: 1, y: 0, duration: 0.10, ease: 'power3.out' }, 0);
      }

      // 0.10 – 0.40 Fractured sentence reassembles word-by-word
      if (words.length) {
        tl.to(words,
              { y: '0%', opacity: 1, stagger: 0.30 / Math.max(words.length, 1), duration: 0.06, ease: 'power3.out' },
              0.10);
      }

      // 0.40 – 0.50 Cyan line draws
      if (lineEl) {
        tl.to(lineEl, { scaleX: 1, duration: 0.10, ease: 'power2.inOut' }, 0.40);
      }

      // 0.40 – 0.70 Tilted video un-tilts (overlaps with line + description)
      if (videoEl) {
        tl.to(videoEl, { rotateY: 0, opacity: 1, duration: 0.30, ease: 'power2.out' }, 0.40);
      }

      // 0.50 – 0.65 Description fades
      if (descEl) {
        tl.to(descEl, { opacity: 1, y: 0, duration: 0.15, ease: 'power2.out' }, 0.50);
      }

      // 0.70 – 1.00 Hold + gentle 2% scale-out
      if (cameraEl) {
        tl.to(cameraEl, { scale: 0.98, duration: 0.30, ease: 'power2.inOut' }, 0.70);
      }

      return () => { split?.revert(); };
    },
    { scope: containerRef, dependencies: [reducedMotion, isDesktop] },
  );
}
