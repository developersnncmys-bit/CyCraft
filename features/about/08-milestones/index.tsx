'use client';
/* About Milestones — pinned scene (Act IV).
 *
 * 250% pin. Six milestone cards ignite in two rows, with their // labels
 * underlining first then the value text crossfading in.
 *
 *   0.00–0.10  Badge + heading reveal
 *   0.10–0.20  Description fades up
 *   0.20–0.78  Six cards stagger ignite in scroll-scrubbed sequence
 *   0.78–1.00  Camera tightens, grid border glows brighter
 */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { Badge } from '@/components/ui/Badge';
import { aboutMilestonesContent } from '@/content/about/milestones';

export default function AboutMilestones() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();
  const isGridDesktop = useMediaQuery('(min-width: 768px)');
  const isGridWide = useMediaQuery('(min-width: 1100px)');

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const cards = root.querySelectorAll<HTMLElement>('.about-mile-card');

      if (reducedMotion) {
        gsap.set(
          ['.about-mile-badge', '.about-mile-heading', '.about-mile-desc'],
          { opacity: 1, y: 0 },
        );
        cards.forEach((c) => {
          gsap.set(c, { opacity: 1, y: 0 });
          gsap.set(c.querySelector('.about-mile-value'), { opacity: 1, y: 0 });
        });
        return;
      }

      if (!isDesktop) {
        gsap.fromTo(
          '.about-mile-badge, .about-mile-heading, .about-mile-desc',
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
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: c,
                start: 'top 85%',
                toggleActions: 'play none none reset',
              } as ScrollTrigger.Vars,
            },
          );
        });
        return;
      }

      // Desktop pinned
      gsap.set(
        ['.about-mile-badge', '.about-mile-desc'],
        { opacity: 0, y: 20 },
      );
      gsap.set('.about-mile-heading', { opacity: 0, yPercent: 30 });
      gsap.set('.about-mile-camera', { scale: 1, transformOrigin: 'center center' });

      cards.forEach((c) => {
        gsap.set(c, { opacity: 0, y: 36 });
        const label = c.querySelector('.about-mile-label');
        const value = c.querySelector('.about-mile-value');
        if (label) gsap.set(label, { opacity: 0, x: -12 });
        if (value) gsap.set(value, { opacity: 0, y: 12 });
      });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_DURATIONS.aboutMilestones,
        scrub: 1,
        enabled: true,
      });

      tl.to('.about-mile-badge', { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0);
      tl.to(
        '.about-mile-heading',
        { opacity: 1, yPercent: 0, duration: 0.12, ease: 'power3.out' },
        0.04,
      );
      tl.to('.about-mile-desc', { opacity: 1, y: 0, duration: 0.10, ease: 'power2.out' }, 0.10);

      // Six cards in the window 0.20 – 0.78 → ~0.097 per card
      const START = 0.20;
      const END = 0.78;
      const cardCount = cards.length || 1;
      const STEP = (END - START) / cardCount;

      cards.forEach((c, i) => {
        const start = START + STEP * i;
        const label = c.querySelector('.about-mile-label');
        const value = c.querySelector('.about-mile-value');

        tl.to(
          c,
          { opacity: 1, y: 0, duration: STEP * 0.7, ease: 'power3.out' },
          start,
        );
        if (label) {
          tl.to(
            label,
            { opacity: 1, x: 0, duration: STEP * 0.6, ease: 'power2.out' },
            start + STEP * 0.1,
          );
        }
        if (value) {
          tl.to(
            value,
            { opacity: 1, y: 0, duration: STEP * 0.6, ease: 'power2.out' },
            start + STEP * 0.3,
          );
        }
      });

      tl.to(
        '.about-mile-camera',
        { scale: 1.02, duration: 0.18, ease: 'power2.inOut' },
        0.82,
      );
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="about-milestones"
      aria-label={aboutMilestonesContent.heading}
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <div
        className="about-mile-camera"
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
          <div className="about-mile-badge" style={{ display: 'inline-block' }}>
            <Badge label={aboutMilestonesContent.badge} />
          </div>
          <h2
            className="about-mile-heading"
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
            {aboutMilestonesContent.heading}
          </h2>
          <p
            className="about-mile-desc"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '620px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            {aboutMilestonesContent.description}
          </p>
        </div>

        <div
          className="section-container about-mile-grid"
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'grid',
            // Two vision statements side-by-side on tablet+, stacked on mobile.
            gridTemplateColumns: isGridDesktop ? 'repeat(2, 1fr)' : '1fr',
            gap: '1.5rem',
            maxWidth: '1100px',
            marginInline: 'auto',
          }}
        >
          {aboutMilestonesContent.statements.map((s, i) => (
            <div
              key={s.id}
              className="about-mile-card"
              style={{
                position: 'relative',
                padding: '2rem 1.75rem',
                border: '1px solid rgba(168,240,255,0.1)',
                background: 'rgba(13,16,20,0.45)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                willChange: 'transform, opacity',
                transition: 'border-color 0.3s, box-shadow 0.3s',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = 'rgba(168,240,255,0.3)';
                el.style.boxShadow = '0 10px 24px rgba(0,0,0,0.45)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = 'rgba(168,240,255,0.1)';
                el.style.boxShadow = 'none';
              }}
            >
              <div
                className="about-mile-label"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.2em',
                  color: 'var(--color-beam)',
                  textTransform: 'uppercase',
                  willChange: 'transform, opacity',
                }}
              >
                {`// ${String(i + 1).padStart(2, '0')}`}
              </div>
              <p
                className="about-mile-value"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-base)',
                  fontWeight: 400,
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.7,
                  margin: 0,
                  willChange: 'transform, opacity',
                }}
              >
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
