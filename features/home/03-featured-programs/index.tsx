'use client';
/* Featured Programs — pinned cinematic scene
 *
 * Pinned for 250%. Beats (0–1):
 *   0.00–0.05  Badge
 *   0.05–0.18  Heading words
 *   0.18–0.30  Description words
 *   0.35–0.85  3 program cards cascade in over 0.5 of pin (one per ~0.16)
 *              with depth + scale — each card has time to land
 *   0.85–1.00  Camera scale 1 → 0.96
 */
import { useRef } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { Badge } from '@/components/ui/Badge';
import { featuredProgramsContent } from '@/content/home/featured-programs';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { WordSplit } from '@/features/home/_shared/wordSplit';

const teamColor = (team: 'red' | 'blue' | 'neutral') =>
  team === 'red'
    ? 'var(--color-red-team)'
    : team === 'blue'
    ? 'var(--color-blue-team)'
    : 'var(--color-beam)';

const isInternalRoute = (href: string) => href.startsWith('/') && !href.startsWith('//');

export default function HomeFeaturedPrograms() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();
  const isTablet = useMediaQuery('(min-width: 768px)');

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const cards = root.querySelectorAll<HTMLElement>('.program-card-el');

      if (reducedMotion) {
        gsap.set(
          [
            '.featured-programs-badge',
            '.featured-programs-heading [data-word]',
            '.featured-programs-desc [data-word]',
            '.program-card-el',
          ],
          { opacity: 1, y: 0, scale: 1, filter: 'none' },
        );
        return;
      }

      if (!isDesktop) {
        const trigger = {
          trigger: root,
          start: 'top 75%',
          toggleActions: 'play none none reset',
        };
        gsap.fromTo('.featured-programs-badge', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, scrollTrigger: trigger });
        gsap.fromTo(
          '.featured-programs-heading [data-word]',
          { opacity: 0, yPercent: 60, filter: 'blur(8px)' },
          { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.04, delay: 0.2, scrollTrigger: trigger },
        );
        gsap.fromTo(
          '.featured-programs-desc [data-word]',
          { opacity: 0, y: 8, filter: 'blur(4px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, stagger: 0.02, delay: 0.5, scrollTrigger: trigger },
        );
        gsap.fromTo(
          '.program-card-el',
          { opacity: 0, y: 40, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.8, scrollTrigger: trigger },
        );
        return;
      }

      // Desktop cinematic
      gsap.set('.featured-programs-badge', { opacity: 0, y: 18 });
      gsap.set('.featured-programs-heading [data-word]', { opacity: 0, yPercent: 60, filter: 'blur(10px)' });
      gsap.set('.featured-programs-desc [data-word]', { opacity: 0, y: 8, filter: 'blur(4px)' });
      gsap.set('.program-card-el', { opacity: 0, y: 56, scale: 0.9 });
      gsap.set('.featured-programs-camera', { scale: 1, transformOrigin: 'center center' });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_DURATIONS.homeFeaturedPrograms,
        scrub: 1,
        enabled: true,
      });

      tl.to('.featured-programs-badge', { opacity: 1, y: 0, duration: 0.05, ease: 'power2.out' }, 0)
        .to(
          '.featured-programs-heading [data-word]',
          { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.13, stagger: 0.012, ease: 'power3.out' },
          0.05,
        )
        .to(
          '.featured-programs-desc [data-word]',
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.12, stagger: 0.006, ease: 'power2.out' },
          0.18,
        )
        // Cards cascade — each one lands distinctly across the pin
        .to(
          cards,
          { opacity: 1, y: 0, scale: 1, duration: 0.14, stagger: 0.16, ease: 'back.out(1.2)' },
          0.35,
        )
        .to('.featured-programs-camera', { scale: 0.96, duration: 0.15, ease: 'power2.inOut' }, 0.85);
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="programs"
      aria-label="Our programs"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <div
        className="featured-programs-camera"
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: 'clamp(3rem, 6vh, 4.5rem)',
          paddingBottom: 'clamp(3rem, 6vh, 4.5rem)',
          paddingInline: 'var(--section-padding)',
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        <div className="section-container" style={{ textAlign: 'center', marginBottom: 'clamp(1.5rem, 3vh, 2.5rem)' }}>
          <div className="featured-programs-badge" style={{ display: 'inline-block' }}>
            <Badge label={featuredProgramsContent.badge} />
          </div>
          <h2
            className="featured-programs-heading"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3.2vw, 2.75rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: 'var(--color-text-primary)',
              margin: '1rem 0 0.75rem',
              lineHeight: 1.1,
              overflowWrap: 'break-word',
            }}
          >
            <WordSplit text={featuredProgramsContent.heading} />
          </h2>
          <p
            className="featured-programs-desc"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-base)',
              color: 'var(--color-text-secondary)',
              maxWidth: '560px',
              margin: '0 auto',
              lineHeight: 1.55,
            }}
          >
            <WordSplit text={featuredProgramsContent.description} />
          </p>
        </div>

        <div
          className="section-container"
          style={{
            display: 'grid',
            gridTemplateColumns: isTablet ? 'repeat(3, 1fr)' : '1fr',
            gap: '1px',
            background: 'rgba(168,240,255,0.06)',
          }}
        >
          {featuredProgramsContent.programs.map((p) => {
            const color = teamColor(p.team);
            const cardProps = {
              className: 'program-card-el',
              style: {
                position: 'relative' as const,
                background: 'var(--color-void)',
                padding: '1.5rem 1.5rem',
                display: 'flex' as const,
                flexDirection: 'column' as const,
                gap: '0.85rem',
                textDecoration: 'none' as const,
                color: 'inherit',
                transition: 'background 0.3s',
                overflow: 'hidden' as const,
                willChange: 'transform, opacity',
              },
              onMouseEnter: (e: React.MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.background = 'rgba(168,240,255,0.03)';
              },
              onMouseLeave: (e: React.MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.background = 'var(--color-void)';
              },
            };
            const cardInner = (
              <>
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: color,
                    boxShadow: `0 0 12px ${color}`,
                    opacity: 0.7,
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em', color, textTransform: 'uppercase' }}>
                    {p.tag}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.14em', color: 'var(--color-text-disabled)' }}>
                    {p.duration}
                  </span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--color-text-primary)', lineHeight: 1.2, margin: 0 }}>
                  {p.title}
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.55, margin: 0, flex: 1 }}>
                  {p.description}
                </p>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.18em', color, textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  {p.cta.label}
                  <span aria-hidden="true">›</span>
                </div>
              </>
            );
            return isInternalRoute(p.cta.href) ? (
              <Link key={p.id} href={p.cta.href} {...cardProps}>
                {cardInner}
              </Link>
            ) : (
              <a key={p.id} href={p.cta.href} {...cardProps}>
                {cardInner}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
