'use client';
/* Download Files — pinned cinematic top-10 cascade table.
 *
 * 350% pin. Mirrors AssessmentLeaderboard. Rows cascade in as scroll
 * scrubs. Each row shows file name + category + format + size + tier pill.
 *
 *   0.00–0.10  Badge enters
 *   0.05–0.18  Heading + description reveal
 *   0.22–0.30  Table frame + header row reveal
 *   0.30–0.80  10 rows cascade in (~5% each)
 *   0.85–1.00  Camera dollies in 4%
 *
 * Action buttons render as visual-only spans — the per-entry hrefs all
 * pointed to placeholder routes (404). The buttons stay visible because
 * their label/colour conveys the file's tier status (Free / Member /
 * Premium); restore the Link/a once the download endpoints are wired.
 */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { Badge } from '@/components/ui/Badge';
import {
  downloadFilesContent,
  type FileTier,
} from '@/content/download/files';

const tierTone = (tier: FileTier) => {
  switch (tier) {
    case 'free':
      return { color: 'var(--color-beam)',         glow: 'rgba(168,240,255,0.25)', label: 'Free' };
    case 'member':
      return { color: 'var(--color-terminal)',     glow: 'rgba(0,255,148,0.25)',   label: 'Member' };
    case 'premium':
      return { color: 'var(--color-red-team-glow)',glow: 'rgba(255,61,90,0.25)',   label: 'Premium' };
  }
};

const formatSize = (mb: number): string => {
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  if (mb >= 10) return `${Math.round(mb)} MB`;
  return `${mb.toFixed(1)} MB`;
};

