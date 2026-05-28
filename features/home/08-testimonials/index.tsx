'use client';
/* Testimonials — pinned cinematic scene
 *
 * Pinned for 200%. Beats:
 *   0.00–0.05  Badge
 *   0.05–0.20  Heading words
 *   0.20–0.32  Description words
 *   0.32–0.85  4 quote cards reveal one-by-one (~0.13 per card)
 *   0.90–1.00  Camera scale 1 → 0.96
 */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { Badge } from '@/components/ui/Badge';
import { testimonialsContent } from '@/content/home/testimonials';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { WordSplit } from '@/features/home/_shared/wordSplit';

export default function HomeTestimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();
  const isTablet = useMediaQuery('(min-width: 768px)');

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const cards = root.querySelectorAll<HTMLElement>('.testimonial-el');

      if (reducedMotion) {
        gsap.set(
          [
            '.testimonials-badge',
            '.testimonials-heading [data-word]',
            '.testimonials-desc [data-word]',
            '.testimonial-el',
          ],
          { opacity: 1, y: 0, scale: 1, filter: 'none' },
        );
        return;
      }

      if (!isDesktop) {
        const trigger = { trigger: root, start: 'top 75%', toggleActions: 'play none none reset' };
        gsap.fromTo('.testimonials-badge', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, scrollTrigger: trigger });
        gsap.fromTo(
          '.testimonials-heading [data-word]',
          { opacity: 0, yPercent: 60, filter: 'blur(8px)' },
          { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.04, delay: 0.2, scrollTrigger: trigger },
        );
        gsap.fromTo(
          '.testimonials-desc [data-word]',
          { opacity: 0, y: 8, filter: 'blur(4px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, stagger: 0.02, delay: 0.5, scrollTrigger: trigger },
        );
        gsap.fromTo(
          '.testimonial-el',
          { opacity: 0, y: 40, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.75, stagger: 0.13, ease: 'power3.out', delay: 0.8, scrollTrigger: trigger },
        );
        return;
      }

      // Desktop cinematic
      gsap.set('.testimonials-badge', { opacity: 0, y: 18 });
      gsap.set('.testimonials-heading [data-word]', { opacity: 0, yPercent: 60, filter: 'blur(10px)' });
      gsap.set('.testimonials-desc [data-word]', { opacity: 0, y: 8, filter: 'blur(4px)' });
      gsap.set('.testimonial-el', { opacity: 0, y: 48, scale: 0.94 });
      gsap.set('.testimonials-camera', { scale: 1, transformOrigin: 'center center' });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_DURATIONS.homeTestimonials,
        scrub: 1,
        enabled: true,
      });

      tl.to('.testimonials-badge', { opacity: 1, y: 0, duration: 0.05, ease: 'power2.out' }, 0)
        .to(
          '.testimonials-heading [data-word]',
          { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.15, stagger: 0.012, ease: 'power3.out' },
          0.05,
        )
        .to(
          '.testimonials-desc [data-word]',
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.12, stagger: 0.006, ease: 'power2.out' },
          0.20,
        )
        .to(
          cards,
          { opacity: 1, y: 0, scale: 1, duration: 0.13, stagger: 0.13, ease: 'power3.out' },
          0.32,
        )
        .to('.testimonials-camera', { scale: 0.96, duration: 0.10, ease: 'power2.inOut' }, 0.90);
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      aria-label="Testimonials"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <div
        className="testimonials-camera"
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: 'clamp(3rem, 6vh, 4.5rem)',
          paddingBottom: 'clamp(3rem, 6vh, 4.5rem)',
          paddingInline: 'var(--section-padding)',
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        <div className="section-container" style={{ textAlign: 'center', marginBottom: 'clamp(1.5rem, 3vh, 2.5rem)' }}>
          <div className="testimonials-badge" style={{ display: 'inline-block' }}>
            <Badge label={testimonialsContent.badge} />
          </div>
          <h2
            className="testimonials-heading"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3.2vw, 2.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: 'var(--color-text-primary)',
              margin: '1rem 0 0.6rem',
              lineHeight: 1.1,
              overflowWrap: 'break-word',
            }}
          >
            <WordSplit text={testimonialsContent.heading} />
          </h2>
          <p
            className="testimonials-desc"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-base)',
              color: 'var(--color-text-secondary)',
              maxWidth: '560px',
              margin: '0 auto',
              lineHeight: 1.5,
            }}
          >
            <WordSplit text={testimonialsContent.description} />
          </p>
        </div>

        <div
          className="section-container"
          style={{
            display: 'grid',
            gridTemplateColumns: isTablet ? 'repeat(2, 1fr)' : '1fr',
            gap: '0.85rem',
          }}
        >
          {testimonialsContent.testimonials.map((t) => (
            <figure
              key={t.id}
              className="testimonial-el"
              style={{
                margin: 0,
                position: 'relative',
                background: 'rgba(13,16,20,0.5)',
                border: '1px solid rgba(168,240,255,0.1)',
                padding: '1.1rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
              }}
            >
              {/* Quote mark */}
              <div
                aria-hidden="true"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2.2rem',
                  lineHeight: 0.8,
                  color: 'var(--color-beam)',
                  opacity: 0.4,
                  height: '0.9rem',
                  marginBottom: '-0.35rem',
                }}
              >
                &ldquo;
              </div>
              <blockquote
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  color: 'var(--color-text-primary)',
                  lineHeight: 1.5,
                  fontStyle: 'italic',
                  flex: 1,
                }}
              >
                {t.quote}
              </blockquote>
              <figcaption
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.7rem',
                  paddingTop: '0.65rem',
                  borderTop: '1px solid rgba(168,240,255,0.06)',
                }}
              >
                {/* Avatar disc with initials */}
                <div
                  aria-hidden="true"
                  style={{
                    width: '32px',
                    height: '32px',
                    flexShrink: 0,
                    borderRadius: '50%',
                    background: 'rgba(168,240,255,0.1)',
                    border: '1px solid rgba(168,240,255,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--color-beam)',
                    letterSpacing: '0.04em',
                  }}
                >
                  {t.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {t.name}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      color: 'var(--color-text-tertiary)',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {t.role} · {t.company}
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
