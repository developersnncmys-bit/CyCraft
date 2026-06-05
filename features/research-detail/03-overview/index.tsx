'use client';
/* Research Detail — Overview (cinematic prose).
 *
 * Single-column prose, tight max-width, subtle gradient backdrop. Key
 * Areas render as INLINE PILLS — feels like a tech product page rather
 * than a bulleted academic doc. Findings + Partnerships flow as more
 * prose blocks underneath. No card chrome.
 */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { WordSplit } from '@/features/home/_shared/wordSplit';
import type { ResearchDetail } from '@/content/research/details';
import { researchDetailLabels } from '@/content/research/details';

export default function ResearchDetailOverview({ detail }: { detail: ResearchDetail }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      if (reducedMotion) {
        gsap.set(
          [
            '.rd-overview-el',
            '.rd-overview-heading [data-word]',
            '.rd-overview-intro [data-word]',
          ],
          { opacity: 1, y: 0, yPercent: 0, filter: 'none' },
        );
        return;
      }

      const trigger = {
        trigger: root,
        start: 'top 80%',
        toggleActions: 'play none none reset',
      } as ScrollTrigger.Vars;

      gsap.fromTo(
        '.rd-overview-heading [data-word]',
        { opacity: 0, yPercent: 60, filter: 'blur(6px)' },
        {
          opacity: 1,
          yPercent: 0,
          filter: 'blur(0px)',
          duration: 0.7,
          stagger: 0.05,
          ease: 'power3.out',
          scrollTrigger: trigger,
        },
      );

      gsap.fromTo(
        '.rd-overview-intro [data-word]',
        { opacity: 0, y: 8, filter: 'blur(4px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.5,
          stagger: 0.018,
          delay: 0.25,
          ease: 'power2.out',
          scrollTrigger: trigger,
        },
      );

      gsap.fromTo(
        '.rd-overview-el',
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.08,
          delay: 0.5,
          ease: 'power3.out',
          scrollTrigger: trigger,
        },
      );
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  const PROSE_MAX = '720px';

  return (
    <section
      ref={sectionRef}
      id="research-detail-overview"
      aria-label={researchDetailLabels.overviewHeading}
      style={{
        position: 'relative',
        paddingTop: 'clamp(3rem, 7vh, 5rem)',
        paddingBottom: 'clamp(3rem, 7vh, 5rem)',
        paddingInline: 'var(--section-padding)',
        background:
          'linear-gradient(180deg, rgba(13,16,20,0) 0%, rgba(13,16,20,0.4) 50%, rgba(13,16,20,0) 100%)',
      }}
    >
      <div className="section-container">
        <div style={{ maxWidth: PROSE_MAX }}>
          {/* Eyebrow */}
          <div
            className="rd-overview-el"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.22em',
              color: 'var(--color-beam)',
              textTransform: 'uppercase',
              marginBottom: '0.85rem',
            }}
          >
            01 — Overview
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: 'var(--color-text-primary)',
              margin: '0 0 1.5rem',
              lineHeight: 1.15,
            }}
          >
            <WordSplit
              text={researchDetailLabels.overviewHeading}
              style={{ display: 'inline' }}
              className="rd-overview-heading"
            />
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1rem, 1.15vw, 1.125rem)',
              color: 'var(--color-text-secondary)',
              margin: 0,
              lineHeight: 1.75,
            }}
          >
            <WordSplit
              text={detail.overview}
              style={{ display: 'inline' }}
              className="rd-overview-intro"
            />
          </p>

          {detail.placeholder ? (
            <p
              className="rd-overview-el"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.14em',
                color: 'var(--color-beam)',
                textTransform: 'uppercase',
                margin: '2rem 0 0',
                paddingTop: '1.25rem',
                borderTop: '1px solid rgba(168,240,255,0.12)',
              }}
            >
              {'// '}
              {researchDetailLabels.placeholderMessage}
            </p>
          ) : (
            <>
              {detail.keyAreas.length > 0 && (
                <div className="rd-overview-el" style={{ marginTop: '2.5rem' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      letterSpacing: '0.22em',
                      color: 'var(--color-beam)',
                      textTransform: 'uppercase',
                      marginBottom: '1rem',
                    }}
                  >
                    02 — {researchDetailLabels.keyAreasLabel}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.6rem',
                    }}
                  >
                    {detail.keyAreas.map((area) => (
                      <span
                        key={area}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '0.55rem 0.95rem',
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--text-sm)',
                          color: 'var(--color-text-primary)',
                          background: 'rgba(168,240,255,0.05)',
                          border: '1px solid rgba(168,240,255,0.2)',
                          borderRadius: '999px',
                          lineHeight: 1.3,
                          transition: 'background 0.25s, border-color 0.25s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(168,240,255,0.12)';
                          e.currentTarget.style.borderColor = 'rgba(168,240,255,0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(168,240,255,0.05)';
                          e.currentTarget.style.borderColor = 'rgba(168,240,255,0.2)';
                        }}
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {detail.findings &&
                detail.findings
                  .split(/\n{2,}/)
                  .filter((chunk) => chunk.trim().length > 0)
                  .map((para, i) => (
                    <div
                      key={i}
                      className="rd-overview-el"
                      style={{ marginTop: i === 0 ? '2.5rem' : '1.25rem' }}
                    >
                      {i === 0 && (
                        <div
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '10px',
                            letterSpacing: '0.22em',
                            color: 'var(--color-beam)',
                            textTransform: 'uppercase',
                            marginBottom: '0.85rem',
                          }}
                        >
                          03 — Findings
                        </div>
                      )}
                      <p
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--text-base)',
                          color: 'var(--color-text-secondary)',
                          margin: 0,
                          lineHeight: 1.75,
                        }}
                      >
                        {para}
                      </p>
                    </div>
                  ))}

              {detail.partnerships && (
                <div className="rd-overview-el" style={{ marginTop: '2.5rem' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      letterSpacing: '0.22em',
                      color: 'var(--color-beam)',
                      textTransform: 'uppercase',
                      marginBottom: '0.85rem',
                    }}
                  >
                    04 — {researchDetailLabels.partnershipsLabel}
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-base)',
                      color: 'var(--color-text-secondary)',
                      margin: 0,
                      lineHeight: 1.75,
                    }}
                  >
                    {detail.partnerships}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
