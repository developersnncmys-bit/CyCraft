'use client';
/* Contact Inquiries — pinned cinematic scene (Act III of /contact).
 *
 * 350% pin. Choreographs the two inquiry channels (Admissions / Partnerships)
 * as a balanced pair — one ignites cyan, the other red — like cutting between
 * two camera angles.
 *
 *   0.00–0.05  Badge rises
 *   0.05–0.18  Heading per-word reveal (blur + yPercent)
 *   0.18–0.28  Subhead fades up
 *   0.25–0.45  Admissions card slides in from left, accent line draws
 *   0.30–0.45  Admissions inner stack staggers (icon → title → desc → bullets → CTA)
 *   0.40–0.60  Partnerships card slides in from right, red accent ignites
 *   0.45–0.62  Partnerships inner stack staggers
 *   0.62–0.85  Hold — parallax layers continue drifting
 *   0.85–1.00  Camera pulls back (scale 0.96)
 *
 * Three parallax layers drift through the entire pin.
 */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { Badge } from '@/components/ui/Badge';
import { contactInquiriesContent } from '@/content/contact/inquiries';

function IconGrad() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 10 12 4 2 10l10 6 10-6Z" />
      <path d="M6 12v5c3 2 9 2 12 0v-5" />
    </svg>
  );
}
function IconHandshake() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m11 17 2 2a1 1 0 1 0 3-3" />
      <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
      <path d="m21 3 1 11h-2" />
      <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
      <path d="M3 4h8" />
    </svg>
  );
}

const ICON_MAP: Record<string, () => React.ReactElement> = {
  admissions: IconGrad,
  partnerships: IconHandshake,
};

