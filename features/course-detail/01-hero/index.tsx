'use client';
/* Course Detail Hero — "Mission Briefing" dossier layout.
 *
 * Replaces the prior full-bleed-image-with-title-overlay hero (the part
 * that read as generic / similar to ethicalbyte.in). The image now lives
 * in an HUD-chromed frame in the right column; the left column carries
 * the dossier (program id stripe, badge, title, description, meta strip,
 * CTAs). Background = grid + glow + scan-line stack used across the rest
 * of the site, NOT a full-bleed image.
 *
 * Reveal autoplays on load (preloader-aware), no pin. */
import { useRef } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { WordSplit } from '@/features/home/_shared/wordSplit';
import type { Course } from '@/content/courses/catalog';

const PRELOADER_SELECTOR = '[aria-label="Loading CyCraft"]';

const accentForLevel = (level: Course['level']) => {
  switch (level) {
    case 'Beginner':
      return 'var(--color-terminal)';
    case 'Intermediate':
      return 'var(--color-beam)';
    case 'Advanced':
    case 'Expert':
      return 'var(--color-red-team-glow)';
  }
};

const isOffensive = (level: Course['level']) =>
  level === 'Advanced' || level === 'Expert';

const formatInr = (v: number) => `₹${v.toLocaleString('en-IN')}`;

const programCode = (slug: string) =>
  `PROG_${slug.split('-')[0].toUpperCase().slice(0, 8)}`;

function BackArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 20V10" />
      <path d="M10 20V4" />
      <path d="M16 20v-8" />
      <path d="M22 20H2" />
    </svg>
  );
}

function PriceTagIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.59 13.41L13.41 20.59a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

/** Corner bracket — drawn in CSS via two short borders meeting at a corner.
 *  Used four times around the image frame as HUD chrome. */
function CornerBracket({
  position,
  color,
}: {
  position: 'tl' | 'tr' | 'bl' | 'br';
  color: string;
}) {
  const SIZE = 18;
  const off = -1;
  const borders: React.CSSProperties = {
    position: 'absolute',
    width: `${SIZE}px`,
    height: `${SIZE}px`,
    borderColor: color,
    borderStyle: 'solid',
  };
  switch (position) {
    case 'tl':
      Object.assign(borders, {
        top: off,
        left: off,
        borderWidth: '2px 0 0 2px',
      });
      break;
    case 'tr':
      Object.assign(borders, {
        top: off,
        right: off,
        borderWidth: '2px 2px 0 0',
      });
      break;
    case 'bl':
      Object.assign(borders, {
        bottom: off,
        left: off,
        borderWidth: '0 0 2px 2px',
      });
      break;
    case 'br':
      Object.assign(borders, {
        bottom: off,
        right: off,
        borderWidth: '0 2px 2px 0',
      });
      break;
  }
  return <span aria-hidden="true" style={borders} />;
}

interface CourseHeroProps {
  course: Course;
  longDescription?: string;
}

