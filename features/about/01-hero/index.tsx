'use client';
/* About Hero — autoplay reveal on load (NOT pinned)
 *
 * Mirrors the home hero behaviour:
 *   1. On mount, content is set hidden.
 *   2. Waits for the Preloader overlay to finish (display:none), then a
 *      0.35s beat, then autoplays the word-by-word entry timeline.
 *      • No preloader (client-side nav) → plays after the short delay.
 *   3. As the user scrolls, the hero drifts away with a light parallax;
 *      the NEXT section (About Stats) is the one that pins.
 *
 * Parallax (scroll-scrubbed, not pinned):
 *   • L0 background grid — slow downward drift
 *   • L2 glow pool       — drifts + scales up
 *   • L3 foreground      — drifts upward + fades
 */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap/register';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { Button } from '@/components/ui/Button';
import { WordSplit } from '@/features/home/_shared/wordSplit';
import { aboutHeroContent } from '@/content/about/hero';

const PRELOADER_SELECTOR = '[aria-label="Loading CyCraft"]';

export default function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const revealTargets = [
        '.about-hero-line-1 [data-word]',
        '.about-hero-line-2 [data-word]',
        '.about-hero-divider',
        '.about-hero-tagline [data-word]',
        '.about-hero-cert [data-word]',
        '.about-hero-cta',
      ];

      // ── Reduced motion: instant composed state ──────────────────────────
      if (reducedMotion) {
        gsap.set(revealTargets, { opacity: 1, y: 0, x: 0, scaleX: 1, filter: 'none' });
        return;
      }

      // ── Initial hidden state (applied immediately so nothing flashes) ───
      gsap.set('.about-hero-cta', { opacity: 0, y: 18 });
      gsap.set('.about-hero-line-1 [data-word], .about-hero-line-2 [data-word]', {
        opacity: 0,
        yPercent: 60,
        filter: 'blur(10px)',
      });
      gsap.set('.about-hero-divider', { scaleX: 0, transformOrigin: 'left center' });
      gsap.set('.about-hero-tagline [data-word]', { opacity: 0, y: 8, filter: 'blur(4px)' });
      gsap.set('.about-hero-cert [data-word]', { opacity: 0, y: 6 });

      // ── Entry timeline (autoplays, word-by-word) ────────────────────────
      const playEntry = () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.to(
          '.about-hero-line-1 [data-word]',
          { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.05 },
          0,
        )
          .to(
            '.about-hero-line-2 [data-word]',
            { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.05 },
            '-=0.5',
          )
          .to('.about-hero-divider', { scaleX: 1, duration: 0.5 }, '-=0.25')
          .to(
            '.about-hero-tagline [data-word]',
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, stagger: 0.022 },
            '-=0.2',
          )
          .to(
            '.about-hero-cert [data-word]',
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.028 },
            '-=0.3',
          )
          .to(
            '.about-hero-cta',
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: 'back.out(1.4)' },
            '-=0.2',
          );
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

      // ── Light scroll parallax (scrubbed, not pinned) ───────────────────
      const parallax = {
        trigger: root,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
      };
      gsap.to('.about-hero-bg-layer', { yPercent: 12, ease: 'none', scrollTrigger: parallax });
      gsap.to('.about-hero-mid-near', {
        yPercent: 25,
        scale: 1.15,
        opacity: 0.45,
        ease: 'none',
        scrollTrigger: parallax,
      });
      gsap.to('.about-hero-fg', { yPercent: -10, opacity: 0.65, ease: 'none', scrollTrigger: parallax });

      // ── Ambient background — drifting + breathing aurora (infinite loop) ─
      gsap.fromTo(
        '.about-hero-aurora',
        { xPercent: -16, yPercent: 10, scale: 1.05, rotation: -8, opacity: 0.6 },
        {
          xPercent: 16,
          yPercent: -12,
          scale: 1.35,
          rotation: 8,
          opacity: 1,
          duration: 9,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        },
      );

      return () => {
        observer?.disconnect();
        fallback?.kill();
      };
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="about-hero"
      aria-label="About CyCraft"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 'clamp(5rem, 10vh, 7rem)',
        paddingBottom: 'clamp(3rem, 6vh, 5rem)',
      }}
    >
      {/* L0 — deep background layer (grid removed) */}
      <div
        aria-hidden="true"
        className="about-hero-bg-layer"
        style={{
          position: 'absolute',
          inset: '-10%',
          zIndex: 1,
          willChange: 'transform',
          pointerEvents: 'none',
        }}
      />

      {/* L0.5 — subtle drifting aurora (slow ambient motion) */}
      <div
        aria-hidden="true"
        className="about-hero-aurora"
        style={{
          position: 'absolute',
          inset: '-40%',
          zIndex: 1,
          background:
            'radial-gradient(45% 45% at 28% 38%, rgba(168,240,255,0.30), transparent 68%), radial-gradient(42% 42% at 74% 64%, rgba(77,217,255,0.26), transparent 68%), radial-gradient(40% 40% at 55% 80%, rgba(120,90,255,0.18), transparent 70%)',
          willChange: 'transform, opacity',
          pointerEvents: 'none',
        }}
      />

      {/* L1 — scan lines */}
      <div
        aria-hidden="true"
        className="about-hero-mid-far"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.018) 3px, rgba(255,255,255,0.018) 4px)',
          pointerEvents: 'none',
        }}
      />

      {/* L2 — central glow pool */}
      <div
        aria-hidden="true"
        className="about-hero-mid-near"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '1100px',
          height: '720px',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse, rgba(168,240,255,0.08) 0%, rgba(168,240,255,0.025) 40%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          animation: 'hero-glow-breathe 5s ease-in-out infinite',
          zIndex: 3,
          willChange: 'transform, opacity',
          pointerEvents: 'none',
        }}
      />

      {/* Vignette */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 4,
          background: 'radial-gradient(ellipse at center, transparent 40%, var(--color-void) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* L3 — foreground content */}
      <div
        className="about-hero-fg section-container"
        style={{
          position: 'relative',
          zIndex: 6,
          width: '100%',
          textAlign: 'center',
          willChange: 'transform, opacity',
        }}
      >
        <div style={{ maxWidth: '960px', marginInline: 'auto' }}>
          <h1
            className="about-hero-headline"
            style={{
              width: '100%',
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4.5vw, 4rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              color: 'var(--color-text-primary)',
              lineHeight: 1.08,
              margin: 0,
              overflowWrap: 'break-word',
              willChange: 'transform, opacity, filter',
            }}
          >
            <WordSplit
              className="about-hero-line-1"
              text={aboutHeroContent.headlinePrefix}
              style={{ display: 'inline' }}
            />{' '}
            <WordSplit
              className="about-hero-line-2"
              text={aboutHeroContent.headlineAccent}
              style={{
                display: 'inline',
                color: 'var(--color-beam)',
                textShadow: '0 0 24px var(--color-beam-glow)',
              }}
            />
          </h1>

          <div
            className="about-hero-divider"
            aria-hidden="true"
            style={{
              width: '60px',
              height: '2px',
              background: 'var(--color-beam)',
              boxShadow: '0 0 12px var(--color-beam-glow)',
              margin: '2.5rem auto',
              transformOrigin: 'left center',
            }}
          />

          <p
            className="about-hero-tagline"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '760px',
              margin: '0 auto 2rem',
              lineHeight: 1.65,
            }}
          >
            <WordSplit text={aboutHeroContent.subheadline} />
          </p>

          <div
            className="about-hero-cert"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.55rem 1.1rem',
              border: '1px solid rgba(168,240,255,0.25)',
              background: 'rgba(168,240,255,0.04)',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.18em',
              color: 'var(--color-beam)',
              textTransform: 'uppercase',
              marginBottom: '2.5rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
              maxWidth: '100%',
            }}
          >
            <WordSplit text={aboutHeroContent.tagLine} />
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '0.5rem',
            }}
          >
            <span className="about-hero-cta">
              <Button as="a" href={aboutHeroContent.ctas.primary.href} variant="primary">
                {aboutHeroContent.ctas.primary.label}
              </Button>
            </span>
            <span className="about-hero-cta">
              <Button as="a" href={aboutHeroContent.ctas.secondary.href} variant="outline">
                {aboutHeroContent.ctas.secondary.label}
              </Button>
            </span>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '24%',
          background: 'linear-gradient(to bottom, transparent, var(--color-void))',
          zIndex: 5,
          pointerEvents: 'none',
        }}
      />
    </section>
  );
}
