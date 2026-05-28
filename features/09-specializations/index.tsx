'use client';
/* Advanced Specializations — Act III, Section 9 of 22
 * Cinema mode: pinned 300vh. Prism spins, refracted beams shoot to 6 hex cards. */
import { useRef } from 'react';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { Badge } from '@/components/ui/Badge';
import { specializationsContent } from '@/content/specializations';
import { Prism } from './components/Prism';
import { SpecializationCard } from './components/SpecializationCard';
import { usePrismRefraction } from './hooks/usePrismRefraction';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';

// Hex positions: 6 cards at radius 130px, starting from top (−90°)
const HEX_RADIUS = 130;
const HEX_POSITIONS = Array.from({ length: 6 }, (_, i) => {
  const angle = (i * 60 - 90) * (Math.PI / 180);
  return {
    x: Math.round(HEX_RADIUS * Math.cos(angle)),
    y: Math.round(HEX_RADIUS * Math.sin(angle)),
  };
});

export default function SpecializationsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  usePrismRefraction(sectionRef);

  return (
    <SectionWrapper ref={sectionRef} id="specializations" act={3}>
      <div
        className="spec-camera-el"
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
            <div className="spec-badge-el" style={{ display: 'inline-block' }}>
              <Badge label={specializationsContent.badge} />
            </div>
            <h2
              className="spec-heading-el"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: 'var(--color-text-primary)',
                margin: '1rem 0 0.5rem',
                lineHeight: 1.1,
                willChange: 'transform, opacity',
              }}
            >
              {specializationsContent.heading}
            </h2>
            <p
              className="spec-desc-el"
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
              {specializationsContent.description}
            </p>
          </div>
        </div>

        {isDesktop ? (
          /* ── Desktop: hex constellation ── */
          <>
            <div
              role="list"
              aria-label="Specialization areas"
              style={{ position: 'relative', zIndex: 2, height: 'clamp(300px, 36vh, 360px)', margin: 'clamp(1.5rem, 3vh, 2.5rem) auto 0', maxWidth: '540px' }}
            >
              <Prism />
              {specializationsContent.areas.map((area, i) => (
                <div key={area.id} role="listitem">
                  <SpecializationCard title={area.title} icon={area.icon} index={i} x={HEX_POSITIONS[i].x} y={HEX_POSITIONS[i].y} />
                </div>
              ))}
            </div>
            <div style={{ height: 'clamp(2rem, 4vh, 3rem)' }} aria-hidden="true" />
          </>
        ) : (
          /* ── Mobile: simple responsive grid ── */
          <div
            role="list"
            aria-label="Specialization areas"
            style={{
              paddingInline: 'var(--section-padding)',
              paddingBottom: 'clamp(4rem, 8vh, 6rem)',
              paddingTop: '2rem',
            }}
          >
            <div
              className="section-container"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}
            >
              {specializationsContent.areas.map((area, i) => (
                <div
                  key={area.id}
                  role="listitem"
                  className="spec-card-el"
                  style={{
                    padding: '1.25rem',
                    border: '1px solid rgba(168,240,255,0.1)',
                    background: 'rgba(168,240,255,0.02)',
                    display: 'flex', flexDirection: 'column', gap: '0.5rem',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-beam)', letterSpacing: '0.1em' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 600, lineHeight: 1.3 }}>
                    {area.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
