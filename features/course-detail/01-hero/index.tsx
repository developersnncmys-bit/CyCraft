'use client';
/* Course Detail Hero — autoplay reveal on load.
 *
 * "Back to Courses" link + course title + long description + 3 meta pills
 * (duration, level, price). Mirrors the established hero pattern but
 * unbadged + left-aligned because the detail page reads like an article,
 * not a marketing landing — the title is the credential, the pills are
 * the metadata, and the next section (Mascot) does the visual work.
 */
import { useRef } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap/register';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { WordSplit } from '@/features/home/_shared/wordSplit';
import type { Course } from '@/content/courses/catalog';

const PRELOADER_SELECTOR = '[aria-label="Loading CyCraft"]';

const levelAccent = (level: Course['level']) => {
  switch (level) {
    case 'Beginner':
      return 'var(--color-terminal)';
    case 'Intermediate':
      return 'var(--color-beam)';
    case 'Advanced':
    case 'Expert':
      return 'var(--color-red-team)';
  }
};

const formatInr = (value: number) => `₹${value.toLocaleString('en-IN')}`;

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 20V10" />
      <path d="M10 20V4" />
      <path d="M16 20v-8" />
      <path d="M22 20H2" />
    </svg>
  );
}

function PriceTagIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.59 13.41L13.41 20.59a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

function BackArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

interface CourseHeroProps {
  course: Course;
  /** Optional long-form paragraph; falls back to catalogue short
   *  description when no detail entry exists for the slug yet. */
  longDescription?: string;
}

export default function CourseHero({ course, longDescription }: CourseHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const accent = levelAccent(course.level);
  const description = longDescription ?? course.description;

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const revealTargets = [
        '.cd-hero-back',
        '.cd-hero-title [data-word]',
        '.cd-hero-desc [data-word]',
        '.cd-hero-pill',
      ];

      if (reducedMotion) {
        gsap.set(revealTargets, { opacity: 1, y: 0, x: 0, filter: 'none' });
        return;
      }

      gsap.set('.cd-hero-back', { opacity: 0, x: -8 });
      gsap.set('.cd-hero-title [data-word]', {
        opacity: 0,
        yPercent: 60,
        filter: 'blur(10px)',
      });
      gsap.set('.cd-hero-desc [data-word]', { opacity: 0, y: 8, filter: 'blur(4px)' });
      gsap.set('.cd-hero-pill', { opacity: 0, y: 10 });

      const playEntry = () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.to('.cd-hero-back', { opacity: 1, x: 0, duration: 0.45 })
          .to(
            '.cd-hero-title [data-word]',
            { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.05 },
            '-=0.2',
          )
          .to(
            '.cd-hero-desc [data-word]',
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, stagger: 0.018 },
            '-=0.35',
          )
          .to(
            '.cd-hero-pill',
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 },
            '-=0.2',
          );
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

      return () => {
        observer?.disconnect();
        fallback?.kill();
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
        background: 'transparent',
        overflow: 'hidden',
        paddingTop: 'clamp(5rem, 10vh, 7rem)',
        paddingBottom: 'clamp(2rem, 5vh, 3rem)',
      }}
    >
      {/* Subtle aurora behind the hero */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-20%',
          zIndex: 0,
          background:
            'radial-gradient(35% 35% at 20% 30%, rgba(168,240,255,0.10), transparent 70%), radial-gradient(35% 35% at 80% 70%, rgba(120,90,255,0.08), transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="section-container"
        style={{ position: 'relative', zIndex: 2, maxWidth: '1100px' }}
      >
        {/* Back to Courses */}
        <Link
          href="/courses"
          className="cd-hero-back"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '2rem',
            padding: '0.4rem 0',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            letterSpacing: '0.04em',
            color: 'var(--color-beam)',
            textDecoration: 'none',
            transition: 'color 0.2s, transform 0.2s',
            willChange: 'transform, opacity',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.color = 'var(--color-beam-glow)';
            el.style.transform = 'translateX(-3px)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.color = 'var(--color-beam)';
            el.style.transform = 'translateX(0)';
          }}
        >
          <BackArrowIcon />
          Back to Courses
        </Link>

        {/* Title */}
        <h1
          className="cd-hero-title"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4.5vw, 4rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--color-text-primary)',
            margin: '0 0 1.5rem',
            lineHeight: 1.08,
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
            fontSize: 'var(--text-lg)',
            color: 'var(--color-text-secondary)',
            maxWidth: '820px',
            margin: '0 0 2.25rem',
            lineHeight: 1.7,
          }}
        >
          <WordSplit text={description} />
        </p>

        {/* Meta pills row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginTop: '0.5rem',
          }}
        >
          <span
            className="cd-hero-pill"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.55rem',
              padding: '0.6rem 1rem',
              border: '1px solid rgba(168,240,255,0.25)',
              background: 'rgba(168,240,255,0.04)',
              color: 'var(--color-beam)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              letterSpacing: '0.06em',
              willChange: 'transform, opacity',
            }}
          >
            <ClockIcon />
            {course.durationWeeks} Weeks
          </span>

          <span
            className="cd-hero-pill"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.55rem',
              padding: '0.6rem 1rem',
              border: `1px solid ${accent}55`,
              background: `${accent}10`,
              color: accent,
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              willChange: 'transform, opacity',
            }}
          >
            <ChartIcon />
            {course.level}
          </span>

          <span
            className="cd-hero-pill"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.55rem',
              padding: '0.6rem 1rem',
              border: '1px solid rgba(255,61,90,0.3)',
              background: 'rgba(255,61,90,0.06)',
              color: 'var(--color-red-team-glow)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.04em',
              willChange: 'transform, opacity',
            }}
          >
            <PriceTagIcon />
            {formatInr(course.priceInr)}
          </span>
        </div>
      </div>
    </section>
  );
}
