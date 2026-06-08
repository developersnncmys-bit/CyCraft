'use client';
/* Course Detail — Act II — Curriculum Timeline (PINNED CINEMA).
 *
 * On desktop this section pins for +=600% of scroll and scrubs the
 * timeline against scroll input — the cinematic centrepiece of the per-
 * course detail experience.
 *
 *   Timeline (scrub 0 → 1):
 *     0.00-0.04  Badge ignites
 *     0.04-0.32  Headline morphs through 3 phrases (per-phrase fade-in,
 *                snap-out before next so only one is ever visible). Wide
 *                spread so each phrase holds for a deliberate scroll budget
 *                instead of flashing past.
 *     0.04-0.16  Stat tiles fade up (wrappers)
 *     —          Stats COUNT UP fires once via a separate ScrollTrigger
 *                so the numbers tick from 0 → target as the section enters
 *                viewport, independent of where scrub lands
 *     0.34-0.40  Sub paragraph reveal (lands after morph resolves)
 *     0.36-0.92  Camera pans content upward (credits-style), module
 *                cards cascade in row-waves as each enters the visible
 *                window. The vertical rail + numbered nodes ride along.
 *     0.92-1.00  Camera scale pull-back beat
 *
 *   Parallax layers (drift through entire pin window):
 *     L-1  Subtle grid radial gradient, slow yPercent drift
 *     L0   Glow pool (breathes via CSS keyframe), scales + drifts
 *     L1   Scan lines (static repeating gradient)
 *     L2   Vignette (radial mask) — bleed colour shifts toward the level
 *          accent as scrub progresses, giving a subtle in-pin background
 *          colour shift
 *
 *   Mobile / reduced-motion / no syllabus: falls back to the previous
 *   scroll-triggered reveal pattern. Section is no longer pinned;
 *   content flows naturally and each module ignites on its own trigger.
 */
