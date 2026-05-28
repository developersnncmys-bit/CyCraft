'use client';
/* Achievements section — Act I, Section 2 of 22
 * Cinema mode: pinned 250vh, beam arrives from above, stats ignite one-by-one. */
import { useRef } from 'react';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { GlitchText } from '@/components/core/GlitchText/GlitchText';
import { Badge } from '@/components/ui/Badge';
import { achievementsContent } from '@/content/achievements';
import { StatsConstellation } from './components/StatsConstellation';
import { BeamTracer } from './components/BeamTracer';
import { useStatsReveal } from './hooks/useStatsReveal';

export default function AchievementsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useStatsReveal(sectionRef);

  return (
    <SectionWrapper ref={sectionRef} id="achievements" act={1}>
      {/* Vertical beam tracer — arrives from above during 0.00-0.10 of pinned scroll */}
      <BeamTracer />

      {/* Camera wrapper — scales 1→0.95 during 0.85-1.00 (constellation hold + zoom-out) */}
      <div
        className="achv-camera-el"
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        {/* L3 — text content, top-center */}
        <div
          style={{
            position: 'relative',
            zIndex: 3,
            textAlign: 'center',
            paddingTop: 'clamp(7rem, 13vh, 9rem)',
            paddingInline: 'var(--section-padding)',
          }}
        >
          <div className="section-container">
            <div className="achv-badge-el" style={{ display: 'inline-block' }}>
              <Badge label={achievementsContent.badge} />
            </div>

            <h2
              className="achv-heading-el"
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
              <GlitchText>{achievementsContent.heading}</GlitchText>
            </h2>

            <p
              className="achv-desc-el"
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
              {achievementsContent.description}
            </p>
          </div>
        </div>

        {/* Stats row */}
        <StatsConstellation stats={achievementsContent.stats} />
      </div>

      {/* Glow behind stats row */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '200px',
          background: 'radial-gradient(ellipse, rgba(168,240,255,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
    </SectionWrapper>
  );
}
