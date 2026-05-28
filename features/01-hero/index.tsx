'use client';
/* Hero section — Act I, Section 1 of 22
 * GSAP sets initial opacity then reveals. Content visible without GSAP as fallback. */
import { useRef } from 'react';
import { HeroVideo } from './components/HeroVideo';
import { HeroCTA } from './components/HeroCTA';
import { HeroBeam } from './components/HeroBeam';
import { TerminalCursor } from './components/TerminalCursor';
import { Badge } from '@/components/ui/Badge';
import { heroContent } from '@/content/hero';
import { useHeroTimeline } from './hooks/useHeroTimeline';

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useHeroTimeline(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-act="1"
      aria-label="Hero — Cyber Intelligence Engineering"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'var(--color-void)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* ── Atmosphere ───────────────────────────────────────────────────── */}

      {/* Grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 grid-atmosphere pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* Scan lines */}
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

      {/* Background video */}
      <HeroVideo
        mp4={heroContent.video.mp4}
        webm={heroContent.video.webm}
        poster={heroContent.video.poster}
      />

      {/* Central glow pool — breathes slowly, no harsh lines */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '42%',
          left: '50%',
          width: '900px',
          height: '600px',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse, rgba(168,240,255,0.07) 0%, rgba(168,240,255,0.025) 40%, transparent 70%)',
          animation: 'hero-glow-breathe 5s ease-in-out infinite',
          pointerEvents: 'none',
          zIndex: 3,
        }}
      />

      {/* Vignette */}
      <div
        className="hero-vignette-el"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 4,
          background:
            'radial-gradient(ellipse at center, transparent 40%, var(--color-void) 100%)',
          opacity: 0,
          pointerEvents: 'none',
          willChange: 'opacity',
        }}
      />

      {/* Bottom fade */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '28%',
          background: 'linear-gradient(to bottom, transparent, var(--color-void))',
          zIndex: 5,
          pointerEvents: 'none',
        }}
      />

      {/* Grayscale overlay (scroll scrub target) */}
      <div
        className="hero-grayscale-el"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 4,
          background: '#808080',
          mixBlendMode: 'color',
          opacity: 0,
          pointerEvents: 'none',
          willChange: 'opacity',
        }}
      />

      {/* Local hero beam — fires forward on dissolve, handoff baton to GlobalBeam */}
      <HeroBeam />

      {/* Terminal cursor — wakes during the first 5% of pinned scroll */}
      <TerminalCursor />


      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          zIndex: 6,
          width: '100%',
          maxWidth: '1440px',
          padding: 'clamp(1.5rem, 5vw, 6rem)',
          paddingTop: 'clamp(5rem, 12vh, 9rem)',
          paddingBottom: 'clamp(5rem, 12vh, 9rem)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 0,
        }}
      >
        {/* Badge — from spec: // CYBER_SECURITY_DEGREE_PROGRAM */}
        <span className="hero-badge-el" style={{ display: 'block', marginBottom: '1.5rem' }}>
          <Badge label={heroContent.badge} />
        </span>

        {/* Main headline — SplitType chars animated by GSAP */}
        <h1
          className="hero-headline-el"
          aria-label={heroContent.headline}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4.5vw, 4rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            wordSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-text-primary)',
            lineHeight: 1,
            margin: 0,
            maxWidth: '1100px',
            willChange: 'transform, opacity',
          }}
        >
          {heroContent.headline}
        </h1>

        {/* Accent divider */}
        <div
          className="hero-divider-el"
          aria-hidden="true"
          style={{
            width: '48px',
            height: '2px',
            background: 'var(--color-beam)',
            boxShadow: '0 0 12px var(--color-beam-glow)',
            margin: '2rem auto',
          }}
        />

        {/* Short tagline — punchy, not the full description */}
        <p
          className="hero-desc-el"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-lg)',
            color: 'var(--color-text-secondary)',
            maxWidth: '540px',
            lineHeight: 1.65,
            margin: '0 0 2.5rem',
          }}
        >
          {heroContent.description}
        </p>

        {/* CTAs */}
        <div
          className="hero-cta-el"
          style={{ marginBottom: '2.5rem', willChange: 'transform, opacity' }}
        >
          <HeroCTA />
        </div>

        {/* Tags — inline dots, not boxes */}
        <div
          className="hero-tags-el"
          role="list"
          aria-label="Program highlights"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {heroContent.tags.map((tag, i) => (
            <span key={tag} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {i > 0 && (
                <span
                  aria-hidden="true"
                  style={{
                    display: 'inline-block',
                    width: '3px',
                    height: '3px',
                    borderRadius: '50%',
                    background: 'var(--color-beam)',
                    opacity: 0.4,
                  }}
                />
              )}
              <span
                role="listitem"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--color-text-disabled)',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                }}
              >
                {tag}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div
        className="hero-scroll-hint-el"
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '2.25rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 7,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.4rem',
          animation: 'drift 2.5s ease-in-out infinite',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            color: 'var(--color-text-disabled)',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
          }}
        >
          Scroll
        </span>
        {/* Small arrow */}
        <svg width="12" height="16" viewBox="0 0 12 16" fill="none" aria-hidden="true">
          <line x1="6" y1="0" x2="6" y2="12" stroke="rgba(168,240,255,0.3)" strokeWidth="1" />
          <polyline points="2,9 6,14 10,9" fill="none" stroke="rgba(168,240,255,0.3)" strokeWidth="1" />
        </svg>
      </div>
    </section>
  );
}
