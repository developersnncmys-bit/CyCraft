'use client';
/* Learning Evolution — Act IV, Section 12 of 22.
 * Film-mode: pinned ~280vh. Mirrors curriculum-roadmap exactly — phases are
 * shown two at a time, side-by-side around a central beam. Two beats:
 *   Beat 1: Phase 01 (left) ║ Phase 02 (right)
 *   Beat 2: Phase 03 (left) ║ Phase 04 (right)
 * Cross-fade between beats (out of beat N completes before in of beat N+1). */
import { useRef } from 'react';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { learningEvolutionContent } from '@/content/learning-evolution';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { useFilmReveal } from '@/lib/gsap/filmReveal';

const PHASE_COLORS = [
  'var(--color-beam)',
  'var(--color-red-team)',
  'var(--color-blue-team)',
  'var(--color-terminal)',
] as const;

// Group phases into pairs (1+2, 3+4).
const PHASE_PAIRS = (() => {
  const phases = learningEvolutionContent.phases;
  return [
    [phases[0], phases[1]],
    [phases[2], phases[3]],
  ] as const;
})();

// Sequenced cross-fade for the 2 pair-beats.
const PAIR_AT = [0.18, 0.58] as const;
const PAIR_OUT = [0.50, null] as const;
const FADE_DUR = '0.07';

type Phase = (typeof learningEvolutionContent.phases)[number];

function PhaseCheckpoint({ phase, index, align }: { phase: Phase; index: number; align: 'left' | 'right' }) {
  const color = PHASE_COLORS[index % PHASE_COLORS.length];
  return (
    <div style={{ textAlign: align, maxWidth: '380px', width: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '0.5rem',
          flexDirection: align === 'right' ? 'row-reverse' : 'row',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: color,
            boxShadow: `0 0 8px ${color}`,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-sm)',
            color,
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          Phase {phase.number} · Sem {phase.semesters}
        </span>
      </div>

      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.5rem, 2.6vw, 2.1rem)',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          letterSpacing: '-0.02em',
          textTransform: 'uppercase',
          lineHeight: 1.1,
          marginBottom: '0.6rem',
        }}
      >
        {phase.title}
      </div>

      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-base)',
          color: 'var(--color-text-secondary)',
          margin: 0,
          lineHeight: 1.55,
        }}
      >
        {phase.description}
      </p>
    </div>
  );
}

export default function LearningEvolutionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  useFilmReveal(sectionRef, { pin: '+=280%' });

  return (
    <SectionWrapper ref={sectionRef} id="learning-evolution" act={4}>
      <div
        className="film-bg-deep"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-10%',
          zIndex: 0,
          background:
            'radial-gradient(ellipse at 30% 50%, rgba(140,80,255,0.10), transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(0,255,148,0.06), transparent 55%)',
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
            'repeating-linear-gradient(135deg, transparent, transparent 7px, rgba(168,240,255,0.02) 7px, rgba(168,240,255,0.02) 8px)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="film-camera le-camera-el"
        style={{
          position: 'absolute',
          inset: 0,
          willChange: 'transform',
          overflow: 'hidden',
          paddingTop: 'clamp(5rem, 8.5vh, 6rem)',
          paddingInline: 'var(--section-padding)',
          paddingBottom: 'clamp(1.5rem, 3vh, 2.5rem)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div className="section-container" style={{ textAlign: 'center', marginBottom: 'clamp(1.5rem, 3vh, 2rem)' }}>
          <h2
            className="film-fade le-heading-el"
            data-at="0.05"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: 'var(--color-text-primary)',
              margin: '0 0 0.75rem',
              lineHeight: 1.1,
            }}
          >
            Learning Evolution
          </h2>
          <p
            className="film-fade le-desc-el"
            data-at="0.10"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-secondary)',
              maxWidth: '560px',
              margin: '0 auto',
              lineHeight: 1.5,
            }}
          >
            {learningEvolutionContent.description}
          </p>
        </div>

        {/* Pair stage — 2 pairs cross-fade in the same area below the header */}
        <div
          className="section-container"
          style={{
            position: 'relative',
            flex: 1,
            minHeight: 0,
            width: '100%',
            maxWidth: '1100px',
            margin: '0 auto',
          }}
        >
          {PHASE_PAIRS.map((pair, pairIdx) => {
            const at = PAIR_AT[pairIdx];
            const out = PAIR_OUT[pairIdx];
            const leftIdx = pairIdx * 2;
            const rightIdx = leftIdx + 1;
            const dataAttrs: Record<string, string> = {
              'data-at': String(at),
              'data-dur': FADE_DUR,
            };
            if (out !== null) {
              dataAttrs['data-out-at'] = String(out);
              dataAttrs['data-out-dur'] = FADE_DUR;
            }

            return (
              <div
                key={`pair-${pairIdx}`}
                className="film-fade"
                {...dataAttrs}
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                {isDesktop ? (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 2px 1fr',
                      gap: '0 3rem',
                      alignItems: 'stretch',
                    }}
                  >
                    {/* Left phase */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                      <PhaseCheckpoint phase={pair[0]} index={leftIdx} align="right" />
                    </div>

                    {/* Center beam line */}
                    <div style={{ position: 'relative', alignSelf: 'stretch' }}>
                      <div
                        aria-hidden="true"
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '2px',
                          height: '100%',
                          background: `linear-gradient(to bottom, ${PHASE_COLORS[leftIdx]} 0%, ${PHASE_COLORS[rightIdx]} 100%)`,
                          boxShadow: `0 0 10px ${PHASE_COLORS[leftIdx]}80`,
                          opacity: 0.85,
                        }}
                      />
                    </div>

                    {/* Right phase */}
                    <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                      <PhaseCheckpoint phase={pair[1]} index={rightIdx} align="left" />
                    </div>
                  </div>
                ) : (
                  /* Mobile: stacked, beam on left edge */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingLeft: '1.5rem', borderLeft: '2px solid rgba(168,240,255,0.2)' }}>
                    <PhaseCheckpoint phase={pair[0]} index={leftIdx} align="left" />
                    <PhaseCheckpoint phase={pair[1]} index={rightIdx} align="left" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
