'use client';
/* Home Hero — autoplay reveal on load (NOT pinned)
 *
 * The hero is the landing surface, so its content must be present and
 * animate *on load* rather than waiting for scroll. Flow:
 *
 *   1. On mount, all content is set hidden.
 *   2. We wait for the Preloader overlay to finish (it sets display:none
 *      at the end of its boot animation), then a small delay, then the
 *      word-by-word entry timeline autoplays.
 *      • If there's no preloader (client-side nav back to /), it just
 *        plays after a short delay.
 *   3. As the user scrolls, the hero scrolls away with a light parallax
 *      drift; the NEXT section (About Preview) is the one that pins.
 *
 * Parallax (scroll-scrubbed, not pinned):
 *   • L0 background grid — slow downward drift
 *   • L2 glow pool       — drifts + scales up
 *   • L3 foreground      — drifts upward + fades (depth illusion)
 */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap/register';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { WordSplit } from '@/features/home/_shared/wordSplit';
import { homeHeroContent } from '@/content/home/hero';

const PRELOADER_SELECTOR = '[aria-label="Loading CyCraft"]';

export default function HomeHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const revealTargets = [
        '.hero-badge',
        '.hero-line-1 [data-word]',
        '.hero-line-2 [data-word]',
        '.hero-divider',
        '.hero-desc [data-word]',
        '.hero-cta',
        '.hero-terminal-line',
      ];

      // ── Reduced motion: instant composed state ──────────────────────────
      if (reducedMotion) {
        gsap.set(revealTargets, { opacity: 1, y: 0, x: 0, scaleX: 1, filter: 'none' });
        return;
      }

      // ── Initial hidden state (applied immediately so nothing flashes) ───
      gsap.set(['.hero-badge', '.hero-cta', '.hero-terminal-line'], { opacity: 0, y: 18 });
      gsap.set('.hero-line-1 [data-word], .hero-line-2 [data-word]', {
        opacity: 0,
        yPercent: 60,
        filter: 'blur(10px)',
      });
      gsap.set('.hero-divider', { scaleX: 0, transformOrigin: 'left center' });
      gsap.set('.hero-desc [data-word]', { opacity: 0, y: 8, filter: 'blur(4px)' });

      // ── Entry timeline (autoplays, word-by-word) ────────────────────────
      const playEntry = () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.to('.hero-badge', { opacity: 1, y: 0, duration: 0.6 })
          .to(
            '.hero-line-1 [data-word]',
            { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.05 },
            '-=0.3',
          )
          .to(
            '.hero-line-2 [data-word]',
            { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.05 },
            '-=0.5',
          )
          .to('.hero-divider', { scaleX: 1, duration: 0.5 }, '-=0.25')
          .to(
            '.hero-desc [data-word]',
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, stagger: 0.022 },
            '-=0.2',
          )
          .to('.hero-cta', { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, '-=0.15')
          .to('.hero-terminal-line', { opacity: 1, x: 0, duration: 0.35, stagger: 0.12 }, '-=0.2');
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
        // Safety: if we never observe the change, play anyway after preloader's max runtime
        fallback = gsap.delayedCall(5, () => {
          observer?.disconnect();
          playEntry();
        });
      } else {
        // No preloader (client-side nav) — short delay then play
        gsap.delayedCall(0.35, playEntry);
      }

      // ── Light scroll parallax (scrubbed, not pinned) ───────────────────
      const parallax = {
        trigger: root,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
      };
      gsap.to('.hero-bg-layer', { yPercent: 12, ease: 'none', scrollTrigger: parallax });
      gsap.to('.hero-glow-layer', {
        yPercent: 25,
        scale: 1.15,
        opacity: 0.45,
        ease: 'none',
        scrollTrigger: parallax,
      });
      gsap.to('.hero-fg-layer', { yPercent: -10, opacity: 0.65, ease: 'none', scrollTrigger: parallax });

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
      id="home"
      aria-label="Hero — Join Advanced B.Tech in CyberSecurity, IoT and Blockchain"
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
      {/* L-1 — background video (sits behind everything; dark overlay keeps text legible) */}
      <div
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        >
          <source src="/videos/cyber-hero.mp4" type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,6,8,0.72)' }} />
      </div>

      {/* L0 — background grid */}
      <div
        aria-hidden="true"
        className="hero-bg-layer grid-atmosphere"
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
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.015) 3px, rgba(255,255,255,0.015) 4px)',
          pointerEvents: 'none',
        }}
      />

      {/* L2 — central glow pool */}
      <div
        aria-hidden="true"
        className="hero-glow-layer"
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
          opacity: 0.5,
          pointerEvents: 'none',
        }}
      />

      {/* L3 — foreground content */}
      <div
        className="hero-fg-layer section-container"
        style={{
          position: 'relative',
          zIndex: 6,
          width: '100%',
          textAlign: 'center',
          willChange: 'transform, opacity',
        }}
      >
        <div style={{ maxWidth: '960px', marginInline: 'auto' }}>
          <div className="hero-badge" style={{ display: 'inline-block', marginBottom: '2rem' }}>
            <Badge label={homeHeroContent.badge} />
          </div>

          <h1
            className="hero-headline-main"
            style={{
              width: '100%',
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4.5vw, 4rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: 'var(--color-text-primary)',
              lineHeight: 1.08,
              margin: 0,
              overflowWrap: 'break-word',
              willChange: 'transform, opacity, filter',
            }}
          >
            <WordSplit
              className="hero-line-1"
              text={homeHeroContent.headlinePrefix}
              style={{ display: 'block' }}
            />
            <WordSplit
              className="hero-line-2"
              text={homeHeroContent.headlineAccent}
              style={{
                display: 'block',
                color: 'var(--color-beam)',
                textShadow: '0 0 24px var(--color-beam-glow)',
              }}
            />
          </h1>

          <div
            className="hero-divider"
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
            className="hero-desc"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '680px',
              margin: '0 auto 2rem',
              lineHeight: 1.65,
            }}
          >
            <WordSplit text={homeHeroContent.description} />
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.85rem',
              justifyContent: 'center',
              marginBottom: '3rem',
            }}
          >
            <span className="hero-cta">
              <Button as="a" href={homeHeroContent.ctas.primary.href} variant="primary">
                {homeHeroContent.ctas.primary.label}
              </Button>
            </span>
            <span className="hero-cta">
              <Button as="a" href={homeHeroContent.ctas.secondary.href} variant="outline">
                {homeHeroContent.ctas.secondary.label}
              </Button>
            </span>
            <span className="hero-cta">
              <Button as="a" href={homeHeroContent.ctas.tertiary.href} variant="ghost">
                {homeHeroContent.ctas.tertiary.label}
              </Button>
            </span>
          </div>

          <div
            className="hero-terminal-box"
            aria-hidden="true"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
              width: 'fit-content',
              maxWidth: '100%',
              marginInline: 'auto',
              border: '1px solid rgba(168,240,255,0.12)',
              background: 'rgba(13,16,20,0.6)',
              backdropFilter: 'blur(6px)',
              padding: '1rem 1.25rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              lineHeight: 1.55,
              color: 'var(--color-terminal)',
              letterSpacing: '0.04em',
              textAlign: 'left',
            }}
          >
            {homeHeroContent.terminalLines.map((line) => (
              <span key={line} className="hero-terminal-line">
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
