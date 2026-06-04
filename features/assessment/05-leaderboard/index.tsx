'use client';
/* Assessment Leaderboard — pinned cinematic top-10 table.
 *
 * 350% pin. Rows cascade in one at a time as the timeline scrubs — gives
 * the camera a long enough hold to read each placement, then settles.
 * Top 3 carry tier badges (gold/silver/bronze) with a subtle glow.
 *
 * Beats (0–1):
 *   0.00–0.10  Badge enters
 *   0.05–0.18  Heading + description reveal
 *   0.22–0.30  Table frame slides up + header row fades in
 *   0.30–0.80  10 rows cascade in (~5% each)
 *   0.85–1.00  Camera dollies in 4%
 */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { Badge } from '@/components/ui/Badge';
import {
  assessmentLeaderboardContent,
  type BadgeTier,
} from '@/content/assessment/leaderboard';

const tierTone = (tier: BadgeTier) => {
  switch (tier) {
    case 'gold':
      return { color: '#FFD66B', glow: 'rgba(255,214,107,0.28)', label: 'Gold' };
    case 'silver':
      return { color: '#D6DDE4', glow: 'rgba(214,221,228,0.22)', label: 'Silver' };
    case 'bronze':
      return { color: '#E59866', glow: 'rgba(229,152,102,0.22)', label: 'Bronze' };
    case 'standard':
    default:
      return { color: 'var(--color-text-tertiary)', glow: 'transparent', label: '—' };
  }
};

