'use client';
/* Pillars section — Act II, Section 3 of 22
 * Cinema mode: pinned 350vh (the longest pin in Act II — this is the showpiece).
 * Beam descends to prism → splits into 3 SVG rails (stroke-dashoffset draw-in)
 * → cards materialise → hold → reform. CINEMA_SPEC §7.3. */
import { useRef } from 'react';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { Badge } from '@/components/ui/Badge';
import { pillarsContent } from '@/content/pillars';
import { BeamPrism } from './components/BeamPrism';
import { PillarCard } from './components/PillarCard';
import { usePillarSplit } from './hooks/usePillarSplit';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';

export default function PillarsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isTablet = useMediaQuery('(min-width: 768px)');
  usePillarSplit(sectionRef);

  return (
    <SectionWrapper ref={sectionRef} id="pillars" act={2}>
      {/* Beam descend + prism gem + rails + continuation */}
      <BeamPrism />

      <div
        className="pillars-camera-el"
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        {/* ── Header ── */}
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
            <div className="pillars-badge-el" style={{ display: 'inline-block' }}>
              <Badge label={pillarsContent.badge} />
            </div>
            <h2
              className="pillars-heading-el"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: 'var(--color-text-primary)',
                margin: '1rem 0 0.6rem',
                lineHeight: 1.1,
                willChange: 'transform, opacity',
              }}
            >
              {pillarsContent.heading}
            </h2>
            <p
              className="pillars-desc-el"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-base)',
                color: 'var(--color-text-secondary)',
                maxWidth: '520px',
                margin: '0 auto',
                lineHeight: 1.5,
                willChange: 'opacity',
              }}
            >
              {pillarsContent.description}
            </p>
          </div>
        </div>

        {/* ── Pillar cards (below the rail endpoints) ── */}
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
              <PillarCard
                key={pillar.id}
                title={pillar.title}
                description={pillar.description}
                icon={pillar.icon}
                team={pillar.team}
                isCenter={i === 1}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Ambient glow from prism split */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '28%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '400px',
          height: '300px',
          background: 'radial-gradient(ellipse, rgba(168,240,255,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
    </SectionWrapper>
  );
}
