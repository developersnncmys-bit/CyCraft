'use client';
/* Placements — Act V, Section 16 of 22.
 * Film-mode: pinned ~220vh. 6 metric cards with dramatic counter ignition. */
import { useRef } from 'react';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { Badge } from '@/components/ui/Badge';
import { placementsContent } from '@/content/placements';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { useFilmReveal } from '@/lib/gsap/filmReveal';

const FONT_SIZE_D: Record<string, string> = {
  highest: '2.75rem', top10: '2rem', average: '1.75rem',
  median: '1.75rem', partners: '1.75rem', guarantee: '1.75rem',
};
const FONT_SIZE_M: Record<string, string> = {
  highest: '2rem', top10: '1.5rem', average: '1.35rem',
  median: '1.35rem', partners: '1.35rem', guarantee: '1.35rem',
};

function parseMetric(value: string) {
  const prefix = value.startsWith('₹') ? '₹' : '';
  const unit   = value.endsWith('LPA') ? 'LPA'
               : value.endsWith('%')   ? '%'
               : value.endsWith('+')   ? '+'
               : '';
  return { prefix, unit };
}

export default function PlacementsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isTablet = useMediaQuery('(min-width: 768px)');
  const isPhone   = !useMediaQuery('(min-width: 480px)');
  useFilmReveal(sectionRef, { pin: '+=220%' });

  return (
    <SectionWrapper ref={sectionRef} id="placements" act={5}>
      <div
        className="film-bg-deep"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-10%',
          zIndex: 0,
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(0,255,148,0.12), transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(168,240,255,0.08), transparent 55%)',
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
            'repeating-linear-gradient(0deg, transparent, transparent 5px, rgba(0,255,148,0.02) 5px, rgba(0,255,148,0.02) 6px)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="film-camera pl-camera-el"
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        <div
          style={{
            position: 'relative', zIndex: 3,
            paddingTop: 'clamp(5rem, 9vh, 6rem)',
            paddingBottom: 'clamp(2rem, 4vh, 3rem)',
            paddingInline: 'var(--section-padding)',
          }}
        >
          {/* Header */}
          <div className="section-container" style={{ textAlign: 'center', marginBottom: 'clamp(1.5rem, 3vh, 2.5rem)' }}>
            <div className="film-fade pl-badge-el" data-at="0.05" style={{ display: 'inline-block' }}>
              <Badge label={placementsContent.badge} />
            </div>
            <h2
              className="film-fade pl-heading-el"
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
              {placementsContent.heading}
            </h2>
            <p
              className="film-fade pl-desc-el"
              data-at="0.14"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-base)',
                color: 'var(--color-text-secondary)',
                maxWidth: '540px',
                margin: '0 auto',
                lineHeight: 1.55,
              }}
            >
              {placementsContent.description}
            </p>
          </div>

          {/* Metrics grid — staggered + counter ignition */}
          <div
            className="section-container"
            style={{
              display: 'grid',
              gridTemplateColumns: isTablet ? 'repeat(3, 1fr)' : isPhone ? '1fr' : 'repeat(2, 1fr)',
              gap: '1px',
              background: 'rgba(168,240,255,0.06)',
            }}
          >
            {placementsContent.metrics.map((m, idx) => {
              const isTop = m.id === 'highest';
              const { prefix, unit } = parseMetric(m.value);
              const sizeMap = isPhone ? FONT_SIZE_M : FONT_SIZE_D;
              const fontSize = sizeMap[m.id] ?? '1.75rem';
              const isFloat = String(m.numericValue).includes('.');

              return (
                <div
                  key={m.id}
                  className="film-fade metric-card-el"
                  data-at={`${0.20 + idx * 0.06}`}
                  data-dur="0.10"
                  style={{
                    padding: '1.5rem 1.25rem',
                    background: isTop ? 'rgba(168,240,255,0.04)' : 'var(--color-void)',
                    textAlign: 'center',
                    position: 'relative',
                  }}
                >
                  {isTop && (
                    <div
                      aria-hidden="true"
                      style={{
                        position: 'absolute', inset: 0,
                        background: 'radial-gradient(ellipse at center, rgba(168,240,255,0.10) 0%, transparent 70%)',
                        pointerEvents: 'none',
                      }}
                    />
                  )}

                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.25em', marginBottom: '0.5rem', flexWrap: 'nowrap' }}>
                    <span
                      className="metric-value-el film-stat"
                      data-target={m.numericValue}
                      data-prefix={prefix}
                      data-decimals={isFloat ? 1 : 0}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize,
                        fontWeight: 700,
                        fontVariantNumeric: 'tabular-nums',
                        color: isTop ? 'var(--color-beam)' : 'var(--color-text-primary)',
                        lineHeight: 1,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {prefix}0
                    </span>
                    {unit && (
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: `calc(${fontSize} * 0.42)`,
                          fontWeight: 700,
                          color: isTop ? 'var(--color-beam)' : 'var(--color-text-secondary)',
                          letterSpacing: '0.08em',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {unit}
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
                      letterSpacing: '0.15em', color: 'var(--color-text-secondary)',
                      textTransform: 'uppercase', marginBottom: '0.3rem',
                    }}
                  >
                    {m.label}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-body)', fontSize: '0.78rem',
                      color: 'var(--color-text-tertiary)', lineHeight: 1.4,
                    }}
                  >
                    {m.sub}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
