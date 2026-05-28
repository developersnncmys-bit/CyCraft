'use client';
/* Contact Socials — pinned cinematic finale (Act V of /contact).
 *
 * 300% pin. The five brand channels ignite one-by-one — each card rises
 * with a back.out bounce and a brief brand-color glow pulse, like
 * channels lighting up on a comms board. Final beat: a subtle red glow
 * pulse foreshadows the footer.
 *
 *   0.00–0.05  Badge rises
 *   0.05–0.18  Heading per-word reveal
 *   0.18–0.28  Subhead fades up
 *   0.28–0.55  5 social cards ignite in sequence (stagger 0.045)
 *   0.55–0.80  Hold + parallax drift
 *   0.80–1.00  Camera pull-back into footer
 */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { Badge } from '@/components/ui/Badge';
import { contactSocialsContent } from '@/content/contact/socials';

function IconLinkedIn() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}
function IconInstagram() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
function IconYouTube() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-5.8 31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" />
    </svg>
  );
}
function IconDiscord() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.27 5.33A17.4 17.4 0 0 0 14.92 4l-.22.43a16.27 16.27 0 0 0-5.4 0L9.08 4a17.4 17.4 0 0 0-4.35 1.33C2.06 9.33 1.33 13.22 1.7 17.05A17.65 17.65 0 0 0 7 19.7l.42-.62a11.5 11.5 0 0 1-1.83-.88c.15-.11.3-.23.45-.36 3.6 1.66 7.5 1.66 11.06 0 .15.13.3.25.45.36-.58.34-1.2.64-1.84.88l.43.62a17.65 17.65 0 0 0 5.32-2.65c.42-4.39-.6-8.24-3.18-11.72ZM8.52 14.65a2.06 2.06 0 0 1-1.94-2.15c0-1.18.87-2.15 1.94-2.15s1.95.97 1.94 2.15c0 1.18-.86 2.15-1.94 2.15Zm7.16 0a2.06 2.06 0 0 1-1.94-2.15c0-1.18.86-2.15 1.94-2.15s1.95.97 1.94 2.15c0 1.18-.86 2.15-1.94 2.15Z" />
    </svg>
  );
}
function IconTelegram() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 3 2.5 10.6c-.7.3-.7 1.3 0 1.6l4.4 1.7L17.8 6.6c.2-.1.4.1.2.3l-9 8.6.4 5.1c.5 0 .7-.2 1-.5l2.4-2.3 4.6 3.4c.8.5 1.4.2 1.6-.8l3-14c.3-1.2-.4-1.7-1.2-1.4Z" />
    </svg>
  );
}

const SOCIAL_ICON: Record<string, () => React.ReactElement> = {
  linkedin: IconLinkedIn,
  instagram: IconInstagram,
  youtube: IconYouTube,
  discord: IconDiscord,
  telegram: IconTelegram,
};

const SOCIAL_GLOW: Record<string, string> = {
  linkedin: 'rgba(10,102,194,0.55)',
  instagram: 'rgba(225,48,108,0.55)',
  youtube: 'rgba(255,0,0,0.5)',
  discord: 'rgba(88,101,242,0.55)',
  telegram: 'rgba(36,161,222,0.55)',
};

