'use client';
/* Research Wing — Act III, Section 7 of 22
 * Cinema mode: pinned 450vh. Three 100vh blocks (heading → workstation → house)
 * pan upward through the viewport as the user scrolls. CINEMA_SPEC §2.2. */
import { useRef } from 'react';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { researchWingContent } from '@/content/research-wing';
import { WorkstationFrame } from './components/WorkstationFrame';
import { HackerHouse } from './components/HackerHouse';
import { useHouseDissolve } from './hooks/useHouseDissolve';

const blockStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  paddingInline: 'var(--section-padding)',
  paddingTop: 'clamp(5rem, 9vh, 6rem)',
  paddingBottom: 'clamp(2rem, 4vh, 3rem)',
  position: 'relative',
  zIndex: 2,
};

export default function ResearchWingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useHouseDissolve(sectionRef);

  return (
    <SectionWrapper ref={sectionRef} id="research-wing" act={3}>
      <div
        className="rw-camera-el"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          willChange: 'transform',
        }}
      >
        {/* ── Block 1: Heading ── */}
        <div className="rw-block-heading-el" style={blockStyle}>
          <div className="section-container" style={{ width: '100%' }}>
            <h2
              className="rw-heading-el"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 3vw, 2.75rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: 'var(--color-text-primary)',
                margin: 0,
                maxWidth: '900px',
                lineHeight: 1.1,
                willChange: 'transform, opacity',
              }}
            >
              {researchWingContent.heading}
            </h2>
          </div>
        </div>

        {/* ── Block 2: Workstation ── */}
        <div className="rw-block-workstation-el" style={{ ...blockStyle, willChange: 'opacity' }}>
          <div className="section-container" style={{ width: '100%' }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'clamp(1.5rem, 4vw, 3rem)',
                alignItems: 'center',
              }}
            >
              {/* Left: text */}
              <div style={{ flex: '1 1 320px', minWidth: 0 }}>
                <h3
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-terminal)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    marginBottom: '0.75rem',
                  }}
                >
                  // {researchWingContent.workstation.heading}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-base)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.6,
                  }}
                >
                  {researchWingContent.workstation.description}
                </p>
              </div>

              {/* Right: workstation terminal */}
              <div style={{ flex: '1 1 380px', minWidth: 0 }}>
                <WorkstationFrame
                  data={researchWingContent.workstation}
                  streamingLines={researchWingContent.streamingLines}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Block 3: Hacker House ── */}
        <div className="rw-block-house-el" style={{ ...blockStyle, willChange: 'opacity' }}>
          <div className="section-container" style={{ width: '100%' }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'clamp(1.5rem, 4vw, 3rem)',
                alignItems: 'center',
              }}
            >
              {/* Left: Hacker House shield */}
              <div style={{ flex: '0 0 280px', display: 'flex', justifyContent: 'center' }}>
                <HackerHouse />
              </div>

              {/* Right: description */}
              <div style={{ flex: '1 1 320px', minWidth: 0 }}>
                <h3
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-red-team)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    marginBottom: '0.75rem',
                  }}
                >
                  // {researchWingContent.hackerHouse.heading}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-base)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.6,
                  }}
                >
                  {researchWingContent.hackerHouse.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
