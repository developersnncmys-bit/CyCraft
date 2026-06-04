'use client';
/* Research Publications — pinned cards scene. Mirrors AboutValues:
 * centered heading + description block, then a row of three paper cards
 * that each ignite in turn with a card lift + icon scale-in. Citations
 * render as static text — no count-up — so the page reads like an About
 * stat tile, not a dashboard.
 *
 * 300% pin. Internal beats:
 *   0.00–0.10  Badge enters
 *   0.05–0.18  Heading reveals + description fades up
 *   0.25–0.40  Paper 1 ignites (card lift + icon scale-in from -8°)
 *   0.40–0.55  Paper 2 ignites
 *   0.55–0.70  Paper 3 ignites — full triad lit
 *   0.85–1.00  Camera dollies in 4%
 */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { Badge } from '@/components/ui/Badge';
import { researchPublicationsContent } from '@/content/research/publications';

const formatDate = (iso: string) => {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  } catch {
    return iso;
  }
};

function PaperIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="13" y2="17" />
    </svg>
  );
}

export default function ResearchPublications() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const cards = root.querySelectorAll<HTMLElement>('.research-pub-card');

      if (reducedMotion) {
        gsap.set(
          [
            '.research-pub-badge',
            '.research-pub-heading',
            '.research-pub-desc',
            '.research-pub-card',
            '.research-pub-card-icon',
          ],
          { opacity: 1, y: 0, scale: 1, rotate: 0 },
        );
        return;
      }

      if (!isDesktop) {
        gsap.fromTo(
          '.research-pub-badge, .research-pub-heading, .research-pub-desc',
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
      gsap.set(['.research-pub-badge', '.research-pub-desc'], { opacity: 0, y: 20 });
      gsap.set('.research-pub-heading', { opacity: 0, yPercent: 30 });
      gsap.set('.research-pub-camera', { scale: 1, transformOrigin: 'center center' });

      cards.forEach((c) => {
        const icon = c.querySelector<HTMLElement>('.research-pub-card-icon');
        gsap.set(c, { opacity: 0, y: 36, scale: 0.92 });
        if (icon) gsap.set(icon, { scale: 0.7, rotate: -8 });
      });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_DURATIONS.researchPublications,
        scrub: 1,
        enabled: true,
      });

      tl.to('.research-pub-badge', { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0.02);
      tl.to('.research-pub-heading', { opacity: 1, yPercent: 0, duration: 0.12, ease: 'power3.out' }, 0.05);
      tl.to('.research-pub-desc', { opacity: 1, y: 0, duration: 0.10, ease: 'power2.out' }, 0.15);

      const CARD_STARTS = [0.25, 0.40, 0.55];
      const IGNITE_DUR = 0.13;

      cards.forEach((c, i) => {
        const start = CARD_STARTS[i] ?? CARD_STARTS[CARD_STARTS.length - 1];
        const icon = c.querySelector<HTMLElement>('.research-pub-card-icon');

        tl.to(c, { opacity: 1, y: 0, scale: 1, duration: IGNITE_DUR, ease: 'power3.out' }, start);
        if (icon) {
          tl.to(icon, { scale: 1, rotate: 0, duration: IGNITE_DUR, ease: 'back.out(2)' }, start + 0.02);
        }
      });

      tl.to(
        '.research-pub-camera',
        { scale: 1.04, duration: 0.15, ease: 'power2.inOut' },
        0.85,
      );
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="publications"
      aria-label={researchPublicationsContent.heading}
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <style>{`
        .research-pub-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1.5rem;
        }
        @media (max-width: 1023px) {
          .research-pub-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 639px) {
          .research-pub-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div
        className="research-pub-camera"
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
          <div className="research-pub-badge" style={{ display: 'inline-block' }}>
            <Badge label={researchPublicationsContent.badge} />
          </div>
          <h2
            className="research-pub-heading"
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
            {researchPublicationsContent.heading}
          </h2>
          <p
            className="research-pub-desc"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '620px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            {researchPublicationsContent.description}
          </p>
        </div>

        <div className="section-container research-pub-grid">
          {researchPublicationsContent.publications.map((pub) => (
            <a
              key={pub.id}
              href={pub.href}
              className="research-pub-card"
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                padding: '2rem 1.75rem',
                background: 'rgba(13,16,20,0.4)',
                border: '1px solid rgba(168,240,255,0.1)',
                textDecoration: 'none',
                color: 'inherit',
                willChange: 'transform, opacity',
                transition: 'border-color 0.3s, box-shadow 0.3s',
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
              <span
                className="research-pub-card-icon"
                aria-hidden="true"
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '10px',
                  background: 'rgba(168,240,255,0.08)',
                  border: '1px solid rgba(168,240,255,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-beam)',
                  willChange: 'transform',
                }}
              >
                <PaperIcon />
              </span>

              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  margin: 0,
                  lineHeight: 1.3,
                  letterSpacing: '-0.01em',
                }}
              >
                {pub.title}
              </h3>

              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  letterSpacing: '0.05em',
                  color: 'var(--color-beam)',
                  lineHeight: 1.5,
                }}
              >
                {pub.venue}
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-secondary)',
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {pub.authors}
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.16em',
                  color: 'var(--color-text-tertiary)',
                  textTransform: 'uppercase',
                }}
              >
                {formatDate(pub.date)}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 'auto',
                  paddingTop: '1rem',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-tertiary)',
                }}
              >
                <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                  {pub.citations} Citations
                </span>
                <span aria-hidden="true" style={{ color: 'var(--color-beam)' }}>
                  →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
