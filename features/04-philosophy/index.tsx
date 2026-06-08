'use client';
/* Philosophy — Act II, Section 4 of 22.
 * Film-mode: pinned ~200vh. Tight reveal + tilted video parallax. */
import { useRef } from 'react';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { philosophyContent } from '@/content/philosophy';
import { FracturedHeading } from './components/FracturedHeading';
import { TiltedVideo } from './components/TiltedVideo';
import { useFilmReveal } from '@/lib/gsap/filmReveal';

export default function PhilosophySection() {
  const sectionRef = useRef<HTMLElement>(null);
  useFilmReveal(sectionRef, { pin: '+=200%' });

  return (
    <SectionWrapper ref={sectionRef} id="philosophy" act={2}>
      <div
        className="film-bg-deep"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-10%',
          zIndex: 0,
          background:
            'radial-gradient(ellipse at 25% 40%, rgba(168,240,255,0.10), transparent 60%), radial-gradient(ellipse at 75% 60%, rgba(255,61,90,0.06), transparent 55%)',
          pointerEvents: 'none',
        }}
      />
      <div
        className="film-bg-mid"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-6%',
          zIndex: 0,
          backgroundImage:
            'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(168,240,255,0.02) 8px, rgba(168,240,255,0.02) 9px)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="film-camera philosophy-camera-el"
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: 'center center',
          willChange: 'transform',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 'clamp(3rem, 6vw, 5rem)',
            padding: 'clamp(5rem, 9vh, 6rem) var(--section-padding) clamp(2rem, 4vh, 3rem)',
            maxWidth: '1440px',
            margin: '0 auto',
            width: '100%',
          }}
        >
          {/* Left column */}
          <div className="philosophy-col" style={{ flex: '1 1 min(480px, 100%)', minWidth: 0 }}>
            <h2
              className="film-fade philosophy-heading-el"
              data-at="0.05"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1rem, 1.8vw, 1.5rem)',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-beam)',
                marginBottom: '1rem',
              }}
            >
              {philosophyContent.heading}
            </h2>

            <div className="film-fade" data-at="0.15" data-dur="0.20" style={{ marginBottom: '1rem' }}>
              <FracturedHeading
                as="p"
                style={{
                  fontSize: 'clamp(1.25rem, 2.5vw, 2rem)',
                  marginBottom: 0,
                  lineHeight: 1.15,
                } as React.CSSProperties}
              >
                {philosophyContent.broken}
              </FracturedHeading>
            </div>

            <div
              className="film-fade philosophy-line-el"
              data-at="0.40"
              aria-hidden="true"
              style={{
                height: '1px',
                background: 'linear-gradient(to right, var(--color-beam), transparent)',
                marginBottom: '1rem',
              }}
            />

            <p
              className="film-fade philosophy-desc-el"
              data-at="0.45"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-base)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6,
                maxWidth: '520px',
              }}
            >
              {philosophyContent.description}
            </p>
          </div>

          {/* Right column — tilted video, zooms in across pin */}
          <div className="film-image-zoom" style={{ flex: '1 1 min(420px, 100%)' }}>
            <TiltedVideo
              mp4={philosophyContent.video.mp4}
              poster={philosophyContent.video.poster}
              label={philosophyContent.video.label}
            />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
