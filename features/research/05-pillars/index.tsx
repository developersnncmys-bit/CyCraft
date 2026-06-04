'use client';
/* Research Pillars — pinned triad. Mirrors AboutValues composition:
 * centered heading + description block, then a row of three cards that
 * each ignite in turn with a card lift + icon scale-in + accent bar
 * draw. No per-tile glow halos or pulse swells — About's restraint sets
 * the tone for the whole publication.
 *
 * 250% pin. Internal beats:
 *   0.00–0.10  Badge enters
 *   0.05–0.18  Heading reveals + description fades up
 *   0.25–0.40  Pillar 1 (red-team) — card lift + icon scale + bar draws
 *   0.40–0.55  Pillar 2 (beam)
 *   0.55–0.70  Pillar 3 (red-team) — full triad lit
 *   0.85–1.00  Camera dollies in 4%
 */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { Badge } from '@/components/ui/Badge';
import {
  researchPillarsContent,
  type ResearchPillar,
} from '@/content/research/pillars';

const toneAccent: Record<ResearchPillar['tone'], string> = {
  beam: 'var(--color-beam)',
  'red-team': 'var(--color-red-team)',
  terminal: 'var(--color-terminal)',
};

function PillarIcon({ kind }: { kind: ResearchPillar['icon'] }) {
  if (kind === 'lab') {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 2v6L4 18a2 2 0 0 0 1.8 3h12.4A2 2 0 0 0 20 18L15 8V2" />
        <path d="M8 2h8" />
        <path d="M7 14h10" />
      </svg>
    );
  }
  if (kind === 'badge') {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="9" r="6" />
        <path d="m8.21 13.89-1.21 7.11 5-3 5 3-1.21-7.11" />
      </svg>
    );
  }
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="6" cy="6" r="3" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="12" cy="18" r="3" />
      <path d="M9 8l3 7" />
      <path d="M15 8l-3 7" />
    </svg>
  );
}

