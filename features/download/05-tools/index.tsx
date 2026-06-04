'use client';
/* Download Tools — pinned cinematic toolkit showcase.
 *
 * 300% pin. 6 toolkit cards ignite in a 3×2 grid across the pin window.
 *
 *   0.00–0.10  Badge enters
 *   0.05–0.18  Heading + description reveal
 *   0.22–0.78  6 tool cards stagger ignite (~0.093 each)
 *   0.85–1.00  Camera dollies in 3%
 */
import { useRef } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { Badge } from '@/components/ui/Badge';
import { downloadToolsContent } from '@/content/download/tools';

const isInternalRoute = (href: string) => href.startsWith('/') && !href.startsWith('//');

export default function DownloadTools() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const cards = root.querySelectorAll<HTMLElement>('.download-tool-card');

      if (reducedMotion) {
        gsap.set(
          [
            '.download-tools-badge',
            '.download-tools-heading',
            '.download-tools-desc',
            '.download-tool-card',
          ],
          { opacity: 1, y: 0, scale: 1 },
        );
        return;
      }

      if (!isDesktop) {
        gsap.fromTo(
          '.download-tools-badge, .download-tools-heading, .download-tools-desc',
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: root, start: 'top 78%', toggleActions: 'play none none reset' } as ScrollTrigger.Vars,
          },
        );
        cards.forEach((c) => {
          gsap.fromTo(
            c,
            { opacity: 0, y: 36, scale: 0.95 },
            {
              opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out',
              scrollTrigger: { trigger: c, start: 'top 85%', toggleActions: 'play none none reset' } as ScrollTrigger.Vars,
            },
          );
        });
        return;
      }

      gsap.set(['.download-tools-badge', '.download-tools-desc'], { opacity: 0, y: 20 });
      gsap.set('.download-tools-heading', { opacity: 0, yPercent: 30 });
      gsap.set('.download-tools-camera', { scale: 1, transformOrigin: 'center center' });
      gsap.set(cards, { opacity: 0, y: 36, scale: 0.94 });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_DURATIONS.downloadTools,
        scrub: 1,
        enabled: true,
      });

      tl.to('.download-tools-badge', { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0.02);
      tl.to('.download-tools-heading', { opacity: 1, yPercent: 0, duration: 0.12, ease: 'power3.out' }, 0.05);
      tl.to('.download-tools-desc', { opacity: 1, y: 0, duration: 0.10, ease: 'power2.out' }, 0.15);

      // 6 cards over 0.22 → 0.78 → ~0.093 step
      const START = 0.22;
      const END = 0.78;
      const STEP = (END - START) / (cards.length || 1);

      cards.forEach((c, i) => {
        const start = START + STEP * i;
        tl.to(c, { opacity: 1, y: 0, scale: 1, duration: STEP * 0.85, ease: 'power3.out' }, start);
      });

      tl.to(
        '.download-tools-camera',
        { scale: 1.03, duration: 0.10, ease: 'power2.inOut' },
        0.88,
      );
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="download-tools"
      aria-label={downloadToolsContent.heading}
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <style>{`
        .download-tools-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1.5rem;
        }
        @media (max-width: 1023px) {
          .download-tools-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 639px) {
          .download-tools-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 767px) {
          #download-tools         { min-height: auto !important; }
          .download-tools-camera  {
            min-height: auto !important;
            justify-content: flex-start !important;
            padding-top: clamp(3rem, 7vh, 5rem) !important;
            padding-bottom: clamp(3rem, 7vh, 5rem) !important;
          }
        }
      `}</style>

      <div
        className="download-tools-camera"
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
          style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 6vh, 4.5rem)' }}
        >
          <div className="download-tools-badge" style={{ display: 'inline-block' }}>
            <Badge label={downloadToolsContent.badge} />
          </div>
          <h2
            className="download-tools-heading"
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
            {downloadToolsContent.heading}
          </h2>
          <p
            className="download-tools-desc"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '680px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            {downloadToolsContent.description}
          </p>
        </div>

        <div className="section-container download-tools-grid">
          {downloadToolsContent.tools.map((t) => (
            <article
              key={t.id}
              className="download-tool-card"
              style={{
                position: 'relative',
                padding: '1.75rem 1.5rem',
                background: 'rgba(13,16,20,0.5)',
                border: '1px solid rgba(168,240,255,0.12)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                willChange: 'transform, opacity',
                transition: 'border-color 0.3s, box-shadow 0.3s',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = 'rgba(168,240,255,0.35)';
                el.style.boxShadow = '0 14px 32px rgba(0,0,0,0.5), 0 0 24px rgba(168,240,255,0.08)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = 'rgba(168,240,255,0.12)';
                el.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    letterSpacing: '-0.01em',
                    color: 'var(--color-text-primary)',
                    margin: 0,
                    lineHeight: 1.25,
                  }}
                >
                  {t.name}
                </h3>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: '0.16em',
                    color: 'var(--color-beam)',
                    padding: '0.22rem 0.5rem',
                    border: '1px solid rgba(168,240,255,0.3)',
                    textTransform: 'uppercase',
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {t.shortCode}
                </span>
              </div>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-secondary)',
                  margin: 0,
                  lineHeight: 1.6,
                  flex: 1,
                }}
              >
                {t.description}
              </p>

              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.4rem',
                }}
              >
                {t.highlights.map((h) => (
                  <li
                    key={h}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      letterSpacing: '0.1em',
                      color: 'var(--color-text-tertiary)',
                      padding: '0.25rem 0.55rem',
                      border: '1px solid rgba(168,240,255,0.15)',
                      background: 'rgba(168,240,255,0.03)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {h}
                  </li>
                ))}
              </ul>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '0.85rem',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.04em',
                  color: 'var(--color-text-tertiary)',
                }}
              >
                <span>
                  <span style={{ color: 'var(--color-beam)' }}>›</span> {t.platform}
                </span>
                <span style={{ color: 'var(--color-beam)', fontVariantNumeric: 'tabular-nums' }}>
                  {t.size}
                </span>
              </div>

              {(() => {
                const ctaStyle = {
                  display: 'inline-flex' as const,
                  alignItems: 'center' as const,
                  justifyContent: 'center' as const,
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  marginTop: '0.4rem',
                  background: 'transparent',
                  color: 'var(--color-beam)',
                  border: '1px solid rgba(168,240,255,0.35)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase' as const,
                  textDecoration: 'none' as const,
                  transition: 'background 0.25s, border-color 0.25s, box-shadow 0.25s',
                };
                const hoverIn = (e: React.MouseEvent<HTMLElement>) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = 'rgba(168,240,255,0.08)';
                  el.style.borderColor = 'var(--color-beam)';
                  el.style.boxShadow = '0 0 20px rgba(168,240,255,0.18)';
                };
                const hoverOut = (e: React.MouseEvent<HTMLElement>) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = 'transparent';
                  el.style.borderColor = 'rgba(168,240,255,0.35)';
                  el.style.boxShadow = 'none';
                };
                return isInternalRoute(t.href) ? (
                  <Link
                    href={t.href}
                    style={ctaStyle}
                    onMouseEnter={hoverIn}
                    onMouseLeave={hoverOut}
                    aria-label={`${t.actionLabel} — ${t.name}`}
                  >
                    {t.actionLabel}
                    <span aria-hidden="true">›</span>
                  </Link>
                ) : (
                  <a
                    href={t.href}
                    style={ctaStyle}
                    onMouseEnter={hoverIn}
                    onMouseLeave={hoverOut}
                    aria-label={`${t.actionLabel} — ${t.name}`}
                  >
                    {t.actionLabel}
                    <span aria-hidden="true">›</span>
                  </a>
                );
              })()}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