export default function CourseHero({ course, longDescription }: CourseHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const accent = accentForLevel(course.level);
  const offensive = isOffensive(course.level);
  const desc = longDescription ?? course.description;
  const progId = programCode(course.slug);
  const focusTag = course.categories[0] ?? 'PROGRAM';

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const revealTargets = [
        '.cd-hero-back',
        '.cd-hero-progstripe',
        '.cd-hero-badge',
        '.cd-hero-title [data-word]',
        '.cd-hero-desc [data-word]',
        '.cd-hero-meta',
        '.cd-hero-frame',
        '.cd-hero-frame-class',
      ];

      if (reducedMotion) {
        gsap.set(revealTargets, {
          opacity: 1,
          x: 0,
          y: 0,
          yPercent: 0,
          scale: 1,
          filter: 'none',
        });
        return;
      }

      gsap.set('.cd-hero-back', { opacity: 0, x: -12 });
      gsap.set('.cd-hero-progstripe', { opacity: 0, y: 8 });
      gsap.set('.cd-hero-badge', { opacity: 0, y: 12 });
      gsap.set('.cd-hero-title [data-word]', {
        opacity: 0,
        yPercent: 60,
        filter: 'blur(10px)',
      });
      gsap.set('.cd-hero-desc [data-word]', { opacity: 0, y: 8, filter: 'blur(4px)' });
      gsap.set('.cd-hero-meta', { opacity: 0, y: 14 });
      gsap.set('.cd-hero-frame', { opacity: 0, scale: 1.04 });
      gsap.set('.cd-hero-frame-class', { opacity: 0, y: -8 });

      const playEntry = () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.to('.cd-hero-back', { opacity: 1, x: 0, duration: 0.5 })
          .to('.cd-hero-frame', { opacity: 1, scale: 1, duration: 1.1, ease: 'power2.out' }, '-=0.3')
          .to('.cd-hero-frame-class', { opacity: 1, y: 0, duration: 0.45 }, '-=0.6')
          .to('.cd-hero-progstripe', { opacity: 1, y: 0, duration: 0.4 }, '-=0.9')
          .to('.cd-hero-badge', { opacity: 1, y: 0, duration: 0.45 }, '-=0.25')
          .to(
            '.cd-hero-title [data-word]',
            { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.05 },
            '-=0.25',
          )
          .to(
            '.cd-hero-desc [data-word]',
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, stagger: 0.018 },
            '-=0.35',
          )
          .to('.cd-hero-meta', { opacity: 1, y: 0, duration: 0.5 }, '-=0.2');
      };

      const preloader = document.querySelector<HTMLElement>(PRELOADER_SELECTOR);
      let observer: MutationObserver | null = null;
      let fallback: gsap.core.Tween | null = null;

      if (preloader && getComputedStyle(preloader).display !== 'none') {
        observer = new MutationObserver(() => {
          if (getComputedStyle(preloader).display === 'none') {
            observer?.disconnect();
            fallback?.kill();
            gsap.delayedCall(0.35, playEntry);
          }
        });
        observer.observe(preloader, { attributes: true, attributeFilter: ['style'] });
        fallback = gsap.delayedCall(5, () => {
          observer?.disconnect();
          playEntry();
        });
      } else {
        gsap.delayedCall(0.35, playEntry);
      }

      // After mount, give the page a moment to lay out then refresh
      // ScrollTrigger so the scroll-triggered sections downstream
      // (curriculum / operator-profile / deployment) measure their
      // start/end positions against the final layout. Without this,
      // client-side navigations to a different course can leave those
      // triggers with stale positions from the previous page.
      const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 400);

      return () => {
        observer?.disconnect();
        fallback?.kill();
        window.clearTimeout(refreshId);
      };
    },
    { scope: sectionRef, dependencies: [reducedMotion, course.slug] },
  );

  return (
    <section
      ref={sectionRef}
      id="cd-hero"
      aria-label={course.title}
      style={{
        position: 'relative',
        marginTop: '4rem', // clear the fixed navbar
        paddingTop: 'clamp(1.5rem, 3.5vh, 2.5rem)',
        paddingBottom: 'clamp(2rem, 5vh, 3.5rem)',
        overflow: 'hidden',
        background: 'transparent',
      }}
    >
      <style>{`
        .cd-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
          gap: clamp(1.5rem, 3vw, 3rem);
          align-items: start;
        }
        @media (max-width: 960px) {
          .cd-hero-grid {
            grid-template-columns: 1fr;
            gap: clamp(1.25rem, 3vw, 1.75rem);
          }
          .cd-hero-frame-wrap { order: -1; }
        }
        @media (max-width: 600px) {
          /* Narrow phones — give text more vertical breathing, shrink image */
          .cd-hero-frame { aspect-ratio: 16 / 10 !important; }
          .cd-hero-progstripe { row-gap: 0.35rem !important; }
          .cd-hero-frame-class {
            font-size: 9px !important;
            letter-spacing: 0.16em !important;
          }
        }
      `}</style>

      {/* L0 — soft directional gradient */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-8%',
          zIndex: 0,
          background:
            'radial-gradient(60% 50% at 30% 40%, rgba(168,240,255,0.05), transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* L0.5 — sweeping "security scan" beam (mirrors contact hero) */}
      {!reducedMotion && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: '180px',
            zIndex: 1,
            pointerEvents: 'none',
            background: offensive
              ? 'linear-gradient(to bottom, transparent 0%, rgba(255,61,90,0.10) 38%, rgba(255,61,90,0.26) 50%, rgba(255,61,90,0.10) 62%, transparent 100%)'
              : 'linear-gradient(to bottom, transparent 0%, rgba(168,240,255,0.10) 38%, rgba(168,240,255,0.28) 50%, rgba(168,240,255,0.10) 62%, transparent 100%)',
            animation: 'scan-line 6s linear infinite',
            willChange: 'transform',
          }}
        />
      )}

      {/* L1 — breathing glow pool */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '1100px',
          height: '720px',
          borderRadius: '50%',
          background: offensive
            ? 'radial-gradient(ellipse, rgba(255,61,90,0.10) 0%, rgba(255,61,90,0.025) 40%, transparent 70%)'
            : 'radial-gradient(ellipse, rgba(168,240,255,0.10) 0%, rgba(168,240,255,0.025) 40%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          animation: 'hero-glow-breathe 5s ease-in-out infinite',
          zIndex: 2,
          pointerEvents: 'none',
          willChange: 'transform, opacity',
        }}
      />

      {/* L2 — scan lines (static texture) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.018) 3px, rgba(255,255,255,0.018) 4px)',
          pointerEvents: 'none',
        }}
      />

      {/* L3 — content */}
      <div
        className="section-container"
        style={{ position: 'relative', zIndex: 3 }}
      >
        {/* Back link */}
        <Link
          href="/courses"
          className="cd-hero-back"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.2em',
            color: 'var(--color-text-secondary)',
            textDecoration: 'none',
            textTransform: 'uppercase',
            marginBottom: 'clamp(1rem, 2vh, 1.4rem)',
            willChange: 'transform, opacity',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--color-beam)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-text-secondary)';
          }}
        >
          <BackArrowIcon />
          Back to course index
        </Link>

        <div className="cd-hero-grid">
          {/* ── Left column — DOSSIER ─────────────────────────────── */}
          <div>
            {/* Program-ID stripe */}
            <div
              className="cd-hero-progstripe"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                columnGap: '0.7rem',
                rowGap: '0.25rem',
                marginBottom: '0.75rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--color-text-tertiary)',
                willChange: 'transform, opacity',
              }}
            >
              <span style={{ opacity: 0.5 }}>{'//'}</span>
              <span>{progId}</span>
              <span style={{ opacity: 0.35 }}>·</span>
              <span style={{ color: accent }}>CLASS_{course.level.toUpperCase()}</span>
              <span style={{ opacity: 0.35 }}>·</span>
              <span>{focusTag}_TRACK</span>
            </div>

            {/* Badge — "BRIEFING / DOSSIER" act label */}
            <div className="cd-hero-badge" style={{ marginBottom: '0.9rem' }}>
              <span
                style={{
                  display: 'inline-block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--color-beam)',
                  borderBottom: '1px solid rgba(168,240,255,0.3)',
                  paddingBottom: '3px',
                }}
              >
                {'// MISSION_BRIEFING / ACT_I'}
              </span>
            </div>

            {/* Title */}
            <h1
              className="cd-hero-title"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.6rem, 3.2vw, 2.65rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--color-text-primary)',
                lineHeight: 1.1,
                margin: '0 0 1rem',
                overflowWrap: 'break-word',
                willChange: 'transform, opacity, filter',
              }}
            >
              <WordSplit text={course.title} />
            </h1>

            {/* Long description */}
            <p
              className="cd-hero-desc"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-base)',
                color: 'var(--color-text-secondary)',
                maxWidth: '540px',
                margin: '0 0 1.25rem',
                lineHeight: 1.55,
              }}
            >
              <WordSplit text={desc} />
            </p>

            {/* Meta strip — mono pills */}
            <div
              className="cd-hero-meta"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                willChange: 'transform, opacity',
              }}
            >
              <MetaPill icon={<ClockIcon />} label={`${course.durationWeeks} WEEKS`} color="var(--color-beam)" />
              <MetaPill icon={<ChartIcon />} label={course.level.toUpperCase()} color={accent} />
              <MetaPill
                icon={<PriceTagIcon />}
                label={formatInr(course.priceInr)}
                color="var(--color-red-team-glow)"
              />
            </div>
          </div>

          {/* ── Right column — HUD-framed image ─────────────────────── */}
          <div className="cd-hero-frame-wrap" style={{ position: 'relative' }}>
            <div
              className="cd-hero-frame"
              style={{
                position: 'relative',
                aspectRatio: '16 / 11',
                width: '100%',
                background:
                  'linear-gradient(180deg, #1a1e26 0%, #0e1014 70%, #050608 100%)',
                overflow: 'hidden',
                border: `1px solid ${offensive ? 'rgba(255,61,90,0.28)' : 'rgba(168,240,255,0.22)'}`,
                willChange: 'transform, opacity',
              }}
            >
              {course.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={course.image}
                  alt=""
                  loading="eager"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'saturate(0.9) contrast(1.05)',
                  }}
                />
              )}

              {/* Vignette + scan lines inside frame */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(180deg, rgba(5,6,8,0.35) 0%, rgba(5,6,8,0) 35%, rgba(5,6,8,0.55) 100%)',
                  pointerEvents: 'none',
                }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage:
                    'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.04) 3px, rgba(255,255,255,0.04) 4px)',
                  mixBlendMode: 'overlay',
                  pointerEvents: 'none',
                }}
              />

              {/* Classification stripe — top */}
              <div
                className="cd-hero-frame-class"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  padding: '0.5rem 0.85rem',
                  background: 'rgba(8,10,14,0.65)',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: `1px solid ${offensive ? 'rgba(255,61,90,0.3)' : 'rgba(168,240,255,0.22)'}`,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: accent,
                  willChange: 'transform, opacity',
                }}
              >
                <span>
                  {'// '}CLASSIFIED · {course.level.toUpperCase()}
                </span>
                <span style={{ color: 'var(--color-text-tertiary)' }}>
                  REV.01
                </span>
              </div>

              {/* Corner brackets */}
              <CornerBracket position="tl" color={offensive ? 'var(--color-red-team)' : 'var(--color-beam)'} />
              <CornerBracket position="tr" color={offensive ? 'var(--color-red-team)' : 'var(--color-beam)'} />
              <CornerBracket position="bl" color={offensive ? 'var(--color-red-team)' : 'var(--color-beam)'} />
              <CornerBracket position="br" color={offensive ? 'var(--color-red-team)' : 'var(--color-beam)'} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetaPill({
  icon,
  label,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.55rem 0.9rem',
        background: 'rgba(13,16,20,0.55)',
        border: `1px solid ${color}55`,
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        color,
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
      }}
    >
      {icon}
      {label}
    </span>
  );
}
