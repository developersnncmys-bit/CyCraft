'use client';
/* Download Hero — autoplay reveal on load (NOT pinned).
 *
 * Same architecture as Assessment / Verify / Research heroes. Centered,
 * autoplay word-by-word entry after the preloader finishes. Primary CTA
 * scrolls to the categories grid; secondary scrolls to featured files.
 */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap/register';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { Badge } from '@/components/ui/Badge';
import { WordSplit } from '@/features/home/_shared/wordSplit';
import { downloadHeroContent } from '@/content/download/hero';

const PRELOADER_SELECTOR = '[aria-label="Loading CyCraft"]';

function PillIcon({ kind }: { kind: 'doc' | 'paper' | 'terminal' }) {
  const common = {
    width: 14,
    height: 14,
    viewBox: '0 0 24 24',
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
  if (kind === 'doc') {
    return (
      <svg {...common}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    );
  }
  if (kind === 'paper') {
    return (
      <svg {...common}>
        <path d="M4 4h12l4 4v12a2 2 0 0 1-2 2H4Z" />
        <path d="M8 10h8M8 14h8M8 18h5" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}

export default function DownloadHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const revealTargets = [
        '.download-hero-badge',
        '.download-hero-line-1 [data-word]',
        '.download-hero-line-2 [data-word]',
        '.download-hero-divider',
        '.download-hero-tagline [data-word]',
        '.download-hero-pill',
        '.download-hero-terminal-line',
        '.download-hero-cta',
      ];

      if (reducedMotion) {
        gsap.set(revealTargets, { opacity: 1, y: 0, x: 0, scaleX: 1, filter: 'none' });
        return;
      }

      gsap.set(['.download-hero-badge', '.download-hero-terminal-line'], { opacity: 0, y: 18 });
      gsap.set('.download-hero-line-1 [data-word], .download-hero-line-2 [data-word]', {
        opacity: 0,
        yPercent: 60,
        filter: 'blur(10px)',
      });
      gsap.set('.download-hero-divider', { scaleX: 0, transformOrigin: 'left center' });
      gsap.set('.download-hero-tagline [data-word]', { opacity: 0, y: 8, filter: 'blur(4px)' });
      gsap.set('.download-hero-pill', { opacity: 0, y: 10 });
      gsap.set('.download-hero-cta', { opacity: 0, y: 16, scale: 0.94 });

      const playEntry = () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.to('.download-hero-badge', { opacity: 1, y: 0, duration: 0.6 })
          .to(
            '.download-hero-line-1 [data-word]',
            { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.05 },
            '-=0.3',
          )
          .to(
            '.download-hero-line-2 [data-word]',
            { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.05 },
            '-=0.5',
          )
          .to('.download-hero-divider', { scaleX: 1, duration: 0.5 }, '-=0.25')
          .to(
            '.download-hero-tagline [data-word]',
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, stagger: 0.022 },
            '-=0.2',
          )
          .to('.download-hero-pill', { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 }, '-=0.3')
          .to(
            '.download-hero-cta',
            { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: 'back.out(1.4)' },
            '-=0.2',
          )
          .to(
            '.download-hero-terminal-line',
            { opacity: 1, y: 0, duration: 0.35, stagger: 0.12 },
            '-=0.2',
          );
      };

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

      const parallax = {
        trigger: root,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
      };
      gsap.to('.download-hero-bg-layer', { yPercent: 12, ease: 'none', scrollTrigger: parallax });
      gsap.to('.download-hero-mid-near', {
        yPercent: 25,
        scale: 1.15,
        opacity: 0.45,
        ease: 'none',
        scrollTrigger: parallax,
      });
      gsap.to('.download-hero-fg', {
        yPercent: -10,
        opacity: 0.65,
        ease: 'none',
        scrollTrigger: parallax,
      });

      gsap.fromTo(
        '.download-hero-aurora',
        { xPercent: -14, yPercent: 8, scale: 1.05, rotation: -6, opacity: 0.55 },
        {
          xPercent: 14,
          yPercent: -10,
          scale: 1.3,
          rotation: 6,
          opacity: 0.9,
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
      id="download-hero"
      aria-label="Resource Library"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        paddingTop: 'clamp(5rem, 10vh, 7rem)',
        paddingBottom: 'clamp(3rem, 6vh, 5rem)',
      }}
    >
      <div
        aria-hidden="true"
        className="download-hero-bg-layer"
        style={{
          position: 'absolute',
          inset: '-10%',
          zIndex: 1,
          willChange: 'transform',
          pointerEvents: 'none',
        }}
      />

      <div
        aria-hidden="true"
        className="download-hero-aurora"
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

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.018) 3px, rgba(255,255,255,0.018) 4px)',
          pointerEvents: 'none',
        }}
      />

      <div
        aria-hidden="true"
        className="download-hero-mid-near"
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

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 4,
          background:
            'radial-gradient(ellipse at center, transparent 40%, var(--color-void) 100%)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="download-hero-fg section-container"
        style={{
          position: 'relative',
          zIndex: 6,
          width: '100%',
          textAlign: 'center',
          willChange: 'transform, opacity',
        }}
      >
        <div style={{ maxWidth: '960px', marginInline: 'auto' }}>
          <div
            className="download-hero-badge"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              marginBottom: '1.25rem',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                color: 'var(--color-red-team)',
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
                letterSpacing: '0.05em',
                textShadow: '0 0 12px rgba(255,61,90,0.5)',
              }}
            >
              {'⤓'}
            </span>
            <Badge label={downloadHeroContent.badge} />
          </div>

          <h1
            style={{
              width: '100%',
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4.5vw, 4rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              lineHeight: 1.08,
              margin: 0,
              overflowWrap: 'break-word',
              willChange: 'transform, opacity, filter',
            }}
          >
            <WordSplit
              className="download-hero-line-1"
              text={downloadHeroContent.headlinePrefix}
              style={{
                display: 'inline',
                color: 'var(--color-text-primary)',
              }}
            />{' '}
            <WordSplit
              className="download-hero-line-2"
              text={downloadHeroContent.headlineAccent}
              style={{
                display: 'inline',
                color: 'var(--color-beam)',
                textShadow: '0 0 24px var(--color-beam-glow)',
              }}
            />
          </h1>

          <div
            className="download-hero-divider"
            aria-hidden="true"
            style={{
              width: '60px',
              height: '2px',
              background: 'var(--color-beam)',
              boxShadow: '0 0 12px var(--color-beam-glow)',
              margin: '1.5rem auto',
              transformOrigin: 'left center',
            }}
          />

          <p
            className="download-hero-tagline"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '640px',
              margin: '0 auto 1.5rem',
              lineHeight: 1.5,
            }}
          >
            <WordSplit text={downloadHeroContent.tagline} />
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0.6rem',
              marginBottom: '1.25rem',
            }}
          >
            {downloadHeroContent.pills.map((pill) => (
              <span
                key={pill.label}
                className="download-hero-pill"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.55rem 1rem',
                  border: '1px solid rgba(168,240,255,0.25)',
                  background: 'rgba(168,240,255,0.04)',
                  color: 'var(--color-beam)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  willChange: 'transform, opacity',
                }}
              >
                <PillIcon kind={pill.icon as 'doc' | 'paper' | 'terminal'} />
                {pill.label}
              </span>
            ))}
          </div>

          <div
            style={{
              display: 'inline-flex',
              flexWrap: 'wrap',
              gap: '0.85rem',
              justifyContent: 'center',
              marginBottom: '1.5rem',
            }}
          >
            <a
              href={downloadHeroContent.primaryCta.href}
              className="download-hero-cta"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                padding: '1.05rem 2.5rem',
                background: 'var(--color-beam)',
                color: 'var(--color-void)',
                border: '1px solid var(--color-beam)',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                boxShadow: '0 0 28px rgba(77,217,255,0.4)',
                transition: 'transform 0.25s, box-shadow 0.25s',
                willChange: 'transform, opacity',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.transform = 'translateY(-2px)';
                el.style.boxShadow = '0 0 40px rgba(77,217,255,0.6)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = '0 0 28px rgba(77,217,255,0.4)';
              }}
            >
              {downloadHeroContent.primaryCta.label}
              <span aria-hidden="true">›</span>
            </a>

            <a
              href={downloadHeroContent.secondaryCta.href}
              className="download-hero-cta"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                padding: '1.05rem 2.25rem',
                background: 'transparent',
                color: 'var(--color-beam)',
                border: '1px solid rgba(168,240,255,0.4)',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'background 0.25s, border-color 0.25s',
                willChange: 'transform, opacity',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = 'rgba(168,240,255,0.08)';
                el.style.borderColor = 'var(--color-beam)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = 'transparent';
                el.style.borderColor = 'rgba(168,240,255,0.4)';
              }}
            >
              {downloadHeroContent.secondaryCta.label}
            </a>
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
            {downloadHeroContent.terminalLines.map((line) => (
              <span key={line} className="download-hero-terminal-line">
                {line}
              </span>
            ))}
          </div>
        </div>
      </div>

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
