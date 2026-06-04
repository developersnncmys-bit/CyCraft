'use client';
/* Placements — Act V, Section 16 of 22
 * Cinema mode: pinned 250vh. Number constellation forms — metrics fade up,
 * each value counts from 0 to target via scroll-bound onUpdate. */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap/register';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { Badge } from '@/components/ui/Badge';
import { placementsContent } from '@/content/placements';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';

const FONT_SIZE_D: Record<string, string> = {
  highest: '2.75rem', top10: '2rem', average: '1.75rem',
  median: '1.75rem', partners: '1.75rem', guarantee: '1.75rem',
};
const FONT_SIZE_M: Record<string, string> = {
  highest: '2rem', top10: '1.5rem', average: '1.35rem',
  median: '1.35rem', partners: '1.35rem', guarantee: '1.35rem',
};

function parseMetric(value: string) {
  const prefix = value.startsWith('₹') ? '₹' : '';
  const unit   = value.endsWith('LPA') ? 'LPA'
               : value.endsWith('%')   ? '%'
               : value.endsWith('+')   ? '+'
               : '';
  return { prefix, unit };
}

export default function PlacementsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isTablet = useMediaQuery('(min-width: 768px)');
  const isPhone   = !useMediaQuery('(min-width: 480px)');
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const container = sectionRef.current;
      if (!container) return;

      const cards = container.querySelectorAll<HTMLElement>('.metric-card-el');
      const values = container.querySelectorAll<HTMLElement>('.metric-value-el');

      if (reducedMotion) {
        gsap.set(cards, { opacity: 1, y: 0 });
        values.forEach((el) => {
          const numeric = parseFloat(el.dataset.numeric ?? '0');
          const isFloat = (el.dataset.numeric ?? '').includes('.');
          const prefix  = el.dataset.prefix ?? '';
          el.textContent = `${prefix}${isFloat ? numeric.toFixed(1) : Math.round(numeric)}`;
        });
        gsap.set(['.pl-heading-el', '.pl-badge-el', '.pl-desc-el'], { opacity: 1 });
        return;
      }

      if (!isDesktop) {
        gsap.fromTo(cards, { opacity: 0, y: 30 }, {
          opacity: 1, y: 0, stagger: 0.08, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: container, start: 'top 70%', toggleActions: 'play none none reset' },
        });
        values.forEach((el) => {
          const numeric = parseFloat(el.dataset.numeric ?? '0');
          const isFloat = (el.dataset.numeric ?? '').includes('.');
          const prefix  = el.dataset.prefix ?? '';
          const obj = { val: 0 };
          gsap.to(obj, {
            val: numeric, duration: 1.8, ease: 'power2.out',
            onUpdate() {
              el.textContent = `${prefix}${isFloat ? obj.val.toFixed(1) : Math.round(obj.val)}`;
            },
            scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none reset' },
          });
        });
        return;
      }

      // ── Desktop cinema ────────────────────────────────────────────────
      gsap.set('.pl-heading-el', { opacity: 0, y: 24 });
      gsap.set('.pl-badge-el',   { opacity: 0 });
      gsap.set('.pl-desc-el',    { opacity: 0, y: 16 });
      gsap.set(cards,            { opacity: 0, y: 30 });
      gsap.set('.pl-camera-el',  { scale: 1, opacity: 1 });

      // Reset counter text
      values.forEach((el) => {
        const prefix = el.dataset.prefix ?? '';
        el.textContent = `${prefix}0`;
      });

      const tl = makePinnedTimeline({
        trigger: container,
        end: PIN_DURATIONS.placements,
        scrub: 1,
        enabled: true,
        unpinned: true,
      });

      tl.to('.pl-badge-el',   { opacity: 1, duration: 0.05, ease: 'power2.out' }, 0)
        .to('.pl-heading-el', { opacity: 1, y: 0, duration: 0.08, ease: 'power3.out' }, 0.02)
        .to('.pl-desc-el',    { opacity: 1, y: 0, duration: 0.06, ease: 'power2.out' }, 0.06)
        .to(cards,
            { opacity: 1, y: 0, stagger: 0.04, duration: 0.10, ease: 'power3.out' }, 0.15);

      // Counters per metric, scroll-bound onUpdate
      const COUNTER_START = 0.20;
      const COUNTER_SPAN = 0.40;
      values.forEach((el, i) => {
        const numeric = parseFloat(el.dataset.numeric ?? '0');
        const isFloat = (el.dataset.numeric ?? '').includes('.');
        const prefix  = el.dataset.prefix ?? '';
        const obj = { val: 0 };
        const startAt = COUNTER_START + (COUNTER_SPAN * (i / Math.max(values.length, 1)));
        tl.to(obj, {
          val: numeric, duration: 0.20, ease: 'power2.out',
          onUpdate() {
            el.textContent = `${prefix}${isFloat ? obj.val.toFixed(1) : Math.round(obj.val)}`;
          },
        }, startAt);
      });

      // Pin exit
      tl.to('.pl-camera-el', { scale: 0.98, duration: 0.10, ease: 'power2.inOut' }, 0.90);
    },
    { scope: sectionRef, dependencies: [reducedMotion, isDesktop, isTablet, isPhone] },
  );

  return (
    <SectionWrapper ref={sectionRef} id="placements" act={5}>
      <div
        className="pl-camera-el"
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: 'center center',
          willChange: 'transform, opacity',
        }}
      >
        <div
          style={{
            position: 'relative', zIndex: 3,
            paddingTop: 'clamp(5rem, 9vh, 6rem)',
            paddingBottom: 'clamp(2rem, 4vh, 3rem)',
            paddingInline: 'var(--section-padding)',
          }}
        >
          {/* Header */}
          <div className="section-container" style={{ textAlign: 'center', marginBottom: 'clamp(1.5rem, 3vh, 2.5rem)' }}>
            <div className="pl-badge-el" style={{ display: 'inline-block' }}>
              <Badge label={placementsContent.badge} />
            </div>
            <h2
              className="pl-heading-el"
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
              {placementsContent.heading}
            </h2>
            <p
              className="pl-desc-el"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-base)',
                color: 'var(--color-text-secondary)',
                maxWidth: '540px',
                margin: '0 auto',
                lineHeight: 1.55,
                willChange: 'opacity',
              }}
            >
              {placementsContent.description}
            </p>
          </div>

          {/* Metrics grid */}
          <div
            className="section-container"
            style={{
              display: 'grid',
              gridTemplateColumns: isTablet ? 'repeat(3, 1fr)' : isPhone ? '1fr' : 'repeat(2, 1fr)',
              gap: '1px',
              background: 'rgba(168,240,255,0.06)',
            }}
          >
            {placementsContent.metrics.map((m) => {
              const isTop = m.id === 'highest';
              const { prefix, unit } = parseMetric(m.value);
              const sizeMap = isPhone ? FONT_SIZE_M : FONT_SIZE_D;
              const fontSize = sizeMap[m.id] ?? '1.75rem';

              return (
                <div
                  key={m.id}
                  className="metric-card-el"
                  style={{
                    padding: '1.5rem 1.25rem',
                    background: isTop ? 'rgba(168,240,255,0.04)' : 'var(--color-void)',
                    textAlign: 'center',
                    position: 'relative',
                    opacity: 0,
                  }}
                >
                  {isTop && (
                    <div
                      aria-hidden="true"
                      style={{
                        position: 'absolute', inset: 0,
                        background: 'radial-gradient(ellipse at center, rgba(168,240,255,0.07) 0%, transparent 70%)',
                        pointerEvents: 'none',
                      }}
                    />
                  )}

                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.25em', marginBottom: '0.5rem', flexWrap: 'nowrap' }}>
                    <span
                      className="metric-value-el"
                      data-numeric={m.numericValue}
                      data-prefix={prefix}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize,
                        fontWeight: 700,
                        fontVariantNumeric: 'tabular-nums',
                        color: isTop ? 'var(--color-beam)' : 'var(--color-text-primary)',
                        lineHeight: 1,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {prefix}0
                    </span>
                    {unit && (
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: `calc(${fontSize} * 0.42)`,
                          fontWeight: 700,
                          color: isTop ? 'var(--color-beam)' : 'var(--color-text-secondary)',
                          letterSpacing: '0.08em',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {unit}
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
                      letterSpacing: '0.15em', color: 'var(--color-text-secondary)',
                      textTransform: 'uppercase', marginBottom: '0.3rem',
                    }}
                  >
                    {m.label}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-body)', fontSize: '0.78rem',
                      color: 'var(--color-text-tertiary)', lineHeight: 1.4,
                    }}
                  >
                    {m.sub}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
