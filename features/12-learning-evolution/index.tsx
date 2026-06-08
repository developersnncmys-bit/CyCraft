'use client';
/* Learning Evolution — Act IV, Section 12 of 22.
 * Film-mode: pinned ~360vh. Mirrors the Curriculum Roadmap visual language:
 *   • morphing headline + description up top, composed for the full pin
 *   • below, the 4 phases cross-fade one at a time
 *   • each phase shows the SAME 2-column layout: phase marker (left)
 *     → central beam line with glowing dot → title + description (right)
 *
 * Pin sized so each phase gets ~70vh of composed scroll — matches the
 * curriculum-roadmap cadence so the section reads at the same deliberate
 * pace instead of the previous rushed swap. */
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

// Sequenced cross-fade — out of phase N completes before in of N+1. Same
// cadence as the curriculum-roadmap year sequence.
const PHASE_AT = [0.26, 0.46, 0.66, 0.86] as const;
const PHASE_OUT = [0.40, 0.60, 0.80, null] as const;
const FADE_DUR = '0.06';

export default function LearningEvolutionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  useFilmReveal(sectionRef, { pin: '+=360%' });

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
        {/* Header — single static heading + description, stays composed
            for the full pin. (Previous 3-phrase morph swap was distracting
            since the section already has 4 phase beats below to switch
            through; per-design choice to keep this title fixed.) */}
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
            data-at="0.20"
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

        {/* Phase stage — 4 phases cross-fade in the same area below the header */}
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
          {learningEvolutionContent.phases.map((phase, i) => {
            const at = PHASE_AT[i];
            const out = PHASE_OUT[i];
            const color = PHASE_COLORS[i % PHASE_COLORS.length];
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
                key={phase.id}
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
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 2vh, 1.5rem)' }}>
                    {/* Centered subtitle — matches curriculum-roadmap's
                        "Year N · Phase" line above each year's grid */}
                    <div style={{ textAlign: 'center' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 'var(--text-sm)',
                          letterSpacing: '0.25em',
                          color,
                          textTransform: 'uppercase',
                        }}
                      >
                        Phase {phase.number} · Sem {phase.semesters}
                      </span>
                    </div>

                    {/* 2-column checkpoint grid with central beam — same
                        structure as the curriculum-roadmap year grid */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 2px 1fr',
                        gap: '0 3rem',
                        alignItems: 'stretch',
                      }}
                    >
                      {/* Left checkpoint — phase number + title */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div style={{ textAlign: 'left', maxWidth: '380px' }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.75rem',
                              marginBottom: '0.75rem',
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
                                color: 'var(--color-text-primary)',
                                fontWeight: 700,
                                letterSpacing: '0.05em',
                              }}
                            >
                              {phase.title}
                            </span>
                          </div>
                          <div
                            style={{
                              fontFamily: 'var(--font-display)',
                              fontSize: 'clamp(3rem, 6vw, 5rem)',
                              fontWeight: 700,
                              color,
                              letterSpacing: '-0.04em',
                              lineHeight: 1,
                              opacity: 0.85,
                              paddingLeft: '1.5rem',
                            }}
                          >
                            {phase.number}
                          </div>
                        </div>
                      </div>

                      {/* Center beam line with glowing dot */}
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
                            background: `linear-gradient(to bottom, transparent 0%, ${color} 50%, transparent 100%)`,
                            boxShadow: `0 0 10px ${color}`,
                          }}
                        />
                        <div
                          aria-hidden="true"
                          style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            background: color,
                            boxShadow: `0 0 18px ${color}, 0 0 36px ${color}40`,
                          }}
                        />
                      </div>

                      {/* Right checkpoint — description */}
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ maxWidth: '380px' }}>
                          <div
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: 'var(--text-xs)',
                              letterSpacing: '0.2em',
                              color: 'var(--color-text-tertiary)',
                              textTransform: 'uppercase',
                              marginBottom: '0.6rem',
                            }}
                          >
                            Focus Areas
                          </div>
                          <p
                            style={{
                              fontFamily: 'var(--font-body)',
                              fontSize: 'var(--text-base)',
                              color: 'var(--color-text-secondary)',
                              margin: 0,
                              lineHeight: 1.6,
                            }}
                          >
                            {phase.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Mobile — vertical stack, beam line down the left edge */
                  <div style={{ position: 'relative', paddingLeft: '2rem', borderLeft: `2px solid ${color}66` }}>
                    <div
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '-9px',
                        transform: 'translateY(-50%)',
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        background: color,
                        boxShadow: `0 0 14px ${color}, 0 0 28px ${color}40`,
                      }}
                    />
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 'var(--text-xs)',
                        letterSpacing: '0.2em',
                        color,
                        textTransform: 'uppercase',
                        marginBottom: '0.5rem',
                      }}
                    >
                      PHASE {phase.number} · SEM {phase.semesters}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(1.5rem, 5vw, 2.25rem)',
                        fontWeight: 700,
                        color: 'var(--color-text-primary)',
                        letterSpacing: '-0.02em',
                        textTransform: 'uppercase',
                        lineHeight: 1.1,
                        marginBottom: '0.7rem',
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
                )}
              </div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
