'use client';
/* Hands-On Battlegrounds — Act IV, Section 13 of 22
 * Cinema mode: pinned 200vh. 3×3 grid with diagonal stagger reveal. */
import { useRef } from 'react';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { Badge } from '@/components/ui/Badge';
import { battlegroundsContent } from '@/content/battlegrounds';
import { LabTile } from './components/LabTile';
import { useLabsReveal } from './hooks/useLabsReveal';

export default function BattlegroundsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useLabsReveal(sectionRef);

  return (
    <SectionWrapper ref={sectionRef} id="battlegrounds" act={4}>
      <div
        className="bg-camera-el"
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: 'center center',
          willChange: 'transform, opacity',
        }}
      >
        <div
          style={{
            position: 'relative',
            zIndex: 3,
            paddingTop: 'clamp(4rem, 7vh, 5rem)',
            paddingBottom: 'clamp(1.5rem, 3vh, 2.5rem)',
            paddingInline: 'var(--section-padding)',
          }}
        >
          {/* Header */}
          <div className="section-container" style={{ textAlign: 'center', marginBottom: 'clamp(1rem, 2vh, 1.75rem)' }}>
            <div className="bg-badge-el" style={{ display: 'inline-block' }}>
              <Badge label={battlegroundsContent.badge} />
            </div>
            <h2
              className="bg-heading-el"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: 'var(--color-text-primary)',
                margin: '1rem 0 0.75rem',
                lineHeight: 1.1,
                willChange: 'transform, opacity',
              }}
            >
              {battlegroundsContent.heading}
            </h2>
            <p
              className="bg-desc-el"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-base)',
                color: 'var(--color-text-secondary)',
                maxWidth: '560px',
                margin: '0 auto',
                lineHeight: 1.55,
                willChange: 'opacity',
              }}
            >
              {battlegroundsContent.description}
            </p>
          </div>

          {/* 3×3 grid — explicit 3 columns so all 9 tiles fit cleanly */}
          <div
            className="section-container"
            role="list"
            aria-label="Hands-on lab environments"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1px',
              background: 'rgba(168,240,255,0.04)',
              maxWidth: '1100px',
              marginInline: 'auto',
            }}
          >
            {battlegroundsContent.labs.map((lab, i) => (
              <LabTile
                key={lab.id}
                title={lab.title}
                description={lab.description}
                team={lab.team}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