import { useMemo, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import type { Course } from '@/content/courses/catalog';

interface CourseCurriculumProps {
  course: Course;
  syllabus: readonly string[] | null;
}

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

const isOffensiveLevel = (level: Course['level']) =>
  level === 'Advanced' || level === 'Expert';

const pad2 = (n: number) => n.toString().padStart(2, '0');

export default function CourseCurriculum({ course, syllabus }: CourseCurriculumProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();

  const accent = accentForLevel(course.level);
  const offensive = isOffensiveLevel(course.level);
  const modules = useMemo(() => syllabus ?? [], [syllabus]);
  const moduleCount = modules.length;

  const headlineMorphs = useMemo(
    () => [
      `The ${course.durationWeeks}-week operator track`,
      moduleCount > 0
        ? `${moduleCount} modules. End to end.`
        : 'A practitioner-built track.',
      'Built around real engagements.',
    ],
    [course.durationWeeks, moduleCount],
  );

  // Dramatic stats — derived from existing course data so no per-course
  // authoring is needed. Engaged-hours assumes ~15h/week cohort cadence;
  // lab-exercises assumes ~3 per module.
  const stats = useMemo(
    () => [
      {
        value: course.durationWeeks,
        suffix: 'w',
        label: 'Duration',
        color: 'var(--color-beam)',
      },
      {
        value: Math.max(moduleCount, 1),
        suffix: '',
        label: 'Modules',
        color: 'var(--color-terminal)',
      },
      {
        value: course.durationWeeks * 15,
        suffix: 'h',
        label: 'Engaged Hours',
        color: 'var(--color-beam)',
      },
      {
        value: Math.max(moduleCount * 3, 12),
        suffix: '+',
        label: 'Lab Exercises',
        color: 'var(--color-red-team-glow)',
      },
    ],
    [course.durationWeeks, moduleCount],
  );

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const allTargets = [
        '.cd-cur-badge',
        '.cd-cur-heading-morph',
        '.cd-cur-sub',
        '.cd-cur-stat',
        '.cd-cur-stat-value',
        '.cd-cur-node',
        '.cd-cur-rail',
        '.cd-cur-grid',
        '.cd-cur-glow',
      ];

      // ── Reduced motion: snap everything composed ─────────────────────────
      if (reducedMotion) {
        gsap.set(allTargets, {
          opacity: 1,
          x: 0,
          y: 0,
          yPercent: 0,
          scaleY: 1,
          scale: 1,
          filter: 'none',
          clearProps: 'transform',
        });
        gsap.set('.cd-cur-heading-morph:first-child', { opacity: 1 });
        gsap.set('.cd-cur-heading-morph:not(:first-child)', { opacity: 0 });
        root.querySelectorAll<HTMLElement>('.cd-cur-stat-value').forEach((el) => {
          const target = el.dataset.target;
          if (target) el.textContent = target;
        });
        return;
      }

      // ── Mobile fallback — no pin, simple scroll-trigger reveals ──────────
      if (!isDesktop) {
        const headTrigger = {
          trigger: root,
          start: 'top 90%',
          toggleActions: 'play none none none',
        } as ScrollTrigger.Vars;

        gsap.set('.cd-cur-badge', { opacity: 0, y: 14 });
        gsap.set('.cd-cur-heading-morph', { opacity: 0 });
        gsap.set('.cd-cur-heading-morph:first-child', { opacity: 0, y: 18, filter: 'blur(6px)' });
        gsap.set('.cd-cur-sub', { opacity: 0, y: 12, filter: 'blur(4px)' });
        gsap.set('.cd-cur-stat', { opacity: 0, y: 18 });
        gsap.set('.cd-cur-node', { opacity: 0, x: -16 });

        gsap.to('.cd-cur-badge', {
          opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', scrollTrigger: headTrigger,
        });
        gsap.to('.cd-cur-heading-morph:first-child', {
          opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, delay: 0.1,
          ease: 'power3.out', scrollTrigger: headTrigger,
        });
        gsap.to('.cd-cur-sub', {
          opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, delay: 0.2,
          ease: 'power3.out', scrollTrigger: headTrigger,
        });

        // Stat wrappers slide up, values count up
        const stats = root.querySelectorAll<HTMLElement>('.cd-cur-stat');
        gsap.to(stats, {
          opacity: 1, y: 0, duration: 0.5, stagger: 0.08, delay: 0.3,
          ease: 'power3.out', scrollTrigger: headTrigger,
        });
        stats.forEach((statEl, i) => {
          const valueEl = statEl.querySelector<HTMLElement>('.cd-cur-stat-value');
          if (!valueEl) return;
          const target = Number(valueEl.dataset.target ?? 0);
          const counter = { v: 0 };
          gsap.to(counter, {
            v: target,
            duration: 1.2,
            delay: 0.45 + i * 0.12,
            ease: 'power2.out',
            onUpdate: () => {
              valueEl.textContent = Math.round(counter.v).toString();
            },
            scrollTrigger: headTrigger,
          });
        });

        // Per-node entry on scroll
        root.querySelectorAll<HTMLElement>('.cd-cur-node').forEach((node) => {
          gsap.to(node, {
            opacity: 1,
            x: 0,
            duration: 0.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: node,
              start: 'top 88%',
              toggleActions: 'play none none none',
            } as ScrollTrigger.Vars,
          });
        });

        const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 200);
        return () => window.clearTimeout(refreshId);
      }

      // ── Desktop pinned cinema ───────────────────────────────────────────
      const camera = cameraRef.current;
      if (!camera) return;

      // Initial hidden state
      gsap.set('.cd-cur-badge', { opacity: 0, y: 18 });
      gsap.set('.cd-cur-heading-morph', { opacity: 0, yPercent: 60, filter: 'blur(10px)' });
      gsap.set('.cd-cur-sub', { opacity: 0, y: 20, filter: 'blur(4px)' });
      gsap.set('.cd-cur-stat', { opacity: 0, y: 28 });
      gsap.set('.cd-cur-stat-value', { textContent: '0' });
      gsap.set('.cd-cur-node', { opacity: 0, y: 60, scale: 0.92 });
      gsap.set(camera, { y: 0, scale: 1, transformOrigin: 'top center' });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_DURATIONS.coursesDetailCurriculum,
        scrub: 1,
        enabled: true,
        invalidateOnRefresh: true,
      });

      // Background-colour shift via vignette tint — soft hue drift toward accent
      tl.to(
        '.cd-cur-vignette',
        {
          opacity: 0.85,
          duration: 1,
          ease: 'none',
        },
        0,
      );

      // Parallax depth layers
      tl.to('.cd-cur-grid', { yPercent: -10, duration: 1, ease: 'none' }, 0);
      tl.to('.cd-cur-scan', { yPercent: -30, duration: 1, ease: 'none' }, 0);
      tl.to(
        '.cd-cur-glow',
        { yPercent: -22, scale: 1.28, opacity: 0.55, duration: 1, ease: 'none' },
        0,
      );

      // Camera pan — runs 0.36 → 0.92 (the credits window). Function-based
      // y so the pan distance recomputes on each refresh against current
      // camera/grid height.
      tl.to(
        camera,
        {
          y: () => {
            const cameraHeight = camera.offsetHeight;
            const viewportHeight = window.innerHeight;
            return -(cameraHeight - viewportHeight);
          },
          ease: 'none',
          duration: 0.56,
        },
        0.36,
      );

      // 0.00-0.04 Badge
      tl.to('.cd-cur-badge', { opacity: 1, y: 0, duration: 0.04, ease: 'power2.out' }, 0);

      // 0.04-0.32 Headline morph (3 phrases) — fade-in, snap-out before next.
      // Doubled spread vs the original tight (0.06 gap / 0.02 fade) so each
      // phrase holds for a deliberate scroll budget instead of flashing past
      // within a single wheel turn.
      const morphs = root.querySelectorAll<HTMLElement>('.cd-cur-heading-morph');
      const MORPH_GAP = 0.12;
      const MORPH_FADE = 0.04;
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
          tl.set(
            el,
            { opacity: 0, yPercent: -30, filter: 'blur(8px)' },
            nextInAt - 0.001,
          );
        }
      });

      // 0.04-0.18 Stat wrappers fade in (so 4 big numbers sit under morphing headline)
      const stats = root.querySelectorAll<HTMLElement>('.cd-cur-stat');
      stats.forEach((statEl, i) => {
        const at = 0.04 + i * 0.022;
        tl.to(statEl, { opacity: 1, y: 0, duration: 0.05, ease: 'power2.out' }, at);
      });

      // Stats count-up — runs ONCE on section enter, independent of scrub.
      // A tl.call at 0.04 doesn't reliably fire because the playhead can
      // already be past it when scrub initialises. A standalone trigger
      // guarantees the count animates the moment the section enters view.
      ScrollTrigger.create({
        trigger: root,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          stats.forEach((statEl, i) => {
            const valueEl = statEl.querySelector<HTMLElement>('.cd-cur-stat-value');
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
      });

      // 0.34-0.40 Sub paragraph — lands after the headline morph fully
      // resolves so the eye doesn't have to track two reveals at once.
      tl.to(
        '.cd-cur-sub',
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.06, ease: 'power2.out' },
        0.34,
      );

      // 0.36-0.85 Module cascade — distributed across the camera pan window
      tl.to(
        '.cd-cur-node',
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.14,
          stagger: 0.02,
          ease: 'power3.out',
        },
        0.36,
      );

      // 0.92-1.00 Camera scale pull-back
      tl.to(camera, { scale: 0.97, duration: 0.08, ease: 'power2.inOut' }, 0.92);
    },
    { scope: sectionRef, dependencies: [reducedMotion, isDesktop, course.slug] },
  );

  return (
    <section
      ref={sectionRef}
      id="cd-curriculum"
      aria-label="Course curriculum"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <style>{`
        .cd-cur-headline {
          position: relative;
          display: block;
          min-height: clamp(2.5rem, 6vw, 5.5rem);
        }
        .cd-cur-heading-morph {
          position: absolute;
          inset: 0;
          display: block;
          will-change: transform, opacity, filter;
        }
        .cd-cur-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: clamp(1rem, 2vw, 2rem);
        }
        @media (max-width: 900px) {
          .cd-cur-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }

        /* Module-list layout (rail + numbered nodes) */
        .cd-cur-list {
          --cur-rail-offset: 1.5rem;
          --cur-node-size: 30px;
          --cur-card-gutter: 1rem;
          position: relative;
          padding-left: calc(var(--cur-rail-offset) + var(--cur-node-size) / 2 + var(--cur-card-gutter));
        }
        @media (max-width: 600px) {
          .cd-cur-list {
            --cur-rail-offset: 0.95rem;
            --cur-node-size: 26px;
            --cur-card-gutter: 0.55rem;
          }
        }
        .cd-cur-rail-pos {
          position: absolute;
          top: 0.5rem;
          bottom: 0.5rem;
          left: var(--cur-rail-offset);
          width: 2px;
        }
        .cd-cur-node-pos {
          position: absolute;
          top: clamp(0.85rem, 2vw, 1.35rem);
          left: calc(-1 * (var(--cur-node-size) + var(--cur-card-gutter)));
          width: var(--cur-node-size);
          height: var(--cur-node-size);
        }

        /* Mobile pin disabled — let the section size to its real content. */
        @media (max-width: 1023px) {
          #cd-curriculum {
            min-height: auto !important;
          }
          .cd-cur-camera-el {
            position: static !important;
            padding-top: clamp(2.5rem, 7vh, 4rem) !important;
            padding-bottom: clamp(2.5rem, 7vh, 4rem) !important;
          }

          /* The morphing headline uses position:absolute stacked phrases so
             the scrub can crossfade between them. On mobile there's no
             scrub, the headline doesn't morph — show only phrase 1 and
             make it relative so it contributes to layout height. Without
             this, wrapped headlines on narrow viewports overflow the
             parent's too-small min-height and overlap the stats below. */
          .cd-cur-headline {
            min-height: auto !important;
          }
          .cd-cur-heading-morph {
            position: relative !important;
          }
          .cd-cur-heading-morph:not(:first-child) {
            display: none !important;
          }
        }

        @media (max-width: 600px) {
          /* Narrow phones — pull the stat tile number down a touch so 3-4
             char values like "120h" don't compress against the suffix. */
          .cd-cur-stat {
            padding: clamp(0.85rem, 2vw, 1.25rem) !important;
          }
        }
      `}</style>

      {/* ── L-1 — subtle grid radial ── */}
      <div
        aria-hidden="true"
        className="cd-cur-grid"
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

      {/* ── L0 — breathing glow pool ── */}
      <div
        aria-hidden="true"
        className="cd-cur-glow"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '1200px',
          height: '780px',
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

      {/* ── L1 — scan lines ── */}
      <div
        aria-hidden="true"
        className="cd-cur-scan"
        style={{
          position: 'absolute',
          inset: '-5%',
          zIndex: 3,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.014) 3px, rgba(255,255,255,0.014) 4px)',
          pointerEvents: 'none',
          willChange: 'transform',
        }}
      />

      {/* ── L2 — vignette ── */}
      <div
        aria-hidden="true"
        className="cd-cur-vignette"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 4,
          background: `radial-gradient(ellipse at center, transparent 35%, ${offensive ? 'rgba(255,61,90,0.08)' : 'rgba(168,240,255,0.06)'} 65%, var(--color-void) 100%)`,
          opacity: 0.55,
          pointerEvents: 'none',
          willChange: 'opacity',
        }}
      />

      {/* ── Camera wrapper — absolutely positioned, pans up with scroll ── */}
      <div
        ref={cameraRef}
        className="cd-cur-camera-el"
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
          style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1.75rem, 4vh, 3rem)' }}
        >
          {/* Header block: badge + morphing headline + stats counter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
            <div className="cd-cur-badge" style={{ alignSelf: 'flex-start' }}>
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
                {'// CURRICULUM_TIMELINE / ACT_II'}
              </span>
            </div>

            <h2
              className="cd-cur-headline"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-display-md, clamp(1.8rem, 4vw, 3rem))',
                fontWeight: 700,
                letterSpacing: '-0.025em',
                color: 'var(--color-text-primary)',
                margin: 0,
                lineHeight: 1.08,
              }}
            >
              {headlineMorphs.map((phrase, i) => (
                <span
                  key={phrase}
                  className="cd-cur-heading-morph"
                  aria-hidden={i === headlineMorphs.length - 1 ? undefined : 'true'}
                >
                  {phrase}
                </span>
              ))}
            </h2>

            {/* Stats counter — 4 big numbers count up dramatically */}
            <div className="cd-cur-stats">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="cd-cur-stat"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    padding: 'clamp(1rem, 2vw, 1.5rem)',
                    borderLeft: `2px solid ${stat.color}`,
                    background: 'rgba(13,16,20,0.45)',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                    willChange: 'transform, opacity',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'baseline',
                      gap: '0.15rem',
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(2rem, 5vw, 3.25rem)',
                      fontWeight: 700,
                      letterSpacing: '-0.04em',
                      color: stat.color,
                      lineHeight: 1,
                      textShadow: `0 0 28px ${stat.color}`,
                    }}
                  >
                    <span className="cd-cur-stat-value" data-target={stat.value}>
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
              ))}
            </div>

            <p
              className="cd-cur-sub"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-lg)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.65,
                margin: 0,
                maxWidth: '780px',
                willChange: 'transform, opacity, filter',
              }}
            >
              Each module ships with lab time, applied exercises, and a verifiable
              checkpoint. Modules deploy in sequence — the rail below shows the
              order of engagement.
            </p>
          </div>

          {modules.length > 0 ? (
            <div className="cd-cur-list">
              <span
                aria-hidden="true"
                className="cd-cur-rail cd-cur-rail-pos"
                style={{
                  background: `linear-gradient(180deg, ${accent} 0%, ${accent}33 100%)`,
                  boxShadow: `0 0 12px ${accent}`,
                  willChange: 'transform',
                }}
              />

              <ol
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'clamp(0.85rem, 2vw, 1.4rem)',
                }}
              >
                {modules.map((module, i) => (
                  <li
                    key={`${course.slug}-mod-${i}`}
                    className="cd-cur-node"
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 'clamp(0.75rem, 2vw, 1.5rem)',
                      padding: 'clamp(0.85rem, 2vw, 1.35rem) clamp(0.95rem, 2.2vw, 1.5rem)',
                      background: 'rgba(13,16,20,0.55)',
                      border: '1px solid rgba(168,240,255,0.12)',
                      backdropFilter: 'blur(4px)',
                      WebkitBackdropFilter: 'blur(4px)',
                      willChange: 'transform, opacity',
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className="cd-cur-node-pos"
                      style={{
                        borderRadius: '50%',
                        background: 'var(--color-void)',
                        border: `2px solid ${accent}`,
                        boxShadow: `0 0 14px ${accent}, inset 0 0 8px ${accent}55`,
                        color: accent,
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {pad2(i + 1)}
                    </span>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', flex: 1, minWidth: 0 }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '10px',
                          letterSpacing: '0.24em',
                          textTransform: 'uppercase',
                          color: 'var(--color-text-tertiary)',
                        }}
                      >
                        MODULE_{pad2(i + 1)}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--text-base)',
                          fontWeight: 600,
                          color: 'var(--color-text-primary)',
                          lineHeight: 1.45,
                        }}
                      >
                        {module}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-secondary)',
                padding: '1.5rem',
                background: 'rgba(13,16,20,0.5)',
                border: '1px dashed rgba(168,240,255,0.2)',
                margin: 0,
                letterSpacing: '0.05em',
              }}
            >
              {'> '}curriculum_finalising... use the enquiry below and we will
              share the week-by-week outline.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
