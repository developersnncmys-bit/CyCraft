'use client';
/* Assessment Interface Preview — pinned cinematic walk through the exam UI.
 *
 * 350% pin. A static, animated still-frame of the real exam interface
 * (timer + question + four options + nav panel + footer controls). Not a
 * working quiz — the real engine is the LMS portal. The mockup is built
 * out of regular DOM so each piece can ignite in turn on the pinned
 * timeline.
 *
 * Beats (0–1):
 *   0.00–0.10  Badge enters
 *   0.05–0.18  Heading + description reveal
 *   0.22–0.32  Exam frame slides up + ignites
 *   0.30–0.40  Header bar reveals (timer pulses in)
 *   0.38–0.48  Question text fades in
 *   0.46–0.62  Four options stagger in
 *   0.60–0.74  Right-rail nav grid pops in
 *   0.74–0.84  Footer controls reveal
 *   0.84–0.95  Timer pulses once
 *   0.92–1.00  Camera dollies in 4%
 */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { Badge } from '@/components/ui/Badge';
import {
  assessmentInterfaceContent,
  type NavQuestionState,
} from '@/content/assessment/interface';

function navStateStyle(state: NavQuestionState) {
  switch (state) {
    case 'current':
      return {
        background: 'var(--color-beam)',
        color: 'var(--color-void)',
        border: '1px solid var(--color-beam)',
        boxShadow: '0 0 12px rgba(77,217,255,0.55)',
      };
    case 'answered':
      return {
        background: 'rgba(0,255,148,0.12)',
        color: 'var(--color-terminal)',
        border: '1px solid rgba(0,255,148,0.45)',
      };
    case 'flagged':
      return {
        background: 'rgba(255,61,90,0.10)',
        color: 'var(--color-red-team-glow)',
        border: '1px solid rgba(255,61,90,0.45)',
      };
    case 'unanswered':
    default:
      return {
        background: 'rgba(168,240,255,0.04)',
        color: 'var(--color-text-tertiary)',
        border: '1px solid rgba(168,240,255,0.15)',
      };
  }
}

