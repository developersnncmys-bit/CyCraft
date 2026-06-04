'use client';
/* Download Access Tiers — pinned three-pillar reveal (Public / Member / Premium).
 *
 * 250% pin. Three tier cards ignite in turn — each card has its accent
 * color glow on ignition.
 *
 *   0.00–0.10  Badge enters
 *   0.05–0.18  Heading + description reveal
 *   0.22–0.38  Tier 1 (Public) ignites
 *   0.38–0.54  Tier 2 (Member) ignites
 *   0.54–0.70  Tier 3 (Premium) ignites
 *   0.85–1.00  Camera dollies in 3%
 */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { downloadAccessContent, type AccessTier } from '@/content/download/access';

const isInternalRoute = (href: string) => href.startsWith('/') && !href.startsWith('//');

const accentTone = (accent: AccessTier['accent']) => {
  switch (accent) {
    case 'cyan':
      return {
        border: 'rgba(168,240,255,0.35)',
        glow: '0 0 24px rgba(168,240,255,0.18)',
        text: 'var(--color-beam)',
      };
    case 'green':
      return {
        border: 'rgba(0,255,148,0.35)',
        glow: '0 0 24px rgba(0,255,148,0.18)',
        text: 'var(--color-terminal)',
      };
    case 'red':
      return {
        border: 'rgba(255,61,90,0.35)',
        glow: '0 0 24px rgba(255,61,90,0.18)',
        text: 'var(--color-red-team-glow)',
      };
  }
};

export default function DownloadAccess() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const cards = root.querySelectorAll<HTMLElement>('.download-access-card');

      if (reducedMotion) {
        gsap.set(
          [
            '.download-access-badge',
            '.download-access-heading',
            '.download-access-desc',
            '.download-access-card',
          ],
          { opacity: 1, y: 0, scale: 1 },
        );
        return;
      }

      if (!isDesktop) {
        gsap.fromTo(
          '.download-access-badge, .download-access-heading, .download-access-desc',
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: root, start: 'top 78%', toggleActions: 'play none none reset' } as ScrollTrigger.Vars,
          },
        );
        cards.forEach((c) => {
          gsap.fromTo(
            c,
            { opacity: 0, y: 36, scale: 0.95 },
            {
              opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out',
              scrollTrigger: { trigger: c, start: 'top 82%', toggleActions: 'play none none reset' } as ScrollTrigger.Vars,
            },
          );
        });
        return;
      }

      gsap.set(['.download-access-badge', '.download-access-desc'], { opacity: 0, y: 20 });
      gsap.set('.download-access-heading', { opacity: 0, yPercent: 30 });
      gsap.set('.download-access-camera', { scale: 1, transformOrigin: 'center center' });
      gsap.set(cards, { opacity: 0, y: 44, scale: 0.92 });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_DURATIONS.downloadAccess,
        scrub: 1,
        enabled: true,
      });

      tl.to('.download-access-badge', { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0.02);
      tl.to('.download-access-heading', { opacity: 1, yPercent: 0, duration: 0.12, ease: 'power3.out' }, 0.05);
      tl.to('.download-access-desc', { opacity: 1, y: 0, duration: 0.10, ease: 'power2.out' }, 0.15);

      const STARTS = [0.22, 0.38, 0.54];
      const DUR = 0.15;

      cards.forEach((c, i) => {
        const start = STARTS[i] ?? STARTS[STARTS.length - 1];
        tl.to(c, { opacity: 1, y: 0, scale: 1, duration: DUR, ease: 'power3.out' }, start);
      });

      tl.to(
        '.download-access-camera',
        { scale: 1.03, duration: 0.10, ease: 'power2.inOut' },
        0.88,
      );
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="download-access"
      aria-label={downloadAccessContent.heading}
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <style>{`
        .download-access-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1.5rem;
        }
        @media (max-width: 1023px) {
          .download-access-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 767px) {
          #download-access         { min-height: auto !important; }
          .download-access-camera  {
            min-height: auto !important;
            justify-content: flex-start !important;
            padding-top: clamp(3rem, 7vh, 5rem) !important;
            padding-bottom: clamp(3rem, 7vh, 5rem) !important;
          }
        }
      `}</style>

      <div
        className="download-access-camera"
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
          className="section-container"
          style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 6vh, 4.5rem)' }}
        >
          <div className="download-access-badge" style={{ display: 'inline-block' }}>
            <Badge label={downloadAccessContent.badge} />
          </div>
          <h2
            className="download-access-heading"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3.2vw, 2.75rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              color: 'var(--color-text-primary)',
              margin: '1.5rem 0 1rem',
              lineHeight: 1.1,
            }}
          >
            {downloadAccessContent.heading}
          </h2>
          <p
            className="download-access-desc"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            {downloadAccessContent.description}
          </p>
        </div>

        <div className="section-container download-access-grid">
          {downloadAccessContent.tiers.map((tier) => {
            const tone = accentTone(tier.accent);
            const ctaInternal = isInternalRoute(tier.cta.href);
            const ctaProps = {
              style: {
                display: 'inline-flex' as const,
                alignItems: 'center' as const,
                justifyContent: 'center' as const,
                gap: '0.5rem',
                padding: '0.85rem 1.25rem',
                background: 'transparent',
                color: tone.text,
                border: `1px solid ${tone.border}`,
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.2em',
                textTransform: 'uppercase' as const,
                textDecoration: 'none' as const,
                transition: 'background 0.25s, border-color 0.25s, box-shadow 0.25s',
              },
              onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'rgba(255,255,255,0.04)';
                el.style.boxShadow = tone.glow;
              },
              onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'transparent';
                el.style.boxShadow = 'none';
              },
            };

            return (
              <article
                key={tier.id}
                className="download-access-card"
                style={{
                  position: 'relative',
                  padding: 'clamp(1.75rem, 3vw, 2.25rem)',
                  background: 'rgba(13,16,20,0.5)',
                  border: `1px solid ${tone.border}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  willChange: 'transform, opacity',
                  boxShadow: tone.glow,
                }}
              >
                <div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      letterSpacing: '0.22em',
                      color: 'var(--color-text-tertiary)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {tier.tagline}
                  </span>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.5rem, 2.5vw, 1.85rem)',
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                      color: tone.text,
                      margin: '0.4rem 0 0',
                      lineHeight: 1.1,
                      textShadow: `0 0 16px ${tone.border}`,
                    }}
                  >
                    {tier.label}
                  </h3>
                </div>

                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-base)',
                    color: 'var(--color-text-secondary)',
                    margin: 0,
                    lineHeight: 1.65,
                  }}
                >
                  {tier.description}
                </p>

                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem',
                    flex: 1,
                  }}
                >
                  {tier.includes.map((item) => (
                    <li
                      key={item}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.6rem',
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.5,
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{ color: tone.text, flexShrink: 0, marginTop: '2px' }}
                      >
                        ›
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                {ctaInternal ? (
                  <Link href={tier.cta.href} {...ctaProps}>
                    {tier.cta.label}
                    <span aria-hidden="true">›</span>
                  </Link>
                ) : (
                  <a href={tier.cta.href} {...ctaProps}>
                    {tier.cta.label}
                    <span aria-hidden="true">›</span>
                  </a>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
