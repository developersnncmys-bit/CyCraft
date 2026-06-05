'use client';
/* Research Focus — pinned cinematic walk through 6 research tracks.
 *
 * Mirrors AboutValues / AboutTeam composition: centered heading + desc,
 * then a grid that walks through its items in turn. Each card gets an
 * IGNITE moment (card lift + image zoom 1.08→1) on its window in the
 * pinned timeline.
 *
 * 400% pin. Internal beats:
 *   0.00–0.10  Badge enters
 *   0.05–0.18  Heading reveals + description fades up
 *   0.20–0.30  Card 1 ignites
 *   0.30–0.40  Card 2 ignites
 *   0.40–0.50  Card 3 ignites
 *   0.50–0.60  Card 4 ignites
 *   0.60–0.70  Card 5 ignites
 *   0.70–0.80  Card 6 ignites — full grid lit
 *   0.85–1.00  Camera dollies in 4%
 */
import { useRef } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { Badge } from '@/components/ui/Badge';
import {
  researchFocusContent,
  type ResearchFocus as Focus,
} from '@/content/research/focus';
import { researchDetailsContent } from '@/content/research/details';

const isInternalRoute = (href: string) => href.startsWith('/') && !href.startsWith('//');

function FocusCard({ focus }: { focus: Focus }) {
  const cardProps = {
    className: 'research-focus-card',
    style: {
      position: 'relative' as const,
      display: 'flex' as const,
      flexDirection: 'column' as const,
      background: 'rgba(13,16,20,0.4)',
      border: '1px solid rgba(168,240,255,0.1)',
      textDecoration: 'none' as const,
      color: 'inherit',
      willChange: 'transform, opacity',
      transition: 'border-color 0.3s, box-shadow 0.3s',
    },
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      const el = e.currentTarget as HTMLElement;
      el.style.borderColor = 'rgba(168,240,255,0.35)';
      el.style.boxShadow = '0 12px 32px rgba(0,0,0,0.5), 0 0 24px rgba(168,240,255,0.08)';
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      const el = e.currentTarget as HTMLElement;
      el.style.borderColor = 'rgba(168,240,255,0.1)';
      el.style.boxShadow = 'none';
    },
  };

  /* Pull the hero image from the corresponding detail entry so the focus
   * card on the listing page and the detail page hero are always the same
   * image. If a card ever lacks a detail entry the cyan-fallback gradient
   * stays as a graceful degradation. */
  const detail = researchDetailsContent[focus.id];
  const heroImage = detail?.heroImage;
  const heroImageAlt = detail?.heroImageAlt ?? `${focus.category} research track`;

  const cardBody = (
    <>
      <div
        style={{
          position: 'relative',
          height: '180px',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(168,240,255,0.08)',
          background:
            'linear-gradient(135deg, rgba(168,240,255,0.08) 0%, rgba(13,16,20,0.6) 60%, rgba(255,61,90,0.06) 100%)',
        }}
      >
        {heroImage && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            className="research-focus-card-image"
            src={heroImage}
            alt={heroImageAlt}
            loading="lazy"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transformOrigin: 'center center',
              willChange: 'transform',
            }}
          />
        )}
        {/* Darkening overlay so the chip + year badge stay readable */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(5,6,8,0.35) 0%, rgba(5,6,8,0.55) 100%)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
        <span
          style={{
            position: 'absolute',
            top: '0.85rem',
            left: '0.85rem',
            padding: '0.3rem 0.7rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.18em',
            color: 'var(--color-beam)',
            border: '1px solid rgba(168,240,255,0.3)',
            background: 'rgba(13,16,20,0.65)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            textTransform: 'uppercase',
            zIndex: 2,
          }}
        >
          {focus.category}
        </span>
        <span
          style={{
            position: 'absolute',
            bottom: '0.85rem',
            right: '0.85rem',
            padding: '0.3rem 0.7rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            color: 'var(--color-void)',
            background: 'var(--color-beam)',
            zIndex: 2,
          }}
        >
          {focus.year}
        </span>
      </div>

      <div
        style={{
          padding: '1.5rem 1.5rem 1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          flex: 1,
        }}
      >
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.2rem',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            color: 'var(--color-text-primary)',
            margin: 0,
            lineHeight: 1.25,
          }}
        >
          {focus.title}
        </h3>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.6,
            margin: 0,
            flex: 1,
          }}
        >
          {focus.description}
        </p>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: 'auto',
            paddingTop: '0.75rem',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--color-beam)',
          }}
        >
          Learn More
          <span aria-hidden="true">→</span>
        </div>
      </div>
    </>
  );

  return isInternalRoute(focus.href) ? (
    <Link href={focus.href} {...cardProps}>
      {cardBody}
    </Link>
  ) : (
    <a href={focus.href} {...cardProps}>
      {cardBody}
    </a>
  );
}

