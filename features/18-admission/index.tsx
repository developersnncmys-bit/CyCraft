'use client';
/* Admission Process — Act VI, Section 18 of 22
 * Cinema mode: pinned 200vh. 4-step pulse, connectors draw between. */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap/register';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { admissionContent } from '@/content/admission';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';

export default function AdmissionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isTablet = useMediaQuery('(min-width: 768px)');
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const container = sectionRef.current;
      if (!container) return;
      const steps = container.querySelectorAll<HTMLElement>('.admission-step-el');
      const connectors = container.querySelectorAll<HTMLElement>('.step-connector-el');

      if (reducedMotion) {
        gsap.set(steps, { opacity: 1, y: 0 });
        gsap.set(connectors, { scaleX: 1 });
        gsap.set(['.ad-heading-el', '.ad-desc-el'], { opacity: 1 });
        return;
      }

      if (!isDesktop) {
        gsap.timeline({
          scrollTrigger: { trigger: container, start: 'top 70%', toggleActions: 'play none none reset' },
        })
          .fromTo(steps, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.18, duration: 0.6, ease: 'power2.out' }, 0)
          .fromTo(connectors, { scaleX: 0 }, { scaleX: 1, stagger: 0.18, duration: 0.35, ease: 'power2.inOut' }, 0.25);
        return;
      }

      gsap.set('.ad-heading-el', { opacity: 0, y: 24 });
      gsap.set('.ad-desc-el',    { opacity: 0, y: 16 });
      gsap.set(steps,            { opacity: 0, y: 20 });
      gsap.set(connectors,       { scaleX: 0 });
      gsap.set('.ad-camera-el',  { scale: 1, opacity: 1 });

      const tl = makePinnedTimeline({
        trigger: container,
        end: PIN_DURATIONS.admission,
        scrub: 1,
        enabled: true,
      });

      tl.to('.ad-heading-el', { opacity: 1, y: 0, duration: 0.08, ease: 'power3.out' }, 0)
        .to('.ad-desc-el',    { opacity: 1, y: 0, duration: 0.06, ease: 'power2.out' }, 0.04);

      // Steps + connectors interleaved — each step "pulses" as user scrolls
      const STEP_START = 0.18;
      const STEP_SPAN = 0.55;
      steps.forEach((step, i) => {
        const stepAt = STEP_START + STEP_SPAN * (i / Math.max(steps.length, 1));
        tl.to(step, { opacity: 1, y: 0, duration: 0.10, ease: 'back.out(1.4)' }, stepAt);
        const connector = connectors[i];
        if (connector) {
          tl.to(connector, { scaleX: 1, duration: 0.08, ease: 'power2.inOut' }, stepAt + 0.04);
        }
      });

      tl.to('.ad-camera-el', { scale: 0.98, duration: 0.10, ease: 'power2.inOut' }, 0.90);
    },
    { scope: sectionRef, dependencies: [reducedMotion, isDesktop, isTablet] },
  );

  return (
    <SectionWrapper ref={sectionRef} id="admission" act={6}>
      <div
        className="ad-camera-el"
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: 'center center',
          willChange: 'transform, opacity',
        }}
      >
        <div style={{ position: 'relative', zIndex: 3, paddingTop: 'clamp(7rem, 13vh, 9rem)', paddingBottom: 'clamp(2rem, 4vh, 3rem)', paddingInline: 'var(--section-padding)' }}>
          <div className="section-container" style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 4vh, 3rem)' }}>
            <h2
              className="ad-heading-el"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: 'var(--color-text-primary)',
                margin: '0 0 0.75rem',
                lineHeight: 1.1,
                willChange: 'transform, opacity',
              }}
            >
              {admissionContent.heading}
            </h2>
            <p
              className="ad-desc-el"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-base)',
                color: 'var(--color-text-secondary)',
                maxWidth: '480px',
                margin: '0 auto',
                lineHeight: 1.55,
                willChange: 'opacity',
              }}
            >
              {admissionContent.description}
            </p>
          </div>

          <div className="section-container">
            {isTablet ? (
              /* Horizontal 4-step strip. Steps + connectors are siblings in the
                 outer flex, aligned to flex-start; connector marginTop pulls
                 the 1px line down to vertical centre of the 40px number circle. */
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
                {admissionContent.steps.flatMap((step, i) => {
                  const items = [
                    <div
                      key={step.id}
                      className="admission-step-el"
                      style={{ flex: '1 1 0', textAlign: 'center', opacity: 0, transform: 'translateY(20px)' }}
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
                        className="step-connector-el"
                        aria-hidden="true"
                        style={{
                          flex: '0 0 3rem',
                          height: '2px',
                          background: 'linear-gradient(to right, var(--color-beam), var(--color-beam-glow))',
                          boxShadow: '0 0 6px var(--color-beam-glow)',
                          opacity: 0.7,
                          transform: 'scaleX(0)',
                          transformOrigin: 'left center',
                          marginTop: 'calc(20px - 1px)', /* aligns with 40px circle vertical centre */
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
                  {admissionContent.steps.map((step) => (
                    <div key={step.id} className="admission-step-el" style={{ opacity: 0, transform: 'translateY(20px)', position: 'relative' }}>
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
