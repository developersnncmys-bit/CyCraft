'use client';
/* Achievements — Act I, Section 2 of 22.
 * Film-mode POC: pinned ~250vh, scroll drives camera, parallax layers,
 * heading + description word-by-word reveal, and the 4-stat counter ignition.
 * Previous 3-phrase morph swap retired in favour of a single heading whose
 * words ignite one after another (desktop scrub / mobile stagger).
 */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { Badge } from '@/components/ui/Badge';
import { achievementsContent } from '@/content/achievements';
import { StatsConstellation } from './components/StatsConstellation';
import { useFilmReveal } from '@/lib/gsap/filmReveal';
import { gsap } from '@/lib/gsap/register';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

const HEADING_TEXT = 'HISTORY MADE IN CYBER DEFENSE';

function splitWords(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

export default function AchievementsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const reducedMotion = useReducedMotion();
  useFilmReveal(sectionRef, { pin: '+=250%' });

  // Word-by-word reveal for heading + description. Runs alongside
  // useFilmReveal — same scroll trigger window on desktop (scrub), per-element
  // entry-on-view stagger on mobile. Words are set to opacity:0/y:20 in JSX
  // (initial state below) so they don't paint composed before the timeline
  // takes over.
  useGSAP(
    () => {
      const container = sectionRef.current;
      if (!container) return;
      const headingWords = container.querySelectorAll<HTMLElement>('.achv-heading-word');
      const descWords = container.querySelectorAll<HTMLElement>('.achv-desc-word');
      if (headingWords.length === 0 && descWords.length === 0) return;

      if (reducedMotion) {
        gsap.set([...headingWords, ...descWords], { opacity: 1, y: 0, filter: 'blur(0px)' });
        return;
      }

      gsap.set([...headingWords, ...descWords], { opacity: 0, y: 20, filter: 'blur(6px)' });

      if (!isDesktop) {
        // Mobile — staggered cascade on section entry. Heading first, then
        // description tail follows.
        gsap.to(headingWords, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.55,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
            toggleActions: 'play none none reset',
          },
        });
        gsap.to(descWords, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.45,
          stagger: 0.02,
          ease: 'power2.out',
          delay: 0.35,
          scrollTrigger: {
            trigger: container,
            start: 'top 80%',
            toggleActions: 'play none none reset',
          },
        });
        return;
      }

      // Desktop — scrub against the pin so words ignite as the user scrolls
      // through the first ~22% of the pin window. Matches useFilmReveal's
      // pinned ScrollTrigger window (`top top` → `+=250%`).
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=250%',
          scrub: 1.2,
        },
      });

      tl.to(
        headingWords,
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.05,
          stagger: 0.012,
          ease: 'power2.out',
        },
        0.02,
      );

      tl.to(
        descWords,
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.04,
          stagger: 0.004,
          ease: 'power1.out',
        },
        0.10,
      );
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  return (
    <SectionWrapper ref={sectionRef} id="achievements" act={1}>
      {/* Layered parallax — three depths drift at different speeds. */}
      <div
        className="film-bg-deep"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-10%',
          zIndex: 0,
          background:
            'radial-gradient(ellipse at 30% 30%, rgba(168,240,255,0.10), transparent 65%), radial-gradient(ellipse at 70% 80%, rgba(168,240,255,0.06), transparent 60%)',
          pointerEvents: 'none',
        }}
      />
      <div
        className="film-bg-mid"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-6%',
          zIndex: 0,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(168,240,255,0.02) 4px, rgba(168,240,255,0.02) 5px)',
          pointerEvents: 'none',
        }}
      />

      {/* Pinned camera — scales 1.04 → 1.00 → 0.98 across the pin. */}
      <div
        className="film-camera achv-camera-el"
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        {/* L3 — text content, top-center */}
        <div
          style={{
            position: 'relative',
            zIndex: 3,
            textAlign: 'center',
            paddingTop: 'clamp(7rem, 13vh, 9rem)',
            paddingInline: 'var(--section-padding)',
          }}
        >
          <div className="section-container">
            <div className="achv-badge-el" style={{ display: 'inline-block' }}>
              <Badge label={achievementsContent.badge} />
            </div>

            {/* Single heading — words ignite one after another (desktop
                scrub / mobile stagger). aria-label exposes the full phrase
                for screen readers; the per-word spans are presentational. */}
            <h2
              className="achv-heading-el"
              aria-label={HEADING_TEXT}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: 'var(--color-text-primary)',
                margin: '1rem 0 0.75rem',
                lineHeight: 1.1,
              }}
            >
              {splitWords(HEADING_TEXT).map((word, i, arr) => (
                <span
                  key={`${word}-${i}`}
                  className="achv-heading-word"
                  aria-hidden="true"
                  style={{
                    display: 'inline-block',
                    willChange: 'transform, opacity, filter',
                  }}
                >
                  {word}
                  {i < arr.length - 1 ? ' ' : ''}
                </span>
              ))}
            </h2>

            <p
              className="achv-desc-el"
              aria-label={achievementsContent.description}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-base)',
                color: 'var(--color-text-secondary)',
                maxWidth: '560px',
                margin: '0 auto',
                lineHeight: 1.55,
              }}
            >
              {splitWords(achievementsContent.description).map((word, i, arr) => (
                <span
                  key={`${word}-${i}`}
                  className="achv-desc-word"
                  aria-hidden="true"
                  style={{
                    display: 'inline-block',
                    willChange: 'transform, opacity, filter',
                  }}
                >
                  {word}
                  {i < arr.length - 1 ? ' ' : ''}
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* Stats row */}
        <StatsConstellation stats={achievementsContent.stats} />
      </div>

      {/* Glow behind stats row */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '200px',
          background: 'radial-gradient(ellipse, rgba(168,240,255,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
    </SectionWrapper>
  );
}
