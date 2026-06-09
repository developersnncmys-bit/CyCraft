'use client';
/* Learning Evolution — Act IV, Section 12 of 22.
 * Film-mode: pinned ~230vh. New design — horizontal 4-phase roadmap.
 *   ●─────●─────●─────●         (beam connects 4 colored milestone dots)
 *   01    02    03    04        (big phase numbers)
 *   THE   OFF.  HW &  HIGH      (titles)
 *   FND.  CORE  WEB3  ORBIT
 *
 * All 4 phases visible at once — replaces the previous 2-pair cross-fade.
 * Reveal cascade: beam draws left → right, then each phase card fades up
 * in sequence. Pin shortened from 360% to 230% because there's no longer
 * any cross-fade window to absorb. */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { learningEvolutionContent } from '@/content/learning-evolution';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { useFilmReveal } from '@/lib/gsap/filmReveal';
import { gsap } from '@/lib/gsap/register';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

const PHASE_COLORS = [
  'var(--color-beam)',
  'var(--color-red-team)',
  'var(--color-blue-team)',
  'var(--color-terminal)',
] as const;

export default function LearningEvolutionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const reducedMotion = useReducedMotion();
  useFilmReveal(sectionRef, { pin: '+=230%' });

  useGSAP(
    () => {
      const container = sectionRef.current;
      if (!container) return;
      const beamLine = container.querySelector<HTMLElement>('.le-roadmap-beam');
      const dots = container.querySelectorAll<HTMLElement>('.le-roadmap-dot');
      const cards = container.querySelectorAll<HTMLElement>('.le-roadmap-card');

      if (reducedMotion) {
        if (beamLine) gsap.set(beamLine, { scaleX: 1 });
        gsap.set(dots, { scale: 1, opacity: 1 });
        gsap.set(cards, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(beamLine, { scaleX: 0, transformOrigin: 'left center' });
      gsap.set(dots, { scale: 0, opacity: 0 });
      gsap.set(cards, { opacity: 0, y: 30 });

      if (!isDesktop) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: 'top 75%',
            toggleActions: 'play none none reset',
          },
        });
        if (beamLine) tl.to(beamLine, { scaleX: 1, duration: 1, ease: 'power2.inOut' }, 0);
        tl.to(dots, { scale: 1, opacity: 1, duration: 0.4, stagger: 0.18, ease: 'back.out(1.6)' }, 0.2);
        tl.to(cards, { opacity: 1, y: 0, duration: 0.6, stagger: 0.18, ease: 'power3.out' }, 0.4);
        return;
      }

      // Desktop — non-scrub triggered timeline so it plays cleanly on entry
      // without fighting useFilmReveal's pinned scrub.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top 65%',
          toggleActions: 'play none none reset',
        },
      });
      if (beamLine) tl.to(beamLine, { scaleX: 1, duration: 1.2, ease: 'power2.inOut' }, 0);
      tl.to(dots, { scale: 1, opacity: 1, duration: 0.5, stagger: 0.22, ease: 'back.out(1.8)' }, 0.25);
      tl.to(cards, { opacity: 1, y: 0, duration: 0.7, stagger: 0.22, ease: 'power3.out' }, 0.45);
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  const phases = learningEvolutionContent.phases;

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
          position: isDesktop ? 'absolute' : 'relative',
          inset: isDesktop ? 0 : undefined,
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
        <div className="section-container" style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 5vh, 4rem)' }}>
          <h2
            className="film-fade le-heading-el"
            data-start-visible="true"
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
            data-start-visible="true"
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

        {/* Roadmap — beam + 4 milestone columns */}
        <div
          className="section-container le-roadmap-stage"
          style={{
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {isDesktop ? (
            <div style={{ position: 'relative', width: '100%' }}>
              {/* Horizontal beam — runs through the centre of the dot row.
                  Positioned at roughly the same vertical centre as the dots
                  via a single grid row above the cards. */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${phases.length}, 1fr)`,
                  position: 'relative',
                  alignItems: 'center',
                  marginBottom: 'clamp(1.5rem, 3vh, 2.25rem)',
                }}
              >
                {/* Beam line — sits behind the dots */}
                <div
                  className="le-roadmap-beam"
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '6%',
                    right: '6%',
                    height: '2px',
                    transform: 'translateY(-50%)',
                    background: `linear-gradient(to right, ${PHASE_COLORS[0]} 0%, ${PHASE_COLORS[1]} 33%, ${PHASE_COLORS[2]} 66%, ${PHASE_COLORS[3]} 100%)`,
                    boxShadow: `0 0 12px ${PHASE_COLORS[0]}80`,
                    willChange: 'transform',
                  }}
                />
                {phases.map((phase, i) => {
                  const color = PHASE_COLORS[i % PHASE_COLORS.length];
                  return (
                    <div
                      key={`dot-${phase.id}`}
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        position: 'relative',
                        zIndex: 1,
                      }}
                    >
                      <div
                        className="le-roadmap-dot"
                        aria-hidden="true"
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          background: color,
                          boxShadow: `0 0 18px ${color}, 0 0 36px ${color}40`,
                          border: '3px solid var(--color-void)',
                          willChange: 'transform, opacity',
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Cards row — one per phase */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${phases.length}, 1fr)`,
                  gap: 'clamp(1rem, 2vw, 1.75rem)',
                }}
              >
                {phases.map((phase, i) => {
                  const color = PHASE_COLORS[i % PHASE_COLORS.length];
                  return (
                    <div
                      key={`card-${phase.id}`}
                      className="le-roadmap-card"
                      style={{
                        textAlign: 'center',
                        padding: 'clamp(1rem, 1.5vw, 1.5rem) clamp(0.75rem, 1.25vw, 1.25rem)',
                        border: `1px solid ${color}33`,
                        background: 'rgba(13, 16, 20, 0.45)',
                        backdropFilter: 'blur(6px)',
                        willChange: 'transform, opacity',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 'var(--text-xs)',
                          letterSpacing: '0.22em',
                          color,
                          textTransform: 'uppercase',
                          marginBottom: '0.25rem',
                        }}
                      >
                        Phase {phase.number}
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.7rem',
                          letterSpacing: '0.18em',
                          color: 'var(--color-text-tertiary)',
                          textTransform: 'uppercase',
                          marginBottom: '0.6rem',
                        }}
                      >
                        Sem {phase.semesters}
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 'clamp(2.5rem, 4.5vw, 3.5rem)',
                          fontWeight: 700,
                          color,
                          letterSpacing: '-0.04em',
                          lineHeight: 1,
                          opacity: 0.85,
                          marginBottom: '0.5rem',
                        }}
                      >
                        {phase.number}
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 'clamp(1rem, 1.4vw, 1.25rem)',
                          fontWeight: 700,
                          color: 'var(--color-text-primary)',
                          letterSpacing: '-0.01em',
                          textTransform: 'uppercase',
                          lineHeight: 1.1,
                          marginBottom: '0.65rem',
                        }}
                      >
                        {phase.title}
                      </div>
                      <p
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.825rem',
                          color: 'var(--color-text-secondary)',
                          margin: 0,
                          lineHeight: 1.5,
                        }}
                      >
                        {phase.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Mobile — vertical stack, dot on left of each card */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {phases.map((phase, i) => {
                const color = PHASE_COLORS[i % PHASE_COLORS.length];
                const isLast = i === phases.length - 1;
                return (
                  <div
                    key={`mobile-${phase.id}`}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '44px 1fr',
                      gap: '1rem',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div
                        className="le-roadmap-dot"
                        aria-hidden="true"
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: color,
                          boxShadow: `0 0 14px ${color}, 0 0 28px ${color}40`,
                          marginTop: '4px',
                        }}
                      />
                      {!isLast && (
                        <div
                          aria-hidden="true"
                          style={{
                            flex: 1,
                            width: '2px',
                            background: `linear-gradient(to bottom, ${color}, ${PHASE_COLORS[(i + 1) % PHASE_COLORS.length]})`,
                            marginTop: '6px',
                            minHeight: '2rem',
                          }}
                        />
                      )}
                    </div>
                    <div
                      className="le-roadmap-card"
                      style={{
                        padding: '1rem 1.1rem',
                        border: `1px solid ${color}33`,
                        background: 'rgba(13, 16, 20, 0.5)',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 'var(--text-xs)',
                          letterSpacing: '0.2em',
                          color,
                          textTransform: 'uppercase',
                          marginBottom: '0.35rem',
                        }}
                      >
                        Phase {phase.number} · Sem {phase.semesters}
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 'clamp(1.25rem, 5vw, 1.75rem)',
                          fontWeight: 700,
                          color: 'var(--color-text-primary)',
                          letterSpacing: '-0.02em',
                          textTransform: 'uppercase',
                          lineHeight: 1.1,
                          marginBottom: '0.5rem',
                        }}
                      >
                        {phase.title}
                      </div>
                      <p
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--text-sm)',
                          color: 'var(--color-text-secondary)',
                          margin: 0,
                          lineHeight: 1.55,
                        }}
                      >
                        {phase.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}
