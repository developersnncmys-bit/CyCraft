'use client';
/* About Approach — pinned dramatic three-pillar scene (Act III).
 *
 * 300% pin. The three giant numbers ignite one by one with a deep blur-in
 * then settle. After all three are lit, camera dollies in to centre the
 * row and the connecting line draws across.
 *
 *   0.00–0.10  Badge + heading reveal
 *   0.08–0.20  Description fades up
 *   0.20–0.40  Pillar 1 ignites (number rises from blur, card scales)
 *   0.40–0.60  Pillar 2 ignites
 *   0.60–0.80  Pillar 3 ignites — full triptych on screen
 *   0.78–0.92  Connecting line draws across all three numbers
 *   0.85–1.00  Camera tightens (scale 1.03), copy softens
 */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { Badge } from '@/components/ui/Badge';
import { aboutApproachContent } from '@/content/about/approach';

export default function AboutApproach() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();
  const isLayoutDesktop = useMediaQuery('(min-width: 900px)');

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const pillars = root.querySelectorAll<HTMLElement>('.about-approach-pillar');

      if (reducedMotion) {
        gsap.set(
          [
            '.about-approach-badge',
            '.about-approach-heading',
            '.about-approach-desc',
          ],
          { opacity: 1, y: 0 },
        );
        pillars.forEach((p) => {
          gsap.set(p, { opacity: 1, y: 0, scale: 1 });
          gsap.set(p.querySelector('.about-approach-number'), {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
          });
        });
        gsap.set('.about-approach-connector', { scaleX: 1 });
        return;
      }

      if (!isDesktop) {
        gsap.fromTo(
          '.about-approach-badge, .about-approach-heading, .about-approach-desc',
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
        pillars.forEach((p) => {
          gsap.fromTo(
            p,
            { opacity: 0, y: 42, scale: 0.94 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: p,
                start: 'top 80%',
                toggleActions: 'play none none reset',
              } as ScrollTrigger.Vars,
            },
          );
          gsap.fromTo(
            p.querySelector('.about-approach-number'),
            { opacity: 0, scale: 0.5, filter: 'blur(16px)' },
            {
              opacity: 1,
              scale: 1,
              filter: 'blur(0px)',
              duration: 1,
              ease: 'power3.out',
              delay: 0.2,
              scrollTrigger: {
                trigger: p,
                start: 'top 75%',
                toggleActions: 'play none none reset',
              } as ScrollTrigger.Vars,
            },
          );
        });
        return;
      }

      // Desktop pinned cinematic
      gsap.set(
        ['.about-approach-badge', '.about-approach-desc'],
        { opacity: 0, y: 20 },
      );
      gsap.set('.about-approach-heading', { opacity: 0, yPercent: 30 });
      gsap.set('.about-approach-camera', { scale: 1, transformOrigin: 'center center' });
      gsap.set('.about-approach-connector', {
        scaleX: 0,
        transformOrigin: 'left center',
      });

      pillars.forEach((p) => {
        gsap.set(p, { opacity: 0, y: 60, scale: 0.9 });
        const num = p.querySelector('.about-approach-number');
        if (num) gsap.set(num, { opacity: 0, scale: 0.4, filter: 'blur(20px)' });
        const title = p.querySelector('.about-approach-title');
        if (title) gsap.set(title, { opacity: 0, y: 12 });
        const desc = p.querySelector('.about-approach-pdesc');
        if (desc) gsap.set(desc, { opacity: 0 });
      });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_DURATIONS.aboutApproach,
        scrub: 1,
        enabled: true,
      });

      tl.to('.about-approach-badge', { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0);
      tl.to(
        '.about-approach-heading',
        { opacity: 1, yPercent: 0, duration: 0.12, ease: 'power3.out' },
        0.04,
      );
      tl.to('.about-approach-desc', { opacity: 1, y: 0, duration: 0.10, ease: 'power2.out' }, 0.10);

      const PILLAR_STARTS = [0.20, 0.40, 0.60];

      pillars.forEach((p, i) => {
        const start = PILLAR_STARTS[i] ?? 0.60;
        const num = p.querySelector('.about-approach-number');
        const title = p.querySelector('.about-approach-title');
        const desc = p.querySelector('.about-approach-pdesc');

        tl.to(
          p,
          { opacity: 1, y: 0, scale: 1, duration: 0.15, ease: 'power3.out' },
          start,
        );
        if (num) {
          tl.to(
            num,
            {
              opacity: 1,
              scale: 1,
              filter: 'blur(0px)',
              duration: 0.18,
              ease: 'power3.out',
            },
            start + 0.02,
          );
        }
        if (title) {
          tl.to(
            title,
            { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' },
            start + 0.10,
          );
        }
        if (desc) {
          tl.to(desc, { opacity: 1, duration: 0.08, ease: 'power2.out' }, start + 0.13);
        }
      });

      // 0.78–0.92 connecting line draws across
      tl.to(
        '.about-approach-connector',
        { scaleX: 1, duration: 0.14, ease: 'power2.out' },
        0.78,
      );

      // 0.85–1.00 camera tightens + paragraphs soften
      tl.to(
        '.about-approach-camera',
        { scale: 1.03, duration: 0.15, ease: 'power2.inOut' },
        0.85,
      );
      tl.to('.about-approach-pdesc', { opacity: 0.65, duration: 0.15 }, 0.85);
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="about-approach"
      aria-label={aboutApproachContent.heading}
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <div
        className="about-approach-camera"
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
          style={{ opacity: 0.35, zIndex: 0 }}
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
          <div className="about-approach-badge" style={{ display: 'inline-block' }}>
            <Badge label={aboutApproachContent.badge} />
          </div>
          <h2
            className="about-approach-heading"
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
            {aboutApproachContent.heading}
          </h2>
          <p
            className="about-approach-desc"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '720px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            {aboutApproachContent.description}
          </p>
        </div>

        <div
          className="section-container"
          style={{
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Connector beam */}
          {isLayoutDesktop && (
            <div
              aria-hidden="true"
              className="about-approach-connector"
              style={{
                position: 'absolute',
                top: '5.5rem',
                left: '12%',
                right: '12%',
                height: '1px',
                background:
                  'linear-gradient(to right, transparent, var(--color-red-team-glow), transparent)',
                boxShadow: '0 0 12px rgba(255,61,90,0.45)',
                transformOrigin: 'left center',
                willChange: 'transform',
                zIndex: 0,
              }}
            />
          )}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isLayoutDesktop ? 'repeat(3, 1fr)' : '1fr',
              gap: '1.5rem',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {aboutApproachContent.pillars.map((p) => (
              <div
                key={p.id}
                className="about-approach-pillar"
                style={{
                  position: 'relative',
                  padding: 'clamp(2rem, 3vw, 2.75rem) 1.75rem',
                  border: '1px solid rgba(168,240,255,0.12)',
                  background: 'rgba(13,16,20,0.5)',
                  textAlign: 'center',
                  willChange: 'transform, opacity',
                  transition: 'border-color 0.3s, box-shadow 0.3s',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = 'rgba(168,240,255,0.4)';
                  el.style.boxShadow =
                    '0 18px 40px rgba(0,0,0,0.55), 0 0 28px rgba(168,240,255,0.1)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = 'rgba(168,240,255,0.12)';
                  el.style.boxShadow = 'none';
                }}
              >
                <div
                  className="about-approach-number"
                  aria-hidden="true"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(4rem, 9vw, 6rem)',
                    fontWeight: 800,
                    color: 'var(--color-red-team-glow)',
                    lineHeight: 1,
                    textShadow: '0 0 24px rgba(255,61,90,0.4)',
                    letterSpacing: '-0.04em',
                    marginBottom: '1rem',
                    willChange: 'transform, opacity, filter',
                  }}
                >
                  {p.number}
                </div>
                <h3
                  className="about-approach-title"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.5rem, 2.5vw, 1.85rem)',
                    fontWeight: 700,
                    letterSpacing: '-0.01em',
                    color: 'var(--color-text-primary)',
                    margin: '0 0 1rem',
                    lineHeight: 1.2,
                  }}
                >
                  {p.title}
                </h3>
                <p
                  className="about-approach-pdesc"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-base)',
                    color: 'var(--color-text-secondary)',
                    margin: 0,
                    lineHeight: 1.65,
                    maxWidth: '320px',
                    marginInline: 'auto',
                  }}
                >
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