export default function ResearchFocus() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const cards = root.querySelectorAll<HTMLElement>('.research-focus-card');
      const images = root.querySelectorAll<HTMLElement>('.research-focus-card-image');

      if (reducedMotion) {
        gsap.set(
          [
            '.research-focus-badge',
            '.research-focus-heading',
            '.research-focus-desc',
            '.research-focus-card',
            '.research-focus-card-image',
          ],
          { opacity: 1, y: 0, scale: 1 },
        );
        return;
      }

      if (!isDesktop) {
        gsap.fromTo(
          '.research-focus-badge, .research-focus-heading, .research-focus-desc',
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

      // ── Desktop pinned ──────────────────────────────────────────────────
      gsap.set(['.research-focus-badge', '.research-focus-desc'], { opacity: 0, y: 20 });
      gsap.set('.research-focus-heading', { opacity: 0, yPercent: 30 });
      gsap.set('.research-focus-camera', { scale: 1, transformOrigin: 'center center' });
      cards.forEach((c) => gsap.set(c, { opacity: 0, y: 36, scale: 0.92 }));
      images.forEach((img) => gsap.set(img, { scale: 1.08 }));

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_DURATIONS.researchFocus,
        scrub: 1,
        enabled: true,
      });

      tl.to('.research-focus-badge', { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0.02);
      tl.to('.research-focus-heading', { opacity: 1, yPercent: 0, duration: 0.12, ease: 'power3.out' }, 0.05);
      tl.to('.research-focus-desc', { opacity: 1, y: 0, duration: 0.10, ease: 'power2.out' }, 0.15);

      const CARD_STARTS = [0.20, 0.30, 0.40, 0.50, 0.60, 0.70];
      const IGNITE_DUR = 0.08;

      cards.forEach((c, i) => {
        const start = CARD_STARTS[i] ?? CARD_STARTS[CARD_STARTS.length - 1];
        tl.to(c, { opacity: 1, y: 0, scale: 1, duration: IGNITE_DUR, ease: 'power3.out' }, start);
        const img = images[i];
        if (img) {
          tl.to(img, { scale: 1, duration: IGNITE_DUR * 1.5, ease: 'power2.out' }, start);
        }
      });

      tl.to(
        '.research-focus-camera',
        { scale: 1.04, duration: 0.15, ease: 'power2.inOut' },
        0.85,
      );
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="research-focus"
      aria-label="Active research tracks"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <style>{`
        .research-focus-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1.5rem;
        }
        @media (max-width: 1023px) {
          .research-focus-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 639px) {
          .research-focus-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div
        className="research-focus-camera"
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
          <div className="research-focus-badge" style={{ display: 'inline-block' }}>
            <Badge label={researchFocusContent.badge} />
          </div>
          <h2
            className="research-focus-heading"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3.2vw, 2.75rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              color: 'var(--color-text-primary)',
              margin: '1.5rem 0 1rem',
              lineHeight: 1.1,
              willChange: 'transform, opacity',
            }}
          >
            {researchFocusContent.heading}
          </h2>
          <p
            className="research-focus-desc"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '620px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            {researchFocusContent.description}
          </p>
        </div>

        <div className="section-container research-focus-grid">
          {researchFocusContent.focuses.map((focus) => (
            <FocusCard key={focus.id} focus={focus} />
          ))}
        </div>
      </div>
    </section>
  );
}
