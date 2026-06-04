'use client';
/* Assessment Results — pinned cinematic scorecard.
 *
 * Mock scorecard with overall score ring, per-section bars, status badge,
 * and three highlight stats. Counter-style animations on the pinned
 * timeline so the score "ticks up" to 84 as the camera holds.
 *
 * 300% pin. Beats (0–1):
 *   0.00–0.10  Badge enters
 *   0.05–0.18  Heading + description reveal
 *   0.22–0.36  Scorecard panel slides up + ignites
 *   0.30–0.40  Overall score counts up 0 → 84
 *   0.36–0.42  Status badge "PASSED" punches in
 *   0.42–0.60  Section bars fill in turn
 *   0.60–0.70  Three highlight tiles ignite
 *   0.85–1.00  Camera dollies in 4%
 */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { Badge } from '@/components/ui/Badge';
import { assessmentResultsContent } from '@/content/assessment/results';

export default function AssessmentResults() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const sectionBars = root.querySelectorAll<HTMLElement>('.assessment-section-bar');
      const sectionValues = root.querySelectorAll<HTMLElement>('.assessment-section-value');
      const highlightCards = root.querySelectorAll<HTMLElement>('.assessment-highlight-card');

      const ALL = [
        '.assessment-res-badge',
        '.assessment-res-heading',
        '.assessment-res-desc',
        '.assessment-res-card',
        '.assessment-res-status',
        '.assessment-section-bar',
        '.assessment-section-value',
        '.assessment-highlight-card',
      ];

      if (reducedMotion) {
        // Settle final state.
        gsap.set(ALL, { opacity: 1, y: 0, scale: 1, scaleX: 1 });
        const scoreEl = root.querySelector<HTMLElement>('.assessment-overall-value');
        if (scoreEl) scoreEl.textContent = String(assessmentResultsContent.scorecard.overallScore);
        sectionBars.forEach((bar, i) => {
          const target = assessmentResultsContent.sections[i]?.scorePct ?? 0;
          gsap.set(bar, { scaleX: target / 100 });
        });
        sectionValues.forEach((el, i) => {
          const target = assessmentResultsContent.sections[i]?.scorePct ?? 0;
          el.textContent = `${target}%`;
        });
        return;
      }

      if (!isDesktop) {
        const trigger = {
          trigger: root,
          start: 'top 78%',
          toggleActions: 'play none none reset',
        } as ScrollTrigger.Vars;
        gsap.fromTo(
          '.assessment-res-badge, .assessment-res-heading, .assessment-res-desc',
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out', scrollTrigger: trigger },
        );
        gsap.fromTo(
          '.assessment-res-card',
          { opacity: 0, y: 36, scale: 0.96 },
          {
            opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: '.assessment-res-card', start: 'top 80%', toggleActions: 'play none none reset' } as ScrollTrigger.Vars,
          },
        );
        // Animate count up
        const scoreEl = root.querySelector<HTMLElement>('.assessment-overall-value');
        if (scoreEl) {
          const obj = { val: 0 };
          gsap.to(obj, {
            val: assessmentResultsContent.scorecard.overallScore,
            duration: 1.2,
            ease: 'power2.out',
            onUpdate() { scoreEl.textContent = String(Math.round(obj.val)); },
            scrollTrigger: { trigger: '.assessment-res-card', start: 'top 78%', toggleActions: 'play none none reset' } as ScrollTrigger.Vars,
          });
        }
        sectionBars.forEach((bar, i) => {
          const target = assessmentResultsContent.sections[i]?.scorePct ?? 0;
          gsap.fromTo(
            bar,
            { scaleX: 0 },
            {
              scaleX: target / 100,
              duration: 0.8,
              ease: 'power2.out',
              delay: 0.2 + i * 0.08,
              scrollTrigger: { trigger: bar, start: 'top 90%', toggleActions: 'play none none reset' } as ScrollTrigger.Vars,
            },
          );
        });
        sectionValues.forEach((el, i) => {
          const target = assessmentResultsContent.sections[i]?.scorePct ?? 0;
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 0.8,
            ease: 'power2.out',
            delay: 0.2 + i * 0.08,
            onUpdate() { el.textContent = `${Math.round(obj.val)}%`; },
            scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reset' } as ScrollTrigger.Vars,
          });
        });
        return;
      }

      // Desktop pinned ────────────────────────────────────────────────────
      gsap.set(['.assessment-res-badge', '.assessment-res-desc'], { opacity: 0, y: 20 });
      gsap.set('.assessment-res-heading', { opacity: 0, yPercent: 30 });
      gsap.set('.assessment-res-card', { opacity: 0, y: 40, scale: 0.96 });
      gsap.set('.assessment-res-status', { opacity: 0, scale: 0.7 });
      gsap.set(sectionBars, { scaleX: 0, transformOrigin: 'left center' });
      gsap.set(highlightCards, { opacity: 0, y: 18 });
      gsap.set('.assessment-res-camera', { scale: 1, transformOrigin: 'center center' });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_DURATIONS.assessmentResults,
        scrub: 1,
        enabled: true,
      });

      tl.to('.assessment-res-badge', { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0.02);
      tl.to('.assessment-res-heading', { opacity: 1, yPercent: 0, duration: 0.12, ease: 'power3.out' }, 0.05);
      tl.to('.assessment-res-desc', { opacity: 1, y: 0, duration: 0.10, ease: 'power2.out' }, 0.13);
      tl.to('.assessment-res-card', { opacity: 1, y: 0, scale: 1, duration: 0.18, ease: 'power3.out' }, 0.22);

      // Score count-up
      const scoreEl = root.querySelector<HTMLElement>('.assessment-overall-value');
      if (scoreEl) {
        const obj = { val: 0 };
        tl.to(
          obj,
          {
            val: assessmentResultsContent.scorecard.overallScore,
            duration: 0.18,
            ease: 'power2.out',
            onUpdate() { scoreEl.textContent = String(Math.round(obj.val)); },
          },
          0.30,
        );
      }

      tl.to(
        '.assessment-res-status',
        { opacity: 1, scale: 1, duration: 0.10, ease: 'back.out(2)' },
        0.36,
      );

      // Section bars fill in sequence
      sectionBars.forEach((bar, i) => {
        const target = assessmentResultsContent.sections[i]?.scorePct ?? 0;
        const start = 0.42 + i * 0.035;
        tl.to(bar, { scaleX: target / 100, duration: 0.10, ease: 'power2.out' }, start);

        const valueEl = sectionValues[i];
        if (valueEl) {
          const obj = { val: 0 };
          tl.to(
            obj,
            {
              val: target,
              duration: 0.10,
              ease: 'power2.out',
              onUpdate() { valueEl.textContent = `${Math.round(obj.val)}%`; },
            },
            start,
          );
        }
      });

      tl.to(highlightCards, { opacity: 1, y: 0, duration: 0.10, stagger: 0.06, ease: 'power2.out' }, 0.62);

      tl.to(
        '.assessment-res-camera',
        { scale: 1.03, duration: 0.10, ease: 'power2.inOut' },
        0.88,
      );
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  const sc = assessmentResultsContent.scorecard;

  return (
    <section
      ref={sectionRef}
      id="assessment-results"
      aria-label={assessmentResultsContent.heading}
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <div
        className="assessment-res-camera"
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
          <div className="assessment-res-badge" style={{ display: 'inline-block' }}>
            <Badge label={assessmentResultsContent.badge} />
          </div>
          <h2
            className="assessment-res-heading"
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
            {assessmentResultsContent.heading}
          </h2>
          <p
            className="assessment-res-desc"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '620px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            {assessmentResultsContent.description}
          </p>
        </div>

        <div
          className="section-container"
          style={{ maxWidth: '960px', marginInline: 'auto' }}
        >
          {/* ── Scorecard ──────────────────────────────────────────────── */}
          <div
            className="assessment-res-card"
            aria-hidden="true"
            style={{
              position: 'relative',
              background: 'rgba(13,16,20,0.55)',
              border: '1px solid rgba(168,240,255,0.2)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 28px rgba(77,217,255,0.08)',
              padding: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.75rem',
            }}
          >
            {/* Header row */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: '0.22em',
                    color: 'var(--color-text-tertiary)',
                    textTransform: 'uppercase',
                    marginBottom: '0.4rem',
                  }}
                >
                  {sc.examName}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {sc.candidate}
                </div>
              </div>

              <div
                className="assessment-res-status"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  padding: '0.5rem 1rem',
                  background: 'rgba(0,255,148,0.10)',
                  border: '1px solid var(--color-terminal)',
                  color: 'var(--color-terminal)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  boxShadow: '0 0 16px rgba(0,255,148,0.18)',
                  willChange: 'transform, opacity',
                }}
              >
                ● {sc.status}
              </div>
            </div>

            {/* Big score row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '1rem',
                paddingBottom: '1.5rem',
                borderBottom: '1px solid rgba(168,240,255,0.1)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(3.5rem, 8vw, 5.5rem)',
                  fontWeight: 700,
                  color: 'var(--color-beam)',
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                  textShadow: '0 0 22px rgba(168,240,255,0.3)',
                  fontVariantNumeric: 'tabular-nums',
                  fontFeatureSettings: '"tnum"',
                }}
              >
                <span className="assessment-overall-value">0</span>
                <span style={{ fontSize: '0.45em', color: 'var(--color-text-tertiary)', marginLeft: '0.2em' }}>
                  / {sc.overallTarget}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem',
                  paddingBottom: '0.5rem',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: '0.22em',
                    color: 'var(--color-text-tertiary)',
                    textTransform: 'uppercase',
                  }}
                >
                  Overall Score
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  Pass mark: {sc.passPct}%
                </span>
              </div>
            </div>

            {/* Per-section bars */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
              }}
            >
              {assessmentResultsContent.sections.map((s) => (
                <div
                  key={s.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <div
                    style={{
                      flexShrink: 0,
                      width: '200px',
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {s.label}
                  </div>
                  <div
                    aria-hidden="true"
                    style={{
                      flex: 1,
                      position: 'relative',
                      height: '8px',
                      background: 'rgba(168,240,255,0.08)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      className="assessment-section-bar"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'var(--color-beam)',
                        boxShadow: '0 0 10px var(--color-beam-glow)',
                        transformOrigin: 'left center',
                        willChange: 'transform',
                      }}
                    />
                  </div>
                  <div
                    className="assessment-section-value"
                    style={{
                      flexShrink: 0,
                      width: '54px',
                      textAlign: 'right',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--color-beam)',
                      fontVariantNumeric: 'tabular-nums',
                      fontFeatureSettings: '"tnum"',
                    }}
                  >
                    0%
                  </div>
                </div>
              ))}
            </div>

            {/* Highlight tiles */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: '0.85rem',
                marginTop: '0.25rem',
              }}
            >
              {assessmentResultsContent.highlights.map((h) => (
                <div
                  key={h.id}
                  className="assessment-highlight-card"
                  style={{
                    padding: '1rem 1.25rem',
                    background: 'rgba(168,240,255,0.04)',
                    border: '1px solid rgba(168,240,255,0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                    willChange: 'transform, opacity',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: 'var(--color-beam)',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {h.value}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      letterSpacing: '0.18em',
                      color: 'var(--color-text-tertiary)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {h.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
