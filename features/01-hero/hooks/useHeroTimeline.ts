'use client';
import { type RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

const PRELOADER_SELECTOR = '[aria-label="Loading CyCraft"]';

/**
 * Hero motion — autoplay reveal on load (NOT pinned).
 *
 * Matches the home/about/contact hero behaviour:
 *   1. On mount, content is set hidden.
 *   2. Waits for the Preloader overlay to finish (display:none), then a
 *      0.35s beat, then autoplays the entry timeline (SplitType chars rise,
 *      supporting copy + CTAs stagger in).
 *      • No preloader (client-side nav) → plays after the short delay.
 *   3. As the user scrolls, the hero drifts away with a light parallax;
 *      the NEXT section (Achievements) is the one that pins.
 */
export function useHeroTimeline(containerRef: RefObject<HTMLElement | null>) {
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      // ── Reduced motion: composed image, no animation ─────────────────────
      if (reducedMotion) {
        gsap.set(
          [
            '.hero-badge-el',
            '.hero-divider-el',
            '.hero-headline-el',
            '.hero-desc-el',
            '.hero-tags-el',
            '.hero-cta-el',
            '.hero-scroll-hint-el',
            '.hero-video-el',
            '.hero-vignette-el',
            '.hero-beam-el',
          ],
          { opacity: 1, clearProps: 'transform' },
        );
        gsap.set('.hero-divider-el', { scaleX: 1 });
        gsap.set('.hero-cta-el', { scale: 1 });
        gsap.set('.hero-cursor-el', { opacity: 0 });
        return;
      }

      // ── SplitType the headline + description into words ──────────────────
      const headlineEl = container.querySelector<HTMLElement>('.hero-headline-el');
      if (!headlineEl) return;
      const descEl = container.querySelector<HTMLElement>('.hero-desc-el');

      const splitHeadline = new SplitType(headlineEl, { types: 'words' });
      splitHeadline.words?.forEach((word) => {
        (word as HTMLElement).style.whiteSpace = 'nowrap';
        (word as HTMLElement).style.willChange = 'transform, opacity, filter';
      });
      const splitDesc = descEl ? new SplitType(descEl, { types: 'words' }) : null;
      splitDesc?.words?.forEach((word) => {
        (word as HTMLElement).style.willChange = 'transform, opacity, filter';
      });

      // Containers visible; their inner words carry the reveal.
      gsap.set(headlineEl, { opacity: 1 });
      if (descEl) gsap.set(descEl, { opacity: 1 });

      // ── Initial hidden state (applied immediately so nothing flashes) ────
      gsap.set(splitHeadline.words, { opacity: 0, yPercent: 50, filter: 'blur(8px)' });
      if (splitDesc?.words) gsap.set(splitDesc.words, { opacity: 0, y: 8, filter: 'blur(4px)' });
      gsap.set(
        ['.hero-badge-el', '.hero-divider-el', '.hero-tags-el', '.hero-cta-el', '.hero-scroll-hint-el'],
        { opacity: 0 },
      );
      gsap.set('.hero-divider-el', { scaleX: 0, transformOrigin: 'center' });
      gsap.set('.hero-cta-el', { scale: 0.95 });
      gsap.set('.hero-cursor-el', { opacity: 0 });
      gsap.set('.hero-video-el', { opacity: 0, scale: 1 });
      gsap.set('.hero-vignette-el', { opacity: 0 });
      gsap.set('.hero-grayscale-el', { opacity: 0 });
      gsap.set('.hero-beam-el', { opacity: 0, scale: 1 });

      // ── Scroll-scrubbed word-by-word fade-OUT as the hero exits ──────────
      // Created NOW (at mount) so it always exists regardless of how fast the
      // user scrolls. `immediateRender: false` means the from-state is NOT
      // applied at scroll 0, so it never fights the autoplay entry reveal —
      // it only kicks in once the user actually scrolls the hero out (and
      // reverses, fading words back in, on scroll-up). Tied to the hero
      // scrolling past: top top → bottom top.
      const exitTweens: gsap.core.Tween[] = [];
      const exitST = {
        trigger: container,
        start: 'top top',
        end: 'bottom top',
        scrub: true as const,
      };
      if (splitHeadline.words?.length) {
        exitTweens.push(
          gsap.fromTo(
            splitHeadline.words,
            { opacity: 1, filter: 'blur(0px)', yPercent: 0 },
            { opacity: 0, filter: 'blur(8px)', yPercent: -40, stagger: 0.05, ease: 'none', immediateRender: false, scrollTrigger: exitST },
          ),
        );
      }
      if (splitDesc?.words?.length) {
        exitTweens.push(
          gsap.fromTo(
            splitDesc.words,
            { opacity: 1, filter: 'blur(0px)', y: 0 },
            { opacity: 0, filter: 'blur(6px)', y: -20, stagger: 0.025, ease: 'none', immediateRender: false, scrollTrigger: exitST },
          ),
        );
      }
      // Supporting elements fade together across the same range.
      exitTweens.push(
        gsap.fromTo(
          ['.hero-badge-el', '.hero-divider-el', '.hero-tags-el', '.hero-cta-el', '.hero-scroll-hint-el'],
          { opacity: 1 },
          { opacity: 0, ease: 'none', immediateRender: false, scrollTrigger: exitST },
        ),
      );

      // ── Entry timeline (autoplays, smooth word-by-word) ──────────────────
      const playEntry = () => {
        // After the reveal settles, refresh so the exit scrub's start/end
        // are correct (section 2's pin spacer is established by now).
        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          onComplete: () => ScrollTrigger.refresh(),
        });
        tl.to('.hero-video-el', { opacity: 0.25, duration: 1, ease: 'power2.inOut' }, 0)
          .to('.hero-vignette-el', { opacity: 1, duration: 1 }, 0)
          .to('.hero-beam-el', { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.15)
          // Headline — word by word, gentle rise + de-blur
          .to(
            splitHeadline.words,
            { opacity: 1, yPercent: 0, filter: 'blur(0px)', stagger: 0.08, duration: 0.85 },
            0.3,
          )
          .to('.hero-badge-el', { opacity: 1, duration: 0.45, ease: 'power2.out' }, 0.5)
          .to('.hero-divider-el', { opacity: 1, scaleX: 1, duration: 0.4, ease: 'power2.out' }, '>-0.1');

        // Description — word by word, slightly faster cadence
        if (splitDesc?.words) {
          tl.to(
            splitDesc.words,
            { opacity: 1, y: 0, filter: 'blur(0px)', stagger: 0.03, duration: 0.6, ease: 'power2.out' },
            '>-0.1',
          );
        }

        tl.to('.hero-tags-el', { opacity: 1, duration: 0.4, ease: 'power2.out' }, '>-0.2')
          .to('.hero-cta-el', { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }, '>-0.1')
          .to('.hero-scroll-hint-el', { opacity: 1, duration: 0.4 }, '>-0.2');
      };

      // ── Wait for preloader to finish, then autoplay ─────────────────────
      const preloader = document.querySelector<HTMLElement>(PRELOADER_SELECTOR);
      let observer: MutationObserver | null = null;
      let fallback: gsap.core.Tween | null = null;

      if (preloader && getComputedStyle(preloader).display !== 'none') {
        observer = new MutationObserver(() => {
          if (getComputedStyle(preloader).display === 'none') {
            observer?.disconnect();
            fallback?.kill();
            gsap.delayedCall(0.35, playEntry);
          }
        });
        observer.observe(preloader, { attributes: true, attributeFilter: ['style'] });
        fallback = gsap.delayedCall(5, () => {
          observer?.disconnect();
          playEntry();
        });
      } else {
        gsap.delayedCall(0.35, playEntry);
      }

      // ── Layered scroll parallax — three depth planes ─────────────────
      // bg-deep drifts slowest, bg-mid faster, the foreground content
      // exits via the word-by-word fade-out above. The differing drift
      // magnitudes read as depth — the user feels the camera moving
      // through a layered scene, not over a flat panel.
      const parallax = {
        trigger: container,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
      };
      // Video object-fit:cover, so the scale-up is safe (no edge reveal).
      gsap.to('.hero-video-el', { scale: 1.12, ease: 'none', scrollTrigger: parallax });
      // bg-deep drifts down 4% — the slowest, deepest layer.
      gsap.to('.hero-bg-deep-el', { yPercent: 4, ease: 'none', scrollTrigger: parallax });
      // bg-mid drifts up 14% — opposite direction + larger magnitude reads
      // as the foreground glow lifting past the deep background.
      gsap.to('.hero-bg-mid-el', { yPercent: -14, scale: 1.08, ease: 'none', scrollTrigger: parallax });

      return () => {
        observer?.disconnect();
        fallback?.kill();
        exitTweens.forEach((t) => {
          t.scrollTrigger?.kill();
          t.kill();
        });
        splitHeadline.revert();
        splitDesc?.revert();
      };
    },
    { scope: containerRef, dependencies: [reducedMotion] },
  );
}
