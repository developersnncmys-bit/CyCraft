'use client';
/* Download Categories — pinned cinematic walk through 4 vaults.
 *
 * 300% pin. Mirrors AssessmentCategories: centered heading, 4-card grid
 * walking through each category (Study / Research / Tools / Restricted).
 *
 *   0.00–0.10  Badge enters
 *   0.05–0.18  Heading + description reveal
 *   0.22–0.36  Study Materials ignites
 *   0.36–0.50  Research Resources ignites
 *   0.50–0.64  Cybersecurity Tools ignites
 *   0.64–0.78  Restricted Vault ignites
 *   0.85–1.00  Camera dollies in 4%
 */
import { useRef } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { Badge } from '@/components/ui/Badge';
import {
  downloadCategoriesContent,
  type DownloadCategoryIcon,
} from '@/content/download/categories';

const isInternalRoute = (href: string) => href.startsWith('/') && !href.startsWith('//');

function CategoryIconSvg({ kind }: { kind: DownloadCategoryIcon }) {
  const common = {
    width: 26,
    height: 26,
    viewBox: '0 0 24 24',
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
  if (kind === 'doc') {
    return (
      <svg {...common}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="13" y2="17" />
      </svg>
    );
  }
  if (kind === 'paper') {
    return (
      <svg {...common}>
        <path d="M4 4h12l4 4v12a2 2 0 0 1-2 2H4Z" />
        <path d="M16 4v4h4" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="14" y2="17" />
      </svg>
    );
  }
  if (kind === 'terminal') {
    return (
      <svg {...common}>
        <rect x="2.5" y="4" width="19" height="16" rx="1.5" />
        <polyline points="7 9 11 12 7 15" />
        <line x1="13" y1="15" x2="17" y2="15" />
      </svg>
    );
  }
  // lock
  return (
    <svg {...common}>
      <rect x="4" y="11" width="16" height="10" rx="1.5" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      <circle cx="12" cy="16" r="1" fill="currentColor" />
    </svg>
  );
}

export default function DownloadCategories() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const cards = root.querySelectorAll<HTMLElement>('.download-category-card');

      if (reducedMotion) {
        gsap.set(
          [
            '.download-cat-badge',
            '.download-cat-heading',
            '.download-cat-desc',
            '.download-category-card',
            '.download-category-icon',
          ],
          { opacity: 1, y: 0, scale: 1, rotate: 0 },
        );
        return;
      }

      if (!isDesktop) {
        gsap.fromTo(
          '.download-cat-badge, .download-cat-heading, .download-cat-desc',
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
              scrollTrigger: { trigger: c, start: 'top 82%', toggleActions: 'play none none reset' } as ScrollTrigger.Vars,
            },
          );
        });
        return;
      }

      gsap.set(['.download-cat-badge', '.download-cat-desc'], { opacity: 0, y: 20 });
      gsap.set('.download-cat-heading', { opacity: 0, yPercent: 30 });
      gsap.set('.download-cat-camera', { scale: 1, transformOrigin: 'center center' });

      cards.forEach((c) => {
        const icon = c.querySelector<HTMLElement>('.download-category-icon');
        gsap.set(c, { opacity: 0, y: 36, scale: 0.92 });
        if (icon) gsap.set(icon, { scale: 0.7, rotate: -8 });
      });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_DURATIONS.downloadCategories,
        scrub: 1,
        enabled: true,
      });

      tl.to('.download-cat-badge', { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0.02);
      tl.to('.download-cat-heading', { opacity: 1, yPercent: 0, duration: 0.12, ease: 'power3.out' }, 0.05);
      tl.to('.download-cat-desc', { opacity: 1, y: 0, duration: 0.10, ease: 'power2.out' }, 0.15);

      const STARTS = [0.22, 0.36, 0.50, 0.64];
      const DUR = 0.13;

      cards.forEach((c, i) => {
        const start = STARTS[i] ?? STARTS[STARTS.length - 1];
        const icon = c.querySelector<HTMLElement>('.download-category-icon');
        tl.to(c, { opacity: 1, y: 0, scale: 1, duration: DUR, ease: 'power3.out' }, start);
        if (icon) {
          tl.to(icon, { scale: 1, rotate: 0, duration: DUR, ease: 'back.out(2)' }, start + 0.02);
        }
      });

      tl.to(
        '.download-cat-camera',
        { scale: 1.03, duration: 0.10, ease: 'power2.inOut' },
        0.88,
      );
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="download-categories"
      aria-label={downloadCategoriesContent.heading}
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <style>{`
        .download-cat-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1.5rem;
        }
        @media (max-width: 1199px) {
          .download-cat-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 639px) {
          .download-cat-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 767px) {
          #download-categories          { min-height: auto !important; }
          .download-cat-camera          {
            min-height: auto !important;
            justify-content: flex-start !important;
            padding-top: clamp(3rem, 7vh, 5rem) !important;
            padding-bottom: clamp(3rem, 7vh, 5rem) !important;
          }
        }
      `}</style>

      <div
        className="download-cat-camera"
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
          <div className="download-cat-badge" style={{ display: 'inline-block' }}>
            <Badge label={downloadCategoriesContent.badge} />
          </div>
          <h2
            className="download-cat-heading"
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
            {downloadCategoriesContent.heading}
          </h2>
          <p
            className="download-cat-desc"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '620px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            {downloadCategoriesContent.description}
          </p>
        </div>

        <div className="section-container download-cat-grid">
          {downloadCategoriesContent.categories.map((c) => (
            <article
              key={c.id}
              className="download-category-card"
              style={{
                position: 'relative',
                padding: '1.75rem 1.5rem',
                background: 'rgba(13,16,20,0.4)',
                border: '1px solid rgba(168,240,255,0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                transition: 'border-color 0.3s, box-shadow 0.3s',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = 'rgba(168,240,255,0.35)';
                el.style.boxShadow = '0 12px 32px rgba(0,0,0,0.5), 0 0 24px rgba(168,240,255,0.08)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = 'rgba(168,240,255,0.1)';
                el.style.boxShadow = 'none';
              }}
            >
              <div
                className="download-category-icon"
                aria-hidden="true"
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '10px',
                  background: 'rgba(168,240,255,0.08)',
                  border: '1px solid rgba(168,240,255,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-beam)',
                  willChange: 'transform',
                }}
              >
                <CategoryIconSvg kind={c.icon} />
              </div>

              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.22em',
                  color: 'var(--color-text-tertiary)',
                  textTransform: 'uppercase',
                }}
              >
                {c.tag}
              </span>

              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  color: 'var(--color-text-primary)',
                  margin: 0,
                  lineHeight: 1.25,
                }}
              >
                {c.title}
              </h3>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-secondary)',
                  margin: 0,
                  lineHeight: 1.55,
                  flex: 1,
                }}
              >
                {c.description}
              </p>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.04em',
                  color: 'var(--color-text-tertiary)',
                }}
              >
                <span>
                  <span style={{ color: 'var(--color-beam)' }}>›</span>{' '}
                  {c.meta.count}
                </span>
                <span>
                  <span style={{ color: 'var(--color-beam)' }}>›</span>{' '}
                  {c.meta.formats}
                </span>
                <span>
                  <span style={{ color: 'var(--color-beam)' }}>›</span>{' '}
                  Access: {c.meta.access}
                </span>
              </div>

              {(() => {
                const ctaStyle = {
                  display: 'inline-flex' as const,
                  alignItems: 'center' as const,
                  justifyContent: 'center' as const,
                  gap: '0.5rem',
                  padding: '0.7rem 1rem',
                  marginTop: '0.5rem',
                  background: 'transparent',
                  color: 'var(--color-beam)',
                  border: '1px solid rgba(168,240,255,0.3)',
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
                  el.style.boxShadow = '0 0 18px rgba(168,240,255,0.18)';
                };
                const hoverOut = (e: React.MouseEvent<HTMLElement>) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = 'transparent';
                  el.style.borderColor = 'rgba(168,240,255,0.3)';
                  el.style.boxShadow = 'none';
                };
                return isInternalRoute(c.cta.href) ? (
                  <Link
                    href={c.cta.href}
                    style={ctaStyle}
                    onMouseEnter={hoverIn}
                    onMouseLeave={hoverOut}
                    aria-label={`${c.cta.label} — ${c.title}`}
                  >
                    {c.cta.label}
                    <span aria-hidden="true">›</span>
                  </Link>
                ) : (
                  <a
                    href={c.cta.href}
                    style={ctaStyle}
                    onMouseEnter={hoverIn}
                    onMouseLeave={hoverOut}
                    aria-label={`${c.cta.label} — ${c.title}`}
                  >
                    {c.cta.label}
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
