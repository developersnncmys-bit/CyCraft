'use client';
/* About Leadership — pinned scene (Act III).
 *
 * 250% pin. Profile cards arrive from the right one at a time with avatar
 * glow ignition.
 *
 *   0.00–0.10  Badge + heading reveal
 *   0.08–0.18  Description fades up
 *   0.18–0.40  Leader 1 slides in + avatar glows
 *   0.40–0.62  Leader 2 slides in
 *   0.62–0.82  Leader 3 slides in — triptych complete
 *   0.82–1.00  Camera pulls back slightly, avatars all pulse
 */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { Badge } from '@/components/ui/Badge';
import { aboutLeadershipContent } from '@/content/about/leadership';

export default function AboutLeadership() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();
  const isLayoutDesktop = useMediaQuery('(min-width: 900px)');

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const cards = root.querySelectorAll<HTMLElement>('.about-leader-card');

      if (reducedMotion) {
        gsap.set(
          [
            '.about-leadership-badge',
            '.about-leadership-heading',
            '.about-leadership-desc',
          ],
          { opacity: 1, y: 0 },
        );
        cards.forEach((c) => {
          gsap.set(c, { opacity: 1, x: 0, scale: 1 });
          gsap.set(c.querySelector('.about-leader-avatar'), { scale: 1 });
        });
        return;
      }

      if (!isDesktop) {
        gsap.fromTo(
          '.about-leadership-badge, .about-leadership-heading, .about-leadership-desc',
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
              duration: 0.7,
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
        ['.about-leadership-badge', '.about-leadership-desc'],
        { opacity: 0, y: 20 },
      );
      gsap.set('.about-leadership-heading', { opacity: 0, yPercent: 30 });
      gsap.set('.about-leadership-camera', { scale: 1, transformOrigin: 'center center' });

      cards.forEach((c) => {
        gsap.set(c, { opacity: 0, x: 60, scale: 0.94 });
        const avatar = c.querySelector('.about-leader-avatar');
        if (avatar)
          gsap.set(avatar, {
            scale: 0.6,
            boxShadow: '0 0 0 rgba(168,240,255,0)',
          });
      });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_DURATIONS.aboutLeadership,
        scrub: 1,
        enabled: true,
      });

      tl.to('.about-leadership-badge', { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0);
      tl.to(
        '.about-leadership-heading',
        { opacity: 1, yPercent: 0, duration: 0.12, ease: 'power3.out' },
        0.04,
      );
      tl.to('.about-leadership-desc', { opacity: 1, y: 0, duration: 0.10, ease: 'power2.out' }, 0.10);

      const CARD_STARTS = [0.18, 0.40, 0.62];

      cards.forEach((c, i) => {
        const start = CARD_STARTS[i] ?? 0.62;
        tl.to(
          c,
          { opacity: 1, x: 0, scale: 1, duration: 0.18, ease: 'power3.out' },
          start,
        );
        const avatar = c.querySelector('.about-leader-avatar');
        if (avatar) {
          tl.to(
            avatar,
            {
              scale: 1,
              boxShadow: '0 0 24px rgba(168,240,255,0.4)',
              duration: 0.18,
              ease: 'back.out(1.8)',
            },
            start + 0.04,
          );
        }
      });

      // 0.82–1.00 camera pull-back + avatars all pulse brighter
      tl.to(
        '.about-leadership-camera',
        { scale: 0.97, duration: 0.18, ease: 'power2.inOut' },
        0.82,
      );
      tl.to(
        '.about-leader-avatar',
        {
          boxShadow: '0 0 36px rgba(168,240,255,0.6)',
          duration: 0.18,
          ease: 'power2.inOut',
        },
        0.82,
      );
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="about-leadership"
      aria-label={aboutLeadershipContent.heading}
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <div
        className="about-leadership-camera"
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
          className="absolute inset-0 pointer-events-none"
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
          <div className="about-leadership-badge" style={{ display: 'inline-block' }}>
            <Badge label={aboutLeadershipContent.badge} />
          </div>
          <h2
            className="about-leadership-heading"
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
            {aboutLeadershipContent.heading}
          </h2>
          <p
            className="about-leadership-desc"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '680px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            {aboutLeadershipContent.description}
          </p>
        </div>

        <div
          className="section-container"
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'grid',
            // 2 columns on desktop (Partnership Activities | Why CyCraft);
            // stack on mobile.
            gridTemplateColumns: isLayoutDesktop ? 'repeat(2, 1fr)' : '1fr',
            gap: '1.75rem',
          }}
        >
          {aboutLeadershipContent.columns.map((col, colIndex) => (
            <article
              key={col.id}
              // `.about-leader-card` retained from the previous render shape
              // so the section's pinned timeline (which staggers items keyed
              // off this class) keeps firing without changes. Two cards now
              // instead of three — the third stagger position is harmless.
              className="about-leader-card"
              style={{
                position: 'relative',
                padding: '2rem 1.75rem',
                border: '1px solid rgba(168,240,255,0.1)',
                background: 'rgba(13,16,20,0.45)',
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
                e.currentTarget.style.borderColor = 'rgba(168,240,255,0.1)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  aria-hidden="true"
                  className="about-leader-avatar"
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background:
                      'radial-gradient(circle at 30% 30%, rgba(168,240,255,0.4) 0%, rgba(168,240,255,0.05) 60%, transparent 100%)',
                    border: '1px solid rgba(168,240,255,0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    color: 'var(--color-beam)',
                    textShadow: '0 0 12px var(--color-beam-glow)',
                    flexShrink: 0,
                    willChange: 'transform, box-shadow',
                  }}
                >
                  {String(colIndex + 1).padStart(2, '0')}
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  {col.title}
                </h3>
              </div>

              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                }}
              >
                {col.items.map((item) => (
                  <li
                    key={item}
                    style={{
                      display: 'flex',
                      gap: '0.65rem',
                      alignItems: 'flex-start',
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-base)',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.55,
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        flexShrink: 0,
                        marginTop: '0.55em',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: 'var(--color-beam)',
                        boxShadow: '0 0 8px var(--color-beam-glow)',
                      }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