export default function DownloadFiles() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const rows = root.querySelectorAll<HTMLElement>('.download-files-row');

      const ALL = [
        '.download-files-badge',
        '.download-files-heading',
        '.download-files-desc',
        '.download-files-table',
        '.download-files-header',
        '.download-files-row',
      ];

      if (reducedMotion) {
        gsap.set(ALL, { opacity: 1, y: 0, x: 0, scale: 1 });
        return;
      }

      if (!isDesktop) {
        gsap.fromTo(
          '.download-files-badge, .download-files-heading, .download-files-desc',
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
            scrollTrigger: { trigger: '.download-files-table', start: 'top 82%', toggleActions: 'play none none reset' } as ScrollTrigger.Vars,
          },
        );
        return;
      }

      gsap.set(['.download-files-badge', '.download-files-desc'], { opacity: 0, y: 20 });
      gsap.set('.download-files-heading', { opacity: 0, yPercent: 30 });
      gsap.set('.download-files-table', { opacity: 0, y: 36 });
      gsap.set('.download-files-header', { opacity: 0, y: 12 });
      gsap.set(rows, { opacity: 0, x: -24 });
      gsap.set('.download-files-camera', { scale: 1, transformOrigin: 'center center' });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_DURATIONS.downloadFiles,
        scrub: 1,
        enabled: true,
      });

      tl.to('.download-files-badge', { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0.02);
      tl.to('.download-files-heading', { opacity: 1, yPercent: 0, duration: 0.12, ease: 'power3.out' }, 0.05);
      tl.to('.download-files-desc', { opacity: 1, y: 0, duration: 0.10, ease: 'power2.out' }, 0.13);
      tl.to('.download-files-table', { opacity: 1, y: 0, duration: 0.14, ease: 'power3.out' }, 0.22);
      tl.to('.download-files-header', { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0.28);

      const ROW_START = 0.30;
      const ROW_GAP = 0.05;
      rows.forEach((r, i) => {
        tl.to(r, { opacity: 1, x: 0, duration: 0.07, ease: 'power2.out' }, ROW_START + i * ROW_GAP);
      });

      tl.to(
        '.download-files-camera',
        { scale: 1.03, duration: 0.10, ease: 'power2.inOut' },
        0.88,
      );
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="download-files"
      aria-label={downloadFilesContent.heading}
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <style>{`
        .download-files-grid {
          display: grid;
          grid-template-columns: 50px minmax(0, 2.4fr) minmax(0, 1.2fr) 70px 70px 130px;
          gap: 0;
          column-gap: 0.5rem;
          align-items: center;
        }
        @media (max-width: 767px) {
          #download-files          { min-height: auto !important; }
          .download-files-camera   {
            min-height: auto !important;
            justify-content: flex-start !important;
            padding-top: clamp(3rem, 7vh, 5rem) !important;
            padding-bottom: clamp(3rem, 7vh, 5rem) !important;
          }
          .download-files-grid {
            grid-template-columns: 32px minmax(0, 1fr) 42px 48px;
            padding: 0.7rem 0.85rem !important;
            column-gap: 0.4rem;
          }
          .download-files-col-category,
          .download-files-col-format { display: none !important; }
          .download-files-rank-text  { font-size: 0.95rem !important; }
          .download-files-name-text  { font-size: 13px !important; letter-spacing: -0.005em; }
          .download-files-size-text  { font-size: 11px !important; }
          .download-files-action-label { display: none !important; }
          .download-files-action {
            padding: 0.35rem 0.4rem !important;
            min-width: 0 !important;
            font-size: 14px !important;
            letter-spacing: 0 !important;
          }
          .download-files-header     { font-size: 9px !important; letter-spacing: 0.18em !important; }
        }
      `}</style>

      <div
        className="download-files-camera"
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
          <div className="download-files-badge" style={{ display: 'inline-block' }}>
            <Badge label={downloadFilesContent.badge} />
          </div>
          <h2
            className="download-files-heading"
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
            {downloadFilesContent.heading}
          </h2>
          <p
            className="download-files-desc"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '620px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            {downloadFilesContent.description}
          </p>
        </div>

        <div
          className="section-container"
          style={{ maxWidth: '1040px', marginInline: 'auto' }}
        >
          <div
            className="download-files-table"
            style={{
              background: 'rgba(13,16,20,0.55)',
              border: '1px solid rgba(168,240,255,0.18)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              className="download-files-header download-files-grid"
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
              <span>{downloadFilesContent.columns.rank}</span>
              <span>{downloadFilesContent.columns.name}</span>
              <span className="download-files-col-category">{downloadFilesContent.columns.category}</span>
              <span className="download-files-col-format">{downloadFilesContent.columns.format}</span>
              <span style={{ textAlign: 'right' }}>{downloadFilesContent.columns.size}</span>
              <span style={{ textAlign: 'right' }}>{downloadFilesContent.columns.action}</span>
            </div>

            {downloadFilesContent.entries.map((entry) => {
              const tone = tierTone(entry.tier);
              const isPodium = entry.rank <= 3;
              return (
                <div
                  key={entry.rank}
                  className="download-files-row download-files-grid"
                  role="row"
                  style={{
                    padding: '0.85rem 1.25rem',
                    borderBottom:
                      entry.rank === downloadFilesContent.entries.length
                        ? 'none'
                        : '1px solid rgba(168,240,255,0.06)',
                    background: isPodium ? 'rgba(168,240,255,0.02)' : 'transparent',
                    willChange: 'transform, opacity',
                  }}
                >
                  <span
                    className="download-files-rank-text"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: isPodium ? 'var(--color-beam)' : 'var(--color-text-tertiary)',
                      letterSpacing: '-0.02em',
                      textShadow: isPodium ? '0 0 12px rgba(168,240,255,0.35)' : 'none',
                    }}
                  >
                    #{entry.rank}
                  </span>
                  <span
                    className="download-files-name-text"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--text-base)',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      minWidth: 0,
                    }}
                  >
                    {entry.name}
                  </span>
                  <span
                    className="download-files-col-category"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-secondary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {entry.category}
                  </span>
                  <span
                    className="download-files-col-format"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      letterSpacing: '0.12em',
                      color: 'var(--color-text-tertiary)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {entry.format}
                  </span>
                  <span
                    className="download-files-size-text"
                    style={{
                      textAlign: 'right',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-secondary)',
                      fontVariantNumeric: 'tabular-nums',
                      fontFeatureSettings: '"tnum"',
                    }}
                  >
                    {formatSize(entry.sizeMb)}
                  </span>
                  <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {(() => {
                      const actionStyle = {
                        display: 'inline-flex' as const,
                        alignItems: 'center' as const,
                        justifyContent: 'center' as const,
                        gap: '0.4rem',
                        padding: '0.45rem 0.85rem',
                        minWidth: '110px',
                        background: 'transparent',
                        border: `1px solid ${tone.color}`,
                        color: tone.color,
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase' as const,
                        boxShadow: `0 0 10px ${tone.glow}`,
                        whiteSpace: 'nowrap' as const,
                      };
                      return (
                        <span
                          className="download-files-action"
                          style={actionStyle}
                          aria-label={`${entry.actionLabel} ${entry.name}`}
                        >
                          <span className="download-files-action-label">{entry.actionLabel}</span>
                          <span aria-hidden="true">↓</span>
                        </span>
                      );
                    })()}
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
