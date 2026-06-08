'use client';
/* Specializations — Act III, Section 9 of 22.
 * Film-mode: pinned ~200vh. Hex constellation of 6 specialization cards. */
import { useRef } from 'react';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { Badge } from '@/components/ui/Badge';
import { specializationsContent } from '@/content/specializations';
import { Prism } from './components/Prism';
import { SpecializationCard } from './components/SpecializationCard';
import { useFilmReveal } from '@/lib/gsap/filmReveal';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';

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
  const isDesktop = useIsDesktop();
  useFilmReveal(sectionRef, { pin: '+=200%' });

  return (
    <SectionWrapper ref={sectionRef} id="specializations" act={3}>
      <div
        className="film-bg-deep"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-10%',
          zIndex: 0,
          background:
            'radial-gradient(ellipse at 50% 60%, rgba(168,240,255,0.12), transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(140,80,255,0.06), transparent 60%)',
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
            'repeating-linear-gradient(0deg, transparent, transparent 7px, rgba(168,240,255,0.02) 7px, rgba(168,240,255,0.02) 8px)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="film-camera spec-camera-el"
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
            textAlign: 'center',
            paddingTop: 'clamp(5rem, 9vh, 6rem)',
            paddingInline: 'var(--section-padding)',
          }}
        >
          <div className="section-container">
            <div className="film-fade spec-badge-el" data-at="0.05" style={{ display: 'inline-block' }}>
              <Badge label={specializationsContent.badge} />
            </div>
            <h2
              className="film-fade spec-heading-el"
              data-at="0.10"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: 'var(--color-text-primary)',
                margin: '1rem 0 0.5rem',
                lineHeight: 1.1,
              }}
            >
              {specializationsContent.heading}
            </h2>
            <p
              className="film-fade spec-desc-el"
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
              {specializationsContent.description}
            </p>
          </div>
        </div>

        {isDesktop ? (
          <>
            {/* film-fade wrapping the WHOLE constellation, not individual
                cards. Per-card film-fade wrappers added `transform: translate`
                which created a new CSS positioning context for each card's
                `position: absolute` — collapsing the hex layout. Fading the
                container instead keeps the cards' absolute positioning
                relative to the constellation centre. */}
            <div
              className="film-fade spec-constellation-el"
              data-at="0.25"
              data-dur="0.30"
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
