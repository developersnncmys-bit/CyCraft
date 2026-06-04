'use client';
/* Tracks — Act III, Section 6 of 22 — THE permanent red/blue split.
 * After this section, beams are red+blue for the rest of the page.
 * Cinema mode: pinned 400vh. CINEMA_SPEC §7.4. */
import { useRef } from 'react';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { tracksContent } from '@/content/tracks';
import { BeamSplit } from './components/BeamSplit';
import { TrackCard } from './components/TrackCard';
import { useTracksTimeline } from './hooks/useTracksTimeline';

export default function TracksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useTracksTimeline(sectionRef);

  return (
    <SectionWrapper ref={sectionRef} id="tracks" act={3}>
      <div
        className="tracks-camera-el"
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        {/* ── Background: left red tint / right blue tint — scrubbed in during
            split. Kept INSIDE camera-el so it hides with the rest of the
            section on pin release (no ghosting into the gap below). ── */}
        <div
          className="tracks-bg-tint-el"
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            background:
              'linear-gradient(to right, rgba(255,61,90,0.04) 0%, transparent 50%, rgba(61,168,255,0.04) 100%)',
            pointerEvents: 'none',
            opacity: 0,
            willChange: 'opacity',
          }}
        />

        {/* ── Beam split animation — also inside camera-el so the red/blue
            beams don't persist past the pin and ghost over the next section. ── */}
        <BeamSplit />

        {/* ── Header ── */}
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
              className="tracks-heading-el"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: 'var(--color-text-primary)',
                margin: '0 0 0.5rem',
                lineHeight: 1.1,
                willChange: 'transform, opacity',
              }}
            >
              {tracksContent.heading}
            </h2>
            <p
              className="tracks-desc-el"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-base)',
                color: 'var(--color-text-secondary)',
                marginBottom: '0',
                lineHeight: 1.55,
                willChange: 'opacity',
              }}
            >
              {tracksContent.description}
            </p>
          </div>
        </div>

        {/* ── Track cards grid ── */}
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
              gap: '1rem',
            }}
          >
            {tracksContent.tracks.map((track, i) => (
              <TrackCard
                key={track.id}
                title={track.title}
                description={track.description}
                icon={track.icon}
                team={track.team}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
