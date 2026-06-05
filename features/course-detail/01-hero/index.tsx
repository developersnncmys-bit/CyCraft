'use client';
/* Course Detail Hero — full-bleed image backdrop (mirrors the research
 * detail header pattern at features/research-detail/01-header).
 *
 * `course.image` (same Pexels URL as the catalog card) fills the section
 * edge-to-edge; layered overlays (darkening gradient + scan lines) keep
 * the text legible. Back link sits top-left, the chip + title +
 * description + meta pills flow at the bottom via marginTop:auto.
 *
 * Animations:
 *   - Image fades in scaled and parallaxes on scroll (rd-style)
 *   - Back link, chip, title words, description words, pills stagger in
 *     after the Preloader finishes (or 5s fallback)
 */
import { useRef } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
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
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
        '.cd-hero-chip',
        '.cd-hero-title [data-word]',
        '.cd-hero-desc [data-word]',
        '.cd-hero-pill',
      ];

      if (reducedMotion) {
        gsap.set(revealTargets, { opacity: 1, y: 0, x: 0, yPercent: 0, filter: 'none' });
        gsap.set('.cd-hero-image', { scale: 1, opacity: 1 });
        return;
      }

      gsap.set('.cd-hero-back', { opacity: 0, x: -12 });
      gsap.set('.cd-hero-chip', { opacity: 0, y: 10 });
      gsap.set('.cd-hero-title [data-word]', {
        opacity: 0,
        yPercent: 60,
        filter: 'blur(10px)',
      });
      gsap.set('.cd-hero-desc [data-word]', { opacity: 0, y: 8, filter: 'blur(4px)' });
      gsap.set('.cd-hero-pill', { opacity: 0, y: 10 });

      const playEntry = () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.fromTo(
          '.cd-hero-image',
          { opacity: 0, scale: 1.08 },
          { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' },
        )
          .to('.cd-hero-back', { opacity: 1, x: 0, duration: 0.45 }, '-=0.9')
          .to('.cd-hero-chip', { opacity: 1, y: 0, duration: 0.4 }, '-=0.5')
          .to(
            '.cd-hero-title [data-word]',
            { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.05 },
            '-=0.3',
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

      // Parallax on the image as the user scrolls past the hero.
      gsap.to('.cd-hero-image', {
        yPercent: 12,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        } as ScrollTrigger.Vars,
      });

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
        // Navbar is fixed h-16 (4rem). Push the section down so the image
        // starts below it rather than slipping behind it.
        marginTop: '4rem',
        minHeight: 'clamp(420px, 75vh, 680px)',
        overflow: 'hidden',
        background: 'var(--color-void)',
      }}
    >
      {/* L0 — full-bleed hero image (course.image, same as the card) */}
      {course.image && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            overflow: 'hidden',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="cd-hero-image"
            src={course.image}
            alt=""
            loading="eager"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
            style={{
              width: '100%',
              height: '110%',
              objectFit: 'cover',
              display: 'block',
              willChange: 'transform, opacity',
            }}
          />
        </div>
      )}

      {/* L1 — darkening gradient overlay (keeps text legible) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background:
            'linear-gradient(180deg, rgba(5,6,8,0.45) 0%, rgba(5,6,8,0.55) 45%, rgba(5,6,8,0.85) 80%, rgba(5,6,8,1) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* L2 — scan lines for subtle cyber texture over the image */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.015) 3px, rgba(255,255,255,0.015) 4px)',
          pointerEvents: 'none',
        }}
      />

      {/* L3 — content. Back link at top-left, chip + title + description
          + pills at the bottom via marginTop:auto on the section-container. */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          minHeight: 'clamp(420px, 75vh, 680px)',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: 'clamp(2rem, 5vh, 3.5rem)',
          paddingBottom: 'clamp(3rem, 7vh, 5rem)',
          paddingInline: 'var(--section-padding)',
        }}
      >
        <Link
          href="/courses"
          className="cd-hero-back"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.18em',
            color: '#ffffff',
            opacity: 0.85,
            textDecoration: 'none',
            textTransform: 'uppercase',
            alignSelf: 'flex-start',
            willChange: 'transform, opacity',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.textShadow = '0 0 12px rgba(168,240,255,0.55)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0.85';
            e.currentTarget.style.textShadow = 'none';
          }}
        >
          <BackArrowIcon />
          Back to Courses
        </Link>

        <div
          style={{
            marginTop: 'auto',
            maxWidth: '1100px',
          }}
        >
          {/* Chip: LEVEL • CATEGORY — accent-coloured per difficulty */}
          <div
            className="cd-hero-chip"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.7rem',
              padding: '0.4rem 0.9rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.22em',
              color: accent,
              textTransform: 'uppercase',
              marginBottom: '1.25rem',
              background: 'rgba(8,10,14,0.5)',
              border: `1px solid ${accent}55`,
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              willChange: 'transform, opacity',
            }}
          >
            <span>{course.level}</span>
            <span aria-hidden="true" style={{ opacity: 0.5 }}>•</span>
            <span>{course.categories[0]}</span>
          </div>

          {/* Title */}
          <h1
            className="cd-hero-title"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.85rem, 4.2vw, 3.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: '#ffffff',
              lineHeight: 1.08,
              margin: '0 0 1.25rem',
              maxWidth: '900px',
              textShadow: '0 4px 24px rgba(0,0,0,0.6)',
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
              color: 'rgba(255,255,255,0.85)',
              maxWidth: '720px',
              margin: '0 0 1.75rem',
              lineHeight: 1.65,
              textShadow: '0 2px 12px rgba(0,0,0,0.5)',
            }}
          >
            <WordSplit text={description} />
          </p>

          {/* Meta pills row — same 3 pills as before but restyled for
              an image backdrop (semi-opaque carbon + accent border). */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <span
              className="cd-hero-pill"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                padding: '0.55rem 1rem',
                border: '1px solid rgba(168,240,255,0.35)',
                background: 'rgba(8,10,14,0.55)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
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
                padding: '0.55rem 1rem',
                border: `1px solid ${accent}66`,
                background: 'rgba(8,10,14,0.55)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
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
                padding: '0.55rem 1rem',
                border: '1px solid rgba(255,61,90,0.4)',
                background: 'rgba(8,10,14,0.55)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
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
      </div>
    </section>
  );
}
