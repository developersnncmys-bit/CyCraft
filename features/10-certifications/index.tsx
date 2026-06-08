'use client';
/* Certifications — Act IV, Section 10 of 22.
 * Film-mode: pinned ~180vh. Header reveals, ticker scrolls horizontally. */
import { useRef } from 'react';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { certificationsContent } from '@/content/certifications';
import { CertTicker } from './components/CertTicker';
import { useFilmReveal } from '@/lib/gsap/filmReveal';

export default function CertificationsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useFilmReveal(sectionRef, { pin: '+=180%' });

  return (
    <SectionWrapper ref={sectionRef} id="certifications" act={4}>
      <div
        className="film-bg-deep"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-10%',
          zIndex: 0,
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(140,80,255,0.10), transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(168,240,255,0.06), transparent 55%)',
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
            'repeating-linear-gradient(0deg, transparent, transparent 6px, rgba(168,240,255,0.018) 6px, rgba(168,240,255,0.018) 7px)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="film-camera cert-camera-el"
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
            padding: 'clamp(5rem, 9vh, 6rem) 0 clamp(2rem, 4vh, 3rem)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 'clamp(1.5rem, 3vh, 2.5rem)' }}>
            <div className="section-container">
              <h2
                className="film-fade cert-heading-el"
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
                {certificationsContent.heading}
              </h2>
              <p
                className="film-fade cert-desc-el"
                data-at="0.12"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-text-secondary)',
                  maxWidth: '560px',
                  margin: '0 auto',
                  lineHeight: 1.55,
                }}
              >
                {certificationsContent.description}
              </p>
            </div>
          </div>

          {/* Ticker — full bleed, zooms in */}
          <div className="film-image-zoom cert-ticker-wrap-el">
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