export default function ContactInquiries() {
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
            '.contact-inq-bg',
            '.contact-inq-scan',
            '.contact-inq-glow',
            '.contact-inq-camera',
            '.contact-inq-badge',
            '.contact-inq-heading-word',
            '.contact-inq-sub',
            '.contact-inq-card',
            '.contact-inq-card-line',
            '.contact-inq-card-el',
          ],
          { opacity: 1, x: 0, y: 0, scale: 1, scaleX: 1, clearProps: 'transform' },
        );
        return;
      }

      if (!isDesktop) {
        const trigger = {
          trigger: root,
          start: 'top 78%',
          toggleActions: 'play none none reset',
        };
        gsap.fromTo('.contact-inq-badge', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, scrollTrigger: trigger });
        gsap.fromTo(
          '.contact-inq-heading-word',
          { opacity: 0, yPercent: 60, filter: 'blur(8px)' },
          { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.04, delay: 0.1, scrollTrigger: trigger },
        );
        gsap.fromTo(
          '.contact-inq-sub',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.55, delay: 0.35, scrollTrigger: trigger },
        );
        gsap.fromTo(
          '.contact-inq-card',
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.15,
            ease: 'power3.out',
            delay: 0.5,
            scrollTrigger: trigger,
          },
        );
        return;
      }

      // Desktop cinematic — pinned scrub
      gsap.set('.contact-inq-badge', { opacity: 0, y: 14 });
      gsap.set('.contact-inq-heading-word', { opacity: 0, yPercent: 70, filter: 'blur(10px)' });
      gsap.set('.contact-inq-sub', { opacity: 0, y: 18 });
      gsap.set('.contact-inq-card[data-side="left"]', { opacity: 0, xPercent: -12, y: 30 });
      gsap.set('.contact-inq-card[data-side="right"]', { opacity: 0, xPercent: 12, y: 30 });
      gsap.set('.contact-inq-card-line', { scaleX: 0, transformOrigin: 'left center' });
      gsap.set('.contact-inq-card-el', { opacity: 0, y: 16 });
      gsap.set('.contact-inq-camera', { scale: 1, transformOrigin: 'center center' });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_DURATIONS.contactInquiries,
        scrub: 1,
        enabled: true,
        invalidateOnRefresh: true,
      });

      // 0.00–0.05 Badge
      tl.to('.contact-inq-badge', { opacity: 1, y: 0, duration: 0.05, ease: 'power2.out' }, 0);

      // 0.05–0.18 Heading words
      tl.to(
        '.contact-inq-heading-word',
        { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.13, stagger: 0.025, ease: 'power3.out' },
        0.05,
      );

      // 0.18–0.28 Subhead
      tl.to('.contact-inq-sub', { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' }, 0.18);

      // 0.25–0.45 Admissions card slides in
      tl.to(
        '.contact-inq-card[data-side="left"]',
        { opacity: 1, xPercent: 0, y: 0, duration: 0.18, ease: 'power3.out' },
        0.25,
      );
      tl.to(
        '.contact-inq-card[data-side="left"] .contact-inq-card-line',
        { scaleX: 1, duration: 0.12, ease: 'power3.out' },
        0.28,
      );
      tl.to(
        '.contact-inq-card[data-side="left"] .contact-inq-card-el',
        { opacity: 1, y: 0, duration: 0.1, stagger: 0.04, ease: 'power2.out' },
        0.3,
      );

      // 0.40–0.60 Partnerships card slides in
      tl.to(
        '.contact-inq-card[data-side="right"]',
        { opacity: 1, xPercent: 0, y: 0, duration: 0.18, ease: 'power3.out' },
        0.4,
      );
      tl.to(
        '.contact-inq-card[data-side="right"] .contact-inq-card-line',
        { scaleX: 1, duration: 0.12, ease: 'power3.out' },
        0.43,
      );
      tl.to(
        '.contact-inq-card[data-side="right"] .contact-inq-card-el',
        { opacity: 1, y: 0, duration: 0.1, stagger: 0.04, ease: 'power2.out' },
        0.45,
      );

      // Parallax — continuous through pin
      tl.to('.contact-inq-bg', { yPercent: -6, scale: 1, duration: 1, ease: 'none' }, 0);
      tl.to('.contact-inq-scan', { yPercent: -22, duration: 1, ease: 'none' }, 0);
      tl.to(
        '.contact-inq-glow',
        { yPercent: -25, scale: 1.3, opacity: 0.55, duration: 1, ease: 'none' },
        0,
      );

      // 0.85–1.00 Camera pull-back
      tl.to('.contact-inq-camera', { scale: 0.96, duration: 0.15, ease: 'power2.inOut' }, 0.85);
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  const headingWords = contactInquiriesContent.heading.split(/\s+/);

  return (
    <section
      ref={sectionRef}
      id="contact-inquiries"
      aria-label="Inquiry channels"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <style>{`
        .contact-inq-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: clamp(1.25rem, 2.5vw, 2rem);
        }
        @media (max-width: 720px) {
          .contact-inq-grid { grid-template-columns: 1fr; }
        }
      `}</style>
      <div
        className="contact-inq-camera"
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
          className="contact-inq-bg"
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
          className="contact-inq-scan"
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
          className="contact-inq-glow"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '1200px',
            height: '780px',
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse, rgba(168,240,255,0.07) 0%, rgba(255,61,90,0.04) 40%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
            zIndex: 3,
            pointerEvents: 'none',
            willChange: 'transform, opacity',
          }}
        />

        {/* Inner wrapper — capped tighter so the centered heading text and
            the 2-card grid below share the same visual gutters. */}
        <div
          style={{
            position: 'relative',
            zIndex: 6,
            width: '100%',
            maxWidth: '1040px',
            marginInline: 'auto',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
            <div className="contact-inq-badge" style={{ display: 'inline-block', marginBottom: '1.25rem' }}>
              <Badge label={contactInquiriesContent.badge} />
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
                  className="contact-inq-heading-word"
                  style={{ display: 'inline-block', willChange: 'transform, opacity, filter' }}
                >
                  {word}
                </span>
              ))}
            </h2>
            <p
              className="contact-inq-sub"
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
              {contactInquiriesContent.subhead}
            </p>
          </div>

          {/* Explicit 2-col grid (not auto-fit) so the card row width is
              predictable and aligns with the centered heading above. Falls
              to 1-col below 720px via the .contact-inq-grid stylesheet. */}
          <div className="contact-inq-grid">
            {contactInquiriesContent.items.map((item, idx) => {
              const Icon = ICON_MAP[item.key] ?? IconGrad;
              const isBeam = item.accent === 'beam';
              const accentColor = isBeam ? 'var(--color-beam)' : 'var(--color-red-team)';
              const accentGlow = isBeam
                ? 'rgba(168,240,255,0.4)'
                : 'rgba(255,61,90,0.45)';
              const accentSoft = isBeam ? 'rgba(168,240,255,0.08)' : 'rgba(255,61,90,0.10)';
              const accentBorder = isBeam
                ? 'rgba(168,240,255,0.28)'
                : 'rgba(255,61,90,0.32)';

              return (
                <div
                  key={item.key}
                  className="contact-inq-card"
                  data-side={idx === 0 ? 'left' : 'right'}
                  style={{
                    position: 'relative',
                    background: 'var(--color-carbon)',
                    border: `1px solid ${accentBorder}`,
                    padding: 'clamp(1.5rem, 2.5vw, 2.25rem)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem',
                    willChange: 'transform, opacity',
                    transition: 'transform 0.25s, border-color 0.25s, box-shadow 0.25s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.4), 0 0 24px ${accentGlow}`;
                    e.currentTarget.style.borderColor = accentColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = accentBorder;
                  }}
                >
                  {/* Accent line — scrubs in during pin */}
                  <div
                    aria-hidden="true"
                    className="contact-inq-card-line"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: `linear-gradient(to right, transparent, ${accentColor}, transparent)`,
                      transformOrigin: 'left center',
                      willChange: 'transform',
                    }}
                  />

                  <div className="contact-inq-card-el" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <span
                      aria-hidden="true"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '46px',
                        height: '46px',
                        background: accentSoft,
                        border: `1px solid ${accentBorder}`,
                        color: accentColor,
                        flexShrink: 0,
                      }}
                    >
                      <Icon />
                    </span>
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.4rem',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--color-text-primary)',
                        margin: 0,
                      }}
                    >
                      {item.title}
                    </h3>
                  </div>

                  <p
                    className="contact-inq-card-el"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    {item.description}
                  </p>

                  <ul
                    className="contact-inq-card-el"
                    style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.6rem',
                    }}
                  >
                    {item.bullets.map((b) => (
                      <li
                        key={b}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.6rem',
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--text-sm)',
                          color: 'var(--color-text-tertiary)',
                        }}
                      >
                        <span
                          aria-hidden="true"
                          style={{
                            color: accentColor,
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                            marginTop: '2px',
                          }}
                        >
                          ▸
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={item.cta.href}
                    className="contact-inq-card-el"
                    style={{
                      marginTop: 'auto',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.55rem',
                      padding: '0.95rem 1.5rem',
                      background: isBeam ? 'transparent' : accentColor,
                      color: isBeam ? accentColor : '#fff',
                      border: `1px solid ${accentColor}`,
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      fontWeight: 600,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      transition: 'background 0.25s, color 0.25s, box-shadow 0.25s',
                      boxShadow: isBeam ? 'none' : `0 0 20px ${accentGlow}`,
                    }}
                    onMouseEnter={(e) => {
                      if (isBeam) {
                        e.currentTarget.style.background = accentColor;
                        e.currentTarget.style.color = 'var(--color-void)';
                        e.currentTarget.style.boxShadow = `0 0 24px ${accentGlow}`;
                      } else {
                        e.currentTarget.style.boxShadow = `0 0 32px ${accentGlow}`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (isBeam) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = accentColor;
                        e.currentTarget.style.boxShadow = 'none';
                      } else {
                        e.currentTarget.style.boxShadow = `0 0 20px ${accentGlow}`;
                      }
                    }}
                  >
                    {item.cta.label}
                    <span aria-hidden="true">›</span>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
