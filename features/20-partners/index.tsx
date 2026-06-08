'use client';
/* Hiring Partners — Act VI, Section 20 of 22.
 * Film-mode: pinned ~160vh. Continuous marquee + film-treated header. */
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { Badge } from '@/components/ui/Badge';
import { partnersContent } from '@/content/partners';
import { gsap } from '@/lib/gsap/register';
import { useFilmReveal } from '@/lib/gsap/filmReveal';

const HAS_LOGO = new Set(['google', 'ibm', 'hp', 'cisco', 'mcafee', 'microland', 'vodafone', 'seciq']);

export default function PartnersSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<gsap.core.Tween | null>(null);
  useFilmReveal(sectionRef, { pin: '+=160%' });

  const doubled = [...partnersContent.partners, ...partnersContent.partners];

  // Continuous marquee — independent of pin timeline.
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

  return (
    <SectionWrapper ref={sectionRef} id="partners" act={6}>
      <div
        className="film-bg-deep"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-10%',
          zIndex: 0,
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(168,240,255,0.14), transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(140,80,255,0.06), transparent 55%)',
          pointerEvents: 'none',
        }}
      />
      <div
        className="film-bg-mid"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-5%',
          zIndex: 0,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 6px, rgba(168,240,255,0.022) 6px, rgba(168,240,255,0.022) 7px)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="film-camera pt-camera-el"
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: 'center center',
          willChange: 'transform',
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
            <div className="film-fade pt-badge-el" data-at="0.05" style={{ display: 'inline-block' }}>
              <Badge label={partnersContent.badge} />
            </div>
            <h2
              className="film-fade pt-heading-el"
              data-at="0.10"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: 'var(--color-text-primary)',
                margin: '1rem 0 0.75rem',
                lineHeight: 1.1,
              }}
            >
              {partnersContent.heading}
            </h2>
            <p
              className="film-fade pt-desc-el"
              data-at="0.15"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-base)',
                color: 'var(--color-text-secondary)',
                maxWidth: '480px',
                margin: '0 auto',
                lineHeight: 1.55,
              }}
            >
              {partnersContent.description}
            </p>
          </div>
        </div>

        {/* Marquee */}
        <div
          className="film-fade pt-ticker-wrap-el"
          data-at="0.25"
          data-dur="0.18"
          style={{ position: 'relative', zIndex: 3, overflow: 'hidden', paddingBlock: '1.25rem' }}
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
