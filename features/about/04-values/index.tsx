'use client';
/* About Values — pinned scene (Act II).
 *
 * 350% pin. Internal beats:
 *   0.00–0.10  Badge enters
 *   0.05–0.18  Heading reveals
 *   0.15–0.25  Description fades up
 *   0.25–0.40  Value 1 ignites (lift + glow)
 *   0.40–0.55  Value 2 ignites
 *   0.55–0.70  Value 3 ignites
 *   0.70–0.85  Value 4 ignites — full grid lit
 *   0.85–1.00  Camera dollies in 4% on the grid, vignette deepens
 */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { Badge } from '@/components/ui/Badge';
import { aboutValuesContent, type ValueIcon } from '@/content/about/values';

function ValueIconSvg({ name }: { name: ValueIcon }) {
  const common = {
    width: 26,
    height: 26,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
  switch (name) {
    case 'shield':
      return (
        <svg {...common}>
          <path d="M12 2 4 5v7c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V5l-8-3Z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case 'target':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
      );
    case 'badge':
      return (
        <svg {...common}>
          <circle cx="12" cy="9" r="6" />
          <path d="M8.5 14 7 22l5-3 5 3-1.5-8" />
        </svg>
      );
    case 'users':
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
  }
}

export default function AboutValues() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();
  const isGridDesktop = useMediaQuery('(min-width: 768px)');
  const isGridWide = useMediaQuery('(min-width: 1100px)');

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const cards = root.querySelectorAll<HTMLElement>('.about-value-card');

      if (reducedMotion) {
        gsap.set(
          ['.about-values-badge', '.about-values-heading', '.about-values-desc'],
          { opacity: 1, y: 0 },
        );
        cards.forEach((c) => {
          gsap.set(c, { opacity: 1, y: 0, scale: 1 });
          gsap.set(c.querySelector('.about-value-icon'), { scale: 1 });
        });
        return;
      }

      if (!isDesktop) {
        gsap.fromTo(
          '.about-values-badge, .about-values-heading, .about-values-desc',
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: root,
              start: 'top 78%',
              toggleActions: 'play none none reset',
            } as ScrollTrigger.Vars,
          },
        );
        cards.forEach((c) => {
          gsap.fromTo(
            c,
            { opacity: 0, y: 36, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: c,
                start: 'top 82%',
                toggleActions: 'play none none reset',
              } as ScrollTrigger.Vars,
            },
          );
        });
        return;
      }

      // Desktop pinned
      gsap.set(['.about-values-badge', '.about-values-desc'], { opacity: 0, y: 20 });
      gsap.set('.about-values-heading', { opacity: 0, yPercent: 30 });
      gsap.set('.about-values-camera', { scale: 1, transformOrigin: 'center center' });
      gsap.set('.about-values-vignette', { opacity: 0 });
      cards.forEach((c) => {
        gsap.set(c, { opacity: 0, y: 36, scale: 0.92 });
        const icon = c.querySelector('.about-value-icon');
        if (icon) gsap.set(icon, { scale: 0.7, rotate: -8 });
      });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_DURATIONS.aboutValues,
        scrub: 1,
        enabled: true,
      });

      tl.to('.about-values-badge', { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0);
      tl.to(
        '.about-values-heading',
        { opacity: 1, yPercent: 0, duration: 0.12, ease: 'power3.out' },
        0.05,
      );
      tl.to('.about-values-desc', { opacity: 1, y: 0, duration: 0.10, ease: 'power2.out' }, 0.15);

      const CARD_STARTS = [0.25, 0.40, 0.55, 0.70];
      const IGNITE_DUR = 0.13;

      cards.forEach((c, i) => {
        const start = CARD_STARTS[i] ?? CARD_STARTS[CARD_STARTS.length - 1];
        tl.to(
          c,
          { opacity: 1, y: 0, scale: 1, duration: IGNITE_DUR, ease: 'power3.out' },
          start,
        );
        const icon = c.querySelector('.about-value-icon');
        if (icon) {
          tl.to(
            icon,
            { scale: 1, rotate: 0, duration: IGNITE_DUR, ease: 'back.out(2)' },
            start + 0.02,
          );
        }
      });

      // 0.85–1.00 camera dolly in + vignette
      tl.to(
        '.about-values-camera',
        { scale: 1.04, duration: 0.15, ease: 'power2.inOut' },
        0.85,
      );
      tl.to('.about-values-vignette', { opacity: 1, duration: 0.15, ease: 'power2.in' }, 0.85);
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="about-values"
      aria-label={aboutValuesContent.heading}
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <div
        className="about-values-camera"
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingInline: 'var(--section-padding)',
          paddingTop: 'clamp(5rem, 10vh, 8rem)',
          paddingBottom: 'clamp(5rem, 10vh, 8rem)',
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: 0.35, zIndex: 0 }}
        />

        <div
          className="section-container"
          style={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            marginBottom: 'clamp(3rem, 6vh, 4.5rem)',
          }}
        >
          <div className="about-values-badge" style={{ display: 'inline-block' }}>
            <Badge label={aboutValuesContent.badge} />
          </div>
          <h2
            className="about-values-heading"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-display-md)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              color: 'var(--color-text-primary)',
              margin: '1.5rem 0 1rem',
              lineHeight: 1.1,
              willChange: 'transform, opacity',
            }}
          >
            {aboutValuesContent.heading}
          </h2>
          <p
            className="about-values-desc"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '620px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            {aboutValuesContent.description}
          </p>
        </div>

        <div
          className="section-container"
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'grid',
            gridTemplateColumns: isGridWide
              ? 'repeat(4, 1fr)'
              : isGridDesktop
              ? 'repeat(2, 1fr)'
              : '1fr',
            gap: '1.5rem',
          }}
        >
          {aboutValuesContent.values.map((v) => (
            <div
              key={v.id}
              className="about-value-card"
              style={{
                position: 'relative',
                padding: '2rem 1.75rem',
                border: '1px solid rgba(168,240,255,0.1)',
                background: 'rgba(13,16,20,0.4)',
                willChange: 'transform, opacity',
                transition: 'border-color 0.3s, box-shadow 0.3s',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = 'rgba(168,240,255,0.35)';
                el.style.boxShadow =
                  '0 12px 32px rgba(0,0,0,0.5), 0 0 24px rgba(168,240,255,0.08)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = 'rgba(168,240,255,0.1)';
                el.style.boxShadow = 'none';
              }}
            >
              <div
                aria-hidden="true"
                className="about-value-icon"
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '10px',
                  background: 'rgba(255,61,90,0.08)',
                  border: '1px solid rgba(255,61,90,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-red-team-glow)',
                  marginBottom: '1.5rem',
                  willChange: 'transform',
                }}
              >
                <ValueIconSvg name={v.icon} />
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.35rem',
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  color: 'var(--color-text-primary)',
                  margin: '0 0 0.85rem',
                  lineHeight: 1.2,
                }}
              >
                {v.title}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-text-secondary)',
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {v.description}
              </p>
            </div>
          ))}
        </div>

        {/* Vignette */}
        <div
          aria-hidden="true"
          className="about-values-vignette"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at center, transparent 30%, var(--color-void) 95%)',
            opacity: 0,
            zIndex: 2,
            pointerEvents: 'none',
            willChange: 'opacity',
          }}
        />
      </div>
    </section>
  );
}
