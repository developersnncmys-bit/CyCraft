'use client';
/* Why Choose CyCraft — pinned cinematic scene
 *
 * Pinned for 250%. Beats (0–1):
 *   0.00–0.05  Badge
 *   0.05–0.20  Heading words
 *   0.20–0.35  Description words
 *   0.35–0.85  4 feature cards ignite sequentially (one per ~0.12)
 *              with bounce — each card has time to read
 *   0.85–1.00  Camera scale 1 → 0.96
 */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { Badge } from '@/components/ui/Badge';
import { whyChooseContent, type WhyChooseIcon } from '@/content/home/why-choose';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { WordSplit } from '@/features/home/_shared/wordSplit';

function IconSvg({ name }: { name: WhyChooseIcon }) {
  const common = {
    width: 24,
    height: 24,
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
    case 'users':
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'badge':
      return (
        <svg {...common}>
          <circle cx="12" cy="9" r="6" />
          <path d="M8.5 14 7 22l5-3 5 3-1.5-8" />
        </svg>
      );
  }
}

export default function HomeWhyChoose() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();
  const isTablet = useMediaQuery('(min-width: 768px)');
  const isWide = useMediaQuery('(min-width: 1100px)');

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const cards = root.querySelectorAll<HTMLElement>('.why-choose-card-el');

      if (reducedMotion) {
        gsap.set(
          [
            '.why-choose-badge',
            '.why-choose-heading [data-word]',
            '.why-choose-desc [data-word]',
            '.why-choose-card-el',
          ],
          { opacity: 1, y: 0, scale: 1, filter: 'none' },
        );
        return;
      }

      if (!isDesktop) {
        const trigger = { trigger: root, start: 'top 75%', toggleActions: 'play none none reset' };
        gsap.fromTo('.why-choose-badge', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, scrollTrigger: trigger });
        gsap.fromTo(
          '.why-choose-heading [data-word]',
          { opacity: 0, yPercent: 60, filter: 'blur(8px)' },
          { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.04, delay: 0.2, scrollTrigger: trigger },
        );
        gsap.fromTo(
          '.why-choose-desc [data-word]',
          { opacity: 0, y: 8, filter: 'blur(4px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, stagger: 0.02, delay: 0.5, scrollTrigger: trigger },
        );
        gsap.fromTo(
          '.why-choose-card-el',
          { opacity: 0, y: 40, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.12, ease: 'back.out(1.2)', delay: 0.8, scrollTrigger: trigger },
        );
        return;
      }

      // Desktop cinematic
      gsap.set('.why-choose-badge', { opacity: 0, y: 18 });
      gsap.set('.why-choose-heading [data-word]', { opacity: 0, yPercent: 60, filter: 'blur(10px)' });
      gsap.set('.why-choose-desc [data-word]', { opacity: 0, y: 8, filter: 'blur(4px)' });
      gsap.set('.why-choose-card-el', { opacity: 0, y: 56, scale: 0.88 });
      gsap.set('.why-choose-camera', { scale: 1, transformOrigin: 'center center' });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_DURATIONS.homeWhyChoose,
        scrub: 1,
        enabled: true,
      });

      tl.to('.why-choose-badge', { opacity: 1, y: 0, duration: 0.05, ease: 'power2.out' }, 0)
        .to(
          '.why-choose-heading [data-word]',
          { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.15, stagger: 0.012, ease: 'power3.out' },
          0.05,
        )
        .to(
          '.why-choose-desc [data-word]',
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.15, stagger: 0.006, ease: 'power2.out' },
          0.20,
        )
        // 4 cards ignite one by one over 0.35-0.85 (0.12 stagger)
        .to(
          cards,
          { opacity: 1, y: 0, scale: 1, duration: 0.12, stagger: 0.12, ease: 'back.out(1.4)' },
          0.35,
        )
        .to('.why-choose-camera', { scale: 0.96, duration: 0.15, ease: 'power2.inOut' }, 0.85);
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="why-choose"
      aria-label="Why CyCraft"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <div
        className="why-choose-camera"
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
        <div
          className="section-container"
          style={{ textAlign: 'center', marginBottom: 'clamp(1.5rem, 3vh, 2.5rem)' }}
        >
          <div className="why-choose-badge" style={{ display: 'inline-block' }}>
            <Badge label={whyChooseContent.badge} />
          </div>
          <h2
            className="why-choose-heading"
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
            <WordSplit text={whyChooseContent.heading} />
          </h2>
          <p
            className="why-choose-desc"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-base)',
              color: 'var(--color-text-secondary)',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: 1.55,
            }}
          >
            <WordSplit text={whyChooseContent.description} />
          </p>
        </div>

        <div
          className="section-container"
          style={{
            display: 'grid',
            gridTemplateColumns: isWide ? 'repeat(4, 1fr)' : isTablet ? 'repeat(2, 1fr)' : '1fr',
            gap: '1.5rem',
          }}
        >
          {whyChooseContent.features.map((f) => (
            <div
              key={f.id}
              className="why-choose-card-el"
              style={{
                position: 'relative',
                padding: '1.5rem 1.25rem',
                border: '1px solid rgba(168,240,255,0.1)',
                background: 'rgba(13,16,20,0.4)',
                transition: 'border-color 0.3s, box-shadow 0.3s',
                cursor: 'default',
                willChange: 'transform, opacity',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = 'rgba(168,240,255,0.35)';
                el.style.boxShadow = '0 12px 32px rgba(0,0,0,0.5), 0 0 24px rgba(168,240,255,0.08)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = 'rgba(168,240,255,0.1)';
                el.style.boxShadow = 'none';
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: 'rgba(168,240,255,0.08)',
                  border: '1px solid rgba(168,240,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-beam)',
                  marginBottom: '0.85rem',
                }}
              >
                <IconSvg name={f.icon} />
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  color: 'var(--color-text-primary)',
                  margin: '0 0 0.55rem',
                  lineHeight: 1.2,
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-secondary)',
                  margin: 0,
                  lineHeight: 1.55,
                }}
              >
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