export default function ContactSocials() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      if (reducedMotion) {
        gsap.set(
          [
            '.contact-soc-bg',
            '.contact-soc-scan',
            '.contact-soc-glow',
            '.contact-soc-camera',
            '.contact-soc-badge',
            '.contact-soc-heading-word',
            '.contact-soc-sub',
            '.contact-soc-card',
          ],
          { opacity: 1, x: 0, y: 0, scale: 1, clearProps: 'transform' },
        );
        return;
      }

      if (!isDesktop) {
        const trigger = {
          trigger: root,
          start: 'top 80%',
          toggleActions: 'play none none reset',
        };
        gsap.fromTo('.contact-soc-badge', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, scrollTrigger: trigger });
        gsap.fromTo(
          '.contact-soc-heading-word',
          { opacity: 0, yPercent: 60, filter: 'blur(8px)' },
          { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.04, delay: 0.1, scrollTrigger: trigger },
        );
        gsap.fromTo(
          '.contact-soc-sub',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.55, delay: 0.35, scrollTrigger: trigger },
        );
        gsap.fromTo(
          '.contact-soc-card',
          { opacity: 0, y: 24, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.55,
            stagger: 0.08,
            ease: 'back.out(1.4)',
            delay: 0.45,
            scrollTrigger: trigger,
          },
        );
        return;
      }

      // Desktop cinematic — pinned scrub
      gsap.set('.contact-soc-badge', { opacity: 0, y: 14 });
      gsap.set('.contact-soc-heading-word', { opacity: 0, yPercent: 70, filter: 'blur(10px)' });
      gsap.set('.contact-soc-sub', { opacity: 0, y: 18 });
      gsap.set('.contact-soc-card', { opacity: 0, y: 36, scale: 0.88 });
      gsap.set('.contact-soc-camera', { scale: 1, transformOrigin: 'center center' });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_DURATIONS.contactSocials,
        scrub: 1,
        enabled: true,
        invalidateOnRefresh: true,
      });

      // 0.00–0.05 Badge
      tl.to('.contact-soc-badge', { opacity: 1, y: 0, duration: 0.05, ease: 'power2.out' }, 0);

      // 0.05–0.18 Heading words
      tl.to(
        '.contact-soc-heading-word',
        { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.13, stagger: 0.025, ease: 'power3.out' },
        0.05,
      );

      // 0.18–0.28 Subhead
      tl.to('.contact-soc-sub', { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' }, 0.18);

      // 0.28–0.55 Cards ignite one-by-one with back.out bounce
      tl.to(
        '.contact-soc-card',
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.12,
          stagger: 0.045,
          ease: 'back.out(1.5)',
        },
        0.28,
      );

      // Parallax
      tl.to('.contact-soc-bg', { yPercent: -6, scale: 1, duration: 1, ease: 'none' }, 0);
      tl.to('.contact-soc-scan', { yPercent: -20, duration: 1, ease: 'none' }, 0);
      tl.to(
        '.contact-soc-glow',
        { yPercent: -28, scale: 1.3, opacity: 0.6, duration: 1, ease: 'none' },
        0,
      );

      // 0.80–1.00 Camera pull-back
      tl.to('.contact-soc-camera', { scale: 0.96, duration: 0.18, ease: 'power2.inOut' }, 0.8);
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  const headingWords = contactSocialsContent.heading.split(/\s+/);

  return (
    <section
      ref={sectionRef}
      id="contact-socials"
      aria-label="Connect on social media"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      {/* 5-card responsive grid — preserved from prior orphan-fix */}
      <style>{`
        .contact-soc-grid {
          display: grid;
          gap: clamp(1rem, 2vw, 1.5rem);
          grid-template-columns: repeat(5, minmax(0, 1fr));
        }
        @media (max-width: 1100px) and (min-width: 721px) {
          .contact-soc-grid { grid-template-columns: repeat(6, minmax(0, 1fr)); }
          .contact-soc-grid > a { grid-column: span 2; }
          .contact-soc-grid > a:nth-child(4) { grid-column: 2 / span 2; }
          .contact-soc-grid > a:nth-child(5) { grid-column: 4 / span 2; }
        }
        @media (max-width: 720px) and (min-width: 421px) {
          .contact-soc-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .contact-soc-grid > a:last-child:nth-child(odd) {
            grid-column: 1 / -1;
            max-width: calc(50% - calc(clamp(1rem, 2vw, 1.5rem) / 2));
            justify-self: center;
          }
        }
        @media (max-width: 420px) {
          .contact-soc-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div
        className="contact-soc-camera"
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          paddingTop: 'clamp(5rem, 9vh, 7rem)',
          paddingBottom: 'clamp(4rem, 7vh, 6rem)',
          paddingInline: 'var(--section-padding)',
          transformOrigin: 'center center',
          willChange: 'transform',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden="true"
          className="contact-soc-bg"
          style={{
            position: 'absolute',
            inset: '-8%',
            zIndex: 1,
            transform: 'scale(1.04)',
            opacity: 0.55,
            pointerEvents: 'none',
            willChange: 'transform',
          }}
        />
        <div
          aria-hidden="true"
          className="contact-soc-scan"
          style={{
            position: 'absolute',
            inset: '-5%',
            zIndex: 2,
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.014) 3px, rgba(255,255,255,0.014) 4px)',
            pointerEvents: 'none',
            willChange: 'transform',
          }}
        />
        <div
          aria-hidden="true"
          className="contact-soc-glow"
          style={{
            position: 'absolute',
            top: '55%',
            left: '50%',
            width: '1200px',
            height: '780px',
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse, rgba(168,240,255,0.07) 0%, rgba(168,240,255,0.025) 45%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
            zIndex: 3,
            pointerEvents: 'none',
            willChange: 'transform, opacity',
          }}
        />

        {/* Inner wrapper — see Inquiries for rationale (no double padding). */}
        <div
          style={{
            position: 'relative',
            zIndex: 6,
            width: '100%',
            maxWidth: '1180px',
            marginInline: 'auto',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
            <div className="contact-soc-badge" style={{ display: 'inline-block', marginBottom: '1.25rem' }}>
              <Badge label={contactSocialsContent.badge} />
            </div>
            <h2
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '0.3em',
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-display-md)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                textTransform: 'uppercase',
                color: 'var(--color-text-primary)',
                margin: '0 0 1rem',
                lineHeight: 1.1,
              }}
            >
              {headingWords.map((word, i) => (
                <span
                  key={`${word}-${i}`}
                  className="contact-soc-heading-word"
                  style={{ display: 'inline-block', willChange: 'transform, opacity, filter' }}
                >
                  {word}
                </span>
              ))}
            </h2>
            <p
              className="contact-soc-sub"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-lg)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6,
                maxWidth: '640px',
                margin: '0 auto',
                willChange: 'transform, opacity',
              }}
            >
              {contactSocialsContent.subhead}
            </p>
          </div>

          <div className="contact-soc-grid">
            {contactSocialsContent.socials.map((s) => {
              const Icon = SOCIAL_ICON[s.key] ?? IconLinkedIn;
              const glow = SOCIAL_GLOW[s.key] ?? 'var(--color-beam-glow)';
              return (
                <a
                  key={s.key}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-soc-card"
                  style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    padding: 'clamp(1.25rem, 2vw, 1.75rem)',
                    background: 'var(--color-carbon)',
                    border: '1px solid rgba(168,240,255,0.12)',
                    color: 'var(--color-text-primary)',
                    textDecoration: 'none',
                    transition: 'transform 0.25s, border-color 0.25s, box-shadow 0.25s',
                    willChange: 'transform, opacity',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = 'rgba(168,240,255,0.32)';
                    e.currentTarget.style.boxShadow = `0 12px 28px rgba(0,0,0,0.4), 0 0 24px ${glow}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(168,240,255,0.12)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '44px',
                      height: '44px',
                      background: 'rgba(168,240,255,0.06)',
                      border: '1px solid rgba(168,240,255,0.2)',
                      color: 'var(--color-beam)',
                    }}
                  >
                    <Icon />
                  </span>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1rem',
                        fontWeight: 700,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {s.label}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        color: 'var(--color-text-tertiary)',
                        letterSpacing: '0.08em',
                      }}
                    >
                      {s.handle}
                    </span>
                  </div>

                  <span
                    aria-hidden="true"
                    style={{
                      marginTop: 'auto',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: 'var(--color-beam)',
                    }}
                  >
                    Follow ›
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
