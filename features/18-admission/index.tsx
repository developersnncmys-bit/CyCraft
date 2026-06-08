'use client';
/* Admission Process — Act VI, Section 18 of 22.
 * Film-mode: pinned ~200vh. 4-step strip with staggered pulses + connectors. */
import { useRef } from 'react';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { admissionContent } from '@/content/admission';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { useFilmReveal } from '@/lib/gsap/filmReveal';

export default function AdmissionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isTablet = useMediaQuery('(min-width: 768px)');
  useFilmReveal(sectionRef, { pin: '+=200%' });

  return (
    <SectionWrapper ref={sectionRef} id="admission" act={6}>
      <div
        className="film-bg-deep"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-10%',
          zIndex: 0,
          background:
            'radial-gradient(ellipse at 50% 40%, rgba(168,240,255,0.14), transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(0,255,148,0.06), transparent 55%)',
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
            'repeating-linear-gradient(0deg, transparent, transparent 6px, rgba(168,240,255,0.025) 6px, rgba(168,240,255,0.025) 7px)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="film-camera ad-camera-el"
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        <div style={{ position: 'relative', zIndex: 3, paddingTop: 'clamp(7rem, 13vh, 9rem)', paddingBottom: 'clamp(2rem, 4vh, 3rem)', paddingInline: 'var(--section-padding)' }}>
          <div className="section-container" style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 4vh, 3rem)' }}>
            <h2
              className="film-fade ad-heading-el"
              data-at="0.05"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: 'var(--color-text-primary)',
                margin: '0 0 0.75rem',
                lineHeight: 1.1,
              }}
            >
              {admissionContent.heading}
            </h2>
            <p
              className="film-fade ad-desc-el"
              data-at="0.10"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-base)',
                color: 'var(--color-text-secondary)',
                maxWidth: '480px',
                margin: '0 auto',
                lineHeight: 1.55,
              }}
            >
              {admissionContent.description}
            </p>
          </div>

          <div className="section-container">
            {isTablet ? (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
                {admissionContent.steps.flatMap((step, i) => {
                  const stepAt = 0.20 + i * 0.16;
                  const items = [
                    <div
                      key={step.id}
                      className="film-fade admission-step-el"
                      data-at={`${stepAt}`}
                      data-dur="0.12"
                      style={{ flex: '1 1 0', textAlign: 'center' }}
                    >
                      <div style={{ width: '40px', height: '40px', border: '1px solid rgba(168,240,255,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', background: 'rgba(168,240,255,0.04)' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-beam)', letterSpacing: '0.1em' }}>{step.number}</span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 700, marginBottom: '0.4rem' }}>{step.title}</div>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: '0 0.75rem', lineHeight: 1.5 }}>{step.description}</p>
                    </div>,
                  ];
                  if (i < admissionContent.steps.length - 1) {
                    items.push(
                      <div
                        key={`conn-${i}`}
                        className="film-fade step-connector-el"
                        data-at={`${stepAt + 0.04}`}
                        data-dur="0.08"
                        aria-hidden="true"
                        style={{
                          flex: '0 0 3rem',
                          height: '2px',
                          background: 'linear-gradient(to right, var(--color-beam), var(--color-beam-glow))',
                          boxShadow: '0 0 6px var(--color-beam-glow)',
                          opacity: 0.7,
                          marginTop: 'calc(20px - 1px)',
                        }}
                      />,
                    );
                  }
                  return items;
                })}
              </div>
            ) : (
              <div style={{ position: 'relative', paddingLeft: '2.5rem', borderLeft: '1px solid rgba(168,240,255,0.12)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {admissionContent.steps.map((step, i) => (
                    <div key={step.id} className="film-fade admission-step-el" data-at={`${0.20 + i * 0.14}`} style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '-2.9rem', top: '0.25rem', width: '20px', height: '20px', borderRadius: '50%', border: '1px solid rgba(168,240,255,0.3)', background: 'rgba(168,240,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--color-beam)' }}>{step.number}</span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 700, marginBottom: '0.35rem' }}>{step.title}</div>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 }}>{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
