'use client';
/* About Preview — pinned cinematic scene (per PRD §3.1)
 *
 * Pinned for 200% scroll. Internal beats (0–1):
 *   0.00–0.05  Badge enters
 *   0.05–0.20  Heading words reveal
 *   0.20–0.35  Mission snippet reveals (italic tagline)
 *   0.30–0.95  Hex visual rotates from -10° → 0° + scales 0.85 → 1.05
 *              (continuous through the pin — drives the right column)
 *   0.35–0.55  Description words reveal
 *   0.60–0.70  CTA enters
 *   0.85–1.00  Camera scales 1 → 0.96 (foreshadows next section)
 *
 * Maps PRD requirements:
 *   • Short CyCraft introduction → description
 *   • Vision/mission snippet     → mission line
 *   • Link to About page         → CTA
 */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { aboutPreviewContent } from '@/content/home/about-preview';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { WordSplit } from '@/features/home/_shared/wordSplit';

export default function HomeAboutPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();
  const isTablet = useMediaQuery('(min-width: 768px)');

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      // Reduced motion: instant
      if (reducedMotion) {
        gsap.set(
          [
            '.about-preview-badge',
            '.about-preview-heading [data-word]',
            '.about-preview-mission [data-word]',
            '.about-preview-desc [data-word]',
            '.about-preview-cta',
            '.about-preview-visual',
          ],
          { opacity: 1, y: 0, scale: 1, rotation: 0, filter: 'none' },
        );
        return;
      }

      // Mobile fallback: simple scroll-trigger entry
      if (!isDesktop) {
        const trigger = {
          trigger: root,
          start: 'top 75%',
          toggleActions: 'play none none reset',
        };
        gsap.fromTo('.about-preview-badge', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, scrollTrigger: trigger });
        gsap.fromTo(
          '.about-preview-heading [data-word]',
          { opacity: 0, yPercent: 60, filter: 'blur(8px)' },
          { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.04, delay: 0.2, scrollTrigger: trigger },
        );
        gsap.fromTo(
          '.about-preview-mission [data-word]',
          { opacity: 0, y: 6, filter: 'blur(4px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, stagger: 0.02, delay: 0.5, scrollTrigger: trigger },
        );
        gsap.fromTo(
          '.about-preview-desc [data-word]',
          { opacity: 0, y: 8, filter: 'blur(4px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, stagger: 0.02, delay: 0.8, scrollTrigger: trigger },
        );
        gsap.fromTo('.about-preview-cta', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, delay: 1.1, scrollTrigger: trigger });
        return;
      }

      // Desktop cinematic: pinned scrub timeline
      gsap.set(['.about-preview-badge', '.about-preview-cta'], { opacity: 0, y: 18 });
      gsap.set('.about-preview-heading [data-word]', { opacity: 0, yPercent: 60, filter: 'blur(10px)' });
      gsap.set('.about-preview-mission [data-word]', { opacity: 0, y: 6, filter: 'blur(4px)' });
      gsap.set('.about-preview-desc [data-word]', { opacity: 0, y: 8, filter: 'blur(4px)' });
      gsap.set('.about-preview-visual', { opacity: 0, scale: 0.85, rotation: -10 });
      gsap.set('.about-preview-camera', { scale: 1, transformOrigin: 'center center' });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_DURATIONS.homeAboutPreview,
        scrub: 1,
        enabled: true,
      });

      // 0.00–0.05 Badge
      tl.to('.about-preview-badge', { opacity: 1, y: 0, duration: 0.05, ease: 'power2.out' }, 0);

      // 0.05–0.20 Heading words
      tl.to(
        '.about-preview-heading [data-word]',
        { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.15, stagger: 0.012, ease: 'power3.out' },
        0.05,
      );

      // 0.20–0.35 Mission snippet words (PRD: vision/mission snippet)
      tl.to(
        '.about-preview-mission [data-word]',
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.15, stagger: 0.008, ease: 'power2.out' },
        0.20,
      );

      // 0.30–0.95 Hex visual rotates + scales continuously
      tl.to('.about-preview-visual', { opacity: 1, duration: 0.05, ease: 'power2.out' }, 0.30)
        .to('.about-preview-visual', { rotation: 0, scale: 1.05, duration: 0.65, ease: 'none' }, 0.30);

      // 0.35–0.55 Description words (PRD: short introduction)
      tl.to(
        '.about-preview-desc [data-word]',
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.20, stagger: 0.006, ease: 'power2.out' },
        0.35,
      );

      // 0.60–0.70 CTA (PRD: link to About page)
      tl.to('.about-preview-cta', { opacity: 1, y: 0, duration: 0.10, ease: 'power2.out' }, 0.60);

      // 0.85–1.00 Camera scale
      tl.to('.about-preview-camera', { scale: 0.96, duration: 0.15, ease: 'power2.inOut' }, 0.85);
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="about-preview"
      aria-label="About CyCraft"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <style>{`
        /* Mobile — drop the 100vh min-heights so the section sizes to
           its content instead of leaving ~250px of dead space above and
           below the centred copy. The 100vh + flex centring is intended
           for the desktop pinned scrub timeline; on mobile we don't pin
           so it just bloats the page. Scoped to #about-preview only. */
        @media (max-width: 767px) {
          #about-preview { min-height: 0 !important; }
          #about-preview .about-preview-camera {
            min-height: 0 !important;
            align-items: stretch !important;
          }
        }
      `}</style>
      <div
        className="about-preview-camera"
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          paddingTop: 'clamp(3rem, 6vh, 4.5rem)',
          paddingBottom: 'clamp(3rem, 6vh, 4.5rem)',
          paddingInline: 'var(--section-padding)',
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        <div
          className="section-container"
          style={{
            display: 'grid',
            gridTemplateColumns: isTablet ? '1.1fr 0.9fr' : '1fr',
            gap: 'clamp(2rem, 5vw, 4rem)',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {/* Left — copy (PRD §3.1: short intro + vision/mission + link to About) */}
          <div>
            <div className="about-preview-badge">
              <Badge label={aboutPreviewContent.badge} />
            </div>
            <h2
              className="about-preview-heading"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 3.2vw, 2.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: 'var(--color-text-primary)',
                margin: '1rem 0 1rem',
                lineHeight: 1.12,
                overflowWrap: 'break-word',
              }}
            >
              <WordSplit text={aboutPreviewContent.heading} />
            </h2>

            {/* Mission / vision snippet — italic accent line */}
            <p
              className="about-preview-mission"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-base)',
                color: 'var(--color-beam)',
                fontStyle: 'italic',
                lineHeight: 1.5,
                margin: '0 0 1.25rem',
                maxWidth: '540px',
                paddingLeft: '0.85rem',
                borderLeft: '2px solid var(--color-beam)',
              }}
            >
              <WordSplit text={aboutPreviewContent.mission} />
            </p>

            <p
              className="about-preview-desc"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-base)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6,
                margin: '0 0 1.75rem',
                maxWidth: '560px',
              }}
            >
              <WordSplit text={aboutPreviewContent.description} />
            </p>

            <div className="about-preview-cta">
              <Button as="a" href={aboutPreviewContent.cta.href} variant="primary">
                {aboutPreviewContent.cta.label}
              </Button>
            </div>
          </div>

          {/* Right — decorative cyber visual */}
          {isTablet && (
            <div
              className="about-preview-visual"
              aria-hidden="true"
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '1 / 1',
                maxWidth: '440px',
                marginInline: 'auto',
              }}
            >
              {/* Outer hex ring */}
              <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                <defs>
                  <radialGradient id="ap-fill" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(168,240,255,0.12)" />
                    <stop offset="100%" stopColor="rgba(168,240,255,0)" />
                  </radialGradient>
                  <filter id="ap-glow"><feGaussianBlur stdDeviation="3" /></filter>
                </defs>
                <circle cx="200" cy="200" r="180" fill="url(#ap-fill)" />
                <polygon
                  points="200,40 340,120 340,280 200,360 60,280 60,120"
                  fill="none"
                  stroke="rgba(168,240,255,0.4)"
                  strokeWidth="1.2"
                  filter="url(#ap-glow)"
                />
                <polygon
                  points="200,80 300,140 300,260 200,320 100,260 100,140"
                  fill="none"
                  stroke="rgba(168,240,255,0.25)"
                  strokeWidth="0.8"
                />
                <polygon
                  points="200,120 260,160 260,240 200,280 140,240 140,160"
                  fill="none"
                  stroke="rgba(168,240,255,0.5)"
                  strokeWidth="1"
                />
                {/* Cross marks at vertices */}
                {[
                  [200, 40],
                  [340, 120],
                  [340, 280],
                  [200, 360],
                  [60, 280],
                  [60, 120],
                ].map(([x, y]) => (
                  <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill="#a8f0ff">
                    <animate attributeName="opacity" values="1;0.3;1" dur="2.4s" repeatCount="indefinite" />
                  </circle>
                ))}
                {/* Centre node */}
                <circle cx="200" cy="200" r="8" fill="rgba(168,240,255,0.25)" stroke="#a8f0ff" strokeWidth="1.2" />
                <circle cx="200" cy="200" r="3" fill="#a8f0ff" />
                {/* Centre label */}
                <text
                  x="200"
                  y="207"
                  textAnchor="middle"
                  fill="rgba(168,240,255,0.7)"
                  fontFamily="'JetBrains Mono', monospace"
                  fontSize="8"
                  letterSpacing="0.2em"
                  transform="translate(0, 24)"
                >
                  CYCRAFT.CORE
                </text>
              </svg>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