export default function AssessmentInterface() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();
  const isWide = useMediaQuery('(min-width: 900px)');

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const navCells = root.querySelectorAll<HTMLElement>('.assessment-nav-cell');
      const options = root.querySelectorAll<HTMLElement>('.assessment-option');

      const ALL = [
        '.assessment-ui-badge',
        '.assessment-ui-heading',
        '.assessment-ui-desc',
        '.assessment-ui-frame',
        '.assessment-ui-header',
        '.assessment-ui-question',
        '.assessment-ui-nav',
        '.assessment-ui-footer',
        '.assessment-ui-timer',
        '.assessment-option',
        '.assessment-nav-cell',
      ];

      if (reducedMotion) {
        gsap.set(ALL, { opacity: 1, y: 0, scale: 1 });
        return;
      }

      if (!isDesktop) {
        gsap.fromTo(
          '.assessment-ui-badge, .assessment-ui-heading, .assessment-ui-desc',
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: root, start: 'top 78%', toggleActions: 'play none none reset' } as ScrollTrigger.Vars,
          },
        );
        gsap.fromTo(
          '.assessment-ui-frame',
          { opacity: 0, y: 36, scale: 0.96 },
          {
            opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: '.assessment-ui-frame', start: 'top 82%', toggleActions: 'play none none reset' } as ScrollTrigger.Vars,
          },
        );
        return;
      }

      // Desktop pinned ────────────────────────────────────────────────────
      gsap.set(['.assessment-ui-badge', '.assessment-ui-desc'], { opacity: 0, y: 20 });
      gsap.set('.assessment-ui-heading', { opacity: 0, yPercent: 30 });
      gsap.set('.assessment-ui-frame', { opacity: 0, y: 40, scale: 0.96 });
      gsap.set('.assessment-ui-header', { opacity: 0, y: 12 });
      gsap.set('.assessment-ui-question', { opacity: 0, y: 14 });
      gsap.set('.assessment-ui-nav', { opacity: 0, y: 12 });
      gsap.set('.assessment-ui-footer', { opacity: 0, y: 10 });
      gsap.set(options, { opacity: 0, x: -20 });
      gsap.set(navCells, { opacity: 0, scale: 0.7 });
      gsap.set('.assessment-ui-camera', { scale: 1, transformOrigin: 'center center' });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_DURATIONS.assessmentInterface,
        scrub: 1,
        enabled: true,
      });

      tl.to('.assessment-ui-badge', { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0.02);
      tl.to('.assessment-ui-heading', { opacity: 1, yPercent: 0, duration: 0.12, ease: 'power3.out' }, 0.05);
      tl.to('.assessment-ui-desc', { opacity: 1, y: 0, duration: 0.10, ease: 'power2.out' }, 0.13);

      tl.to('.assessment-ui-frame', { opacity: 1, y: 0, scale: 1, duration: 0.18, ease: 'power3.out' }, 0.22);
      tl.to('.assessment-ui-header', { opacity: 1, y: 0, duration: 0.10, ease: 'power2.out' }, 0.30);
      tl.to('.assessment-ui-question', { opacity: 1, y: 0, duration: 0.12, ease: 'power2.out' }, 0.38);
      tl.to(options, { opacity: 1, x: 0, duration: 0.10, stagger: 0.04, ease: 'power2.out' }, 0.46);
      tl.to('.assessment-ui-nav', { opacity: 1, y: 0, duration: 0.10, ease: 'power2.out' }, 0.60);
      tl.to(
        navCells,
        { opacity: 1, scale: 1, duration: 0.07, stagger: 0.012, ease: 'back.out(1.8)' },
        0.62,
      );
      tl.to('.assessment-ui-footer', { opacity: 1, y: 0, duration: 0.10, ease: 'power2.out' }, 0.74);

      // Timer pulse near the end — communicates the "this is timed" beat.
      tl.to(
        '.assessment-ui-timer',
        { scale: 1.08, duration: 0.05, ease: 'sine.inOut' },
        0.85,
      );
      tl.to(
        '.assessment-ui-timer',
        { scale: 1, duration: 0.05, ease: 'sine.inOut' },
        0.90,
      );

      tl.to(
        '.assessment-ui-camera',
        { scale: 1.03, duration: 0.10, ease: 'power2.inOut' },
        0.92,
      );
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="assessment-interface"
      aria-label={assessmentInterfaceContent.heading}
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <div
        className="assessment-ui-camera"
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingInline: 'var(--section-padding)',
          paddingTop: 'clamp(5rem, 10vh, 8rem)',
          paddingBottom: 'clamp(5rem, 10vh, 8rem)',
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        <div
          className="section-container"
          style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 5vh, 3.5rem)' }}
        >
          <div className="assessment-ui-badge" style={{ display: 'inline-block' }}>
            <Badge label={assessmentInterfaceContent.badge} />
          </div>
          <h2
            className="assessment-ui-heading"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3.2vw, 2.75rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              color: 'var(--color-text-primary)',
              margin: '1.5rem 0 1rem',
              lineHeight: 1.1,
            }}
          >
            {assessmentInterfaceContent.heading}
          </h2>
          <p
            className="assessment-ui-desc"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '620px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            {assessmentInterfaceContent.description}
          </p>
        </div>

        {/* ── Exam frame mockup ──────────────────────────────────────────── */}
        <div
          className="section-container"
          style={{ maxWidth: '1100px', marginInline: 'auto' }}
        >
          <div
            className="assessment-ui-frame"
            aria-hidden="true"
            style={{
              position: 'relative',
              background: 'rgba(13,16,20,0.6)',
              border: '1px solid rgba(168,240,255,0.18)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 32px rgba(77,217,255,0.08)',
              overflow: 'hidden',
            }}
          >
            {/* Header bar */}
            <div
              className="assessment-ui-header"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                padding: '1rem 1.25rem',
                background: 'rgba(5,6,8,0.65)',
                borderBottom: '1px solid rgba(168,240,255,0.1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    letterSpacing: '0.18em',
                    color: 'var(--color-text-tertiary)',
                    textTransform: 'uppercase',
                  }}
                >
                  {assessmentInterfaceContent.examName}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--color-beam)',
                  }}
                >
                  · {assessmentInterfaceContent.questionNumber}
                </span>
              </div>
              <div
                className="assessment-ui-timer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  padding: '0.45rem 0.9rem',
                  background: 'rgba(255,61,90,0.10)',
                  border: '1px solid rgba(255,61,90,0.4)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'var(--color-red-team-glow)',
                  letterSpacing: '0.08em',
                  willChange: 'transform',
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--color-red-team)',
                    boxShadow: '0 0 8px rgba(255,61,90,0.6)',
                    animation: 'cursor-blink 1s ease-in-out infinite',
                  }}
                />
                {assessmentInterfaceContent.timer}
              </div>
            </div>

            {/* Progress strip */}
            <div
              aria-hidden="true"
              style={{
                height: '3px',
                background: 'rgba(168,240,255,0.08)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: `${assessmentInterfaceContent.progressPercent}%`,
                  background: 'var(--color-beam)',
                  boxShadow: '0 0 12px var(--color-beam-glow)',
                }}
              />
            </div>

            {/* Body: question + options + nav */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isWide ? 'minmax(0, 1fr) 220px' : '1fr',
                gap: 0,
              }}
            >
              {/* Left — question + options */}
              <div
                style={{
                  padding: 'clamp(1.5rem, 3vw, 2.25rem)',
                  borderRight: isWide ? '1px solid rgba(168,240,255,0.1)' : 'none',
                  borderBottom: isWide ? 'none' : '1px solid rgba(168,240,255,0.1)',
                }}
              >
                <h3
                  className="assessment-ui-question"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    letterSpacing: '-0.01em',
                    color: 'var(--color-text-primary)',
                    margin: '0 0 1.5rem',
                    lineHeight: 1.4,
                  }}
                >
                  {assessmentInterfaceContent.question}
                </h3>

                <div
                  role="radiogroup"
                  aria-label="Sample question options"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}
                >
                  {assessmentInterfaceContent.options.map((opt) => {
                    const selected = opt.state === 'selected';
                    return (
                      <div
                        key={opt.letter}
                        className="assessment-option"
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.85rem',
                          padding: '0.85rem 1rem',
                          background: selected
                            ? 'rgba(77,217,255,0.08)'
                            : 'rgba(13,16,20,0.4)',
                          border: `1px solid ${
                            selected ? 'var(--color-beam)' : 'rgba(168,240,255,0.12)'
                          }`,
                          willChange: 'transform, opacity',
                        }}
                      >
                        <span
                          aria-hidden="true"
                          style={{
                            flexShrink: 0,
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            background: selected
                              ? 'var(--color-beam)'
                              : 'rgba(168,240,255,0.06)',
                            border: `1px solid ${
                              selected ? 'var(--color-beam)' : 'rgba(168,240,255,0.25)'
                            }`,
                            color: selected ? 'var(--color-void)' : 'var(--color-beam)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {opt.letter}
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--text-sm)',
                            color: 'var(--color-text-primary)',
                            lineHeight: 1.5,
                          }}
                        >
                          {opt.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right — nav panel */}
              <div
                className="assessment-ui-nav"
                style={{
                  padding: 'clamp(1.5rem, 3vw, 2rem) 1.5rem',
                  background: 'rgba(5,6,8,0.4)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: '0.22em',
                    color: 'var(--color-text-tertiary)',
                    textTransform: 'uppercase',
                    marginBottom: '0.85rem',
                  }}
                >
                  Question Map
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '0.45rem',
                    marginBottom: '1.25rem',
                  }}
                >
                  {assessmentInterfaceContent.navQuestions.map((q) => {
                    const s = navStateStyle(q.state);
                    return (
                      <div
                        key={q.n}
                        className="assessment-nav-cell"
                        style={{
                          aspectRatio: '1 / 1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          fontWeight: 600,
                          willChange: 'transform, opacity',
                          ...s,
                        }}
                      >
                        {q.n}
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {assessmentInterfaceContent.navLegend.map((l) => {
                    const s = navStateStyle(l.state);
                    return (
                      <div
                        key={l.state}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '10px',
                          letterSpacing: '0.1em',
                          color: 'var(--color-text-tertiary)',
                          textTransform: 'uppercase',
                        }}
                      >
                        <span
                          aria-hidden="true"
                          style={{
                            width: '12px',
                            height: '12px',
                            ...s,
                          }}
                        />
                        {l.label}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer controls */}
            <div
              className="assessment-ui-footer"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.85rem',
                padding: '1rem 1.25rem',
                background: 'rgba(5,6,8,0.55)',
                borderTop: '1px solid rgba(168,240,255,0.1)',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.55rem 1rem',
                  background: 'transparent',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid rgba(168,240,255,0.2)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                }}
              >
                ← {assessmentInterfaceContent.footerButtons.previous}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.18em',
                  color: 'var(--color-red-team-glow)',
                  textTransform: 'uppercase',
                }}
              >
                ⚑ {assessmentInterfaceContent.footerButtons.flag}
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.55rem 1rem',
                  background: 'var(--color-beam)',
                  color: 'var(--color-void)',
                  border: '1px solid var(--color-beam)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  boxShadow: '0 0 16px rgba(77,217,255,0.25)',
                }}
              >
                {assessmentInterfaceContent.footerButtons.next} →
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
