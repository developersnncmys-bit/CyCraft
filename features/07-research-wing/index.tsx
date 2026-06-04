'use client';
/* Research Wing — Act III, Section 7 of 22
 * Cinema mode: pinned. Two 100vh blocks (heading+workstation → house) pan
 * upward through the viewport as the user scrolls. CINEMA_SPEC §2.2. */
import { useRef } from 'react';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { researchWingContent } from '@/content/research-wing';
import { WorkstationFrame } from './components/WorkstationFrame';
import { HackerHouse } from './components/HackerHouse';
import { useHouseDissolve } from './hooks/useHouseDissolve';

const blockStyle: React.CSSProperties = {
  // 100vh kept (camera-pan math relies on it). Content flows from the top
  // after paddingTop. Padding tightened so the heading + terminal + feature
  // list fit within the pinned 100vh (previously the last terminal line + last
  // feature item got clipped by overflow:hidden).
  minHeight: '100vh',
  paddingInline: 'var(--section-padding)',
  paddingTop: 'clamp(4rem, 7vh, 5rem)',
  paddingBottom: 'clamp(1rem, 2.5vh, 2rem)',
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
          // Unpinned: camera-el flows in document so its two 100vh blocks
          // (heading+workstation, hacker house) stack naturally and the user
          // scrolls through them. Previously absolute+translate to "pan" — that
          // only worked under scrub.
          position: 'relative',
          willChange: 'opacity',
        }}
      >
        {/* ── Block 1: Heading + Workstation ── */}
        <div className="rw-block-workstation-el" style={{ ...blockStyle, willChange: 'opacity' }}>
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
                margin: '0 0 clamp(1rem, 3vh, 2rem)',
                maxWidth: '900px',
                lineHeight: 1.1,
                willChange: 'transform, opacity',
              }}
            >
              {researchWingContent.heading}
            </h2>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'clamp(1.5rem, 4vw, 3rem)',
                alignItems: 'center',
              }}
            >
              {/* Left: text */}
              <div className="rw-col" style={{ flex: '1 1 320px', minWidth: 0 }}>
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
                  {`// ${researchWingContent.workstation.heading}`}
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
              <div className="rw-col" style={{ flex: '1 1 380px', minWidth: 0 }}>
                <WorkstationFrame
                  data={researchWingContent.workstation}
                  streamingLines={researchWingContent.streamingLines}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Block 2: Hacker House ── */}
        {/* This block has no top heading, just shield + description, so it's
            flex-centred vertically within its 100vh (Block 1 isn't, to keep
            its heading flush with the top). */}
        <div
          className="rw-block-house-el"
          style={{
            ...blockStyle,
            display: 'flex',
            alignItems: 'center',
            willChange: 'opacity',
          }}
        >
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
              <div className="rw-col rw-shield" style={{ flex: '0 0 280px', display: 'flex', justifyContent: 'center' }}>
                <HackerHouse />
              </div>

              {/* Right: description */}
              <div className="rw-col" style={{ flex: '1 1 320px', minWidth: 0 }}>
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
                  {`// ${researchWingContent.hackerHouse.heading}`}
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
