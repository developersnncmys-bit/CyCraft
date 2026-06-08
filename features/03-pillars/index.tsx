'use client';
/* Pillars — Act II, Section 3 of 22.
 * Film-mode: pinned ~320vh. Three-pillar showpiece. */
import { useRef } from 'react';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { Badge } from '@/components/ui/Badge';
import { pillarsContent } from '@/content/pillars';
import { BeamPrism } from './components/BeamPrism';
import { PillarCard } from './components/PillarCard';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { useFilmReveal } from '@/lib/gsap/filmReveal';

export default function PillarsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isTablet = useMediaQuery('(min-width: 768px)');
  useFilmReveal(sectionRef, { pin: '+=320%' });

  return (
    <SectionWrapper ref={sectionRef} id="pillars" act={2}>
      {/* Parallax depth */}
      <div
        className="film-bg-deep"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-10%',
          zIndex: 0,
          background:
            'radial-gradient(ellipse at 50% 28%, rgba(168,240,255,0.12), transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(255,61,90,0.05), transparent 55%)',
          pointerEvents: 'none',
        }}
      />
      <div
        className="film-bg-mid"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-5%',
          zIndex: 0,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 6px, rgba(168,240,255,0.02) 6px, rgba(168,240,255,0.02) 7px)',
          pointerEvents: 'none',
        }}
      />

      {/* Beam descend + prism gem + rails + continuation */}
      <BeamPrism />

      <div
        className="film-camera pillars-camera-el"
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        {/* Header */}
        <div
          style={{
            position: 'relative',
            zIndex: 3,
            textAlign: 'center',
            paddingTop: 'clamp(5rem, 9vh, 6rem)',
            paddingInline: 'var(--section-padding)',
          }}
        >
          <div className="section-container">
            <div className="film-fade pillars-badge-el" data-at="0.05" style={{ display: 'inline-block' }}>
              <Badge label={pillarsContent.badge} />
            </div>
            <h2
              className="film-fade pillars-heading-el"
              data-at="0.10"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: 'var(--color-text-primary)',
                margin: '1rem 0 0.6rem',
                lineHeight: 1.1,
              }}
            >
              {pillarsContent.heading}
            </h2>
            <p
              className="film-fade pillars-desc-el"
              data-at="0.15"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-base)',
                color: 'var(--color-text-secondary)',
                maxWidth: '520px',
                margin: '0 auto',
                lineHeight: 1.5,
              }}
            >
              {pillarsContent.description}
            </p>
          </div>
        </div>

        {/* Pillar cards — staggered fade-up */}
        <div
          style={{
            position: 'relative',
            zIndex: 3,
            paddingTop: 'clamp(4rem, 8vh, 6rem)',
            paddingBottom: 'clamp(1.5rem, 3vh, 2.5rem)',
            paddingInline: 'var(--section-padding)',
          }}
        >
          <div
            className="section-container"
            style={{
              display: 'grid',
              gridTemplateColumns: isTablet ? 'repeat(3, 1fr)' : '1fr',
              gap: '1.5rem',
              alignItems: 'end',
            }}
          >
            {pillarsContent.pillars.map((pillar, i) => (
              <div key={pillar.id} className="film-fade" data-at={`${0.30 + i * 0.10}`} data-dur="0.15">
                <PillarCard
                  title={pillar.title}
                  description={pillar.description}
                  icon={pillar.icon}
                  team={pillar.team}
                  isCenter={i === 1}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '28%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'clamp(220px, 60vw, 400px)',
          height: 'clamp(180px, 40vw, 300px)',
          maxWidth: '100vw',
          background: 'radial-gradient(ellipse, rgba(168,240,255,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
    </SectionWrapper>
  );
}
