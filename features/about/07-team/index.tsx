'use client';
/* About Team — pinned scene (Act III).
 *
 * 250% pin. Team group cards rise with their count numbers ignited and tags
 * stagger.
 *
 *   0.00–0.10  Badge + heading reveal
 *   0.10–0.20  Description fades up
 *   0.20–0.40  Group 1 rises + count counter pulses + tags stagger
 *   0.40–0.60  Group 2 rises
 *   0.60–0.80  Group 3 rises
 *   0.80–1.00  Camera tightens, counts brighten
 */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { Badge } from '@/components/ui/Badge';
import { aboutTeamContent } from '@/content/about/team';

export default function AboutTeam() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();
  const isLayoutDesktop = useMediaQuery('(min-width: 900px)');

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const cards = root.querySelectorAll<HTMLElement>('.about-team-card');

      if (reducedMotion) {
        gsap.set(
          ['.about-team-badge', '.about-team-heading', '.about-team-desc'],
          { opacity: 1, y: 0 },
        );
        cards.forEach((c) => {
          gsap.set(c, { opacity: 1, y: 0, scale: 1 });
          gsap.set(c.querySelectorAll('.about-team-tag'), { opacity: 1, y: 0 });
          gsap.set(c.querySelector('.about-team-count'), { opacity: 1, scale: 1 });
        });
        return;
      }

      if (!isDesktop) {
        gsap.fromTo(
          '.about-team-badge, .about-team-heading, .about-team-desc',
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
            { opacity: 0, y: 36, scale: 0.96 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.75,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: c,
                start: 'top 82%',
                toggleActions: 'play none none reset',
              } as ScrollTrigger.Vars,
            },
          );
        });
        return;
      }

      // Desktop pinned
      gsap.set(
        ['.about-team-badge', '.about-team-desc'],
        { opacity: 0, y: 20 },
      );
      gsap.set('.about-team-heading', { opacity: 0, yPercent: 30 });
      gsap.set('.about-team-camera', { scale: 1, transformOrigin: 'center center' });

      cards.forEach((c) => {
        gsap.set(c, { opacity: 0, y: 48, scale: 0.94 });
        const count = c.querySelector('.about-team-count');
        if (count) gsap.set(count, { opacity: 0, scale: 0.5 });
        gsap.set(c.querySelectorAll('.about-team-tag'), { opacity: 0, y: 8 });
      });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_DURATIONS.aboutTeam,
        scrub: 1,
        enabled: true,
      });

      tl.to('.about-team-badge', { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0);
      tl.to(
        '.about-team-heading',
        { opacity: 1, yPercent: 0, duration: 0.12, ease: 'power3.out' },
        0.04,
      );
      tl.to('.about-team-desc', { opacity: 1, y: 0, duration: 0.10, ease: 'power2.out' }, 0.10);

      const CARD_STARTS = [0.20, 0.40, 0.60];

      cards.forEach((c, i) => {
        const start = CARD_STARTS[i] ?? 0.60;
        const count = c.querySelector('.about-team-count');
        const tags = c.querySelectorAll<HTMLElement>('.about-team-tag');

        tl.to(
          c,
          { opacity: 1, y: 0, scale: 1, duration: 0.16, ease: 'power3.out' },
          start,
        );
        if (count) {
          tl.to(
            count,
            { opacity: 1, scale: 1, duration: 0.16, ease: 'back.out(2)' },
            start + 0.04,
          );
        }
        if (tags.length) {
          tl.to(
            tags,
            { opacity: 1, y: 0, duration: 0.10, stagger: 0.03, ease: 'power2.out' },
            start + 0.08,
          );
        }
      });

      tl.to(
        '.about-team-camera',
        { scale: 1.02, duration: 0.18, ease: 'power2.inOut' },
        0.82,
      );
      tl.to(
        '.about-team-count',
        { textShadow: '0 0 28px rgba(168,240,255,0.7)', duration: 0.18 },
        0.82,
      );
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="about-team"
      aria-label={aboutTeamContent.heading}
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <div
        className="about-team-camera"
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
          aria-hidden="true"
          className="absolute inset-0 grid-atmosphere pointer-events-none"
          style={{ opacity: 0.3, zIndex: 0 }}
        />

        <div
          className="section-container"
          style={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            marginBottom: 'clamp(3rem, 6vh, 4.5rem)',
          }}
        >
          <div className="about-team-badge" style={{ display: 'inline-block' }}>
            <Badge label={aboutTeamContent.badge} />
          </div>
          <h2
            className="about-team-heading"
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
            {aboutTeamContent.heading}
          </h2>
          <p
            className="about-team-desc"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '680px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            {aboutTeamContent.description}
          </p>
        </div>

        <div
          className="section-container"
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'grid',
            gridTemplateColumns: isLayoutDesktop ? 'repeat(3, 1fr)' : '1fr',
            gap: '1.5rem',
          }}
        >
          {aboutTeamContent.groups.map((g) => (
            <article
              key={g.id}
              className="about-team-card"
              style={{
                position: 'relative',
                padding: '2rem 1.75rem',
                border: '1px solid rgba(168,240,255,0.12)',
                background: 'rgba(13,16,20,0.5)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                willChange: 'transform, opacity',
                transition: 'border-color 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(168,240,255,0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(168,240,255,0.12)';
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '1rem',
                }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    letterSpacing: '-0.01em',
                    color: 'var(--color-text-primary)',
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  {g.title}
                </h3>
                <span
                  className="about-team-count"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.6rem',
                    fontWeight: 700,
                    color: 'var(--color-beam)',
                    letterSpacing: '-0.02em',
                    textShadow: '0 0 16px rgba(168,240,255,0.4)',
                    lineHeight: 1,
                    flexShrink: 0,
                    willChange: 'transform, opacity, text-shadow',
                  }}
                >
                  {g.count}
                </span>
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-text-secondary)',
                  margin: 0,
                  lineHeight: 1.65,
                }}
              >
                {g.description}
              </p>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  marginTop: 'auto',
                }}
              >
                {g.tags.map((tag) => (
                  <span
                    key={tag}
                    className="about-team-tag"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      letterSpacing: '0.14em',
                      color: 'var(--color-text-tertiary)',
                      textTransform: 'uppercase',
                      padding: '0.3rem 0.6rem',
                      border: '1px solid rgba(168,240,255,0.18)',
                      background: 'rgba(168,240,255,0.04)',
                      willChange: 'opacity, transform',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
