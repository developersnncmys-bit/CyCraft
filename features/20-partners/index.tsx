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
const HAS_LOGO = new Set(['google', 'ibm', 'hp', 'cisco', 'mcafee', 'microland', 'vodafone', 'seciq']);

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

      // Badge + heading + description stay at default opacity:1 (Approach B).
      // Ticker-wrap reveal + camera scale/fade KEEP — cinema beats.
      gsap.set('.pt-ticker-wrap-el', { opacity: 0 });
      gsap.set('.pt-camera-el',      { scale: 1, opacity: 1 });

      const tl = makePinnedTimeline({
        trigger: container,
        end: PIN_DURATIONS.partners,
        scrub: 1,
        enabled: true,
        unpinned: true,
      });

      // Badge + heading + description reveals removed (Approach B).
      tl.to('.pt-ticker-wrap-el', { opacity: 1, duration: 0.20, ease: 'power2.out' }, 0.20)
        .to('.pt-camera-el',      { scale: 0.98, duration: 0.10, ease: 'power2.inOut' }, 0.90)
        // In-timeline fade — close the camera before the pin releases so
        // the partners composition doesn't linger on screen as the section
        // drifts past during its post-pin scroll tail. Same fix pattern as
        // curriculum + learning-evolution + cta-footer.
        .to('.pt-camera-el',      { opacity: 0, duration: 0.05, ease: 'power2.in' }, 0.95);
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
                    position: 'relative',
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
