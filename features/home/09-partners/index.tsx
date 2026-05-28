'use client';
/* Partners — pinned cinematic scene
 *
 * Pinned for 150% (shorter — it's a logo strip, doesn't need long pin).
 * Beats:
 *   0.00–0.05  Badge
 *   0.05–0.20  Heading words ("Our" + accented "Clients and Partners")
 *   0.20–0.32  Description words
 *   0.32–0.85  Partner logos cascade with bounce (tied to scroll)
 *   0.90–1.00  Camera scale 1 → 0.96
 */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { Badge } from '@/components/ui/Badge';
import { homePartnersContent } from '@/content/home/partners';
import { WordSplit } from '@/features/home/_shared/wordSplit';

export default function HomePartners() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();
  const isTablet = useMediaQuery('(min-width: 640px)');
  const isLarge = useMediaQuery('(min-width: 1024px)');

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const logos = root.querySelectorAll<HTMLElement>('.home-partner-el');

      if (reducedMotion) {
        gsap.set(
          [
            '.partners-badge',
            '.partners-heading [data-word]',
            '.partners-desc [data-word]',
            '.home-partner-el',
          ],
          { opacity: 1, y: 0, scale: 1, filter: 'none' },
        );
        return;
      }

      if (!isDesktop) {
        const trigger = { trigger: root, start: 'top 75%', toggleActions: 'play none none reset' };
        gsap.fromTo('.partners-badge', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, scrollTrigger: trigger });
        gsap.fromTo(
          '.partners-heading [data-word]',
          { opacity: 0, yPercent: 60, filter: 'blur(8px)' },
          { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.05, delay: 0.2, scrollTrigger: trigger },
        );
        gsap.fromTo(
          '.partners-desc [data-word]',
          { opacity: 0, y: 8, filter: 'blur(4px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, stagger: 0.025, delay: 0.5, scrollTrigger: trigger },
        );
        gsap.fromTo(
          '.home-partner-el',
          { opacity: 0, y: 24, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(1.4)', delay: 0.8, scrollTrigger: trigger },
        );
        return;
      }

      // Desktop cinematic
      gsap.set('.partners-badge', { opacity: 0, y: 18 });
      gsap.set('.partners-heading [data-word]', { opacity: 0, yPercent: 60, filter: 'blur(10px)' });
      gsap.set('.partners-desc [data-word]', { opacity: 0, y: 8, filter: 'blur(4px)' });
      gsap.set('.home-partner-el', { opacity: 0, y: 32, scale: 0.88 });
      gsap.set('.partners-camera', { scale: 1, transformOrigin: 'center center' });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_DURATIONS.homePartners,
        scrub: 1,
        enabled: true,
      });

      tl.to('.partners-badge', { opacity: 1, y: 0, duration: 0.05, ease: 'power2.out' }, 0)
        .to(
          '.partners-heading [data-word]',
          { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.15, stagger: 0.015, ease: 'power3.out' },
          0.05,
        )
        .to(
          '.partners-desc [data-word]',
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.12, stagger: 0.008, ease: 'power2.out' },
          0.20,
        )
        .to(
          logos,
          { opacity: 1, y: 0, scale: 1, duration: 0.10, stagger: 0.07, ease: 'back.out(1.4)' },
          0.32,
        )
        .to('.partners-camera', { scale: 0.96, duration: 0.10, ease: 'power2.inOut' }, 0.90);
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="partners"
      aria-label="Our partners"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <div
        className="partners-camera"
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
          <div className="partners-badge" style={{ display: 'inline-block' }}>
            <Badge label={homePartnersContent.badge} />
          </div>
          <h2
            className="partners-heading"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3.2vw, 2.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: 'var(--color-text-primary)',
              margin: '1rem 0 0.75rem',
              lineHeight: 1.1,
              overflowWrap: 'break-word',
            }}
          >
            <WordSplit text="Our " />
            <span style={{ color: 'var(--color-beam)', textShadow: '0 0 18px var(--color-beam-glow)' }}>
              <WordSplit text="Clients and Partners" />
            </span>
          </h2>
          <p
            className="partners-desc"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-base)',
              color: 'var(--color-text-secondary)',
              maxWidth: '560px',
              margin: '0 auto',
              lineHeight: 1.5,
            }}
          >
            <WordSplit text={homePartnersContent.description} />
          </p>
        </div>

        <div
          className="section-container"
          style={{
            display: 'grid',
            gridTemplateColumns: isLarge ? 'repeat(4, 1fr)' : isTablet ? 'repeat(2, 1fr)' : '1fr',
            gap: '1px',
            background: 'rgba(168,240,255,0.06)',
            border: '1px solid rgba(168,240,255,0.08)',
            maxWidth: '1100px',
            marginInline: 'auto',
          }}
        >
          {homePartnersContent.partners.map((p) => (
            <div
              key={p.id}
              className="home-partner-el"
              style={{
                background: 'var(--color-void)',
                padding: '1.25rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '88px',
                transition: 'background 0.3s',
                cursor: 'default',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.background = 'rgba(168,240,255,0.03)';
                const img = el.querySelector<HTMLImageElement>('img');
                if (img) img.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.background = 'var(--color-void)';
                const img = el.querySelector<HTMLImageElement>('img');
                if (img) img.style.opacity = '0.7';
              }}
              title={p.name}
            >
              <img
                src={p.logo}
                alt={p.name}
                loading="lazy"
                style={{
                  maxWidth: '100%',
                  maxHeight: '52px',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  // Converts any coloured logo to pure white
                  filter: 'brightness(0) invert(1)',
                  opacity: 0.7,
                  transition: 'opacity 0.3s',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
