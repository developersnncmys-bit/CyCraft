'use client';
/* Eligibility & Scholarships — Act VI, Section 19 of 22.
 * Film-mode: pinned ~160vh. Two columns reveal side-by-side. */
import { useRef } from 'react';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { eligibilityContent } from '@/content/eligibility';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { useFilmReveal } from '@/lib/gsap/filmReveal';

export default function EligibilitySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isTablet = useMediaQuery('(min-width: 768px)');
  useFilmReveal(sectionRef, { pin: '+=160%' });

  return (
    <SectionWrapper ref={sectionRef} id="eligibility" act={6}>
      <div
        className="film-bg-deep"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-10%',
          zIndex: 0,
          background:
            'radial-gradient(ellipse at 30% 50%, rgba(168,240,255,0.12), transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(0,255,148,0.06), transparent 55%)',
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
            'repeating-linear-gradient(0deg, transparent, transparent 6px, rgba(168,240,255,0.022) 6px, rgba(168,240,255,0.022) 7px)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="film-camera el-camera-el"
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        <div style={{ position: 'relative', zIndex: 3, paddingTop: 'clamp(7rem, 13vh, 9rem)', paddingBottom: 'clamp(2rem, 4vh, 3rem)', paddingInline: 'var(--section-padding)' }}>
          <div className="section-container" style={{ display: 'grid', gridTemplateColumns: isTablet ? '1fr 1fr' : '1fr', gap: 'clamp(1.5rem, 3vw, 2.5rem)', alignItems: 'start' }}>

            <div className="film-fade eligibility-col-el" data-at="0.05" data-dur="0.20">
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: 'var(--color-text-primary)',
                margin: '0 0 1.25rem',
                lineHeight: 1.1,
              }}>
                {eligibilityContent.eligibility.heading}
              </h2>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {eligibilityContent.eligibility.criteria.map((c, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--color-beam)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', flexShrink: 0, marginTop: '2px' }}>✓</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="film-fade eligibility-col-el" data-at="0.25" data-dur="0.20">
              <div style={{ border: '1px solid rgba(168,240,255,0.15)', padding: 'clamp(1.5rem, 3vw, 2rem)', background: 'rgba(168,240,255,0.02)', position: 'relative', overflow: 'hidden' }}>
                <div aria-hidden="true" style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '200px', background: 'radial-gradient(ellipse at top right, rgba(168,240,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.25rem, 2.4vw, 1.75rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-primary)',
                  margin: '0 0 0.75rem',
                  lineHeight: 1.1,
                }}>
                  {eligibilityContent.scholarships.heading}
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', margin: '0 0 1.5rem', lineHeight: 1.55 }}>
                  {eligibilityContent.scholarships.description}
                </p>
                <div style={{ borderTop: '1px solid rgba(168,240,255,0.1)', paddingTop: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.1em', lineHeight: 1, marginBottom: '0.4rem' }}>
                    <span
                      className="film-stat"
                      data-target={50}
                      style={{ fontFamily: 'var(--font-mono)', fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-beam)' }}
                    >
                      0
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-beam)' }}>%</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)' }}>{eligibilityContent.scholarships.reward}</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
