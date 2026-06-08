'use client';
/* Research & Innovation — pinned cinematic scene
 *
 * Pinned for 250%. Beats:
 *   0.00–0.05  Badge
 *   0.05–0.18  Heading words
 *   0.18–0.32  Description words
 *   0.35–0.80  3 research cards reveal one-by-one (~0.15 per card)
 *   0.80–0.90  "View All Research" CTA
 *   0.90–1.00  Camera scale 1 → 0.96
 */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { homeResearchContent } from '@/content/home/research';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { WordSplit } from '@/features/home/_shared/wordSplit';

const tagColor = (tag: string) => {
  if (tag === 'CRITICAL') return 'var(--color-red-team)';
  if (tag === 'ANALYSIS') return 'var(--color-blue-team)';
  return 'var(--color-terminal)';
};

const formatDate = (iso: string) => {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
};

export default function HomeResearch() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();
  const isTablet = useMediaQuery('(min-width: 768px)');

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const cards = root.querySelectorAll<HTMLElement>('.research-card-el');

      if (reducedMotion) {
        gsap.set(
          [
            '.research-badge',
            '.research-heading [data-word]',
            '.research-desc [data-word]',
            '.research-card-el',
            '.research-cta',
          ],
          { opacity: 1, y: 0, scale: 1, filter: 'none' },
        );
        return;
      }

      if (!isDesktop) {
        const trigger = { trigger: root, start: 'top 75%', toggleActions: 'play none none reset' };
        gsap.fromTo('.research-badge', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, scrollTrigger: trigger });
        gsap.fromTo(
          '.research-heading [data-word]',
          { opacity: 0, yPercent: 60, filter: 'blur(8px)' },
          { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.04, delay: 0.2, scrollTrigger: trigger },
        );
        gsap.fromTo(
          '.research-desc [data-word]',
          { opacity: 0, y: 8, filter: 'blur(4px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, stagger: 0.02, delay: 0.5, scrollTrigger: trigger },
        );
        gsap.fromTo(
          '.research-card-el',
          { opacity: 0, y: 40, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.75, stagger: 0.14, ease: 'power3.out', delay: 0.8, scrollTrigger: trigger },
        );
        gsap.fromTo('.research-cta', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, delay: 1.3, scrollTrigger: trigger });
        return;
      }

      // Desktop cinematic
      gsap.set('.research-badge', { opacity: 0, y: 18 });
      gsap.set('.research-heading [data-word]', { opacity: 0, yPercent: 60, filter: 'blur(10px)' });
      gsap.set('.research-desc [data-word]', { opacity: 0, y: 8, filter: 'blur(4px)' });
      gsap.set('.research-card-el', { opacity: 0, y: 48, scale: 0.94 });
      gsap.set('.research-cta', { opacity: 0, y: 16 });
      gsap.set('.research-camera', { scale: 1, transformOrigin: 'center center' });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_DURATIONS.homeResearch,
        scrub: 1,
        enabled: true,
      });

      tl.to('.research-badge', { opacity: 1, y: 0, duration: 0.05, ease: 'power2.out' }, 0)
        .to(
          '.research-heading [data-word]',
          { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.13, stagger: 0.012, ease: 'power3.out' },
          0.05,
        )
        .to(
          '.research-desc [data-word]',
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.14, stagger: 0.007, ease: 'power2.out' },
          0.18,
        )
        .to(
          cards,
          { opacity: 1, y: 0, scale: 1, duration: 0.13, stagger: 0.15, ease: 'power3.out' },
          0.35,
        )
        .to('.research-cta', { opacity: 1, y: 0, duration: 0.07, ease: 'power2.out' }, 0.80)
        .to('.research-camera', { scale: 0.96, duration: 0.10, ease: 'power2.inOut' }, 0.90);
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="research"
      aria-label="Research and innovation"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <div
        className="research-camera"
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
          <div className="research-badge" style={{ display: 'inline-block' }}>
            <Badge label={homeResearchContent.badge} />
          </div>
          <h2
            className="research-heading"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3.2vw, 2.75rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: 'var(--color-text-primary)',
              margin: '1rem 0 0.75rem',
              lineHeight: 1.1,
              overflowWrap: 'break-word',
            }}
          >
            <WordSplit text={homeResearchContent.heading} />
          </h2>
          <p
            className="research-desc"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-base)',
              color: 'var(--color-text-secondary)',
              maxWidth: '560px',
              margin: '0 auto',
              lineHeight: 1.55,
            }}
          >
            <WordSplit text={homeResearchContent.description} />
          </p>
        </div>

        <div
          className="section-container"
          style={{
            display: 'grid',
            gridTemplateColumns: isTablet ? 'repeat(3, 1fr)' : '1fr',
            gap: '1rem',
            marginBottom: 'clamp(1.25rem, 2.5vh, 2rem)',
          }}
        >
          {homeResearchContent.highlights.map((h) => {
            const color = tagColor(h.tag);
            return (
              <article
                key={h.id}
                className="research-card-el"
                style={{
                  position: 'relative',
                  border: '1px solid rgba(168,240,255,0.1)',
                  background: 'rgba(13,16,20,0.4)',
                  padding: '1.25rem 1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                  transition: 'transform 0.3s, border-color 0.3s',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = 'translateY(-3px)';
                  el.style.borderColor = 'rgba(168,240,255,0.3)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = 'translateY(0)';
                  el.style.borderColor = 'rgba(168,240,255,0.1)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      letterSpacing: '0.18em',
                      color: 'var(--color-text-tertiary)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {h.category}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      letterSpacing: '0.18em',
                      color,
                      textTransform: 'uppercase',
                      padding: '0.2rem 0.55rem',
                      border: `1px solid ${color}`,
                      borderRadius: '2px',
                    }}
                  >
                    {h.tag}
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                    color: 'var(--color-text-primary)',
                    margin: 0,
                    lineHeight: 1.3,
                  }}
                >
                  {h.title}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.85rem',
                    color: 'var(--color-text-secondary)',
                    margin: 0,
                    lineHeight: 1.5,
                    flex: 1,
                  }}
                >
                  {h.excerpt}
                </p>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--color-text-disabled)',
                    letterSpacing: '0.1em',
                  }}
                >
                  {formatDate(h.date)}
                </div>
              </article>
            );
          })}
        </div>

        {/* Research page hidden for now — CTA temporarily commented out.
        <div className="section-container" style={{ textAlign: 'center' }}>
          <div className="research-cta" style={{ display: 'inline-block' }}>
            <Button as="a" href={homeResearchContent.cta.href} variant="outline">
              {homeResearchContent.cta.label}
            </Button>
          </div>
        </div>
        */}
      </div>
    </section>
  );
}
