'use client';
/* Program Overview — Act II, Section 5 of 22
 * Cinema mode: pinned 250vh. Header reveals → terminal scales in → typing
 * starts at progress 0.20 → cards materialise via scroll-bound tween at
 * 0.55–0.75 (decoupled from bootComplete so fast scrollers see them). */
import { useRef, useState, useCallback } from 'react';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { Badge } from '@/components/ui/Badge';
import { programOverviewContent } from '@/content/program-overview';
import { TerminalWindow } from './components/TerminalWindow';
import { ProgramDetailCard } from './components/ProgramDetailCard';
import { useTerminalBoot } from './hooks/useTerminalBoot';

export default function ProgramOverviewSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [bootComplete, setBootComplete] = useState(false);

  const handleBootComplete = useCallback(() => setBootComplete(true), []);

  const { terminalStarted } = useTerminalBoot(sectionRef, bootComplete);

  return (
    <SectionWrapper ref={sectionRef} id="program-overview" act={2}>
      <div
        className="po-camera-el"
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
            {/* ── Header ── */}
            <div style={{ textAlign: 'center', marginBottom: 'clamp(0.75rem, 1.5vh, 1.25rem)' }}>
              <h2
                className="po-heading-el"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-primary)',
                  marginBottom: '0.5rem',
                  lineHeight: 1.1,
                  willChange: 'transform, opacity',
                }}
              >
                {programOverviewContent.heading}
              </h2>
              <div className="po-badge-el" style={{ display: 'inline-block' }}>
                <Badge label="4-YEAR PROGRAM" />
              </div>
            </div>

            {/* ── Terminal window ── */}
            <div className="po-terminal-el" style={{ willChange: 'transform, opacity' }}>
              <TerminalWindow
                prompt={programOverviewContent.terminal.prompt}
                lines={programOverviewContent.terminal.lines}
                onComplete={handleBootComplete}
                start={terminalStarted}
              />
            </div>

            {/* ── Detail cards ── aligned to terminal width (680px) for visual cohesion */}
            <div
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
                <div key={detail.label} role="listitem">
                  <ProgramDetailCard label={detail.label} value={detail.value} index={i} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Glow pool beneath terminal */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '300px',
          background: 'radial-gradient(ellipse, rgba(0,255,148,0.03) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
    </SectionWrapper>
  );
}
