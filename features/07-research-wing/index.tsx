'use client';
/* Research Wing — Act III, Section 7 of 22.
 * Film-mode: pinned ~250vh. Heading stays. Below it, two beats cross-fade:
 *   progress 0.10 → 0.45  "Your Weapon of Choice" (workstation)
 *   progress 0.55 → 1.00  "The Red Team Hacker House"
 * Both beats fill the same area via absolute positioning so the swap reads
 * as a scene change. Uses `data-out-at` to drive Beat-1 fade-out. */
import { useRef } from 'react';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { researchWingContent } from '@/content/research-wing';
import { WorkstationFrame } from './components/WorkstationFrame';
import { HackerHouse } from './components/HackerHouse';
import { useFilmReveal } from '@/lib/gsap/filmReveal';

export default function ResearchWingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useFilmReveal(sectionRef, { pin: '+=250%' });

  return (
    <SectionWrapper ref={sectionRef} id="research-wing" act={3}>
      <div
        className="film-bg-deep"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-10%',
          zIndex: 0,
          background:
            'radial-gradient(ellipse at 30% 30%, rgba(0,255,148,0.06), transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(255,61,90,0.05), transparent 60%)',
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
            'repeating-linear-gradient(135deg, transparent, transparent 6px, rgba(168,240,255,0.02) 6px, rgba(168,240,255,0.02) 7px)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="film-camera rw-camera-el"
        style={{
          position: 'absolute',
          inset: 0,
          willChange: 'transform',
          paddingTop: 'clamp(5rem, 9vh, 6.5rem)',
          paddingInline: 'var(--section-padding)',
          paddingBottom: 'clamp(1rem, 2.5vh, 2rem)',
          overflow: 'hidden',
        }}
      >
        {/* Shared heading — stays composed for the full pin */}
        <h2
          className="film-fade rw-heading-el"
          data-at="0.04"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.4rem, 2.6vw, 2.25rem)',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            textTransform: 'uppercase',
            color: 'var(--color-text-primary)',
            margin: '0 auto clamp(1.5rem, 3vh, 2.5rem)',
            maxWidth: '900px',
            lineHeight: 1.15,
            textAlign: 'center',
          }}
        >
          {researchWingContent.heading}
        </h2>

        {/* Beat stage — both beats absolute-positioned in the same area
            below the heading, cross-fading via film-fade with data-out-at. */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            // Reserve enough height for whichever beat is tallest, but cap
            // so we stay within 100vh.
            height: 'clamp(360px, 58vh, 560px)',
          }}
        >
          {/* Beat 1: Workstation — visible progress 0.10 → 0.45 */}
          <div
            className="film-fade rw-block-workstation-el"
            data-at="0.10"
            data-dur="0.10"
            data-out-at="0.40"
            data-out-dur="0.10"
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'clamp(1.5rem, 4vw, 3rem)',
              alignItems: 'center',
            }}
          >
            <div className="rw-col" style={{ flex: '1 1 320px', minWidth: 0 }}>
              <h3
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-terminal)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  margin: '0 0 0.75rem',
                }}
              >
                {`// ${researchWingContent.workstation.heading}`}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                {researchWingContent.workstation.description}
              </p>
            </div>
            <div className="rw-col film-image-zoom" style={{ flex: '1 1 380px', minWidth: 0 }}>
              <WorkstationFrame
                data={researchWingContent.workstation}
                streamingLines={researchWingContent.streamingLines}
              />
            </div>
          </div>

          {/* Beat 2: Hacker House — visible progress 0.55 → end */}
          <div
            className="film-fade rw-block-house-el"
            data-at="0.55"
            data-dur="0.10"
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'clamp(1.5rem, 4vw, 3rem)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div className="rw-col rw-shield film-image-zoom" style={{ flex: '0 0 280px', display: 'flex', justifyContent: 'center' }}>
              <HackerHouse />
            </div>
            <div className="rw-col" style={{ flex: '1 1 320px', minWidth: 0, maxWidth: '480px' }}>
              <h3
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-red-team)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  margin: '0 0 0.75rem',
                }}
              >
                {`// ${researchWingContent.hackerHouse.heading}`}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                {researchWingContent.hackerHouse.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
