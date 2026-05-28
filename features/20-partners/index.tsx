'use client';
/* Hiring Partners — Act VI, Section 20 of 22
 * Cinema mode: pinned 200vh. Header reveals, marquee ticker plays
 * continuously. CINEMA_SPEC §2.2 ("Constellation drift"). */
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { Badge } from '@/components/ui/Badge';
import { partnersContent } from '@/content/partners';
import { gsap } from '@/lib/gsap/register';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';

/** Partner ids that have a real logo asset under /public/images/. */
const HAS_LOGO = new Set(['cisco', 'mcafee', 'vodafone', 'google', 'ibm', 'hp', 'seciq']);

const BRAND_COLORS: Record<string, string> = {
  seciq:    'var(--color-beam)',
  ibm:      '#0F62FE',
  cisco:    '#00BCEB',
  google:   '#4285F4',
  hp:       '#0096D6',
  mcafee:   '#C8102E',
  vodafone: '#E60000',
};

export default function PartnersSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const animRef   = useRef<gsap.core.Tween | null>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();

  const doubled = [...partnersContent.partners, ...partnersContent.partners];

  // Always-on marquee (independent of pin timeline)
  useEffect(() => {
    const inner = tickerRef.current;
    if (!inner) return;
    animRef.current = gsap.to(inner, {
      x: '-50%',
      duration: 24,
      ease: 'none',
      repeat: -1,
    });
    return () => { animRef.current?.kill(); };
  }, []);

  useGSAP(
    () => {
      const container = sectionRef.current;
      if (!container) return;

      if (reducedMotion) {
        gsap.set(['.pt-heading-el', '.pt-badge-el', '.pt-desc-el', '.pt-ticker-wrap-el'],
                 { opacity: 1, y: 0 });
        return;
      }

      if (!isDesktop) {
        gsap.set(['.pt-heading-el', '.pt-badge-el', '.pt-desc-el', '.pt-ticker-wrap-el'],
                 { opacity: 1, y: 0 });
        return;
      }

      gsap.set('.pt-badge-el',       { opacity: 0 });
      gsap.set('.pt-heading-el',     { opacity: 0, y: 24 });
      gsap.set('.pt-desc-el',        { opacity: 0, y: 16 });
      gsap.set('.pt-ticker-wrap-el', { opacity: 0 });
      gsap.set('.pt-camera-el',      { scale: 1, opacity: 1 });

      const tl = makePinnedTimeline({
        trigger: container,
        end: PIN_DURATIONS.partners,
        scrub: 1,
        enabled: true,
      });

      tl.to('.pt-badge-el',       { opacity: 1, duration: 0.05, ease: 'power2.out' }, 0)
        .to('.pt-heading-el',     { opacity: 1, y: 0, duration: 0.08, ease: 'power3.out' }, 0.02)
        .to('.pt-desc-el',        { opacity: 1, y: 0, duration: 0.06, ease: 'power2.out' }, 0.06)
        .to('.pt-ticker-wrap-el', { opacity: 1, duration: 0.20, ease: 'power2.out' }, 0.20)
        .to('.pt-camera-el',      { scale: 0.98, duration: 0.10, ease: 'power2.inOut' }, 0.90);
    },
    { scope: sectionRef, dependencies: [reducedMotion, isDesktop] },
  );

  return (
    <SectionWrapper ref={sectionRef} id="partners" act={6}>
      <div
        className="pt-camera-el"
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: 'center center',
          willChange: 'transform, opacity',
        }}
      >
        {/* Header */}
        <div
          style={{
            position: 'relative',
            zIndex: 3,
            textAlign: 'center',
            paddingTop: 'clamp(7rem, 13vh, 9rem)',
            paddingBottom: 'clamp(1.5rem, 3vh, 2.5rem)',
            paddingInline: 'var(--section-padding)',
          }}
        >
          <div className="section-container">
            <div className="pt-badge-el" style={{ display: 'inline-block' }}>
              <Badge label={partnersContent.badge} />
            </div>
            <h2
              className="pt-heading-el"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: 'var(--color-text-primary)',
                margin: '1rem 0 0.75rem',
                lineHeight: 1.1,
                willChange: 'transform, opacity',
              }}
            >
              {partnersContent.heading}
            </h2>
            <p
              className="pt-desc-el"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-base)',
                color: 'var(--color-text-secondary)',
                maxWidth: '480px',
                margin: '0 auto',
                lineHeight: 1.55,
                willChange: 'opacity',
              }}
            >
              {partnersContent.description}
            </p>
          </div>
        </div>

        {/* ── Marquee ── */}
        <div
          className="pt-ticker-wrap-el"
          style={{ position: 'relative', zIndex: 3, overflow: 'hidden', paddingBlock: '1.25rem', willChange: 'opacity' }}
          onMouseEnter={() => animRef.current?.pause()}
          onMouseLeave={() => animRef.current?.resume()}
        >
          {(['left', 'right'] as const).map((side) => (
            <div
              key={side}
              aria-hidden="true"
              style={{
                position: 'absolute', top: 0, bottom: 0, [side]: 0,
                width: '120px', zIndex: 2, pointerEvents: 'none',
                background: `linear-gradient(to ${side === 'left' ? 'right' : 'left'}, var(--color-void), transparent)`,
              }}
            />
          ))}

          <div
            ref={tickerRef}
            style={{ display: 'flex', gap: '1.25rem', width: 'max-content', willChange: 'transform' }}
            role="list"
            aria-label="Hiring partners"
          >
            {doubled.map((partner, i) => {
              const isReal = i < partnersContent.partners.length;
              const accent = BRAND_COLORS[partner.id] ?? 'var(--color-beam)';
              const hasLogo = HAS_LOGO.has(partner.id);

              return (
                <div
                  key={`${partner.id}-${i}`}
                  role={isReal ? 'listitem' : undefined}
                  aria-hidden={!isReal ? true : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '160px',
                    height: '70px',
                    border: '1px solid rgba(168,240,255,0.07)',
                    background: 'var(--color-carbon)',
                    padding: '1rem',
                    flexShrink: 0,
                    cursor: 'default',
                    transition: 'border-color 0.3s, box-shadow 0.3s',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.borderColor = `${accent}55`;
                    el.style.boxShadow = `0 0 28px ${accent}22`;
                    const img = el.querySelector('img');
                    if (img) img.style.filter = 'grayscale(0) brightness(1) opacity(1)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.borderColor = 'rgba(168,240,255,0.07)';
                    el.style.boxShadow = 'none';
                    const img = el.querySelector('img');
                    if (img) img.style.filter = 'grayscale(1) brightness(0.95) opacity(0.6)';
                  }}
                >
                  {hasLogo ? (
                    <Image
                      src={partner.logo}
                      alt={isReal ? partner.name : ''}
                      fill
                      sizes="160px"
                      style={{
                        objectFit: 'contain',
                        padding: '0.75rem 1rem',
                        filter: 'grayscale(1) brightness(0.95) opacity(0.6)',
                        transition: 'filter 0.3s',
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: 'rgba(255,255,255,0.5)',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {partner.name}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