export default function ResearchPillars() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const cards = root.querySelectorAll<HTMLElement>('.research-pillar-card');

      if (reducedMotion) {
        gsap.set(
          [
            '.research-pillars-badge',
            '.research-pillars-heading',
            '.research-pillars-desc',
            '.research-pillar-card',
            '.research-pillar-icon',
            '.research-pillar-bar',
          ],
          { opacity: 1, y: 0, scale: 1, rotate: 0, scaleX: 1 },
        );
        return;
      }

      if (!isDesktop) {
        gsap.fromTo(
          '.research-pillars-badge, .research-pillars-heading, .research-pillars-desc',
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: root,
              start: 'top 78%',
              toggleActions: 'play none none reset',
            } as ScrollTrigger.Vars,
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
      gsap.set(['.research-pillars-badge', '.research-pillars-desc'], { opacity: 0, y: 20 });
      gsap.set('.research-pillars-heading', { opacity: 0, yPercent: 30 });
      gsap.set('.research-pillars-camera', { scale: 1, transformOrigin: 'center center' });

      cards.forEach((c) => {
        const icon = c.querySelector<HTMLElement>('.research-pillar-icon');
        const bar = c.querySelector<HTMLElement>('.research-pillar-bar');
        gsap.set(c, { opacity: 0, y: 36, scale: 0.92 });
        if (icon) gsap.set(icon, { scale: 0.7, rotate: -8 });
        if (bar) gsap.set(bar, { scaleX: 0, transformOrigin: 'left center' });
      });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_DURATIONS.researchPillars,
        scrub: 1,
        enabled: true,
      });

      tl.to('.research-pillars-badge', { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0.02);
      tl.to('.research-pillars-heading', { opacity: 1, yPercent: 0, duration: 0.12, ease: 'power3.out' }, 0.05);
      tl.to('.research-pillars-desc', { opacity: 1, y: 0, duration: 0.10, ease: 'power2.out' }, 0.15);

      const PILLAR_STARTS = [0.25, 0.40, 0.55];
      const IGNITE_DUR = 0.13;

      cards.forEach((c, i) => {
        const start = PILLAR_STARTS[i] ?? PILLAR_STARTS[PILLAR_STARTS.length - 1];
        const icon = c.querySelector<HTMLElement>('.research-pillar-icon');
        const bar = c.querySelector<HTMLElement>('.research-pillar-bar');

        tl.to(c, { opacity: 1, y: 0, scale: 1, duration: IGNITE_DUR, ease: 'power3.out' }, start);
        if (icon) {
          tl.to(icon, { scale: 1, rotate: 0, duration: IGNITE_DUR, ease: 'back.out(2)' }, start + 0.02);
        }
        if (bar) {
          tl.to(bar, { scaleX: 1, duration: IGNITE_DUR * 0.7, ease: 'power2.out' }, start + IGNITE_DUR * 0.4);
        }
      });

      tl.to(
        '.research-pillars-camera',
        { scale: 1.04, duration: 0.15, ease: 'power2.inOut' },
        0.85,
      );
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="research-pillars"
      aria-label={researchPillarsContent.heading}
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <style>{`
        .research-pillars-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1.5rem;
        }
        @media (max-width: 1023px) {
          .research-pillars-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 639px) {
          .research-pillars-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div
        className="research-pillars-camera"
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
          <div className="research-pillars-badge" style={{ display: 'inline-block' }}>
            <Badge label={researchPillarsContent.badge} />
          </div>
          <h2
            className="research-pillars-heading"
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
            {researchPillarsContent.heading}
          </h2>
          <p
            className="research-pillars-desc"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '620px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            {researchPillarsContent.description}
          </p>
        </div>

        <div className="section-container research-pillars-grid">
          {researchPillarsContent.pillars.map((p) => {
            const accent = toneAccent[p.tone];
            return (
              <article
                key={p.id}
                className="research-pillar-card"
                style={{
                  position: 'relative',
                  padding: '2rem 1.75rem',
                  background: 'rgba(13,16,20,0.4)',
                  border: `1px solid ${
                    p.tone === 'beam' ? 'rgba(168,240,255,0.1)' : 'rgba(255,61,90,0.1)'
                  }`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  willChange: 'transform, opacity',
                  transition: 'border-color 0.3s, box-shadow 0.3s',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor =
                    p.tone === 'beam' ? 'rgba(168,240,255,0.35)' : 'rgba(255,61,90,0.35)';
                  el.style.boxShadow = '0 12px 32px rgba(0,0,0,0.5), 0 0 24px rgba(168,240,255,0.08)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor =
                    p.tone === 'beam' ? 'rgba(168,240,255,0.1)' : 'rgba(255,61,90,0.1)';
                  el.style.boxShadow = 'none';
                }}
              >
                <div
                  aria-hidden="true"
                  className="research-pillar-icon"
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '10px',
                    background:
                      p.tone === 'beam'
                        ? 'rgba(168,240,255,0.08)'
                        : 'rgba(255,61,90,0.08)',
                    border: `1px solid ${
                      p.tone === 'beam' ? 'rgba(168,240,255,0.25)' : 'rgba(255,61,90,0.25)'
                    }`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: accent,
                    willChange: 'transform',
                  }}
                >
                  <PillarIcon kind={p.icon} />
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    letterSpacing: '-0.01em',
                    color: 'var(--color-text-primary)',
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  {p.title}
                </h3>

                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-base)',
                    color: 'var(--color-text-secondary)',
                    margin: 0,
                    lineHeight: 1.6,
                    flex: 1,
                  }}
                >
                  {p.description}
                </p>

                <div
                  aria-hidden="true"
                  className="research-pillar-bar"
                  style={{
                    width: '36px',
                    height: '2px',
                    background: accent,
                    boxShadow: `0 0 10px ${accent}`,
                    transformOrigin: 'left center',
                    willChange: 'transform',
                  }}
                />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
