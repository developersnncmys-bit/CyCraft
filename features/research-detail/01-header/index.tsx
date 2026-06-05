'use client';
/* Research Detail — Header (cinematic).
 *
 * Full-bleed hero image is the entire backdrop of the section. Title +
 * category•year + back link all sit OVER the image with a darkening
 * gradient so they stay readable. The stats section (02) overlaps the
 * bottom of this section via negative margin-top, glass-card style.
 *
 * No decorative chrome (no corner brackets, no chapter markers) — the
 * impact comes from edge-to-edge imagery + typography hierarchy.
 */
import { useRef } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { WordSplit } from '@/features/home/_shared/wordSplit';
import type { ResearchDetail } from '@/content/research/details';
import { researchDetailLabels } from '@/content/research/details';

export default function ResearchDetailHeader({ detail }: { detail: ResearchDetail }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      if (reducedMotion) {
        gsap.set(
          ['.rd-back', '.rd-chip', '.rd-title-line [data-word]'],
          { opacity: 1, y: 0, x: 0, yPercent: 0, filter: 'none' },
        );
        gsap.set('.rd-hero-image', { scale: 1, opacity: 1 });
        return;
      }

      gsap.set('.rd-title-line [data-word]', { opacity: 0, yPercent: 60, filter: 'blur(8px)' });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.rd-hero-image',
        { opacity: 0, scale: 1.08 },
        { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' },
      )
        .fromTo('.rd-back', { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.45 }, '-=0.9')
        .fromTo('.rd-chip', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, '-=0.5')
        .to(
          '.rd-title-line [data-word]',
          { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.75, stagger: 0.05 },
          '-=0.3',
        );

      gsap.to('.rd-hero-image', {
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
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="research-detail-header"
      aria-label={detail.title}
      style={{
        position: 'relative',
        /* Navbar is fixed h-16 (4rem) and transparent at the top of the
         * page. Push the section down so the hero image starts below it
         * rather than slipping behind it. */
        marginTop: '4rem',
        minHeight: 'clamp(380px, 70vh, 640px)',
        overflow: 'hidden',
        background: 'var(--color-void)',
      }}
    >
      {/* L0 — full-bleed hero image */}
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
          className="rd-hero-image"
          src={detail.heroImage}
          alt={detail.heroImageAlt}
          style={{
            width: '100%',
            height: '110%',
            objectFit: 'cover',
            display: 'block',
            willChange: 'transform, opacity',
          }}
          loading="eager"
        />
      </div>

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

      {/* L3 — content. Bottom padding is roomy so the title sits well
          above the zone where stats (02) float up via negative margin.
          Top padding is small now that the section itself starts below
          the navbar via marginTop. */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          minHeight: 'clamp(380px, 70vh, 640px)',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: 'clamp(2rem, 5vh, 3.5rem)',
          paddingBottom: 'clamp(8rem, 16vh, 12rem)',
          paddingInline: 'var(--section-padding)',
        }}
      >
        <Link
          href="/research#publications"
          className="rd-back"
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
          <span aria-hidden="true">←</span>
          {researchDetailLabels.backToResearch}
        </Link>

        <div
          className="section-container"
          style={{
            marginTop: 'auto',
            paddingInline: 0,
          }}
        >
          <div
            className="rd-chip"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.7rem',
              padding: '0.4rem 0.85rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.22em',
              color: 'var(--color-beam)',
              textTransform: 'uppercase',
              marginBottom: '1.25rem',
              background: 'rgba(168,240,255,0.08)',
              border: '1px solid rgba(168,240,255,0.3)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              willChange: 'transform, opacity',
            }}
          >
            <span>{detail.category}</span>
            <span aria-hidden="true" style={{ opacity: 0.5 }}>•</span>
            <span>{detail.year}</span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.85rem, 4.2vw, 3.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: '#ffffff',
              lineHeight: 1.08,
              margin: 0,
              maxWidth: '900px',
              textShadow: '0 4px 24px rgba(0,0,0,0.6)',
            }}
          >
            <WordSplit
              text={detail.title}
              style={{ display: 'inline' }}
              className="rd-title-line"
            />
          </h1>
        </div>
      </div>
    </section>
  );
}
