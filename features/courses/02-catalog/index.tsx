'use client';
/* Courses Catalog — pinned cinematic camera-pan scene.
 *
 * Pinned for +=600% (see PIN_DURATIONS.coursesCatalog). The whole catalog
 * sits inside an absolutely-positioned camera wrapper that pans upward as
 * the user scrolls — like credits rolling — while sub-scenes ignite at
 * fixed positions along the same timeline:
 *
 *   0.00–0.04  Badge fades in
 *   0.04–0.14  Headline morphs through 3 phrases (word swap)
 *   0.10–0.20  Stats count up dramatically (4 big numbers)
 *   0.20–0.28  Subhead reveal
 *   0.28–0.36  Filter rows slide in
 *   0.36–0.92  Camera pans upward, cards cascade in row-waves with depth
 *              + scale as they enter the visible window
 *   0.92–1.00  Camera scale 1 → 0.96, brief hold
 *
 * Three parallax depth layers drift through the entire pin window so the
 * background reads like there's space behind the grid.
 *
 * Filter chips remain interactive — filtered cards toggle display:none
 * (not opacity) so they don't fight the timeline. Cards re-enter in their
 * final animated state on unfilter.
 *
 * Mobile / reduced-motion: falls back to a simple scroll-trigger entry
 * animation (no pin) so phones can still browse the catalog naturally.
 */
import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { Badge } from '@/components/ui/Badge';
import {
  coursesCatalogContent,
  type Course,
  type CourseLevel,
} from '@/content/courses/catalog';

type LevelFilter = (typeof coursesCatalogContent.levelFilters)[number];
type CategoryFilter = (typeof coursesCatalogContent.categoryFilters)[number];

const STATS_ACCENT: Record<'beam' | 'terminal' | 'red-team', string> = {
  beam: 'var(--color-beam)',
  terminal: 'var(--color-terminal)',
  'red-team': 'var(--color-red-team)',
};

// Cyan-beam is the page's primary tone. Red appears only on Advanced and
// Expert (the offensive end of the spectrum) — same way red-team is used
// elsewhere on the site for aggression / offence.
const levelAccent = (level: CourseLevel) => {
  switch (level) {
    case 'Beginner':
      return 'var(--color-terminal)';
    case 'Intermediate':
      return 'var(--color-beam)';
    case 'Advanced':
      return 'var(--color-red-team)';
    case 'Expert':
      return 'var(--color-red-team-glow)';
  }
};

const isOffensive = (level: CourseLevel) => level === 'Advanced' || level === 'Expert';

function ClockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 20V10" />
      <path d="M10 20V4" />
      <path d="M16 20v-8" />
      <path d="M22 20H2" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  );
}

function formatInr(value: number) {
  return `₹${value.toLocaleString('en-IN')}`;
}

