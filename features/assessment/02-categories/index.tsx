'use client';
/* Assessment Categories — pinned cinematic walk through 4 tracks.
 *
 * 300% pin. Mirrors VerifyHowItWorks / ResearchPillars composition:
 * centered heading, then a grid that walks through 4 cards in turn.
 * Each card has icon + tag + title + description + meta strip
 * (questions / duration / proctoring).
 *
 * Beats (0–1):
 *   0.00–0.10  Badge enters
 *   0.05–0.18  Heading + description reveal
 *   0.22–0.36  Aptitude ignites
 *   0.36–0.50  Technical ignites
 *   0.50–0.64  Security Labs ignites
 *   0.64–0.78  Certification ignites
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
  assessmentCategoriesContent,
  type CategoryIcon,
} from '@/content/assessment/categories';

function CategoryIconSvg({ kind }: { kind: CategoryIcon }) {
  const common = {
    width: 26,
    height: 26,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
  if (kind === 'aptitude') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9.5a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 4" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    );
  }
  if (kind === 'technical') {
    return (
      <svg {...common}>
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    );
  }
  if (kind === 'lab') {
    return (
      <svg {...common}>
        <path d="M9 2v6L4 18a2 2 0 0 0 1.8 3h12.4A2 2 0 0 0 20 18L15 8V2" />
        <path d="M8 2h8" />
        <path d="M7 14h10" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="9" r="6" />
      <path d="m8.21 13.89-1.21 7.11 5-3 5 3-1.21-7.11" />
    </svg>
  );
}

export default function AssessmentCategories() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const cards = root.querySelectorAll<HTMLElement>('.assessment-category-card');

      if (reducedMotion) {
        gsap.set(
          [
            '.assessment-cat-badge',
            '.assessment-cat-heading',
            '.assessment-cat-desc',
            '.assessment-category-card',
            '.assessment-category-icon',
          ],
          { opacity: 1, y: 0, scale: 1, rotate: 0 },
        );
        return;
      }

      if (!isDesktop) {
        gsap.fromTo(
          '.assessment-cat-badge, .assessment-cat-heading, .assessment-cat-desc',
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

      gsap.set(['.assessment-cat-badge', '.assessment-cat-desc'], { opacity: 0, y: 20 });
      gsap.set('.assessment-cat-heading', { opacity: 0, yPercent: 30 });
      gsap.set('.assessment-cat-camera', { scale: 1, transformOrigin: 'center center' });

      cards.forEach((c) => {
        const icon = c.querySelector<HTMLElement>('.assessment-category-icon');
        gsap.set(c, { opacity: 0, y: 36, scale: 0.92 });
        if (icon) gsap.set(icon, { scale: 0.7, rotate: -8 });
      });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_DURATIONS.assessmentCategories,
        scrub: 1,
        enabled: true,
      });

      tl.to('.assessment-cat-badge', { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0.02);
      tl.to('.assessment-cat-heading', { opacity: 1, yPercent: 0, duration: 0.12, ease: 'power3.out' }, 0.05);
      tl.to('.assessment-cat-desc', { opacity: 1, y: 0, duration: 0.10, ease: 'power2.out' }, 0.15);

      const STARTS = [0.22, 0.36, 0.50, 0.64];
      const DUR = 0.13;

      cards.forEach((c, i) => {
        const start = STARTS[i] ?? STARTS[STARTS.length - 1];
        const icon = c.querySelector<HTMLElement>('.assessment-category-icon');
        tl.to(c, { opacity: 1, y: 0, scale: 1, duration: DUR, ease: 'power3.out' }, start);
        if (icon) {
          tl.to(icon, { scale: 1, rotate: 0, duration: DUR, ease: 'back.out(2)' }, start + 0.02);
        }
      });

      tl.to(
        '.assessment-cat-camera',
        { scale: 1.03, duration: 0.10, ease: 'power2.inOut' },
        0.88,
      );
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="assessment-categories"
      aria-label={assessmentCategoriesContent.heading}
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <style>{`
        .assessment-cat-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1.5rem;
        }
        @media (max-width: 1199px) {
          .assessment-cat-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 639px) {
          .assessment-cat-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div
        className="assessment-cat-camera"
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
          <div className="assessment-cat-badge" style={{ display: 'inline-block' }}>
            <Badge label={assessmentCategoriesContent.badge} />
          </div>
          <h2
            className="assessment-cat-heading"
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
            {assessmentCategoriesContent.heading}
          </h2>
          <p
            className="assessment-cat-desc"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '620px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            {assessmentCategoriesContent.description}
          </p>
        </div>

        <div className="section-container assessment-cat-grid">
          {assessmentCategoriesContent.categories.map((c) => (
            <article
              key={c.id}
              className="assessment-category-card"
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
                className="assessment-category-icon"
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
                  {c.meta.questions}
                </span>
                <span>
                  <span style={{ color: 'var(--color-beam)' }}>›</span>{' '}
                  {c.meta.duration}
                </span>
                <span>
                  <span style={{ color: 'var(--color-beam)' }}>›</span>{' '}
                  Proctoring: {c.meta.proctoring}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
