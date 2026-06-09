'use client';
/* Philosophy — Act II, Section 4 of 22.
 * Film-mode: pinned ~200vh. Tight reveal + tilted video parallax.
 *
 * Text reveal model (per design call): every word is rendered at 80%
 * opacity from the start, then ignites to 100% one after another as the
 * user scrolls through the pin window. Reads as a documentary "highlight
 * each word" effect rather than a black-curtain reveal. Heading, broken
 * statement, and description all participate. Mobile falls back to a
 * staggered entry-on-view that still walks through the words. */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { philosophyContent } from '@/content/philosophy';
import { TiltedVideo } from './components/TiltedVideo';
import { useFilmReveal } from '@/lib/gsap/filmReveal';
import { gsap } from '@/lib/gsap/register';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

function splitWords(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

const HEADING_WORDS = splitWords(philosophyContent.heading);
const BROKEN_WORDS = splitWords(philosophyContent.broken);
const DESC_WORDS = splitWords(philosophyContent.description);

interface WordSpanProps {
  word: string;
  isLast: boolean;
  className: string;
}

function WordSpan({ word, isLast, className }: WordSpanProps) {
  return (
    <>
      <span
        className={className}
        aria-hidden="true"
        style={{
          display: 'inline-block',
          opacity: 0.8,
          willChange: 'opacity',
        }}
      >
        {word}
      </span>
      {!isLast && ' '}
    </>
  );
}

export default function PhilosophySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const reducedMotion = useReducedMotion();
  useFilmReveal(sectionRef, { pin: '+=200%' });

  useGSAP(
    () => {
      const container = sectionRef.current;
      if (!container) return;
      const headingWords = container.querySelectorAll<HTMLElement>('.ph-heading-word');
      const brokenWords = container.querySelectorAll<HTMLElement>('.ph-broken-word');
      const descWords = container.querySelectorAll<HTMLElement>('.ph-desc-word');
      const allWords = [...headingWords, ...brokenWords, ...descWords];
      if (allWords.length === 0) return;

      if (reducedMotion) {
        gsap.set(allWords, { opacity: 1 });
        return;
      }

      // Base state — every word is dim (80%). Reveal animates only to 1.
      gsap.set(allWords, { opacity: 0.8 });

      if (!isDesktop) {
        // Mobile — three staggered cascades on section entry. Heading first,
        // then the broken statement, then description.
        gsap.to(headingWords, {
          opacity: 1,
          duration: 0.35,
          stagger: 0.08,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
            toggleActions: 'play none none reset',
          },
        });
        gsap.to(brokenWords, {
          opacity: 1,
          duration: 0.32,
          stagger: 0.05,
          ease: 'power1.out',
          delay: 0.25,
          scrollTrigger: {
            trigger: container,
            start: 'top 80%',
            toggleActions: 'play none none reset',
          },
        });
        gsap.to(descWords, {
          opacity: 1,
          duration: 0.28,
          stagger: 0.018,
          ease: 'none',
          delay: 0.5,
          scrollTrigger: {
            trigger: container,
            start: 'top 75%',
            toggleActions: 'play none none reset',
          },
        });
        return;
      }

      // Desktop — non-scrub timeline that plays once when the section
      // enters the viewport. Earlier attempts used a scrub trigger sharing
      // the same start/end as useFilmReveal's pin; on this build the second
      // trigger never advanced (probably because the pin spacer was already
      // claiming the scroll window). This keeps things independent —
      // animation fires on section entry and walks through every word.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top 70%',
          toggleActions: 'play none none reset',
        },
      });

      tl.to(headingWords, {
        opacity: 1,
        duration: 0.5,
        stagger: 0.10,
        ease: 'power1.out',
      });
      tl.to(
        brokenWords,
        {
          opacity: 1,
          duration: 0.5,
          stagger: 0.06,
          ease: 'power1.out',
        },
        '+=0.05',
      );
      tl.to(
        descWords,
        {
          opacity: 1,
          duration: 0.4,
          stagger: 0.02,
          ease: 'none',
        },
        '+=0.1',
      );
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  return (
    <SectionWrapper ref={sectionRef} id="philosophy" act={2}>
      <div
        className="film-bg-deep"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-10%',
          zIndex: 0,
          background:
            'radial-gradient(ellipse at 25% 40%, rgba(168,240,255,0.10), transparent 60%), radial-gradient(ellipse at 75% 60%, rgba(255,61,90,0.06), transparent 55%)',
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
            'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(168,240,255,0.02) 8px, rgba(168,240,255,0.02) 9px)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="film-camera philosophy-camera-el"
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: 'center center',
          willChange: 'transform',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 'clamp(3rem, 6vw, 5rem)',
            padding: 'clamp(5rem, 9vh, 6rem) var(--section-padding) clamp(2rem, 4vh, 3rem)',
            maxWidth: '1440px',
            margin: '0 auto',
            width: '100%',
          }}
        >
          {/* Left column */}
          <div className="philosophy-col" style={{ flex: '1 1 min(480px, 100%)', minWidth: 0 }}>
            <h2
              className="philosophy-heading-el"
              aria-label={philosophyContent.heading}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1rem, 1.8vw, 1.5rem)',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-beam)',
                marginBottom: '1rem',
              }}
            >
              {HEADING_WORDS.map((word, i) => (
                <WordSpan
                  key={`h-${i}`}
                  word={word}
                  isLast={i === HEADING_WORDS.length - 1}
                  className="ph-heading-word"
                />
              ))}
            </h2>

            <p
              className="philosophy-broken-el"
              aria-label={philosophyContent.broken}
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                lineHeight: 1.15,
                fontSize: 'clamp(1.25rem, 2.5vw, 2rem)',
                margin: '0 0 1rem',
              }}
            >
              {BROKEN_WORDS.map((word, i) => (
                <WordSpan
                  key={`b-${i}`}
                  word={word}
                  isLast={i === BROKEN_WORDS.length - 1}
                  className="ph-broken-word"
                />
              ))}
            </p>

            <div
              className="philosophy-line-el"
              aria-hidden="true"
              style={{
                height: '1px',
                background: 'linear-gradient(to right, var(--color-beam), transparent)',
                marginBottom: '1rem',
              }}
            />

            <p
              className="philosophy-desc-el"
              aria-label={philosophyContent.description}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-base)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6,
                maxWidth: '520px',
              }}
            >
              {DESC_WORDS.map((word, i) => (
                <WordSpan
                  key={`d-${i}`}
                  word={word}
                  isLast={i === DESC_WORDS.length - 1}
                  className="ph-desc-word"
                />
              ))}
            </p>
          </div>

          {/* Right column — tilted video, zooms in across pin */}
          <div className="film-image-zoom" style={{ flex: '1 1 min(420px, 100%)' }}>
            <TiltedVideo
              mp4={philosophyContent.video.mp4}
              poster={philosophyContent.video.poster}
              label={philosophyContent.video.label}
            />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
