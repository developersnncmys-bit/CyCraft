'use client';
/* Home Stats — pinned dramatic counter scene
 *
 * Pinned for 300% scroll. Mirrors the B.Tech achievements pattern.
 *
 * Internal beats (progress space 0–1):
 *   0.00–0.10  Badge enters
 *   0.10–0.25  Heading + description reveal
 *   0.25–0.40  Stat 1 ignites (fade + counter 0→target + underline)
 *   0.40–0.55  Stat 2 ignites
 *   0.55–0.70  Stat 3 ignites
 *   0.70–0.85  Stat 4 ignites — all four glowing
 *   0.85–1.00  Camera zoom-out 5% + beam pulses brighter
 */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { Badge } from '@/components/ui/Badge';
import { homeStatsContent } from '@/content/home/stats';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';

export default function HomeStats() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();
  const isMobileGrid = !useMediaQuery('(min-width: 768px)');

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const waypoints = root.querySelectorAll<HTMLElement>('.home-stat-waypoint');

      // ── Reduced motion: instant composed state ──────────────────────────
      if (reducedMotion) {
        waypoints.forEach((wp) => {
          const target = Number(wp.dataset.target ?? 0);
          const valueEl = wp.querySelector<HTMLElement>('.home-stat-value');
          const underEl = wp.querySelector<HTMLElement>('.home-stat-underline');
          if (valueEl) valueEl.textContent = target.toLocaleString();
          gsap.set(wp, { opacity: 1, y: 0 });
          if (underEl) gsap.set(underEl, { scaleX: 1 });
        });
        gsap.set(['.home-stats-badge', '.home-stats-heading', '.home-stats-desc'], { opacity: 1 });
        return;
      }

      // ── Mobile path: entry-on-view per-stat ─────────────────────────────
      if (!isDesktop) {
        waypoints.forEach((wp) => {
          const target = Number(wp.dataset.target ?? 0);
          const valueEl = wp.querySelector<HTMLElement>('.home-stat-value');
          const underEl = wp.querySelector<HTMLElement>('.home-stat-underline');

          gsap.fromTo(
            wp,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: wp,
                start: 'top 80%',
                toggleActions: 'play none none reset',
              } as ScrollTrigger.Vars,
            },
          );

          if (valueEl) {
            const obj = { val: 0 };
            gsap.to(obj, {
              val: target,
              duration: 1.4,
              ease: 'power2.out',
              onUpdate() {
                valueEl.textContent = Math.round(obj.val).toLocaleString();
              },
              scrollTrigger: {
                trigger: wp,
                start: 'top 75%',
                toggleActions: 'play none none reset',
              } as ScrollTrigger.Vars,
            });
          }

          if (underEl) {
            gsap.to(underEl, {
              scaleX: 1,
              duration: 0.5,
              ease: 'power2.out',
              delay: 0.3,
              scrollTrigger: {
                trigger: wp,
                start: 'top 75%',
                toggleActions: 'play none none reset',
              } as ScrollTrigger.Vars,
            });
          }
        });
        return;
      }

      // ── Desktop cinematic path: pinned scrub timeline ──────────────────
      // Initial state: everything hidden
      gsap.set(['.home-stats-badge', '.home-stats-desc'], { opacity: 0 });
      gsap.set('.home-stats-heading', { opacity: 0, yPercent: 30 });
      gsap.set('.home-stats-camera', { scale: 1, transformOrigin: 'center center' });
      waypoints.forEach((wp) => {
        const valueEl = wp.querySelector<HTMLElement>('.home-stat-value');
        const underEl = wp.querySelector<HTMLElement>('.home-stat-underline');
        gsap.set(wp, { opacity: 0, y: 30 });
        if (underEl) gsap.set(underEl, { scaleX: 0, transformOrigin: 'left' });
        if (valueEl) valueEl.textContent = '0';
      });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_DURATIONS.homeStats,
        scrub: 1,
        enabled: true,
      });

      // 0.00–0.10 Badge enters
      tl.to('.home-stats-badge', { opacity: 1, duration: 0.08, ease: 'power2.out' }, 0.02);

      // 0.10–0.25 Heading + description
      tl.to(
        '.home-stats-heading',
        { opacity: 1, yPercent: 0, duration: 0.15, ease: 'power3.out' },
        0.10,
      ).to(
        '.home-stats-desc',
        { opacity: 1, duration: 0.10, ease: 'power2.out' },
        0.16,
      );

      // Stat ignition windows: 0.25, 0.40, 0.55, 0.70
      const STAT_STARTS = [0.25, 0.40, 0.55, 0.70];
      const IGNITE_DUR = 0.12;

      waypoints.forEach((wp, i) => {
        const start = STAT_STARTS[i] ?? STAT_STARTS[STAT_STARTS.length - 1];
        const target = Number(wp.dataset.target ?? 0);
        const valueEl = wp.querySelector<HTMLElement>('.home-stat-value');
        const underEl = wp.querySelector<HTMLElement>('.home-stat-underline');

        // Fade + lift
        tl.to(
          wp,
          { opacity: 1, y: 0, duration: IGNITE_DUR, ease: 'power2.out' },
          start,
        );

        // Scrubbed counter
        if (valueEl) {
          const obj = { val: 0 };
          tl.to(
            obj,
            {
              val: target,
              duration: IGNITE_DUR,
              ease: 'power2.out',
              onUpdate() {
                valueEl.textContent = Math.round(obj.val).toLocaleString();
              },
            },
            start,
          );
        }

        // Underline draws in slightly trailing
        if (underEl) {
          tl.to(
            underEl,
            { scaleX: 1, duration: IGNITE_DUR * 0.6, ease: 'power2.out' },
            start + IGNITE_DUR * 0.4,
          );
        }
      });

      // 0.85–1.00 Camera zoom-out
      tl.to(
        '.home-stats-camera',
        { scale: 0.95, duration: 0.15, ease: 'power2.inOut' },
        0.85,
      );
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="stats"
      aria-label="Stats — trusted by a growing cybersecurity community"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <div
        className="home-stats-camera"
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
          <div className="home-stats-badge" style={{ display: 'inline-block' }}>
            <Badge label={homeStatsContent.badge} />
          </div>
          <h2
            className="home-stats-heading"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-display-md)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              color: 'var(--color-text-primary)',
              margin: '1.5rem 0 1rem',
              lineHeight: 1.1,
              willChange: 'transform, opacity',
            }}
          >
            {homeStatsContent.heading}
          </h2>
          <p
            className="home-stats-desc"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '560px',
              margin: '0 auto',
              willChange: 'opacity',
            }}
          >
            {homeStatsContent.description}
          </p>
        </div>

        <div
          className="section-container"
          style={{
            display: 'grid',
            gridTemplateColumns: isMobileGrid ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: '1px',
            background: 'rgba(168,240,255,0.08)',
            border: '1px solid rgba(168,240,255,0.1)',
          }}
        >
          {homeStatsContent.stats.map((s) => (
            <div
              key={s.id}
              className="home-stat-waypoint"
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
                  gap: '0.1rem',
                }}
              >
                <span className="home-stat-value">0</span>
                <span>{s.suffix}</span>
              </div>

              {/* Underline */}
              <div
                aria-hidden="true"
                className="home-stat-underline"
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
