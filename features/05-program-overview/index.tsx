'use client';
/* Program Overview — Act II, Section 5 of 22.
 * Film-mode: pinned ~220vh. Header + terminal + 4 detail cards stagger in. */
import { useRef, useState, useCallback } from 'react';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { Badge } from '@/components/ui/Badge';
import { programOverviewContent } from '@/content/program-overview';
import { TerminalWindow } from './components/TerminalWindow';
import { ProgramDetailCard } from './components/ProgramDetailCard';
import { useFilmReveal } from '@/lib/gsap/filmReveal';

export default function ProgramOverviewSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [bootComplete, setBootComplete] = useState(false);
  const handleBootComplete = useCallback(() => setBootComplete(true), []);
  // Terminal boot starts immediately on mount in film-mode (the existing
  // scroll-gated boot was tied to the old useTerminalBoot hook).
  void bootComplete;

  useFilmReveal(sectionRef, { pin: '+=220%' });

  return (
    <SectionWrapper ref={sectionRef} id="program-overview" act={2}>
      <div
        className="film-bg-deep"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-10%',
          zIndex: 0,
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(0,255,148,0.06), transparent 65%), radial-gradient(ellipse at 80% 20%, rgba(168,240,255,0.05), transparent 55%)',
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
            'repeating-linear-gradient(0deg, transparent, transparent 5px, rgba(0,255,148,0.018) 5px, rgba(0,255,148,0.018) 6px)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="film-camera po-camera-el"
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
            zIndex: 2,
            padding: 'clamp(5rem, 9vh, 6rem) var(--section-padding) clamp(1.5rem, 3vh, 2.5rem)',
          }}
        >
          <div className="section-container">
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 'clamp(0.75rem, 1.5vh, 1.25rem)' }}>
              <h2
                className="film-fade po-heading-el"
                data-at="0.05"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-primary)',
                  marginBottom: '0.5rem',
                  lineHeight: 1.1,
                }}
              >
                {programOverviewContent.heading}
              </h2>
              <div className="film-fade po-badge-el" data-at="0.10" style={{ display: 'inline-block' }}>
                <Badge label="4-YEAR PROGRAM" />
              </div>
            </div>

            {/* Terminal — fades in with image-zoom feel */}
            <div className="film-fade po-terminal-el" data-at="0.20" data-dur="0.20" style={{ willChange: 'transform, opacity' }}>
              <TerminalWindow
                prompt={programOverviewContent.terminal.prompt}
                lines={programOverviewContent.terminal.lines}
                onComplete={handleBootComplete}
                start
              />
            </div>

            {/* Detail cards — staggered */}
            <div
              className="po-details-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '0.75rem',
                marginTop: 'clamp(0.75rem, 1.5vh, 1.25rem)',
                maxWidth: '680px',
                marginInline: 'auto',
              }}
              role="list"
              aria-label="Program details"
            >
              {programOverviewContent.details.map((detail, i) => (
                <div key={detail.label} role="listitem" className="film-fade" data-at={`${0.55 + i * 0.06}`}>
                  <ProgramDetailCard label={detail.label} value={detail.value} index={i} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '300px',
          background: 'radial-gradient(ellipse, rgba(0,255,148,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
    </SectionWrapper>
  );
}
