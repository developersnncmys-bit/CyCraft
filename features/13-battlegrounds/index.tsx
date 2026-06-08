'use client';
/* Hands-On Battlegrounds — Act IV, Section 13 of 22.
 * Film-mode: pinned ~200vh. 3×3 grid with diagonal stagger reveal. */
import { useRef } from 'react';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { Badge } from '@/components/ui/Badge';
import { battlegroundsContent } from '@/content/battlegrounds';
import { LabTile } from './components/LabTile';
import { useFilmReveal } from '@/lib/gsap/filmReveal';

export default function BattlegroundsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useFilmReveal(sectionRef, { pin: '+=200%' });

  return (
    <SectionWrapper ref={sectionRef} id="battlegrounds" act={4}>
      <div
        className="film-bg-deep"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-10%',
          zIndex: 0,
          background:
            'radial-gradient(ellipse at 20% 30%, rgba(255,61,90,0.10), transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(61,168,255,0.10), transparent 60%)',
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
            'repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(168,240,255,0.03) 60px, rgba(168,240,255,0.03) 61px), repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.015) 3px, rgba(255,255,255,0.015) 4px)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="film-camera bg-camera-el"
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: 'center center',
          willChange: 'transform',
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
            <div className="film-fade bg-badge-el" data-at="0.05" style={{ display: 'inline-block' }}>
              <Badge label={battlegroundsContent.badge} />
            </div>
            <h2
              className="film-fade bg-heading-el"
              data-at="0.10"
              style={{
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
              {battlegroundsContent.heading}
            </h2>
            <p
              className="film-fade bg-desc-el"
              data-at="0.15"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-base)',
                color: 'var(--color-text-secondary)',
                maxWidth: '560px',
                margin: '0 auto',
                lineHeight: 1.55,
              }}
            >
              {battlegroundsContent.description}
            </p>
          </div>

          {/* 3×3 grid — diagonal stagger */}
          <div
            className="section-container labs-grid"
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
            {battlegroundsContent.labs.map((lab, i) => {
              // Diagonal stagger — top-left to bottom-right.
              const row = Math.floor(i / 3);
              const col = i % 3;
              const diag = row + col;
              return (
                <div key={lab.id} className="film-fade" data-at={`${0.22 + diag * 0.07}`} data-dur="0.12">
                  <LabTile
                    title={lab.title}
                    description={lab.description}
                    team={lab.team}
                    index={i}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
