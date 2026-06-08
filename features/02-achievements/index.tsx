'use client';
/* Achievements — Act I, Section 2 of 22.
 * Film-mode POC: pinned ~250vh, scroll drives camera, parallax layers,
 * headline morph (3 phrases), and the 4-stat counter ignition.
 */
import { useRef } from 'react';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { GlitchText } from '@/components/core/GlitchText/GlitchText';
import { Badge } from '@/components/ui/Badge';
import { achievementsContent } from '@/content/achievements';
import { StatsConstellation } from './components/StatsConstellation';
import { useFilmReveal } from '@/lib/gsap/filmReveal';

export default function AchievementsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useFilmReveal(sectionRef, { pin: '+=250%' });

  return (
    <SectionWrapper ref={sectionRef} id="achievements" act={1}>
      {/* Layered parallax — three depths drift at different speeds. */}
      <div
        className="film-bg-deep"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-10%',
          zIndex: 0,
          background:
            'radial-gradient(ellipse at 30% 30%, rgba(168,240,255,0.10), transparent 65%), radial-gradient(ellipse at 70% 80%, rgba(168,240,255,0.06), transparent 60%)',
          pointerEvents: 'none',
        }}
      />
      <div
        className="film-bg-mid"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-6%',
          zIndex: 0,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(168,240,255,0.02) 4px, rgba(168,240,255,0.02) 5px)',
          pointerEvents: 'none',
        }}
      />

      {/* Pinned camera — scales 1.04 → 1.00 → 0.98 across the pin. */}
      <div
        className="film-camera achv-camera-el"
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        {/* L3 — text content, top-center */}
        <div
          style={{
            position: 'relative',
            zIndex: 3,
            textAlign: 'center',
            paddingTop: 'clamp(7rem, 13vh, 9rem)',
            paddingInline: 'var(--section-padding)',
          }}
        >
          <div className="section-container">
            <div className="achv-badge-el" style={{ display: 'inline-block' }}>
              <Badge label={achievementsContent.badge} />
            </div>

            {/* Headline morph stack — 3 phrases swap during the first ~25% of pin. */}
            <h2
              className="achv-heading-el"
              style={{
                position: 'relative',
                display: 'block',
                minHeight: 'clamp(2.4rem, 5vw, 4rem)',
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: 'var(--color-text-primary)',
                margin: '1rem 0 0.75rem',
                lineHeight: 1.1,
              }}
            >
              {achievementsContent.headingMorphs.map((phrase, i) => (
                <span
                  key={phrase}
                  className="film-headline-morph achv-heading-morph"
                  aria-hidden={i === 0 ? undefined : 'true'}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'block',
                    willChange: 'transform, opacity, filter',
                  }}
                >
                  <GlitchText>{phrase}</GlitchText>
                </span>
              ))}
            </h2>

            <p
              className="film-fade achv-desc-el"
              data-at="0.10"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-base)',
                color: 'var(--color-text-secondary)',
                maxWidth: '560px',
                margin: '0 auto',
                lineHeight: 1.55,
              }}
            >
              {achievementsContent.description}
            </p>
          </div>
        </div>

        {/* Stats row */}
        <StatsConstellation stats={achievementsContent.stats} />
      </div>

      {/* Glow behind stats row */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '200px',
          background: 'radial-gradient(ellipse, rgba(168,240,255,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
    </SectionWrapper>
  );
}
