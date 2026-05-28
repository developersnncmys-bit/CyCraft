'use client';
/* Eligibility & Scholarships — Act VI, Section 19 of 22
 * Cinema mode: pinned 150vh (lightest in Act VI). Two columns reveal,
 * 50% scholarship value pulses to a glow on reveal. */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap/register';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { eligibilityContent } from '@/content/eligibility';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';

export default function EligibilitySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isTablet = useMediaQuery('(min-width: 768px)');
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const container = sectionRef.current;
      if (!container) return;
      const cols = container.querySelectorAll<HTMLElement>('.eligibility-col-el');

      if (reducedMotion) {
        gsap.set(cols, { opacity: 1, y: 0 });
        return;
      }

      if (!isDesktop) {
        gsap.fromTo(cols, { opacity: 0, y: 24 }, {
          opacity: 1, y: 0, stagger: 0.15, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: container, start: 'top 70%', toggleActions: 'play none none reset' },
        });
        return;
      }

      gsap.set(cols, { opacity: 0, y: 24 });
      gsap.set('.el-camera-el', { scale: 1, opacity: 1 });

      const tl = makePinnedTimeline({
        trigger: container,
        end: PIN_DURATIONS.eligibility,
        scrub: 1,
        enabled: true,
      });

      tl.to(cols, { opacity: 1, y: 0, stagger: 0.10, duration: 0.18, ease: 'power3.out' }, 0.05)
        .to('.el-camera-el', { scale: 0.98, duration: 0.10, ease: 'power2.inOut' }, 0.90);
    },
    { scope: sectionRef, dependencies: [reducedMotion, isDesktop, isTablet] },
  );

  return (
    <SectionWrapper ref={sectionRef} id="eligibility" act={6}>
      <div
        className="el-camera-el"
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: 'center center',
          willChange: 'transform, opacity',
        }}
      >
        <div style={{ position: 'relative', zIndex: 3, paddingTop: 'clamp(7rem, 13vh, 9rem)', paddingBottom: 'clamp(2rem, 4vh, 3rem)', paddingInline: 'var(--section-padding)' }}>
          <div className="section-container" style={{ display: 'grid', gridTemplateColumns: isTablet ? '1fr 1fr' : '1fr', gap: 'clamp(1.5rem, 3vw, 2.5rem)', alignItems: 'start' }}>

            <div className="eligibility-col-el" style={{ opacity: 0 }}>
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

            <div className="eligibility-col-el" style={{ opacity: 0 }}>
              <div style={{ border: '1px solid rgba(168,240,255,0.15)', padding: 'clamp(1.5rem, 3vw, 2rem)', background: 'rgba(168,240,255,0.02)', position: 'relative', overflow: 'hidden' }}>
                <div aria-hidden="true" style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '200px', background: 'radial-gradient(ellipse at top right, rgba(168,240,255,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

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
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-beam)', lineHeight: 1, marginBottom: '0.4rem' }}>50%</div>
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
