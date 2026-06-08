'use client';
/* Comparison — Act V, Section 14 of 22.
 * Film-mode: pinned ~220vh. 5 comparison rows stagger-reveal alternating sides. */
import { useRef } from 'react';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { comparisonContent } from '@/content/comparison';
import { ComparisonRow } from './components/ComparisonRow';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { useFilmReveal } from '@/lib/gsap/filmReveal';

export default function ComparisonSection() {
  const isTablet = useMediaQuery('(min-width: 768px)');
  const sectionRef = useRef<HTMLElement>(null);
  useFilmReveal(sectionRef, { pin: '+=220%' });

  return (
    <SectionWrapper ref={sectionRef} id="comparison" act={5}>
      <div
        className="film-bg-deep"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-10%',
          zIndex: 0,
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(0,255,148,0.10), transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(255,61,90,0.05), transparent 55%)',
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
            'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(0,255,148,0.02) 8px, rgba(0,255,148,0.02) 9px)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="film-camera cmp-camera-el"
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
            paddingBottom: 'clamp(2rem, 4vh, 3rem)',
            paddingInline: 'var(--section-padding)',
          }}
        >
          {/* Header */}
          <div className="section-container" style={{ textAlign: 'center', marginBottom: 'clamp(1.5rem, 3vh, 2.5rem)' }}>
            <h2
              className="film-fade cmp-heading-el"
              data-at="0.05"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.25rem, 2.2vw, 1.875rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: 'var(--color-text-primary)',
                margin: '0 auto 0.75rem',
                lineHeight: 1.15,
                maxWidth: '720px',
              }}
            >
              {comparisonContent.heading}
            </h2>
            <p
              className="film-fade cmp-desc-el"
              data-at="0.10"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-secondary)',
                maxWidth: '520px',
                margin: '0 auto',
                lineHeight: 1.5,
              }}
            >
              {comparisonContent.description}
            </p>
          </div>

          {/* Column headers + rows */}
          <div className="section-container" style={{ maxWidth: '1100px' }}>
            <div className="film-fade cmp-headers-el" data-at="0.15">
              <div style={{ display: 'grid', gridTemplateColumns: isTablet ? '1fr 120px 1fr' : '1fr 1fr', gap: '0 1px', marginBottom: '2px' }}>
                <div style={{ padding: '0.5rem 1rem', textAlign: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.15em', color: 'var(--color-text-disabled)', textTransform: 'uppercase' }}>
                    Traditional
                  </span>
                </div>
                {isTablet && <div />}
                <div style={{ padding: '0.5rem 1rem', textAlign: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.15em', color: 'var(--color-beam)', textTransform: 'uppercase' }}>
                    CyCraft
                  </span>
                </div>
              </div>
              <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, var(--color-beam-glow), transparent)', marginBottom: '2px' }} aria-hidden="true" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              {comparisonContent.rows.map((row, i) => (
                <div key={row.id} className="film-fade comparison-row-el" data-at={`${0.25 + i * 0.10}`} data-dur="0.14">
                  <ComparisonRow
                    label={row.label}
                    traditional={row.traditional}
                    cycraft={row.cycraft}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
