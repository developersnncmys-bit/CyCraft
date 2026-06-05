'use client';
/* Courses Guidance — pinned cinematic CTA (mobile = scroll-trigger).
 *
 * Beats (0–1):
 *   0.00–0.05  Badge
 *   0.05–0.25  Heading words
 *   0.25–0.40  Subhead reveal
 *   0.40–0.65  CTA button ignites with red glow
 *   0.65–0.85  Hold
 *   0.85–1.00  Camera scale 1 → 0.96
 */
import { useRef } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { Badge } from '@/components/ui/Badge';
import { coursesGuidanceContent } from '@/content/courses/guidance';

const PIN_END =
  (PIN_DURATIONS as Record<string, string>).coursesGuidance ?? '+=180%';

export default function CoursesGuidance() {
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
            '.courses-gd-bg',
            '.courses-gd-glow',
            '.courses-gd-camera',
            '.courses-gd-badge',
            '.courses-gd-heading-word',
            '.courses-gd-sub',
            '.courses-gd-cta',
            '.courses-gd-terminal',
          ],
          { opacity: 1, x: 0, y: 0, scale: 1, clearProps: 'transform' },
        );
        return;
      }

      if (!isDesktop) {
        const trigger = {
          trigger: root,
          start: 'top 95%',
          // Play once and stay composed. `reset` on leaveBack was causing
          // the entry to snap back to opacity:0 if the section re-mounted
          // or the trigger fired with stale measurements.
          toggleActions: 'play none none none',
        };
        gsap.fromTo(
          '.courses-gd-badge',
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, scrollTrigger: trigger },
        );
        gsap.fromTo(
          '.courses-gd-heading-word',
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
          '.courses-gd-sub',
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, delay: 0.45, scrollTrigger: trigger },
        );
        gsap.fromTo(
          '.courses-gd-cta',
          { opacity: 0, y: 16, scale: 0.94 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'back.out(1.4)',
            delay: 0.6,
            scrollTrigger: trigger,
          },
        );
        gsap.fromTo(
          '.courses-gd-terminal',
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.12, delay: 0.9, scrollTrigger: trigger },
        );
        return;
      }

      gsap.set('.courses-gd-badge', { opacity: 0, y: 14 });
      gsap.set('.courses-gd-heading-word', { opacity: 0, yPercent: 70, filter: 'blur(10px)' });
      gsap.set('.courses-gd-sub', { opacity: 0, y: 18 });
      gsap.set('.courses-gd-cta', { opacity: 0, y: 24, scale: 0.92 });
      gsap.set('.courses-gd-terminal', { opacity: 0, y: 8 });
      gsap.set('.courses-gd-camera', { scale: 1, transformOrigin: 'center center' });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_END,
        scrub: 1,
        enabled: true,
      });

      tl.to('.courses-gd-badge', { opacity: 1, y: 0, duration: 0.05, ease: 'power2.out' }, 0)
        .to(
          '.courses-gd-heading-word',
          {
            opacity: 1,
            yPercent: 0,
            filter: 'blur(0px)',
            duration: 0.2,
            stagger: 0.04,
            ease: 'power3.out',
          },
          0.05,
        )
        .to('.courses-gd-sub', { opacity: 1, y: 0, duration: 0.15, ease: 'power2.out' }, 0.25)
        .to(
          '.courses-gd-cta',
          { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: 'back.out(1.6)' },
          0.4,
        )
        .to(
          '.courses-gd-terminal',
          { opacity: 1, y: 0, duration: 0.1, stagger: 0.04, ease: 'power2.out' },
          0.55,
        );

      tl.to('.courses-gd-bg', { yPercent: -4, duration: 1, ease: 'none' }, 0);
      tl.to(
        '.courses-gd-glow',
        { yPercent: -18, scale: 1.3, opacity: 0.55, duration: 1, ease: 'none' },
        0,
      );

      tl.to('.courses-gd-camera', { scale: 0.96, duration: 0.15, ease: 'power2.inOut' }, 0.85);
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  const prefixWords = coursesGuidanceContent.headingPrefix.split(/\s+/);
  const accentWords = coursesGuidanceContent.headingAccent.split(/\s+/);

  return (
    <section
      ref={sectionRef}
      id="courses-guidance"
      aria-label="Schedule a guidance consultation"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <style>{`
        /* Mobile (< 1024px) — pin is disabled in JS. Let the section
           size to its real content instead of stretching to 100vh.
           Keep overflow:hidden — the parallax layers escape sideways
           otherwise and trigger horizontal page overflow. */
        @media (max-width: 1023px) {
          #courses-guidance {
            min-height: auto !important;
          }
          .courses-gd-camera {
            min-height: auto !important;
          }
        }
      `}</style>
      <div
        className="courses-gd-camera"
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingInline: 'var(--section-padding)',
          paddingTop: 'clamp(4rem, 8vh, 6rem)',
          paddingBottom: 'clamp(4rem, 8vh, 6rem)',
          transformOrigin: 'center center',
          willChange: 'transform',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden="true"
          className="courses-gd-bg"
          style={{
            position: 'absolute',
            inset: '-8%',
            zIndex: 1,
            background:
              'radial-gradient(ellipse at center, rgba(168,240,255,0.08), transparent 65%)',
            pointerEvents: 'none',
            willChange: 'transform',
          }}
        />
        <div
          aria-hidden="true"
          className="courses-gd-glow"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '900px',
            height: '600px',
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse, rgba(168,240,255,0.14) 0%, rgba(168,240,255,0.04) 40%, transparent 70%)',
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
            maxWidth: '760px',
            textAlign: 'center',
          }}
        >
          <div className="courses-gd-badge" style={{ display: 'inline-block', marginBottom: '1.5rem' }}>
            <Badge label={coursesGuidanceContent.badge} />
          </div>

          <h2
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0.3em',
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-display-lg)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              color: 'var(--color-text-primary)',
              margin: '0 0 1.5rem',
              lineHeight: 1.05,
            }}
          >
            {prefixWords.map((word, i) => (
              <span
                key={`p-${i}`}
                className="courses-gd-heading-word"
                style={{ display: 'inline-block', willChange: 'transform, opacity, filter' }}
              >
                {word}
              </span>
            ))}
            {accentWords.map((word, i) => (
              <span
                key={`a-${i}`}
                className="courses-gd-heading-word"
                style={{
                  display: 'inline-block',
                  color: 'var(--color-beam)',
                  textShadow: '0 0 32px var(--color-beam-glow)',
                  willChange: 'transform, opacity, filter',
                }}
              >
                {word}
              </span>
            ))}
            <span
              className="courses-gd-heading-word"
              style={{
                display: 'inline-block',
                color: 'var(--color-text-primary)',
                willChange: 'transform, opacity, filter',
              }}
            >
              {coursesGuidanceContent.headingSuffix}
            </span>
          </h2>

          <p
            className="courses-gd-sub"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.65,
              margin: '0 auto 2.5rem',
              maxWidth: '560px',
            }}
          >
            {coursesGuidanceContent.subhead}
          </p>

          <Link
            href={coursesGuidanceContent.cta.href}
            className="courses-gd-cta"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              padding: '1.15rem 3rem',
              background: 'var(--color-red-team)',
              color: '#fff',
              border: '1px solid var(--color-red-team)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-base)',
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              boxShadow: '0 0 32px rgba(255,61,90,0.45)',
              transition: 'transform 0.25s, box-shadow 0.25s',
              willChange: 'transform, opacity',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.transform = 'translateY(-2px)';
              el.style.boxShadow = '0 0 52px rgba(255,61,90,0.65)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.transform = 'translateY(0)';
              el.style.boxShadow = '0 0 32px rgba(255,61,90,0.45)';
            }}
          >
            {coursesGuidanceContent.cta.label}
          </Link>

          <div
            aria-hidden="true"
            style={{
              marginTop: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              width: 'fit-content',
              maxWidth: '100%',
              marginInline: 'auto',
              border: '1px solid rgba(168,240,255,0.12)',
              background: 'rgba(13,16,20,0.6)',
              backdropFilter: 'blur(6px)',
              padding: '0.75rem 1.25rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--color-terminal)',
              letterSpacing: '0.04em',
              textAlign: 'left',
            }}
          >
            {coursesGuidanceContent.terminalLines.map((line) => (
              <span key={line} className="courses-gd-terminal">
                {line}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
