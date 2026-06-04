'use client';
/* Curriculum Roadmap — Act IV, Section 11 of 22 — THE SPINE
 * Cinema mode: pinned 500vh (longest on the page). Header takes the first
 * viewport; the 8-semester highway then pans upward through the next four
 * viewports as the user flies down it. CINEMA_SPEC §7.5 / §2.2. */
import { useRef } from 'react';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { Badge } from '@/components/ui/Badge';
import { curriculumContent } from '@/content/curriculum';
import { SemesterCheckpoint } from './components/SemesterCheckpoint';
import { useHighwayFlight } from './hooks/useHighwayFlight';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';

const blockStyle: React.CSSProperties = {
  // Sized to content (NO minHeight, NO flex-center). Earlier this block had
  // `minHeight: 100vh` + `display: flex; alignItems: center`, which centred
  // the header (badge + heading + description) inside a full viewport and
  // pushed the highway down by half a screen — the empty gap between the
  // CURRICULUM ROADMAP heading and the Year 1 / Semester 1 row was that
  // bottom half of the centred-100vh header block. The camera-pan math is
  // recomputed via `invalidateOnRefresh` so the pan distance adapts to the
  // new (shorter) total camera-el height — reveals still fire correctly.
  paddingInline: 'var(--section-padding)',
  paddingTop: 'clamp(5rem, 9vh, 6rem)',
  paddingBottom: 'clamp(2rem, 4vh, 3rem)',
  position: 'relative',
  zIndex: 2,
};

export default function CurriculumRoadmapSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  useHighwayFlight(sectionRef);

  return (
    <SectionWrapper ref={sectionRef} id="curriculum" act={4}>
      <div
        className="curriculum-camera-el"
        style={{
          // Pinned cinema: absolute + inset 0 fills the section's 100vh
          // canvas. Camera-pan translates this wrapper to walk the 8
          // semesters through the pinned viewport. Mobile override in
          // globals.css restores `position: relative` so the highway flows
          // naturally on phones.
          position: 'absolute',
          inset: 0,
          willChange: 'transform, opacity',
        }}
      >
        {/* ── Block 1: Header ── (100vh viewport) */}
        <div className="curriculum-block-header-el" style={blockStyle}>
          <div className="section-container" style={{ width: '100%', textAlign: 'center' }}>
            <div className="curriculum-badge-el" style={{ display: 'inline-block' }}>
              <Badge label={curriculumContent.badge} />
            </div>
            <h2
              className="curriculum-heading-el"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: 'var(--color-text-primary)',
                margin: '1rem 0 0.75rem',
                lineHeight: 1.1,
                willChange: 'transform, opacity',
              }}
            >
              {curriculumContent.heading}
            </h2>
            <p
              className="curriculum-desc-el"
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
              {curriculumContent.description}
            </p>
          </div>
        </div>

        {/* ── Block 2: Highway ── (~400vh worth of checkpoints) */}
        <div
          className="highway-el"
          style={{
            position: 'relative',
            zIndex: 3,
            paddingTop: 'clamp(2rem, 4vh, 3rem)',
            paddingBottom: 'clamp(4rem, 8vh, 6rem)',
            paddingInline: 'var(--section-padding)',
          }}
        >
          <div className="section-container" style={{ position: 'relative' }}>
            {isDesktop ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2px 1fr', gap: '0 3rem' }}>
                {/* Left column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem', alignItems: 'flex-end' }}>
                  {curriculumContent.semesters.filter((_, i) => i % 2 === 0).map((sem) => (
                    <SemesterCheckpoint key={sem.id} semester={sem} isYearStart={sem.number % 2 === 1} />
                  ))}
                </div>
                {/* Centre beam line */}
                <div style={{ position: 'relative' }}>
                  <div
                    className="highway-beam-line"
                    style={{
                      position: 'absolute', top: 0, left: '50%',
                      transform: 'translateX(-50%) scaleY(0)', transformOrigin: 'top center',
                      width: '2px', height: '100%',
                      background: 'linear-gradient(to bottom, var(--color-beam) 0%, var(--color-blue-team) 50%, var(--color-terminal) 100%)',
                      boxShadow: '0 0 12px var(--color-beam-glow)',
                    }}
                    aria-hidden="true"
                  />
                </div>
                {/* Right column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
                  {curriculumContent.semesters.filter((_, i) => i % 2 === 1).map((sem) => (
                    <SemesterCheckpoint key={sem.id} semester={sem} isYearStart={false} />
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ position: 'relative', paddingLeft: '1.5rem', borderLeft: '2px solid rgba(168,240,255,0.2)' }}>
                <div
                  className="highway-beam-line"
                  style={{
                    position: 'absolute', top: 0, left: '-1px',
                    width: '2px', height: '100%',
                    transform: 'scaleY(0)', transformOrigin: 'top center',
                    background: 'linear-gradient(to bottom, var(--color-beam) 0%, var(--color-blue-team) 50%, var(--color-terminal) 100%)',
                    boxShadow: '0 0 8px var(--color-beam-glow)',
                  }}
                  aria-hidden="true"
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                  {curriculumContent.semesters.map((sem) => (
                    <SemesterCheckpoint key={sem.id} semester={sem} isYearStart={sem.number % 2 === 1} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom glow pool — outside camera so it stays put */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '200px',
          background: 'radial-gradient(ellipse, rgba(0,255,148,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
    </SectionWrapper>
  );
}
