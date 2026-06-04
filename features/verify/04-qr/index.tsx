'use client';
/* Verify QR — pinned cinematic explainer for the QR-based flow.
 *
 * Two-column layout on desktop: a visual QR mockup on the left, copy +
 * three feature bullets on the right. The QR mockup is a pure CSS/SVG
 * placeholder — no live encoder dependency — since the QR's job here is
 * to communicate the concept, not to be scanned.
 *
 * 200% pin. Beats (0–1):
 *   0.00–0.10  Badge enters, copy column slides in from the left
 *   0.10–0.25  Heading + description reveal
 *   0.25–0.40  QR mockup slides in from the right and ignites
 *   0.40–0.65  Three feature bullets stagger in
 *   0.65–0.85  Sample URL ticker reveals
 *   0.85–1.00  Camera dollies in 4%
 */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { Badge } from '@/components/ui/Badge';
import { verifyQrContent } from '@/content/verify/qr';

/**
 * A deterministic, decorative QR pattern. Each cell is a 1px-pixel-style
 * square on an 11×11 grid with the standard QR alignment squares in three
 * corners. Not a real QR — purely illustrative.
 */
const QR_GRID: readonly (readonly number[])[] = [
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0],
  [1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1],
  [0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0],
  [1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0],
  [0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0],
  [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0],
];

function QrMockup() {
  return (
    <div
      className="verify-qr-mockup"
      aria-hidden="true"
      style={{
        position: 'relative',
        width: 'min(320px, 80%)',
        aspectRatio: '1 / 1',
        padding: '1.25rem',
        background: 'rgba(13,16,20,0.55)',
        border: '1px solid rgba(168,240,255,0.22)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 32px rgba(77,217,255,0.12)',
        willChange: 'transform, opacity',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'grid',
          gridTemplateColumns: `repeat(${QR_GRID[0].length}, 1fr)`,
          gridTemplateRows: `repeat(${QR_GRID.length}, 1fr)`,
          gap: '2px',
          background: 'rgba(168,240,255,0.04)',
          padding: '6%',
        }}
      >
        {QR_GRID.flatMap((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              style={{
                background: cell
                  ? 'var(--color-beam)'
                  : 'rgba(168,240,255,0.04)',
                boxShadow: cell ? '0 0 4px rgba(77,217,255,0.6)' : 'none',
              }}
            />
          )),
        )}
      </div>
      {/* Centre logo plate */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '22%',
          aspectRatio: '1 / 1',
          background: 'var(--color-void)',
          border: '1px solid var(--color-beam)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.85rem',
          fontWeight: 700,
          letterSpacing: '0.05em',
          color: 'var(--color-beam)',
        }}
      >
        CY
      </div>
    </div>
  );
}