export default function AssessmentLeaderboard() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const rows = root.querySelectorAll<HTMLElement>('.assessment-lb-row');

      const ALL = [
        '.assessment-lb-badge',
        '.assessment-lb-heading',
        '.assessment-lb-desc',
        '.assessment-lb-table',
        '.assessment-lb-header',
        '.assessment-lb-row',
      ];

      if (reducedMotion) {
        gsap.set(ALL, { opacity: 1, y: 0, x: 0, scale: 1 });
        return;
      }

      if (!isDesktop) {
        gsap.fromTo(
          '.assessment-lb-badge, .assessment-lb-heading, .assessment-lb-desc',
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: root, start: 'top 78%', toggleActions: 'play none none reset' } as ScrollTrigger.Vars,
          },
        );
        gsap.fromTo(
          rows,
          { opacity: 0, x: -16 },
          {
            opacity: 1, x: 0, duration: 0.45, stagger: 0.07, ease: 'power2.out',
            scrollTrigger: { trigger: '.assessment-lb-table', start: 'top 82%', toggleActions: 'play none none reset' } as ScrollTrigger.Vars,
          },
        );
        return;
      }

      gsap.set(['.assessment-lb-badge', '.assessment-lb-desc'], { opacity: 0, y: 20 });
      gsap.set('.assessment-lb-heading', { opacity: 0, yPercent: 30 });
      gsap.set('.assessment-lb-table', { opacity: 0, y: 36 });
      gsap.set('.assessment-lb-header', { opacity: 0, y: 12 });
      gsap.set(rows, { opacity: 0, x: -24 });
      gsap.set('.assessment-lb-camera', { scale: 1, transformOrigin: 'center center' });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_DURATIONS.assessmentLeaderboard,
        scrub: 1,
        enabled: true,
      });

      tl.to('.assessment-lb-badge', { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0.02);
      tl.to('.assessment-lb-heading', { opacity: 1, yPercent: 0, duration: 0.12, ease: 'power3.out' }, 0.05);
      tl.to('.assessment-lb-desc', { opacity: 1, y: 0, duration: 0.10, ease: 'power2.out' }, 0.13);
      tl.to('.assessment-lb-table', { opacity: 1, y: 0, duration: 0.14, ease: 'power3.out' }, 0.22);
      tl.to('.assessment-lb-header', { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0.28);

      // 10 rows over 0.30 → 0.80 (~0.05 each)
      const ROW_START = 0.30;
      const ROW_GAP = 0.05;
      rows.forEach((r, i) => {
        tl.to(r, { opacity: 1, x: 0, duration: 0.07, ease: 'power2.out' }, ROW_START + i * ROW_GAP);
      });

      tl.to(
        '.assessment-lb-camera',
        { scale: 1.03, duration: 0.10, ease: 'power2.inOut' },
        0.88,
      );
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="assessment-leaderboard"
      aria-label={assessmentLeaderboardContent.heading}
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <style>{`
        .assessment-lb-grid {
          display: grid;
          grid-template-columns: 60px minmax(0, 2fr) minmax(0, 2fr) 80px 80px;
          gap: 0;
        }
        @media (max-width: 767px) {
          .assessment-lb-grid {
            grid-template-columns: 48px minmax(0, 1fr) 60px 56px;
          }
          .assessment-lb-col-course { display: none !important; }
        }
      `}</style>

      <div
        className="assessment-lb-camera"
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
          <div className="assessment-lb-badge" style={{ display: 'inline-block' }}>
            <Badge label={assessmentLeaderboardContent.badge} />
          </div>
          <h2
            className="assessment-lb-heading"
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
            {assessmentLeaderboardContent.heading}
          </h2>
          <p
            className="assessment-lb-desc"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '620px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            {assessmentLeaderboardContent.description}
          </p>
        </div>

        <div
          className="section-container"
          style={{ maxWidth: '960px', marginInline: 'auto' }}
        >
          <div
            className="assessment-lb-table"
            style={{
              background: 'rgba(13,16,20,0.55)',
              border: '1px solid rgba(168,240,255,0.18)',
              overflow: 'hidden',
            }}
          >
            {/* Header row */}
            <div
              className="assessment-lb-header assessment-lb-grid"
              role="rowgroup"
              style={{
                padding: '0.85rem 1.25rem',
                background: 'rgba(5,6,8,0.55)',
                borderBottom: '1px solid rgba(168,240,255,0.12)',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.22em',
                color: 'var(--color-text-tertiary)',
                textTransform: 'uppercase',
              }}
            >
              <span>{assessmentLeaderboardContent.columns.rank}</span>
              <span>{assessmentLeaderboardContent.columns.name}</span>
              <span className="assessment-lb-col-course">{assessmentLeaderboardContent.columns.course}</span>
              <span style={{ textAlign: 'right' }}>{assessmentLeaderboardContent.columns.score}</span>
              <span style={{ textAlign: 'right' }}>Tier</span>
            </div>

            {assessmentLeaderboardContent.entries.map((entry) => {
              const tone = tierTone(entry.badge);
              const isPodium = entry.rank <= 3;
              return (
                <div
                  key={entry.rank}
                  className="assessment-lb-row assessment-lb-grid"
                  role="row"
                  style={{
                    alignItems: 'center',
                    padding: '0.85rem 1.25rem',
                    borderBottom:
                      entry.rank === assessmentLeaderboardContent.entries.length
                        ? 'none'
                        : '1px solid rgba(168,240,255,0.06)',
                    background: isPodium ? 'rgba(168,240,255,0.02)' : 'transparent',
                    willChange: 'transform, opacity',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: isPodium ? tone.color : 'var(--color-text-tertiary)',
                      letterSpacing: '-0.02em',
                      textShadow: isPodium ? `0 0 12px ${tone.glow}` : 'none',
                    }}
                  >
                    #{entry.rank}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--text-base)',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {entry.name}
                  </span>
                  <span
                    className="assessment-lb-col-course"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-secondary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {entry.course}
                  </span>
                  <span
                    style={{
                      textAlign: 'right',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                      color: 'var(--color-beam)',
                      fontVariantNumeric: 'tabular-nums',
                      fontFeatureSettings: '"tnum"',
                    }}
                  >
                    {entry.scorePct}%
                  </span>
                  <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {isPodium ? (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.2rem 0.55rem',
                          background: 'transparent',
                          border: `1px solid ${tone.color}`,
                          color: tone.color,
                          fontFamily: 'var(--font-mono)',
                          fontSize: '10px',
                          letterSpacing: '0.16em',
                          textTransform: 'uppercase',
                          boxShadow: `0 0 10px ${tone.glow}`,
                        }}
                      >
                        ★ {tone.label}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--color-text-disabled)' }}>—</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
