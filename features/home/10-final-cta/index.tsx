'use client';
/* Final CTA — pinned cinematic closing beat
 *
 * Pinned for 250%. Beats:
 *   0.00–0.20  Heading words (dramatic blur-lift, big stagger)
 *   0.25–0.45  Description words
 *   0.50–0.65  CTA button — back.out(1.6) bounce
 *   0.70–1.00  Red glow intensifies + camera scale 1 → 0.94
 */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { homeFinalCtaContent } from '@/content/home/final-cta';
import { WordSplit } from '@/features/home/_shared/wordSplit';

export default function HomeFinalCta() {
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
            '.final-cta-heading [data-word]',
            '.final-cta-desc [data-word]',
            '.final-cta-button',
          ],
          { opacity: 1, y: 0, scale: 1, filter: 'none' },
        );
        return;
      }

      if (!isDesktop) {
        const trigger = { trigger: root, start: 'top 72%', toggleActions: 'play none none reset' };
        gsap.fromTo(
          '.final-cta-heading [data-word]',
          { opacity: 0, yPercent: 70, filter: 'blur(10px)' },
          { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.9, stagger: 0.07, scrollTrigger: trigger },
        );
        gsap.fromTo(
          '.final-cta-desc [data-word]',
          { opacity: 0, y: 10, filter: 'blur(4px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, stagger: 0.03, delay: 0.7, scrollTrigger: trigger },
        );
        gsap.fromTo(
          '.final-cta-button',
          { opacity: 0, y: 30, scale: 0.85 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.6)', delay: 1.3, scrollTrigger: trigger },
        );
        return;
      }

      // Desktop cinematic
      gsap.set('.final-cta-heading [data-word]', { opacity: 0, yPercent: 70, filter: 'blur(12px)' });
      gsap.set('.final-cta-desc [data-word]', { opacity: 0, y: 10, filter: 'blur(4px)' });
      gsap.set('.final-cta-button', { opacity: 0, y: 30, scale: 0.8 });
      gsap.set('.final-cta-glow', { opacity: 0.6 });
      gsap.set('.final-cta-camera', { scale: 1, transformOrigin: 'center center' });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_DURATIONS.homeFinalCta,
        scrub: 1,
        enabled: true,
      });

      tl.to(
        '.final-cta-heading [data-word]',
        { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.20, stagger: 0.015, ease: 'power3.out' },
        0,
      )
        .to(
          '.final-cta-desc [data-word]',
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.18, stagger: 0.008, ease: 'power2.out' },
          0.25,
        )
        .to('.final-cta-button', { opacity: 1, y: 0, scale: 1, duration: 0.15, ease: 'back.out(1.6)' }, 0.50)
        .to('.final-cta-glow', { opacity: 1, duration: 0.30, ease: 'power2.inOut' }, 0.70)
        .to('.final-cta-camera', { scale: 0.94, duration: 0.25, ease: 'power2.inOut' }, 0.75);
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  const headingParts = homeFinalCtaContent.heading.split(homeFinalCtaContent.highlight);

  return (
    <section
      ref={sectionRef}
      id="join"
      aria-label={homeFinalCtaContent.heading}
      style={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Camera viewport */}
      <div
        className="final-cta-camera"
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingInline: 'var(--section-padding)',
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        {/* Red glow background — intensifies near end of pin */}
        <div
          aria-hidden="true"
          className="final-cta-glow"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at center, rgba(255,61,90,0.22) 0%, rgba(80,15,25,0.55) 35%, var(--color-void) 80%)',
            zIndex: 1,
            pointerEvents: 'none',
            willChange: 'opacity',
          }}
        />
      {/* Grid */}
      <div aria-hidden="true" className="absolute inset-0 grid-atmosphere pointer-events-none" style={{ opacity: 0.4 }} />

      {/* Scan lines */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.015) 3px, rgba(255,255,255,0.015) 4px)',
          pointerEvents: 'none',
        }}
      />

      {/* Top scan beam — animated on scroll into view */}
      <div
        aria-hidden="true"
        className="section-enter-beam"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background:
            'linear-gradient(to right, transparent, rgba(255,61,90,0.7), transparent)',
          boxShadow: '0 0 14px rgba(255,61,90,0.55)',
          transformOrigin: 'left center',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      />

      <div
        className="section-container"
        style={{ position: 'relative', textAlign: 'center', maxWidth: '820px', marginInline: 'auto', zIndex: 6 }}
      >
        <h2
          className="final-cta-heading"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 3.6vw, 3rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: 'var(--color-text-primary)',
            margin: '0 0 1.25rem',
            lineHeight: 1.12,
            overflowWrap: 'break-word',
          }}
        >
          <WordSplit text={headingParts[0]} />
          <span
            style={{
              color: 'var(--color-red-team-glow)',
              textShadow: '0 0 24px rgba(255,61,90,0.55)',
            }}
          >
            <WordSplit text={homeFinalCtaContent.highlight} />
          </span>
          <WordSplit text={headingParts[1]} />
        </h2>

        <p
          className="final-cta-desc"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-base)',
            color: 'var(--color-text-secondary)',
            margin: '0 auto 2rem',
            lineHeight: 1.55,
            maxWidth: '540px',
          }}
        >
          <WordSplit text={homeFinalCtaContent.description} />
        </p>

        <div
          className="final-cta-button"
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '0.85rem',
          }}
        >
          {/* Primary — Join CyCraft (red filled) */}
          <a
            href={homeFinalCtaContent.primary.href}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.55rem',
              padding: '0.85rem 1.85rem',
              background: 'var(--color-red-team)',
              color: '#fff',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              boxShadow: '0 0 24px rgba(255,61,90,0.4)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.transform = 'translateY(-2px)';
              el.style.boxShadow = '0 0 36px rgba(255,61,90,0.6)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.transform = 'translateY(0)';
              el.style.boxShadow = '0 0 24px rgba(255,61,90,0.4)';
            }}
          >
            {homeFinalCtaContent.primary.label}
            <span aria-hidden="true">›</span>
          </a>

          {/* Secondary — Start Learning (outline) */}
          <a
            href={homeFinalCtaContent.secondary.href}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.55rem',
              padding: '0.85rem 1.85rem',
              background: 'transparent',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.4)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'border-color 0.2s, background 0.2s',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = '#fff';
              el.style.background = 'rgba(255,255,255,0.08)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = 'rgba(255,255,255,0.4)';
              el.style.background = 'transparent';
            }}
          >
            {homeFinalCtaContent.secondary.label}
            <span aria-hidden="true">›</span>
          </a>

          {/* Tertiary — Contact Us (ghost text link) */}
          <a
            href={homeFinalCtaContent.tertiary.href}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.55rem',
              padding: '0.85rem 1.2rem',
              background: 'transparent',
              color: 'rgba(255,255,255,0.7)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.7)';
            }}
          >
            {homeFinalCtaContent.tertiary.label}
            <span aria-hidden="true">›</span>
          </a>
        </div>
      </div>
      </div>
    </section>
  );
}
