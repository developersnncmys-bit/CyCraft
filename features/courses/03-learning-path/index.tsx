'use client';
/* Courses Learning Path — pinned cinematic (mobile = scroll-trigger).
 *
 * Beats (0–1):
 *   0.00–0.05  Badge
 *   0.05–0.18  Heading words
 *   0.18–0.25  Terminal command line types in
 *   0.25–0.65  3 pillar cards cascade with depth + accent ignition
 *   0.65–0.85  Hold
 *   0.85–1.00  Camera scale 1 → 0.96
 */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { Badge } from '@/components/ui/Badge';
import { coursesLearningPathContent } from '@/content/courses/learning-path';

// Local pin duration since PIN_DURATIONS doesn't yet include courses keys.
const PIN_END =
  (PIN_DURATIONS as Record<string, string>).coursesLearningPath ?? '+=220%';

function PillarIcon({ kind }: { kind: 'lock' | 'bolt' | 'prompt' }) {
  if (kind === 'lock') {
    return (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="4" y="11" width="16" height="10" rx="1.5" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </svg>
    );
  }
  if (kind === 'bolt') {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
      </svg>
    );
  }
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m4 17 6-5-6-5" />
      <path d="M12 19h8" />
    </svg>
  );
}

export default function CoursesLearningPath() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      if (reducedMotion) {
        gsap.set(
          [
            '.courses-lp-bg',
            '.courses-lp-scan',
            '.courses-lp-glow',
            '.courses-lp-camera',
            '.courses-lp-badge',
            '.courses-lp-heading-word',
            '.courses-lp-cmd',
            '.courses-lp-card',
            '.courses-lp-card-line',
            '.courses-lp-card-el',
          ],
          { opacity: 1, x: 0, y: 0, scale: 1, scaleX: 1, clearProps: 'transform' },
        );
        return;
      }

      if (!isDesktop) {
        const trigger = {
          trigger: root,
          start: 'top 80%',
          toggleActions: 'play none none reset',
        };
        gsap.fromTo(
          '.courses-lp-badge',
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, scrollTrigger: trigger },
        );
        gsap.fromTo(
          '.courses-lp-heading-word',
          { opacity: 0, yPercent: 60, filter: 'blur(8px)' },
          {
            opacity: 1,
            yPercent: 0,
            filter: 'blur(0px)',
            duration: 0.7,
            stagger: 0.04,
            delay: 0.15,
            scrollTrigger: trigger,
          },
        );
        gsap.fromTo(
          '.courses-lp-cmd',
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.4, delay: 0.45, scrollTrigger: trigger },
        );
        gsap.fromTo(
          '.courses-lp-card',
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.14,
            ease: 'power3.out',
            delay: 0.6,
            scrollTrigger: trigger,
          },
        );
        return;
      }

      gsap.set('.courses-lp-badge', { opacity: 0, y: 14 });
      gsap.set('.courses-lp-heading-word', { opacity: 0, yPercent: 70, filter: 'blur(10px)' });
      gsap.set('.courses-lp-cmd', { opacity: 0, y: 18 });
      gsap.set('.courses-lp-card', { opacity: 0, y: 56, scale: 0.92 });
      gsap.set('.courses-lp-card-line', { scaleX: 0, transformOrigin: 'left center' });
      gsap.set('.courses-lp-card-el', { opacity: 0, y: 16 });
      gsap.set('.courses-lp-camera', { scale: 1, transformOrigin: 'center center' });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_END,
        scrub: 1,
        enabled: true,
      });

      tl.to('.courses-lp-badge', { opacity: 1, y: 0, duration: 0.05, ease: 'power2.out' }, 0)
        .to(
          '.courses-lp-heading-word',
          {
            opacity: 1,
            yPercent: 0,
            filter: 'blur(0px)',
            duration: 0.13,
            stagger: 0.025,
            ease: 'power3.out',
          },
          0.05,
        )
        .to('.courses-lp-cmd', { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' }, 0.18)
        .to(
          '.courses-lp-card',
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.18,
            stagger: 0.12,
            ease: 'power3.out',
          },
          0.25,
        )
        .to(
          '.courses-lp-card-line',
          { scaleX: 1, duration: 0.12, stagger: 0.12, ease: 'power3.out' },
          0.32,
        )
        .to(
          '.courses-lp-card-el',
          {
            opacity: 1,
            y: 0,
            duration: 0.1,
            stagger: { each: 0.03, grid: [3, 3], from: 'start' },
            ease: 'power2.out',
          },
          0.36,
        );

      tl.to('.courses-lp-bg', { yPercent: -6, duration: 1, ease: 'none' }, 0);
      tl.to('.courses-lp-scan', { yPercent: -22, duration: 1, ease: 'none' }, 0);
      tl.to(
        '.courses-lp-glow',
        { yPercent: -22, scale: 1.25, opacity: 0.5, duration: 1, ease: 'none' },
        0,
      );

      tl.to('.courses-lp-camera', { scale: 0.96, duration: 0.15, ease: 'power2.inOut' }, 0.85);
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="courses-learning-path"
      aria-label="Learning path customisation"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <style>{`
        .courses-lp-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(1.25rem, 2.4vw, 2rem);
        }
        @media (max-width: 900px) {
          .courses-lp-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div
        className="courses-lp-camera"
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          paddingTop: 'clamp(4rem, 8vh, 6rem)',
          paddingBottom: 'clamp(4rem, 7vh, 6rem)',
          paddingInline: 'var(--section-padding)',
          transformOrigin: 'center center',
          willChange: 'transform',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden="true"
          className="courses-lp-bg"
          style={{
            position: 'absolute',
            inset: '-8%',
            zIndex: 1,
            background:
              'radial-gradient(ellipse at center, rgba(168,240,255,0.05), transparent 60%)',
            pointerEvents: 'none',
            willChange: 'transform',
          }}
        />
        <div
          aria-hidden="true"
          className="courses-lp-scan"
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
          className="courses-lp-glow"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '1100px',
            height: '720px',
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse, rgba(168,240,255,0.06) 0%, rgba(168,240,255,0.025) 40%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
            zIndex: 3,
            pointerEvents: 'none',
            willChange: 'transform, opacity',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 6,
            width: '100%',
            maxWidth: '1100px',
            marginInline: 'auto',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
            <div className="courses-lp-badge" style={{ display: 'inline-block', marginBottom: '1.25rem' }}>
              <Badge label={coursesLearningPathContent.badge} />
            </div>
            <h2
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '0.3em',
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-display-md)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                textTransform: 'uppercase',
                color: 'var(--color-text-primary)',
                margin: '0 0 1.5rem',
                lineHeight: 1.08,
              }}
            >
              {coursesLearningPathContent.headingPrefix.split(/\s+/).map((word, i) => (
                <span
                  key={`p-${i}`}
                  className="courses-lp-heading-word"
                  style={{ display: 'inline-block', willChange: 'transform, opacity, filter' }}
                >
                  {word}
                </span>
              ))}
              {coursesLearningPathContent.headingAccent.split(/\s+/).map((word, i) => (
                <span
                  key={`a-${i}`}
                  className="courses-lp-heading-word"
                  style={{
                    display: 'inline-block',
                    color: 'var(--color-beam)',
                    textShadow: '0 0 28px var(--color-beam-glow)',
                    willChange: 'transform, opacity, filter',
                  }}
                >
                  {word}
                </span>
              ))}
            </h2>
            <p
              className="courses-lp-cmd"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-base)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6,
                margin: 0,
                letterSpacing: '0.02em',
              }}
            >
              {coursesLearningPathContent.terminalCommand}
            </p>
          </div>

          <div className="courses-lp-grid">
            {coursesLearningPathContent.pillars.map((pillar) => (
              <div
                key={pillar.key}
                className="courses-lp-card"
                style={{
                  position: 'relative',
                  background: 'var(--color-carbon)',
                  border: '1px solid rgba(168,240,255,0.18)',
                  padding: 'clamp(1.75rem, 2.5vw, 2.25rem)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.1rem',
                  willChange: 'transform, opacity',
                  transition: 'transform 0.3s, border-color 0.3s, box-shadow 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow =
                    '0 14px 36px rgba(0,0,0,0.4), 0 0 28px rgba(168,240,255,0.18)';
                  e.currentTarget.style.borderColor = 'var(--color-beam)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'rgba(168,240,255,0.18)';
                }}
              >
                <div
                  aria-hidden="true"
                  className="courses-lp-card-line"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background:
                      'linear-gradient(to right, transparent, var(--color-beam), transparent)',
                    transformOrigin: 'left center',
                    willChange: 'transform',
                  }}
                />
                <span
                  className="courses-lp-card-el"
                  aria-hidden="true"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '56px',
                    height: '56px',
                    background: 'rgba(168,240,255,0.06)',
                    border: '1px solid rgba(168,240,255,0.28)',
                    color: 'var(--color-beam)',
                  }}
                >
                  <PillarIcon kind={pillar.icon as 'lock' | 'bolt' | 'prompt'} />
                </span>
                <h3
                  className="courses-lp-card-el"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                    textTransform: 'uppercase',
                    color: 'var(--color-text-primary)',
                    margin: 0,
                  }}
                >
                  {pillar.title}
                </h3>
                <p
                  className="courses-lp-card-el"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-base)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
