'use client';
/* CTF Challenge — pinned cinematic scene
 *
 * Pinned for 250%. Beats (0–1):
 *   0.00–0.05  Badge
 *   0.05–0.18  Heading words ("Hacking Skills" red highlight as part of stagger)
 *   0.18–0.32  Description words
 *   0.32–0.42  Terminal box emerges with scale + glow
 *   0.42–0.75  Terminal lines stream out one-by-one (mock terminal typing)
 *              tied to scroll progress
 *   0.75–0.85  Start Challenge button pops in with bounce
 *   0.85–0.95  Follow-up CTA
 *   0.92–1.00  Camera scale 1 → 0.96
 */
import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ctfChallengeContent } from '@/content/home/ctf-challenge';
import { WordSplit } from '@/features/home/_shared/wordSplit';

export default function HomeCtfChallenge() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();
  // Click START CHALLENGE → swap the welcome+button block for the
  // ctf_challenge.sh sequence. Stays open until route change/unmount.
  const [started, setStarted] = useState(false);

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const terminalLines = root.querySelectorAll<HTMLElement>('.ctf-terminal-line');

      if (reducedMotion) {
        gsap.set(
          [
            '.ctf-badge',
            '.ctf-heading [data-word]',
            '.ctf-desc [data-word]',
            '.ctf-terminal-box',
            '.ctf-terminal-line',
            '.ctf-start-btn',
            '.ctf-followup',
          ],
          { opacity: 1, y: 0, x: 0, scale: 1, filter: 'none' },
        );
        return;
      }

      if (!isDesktop) {
        const trigger = { trigger: root, start: 'top 75%', toggleActions: 'play none none reset' };
        gsap.fromTo('.ctf-badge', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, scrollTrigger: trigger });
        gsap.fromTo(
          '.ctf-heading [data-word]',
          { opacity: 0, yPercent: 60, filter: 'blur(8px)' },
          { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.05, delay: 0.2, scrollTrigger: trigger },
        );
        gsap.fromTo(
          '.ctf-desc [data-word]',
          { opacity: 0, y: 8, filter: 'blur(4px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, stagger: 0.02, delay: 0.5, scrollTrigger: trigger },
        );
        gsap.fromTo('.ctf-terminal-box', { opacity: 0, y: 30, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, delay: 0.8, scrollTrigger: trigger });
        gsap.fromTo('.ctf-terminal-line', { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.2, delay: 1.2, scrollTrigger: trigger });
        gsap.fromTo('.ctf-start-btn', { opacity: 0, y: 20, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.4)', delay: 1.8, scrollTrigger: trigger });
        gsap.fromTo('.ctf-followup', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, delay: 2.2, scrollTrigger: trigger });
        return;
      }

      // Desktop cinematic
      gsap.set('.ctf-badge', { opacity: 0, y: 18 });
      gsap.set('.ctf-heading [data-word]', { opacity: 0, yPercent: 60, filter: 'blur(10px)' });
      gsap.set('.ctf-desc [data-word]', { opacity: 0, y: 8, filter: 'blur(4px)' });
      gsap.set('.ctf-terminal-box', { opacity: 0, y: 40, scale: 0.94 });
      gsap.set('.ctf-terminal-line', { opacity: 0, x: -14 });
      gsap.set('.ctf-start-btn', { opacity: 0, y: 20, scale: 0.85 });
      gsap.set('.ctf-followup', { opacity: 0, y: 20 });
      gsap.set('.ctf-camera', { scale: 1, transformOrigin: 'center center' });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_DURATIONS.homeCtfChallenge,
        scrub: 1,
        enabled: true,
      });

      tl.to('.ctf-badge', { opacity: 1, y: 0, duration: 0.05, ease: 'power2.out' }, 0)
        .to(
          '.ctf-heading [data-word]',
          { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.13, stagger: 0.015, ease: 'power3.out' },
          0.05,
        )
        .to(
          '.ctf-desc [data-word]',
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.14, stagger: 0.008, ease: 'power2.out' },
          0.18,
        )
        .to('.ctf-terminal-box', { opacity: 1, y: 0, scale: 1, duration: 0.10, ease: 'power3.out' }, 0.32)
        // Terminal lines stream tied to scroll progress (0.42-0.72, ~0.15 per line)
        .to(
          terminalLines,
          { opacity: 1, x: 0, duration: 0.08, stagger: 0.15, ease: 'power2.out' },
          0.42,
        )
        .to('.ctf-start-btn', { opacity: 1, y: 0, scale: 1, duration: 0.10, ease: 'back.out(1.5)' }, 0.75)
        .to('.ctf-followup', { opacity: 1, y: 0, duration: 0.08, stagger: 0.04, ease: 'power2.out' }, 0.85)
        .to('.ctf-camera', { scale: 0.96, duration: 0.08, ease: 'power2.inOut' }, 0.92);
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="ctf"
      aria-label="Challenge your hacking skills"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <div
        className="ctf-camera"
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
        <div className="section-container" style={{ textAlign: 'center', marginBottom: 'clamp(1rem, 2.5vh, 2rem)' }}>
          <div className="ctf-badge">
            <Badge label={ctfChallengeContent.badge} />
          </div>
          <h2
            className="ctf-heading"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3.2vw, 2.75rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: 'var(--color-text-primary)',
              margin: '0.85rem 0 0.6rem',
              lineHeight: 1.1,
              overflowWrap: 'break-word',
            }}
          >
            <WordSplit text="Challenge Your " />
            <span style={{ color: 'var(--color-red-team)', textShadow: '0 0 18px rgba(255,61,90,0.4)' }}>
              <WordSplit text="Hacking Skills" />
            </span>
          </h2>
          <p
            className="ctf-desc"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-base)',
              color: 'var(--color-text-secondary)',
              maxWidth: '560px',
              margin: '0 auto',
              lineHeight: 1.5,
            }}
          >
            <WordSplit text={ctfChallengeContent.description} />
          </p>
        </div>

        {/* Terminal block */}
        <div
          className="ctf-terminal-box section-container"
          style={{
            maxWidth: '820px',
            marginInline: 'auto',
            border: '1px solid var(--color-red-team)',
            boxShadow: '0 0 32px rgba(255,61,90,0.2)',
          }}
        >
          {/* Red header bar */}
          <div
            style={{
              background: 'var(--color-red-team)',
              padding: '0.6rem 1.1rem',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-sm)',
              color: '#fff',
              letterSpacing: '0.04em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 600,
            }}
          >
            <span aria-hidden="true">›_</span>
            <span>{ctfChallengeContent.prompt}</span>
          </div>

          {/* Terminal body */}
          <div
            style={{
              background: '#0a0a0a',
              padding: 'clamp(1.5rem, 4vw, 2.5rem) 1.5rem',
              textAlign: 'center',
              minHeight: '220px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
            }}
          >
            {/* Lightning bolt icon */}
            <svg
              aria-hidden="true"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-red-team)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: 'drop-shadow(0 0 12px rgba(255,61,90,0.6))' }}
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>

            {!started && ctfChallengeContent.welcomeLines.map((line, i) => (
              <p
                key={line}
                className="ctf-terminal-line"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: i === 0 ? 'var(--text-base)' : 'var(--text-sm)',
                  color: i === 0 ? 'var(--color-terminal)' : 'rgba(255,255,255,0.7)',
                  margin: 0,
                  letterSpacing: '0.04em',
                }}
              >
                {line}
              </p>
            ))}

            {!started && (
              <div
                className="ctf-start-btn"
                style={{ marginTop: '0.5rem', willChange: 'transform, opacity' }}
              >
                <button
                  type="button"
                  onClick={() => setStarted(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    background: 'var(--color-red-team)',
                    color: '#fff',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-sm)',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    padding: '0.7rem 1.6rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 0 24px rgba(255,61,90,0.4)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.transform = 'translateY(-2px)';
                    el.style.boxShadow = '0 0 36px rgba(255,61,90,0.6)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.transform = 'translateY(0)';
                    el.style.boxShadow = '0 0 24px rgba(255,61,90,0.4)';
                  }}
                >
                  <svg
                    aria-hidden="true"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  {ctfChallengeContent.startCta.label}
                </button>
              </div>
            )}

            {started && (
              <div
                role="log"
                aria-live="polite"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.15rem',
                  animation: 'fade-in-up 0.3s ease-out',
                }}
              >
                {ctfChallengeContent.challengeLines.map((line, i) => (
                  <p
                    key={`${i}-${line}`}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      color: 'var(--color-terminal)',
                      margin: 0,
                      letterSpacing: '0.04em',
                      lineHeight: 1.45,
                      minHeight: line === '' ? '0.2em' : undefined,
                      wordBreak: 'break-all',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {line || ' '}
                  </p>
                ))}

                {/* In-terminal CTA — guarantees the user can reach the
                    /courses page without scrolling past the pinned section
                    to find the external follow-up button below. */}
                <a
                  href={`${ctfChallengeContent.followUpCta.href}?apply=1`}
                  style={{
                    marginTop: '0.65rem',
                    alignSelf: 'center',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'var(--color-red-team)',
                    color: '#fff',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    padding: '0.55rem 1.25rem',
                    textDecoration: 'none',
                    boxShadow: '0 0 24px rgba(255,61,90,0.4)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.transform = 'translateY(-2px)';
                    el.style.boxShadow = '0 0 36px rgba(255,61,90,0.6)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.transform = 'translateY(0)';
                    el.style.boxShadow = '0 0 24px rgba(255,61,90,0.4)';
                  }}
                >
                  {ctfChallengeContent.followUpCta.label}
                  <span aria-hidden="true">›</span>
                </a>
              </div>
            )}

          </div>
        </div>

        {/* External follow-up — only shown BEFORE the challenge starts,
            since after starting the same CTA lives inside the terminal.
            This keeps the pinned section's total content height within
            100vh so nothing crops at the bottom of the viewport. */}
        {!started && (
          <div
            className="section-container"
            style={{ textAlign: 'center', marginTop: 'clamp(1rem, 2.5vh, 2rem)' }}
          >
            <p
              className="ctf-followup"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-secondary)',
                maxWidth: '560px',
                margin: '0 auto 1rem',
              }}
            >
              {ctfChallengeContent.followUp}
            </p>
            <div className="ctf-followup" style={{ display: 'inline-block' }}>
              <Button as="a" href={ctfChallengeContent.followUpCta.href} variant="outline">
                {ctfChallengeContent.followUpCta.label}
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
