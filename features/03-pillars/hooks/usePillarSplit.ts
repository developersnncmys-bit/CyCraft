'use client';
import { type RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import { gsap } from '@/lib/gsap/register';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';

/**
 * Pillars motion. CINEMA_SPEC §7.3.
 *  - reducedMotion → static composed
 *  - mobile → entry-on-view simple reveal
 *  - desktop → pin + scrub, 350vh — the showpiece
 *
 * Cinema beat windows:
 *   0.00–0.10  Heading character-staggered reveal + badge + description
 *   0.10–0.20  Descend beam scrubs scaleY 0→1; prism gem appears with a flash
 *   0.20–0.40  Three rails draw themselves via strokeDashoffset 1→0
 *   0.40–0.60  Pillar cards materialise from glow (scale 0.8→1) — center first
 *   0.60–0.80  Hold; subtle rail pulse loop (CSS keyframe via class toggle)
 *   0.80–1.00  Reform: side rails dim, continuation beam emerges below prism
 */
export function usePillarSplit(containerRef: RefObject<HTMLElement | null>) {
  const reducedMotion = useReducedMotion();
  const isDesktop = useIsDesktop();

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      // Centre card translateY(-16px) — was inline, now applied via GSAP so the
      // initial-state set doesn't clobber it.
      const allCards = container.querySelectorAll<HTMLElement>('.pillar-card-el');
      const centerCard = container.querySelector<HTMLElement>('.pillar-card-center');
      const sideCards = Array.from(allCards).filter((c) => !c.classList.contains('pillar-card-center'));

      const rails = ['.prism-rail-0', '.prism-rail-1', '.prism-rail-2'];
      const railGlows = ['.prism-rail-glow-0', '.prism-rail-glow-1', '.prism-rail-glow-2'];
      const sideRailSelectors = ['.prism-rail-0', '.prism-rail-2', '.prism-rail-glow-0', '.prism-rail-glow-2'];

      // ── Reduced motion: instant composed state ─────────────────────────
      if (reducedMotion) {
        gsap.set([...rails, ...railGlows], { strokeDashoffset: 0 });
        gsap.set('.beam-prism-gem', { opacity: 1, scale: 1 });
        gsap.set('.pillars-descend-beam', { opacity: 1, scaleY: 1 });
        gsap.set('.pillars-continuation-beam', { opacity: 1, scaleY: 1 });
        gsap.set(allCards, { opacity: 1, scale: 1 });
        if (centerCard) gsap.set(centerCard, { y: -16 });
        gsap.set(['.pillars-badge-el', '.pillars-heading-el', '.pillars-desc-el'], { opacity: 1 });
        return;
      }

      // Headline split (shared between desktop + mobile)
      const headingEl = container.querySelector<HTMLElement>('.pillars-heading-el');
      const split = headingEl
        ? new SplitType(headingEl, { types: 'words,chars' })
        : null;
      split?.words?.forEach((w) => ((w as HTMLElement).style.whiteSpace = 'nowrap'));
      if (headingEl) gsap.set(headingEl, { opacity: 1 });

      // ──────────────────────────────────────────────────────────────────
      //  MOBILE PATH — simple entry-on-view
      // ──────────────────────────────────────────────────────────────────
      if (!isDesktop) {
        gsap.set([...rails, ...railGlows], { strokeDashoffset: 0 });
        gsap.set('.beam-prism-gem', { opacity: 1, scale: 1 });
        gsap.set('.pillars-descend-beam', { opacity: 1, scaleY: 1 });
        gsap.set('.pillars-continuation-beam', { opacity: 0 });
        gsap.set(['.pillars-badge-el', '.pillars-desc-el'], { opacity: 0 });
        if (split) gsap.set(split.chars, { opacity: 0, y: 30 });
        gsap.set(allCards, { opacity: 0, y: 30, scale: 1 });
        if (centerCard) gsap.set(centerCard, { y: -16 });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: container, start: 'top 70%', toggleActions: 'play none none reverse' },
        });
        tl.to('.pillars-badge-el', { opacity: 1, duration: 0.4 })
          .to(split?.chars ?? [], { opacity: 1, y: 0, stagger: 0.02, duration: 0.6 }, '<0.1')
          .to('.pillars-desc-el', { opacity: 1, duration: 0.4 }, '<0.2')
          .to(centerCard ?? '', { opacity: 1, y: -16, duration: 0.5 }, '<0.1')
          .to(sideCards, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, '<0.1');

        return () => { split?.revert(); };
      }

      // ──────────────────────────────────────────────────────────────────
      //  DESKTOP CINEMA PATH — pin + scrub
      // ──────────────────────────────────────────────────────────────────

      // Initial states. Badge + desc stay at default opacity:1 (Approach B
       // — no fade-in on pin engage). Heading chars retain the SplitType
       // yPercent reveal because that character rise IS the prelude cinema
       // beat for the prism-split showpiece.
      if (split) gsap.set(split.chars, { opacity: 0, yPercent: 100 });
      gsap.set('.pillars-descend-beam', { opacity: 0, scaleY: 0 });
      gsap.set('.beam-prism-gem', { opacity: 0, scale: 0, rotation: 45 });
      gsap.set([...rails, ...railGlows], { strokeDashoffset: 1 });
      gsap.set(allCards, { opacity: 0, scale: 0.8, y: 30 });
      if (centerCard) gsap.set(centerCard, { y: -16 + 30, opacity: 0, scale: 0.8 });
      gsap.set('.pillars-continuation-beam', { opacity: 0, scaleY: 0 });

      const tl = makePinnedTimeline({
        trigger: container,
        end: PIN_DURATIONS.pillars,
        scrub: 1,
        enabled: true,
        unpinned: true,
      });

      // 0.00 – 0.10 Heading + badge + description reveal
      if (split) {
        tl.to(split.chars,
              { opacity: 1, yPercent: 0, stagger: 0.004, duration: 0.10, ease: 'power3.out' }, 0);
      }
      // Badge + desc reveals removed (Approach B — they start at opacity:1).

      // 0.10 – 0.20 Descend beam scrubs in; prism gem flashes
      tl.to('.pillars-descend-beam',
            { opacity: 1, scaleY: 1, duration: 0.10, ease: 'none' }, 0.10)
        .to('.beam-prism-gem',
            { opacity: 1, scale: 1, duration: 0.05, ease: 'back.out(2.4)' }, 0.18);

      // 0.20 – 0.40 Rails draw themselves
      // pathLength=1 normalisation means strokeDashoffset 1→0 spans the whole line.
      tl.to([...rails, ...railGlows],
            { strokeDashoffset: 0, duration: 0.20, ease: 'power2.out' }, 0.20);

      // 0.40 – 0.60 Pillar cards materialise — centre first, then sides together
      if (centerCard) {
        tl.to(centerCard,
              { opacity: 1, scale: 1, y: -16, duration: 0.12, ease: 'back.out(1.6)' }, 0.40);
      }
      tl.to(sideCards,
            { opacity: 1, scale: 1, y: 0, stagger: 0.04, duration: 0.12, ease: 'back.out(1.6)' }, 0.46);

      // 0.60 – 0.80 Hold + subtle rail pulse (CSS class toggled via callbacks)
      const railEls = container.querySelectorAll<SVGLineElement>(
        '.prism-rail-0, .prism-rail-1, .prism-rail-2',
      );
      // ScrollTrigger callback ranges are progress-relative on the parent trigger.
      // The makePinnedTimeline trigger is the container itself; this nested
      // ScrollTrigger reuses it and fires on the pulse window.
      gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: PIN_DURATIONS.pillars,
          scrub: false,
          onUpdate(self) {
            const p = self.progress;
            const pulsing = p >= 0.60 && p < 0.80;
            railEls.forEach((el) => el.classList.toggle('prism-rail-pulsing', pulsing));
          },
        },
      });

      // 0.80 – 1.00 Reform: side rails dim, continuation beam emerges
      tl.to(sideRailSelectors,
            { strokeOpacity: 0.15, duration: 0.10, ease: 'power2.out' }, 0.80);
      tl.to('.pillars-continuation-beam',
            { opacity: 1, scaleY: 1, duration: 0.15, ease: 'power2.out' }, 0.85);

      return () => { split?.revert(); };
    },
    { scope: containerRef, dependencies: [reducedMotion, isDesktop] },
  );
}
