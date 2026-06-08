'use client';
/* Tracks — Act III, Section 6 of 22.
 * Film-mode: pinned ~320vh. Red/blue duality split + 4 track cards. */
import { useRef } from 'react';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { tracksContent } from '@/content/tracks';
import { BeamSplit } from './components/BeamSplit';
import { TrackCard } from './components/TrackCard';
import { useFilmReveal } from '@/lib/gsap/filmReveal';

export default function TracksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useFilmReveal(sectionRef, { pin: '+=320%' });

  return (
    <SectionWrapper ref={sectionRef} id="tracks" act={3}>
      {/* Parallax depth */}
      <div
        className="film-bg-deep"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-10%',
          zIndex: 0,
          background:
            'linear-gradient(to right, rgba(255,61,90,0.10) 0%, transparent 50%, rgba(61,168,255,0.10) 100%)',
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
            'repeating-linear-gradient(0deg, transparent, transparent 5px, rgba(168,240,255,0.02) 5px, rgba(168,240,255,0.02) 6px)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="film-camera tracks-camera-el"
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        <BeamSplit />

        {/* Header */}
        <div
          style={{
            position: 'relative',
            zIndex: 3,
            textAlign: 'center',
            paddingTop: 'clamp(5rem, 9vh, 6rem)',
            paddingInline: 'var(--section-padding)',
          }}
        >
          <div className="section-container">
            <h2
              className="film-fade tracks-heading-el"
              data-at="0.05"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: 'var(--color-text-primary)',
                margin: '0 0 0.5rem',
                lineHeight: 1.1,
              }}
            >
              {tracksContent.heading}
            </h2>
            <p
              className="film-fade tracks-desc-el"
              data-at="0.12"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-base)',
                color: 'var(--color-text-secondary)',
                marginBottom: '0',
                lineHeight: 1.55,
              }}
            >
              {tracksContent.description}
            </p>
          </div>
        </div>

        {/* Track cards grid */}
        <div
          style={{
            position: 'relative',
            zIndex: 3,
            padding: 'clamp(3rem, 8vh, 6rem) var(--section-padding) clamp(1rem, 2vh, 2rem)',
          }}
        >
          <div
            className="section-container tracks-cards-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: '1.25rem',
              maxWidth: '1180px',
              marginInline: 'auto',
            }}
          >
            {tracksContent.tracks.map((track, i) => (
              <div key={track.id} className="film-fade" data-at={`${0.30 + i * 0.10}`} data-dur="0.15">
                <TrackCard
                  title={track.title}
                  description={track.description}
                  icon={track.icon}
                  team={track.team}
                  index={i}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
