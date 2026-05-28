'use client';
/* About Mission — pinned scene (Act II).
 *
 * 250% pin. Internal beats:
 *   0.00–0.10  Badge + heading reveal from left
 *   0.10–0.35  Paragraphs stagger in
 *   0.20–0.40  Card slides in from the right
 *   0.40–0.65  Card features stagger in (4 bullets)
 *   0.65–0.85  Camera slowly drifts; card scales up subtly
 *   0.85–1.00  Camera pulls back, copy softens
 *
 * Parallax: copy column moves at yPercent -8; card column moves at yPercent -16
 * (right side travels further → relative motion = depth).
 */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { Badge } from '@/components/ui/Badge';
import { aboutMissionContent, type MissionIcon } from '@/content/about/mission';

function FeatureIcon({ name }: { name: MissionIcon }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
  switch (name) {
    case 'trending':
      return (
        <svg {...common}>
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
      );
    case 'globe':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18Z" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...common}>
          <path d="M12 2 4 5v7c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V5l-8-3Z" />
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

export default function AboutMission() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const isLayoutDesktop = useMediaQuery('(min-width: 900px)');
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      if (reducedMotion) {
        gsap.set(
          [
            '.about-mission-badge',
            '.about-mission-heading',
            '.about-mission-para',
            '.about-mission-card',
            '.about-mission-feature',
          ],
          { opacity: 1, x: 0, y: 0 },
        );
        return;
      }

      if (!isDesktop) {
        gsap.fromTo(
          '.about-mission-badge, .about-mission-heading, .about-mission-para',
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
        gsap.fromTo(
          '.about-mission-card',
          { opacity: 0, y: 36, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: root,
              start: 'top 72%',
              toggleActions: 'play none none reset',
            } as ScrollTrigger.Vars,
          },
        );
        gsap.fromTo(
          '.about-mission-feature',
          { opacity: 0, x: 12 },
          {
            opacity: 1,
            x: 0,
            duration: 0.45,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.about-mission-card',
              start: 'top 75%',
              toggleActions: 'play none none reset',
            } as ScrollTrigger.Vars,
          },
        );
        return;
      }

      // Desktop pinned
      gsap.set('.about-mission-badge', { opacity: 0, x: -24 });
      gsap.set('.about-mission-heading', { opacity: 0, x: -28 });
      gsap.set('.about-mission-para', { opacity: 0, y: 20 });
      gsap.set('.about-mission-card', { opacity: 0, x: 60, scale: 0.94 });
      gsap.set('.about-mission-feature', { opacity: 0, x: 24 });
      gsap.set('.about-mission-camera', { scale: 1, transformOrigin: 'center center' });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_DURATIONS.aboutMission,
        scrub: 1,
        enabled: true,
      });

      tl.to('.about-mission-badge', { opacity: 1, x: 0, duration: 0.08, ease: 'power2.out' }, 0.00);
      tl.to(
        '.about-mission-heading',
        { opacity: 1, x: 0, duration: 0.10, ease: 'power3.out' },
        0.04,
      );

      tl.to(
        '.about-mission-para',
        {
          opacity: 1,
          y: 0,
          duration: 0.10,
          stagger: 0.08,
          ease: 'power2.out',
        },
        0.10,
      );

      tl.to(
        '.about-mission-card',
        { opacity: 1, x: 0, scale: 1, duration: 0.20, ease: 'power3.out' },
        0.20,
      );

      tl.to(
        '.about-mission-feature',
        { opacity: 1, x: 0, duration: 0.08, stagger: 0.05, ease: 'power2.out' },
        0.40,
      );

      // Parallax: left copy gentle drift, right card travels further
      tl.to('.about-mission-copy', { yPercent: -8, duration: 1, ease: 'none' }, 0);
      tl.to('.about-mission-card', { yPercent: -16, duration: 1, ease: 'none' }, 0);

      // 0.65–0.85 card scale up + subtle glow
      tl.to(
        '.about-mission-card',
        { scale: 1.04, duration: 0.20, ease: 'power2.out' },
        0.65,
      );

      // 0.85–1.00 camera pull-back + copy softens
      tl.to(
        '.about-mission-camera',
        { scale: 0.96, duration: 0.15, ease: 'power2.inOut' },
        0.85,
      );
      tl.to('.about-mission-para', { opacity: 0.55, duration: 0.15 }, 0.85);
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="about-mission"
      aria-label="Our mission"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <div
        className="about-mission-camera"
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
          aria-hidden="true"
          className="absolute inset-0 grid-atmosphere pointer-events-none"
          style={{ opacity: 0.35, zIndex: 0 }}
        />

        <div
          className="section-container"
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'grid',
            gridTemplateColumns: isLayoutDesktop ? '1fr 1fr' : '1fr',
            gap: 'clamp(2rem, 5vw, 4rem)',
            alignItems: 'center',
          }}
        >
          {/* Left — copy */}
          <div className="about-mission-copy" style={{ willChange: 'transform' }}>
            <div className="about-mission-badge">
              <Badge label={aboutMissionContent.badge} />
            </div>
            <h2
              className="about-mission-heading"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-display-md)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                textTransform: 'uppercase',
                color: 'var(--color-text-primary)',
                margin: '1.25rem 0 1.5rem',
                lineHeight: 1.1,
              }}
            >
              {aboutMissionContent.heading}
            </h2>
            {aboutMissionContent.paragraphs.map((p, i) => (
              <p
                key={i}
                className="about-mission-para"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-lg)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.7,
                  margin: '0 0 1.25rem',
                  maxWidth: '560px',
                }}
              >
                {p}
              </p>
            ))}
          </div>

          {/* Right — Why Choose Us card */}
          <div
            className="about-mission-card"
            style={{
              position: 'relative',
              padding: 'clamp(2rem, 4vw, 2.75rem)',
              background:
                'linear-gradient(135deg, rgba(255,61,90,0.16) 0%, rgba(255,61,90,0.04) 60%, rgba(13,16,20,0.6) 100%)',
              border: '1px solid rgba(255,61,90,0.25)',
              borderRadius: '14px',
              boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 32px rgba(255,61,90,0.08)',
              overflow: 'hidden',
              willChange: 'transform, opacity',
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '1px',
                background:
                  'linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent)',
              }}
            />

            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: '#ffffff',
                margin: '0 0 2rem',
                lineHeight: 1.15,
              }}
            >
              {aboutMissionContent.card.title}
            </h3>

            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '1.1rem',
              }}
            >
              {aboutMissionContent.card.features.map((f) => (
                <li
                  key={f.id}
                  className="about-mission-feature"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    color: 'rgba(255,255,255,0.95)',
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-base)',
                    lineHeight: 1.4,
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.12)',
                      color: '#ffffff',
                      flexShrink: 0,
                    }}
                  >
                    <FeatureIcon name={f.icon} />
                  </span>
                  {f.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
