'use client';
/* Learning Evolution — Act IV, Section 12 of 22
 * Cinema mode: pinned 250vh. 4 phase nodes pan upward through viewport
 * with the central beam tracking the scroll. CINEMA_SPEC §2.2. */
import { useRef } from 'react';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { learningEvolutionContent } from '@/content/learning-evolution';
import { PhaseNode } from './components/PhaseNode';
import { useTimelineProgress } from './hooks/useTimelineProgress';

export default function LearningEvolutionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useTimelineProgress(sectionRef);

  return (
    <SectionWrapper ref={sectionRef} id="learning-evolution" act={4}>
      <div
        className="le-camera-el"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          willChange: 'transform, opacity',
        }}
      >
        <div
          style={{
            position: 'relative',
            zIndex: 3,
            paddingTop: 'clamp(5rem, 9vh, 6rem)',
            paddingBottom: 'clamp(3rem, 6vh, 5rem)',
            paddingInline: 'var(--section-padding)',
          }}
        >
          {/* Header */}
          <div className="section-container" style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 4vh, 3rem)' }}>
            <h2
              className="le-heading-el"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: 'var(--color-text-primary)',
                margin: '0 0 0.75rem',
                lineHeight: 1.1,
                willChange: 'transform, opacity',
              }}
            >
              {learningEvolutionContent.heading}
            </h2>
            <p
              className="le-desc-el"
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
              {learningEvolutionContent.description}
            </p>
          </div>

          {/* Phase nodes with central beam */}
          <div
            className="section-container"
            style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}
          >
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '1px',
                height: '100%',
                background: 'rgba(168,240,255,0.08)',
                pointerEvents: 'none',
              }}
            />
            <div
              className="evolution-beam-el"
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%) scaleY(0)',
                transformOrigin: 'top center',
                width: '2px',
                height: '100%',
                background: 'linear-gradient(to bottom, var(--color-beam), var(--color-terminal))',
                boxShadow: '0 0 8px var(--color-beam-glow)',
                pointerEvents: 'none',
              }}
            />

            {learningEvolutionContent.phases.map((phase, i) => (
              <PhaseNode
                key={phase.id}
                number={phase.number}
                title={phase.title}
                description={phase.description}
                semesters={phase.semesters}
                index={i}
                isLast={i === learningEvolutionContent.phases.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
