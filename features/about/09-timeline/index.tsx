'use client';
/* About Timeline — long pinned scrub (Act IV).
 *
 * 450% pin — the centerpiece of the journey. The axis line draws downward
 * as scroll progresses; each year's dot ignites + event slides in as the
 * scroll passes its station. The active year stays highlighted while the
 * others dim.
 *
 *   0.00–0.10  Header reveals
 *   0.10–0.90  Six events stagger ignite in scrubbed sequence, axis fills
 *   0.90–1.00  All events glow, camera tightens, final year crowns the column
 */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { Badge } from '@/components/ui/Badge';
import { aboutTimelineContent } from '@/content/about/timeline';

export default function AboutTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();
  const isLayoutDesktop = useMediaQuery('(min-width: 768px)');

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const events = root.querySelectorAll<HTMLElement>('.about-timeline-event');

      if (reducedMotion) {
        gsap.set(
          ['.about-timeline-badge', '.about-timeline-heading', '.about-timeline-desc'],
          { opacity: 1, y: 0 },
        );
        events.forEach((e) => {
          gsap.set(e, { opacity: 1, x: 0 });
          gsap.set(e.querySelector('.about-timeline-dot'), {
            scale: 1,
            boxShadow: '0 0 16px var(--color-beam-glow)',
          });
        });
        gsap.set('.about-timeline-axis', { scaleY: 1 });
        return;
      }

      if (!isDesktop) {
        gsap.fromTo(
          '.about-timeline-badge, .about-timeline-heading, .about-timeline-desc',
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
          '.about-timeline-axis',
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '.about-timeline-list',
              start: 'top 75%',
              end: 'bottom 70%',
              scrub: 0.6,
            } as ScrollTrigger.Vars,
          },
        );

        events.forEach((e) => {
          gsap.fromTo(
            e,
            { opacity: 0, x: -24 },
            {
              opacity: 1,
              x: 0,
              duration: 0.7,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: e,
                start: 'top 82%',
                toggleActions: 'play none none reset',
              } as ScrollTrigger.Vars,
            },
          );

          gsap.fromTo(
            e.querySelector('.about-timeline-dot'),
            { scale: 0, boxShadow: '0 0 0 rgba(168,240,255,0)' },
            {
              scale: 1,
              boxShadow: '0 0 16px var(--color-beam-glow)',
              duration: 0.6,
              ease: 'back.out(2)',
              delay: 0.15,
              scrollTrigger: {
                trigger: e,
                start: 'top 82%',
                toggleActions: 'play none none reset',
              } as ScrollTrigger.Vars,
            },
          );
        });
        return;
      }

      // Desktop pinned cinematic
      gsap.set(
        ['.about-timeline-badge', '.about-timeline-desc'],
        { opacity: 0, y: 20 },
      );
      gsap.set('.about-timeline-heading', { opacity: 0, yPercent: 30 });
      gsap.set('.about-timeline-axis', { scaleY: 0, transformOrigin: 'top' });
      gsap.set('.about-timeline-camera', { scale: 1, transformOrigin: 'center center' });

      events.forEach((e) => {
        gsap.set(e, { opacity: 0, x: -36 });
        const dot = e.querySelector('.about-timeline-dot');
        const year = e.querySelector('.about-timeline-year');
        const title = e.querySelector('.about-timeline-title');
        const desc = e.querySelector('.about-timeline-edesc');
        if (dot) gsap.set(dot, { scale: 0, boxShadow: '0 0 0 rgba(168,240,255,0)' });
        if (year) gsap.set(year, { opacity: 0, y: 10 });
        if (title) gsap.set(title, { opacity: 0, y: 12 });
        if (desc) gsap.set(desc, { opacity: 0, y: 8 });
      });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_DURATIONS.aboutTimeline,
        scrub: 1,
        enabled: true,
      });

      tl.to('.about-timeline-badge', { opacity: 1, y: 0, duration: 0.05, ease: 'power2.out' }, 0);
      tl.to(
        '.about-timeline-heading',
        { opacity: 1, yPercent: 0, duration: 0.07, ease: 'power3.out' },
        0.03,
      );
      tl.to('.about-timeline-desc', { opacity: 1, y: 0, duration: 0.06, ease: 'power2.out' }, 0.08);

      // Axis fills proportionally to events being lit
      tl.to(
        '.about-timeline-axis',
        { scaleY: 1, duration: 0.78, ease: 'none' },
        0.10,
      );

      // 6 events in window 0.12 – 0.88 → 0.127 each
      const START = 0.12;
      const END = 0.88;
      const evCount = events.length || 1;
      const STEP = (END - START) / evCount;

      events.forEach((e, i) => {
        const start = START + STEP * i;
        const dot = e.querySelector('.about-timeline-dot');
        const year = e.querySelector('.about-timeline-year');
        const title = e.querySelector('.about-timeline-title');
        const desc = e.querySelector('.about-timeline-edesc');

        if (dot) {
          tl.to(
            dot,
            {
              scale: 1,
              boxShadow: '0 0 16px var(--color-beam-glow)',
              duration: STEP * 0.5,
              ease: 'back.out(2)',
            },
            start,
          );
        }
        tl.to(
          e,
          { opacity: 1, x: 0, duration: STEP * 0.7, ease: 'power3.out' },
          start + STEP * 0.05,
        );
        if (year) {
          tl.to(
            year,
            { opacity: 1, y: 0, duration: STEP * 0.4, ease: 'power2.out' },
            start + STEP * 0.1,
          );
        }
        if (title) {
          tl.to(
            title,
            { opacity: 1, y: 0, duration: STEP * 0.4, ease: 'power2.out' },
            start + STEP * 0.2,
          );
        }
        if (desc) {
          tl.to(
            desc,
            { opacity: 1, y: 0, duration: STEP * 0.4, ease: 'power2.out' },
            start + STEP * 0.3,
          );
        }
      });

      // 0.88–1.00 camera tightens + all dots brighten
      tl.to(
        '.about-timeline-camera',
        { scale: 0.98, duration: 0.12, ease: 'power2.inOut' },
        0.88,
      );
      tl.to(
        '.about-timeline-dot',
        {
          boxShadow: '0 0 24px var(--color-beam-glow)',
          duration: 0.12,
          ease: 'power2.inOut',
        },
        0.88,
      );
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="about-timeline"
      aria-label={aboutTimelineContent.heading}
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <div
        className="about-timeline-camera"
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
          <div className="about-timeline-badge" style={{ display: 'inline-block' }}>
            <Badge label={aboutTimelineContent.badge} />
          </div>
          <h2
            className="about-timeline-heading"
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
            {aboutTimelineContent.heading}
          </h2>
          <p
            className="about-timeline-desc"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '680px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            {aboutTimelineContent.description}
          </p>
        </div>

        <div className="section-container" style={{ maxWidth: '880px', position: 'relative', zIndex: 1 }}>
          <div
            className="about-timeline-list"
            style={{
              position: 'relative',
              paddingLeft: isLayoutDesktop ? '4rem' : '2.5rem',
            }}
          >
            {/* Static dim axis backdrop */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: isLayoutDesktop ? '1.5rem' : '0.75rem',
                width: '2px',
                background: 'rgba(168,240,255,0.12)',
              }}
            />
            {/* Animated bright axis */}
            <div
              className="about-timeline-axis"
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: isLayoutDesktop ? '1.5rem' : '0.75rem',
                width: '2px',
                background:
                  'linear-gradient(to bottom, var(--color-beam), var(--color-beam-glow))',
                boxShadow: '0 0 14px var(--color-beam-glow)',
                transformOrigin: 'top',
                willChange: 'transform',
              }}
            />

            {aboutTimelineContent.events.map((ev) => (
              <div
                key={ev.id}
                className="about-timeline-event"
                style={{
                  position: 'relative',
                  paddingBottom: 'clamp(2rem, 5vh, 3rem)',
                  willChange: 'transform, opacity',
                }}
              >
                <div
                  className="about-timeline-dot"
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: '0.4rem',
                    left: isLayoutDesktop
                      ? 'calc(-4rem + 1.5rem - 7px)'
                      : 'calc(-2.5rem + 0.75rem - 7px)',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: 'var(--color-beam)',
                    border: '2px solid var(--color-void)',
                    willChange: 'transform, box-shadow',
                  }}
                />

                <div
                  className="about-timeline-year"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    letterSpacing: '0.2em',
                    color: 'var(--color-beam)',
                    textTransform: 'uppercase',
                    marginBottom: '0.4rem',
                    willChange: 'transform, opacity',
                  }}
                >
                  {ev.year}
                </div>
                <h3
                  className="about-timeline-title"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    letterSpacing: '-0.01em',
                    color: 'var(--color-text-primary)',
                    margin: '0 0 0.6rem',
                    lineHeight: 1.2,
                    willChange: 'transform, opacity',
                  }}
                >
                  {ev.title}
                </h3>
                <p
                  className="about-timeline-edesc"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-base)',
                    color: 'var(--color-text-secondary)',
                    margin: 0,
                    lineHeight: 1.65,
                    maxWidth: '620px',
                    willChange: 'transform, opacity',
                  }}
                >
                  {ev.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
