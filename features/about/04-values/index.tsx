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
    case 'school':
      return (
        <svg {...common}>
          <path d="M3 9.5 12 5l9 4.5L12 14 3 9.5Z" />
          <path d="M7 11.5v5c0 1 2.5 2.5 5 2.5s5-1.5 5-2.5v-5" />
          <path d="M21 9.5V15" />
        </svg>
      );
    case 'lock':
      return (
        <svg {...common}>
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          <circle cx="12" cy="16" r="1.5" />
        </svg>
      );
    case 'wrench':
      return (
        <svg {...common}>
          <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4l-6.6 6.6 2.6 2.6 6.6-6.6a4 4 0 0 0 5.4-5.4l-2.4 2.4-2.5-2.5 2.4-2.4Z" />
        </svg>
      );
    case 'cap':
      return (
        <svg {...common}>
          <path d="M22 10 12 5 2 10l10 5 10-5Z" />
          <path d="M6 12v5a8 8 0 0 0 12 0v-5" />
          <path d="M22 10v6" />
        </svg>
      );
    case 'lightbulb':
      return (
        <svg {...common}>
          <path d="M9 18h6" />
          <path d="M10 21h4" />
          <path d="M12 3a6 6 0 0 0-4 10.5c1 1 1.5 2 1.5 3.5h5c0-1.5.5-2.5 1.5-3.5A6 6 0 0 0 12 3Z" />
        </svg>
      );
    case 'briefcase':
      return (
        <svg {...common}>
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="M3 13h18" />
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
            // 3-col on wide desktops (3×2 grid for 6 cards), 2-col on tablet,
            // single column on mobile. Replaces the previous 4-col layout that
            // left a 4+2 dangling row and produced very tall narrow cards.
            gridTemplateColumns: isGridWide
              ? 'repeat(3, 1fr)'
              : isGridDesktop
              ? 'repeat(2, 1fr)'
              : '1fr',
            gap: '1rem',
            maxWidth: '1200px',
            marginInline: 'auto',
          }}
        >
          {aboutValuesContent.values.map((v, i) => {
            // Per-card colour palette — cycles through cyan / red-team /
            // terminal-green / blue-team / violet / cyan. Avoids the
            // previous all-red wash and reads more like a "service catalog".
            const palette = [
              { hue: 'rgba(168,240,255', token: 'var(--color-beam-glow)' },     // cyan
              { hue: 'rgba(255,61,90',   token: 'var(--color-red-team-glow)' }, // red
              { hue: 'rgba(0,255,148',   token: 'var(--color-terminal)' },      // green
              { hue: 'rgba(61,168,255',  token: 'var(--color-blue-team)' },     // blue
              { hue: 'rgba(140,80,255',  token: 'rgba(140,80,255,1)' },         // violet
              { hue: 'rgba(168,240,255', token: 'var(--color-beam-glow)' },     // cyan
            ];
            const p = palette[i % palette.length];
            return (
              <div
                key={v.id}
                className="about-value-card"
                style={{
                  position: 'relative',
                  // Horizontal layout: icon column (auto width) + content column.
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  alignItems: 'start',
                  gap: '1.1rem',
                  padding: '1.4rem 1.5rem',
                  border: '1px solid rgba(168,240,255,0.1)',
                  background: 'rgba(13,16,20,0.55)',
                  willChange: 'transform, opacity',
                  transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s',
                  // Subtle accent strip on the left edge using the card's hue.
                  borderLeft: `2px solid ${p.hue},0.4)`,
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = `${p.hue},0.35)`;
                  el.style.borderLeftColor = `${p.hue},0.85)`;
                  el.style.boxShadow = `0 10px 28px rgba(0,0,0,0.5), 0 0 24px ${p.hue},0.12)`;
                  el.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = 'rgba(168,240,255,0.1)';
                  el.style.borderLeftColor = `${p.hue},0.4)`;
                  el.style.boxShadow = 'none';
                  el.style.transform = 'translateY(0)';
                }}
              >
                <div
                  aria-hidden="true"
                  className="about-value-icon"
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '8px',
                    background: `${p.hue},0.08)`,
                    border: `1px solid ${p.hue},0.3)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: p.token,
                    flexShrink: 0,
                    willChange: 'transform',
                  }}
                >
                  <ValueIconSvg name={v.icon} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      letterSpacing: '-0.01em',
                      color: 'var(--color-text-primary)',
                      margin: '0 0 0.45rem',
                      lineHeight: 1.25,
                    }}
                  >
                    {v.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.875rem',
                      color: 'var(--color-text-secondary)',
                      margin: 0,
                      lineHeight: 1.55,
                    }}
                  >
                    {v.description}
                  </p>
                </div>
              </div>
            );
          })}
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
