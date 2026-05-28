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
import { Badge } from '@/components/ui/Badge';
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
        '.about-hero-badge',
        '.about-hero-line-1 [data-word]',
        '.about-hero-line-2 [data-word]',
        '.about-hero-divider',
        '.about-hero-tagline [data-word]',
        '.about-hero-cert [data-word]',
        '.about-hero-terminal-line',
      ];

      // ── Reduced motion: instant composed state ──────────────────────────
      if (reducedMotion) {
        gsap.set(revealTargets, { opacity: 1, y: 0, x: 0, scaleX: 1, filter: 'none' });
        return;
      }

      // ── Initial hidden state (applied immediately so nothing flashes) ───
      gsap.set(['.about-hero-badge', '.about-hero-terminal-line'], { opacity: 0, y: 18 });
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
        tl.to('.about-hero-badge', { opacity: 1, y: 0, duration: 0.6 })
          .to(
            '.about-hero-line-1 [data-word]',
            { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.05 },
            '-=0.3',
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
            '.about-hero-terminal-line',
            { opacity: 1, y: 0, duration: 0.35, stagger: 0.12 },
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
      {/* L0 — deep background grid */}
      <div
        aria-hidden="true"
        className="about-hero-bg-layer grid-atmosphere"
        style={{
          position: 'absolute',
          inset: '-10%',
          zIndex: 1,
          willChange: 'transform',
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
          <div className="about-hero-badge" style={{ display: 'inline-block', marginBottom: '2rem' }}>
            <Badge label={aboutHeroContent.badge} />
          </div>

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
              maxWidth: '680px',
              margin: '0 auto 2rem',
              lineHeight: 1.65,
            }}
          >
            <WordSplit text={aboutHeroContent.tagline} />
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
            }}
          >
            <svg
              aria-hidden="true"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2 4 5v7c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V5l-8-3Z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <WordSplit text={aboutHeroContent.certification} />
          </div>

          <div
            aria-hidden="true"
            style={{
              display: 'inline-flex',
              flexDirection: 'column',
              gap: '0.25rem',
              border: '1px solid rgba(168,240,255,0.12)',
              background: 'rgba(13,16,20,0.6)',
              backdropFilter: 'blur(6px)',
              padding: '0.75rem 1.25rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--color-terminal)',
              letterSpacing: '0.04em',
              textAlign: 'left',
            }}
          >
            {aboutHeroContent.terminalLines.map((line) => (
              <span key={line} className="about-hero-terminal-line">
                {line}
              </span>
            ))}
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
