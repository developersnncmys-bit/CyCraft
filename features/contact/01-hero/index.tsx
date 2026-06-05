'use client';
/* Contact Hero — autoplay reveal on load (NOT pinned)
 *
 * Mirrors the home/about hero behaviour:
 *   1. On mount, content is set hidden.
 *   2. Waits for the Preloader overlay to finish (display:none), then a
 *      0.35s beat, then autoplays the word-by-word entry timeline.
 *      • No preloader (client-side nav) → plays after the short delay.
 *   3. As the user scrolls, the hero drifts away with a light parallax;
 *      the NEXT section (Contact Form) is the one that pins.
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
import { contactHeroContent } from '@/content/contact/hero';

const PRELOADER_SELECTOR = '[aria-label="Loading CyCraft"]';

export default function ContactHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const revealTargets = [
        '.contact-hero-badge',
        '.contact-hero-line-1 [data-word]',
        '.contact-hero-line-2 [data-word]',
        '.contact-hero-divider',
        '.contact-hero-tagline [data-word]',
        '.contact-hero-cert [data-word]',
        '.contact-hero-terminal-line',
      ];

      // ── Reduced motion: instant composed state ──────────────────────────
      if (reducedMotion) {
        gsap.set(revealTargets, { opacity: 1, y: 0, x: 0, scaleX: 1, filter: 'none' });
        return;
      }

      // ── Initial hidden state (applied immediately so nothing flashes) ───
      gsap.set(['.contact-hero-badge', '.contact-hero-terminal-line'], { opacity: 0, y: 18 });
      gsap.set('.contact-hero-line-1 [data-word], .contact-hero-line-2 [data-word]', {
        opacity: 0,
        yPercent: 60,
        filter: 'blur(10px)',
      });
      gsap.set('.contact-hero-divider', { scaleX: 0, transformOrigin: 'left center' });
      gsap.set('.contact-hero-tagline [data-word]', { opacity: 0, y: 8, filter: 'blur(4px)' });
      gsap.set('.contact-hero-cert [data-word]', { opacity: 0, y: 6 });

      // ── Entry timeline (autoplays, word-by-word) ────────────────────────
      const playEntry = () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.to('.contact-hero-badge', { opacity: 1, y: 0, duration: 0.6 })
          .to(
            '.contact-hero-line-1 [data-word]',
            { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.05 },
            '-=0.3',
          )
          .to(
            '.contact-hero-line-2 [data-word]',
            { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.05 },
            '-=0.5',
          )
          .to('.contact-hero-divider', { scaleX: 1, duration: 0.5 }, '-=0.25')
          .to(
            '.contact-hero-tagline [data-word]',
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, stagger: 0.022 },
            '-=0.2',
          )
          .to(
            '.contact-hero-cert [data-word]',
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.028 },
            '-=0.3',
          )
          .to(
            '.contact-hero-terminal-line',
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
      gsap.to('.contact-hero-bg-layer', { yPercent: 12, ease: 'none', scrollTrigger: parallax });
      gsap.to('.contact-hero-mid-near', {
        yPercent: 25,
        scale: 1.15,
        opacity: 0.45,
        ease: 'none',
        scrollTrigger: parallax,
      });
      gsap.to('.contact-hero-fg', { yPercent: -10, opacity: 0.65, ease: 'none', scrollTrigger: parallax });

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
      id="contact-hero"
      aria-label="Contact CyCraft"
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
      {/* L0 grid */}
      <div
        aria-hidden="true"
        className="contact-hero-bg-layer"
        style={{
          position: 'absolute',
          inset: '-10%',
          zIndex: 1,
          willChange: 'transform',
          pointerEvents: 'none',
        }}
      />

      {/* L0.5 — subtle "security scan" beam sweeping down (reuses scan-line keyframe) */}
      {!reducedMotion && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: '180px',
            zIndex: 1,
            pointerEvents: 'none',
            background:
              'linear-gradient(to bottom, transparent 0%, rgba(168,240,255,0.10) 38%, rgba(168,240,255,0.28) 50%, rgba(168,240,255,0.10) 62%, transparent 100%)',
            animation: 'scan-line 6s linear infinite',
            willChange: 'transform',
          }}
        />
      )}

      {/* L1 scan lines */}
      <div
        aria-hidden="true"
        className="contact-hero-mid-far"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.018) 3px, rgba(255,255,255,0.018) 4px)',
          pointerEvents: 'none',
        }}
      />

      {/* L2 glow pool */}
      <div
        aria-hidden="true"
        className="contact-hero-mid-near"
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

      {/* L3 foreground */}
      <div
        className="contact-hero-fg section-container"
        style={{
          position: 'relative',
          zIndex: 6,
          width: '100%',
          textAlign: 'center',
          willChange: 'transform, opacity',
        }}
      >
        <div style={{ maxWidth: '960px', marginInline: 'auto' }}>
          <div className="contact-hero-badge" style={{ display: 'inline-block', marginBottom: '2rem' }}>
            <Badge label={contactHeroContent.badge} />
          </div>

          <h1
            className="contact-hero-headline"
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
              className="contact-hero-line-1"
              text={contactHeroContent.headlinePrefix}
              style={{ display: 'inline' }}
            />{' '}
            <WordSplit
              className="contact-hero-line-2"
              text={contactHeroContent.headlineAccent}
              style={{
                display: 'inline',
                color: 'var(--color-beam)',
                textShadow: '0 0 24px var(--color-beam-glow)',
              }}
            />
          </h1>

          <div
            className="contact-hero-divider"
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
            className="contact-hero-tagline"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '680px',
              margin: '0 auto 2rem',
              lineHeight: 1.65,
            }}
          >
            <WordSplit text={contactHeroContent.tagline} />
          </p>

          <div
            className="contact-hero-cert"
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
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            <WordSplit text={contactHeroContent.certification} />
          </div>

          <div
            aria-hidden="true"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              width: 'fit-content',
              maxWidth: '100%',
              marginInline: 'auto',
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
            {contactHeroContent.terminalLines.map((line) => (
              <span key={line} className="contact-hero-terminal-line">
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
