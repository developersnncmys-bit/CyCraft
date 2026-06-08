'use client';
/* Comparison — Act V, Section 14 of 22
 * Cinema mode: pinned 300vh. Header reveals, columns ignite, rows reveal
 * in alternating cadence (Traditional dim → CyCraft lit). */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap/register';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { comparisonContent } from '@/content/comparison';
import { ComparisonRow } from './components/ComparisonRow';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';

export default function ComparisonSection() {
  const isTablet = useMediaQuery('(min-width: 768px)');
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const container = sectionRef.current;
      if (!container) return;

      const rows = container.querySelectorAll<HTMLElement>('.comparison-row-el');

      if (reducedMotion) {
        gsap.set(rows, { opacity: 1, y: 0 });
        gsap.set(['.cmp-heading-el', '.cmp-desc-el', '.cmp-headers-el'], { opacity: 1 });
        return;
      }

      if (!isDesktop) {
        gsap.to(rows, {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out',
          scrollTrigger: { trigger: container, start: 'top 70%', toggleActions: 'play none none reset' },
        });
        return;
      }

      // Heading + description + column-header strip stay at default
      // opacity:1 (Approach B). The 5 comparison rows KEEP their cascade
      // reveal — that is the cinema beat for this section.
      gsap.set(rows,              { opacity: 0, y: 30 });
      gsap.set('.cmp-camera-el',  { opacity: 1 });

      // Row stagger is in timeline units. The factory applies timeScale(0.3),
      // so timeline-stagger 0.20 ≈ 0.67s of real time between rows — that's
      // what gives the visible one-by-one cascade.
      const tl = makePinnedTimeline({
        trigger: container,
        end: PIN_DURATIONS.comparison,
        scrub: 1,
        enabled: true,
        unpinned: true,
      });

      // Heading + description + column-header reveals removed (Approach B).
      tl.to(rows,
            { opacity: 1, y: 0, stagger: 0.20, duration: 0.18, ease: 'power2.out' }, 0.22);
    },
    { scope: sectionRef, dependencies: [reducedMotion, isDesktop] },
  );

  return (
    <SectionWrapper ref={sectionRef} id="comparison" act={5}>
      <div
        className="cmp-camera-el"
        style={{
          // Unpinned: camera-el flows naturally so heading + rows stack and
          // the user scrolls through them.
          position: 'relative',
          willChange: 'opacity',
        }}
      >
        <div
          style={{
            position: 'relative',
            zIndex: 3,
            paddingTop: 'clamp(5rem, 9vh, 6rem)',
            paddingBottom: 'clamp(2rem, 4vh, 3rem)',
            paddingInline: 'var(--section-padding)',
          }}
        >
          {/* Header */}
          <div className="section-container" style={{ textAlign: 'center', marginBottom: 'clamp(1.5rem, 3vh, 2.5rem)' }}>
            <h2
              className="cmp-heading-el"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.25rem, 2.2vw, 1.875rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: 'var(--color-text-primary)',
                margin: '0 auto 0.75rem',
                lineHeight: 1.15,
                maxWidth: '720px',
                willChange: 'transform, opacity',
              }}
            >
              {comparisonContent.heading}
            </h2>
            <p
              className="cmp-desc-el"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-secondary)',
                maxWidth: '520px',
                margin: '0 auto',
                lineHeight: 1.5,
                willChange: 'opacity',
              }}
            >
              {comparisonContent.description}
            </p>
          </div>

          {/* Column headers + rows — constrained to match comparison row width */}
          <div className="section-container" style={{ maxWidth: '1100px' }}>
            <div className="cmp-headers-el" style={{ willChange: 'opacity' }}>
              <div style={{ display: 'grid', gridTemplateColumns: isTablet ? '1fr 120px 1fr' : '1fr 1fr', gap: '0 1px', marginBottom: '2px' }}>
                <div style={{ padding: '0.5rem 1rem', textAlign: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.15em', color: 'var(--color-text-disabled)', textTransform: 'uppercase' }}>
                    Traditional
                  </span>
                </div>
                {isTablet && <div />}
                <div style={{ padding: '0.5rem 1rem', textAlign: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.15em', color: 'var(--color-beam)', textTransform: 'uppercase' }}>
                    CyCraft
                  </span>
                </div>
              </div>
              <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, var(--color-beam-glow), transparent)', marginBottom: '2px' }} aria-hidden="true" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              {comparisonContent.rows.map((row) => (
                <ComparisonRow
                  key={row.id}
                  label={row.label}
                  traditional={row.traditional}
                  cycraft={row.cycraft}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
