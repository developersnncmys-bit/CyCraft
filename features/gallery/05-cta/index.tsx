'use client';
/* Gallery CTA — pinned cinematic close.
 * Mirrors ResearchCta / VerifyCta / AssessmentCta. "Host CyCraft at Your
 * Campus" — partnership-driven close that routes to /contact for the
 * scoping conversation.
 *
 * 200% pin. Beats (0–1):
 *   0.00–0.05  Top scan beam draws across
 *   0.00–0.25  Heading words stagger up
 *   0.25–0.40  Description fades up
 *   0.40–0.55  Primary CTA appears
 *   0.55–0.70  Secondary CTA appears
 *   0.70–0.90  Beam glow pool intensifies
 *   0.90–1.00  Camera pulls back
 */
import { useRef } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { galleryCtaContent } from '@/content/gallery/cta';

export default function GalleryCta() {
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
            '.gallery-cta-word',
            '.gallery-cta-desc',
            '.gallery-cta-primary',
            '.gallery-cta-secondary',
            '.gallery-cta-scan',
            '.gallery-cta-glow',
          ],
          { opacity: 1, y: 0, scaleX: 1, scale: 1 },
        );
        return;
      }

      if (!isDesktop) {
        const trigger = {
          trigger: root,
          start: 'top 80%',
          toggleActions: 'play none none reset',
        } as ScrollTrigger.Vars;
        gsap.fromTo(
          '.gallery-cta-word',
          { opacity: 0, yPercent: 60, filter: 'blur(8px)' },
          { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.04, scrollTrigger: trigger },
        );
        gsap.fromTo(
          '.gallery-cta-desc',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.6, delay: 0.4, scrollTrigger: trigger },
        );
        gsap.fromTo(
          '.gallery-cta-primary, .gallery-cta-secondary',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 0.6, scrollTrigger: trigger },
        );
        return;
      }

      gsap.set('.gallery-cta-word', { opacity: 0, yPercent: 70, filter: 'blur(10px)' });
      gsap.set('.gallery-cta-desc', { opacity: 0, y: 16 });
      gsap.set('.gallery-cta-primary', { opacity: 0, y: 18 });
      gsap.set('.gallery-cta-secondary', { opacity: 0, y: 18 });
      gsap.set('.gallery-cta-scan', { scaleX: 0, transformOrigin: 'left center' });
      gsap.set('.gallery-cta-glow', { opacity: 0.25, scale: 1 });
      gsap.set('.gallery-cta-camera', { scale: 1, transformOrigin: 'center center' });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_DURATIONS.galleryCta,
        scrub: 1,
        enabled: true,
      });

      tl.to('.gallery-cta-scan', { scaleX: 1, duration: 0.20, ease: 'power3.out' }, 0.02);
      tl.to(
        '.gallery-cta-word',
        { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.25, stagger: 0.04, ease: 'power3.out' },
        0.00,
      );
      tl.to('.gallery-cta-desc', { opacity: 1, y: 0, duration: 0.15, ease: 'power2.out' }, 0.30);
      tl.to('.gallery-cta-primary', { opacity: 1, y: 0, duration: 0.15, ease: 'power3.out' }, 0.45);
      tl.to('.gallery-cta-secondary', { opacity: 1, y: 0, duration: 0.15, ease: 'power3.out' }, 0.55);
      tl.to(
        '.gallery-cta-glow',
        { opacity: 0.6, scale: 1.2, duration: 0.20, ease: 'power2.inOut' },
        0.72,
      );
      tl.to('.gallery-cta-camera', { scale: 0.96, duration: 0.08, ease: 'power2.inOut' }, 0.92);
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  const prefixWords = galleryCtaContent.headlinePrefix.trim().split(/\s+/).filter(Boolean);
  const accentWords = galleryCtaContent.headlineAccent.trim().split(/\s+/).filter(Boolean);

  return (
    <section
      ref={sectionRef}
      id="gallery-cta"
      aria-label={`${galleryCtaContent.headlinePrefix} ${galleryCtaContent.headlineAccent}`}
      style={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        background:
          'radial-gradient(ellipse at center, rgba(77,217,255,0.12) 0%, rgba(13,32,48,0.4) 35%, var(--color-void) 80%)',
      }}
    >
      <div
        className="gallery-cta-glow"
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '1200px',
          height: '800px',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse, rgba(77,217,255,0.35) 0%, rgba(77,217,255,0.08) 40%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          zIndex: 0,
          pointerEvents: 'none',
          willChange: 'transform, opacity',
        }}
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

      <div
        aria-hidden="true"
        className="gallery-cta-scan"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background:
            'linear-gradient(to right, transparent, rgba(77,217,255,0.7), transparent)',
          boxShadow: '0 0 14px rgba(77,217,255,0.55)',
          transformOrigin: 'left center',
          zIndex: 10,
          pointerEvents: 'none',
          willChange: 'transform',
        }}
      />

      <div
        className="gallery-cta-camera"
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
              fontSize: 'clamp(2rem, 4.5vw, 4rem)',
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
            {prefixWords.map((word) => (
              <span
                key={`p-${word}`}
                className="gallery-cta-word"
                style={{ display: 'inline-block', willChange: 'transform, opacity, filter' }}
              >
                {word}
              </span>
            ))}
            {accentWords.map((word) => (
              <span
                key={`a-${word}`}
                className="gallery-cta-word"
                style={{
                  display: 'inline-block',
                  color: 'var(--color-beam)',
                  textShadow: '0 0 24px var(--color-beam-glow)',
                  willChange: 'transform, opacity, filter',
                }}
              >
                {word}
              </span>
            ))}
          </h2>

          <p
            className="gallery-cta-desc"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '620px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.6,
            }}
          >
            {galleryCtaContent.description}
          </p>

          <div
            style={{
              display: 'inline-flex',
              flexWrap: 'wrap',
              gap: '1rem',
              justifyContent: 'center',
            }}
          >
            <Link
              href={galleryCtaContent.primaryCta.href}
              className="gallery-cta-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                padding: '1.05rem 2.5rem',
                background: 'var(--color-beam)',
                color: 'var(--color-void)',
                border: '1px solid var(--color-beam)',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                boxShadow: '0 0 28px rgba(77,217,255,0.4)',
                transition: 'transform 0.25s, box-shadow 0.25s',
                willChange: 'transform, opacity',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.transform = 'translateY(-2px)';
                el.style.boxShadow = '0 0 40px rgba(77,217,255,0.6)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = '0 0 28px rgba(77,217,255,0.4)';
              }}
            >
              {galleryCtaContent.primaryCta.label}
              <span aria-hidden="true">›</span>
            </Link>

            <Link
              href={galleryCtaContent.secondaryCta.href}
              className="gallery-cta-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                padding: '1.05rem 2.25rem',
                background: 'transparent',
                color: 'var(--color-beam)',
                border: '1px solid rgba(168,240,255,0.4)',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'background 0.25s, border-color 0.25s',
                willChange: 'transform, opacity',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = 'rgba(168,240,255,0.08)';
                el.style.borderColor = 'var(--color-beam)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = 'transparent';
                el.style.borderColor = 'rgba(168,240,255,0.4)';
              }}
            >
              {galleryCtaContent.secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
