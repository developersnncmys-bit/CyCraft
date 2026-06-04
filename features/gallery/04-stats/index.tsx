'use client';
/* Gallery Stats — pinned cinematic counter scene.
 *
 * Mirrors ResearchStats / AboutStats composition: heading + description,
 * then a 4-cell counter strip that scrubs each value up from 0 → target.
 *
 * 250% pin. Beats (0–1):
 *   0.00–0.05  Badge enters
 *   0.05–0.18  Heading + description reveal
 *   0.25–0.40  Stat 1 ignites (counter + underline)
 *   0.40–0.55  Stat 2
 *   0.55–0.70  Stat 3
 *   0.70–0.85  Stat 4 — full strip lit
 *   0.85–1.00  Camera dollies in 4%
 */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { Badge } from '@/components/ui/Badge';
import { galleryStatsContent } from '@/content/gallery/stats';

export default function GalleryStats() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const waypoints = root.querySelectorAll<HTMLElement>('.gallery-stat-waypoint');

      if (reducedMotion) {
        waypoints.forEach((wp) => {
          const target = Number(wp.dataset.target ?? 0);
          const valueEl = wp.querySelector<HTMLElement>('.gallery-stat-value');
          const underEl = wp.querySelector<HTMLElement>('.gallery-stat-underline');
          if (valueEl) valueEl.textContent = target.toLocaleString();
          gsap.set(wp, { opacity: 1, y: 0 });
          if (underEl) gsap.set(underEl, { scaleX: 1 });
        });
        gsap.set(
          ['.gallery-stats-badge', '.gallery-stats-heading', '.gallery-stats-desc'],
          { opacity: 1, y: 0 },
        );
        return;
      }

      if (!isDesktop) {
        const headerTrigger = {
          trigger: root,
          start: 'top 80%',
          toggleActions: 'play none none reset',
        } as ScrollTrigger.Vars;
        gsap.fromTo(
          '.gallery-stats-badge, .gallery-stats-heading, .gallery-stats-desc',
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: headerTrigger,
          },
        );

        waypoints.forEach((wp) => {
          const target = Number(wp.dataset.target ?? 0);
          const valueEl = wp.querySelector<HTMLElement>('.gallery-stat-value');
          const underEl = wp.querySelector<HTMLElement>('.gallery-stat-underline');

          gsap.fromTo(
            wp,
            { opacity: 0, y: 28 },
            {
              opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
              scrollTrigger: { trigger: wp, start: 'top 82%', toggleActions: 'play none none reset' } as ScrollTrigger.Vars,
            },
          );
          if (valueEl) {
            const obj = { val: 0 };
            gsap.to(obj, {
              val: target, duration: 1.4, ease: 'power2.out',
              onUpdate() { valueEl.textContent = Math.round(obj.val).toLocaleString(); },
              scrollTrigger: { trigger: wp, start: 'top 78%', toggleActions: 'play none none reset' } as ScrollTrigger.Vars,
            });
          }
          if (underEl) {
            gsap.fromTo(
              underEl,
              { scaleX: 0 },
              {
                scaleX: 1, duration: 0.55, ease: 'power2.out', delay: 0.3,
                scrollTrigger: { trigger: wp, start: 'top 78%', toggleActions: 'play none none reset' } as ScrollTrigger.Vars,
              },
            );
          }
        });
        return;
      }

      gsap.set(['.gallery-stats-badge', '.gallery-stats-desc'], { opacity: 0, y: 20 });
      gsap.set('.gallery-stats-heading', { opacity: 0, yPercent: 30 });
      gsap.set('.gallery-stats-camera', { scale: 1, transformOrigin: 'center center' });
      waypoints.forEach((wp) => {
        const valueEl = wp.querySelector<HTMLElement>('.gallery-stat-value');
        const underEl = wp.querySelector<HTMLElement>('.gallery-stat-underline');
        gsap.set(wp, { opacity: 0, y: 30 });
        if (underEl) gsap.set(underEl, { scaleX: 0, transformOrigin: 'left' });
        if (valueEl) valueEl.textContent = '0';
      });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_DURATIONS.galleryStats,
        scrub: 1,
        enabled: true,
      });

      tl.to('.gallery-stats-badge', { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0.02);
      tl.to('.gallery-stats-heading', { opacity: 1, yPercent: 0, duration: 0.15, ease: 'power3.out' }, 0.05);
      tl.to('.gallery-stats-desc', { opacity: 1, y: 0, duration: 0.10, ease: 'power2.out' }, 0.13);

      const STAT_STARTS = [0.25, 0.40, 0.55, 0.70];
      const IGNITE_DUR = 0.12;

      waypoints.forEach((wp, i) => {
        const start = STAT_STARTS[i] ?? STAT_STARTS[STAT_STARTS.length - 1];
        const target = Number(wp.dataset.target ?? 0);
        const valueEl = wp.querySelector<HTMLElement>('.gallery-stat-value');
        const underEl = wp.querySelector<HTMLElement>('.gallery-stat-underline');

        tl.to(wp, { opacity: 1, y: 0, duration: IGNITE_DUR, ease: 'power2.out' }, start);
        if (valueEl) {
          const obj = { val: 0 };
          tl.to(
            obj,
            {
              val: target,
              duration: IGNITE_DUR,
              ease: 'power2.out',
              onUpdate() { valueEl.textContent = Math.round(obj.val).toLocaleString(); },
            },
            start,
          );
        }
        if (underEl) {
          tl.to(
            underEl,
            { scaleX: 1, duration: IGNITE_DUR * 0.6, ease: 'power2.out' },
            start + IGNITE_DUR * 0.4,
          );
        }
      });

      tl.to(
        '.gallery-stats-camera',
        { scale: 0.95, duration: 0.15, ease: 'power2.inOut' },
        0.85,
      );
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="gallery-stats"
      aria-label={galleryStatsContent.heading}
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <style>{`
        .gallery-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1px;
          background: rgba(168,240,255,0.08);
          border: 1px solid rgba(168,240,255,0.1);
        }
        @media (max-width: 767px) {
          .gallery-stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
      `}</style>

      <div
        className="gallery-stats-camera"
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
          <div className="gallery-stats-badge" style={{ display: 'inline-block' }}>
            <Badge label={galleryStatsContent.badge} />
          </div>
          <h2
            className="gallery-stats-heading"
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
            {galleryStatsContent.heading}
          </h2>
          <p
            className="gallery-stats-desc"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '620px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            {galleryStatsContent.description}
          </p>
        </div>

        <div className="section-container gallery-stats-grid">
          {galleryStatsContent.stats.map((s) => (
            <div
              key={s.id}
              className="gallery-stat-waypoint"
              data-target={s.value}
              style={{
                padding: 'clamp(1.75rem, 4vw, 2.75rem) 1.25rem',
                background: 'var(--color-void)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
                willChange: 'transform, opacity',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.25rem, 5.5vw, 3.5rem)',
                  fontWeight: 700,
                  color: 'var(--color-beam)',
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                  textShadow: '0 0 22px rgba(168,240,255,0.3)',
                  display: 'inline-flex',
                  justifyContent: 'center',
                  alignItems: 'baseline',
                  gap: '0.05rem',
                  fontVariantNumeric: 'tabular-nums',
                  fontFeatureSettings: '"tnum"',
                }}
              >
                <span className="gallery-stat-value">0</span>
                <span>{s.suffix}</span>
              </div>

              <div
                aria-hidden="true"
                className="gallery-stat-underline"
                style={{
                  width: '36px',
                  height: '1px',
                  background: 'var(--color-beam)',
                  boxShadow: '0 0 8px var(--color-beam-glow)',
                  margin: '0 auto',
                  transformOrigin: 'left center',
                  willChange: 'transform',
                }}
              />

              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.18em',
                  color: 'var(--color-text-tertiary)',
                  textTransform: 'uppercase',
                  marginTop: '0.4rem',
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