function FilterRow({
  label,
  ariaLabel,
  options,
  active,
  onSelect,
  trailing,
}: {
  label: string;
  ariaLabel: string;
  options: ReadonlyArray<string>;
  active: string;
  onSelect: (value: string) => void;
  trailing?: React.ReactNode;
}) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.6rem' }}
    >
      <span
        aria-hidden="true"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          letterSpacing: '0.22em',
          color: 'var(--color-text-tertiary)',
          textTransform: 'uppercase',
          marginRight: '0.4rem',
        }}
      >
        {label} /
      </span>
      {options.map((option) => {
        const isActive = active === option;
        return (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(option)}
            className="courses-catalog-filter"
            style={{
              padding: '0.55rem 1rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              background: isActive ? 'var(--color-beam)' : 'transparent',
              color: isActive ? 'var(--color-void)' : 'var(--color-text-secondary)',
              border: `1px solid ${
                isActive ? 'var(--color-beam)' : 'rgba(168,240,255,0.22)'
              }`,
              cursor: 'pointer',
              transition: 'background 0.2s, color 0.2s, border-color 0.2s',
              willChange: 'transform, opacity',
            }}
            onMouseEnter={(e) => {
              if (isActive) return;
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-beam)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-beam)';
            }}
            onMouseLeave={(e) => {
              if (isActive) return;
              (e.currentTarget as HTMLButtonElement).style.color =
                'var(--color-text-secondary)';
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                'rgba(168,240,255,0.22)';
            }}
          >
            {option}
          </button>
        );
      })}
      {trailing}
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  const accent = levelAccent(course.level);
  const offensive = isOffensive(course.level);
  // Defensive/learning cards stay on the beam tone; offensive cards (Advanced
  // / Expert) take the red-team treatment for hover + border so the duality
  // reads at-a-glance, matching how btech tracks splits red vs cyan.
  const baseBorder = offensive ? 'rgba(255,61,90,0.22)' : 'rgba(168,240,255,0.18)';
  const hoverBorder = offensive ? 'var(--color-red-team)' : 'var(--color-beam)';
  const hoverGlow = offensive
    ? '0 22px 50px rgba(0,0,0,0.55), 0 0 38px rgba(255,61,90,0.28)'
    : '0 22px 50px rgba(0,0,0,0.55), 0 0 38px rgba(77,217,255,0.26)';
  const ctaColor = offensive ? 'var(--color-red-team)' : 'var(--color-beam)';
  const badgeBg = offensive ? 'var(--color-red-team)' : 'var(--color-beam)';
  const badgeColor = offensive ? '#fff' : 'var(--color-void)';
  const focusTag = course.categories[0] ?? 'PROGRAM';

  return (
    // Next.js <Link> instead of <a> so navigating to the detail page is a
    // soft client-side route change. Using a plain <a href> caused a full
    // page reload, which re-evaluated the JS bundle and reset the
    // Preloader's `hasPlayed` module flag — the boot sequence then played
    // again on every card click.
    <Link
      className="courses-card"
      href={`/courses/${course.slug}`}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background:
          'linear-gradient(180deg, rgba(20,24,30,0.85) 0%, var(--color-carbon) 60%)',
        border: `1px solid ${baseBorder}`,
        textDecoration: 'none',
        color: 'inherit',
        transition: 'transform 0.35s cubic-bezier(.2,.7,.2,1), border-color 0.3s, box-shadow 0.3s',
        willChange: 'transform, opacity',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(-8px)';
        el.style.borderColor = hoverBorder;
        el.style.boxShadow = hoverGlow;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(0)';
        el.style.borderColor = baseBorder;
        el.style.boxShadow = 'none';
      }}
    >
      {/* ── IMAGE PANEL ─────────────────────────────────────────
          Pexels image overlay on top of a gradient fallback. If
          the image 404s (onError), it hides itself revealing the
          gradient + 3-letter glyph underneath, so the card never
          breaks. */}
      <div
        aria-hidden="true"
        style={{
          position: 'relative',
          height: '210px',
          background:
            'linear-gradient(180deg, #2a2e36 0%, #181b21 70%, #0e1014 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Fallback 3-letter glyph (visible only if image fails) */}
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '3.6rem',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: 'rgba(255,255,255,0.08)',
            textTransform: 'uppercase',
          }}
        >
          {course.title.split(/\s+/)[0].slice(0, 3)}
        </span>

        {course.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.image}
            alt=""
            loading="lazy"
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
              zIndex: 1,
              transition: 'transform 0.6s cubic-bezier(.2,.7,.2,1)',
            }}
            className="courses-card-img"
          />
        )}

        {/* Cinematic gradient — dark at top for badge legibility,
            very dark at bottom blending into the card body. */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            background:
              'linear-gradient(180deg, rgba(8,10,14,0.55) 0%, rgba(8,10,14,0) 30%, rgba(8,10,14,0.55) 70%, var(--color-carbon) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Subtle horizontal scanlines over image — terminal feel */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.025) 3px, rgba(255,255,255,0.025) 4px)',
            pointerEvents: 'none',
            mixBlendMode: 'overlay',
          }}
        />

        {/* Top-left: focus-area tag in terminal style */}
        <span
          style={{
            position: 'absolute',
            top: '0.9rem',
            left: '0.9rem',
            zIndex: 3,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.6rem',
            background: 'rgba(8,10,14,0.65)',
            backdropFilter: 'blur(6px)',
            border: `1px solid ${offensive ? 'rgba(255,61,90,0.35)' : 'rgba(168,240,255,0.3)'}`,
            color: ctaColor,
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
          }}
        >
          <span aria-hidden="true" style={{ opacity: 0.6 }}>{'//'}</span>
          {focusTag}
        </span>

        {/* Top-right: notched-corner level badge */}
        <span
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            zIndex: 3,
            padding: '0.45rem 0.95rem 0.45rem 1.4rem',
            background: badgeBg,
            color: badgeColor,
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            clipPath: 'polygon(14px 0, 100% 0, 100% 100%, 0 100%)',
          }}
        >
          {course.level}
        </span>

      </div>

      {/* ── BODY ──────────────────────────────────────────────── */}
      <div
        style={{
          padding: '1.35rem 1.4rem 1.4rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          flex: 1,
        }}
      >
        {/* Slug tag — program code feel */}
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--color-text-tertiary)',
          }}
        >
          {`PROG_${course.slug.split('-')[0].toUpperCase().slice(0, 8)}`}
        </span>

        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.3rem',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            margin: 0,
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
          }}
        >
          {course.title}
        </h3>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-base)',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {course.description}
        </p>

        {/* Meta row — duration · level · price, terminal style */}
        <div
          style={{
            marginTop: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem 0.7rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.1em',
            color: 'var(--color-text-tertiary)',
            textTransform: 'uppercase',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <ClockIcon /> {course.durationWeeks}W
          </span>
          <span aria-hidden="true" style={{ opacity: 0.35 }}>|</span>
          <span
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: accent }}
          >
            <ChartIcon /> {course.level}
          </span>
          <span aria-hidden="true" style={{ opacity: 0.35 }}>|</span>
          <span style={{ color: 'var(--color-text-primary)', fontWeight: 700 }}>
            {formatInr(course.priceInr)}
          </span>
        </div>

        {/* CTA row — beam/red accent, arrow translates on card hover */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 'auto',
            paddingTop: '1rem',
            borderTop: `1px solid ${offensive ? 'rgba(255,61,90,0.18)' : 'rgba(168,240,255,0.15)'}`,
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: ctaColor,
          }}
        >
          <span>Access Briefing</span>
          <span className="courses-card-arrow" aria-hidden="true">
            <BoltIcon />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function CoursesCatalog() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();
  const [activeLevel, setActiveLevel] = useState<LevelFilter>('All');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');

  const visibleCourses = useMemo(() => {
    return coursesCatalogContent.courses.filter((c) => {
      const levelOk = activeLevel === 'All' || c.level === activeLevel;
      const categoryOk =
        activeCategory === 'All' ||
        (c.categories as ReadonlyArray<string>).includes(activeCategory);
      return levelOk && categoryOk;
    });
  }, [activeLevel, activeCategory]);

  // ────────────────────────────────────────────────────────────────
  // Cinematic pinned camera-pan (desktop). Mobile / reduced-motion
  // fall back to a simple scroll-trigger entry animation below.
  // ────────────────────────────────────────────────────────────────
  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      // Reduced motion: snap everything to its final composed state.
      if (reducedMotion) {
        gsap.set(
          [
            '.courses-catalog-bg',
            '.courses-catalog-scan',
            '.courses-catalog-glow',
            '.courses-catalog-camera-el',
            '.courses-catalog-badge',
            '.courses-catalog-heading-morph',
            '.courses-catalog-sub',
            '.courses-catalog-stat',
            '.courses-catalog-stat-value',
            '.courses-catalog-filter',
            '.courses-card',
          ],
          { opacity: 1, x: 0, y: 0, scale: 1, filter: 'none', clearProps: 'transform' },
        );
        gsap.set('.courses-catalog-heading-morph:first-child', { opacity: 1 });
        gsap.set('.courses-catalog-heading-morph:not(:first-child)', { opacity: 0 });
        // Set the final number into each stat without animating.
        root.querySelectorAll<HTMLElement>('.courses-catalog-stat-value').forEach((el) => {
          const target = el.dataset.target;
          if (target) el.textContent = target;
        });
        return;
      }

      // Mobile fallback: a single scroll-trigger entry, no pin.
      // `toggleActions: 'play none none none'` (no reset on leaveBack) so
      // once the entry plays it stays composed — avoids the "scroll past
      // and back to make texts appear" bug where a stale trigger position
      // (measured before mobile CSS settled) reset everything to opacity:0
      // and never replayed on the user's down-scroll.
      // `start: 'top 95%'` fires as soon as the section starts entering
      // the viewport — more forgiving than `top 80%` if measurements drift.
      if (!isDesktop) {
        const trigger = {
          trigger: root,
          start: 'top 95%',
          toggleActions: 'play none none none',
        };
        gsap.fromTo(
          '.courses-catalog-badge',
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, scrollTrigger: trigger },
        );
        gsap.set('.courses-catalog-heading-morph:not(:first-child)', { opacity: 0 });
        gsap.fromTo(
          '.courses-catalog-heading-morph:first-child',
          { opacity: 0, y: 16, filter: 'blur(8px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.7,
            delay: 0.15,
            scrollTrigger: trigger,
          },
        );
        gsap.fromTo(
          '.courses-catalog-sub',
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.5, delay: 0.45, scrollTrigger: trigger },
        );
        // Stats: simple count up on entry
        root.querySelectorAll<HTMLElement>('.courses-catalog-stat-value').forEach((el, i) => {
          const target = Number(el.dataset.target);
          const counter = { v: 0 };
          gsap.to(counter, {
            v: target,
            duration: 1.2,
            delay: 0.55 + i * 0.12,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = Math.round(counter.v).toString();
            },
            scrollTrigger: trigger,
          });
        });
        gsap.fromTo(
          '.courses-catalog-stat',
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            delay: 0.55,
            scrollTrigger: trigger,
          },
        );
        gsap.fromTo(
          '.courses-catalog-filter',
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.04,
            delay: 1.0,
            scrollTrigger: trigger,
          },
        );
        const cards = gridRef.current?.querySelectorAll<HTMLElement>('.courses-card');
        if (cards && cards.length > 0) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 40, scale: 0.96 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              stagger: 0.05,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: gridRef.current,
                start: 'top 95%',
                toggleActions: 'play none none none',
              },
            },
          );
        }

        // After the mobile setup finishes laying out, refresh once so the
        // trigger start/end positions catch any layout shifts from the
        // mobile CSS overrides (camera goes static, section grows tall).
        const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 200);
        return () => window.clearTimeout(refreshId);
      }

      // ── Desktop cinematic — pinned camera-pan with sub-scenes ─────────
      const camera = root.querySelector<HTMLElement>('.courses-catalog-camera-el');
      if (!camera) return;

      // Initial hidden state
      gsap.set('.courses-catalog-badge', { opacity: 0, y: 18 });
      gsap.set('.courses-catalog-heading-morph', { opacity: 0, yPercent: 60, filter: 'blur(10px)' });
      gsap.set('.courses-catalog-sub', { opacity: 0, y: 20, filter: 'blur(4px)' });
      gsap.set('.courses-catalog-stat', { opacity: 0, y: 28 });
      gsap.set('.courses-catalog-stat-value', { textContent: '0' });
      gsap.set('.courses-catalog-filter', { opacity: 0, y: 14 });
      gsap.set('.courses-card', { opacity: 0, y: 60, scale: 0.9 });
      gsap.set(camera, { y: 0, scale: 1, transformOrigin: 'top center' });

      // Pin-and-scrub timeline. invalidateOnRefresh because the camera-pan
      // distance depends on dynamically-measured camera/grid height.
      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_DURATIONS.coursesCatalog,
        scrub: 1,
        enabled: true,
        invalidateOnRefresh: true,
      });

      // ── Camera pan — runs from 0.36 to 0.92 (the "credits" window) ───
      // Computed lazily so dynamic content height is current at each refresh.
      tl.to(
        camera,
        {
          y: () => {
            const cameraHeight = camera.offsetHeight;
            const viewportHeight = window.innerHeight;
            // Pan exactly enough to scroll the whole camera contents into view.
            return -(cameraHeight - viewportHeight);
          },
          ease: 'none',
          duration: 0.56,
        },
        0.36,
      );

      // ── Parallax depth layers — drift across the entire pin window ───
      tl.to('.courses-catalog-bg', { yPercent: -8, duration: 1, ease: 'none' }, 0);
      tl.to('.courses-catalog-scan', { yPercent: -28, duration: 1, ease: 'none' }, 0);
      tl.to(
        '.courses-catalog-glow',
        { yPercent: -24, scale: 1.3, opacity: 0.55, duration: 1, ease: 'none' },
        0,
      );

      // ── 0.00-0.04 Badge ──────────────────────────────────────────────
      tl.to('.courses-catalog-badge', { opacity: 1, y: 0, duration: 0.04, ease: 'power2.out' }, 0);

      // ── 0.04-0.20 Headline morph (3 phrases) ─────────────────────────
      // Each phrase fades in via a short scrub tween, holds, then SNAPS
      // out (tl.set, 0-duration) just before the next phrase appears.
      // The snap-out instead of a fade-out is the fix for the previous
      // glitch where pausing mid-scrub showed two morphs stacked (old
      // morph mid-fade-out at yPercent:-50, new morph mid-fade-in).
      // With set, exactly one morph is visible at any scroll position —
      // the bidirectional scrub still reverses cleanly.
      const morphs = root.querySelectorAll<HTMLElement>('.courses-catalog-heading-morph');
      const MORPH_GAP = 0.06;
      const MORPH_FADE = 0.02;
      morphs.forEach((el, i) => {
        const inAt = 0.04 + i * MORPH_GAP;
        tl.fromTo(
          el,
          { opacity: 0, yPercent: 30, filter: 'blur(8px)' },
          {
            opacity: 1,
            yPercent: 0,
            filter: 'blur(0px)',
            duration: MORPH_FADE,
            ease: 'power3.out',
          },
          inAt,
        );
        if (i < morphs.length - 1) {
          const nextInAt = 0.04 + (i + 1) * MORPH_GAP;
          // Snap-out 1ms before the next phrase fades in — no overlap.
          tl.set(
            el,
            { opacity: 0, yPercent: -30, filter: 'blur(8px)' },
            nextInAt - 0.001,
          );
        }
      });

      // ── 0.22-0.32 Stats wrappers fade in via scrub ──────────────────
      const stats = root.querySelectorAll<HTMLElement>('.courses-catalog-stat');
      stats.forEach((statEl, i) => {
        const at = 0.22 + i * 0.022;
        tl.to(statEl, { opacity: 1, y: 0, duration: 0.05, ease: 'power2.out' }, at);
      });

      // ── 0.22 Stats COUNT-UP fires once as a non-scrub tween ─────────
      // Putting the count animation inside the scrub timeline meant
      // pausing scroll mid-count froze the numbers at intermediate
      // values (e.g. "18 / 21" on Programs). Firing the count as an
      // independent gsap.to lets it play to completion regardless of
      // scroll position. A latch ref prevents re-firing on backward
      // scrubs.
      const countersStarted = { current: false };
      tl.call(
        () => {
          if (countersStarted.current) return;
          countersStarted.current = true;
          stats.forEach((statEl, i) => {
            const valueEl = statEl.querySelector<HTMLElement>(
              '.courses-catalog-stat-value',
            );
            if (!valueEl) return;
            const target = Number(valueEl.dataset.target ?? 0);
            const counter = { v: 0 };
            gsap.to(counter, {
              v: target,
              duration: 1.4,
              delay: i * 0.18,
              ease: 'power2.out',
              onUpdate: () => {
                valueEl.textContent = Math.round(counter.v).toString();
              },
            });
          });
        },
        undefined,
        0.22,
      );

      // ── 0.30-0.36 Subhead reveal ────────────────────────────────────
      tl.to(
        '.courses-catalog-sub',
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.06, ease: 'power2.out' },
        0.30,
      );

      // ── 0.32-0.36 Filter rows slide in ──────────────────────────────
      tl.to(
        '.courses-catalog-filter',
        { opacity: 1, y: 0, duration: 0.04, stagger: 0.008, ease: 'power3.out' },
        0.32,
      );

      // ── 0.36-0.85 Cards cascade as camera pans past them ────────────
      // Card stagger window aligns roughly with the pan so each card lands
      // just as the camera reaches its visible row.
      tl.to(
        '.courses-card',
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.12,
          stagger: 0.018,
          ease: 'power3.out',
        },
        0.36,
      );

      // ── 0.92-1.00 Camera scale pull-back ────────────────────────────
      tl.to(camera, { scale: 0.96, duration: 0.08, ease: 'power2.inOut' }, 0.92);
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  // Filter changes during a pinned scrub: just toggle visibility of
  // filtered-out cards via React (display:none on the wrapper) so we
  // don't fight the baked timeline. No re-stagger.
  useGSAP(
    () => {
      if (reducedMotion) return;
      // Touch ScrollTrigger so the camera-pan length re-measures after a
      // filter change (visible card count affects total camera height).
      ScrollTrigger.refresh();
    },
    { scope: sectionRef, dependencies: [activeLevel, activeCategory] },
  );

  return (
    <section
      ref={sectionRef}
      id="courses-catalog"
      aria-label="Course catalogue"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <style>{`
        .courses-catalog-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(1.25rem, 2.4vw, 2rem);
        }
        @media (max-width: 1024px) {
          .courses-catalog-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 640px) {
          .courses-catalog-grid { grid-template-columns: 1fr; }
        }
        .courses-catalog-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: clamp(1rem, 2vw, 2rem);
        }
        @media (max-width: 900px) {
          .courses-catalog-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        .courses-catalog-headline {
          position: relative;
          display: block;
          min-height: clamp(2.5rem, 6vw, 5.5rem);
        }
        .courses-catalog-heading-morph {
          position: absolute;
          inset: 0;
          display: block;
          will-change: transform, opacity, filter;
        }
        /* Card hover micro-animations: image gently zooms, CTA arrow
           translates right. Pure CSS so we don't add JS listeners per card. */
        .courses-card-arrow {
          display: inline-flex;
          align-items: center;
          transition: transform 0.3s cubic-bezier(.2,.7,.2,1);
        }
        .courses-card:hover .courses-card-arrow {
          transform: translateX(5px);
        }
        .courses-card:hover .courses-card-img {
          transform: scale(1.06);
        }

        /* ── Mobile (< 1024px) — pin is disabled in JS, so we also need
           to let the section size to its real content. On desktop the
           camera is absolute-positioned and pans up via GSAP; on mobile
           that pattern leaves the cards beyond 100vh clipped by the
           section's overflow:hidden. Switch the camera back to normal
           flow and let the section grow.
           Keep overflow:hidden on the section — the parallax layers use
           inset:-5%/-8% and would otherwise push horizontal scroll past
           the viewport (which knocks the fixed navbar's hamburger off
           the right edge of the screen). */
        @media (max-width: 1023px) {
          #courses-catalog {
            min-height: auto !important;
          }
          .courses-catalog-camera-el {
            position: static !important;
          }
        }
      `}</style>

      {/* ── Parallax depth layers — drift through the pin window ── */}
      <div
        aria-hidden="true"
        className="courses-catalog-bg"
        style={{
          position: 'absolute',
          inset: '-8%',
          zIndex: 1,
          background:
            'radial-gradient(60% 60% at 50% 30%, rgba(168,240,255,0.05), transparent 70%)',
          pointerEvents: 'none',
          willChange: 'transform',
        }}
      />
      <div
        aria-hidden="true"
        className="courses-catalog-scan"
        style={{
          position: 'absolute',
          inset: '-5%',
          zIndex: 2,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.014) 3px, rgba(255,255,255,0.014) 4px)',
          pointerEvents: 'none',
          willChange: 'transform',
        }}
      />
      <div
        aria-hidden="true"
        className="courses-catalog-glow"
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          width: '1200px',
          height: '780px',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse, rgba(168,240,255,0.08) 0%, rgba(168,240,255,0.025) 40%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          zIndex: 3,
          pointerEvents: 'none',
          willChange: 'transform, opacity',
        }}
      />

      {/* ── Camera wrapper — absolutely positioned, pans up with scroll ── */}
      <div
        className="courses-catalog-camera-el"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 6,
          paddingTop: 'clamp(5rem, 10vh, 7rem)',
          paddingBottom: 'clamp(4rem, 8vh, 6rem)',
          willChange: 'transform',
        }}
      >
        <div
          className="section-container"
          style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 'clamp(2rem, 4vw, 3rem)' }}
        >
          {/* Header block: badge + morphing headline + stats counter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
            <div className="courses-catalog-badge" style={{ alignSelf: 'flex-start' }}>
              <Badge label={coursesCatalogContent.badge} />
            </div>

            <h2
              className="courses-catalog-headline"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-display-md)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                textTransform: 'uppercase',
                color: 'var(--color-text-primary)',
                margin: 0,
                lineHeight: 1.08,
              }}
            >
              {coursesCatalogContent.headingMorphs.map((phrase, i) => (
                <span
                  key={phrase}
                  className="courses-catalog-heading-morph"
                  aria-hidden={i === coursesCatalogContent.headingMorphs.length - 1 ? undefined : 'true'}
                >
                  {phrase}
                </span>
              ))}
            </h2>

            <p
              className="courses-catalog-sub"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-lg)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.65,
                margin: 0,
                maxWidth: '880px',
                willChange: 'transform, opacity, filter',
              }}
            >
              {coursesCatalogContent.subhead}
            </p>

            {/* Dramatic stats counter — 4 big numbers count up */}
            <div className="courses-catalog-stats">
              {coursesCatalogContent.stats.map((stat) => {
                const color = STATS_ACCENT[stat.accent];
                return (
                  <div
                    key={stat.label}
                    className="courses-catalog-stat"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      padding: 'clamp(1rem, 2vw, 1.5rem)',
                      borderLeft: `2px solid ${color}`,
                      background: 'rgba(13,16,20,0.45)',
                      backdropFilter: 'blur(4px)',
                      willChange: 'transform, opacity',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'baseline',
                        gap: '0.15rem',
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(2.25rem, 5.5vw, 3.5rem)',
                        fontWeight: 700,
                        letterSpacing: '-0.04em',
                        color,
                        lineHeight: 1,
                        textShadow: `0 0 28px ${color}`,
                      }}
                    >
                      <span
                        className="courses-catalog-stat-value"
                        data-target={stat.value}
                      >
                        0
                      </span>
                      {stat.suffix && <span aria-hidden="true">{stat.suffix}</span>}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: 'var(--color-text-tertiary)',
                      }}
                    >
                      {stat.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cards block — filter chips live INSIDE this group so they read
              as the header of the grid, not as a stranded row hanging off
              the catalogue intro. Tighter internal gap binds chips to the
              grid; the parent gap-clamp separates this block from the
              stats/headline above it. */}
          <div
            className="courses-catalog-cards-block"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(1.25rem, 2vw, 1.75rem)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <FilterRow
                label="Level"
                ariaLabel="Filter by difficulty level"
                options={coursesCatalogContent.levelFilters}
                active={activeLevel}
                onSelect={(v) => setActiveLevel(v as LevelFilter)}
              />
              <FilterRow
                label="Focus"
                ariaLabel="Filter by category focus area"
                options={coursesCatalogContent.categoryFilters}
                active={activeCategory}
                onSelect={(v) => setActiveCategory(v as CategoryFilter)}
                trailing={
                  <span
                    style={{
                      marginLeft: 'auto',
                      alignSelf: 'center',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      letterSpacing: '0.18em',
                      color: 'var(--color-text-tertiary)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {visibleCourses.length} / {coursesCatalogContent.courses.length} Programs
                  </span>
                }
              />
            </div>

            {/* Cards grid — cards remain in the DOM (filter via display) so
                the baked timeline doesn't fight React's reordering. */}
            <div ref={gridRef} className="courses-catalog-grid">
              {coursesCatalogContent.courses.map((course) => {
                const levelOk = activeLevel === 'All' || course.level === activeLevel;
                const categoryOk =
                  activeCategory === 'All' ||
                  (course.categories as ReadonlyArray<string>).includes(activeCategory);
                const visible = levelOk && categoryOk;
                return (
                  <div
                    key={course.slug}
                    style={{ display: visible ? 'block' : 'none', height: '100%' }}
                  >
                    <CourseCard course={course} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
