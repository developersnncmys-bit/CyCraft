'use client';
/* Verify How It Works — pinned cinematic three-step explainer.
 *
 * Mirrors AboutApproach / ResearchPillars composition: centered heading,
 * three cards in a row, each ignites in turn with a card lift + icon
 * scale-in + accent step number reveal.
 *
 * 250% pin. Beats (0–1):
 *   0.00–0.10  Badge enters
 *   0.05–0.18  Heading reveals + description fades up
 *   0.25–0.40  Step 1 — Enter the ID
 *   0.40–0.55  Step 2 — Lookup Against Registry
 *   0.55–0.70  Step 3 — See the Record
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
  verifyHowItWorksContent,
  type HowItWorksIcon,
} from '@/content/verify/how-it-works';

function StepIcon({ kind }: { kind: HowItWorksIcon }) {
  if (kind === 'id') {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="6" width="18" height="13" rx="2" />
        <circle cx="9" cy="12" r="2" />
        <path d="M14 11h4" />
        <path d="M14 14h4" />
      </svg>
    );
  }
  if (kind === 'check') {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2 4 5v7c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V5l-8-3Z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    );
  }
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="13" y2="17" />
    </svg>
  );
}

export default function VerifyHowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const cards = root.querySelectorAll<HTMLElement>('.verify-step-card');

      if (reducedMotion) {
        gsap.set(
          [
            '.verify-hiw-badge',
            '.verify-hiw-heading',
            '.verify-hiw-desc',
            '.verify-step-card',
            '.verify-step-icon',
            '.verify-step-number',
          ],
          { opacity: 1, y: 0, scale: 1, rotate: 0 },
        );
        return;
      }

      if (!isDesktop) {
        gsap.fromTo(
          '.verify-hiw-badge, .verify-hiw-heading, .verify-hiw-desc',
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: root, start: 'top 78%', toggleActions: 'play none none reset' } as ScrollTrigger.Vars,
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

      gsap.set(['.verify-hiw-badge', '.verify-hiw-desc'], { opacity: 0, y: 20 });
      gsap.set('.verify-hiw-heading', { opacity: 0, yPercent: 30 });
      gsap.set('.verify-hiw-camera', { scale: 1, transformOrigin: 'center center' });

      cards.forEach((c) => {
        const icon = c.querySelector<HTMLElement>('.verify-step-icon');
        const number = c.querySelector<HTMLElement>('.verify-step-number');
        gsap.set(c, { opacity: 0, y: 36, scale: 0.92 });
        if (icon) gsap.set(icon, { scale: 0.7, rotate: -8 });
        if (number) gsap.set(number, { opacity: 0, x: -12 });
      });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_DURATIONS.verifyHowItWorks,
        scrub: 1,
        enabled: true,
      });

      tl.to('.verify-hiw-badge', { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0.02);
      tl.to('.verify-hiw-heading', { opacity: 1, yPercent: 0, duration: 0.12, ease: 'power3.out' }, 0.05);
      tl.to('.verify-hiw-desc', { opacity: 1, y: 0, duration: 0.10, ease: 'power2.out' }, 0.15);

      const STARTS = [0.25, 0.40, 0.55];
      const DUR = 0.13;

      cards.forEach((c, i) => {
        const start = STARTS[i] ?? STARTS[STARTS.length - 1];
        const icon = c.querySelector<HTMLElement>('.verify-step-icon');
        const number = c.querySelector<HTMLElement>('.verify-step-number');

        tl.to(c, { opacity: 1, y: 0, scale: 1, duration: DUR, ease: 'power3.out' }, start);
        if (icon) {
          tl.to(icon, { scale: 1, rotate: 0, duration: DUR, ease: 'back.out(2)' }, start + 0.02);
        }
        if (number) {
          tl.to(number, { opacity: 1, x: 0, duration: DUR * 0.7, ease: 'power2.out' }, start + 0.04);
        }
      });

      tl.to(
        '.verify-hiw-camera',
        { scale: 1.03, duration: 0.10, ease: 'power2.inOut' },
        0.88,
      );
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="verify-how-it-works"
      aria-label={verifyHowItWorksContent.heading}
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <style>{`
        .verify-step-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1.5rem;
        }
        @media (max-width: 1023px) {
          .verify-step-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 639px) {
          .verify-step-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div
        className="verify-hiw-camera"
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
          <div className="verify-hiw-badge" style={{ display: 'inline-block' }}>
            <Badge label={verifyHowItWorksContent.badge} />
          </div>
          <h2
            className="verify-hiw-heading"
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
            {verifyHowItWorksContent.heading}
          </h2>
          <p
            className="verify-hiw-desc"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '620px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            {verifyHowItWorksContent.description}
          </p>
        </div>

        <div className="section-container verify-step-grid">
          {verifyHowItWorksContent.steps.map((s) => (
            <article
              key={s.id}
              className="verify-step-card"
              style={{
                position: 'relative',
                padding: '2rem 1.75rem',
                background: 'rgba(13,16,20,0.4)',
                border: '1px solid rgba(168,240,255,0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <span
                  className="verify-step-icon"
                  aria-hidden="true"
                  style={{
                    width: '54px',
                    height: '54px',
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
                  <StepIcon kind={s.icon} />
                </span>
                <span
                  className="verify-step-number"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    letterSpacing: '0.22em',
                    color: 'var(--color-text-tertiary)',
                    textTransform: 'uppercase',
                  }}
                >
                  Step {s.step}
                </span>
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
                {s.title}
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
                {s.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