export default function VerifyQr() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();
  const isWideLayout = useMediaQuery('(min-width: 900px)');

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const features = root.querySelectorAll<HTMLElement>('.verify-qr-feature');

      if (reducedMotion) {
        gsap.set(
          [
            '.verify-qr-badge',
            '.verify-qr-heading',
            '.verify-qr-desc',
            '.verify-qr-mockup',
            '.verify-qr-feature',
            '.verify-qr-url',
          ],
          { opacity: 1, x: 0, y: 0, scale: 1 },
        );
        return;
      }

      if (!isDesktop) {
        gsap.fromTo(
          '.verify-qr-badge, .verify-qr-heading, .verify-qr-desc',
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: root, start: 'top 78%', toggleActions: 'play none none reset' } as ScrollTrigger.Vars,
          },
        );
        gsap.fromTo(
          '.verify-qr-mockup',
          { opacity: 0, scale: 0.94 },
          {
            opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: '.verify-qr-mockup', start: 'top 82%', toggleActions: 'play none none reset' } as ScrollTrigger.Vars,
          },
        );
        gsap.fromTo(
          features,
          { opacity: 0, x: 12 },
          {
            opacity: 1, x: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out',
            scrollTrigger: { trigger: features[0] ?? root, start: 'top 80%', toggleActions: 'play none none reset' } as ScrollTrigger.Vars,
          },
        );
        gsap.fromTo(
          '.verify-qr-url',
          { opacity: 0, y: 8 },
          {
            opacity: 1, y: 0, duration: 0.5, delay: 0.3, ease: 'power2.out',
            scrollTrigger: { trigger: '.verify-qr-url', start: 'top 85%', toggleActions: 'play none none reset' } as ScrollTrigger.Vars,
          },
        );
        return;
      }

      gsap.set('.verify-qr-badge', { opacity: 0, x: -24 });
      gsap.set('.verify-qr-heading', { opacity: 0, x: -28 });
      gsap.set('.verify-qr-desc', { opacity: 0, y: 20 });
      gsap.set('.verify-qr-mockup', { opacity: 0, x: 60, scale: 0.94 });
      gsap.set('.verify-qr-feature', { opacity: 0, x: 24 });
      gsap.set('.verify-qr-url', { opacity: 0, y: 12 });
      gsap.set('.verify-qr-camera', { scale: 1, transformOrigin: 'center center' });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_DURATIONS.verifyQr,
        scrub: 1,
        enabled: true,
      });

      tl.to('.verify-qr-badge', { opacity: 1, x: 0, duration: 0.10, ease: 'power2.out' }, 0.00);
      tl.to('.verify-qr-heading', { opacity: 1, x: 0, duration: 0.12, ease: 'power3.out' }, 0.05);
      tl.to('.verify-qr-desc', { opacity: 1, y: 0, duration: 0.12, ease: 'power2.out' }, 0.15);
      tl.to(
        '.verify-qr-mockup',
        { opacity: 1, x: 0, scale: 1, duration: 0.20, ease: 'power3.out' },
        0.25,
      );
      tl.to(
        '.verify-qr-feature',
        { opacity: 1, x: 0, duration: 0.10, stagger: 0.07, ease: 'power2.out' },
        0.40,
      );
      tl.to('.verify-qr-url', { opacity: 1, y: 0, duration: 0.12, ease: 'power2.out' }, 0.65);
      tl.to(
        '.verify-qr-camera',
        { scale: 1.03, duration: 0.10, ease: 'power2.inOut' },
        0.88,
      );
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="verify-qr"
      aria-label={verifyQrContent.heading}
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <div
        className="verify-qr-camera"
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          paddingInline: 'var(--section-padding)',
          paddingTop: 'clamp(5rem, 10vh, 8rem)',
          paddingBottom: 'clamp(5rem, 10vh, 8rem)',
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        <div
          className="section-container"
          style={{
            display: 'grid',
            gridTemplateColumns: isWideLayout ? '1fr 1fr' : '1fr',
            gap: 'clamp(2.5rem, 5vw, 4rem)',
            alignItems: 'center',
          }}
        >
          {/* Left — QR mockup */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              order: isWideLayout ? 0 : 1,
            }}
          >
            <QrMockup />
          </div>

          {/* Right — copy */}
          <div style={{ order: isWideLayout ? 1 : 0 }}>
            <div className="verify-qr-badge">
              <Badge label={verifyQrContent.badge} />
            </div>
            <h2
              className="verify-qr-heading"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 3.2vw, 2.75rem)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                textTransform: 'uppercase',
                color: 'var(--color-text-primary)',
                margin: '1.25rem 0 1.25rem',
                lineHeight: 1.1,
              }}
            >
              {verifyQrContent.heading}
            </h2>
            <p
              className="verify-qr-desc"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-lg)',
                color: 'var(--color-text-secondary)',
                margin: '0 0 1.75rem',
                lineHeight: 1.6,
                maxWidth: '560px',
              }}
            >
              {verifyQrContent.description}
            </p>

            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: '0 0 1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              {verifyQrContent.features.map((f) => (
                <li
                  key={f.id}
                  className="verify-qr-feature"
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'flex-start',
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      flexShrink: 0,
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      background: 'rgba(168,240,255,0.08)',
                      border: '1px solid rgba(168,240,255,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-beam)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      fontWeight: 700,
                    }}
                  >
                    ✓
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: 'var(--color-text-primary)',
                        margin: 0,
                        letterSpacing: '-0.01em',
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
                </li>
              ))}
            </ul>

            <div
              className="verify-qr-url"
              aria-label="Sample QR target URL"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.65rem 1rem',
                background: 'rgba(13,16,20,0.6)',
                border: '1px solid rgba(168,240,255,0.18)',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'var(--color-terminal)',
                letterSpacing: '0.02em',
              }}
            >
              <span
                aria-hidden="true"
                style={{ color: 'var(--color-beam)' }}
              >
                {'>'}
              </span>
              {verifyQrContent.sampleUrl}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
