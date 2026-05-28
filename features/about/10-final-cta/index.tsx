'use client';
/* About Final CTA — pinned dramatic finale (Act V).
 *
 * 200% pin. The page's emotional crescendo — heading words rise one at a
 * time from blur, the highlight phrase glows hottest, CTAs settle in last.
 * Red parallax pool breathes throughout.
 *
 *   0.00–0.30  Heading words stagger up from blur (with highlight word igniting)
 *   0.30–0.45  Description fades up
 *   0.45–0.62  Primary CTA enters with red glow pulse
 *   0.55–0.72  Secondary CTA enters
 *   0.72–0.92  Red glow pool intensifies, top scan beam expands
 *   0.92–1.00  Camera pull-back to release into footer
 */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import Link from 'next/link';
import { aboutFinalCtaContent } from '@/content/about/final-cta';

const isInternalRoute = (href: string) => href.startsWith('/') && !href.startsWith('//');

export default function AboutFinalCta() {
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
            '.about-cta-word',
            '.about-cta-desc',
            '.about-cta-primary',
            '.about-cta-secondary',
          ],
          { opacity: 1, y: 0, filter: 'blur(0px)' },
        );
        return;
      }

      if (!isDesktop) {
        gsap.fromTo(
          '.about-cta-word',
          { opacity: 0, y: 24, filter: 'blur(8px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.7,
            stagger: 0.06,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: root,
              start: 'top 78%',
              toggleActions: 'play none none reset',
            } as ScrollTrigger.Vars,
          },
        );
        gsap.fromTo(
          '.about-cta-desc, .about-cta-primary, .about-cta-secondary',
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: root,
              start: 'top 70%',
              toggleActions: 'play none none reset',
            } as ScrollTrigger.Vars,
          },
        );
        return;
      }

      // Desktop pinned cinematic
      gsap.set('.about-cta-word', { opacity: 0, yPercent: 80, filter: 'blur(14px)' });
      gsap.set(
        ['.about-cta-desc', '.about-cta-primary', '.about-cta-secondary'],
        { opacity: 0, y: 26 },
      );
      gsap.set('.about-cta-glow', { opacity: 0.25, scale: 1 });
      gsap.set('.about-cta-scan', { scaleX: 0, transformOrigin: 'left center' });
      gsap.set('.about-cta-camera', { scale: 1, transformOrigin: 'center center' });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_DURATIONS.aboutFinalCta,
        scrub: 1,
        enabled: true,
      });

      // 0.02 scan beam expands across the top
      tl.to('.about-cta-scan', { scaleX: 1, duration: 0.20, ease: 'power3.out' }, 0.02);

      // 0.00–0.30 heading words stagger up
      tl.to(
        '.about-cta-word',
        {
          opacity: 1,
          yPercent: 0,
          filter: 'blur(0px)',
          duration: 0.25,
          stagger: 0.04,
          ease: 'power3.out',
        },
        0.00,
      );

      // 0.30–0.45 desc fades up
      tl.to('.about-cta-desc', { opacity: 1, y: 0, duration: 0.15, ease: 'power2.out' }, 0.30);

      // 0.45–0.62 primary CTA
      tl.to('.about-cta-primary', { opacity: 1, y: 0, duration: 0.15, ease: 'power3.out' }, 0.45);

      // 0.55–0.72 secondary CTA
      tl.to('.about-cta-secondary', { opacity: 1, y: 0, duration: 0.15, ease: 'power3.out' }, 0.55);

      // 0.72–0.92 red glow pool intensifies
      tl.to(
        '.about-cta-glow',
        { opacity: 0.6, scale: 1.2, duration: 0.20, ease: 'power2.inOut' },
        0.72,
      );

      // 0.92–1.00 camera pulls back to release
      tl.to(
        '.about-cta-camera',
        { scale: 0.96, duration: 0.08, ease: 'power2.inOut' },
        0.92,
      );
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  const parts = aboutFinalCtaContent.heading.split(aboutFinalCtaContent.highlight);
  const beforeWords = parts[0].trim().split(/\s+/).filter(Boolean);
  const afterWords = parts[1] ? parts[1].trim().split(/\s+/).filter(Boolean) : [];
  const highlightWords = aboutFinalCtaContent.highlight.trim().split(/\s+/).filter(Boolean);

  return (
    <section
      ref={sectionRef}
      id="about-cta"
      aria-label={aboutFinalCtaContent.heading}
      style={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        background:
          'radial-gradient(ellipse at center, rgba(255,61,90,0.18) 0%, rgba(80,15,25,0.55) 35%, var(--color-void) 80%)',
      }}
    >
      {/* Animated red pool */}
      <div
        className="about-cta-glow"
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '1200px',
          height: '800px',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse, rgba(255,61,90,0.45) 0%, rgba(255,61,90,0.1) 40%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          zIndex: 0,
          pointerEvents: 'none',
          willChange: 'transform, opacity',
        }}
      />

      {/* Grid + scan lines */}
      <div
        aria-hidden="true"
        className="absolute inset-0 grid-atmosphere pointer-events-none"
        style={{ opacity: 0.4, zIndex: 1 }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.015) 3px, rgba(255,255,255,0.015) 4px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Top scan beam */}
      <div
        aria-hidden="true"
        className="about-cta-scan"
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
          willChange: 'transform',
        }}
      />

      <div
        className="about-cta-camera"
        style={{
          position: 'relative',
          zIndex: 2,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingInline: 'var(--section-padding)',
          paddingTop: 'clamp(6rem, 14vh, 10rem)',
          paddingBottom: 'clamp(6rem, 14vh, 10rem)',
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        <div
          className="section-container"
          style={{ textAlign: 'center', maxWidth: '880px', marginInline: 'auto' }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-display-lg)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              color: 'var(--color-text-primary)',
              margin: '0 0 1.5rem',
              lineHeight: 1.1,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0.3em',
            }}
          >
            {beforeWords.map((word) => (
              <span
                key={`b-${word}`}
                className="about-cta-word"
                style={{
                  display: 'inline-block',
                  willChange: 'transform, opacity, filter',
                }}
              >
                {word}
              </span>
            ))}
            {highlightWords.map((word) => (
              <span
                key={`h-${word}`}
                className="about-cta-word"
                style={{
                  display: 'inline-block',
                  color: 'var(--color-red-team-glow)',
                  textShadow: '0 0 24px rgba(255,61,90,0.55)',
                  willChange: 'transform, opacity, filter',
                }}
              >
                {word}
              </span>
            ))}
            {afterWords.map((word) => (
              <span
                key={`a-${word}`}
                className="about-cta-word"
                style={{
                  display: 'inline-block',
                  willChange: 'transform, opacity, filter',
                }}
              >
                {word}
              </span>
            ))}
          </h2>

          <p
            className="about-cta-desc"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              margin: '0 auto 2.5rem',
              lineHeight: 1.6,
              maxWidth: '620px',
              willChange: 'transform, opacity',
            }}
          >
            {aboutFinalCtaContent.description}
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1rem',
            }}
          >
            {isInternalRoute(aboutFinalCtaContent.primary.href) ? (
              <Link
                href={aboutFinalCtaContent.primary.href}
                className="about-cta-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '1rem 2.25rem',
                  background: 'var(--color-red-team)',
                  color: '#fff',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-base)',
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  boxShadow: '0 0 24px rgba(255,61,90,0.4)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  willChange: 'transform, opacity',
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
                {aboutFinalCtaContent.primary.label}
                <span aria-hidden="true">›</span>
              </Link>
            ) : (
              <a
                href={aboutFinalCtaContent.primary.href}
                className="about-cta-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '1rem 2.25rem',
                  background: 'var(--color-red-team)',
                  color: '#fff',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-base)',
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  boxShadow: '0 0 24px rgba(255,61,90,0.4)',
                  willChange: 'transform, opacity',
                }}
              >
                {aboutFinalCtaContent.primary.label}
                <span aria-hidden="true">›</span>
              </a>
            )}

            <a
              href={aboutFinalCtaContent.secondary.href}
              className="about-cta-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '1rem 2.25rem',
                background: 'transparent',
                color: 'var(--color-text-primary)',
                border: '1px solid rgba(255,255,255,0.4)',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-base)',
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'background 0.2s, border-color 0.2s',
                willChange: 'transform, opacity',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
              }}
            >
              {aboutFinalCtaContent.secondary.label}
              <span aria-hidden="true">›</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
