'use client';
/* Research Detail — Closing CTA (cinematic full-bleed banner).
 *
 * Full-bleed radial-gradient backdrop, mono eyebrow, big heading, two
 * action buttons. Heading reveals word-by-word from blur.
 */
import { useRef } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { WordSplit } from '@/features/home/_shared/wordSplit';
import { researchDetailLabels } from '@/content/research/details';

const isInternalRoute = (href: string) => href.startsWith('/') && !href.startsWith('//');

export default function ResearchDetailCta() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      if (reducedMotion) {
        gsap.set(['.rd-cta-el', '.rd-cta-heading [data-word]'], {
          opacity: 1,
          y: 0,
          yPercent: 0,
          filter: 'none',
        });
        return;
      }

      const trigger = {
        trigger: root,
        start: 'top 82%',
        toggleActions: 'play none none reset',
      } as ScrollTrigger.Vars;

      gsap.fromTo(
        '.rd-cta-heading [data-word]',
        { opacity: 0, yPercent: 70, filter: 'blur(8px)' },
        {
          opacity: 1,
          yPercent: 0,
          filter: 'blur(0px)',
          duration: 0.75,
          stagger: 0.055,
          ease: 'power3.out',
          scrollTrigger: trigger,
        },
      );

      gsap.fromTo(
        '.rd-cta-el',
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.1,
          delay: 0.3,
          ease: 'power3.out',
          scrollTrigger: trigger,
        },
      );
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  const { cta } = researchDetailLabels;
  const primaryInternal = isInternalRoute(cta.primary.href);
  const secondaryInternal = isInternalRoute(cta.secondary.href);

  return (
    <section
      ref={sectionRef}
      id="research-detail-cta"
      aria-label={cta.heading}
      style={{
        position: 'relative',
        marginTop: 'clamp(2rem, 5vh, 3.5rem)',
        paddingTop: 'clamp(5rem, 12vh, 8rem)',
        paddingBottom: 'clamp(5rem, 12vh, 8rem)',
        paddingInline: 'var(--section-padding)',
        background:
          'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(255,61,90,0.22) 0%, rgba(80,15,25,0.35) 35%, rgba(5,6,8,0.95) 80%)',
        overflow: 'hidden',
      }}
    >
      {/* Top scan beam */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background:
            'linear-gradient(to right, transparent, rgba(255,61,90,0.7), transparent)',
          boxShadow: '0 0 14px rgba(255,61,90,0.55)',
        }}
      />

      {/* Subtle grid texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 grid-atmosphere pointer-events-none"
        style={{ opacity: 0.25, zIndex: 0 }}
      />

      <div
        className="section-container"
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          maxWidth: '780px',
          marginInline: 'auto',
        }}
      >
        <div
          className="rd-cta-el"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.22em',
            color: 'var(--color-red-team-glow)',
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}
        >
          06 — Next Step
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.65rem, 3.2vw, 2.5rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            color: 'var(--color-text-primary)',
            margin: '0 0 1rem',
            lineHeight: 1.1,
          }}
        >
          <WordSplit
            text={cta.heading}
            style={{ display: 'inline' }}
            className="rd-cta-heading"
          />
        </h2>

        <p
          className="rd-cta-el"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-base)',
            color: 'var(--color-text-secondary)',
            margin: '0 auto 2.25rem',
            lineHeight: 1.6,
            maxWidth: '520px',
          }}
        >
          {cta.subline}
        </p>

        <div
          className="rd-cta-el"
          style={{
            display: 'inline-flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'center',
          }}
        >
          {primaryInternal ? (
            <Link
              href={cta.primary.href}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '1rem 2.25rem',
                background: 'var(--color-red-team)',
                color: '#fff',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                boxShadow: '0 0 28px rgba(255,61,90,0.4)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(-2px)';
                el.style.boxShadow = '0 0 40px rgba(255,61,90,0.6)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = '0 0 28px rgba(255,61,90,0.4)';
              }}
            >
              {cta.primary.label}
              <span aria-hidden="true">›</span>
            </Link>
          ) : (
            <a href={cta.primary.href}>{cta.primary.label}</a>
          )}

          {secondaryInternal ? (
            <Link
              href={cta.secondary.href}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '1rem 2.25rem',
                background: 'transparent',
                color: 'var(--color-text-primary)',
                border: '1px solid rgba(255,255,255,0.35)',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'background 0.2s, border-color 0.2s',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'rgba(255,255,255,0.08)';
                el.style.borderColor = 'rgba(255,255,255,0.7)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'transparent';
                el.style.borderColor = 'rgba(255,255,255,0.35)';
              }}
            >
              {cta.secondary.label}
            </Link>
          ) : (
            <a href={cta.secondary.href}>{cta.secondary.label}</a>
          )}
        </div>
      </div>
    </section>
  );
}
