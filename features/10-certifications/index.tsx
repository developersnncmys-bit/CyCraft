'use client';
/* Global Certifications — Act IV, Section 10 of 22
 * Cinema mode: pinned 150vh. Lightest pin in Act IV — header reveals,
 * ticker scrolls horizontally as it always does. CINEMA_SPEC §2.2. */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { certificationsContent } from '@/content/certifications';
import { CertTicker } from './components/CertTicker';
import { gsap } from '@/lib/gsap/register';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';

export default function CertificationsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const isDesktop = useIsDesktop();

  useGSAP(
    () => {
      const container = sectionRef.current;
      if (!container) return;

      if (reducedMotion || !isDesktop) {
        gsap.set(['.cert-heading-el', '.cert-desc-el', '.cert-ticker-wrap-el'],
                 { opacity: 1, y: 0 });
        return;
      }

      gsap.set('.cert-heading-el',     { opacity: 0, y: 24 });
      gsap.set('.cert-desc-el',        { opacity: 0, y: 16 });
      gsap.set('.cert-ticker-wrap-el', { opacity: 0 });
      gsap.set('.cert-camera-el',      { scale: 1 });

      const tl = makePinnedTimeline({
        trigger: container,
        end: PIN_DURATIONS.certifications,
        scrub: 1,
        enabled: true,
        unpinned: true,
      });

      tl.to('.cert-heading-el',     { opacity: 1, y: 0, duration: 0.15, ease: 'power3.out' }, 0)
        .to('.cert-desc-el',        { opacity: 1, y: 0, duration: 0.15, ease: 'power2.out' }, 0.08)
        .to('.cert-ticker-wrap-el', { opacity: 1, duration: 0.20, ease: 'power2.out' }, 0.25)
        // Hold 0.50 – 0.85
        .to('.cert-camera-el',      { scale: 0.98, duration: 0.10, ease: 'power2.inOut' }, 0.85);
    },
    { scope: sectionRef, dependencies: [reducedMotion, isDesktop] },
  );

  return (
    <SectionWrapper ref={sectionRef} id="certifications" act={4}>
      <div
        className="cert-camera-el"
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
            padding: 'clamp(5rem, 9vh, 6rem) 0 clamp(2rem, 4vh, 3rem)',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 'clamp(1.5rem, 3vh, 2.5rem)' }}>
            <div className="section-container">
              <h2
                className="cert-heading-el"
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
                {certificationsContent.heading}
              </h2>
              <p
                className="cert-desc-el"
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
                {certificationsContent.description}
              </p>
            </div>
          </div>

          {/* Ticker — full bleed */}
          <div className="cert-ticker-wrap-el" style={{ willChange: 'opacity' }}>
            <CertTicker
              certs={certificationsContent.certifications}
              footerNote={certificationsContent.footerNote}
            />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
