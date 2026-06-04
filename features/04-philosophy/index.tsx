'use client';
/* Philosophy section — Act II, Section 4 of 22
 * Cinema mode: pinned 200vh. Tight, punchy reveal — fractured sentence
 * reassembles word-by-word as the user scrolls. CINEMA_SPEC §2.2. */
import { useRef } from 'react';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { philosophyContent } from '@/content/philosophy';
import { FracturedHeading } from './components/FracturedHeading';
import { TiltedVideo } from './components/TiltedVideo';
import { usePhilosophyReveal } from './hooks/usePhilosophyReveal';

export default function PhilosophySection() {
  const sectionRef = useRef<HTMLElement>(null);
  usePhilosophyReveal(sectionRef);

  return (
    <SectionWrapper ref={sectionRef} id="philosophy" act={2}>
      <div
        className="philosophy-camera-el"
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
          {/* ── Left column ── */}
          <div className="philosophy-col" style={{ flex: '1 1 min(480px, 100%)', minWidth: 0 }}>
            <h2
              className="philosophy-heading-el"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1rem, 1.8vw, 1.5rem)',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-beam)',
                marginBottom: '1rem',
                willChange: 'transform, opacity',
              }}
            >
              {philosophyContent.heading}
            </h2>

            {/* Fractured sentence — "is broken" = literally broken chars */}
            <div style={{ marginBottom: '1rem' }}>
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

            {/* Cyan draw line — visual punctuation after reassembly */}
            <div
              className="philosophy-line-el"
              aria-hidden="true"
              style={{
                height: '1px',
                background: 'linear-gradient(to right, var(--color-beam), transparent)',
                marginBottom: '1rem',
                transformOrigin: 'left',
                willChange: 'transform',
              }}
            />

            <p
              className="philosophy-desc-el"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-base)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6,
                maxWidth: '520px',
                opacity: 0,
                willChange: 'opacity',
              }}
            >
              {philosophyContent.description}
            </p>
          </div>

          {/* ── Right column — tilted video ── */}
          <TiltedVideo
            mp4={philosophyContent.video.mp4}
            poster={philosophyContent.video.poster}
            label={philosophyContent.video.label}
          />
        </div>
      </div>
    </SectionWrapper>
  );
}
