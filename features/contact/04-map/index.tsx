'use client';
/* Contact Map — pinned cinematic scene (Act IV of /contact).
 *
 * 400% pin. The map is the "image" of the page — it gets the biggest
 * transform-and-zoom move. Address panel drops in from the left while
 * the iframe zooms out from a deep scale (0.7 → 1.05 → 1.0) and rotates
 * 1° as if a satellite is centering on the pin.
 *
 *   0.00–0.05  Badge rises
 *   0.05–0.20  Heading per-word reveal
 *   0.18–0.28  Subhead fades up
 *   0.20–0.50  Map iframe zooms out from 0.7 → 1.05 (long beat)
 *   0.30–0.45  Address panel slides in from left, beam line draws
 *   0.40–0.55  Address inner lines stagger (HQ → address → hours → CTA)
 *   0.50–0.62  Map settles to scale 1.0
 *   0.60–0.85  Hold + parallax drift
 *   0.85–1.00  Camera pull-back
 *
 * Three parallax layers + a vignette + a top scan beam.
 */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { Badge } from '@/components/ui/Badge';
import { contactMapContent } from '@/content/contact/map';

export default function ContactMap() {
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
            '.contact-map-bg',
            '.contact-map-scan',
            '.contact-map-glow',
            '.contact-map-camera',
            '.contact-map-badge',
            '.contact-map-heading-word',
            '.contact-map-sub',
            '.contact-map-panel',
            '.contact-map-panel-line',
            '.contact-map-panel-el',
            '.contact-map-frame',
            '.contact-map-iframe-wrap',
          ],
          { opacity: 1, x: 0, y: 0, scale: 1, scaleX: 1, rotate: 0, clearProps: 'transform' },
        );
        return;
      }

      if (!isDesktop) {
        const trigger = {
          trigger: root,
          start: 'top 80%',
          toggleActions: 'play none none reset',
        };
        gsap.fromTo('.contact-map-badge', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, scrollTrigger: trigger });
        gsap.fromTo(
          '.contact-map-heading-word',
          { opacity: 0, yPercent: 60, filter: 'blur(8px)' },
          { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.65, stagger: 0.04, delay: 0.1, scrollTrigger: trigger },
        );
        gsap.fromTo(
          '.contact-map-sub',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.55, delay: 0.35, scrollTrigger: trigger },
        );
        gsap.fromTo(
          '.contact-map-panel',
          { opacity: 0, x: -24 },
          { opacity: 1, x: 0, duration: 0.7, delay: 0.5, ease: 'power3.out', scrollTrigger: trigger },
        );
        gsap.fromTo(
          '.contact-map-frame',
          { opacity: 0, scale: 0.92 },
          { opacity: 1, scale: 1, duration: 0.8, delay: 0.6, ease: 'power3.out', scrollTrigger: trigger },
        );
        return;
      }

      // Desktop cinematic — pinned scrub
      gsap.set('.contact-map-badge', { opacity: 0, y: 14 });
      gsap.set('.contact-map-heading-word', { opacity: 0, yPercent: 70, filter: 'blur(10px)' });
      gsap.set('.contact-map-sub', { opacity: 0, y: 18 });
      gsap.set('.contact-map-panel', { opacity: 0, xPercent: -12, y: 30 });
      gsap.set('.contact-map-panel-line', { scaleX: 0, transformOrigin: 'left center' });
      gsap.set('.contact-map-panel-el', { opacity: 0, y: 16 });
      gsap.set('.contact-map-frame', { opacity: 0, scale: 0.96 });
      gsap.set('.contact-map-iframe-wrap', { scale: 0.7, rotate: -1, transformOrigin: 'center center' });
      gsap.set('.contact-map-camera', { scale: 1, transformOrigin: 'center center' });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_DURATIONS.contactMap,
        scrub: 1,
        enabled: true,
        invalidateOnRefresh: true,
      });

      // 0.00–0.05 Badge
      tl.to('.contact-map-badge', { opacity: 1, y: 0, duration: 0.05, ease: 'power2.out' }, 0);

      // 0.05–0.20 Heading words
      tl.to(
        '.contact-map-heading-word',
        { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.15, stagger: 0.03, ease: 'power3.out' },
        0.05,
      );

      // 0.18–0.28 Subhead
      tl.to('.contact-map-sub', { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' }, 0.18);

      // 0.20–0.55 Map iframe zoom (long cinematic beat — the page's "image")
      tl.to('.contact-map-frame', { opacity: 1, scale: 1, duration: 0.1, ease: 'power2.out' }, 0.2);
      tl.to(
        '.contact-map-iframe-wrap',
        { scale: 1.05, rotate: 0, duration: 0.3, ease: 'power2.out' },
        0.2,
      );
      tl.to(
        '.contact-map-iframe-wrap',
        { scale: 1.0, duration: 0.1, ease: 'power2.inOut' },
        0.52,
      );

      // 0.30–0.45 Panel slides in
      tl.to(
        '.contact-map-panel',
        { opacity: 1, xPercent: 0, y: 0, duration: 0.15, ease: 'power3.out' },
        0.3,
      );
      tl.to(
        '.contact-map-panel-line',
        { scaleX: 1, duration: 0.12, ease: 'power3.out' },
        0.33,
      );
      tl.to(
        '.contact-map-panel-el',
        { opacity: 1, y: 0, duration: 0.1, stagger: 0.05, ease: 'power2.out' },
        0.4,
      );

      // Parallax — continuous
      tl.to('.contact-map-bg', { yPercent: -7, scale: 1, duration: 1, ease: 'none' }, 0);
      tl.to('.contact-map-scan', { yPercent: -25, duration: 1, ease: 'none' }, 0);
      tl.to(
        '.contact-map-glow',
        { yPercent: -30, scale: 1.3, opacity: 0.55, duration: 1, ease: 'none' },
        0,
      );

      // 0.85–1.00 Camera pull-back
      tl.to('.contact-map-camera', { scale: 0.96, duration: 0.15, ease: 'power2.inOut' }, 0.85);
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  const headingWords = contactMapContent.heading.split(/\s+/);

  return (
    <section
      ref={sectionRef}
      id="contact-map"
      aria-label="Find our office"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <style>{`
        .contact-map-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.45fr);
          gap: clamp(1.5rem, 3vw, 2.25rem);
          align-items: stretch;
        }
        .contact-map-grid > .contact-map-frame {
          min-height: 420px;
        }
        @media (max-width: 900px) {
          .contact-map-grid {
            grid-template-columns: 1fr;
          }
          .contact-map-grid > .contact-map-frame {
            min-height: 320px;
          }
        }
      `}</style>
      <div
        className="contact-map-camera"
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
          className="contact-map-bg grid-atmosphere"
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
          className="contact-map-scan"
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
          className="contact-map-glow"
          style={{
            position: 'absolute',
            top: '55%',
            left: '50%',
            width: '1200px',
            height: '800px',
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse, rgba(168,240,255,0.07) 0%, rgba(168,240,255,0.02) 45%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
            zIndex: 3,
            pointerEvents: 'none',
            willChange: 'transform, opacity',
          }}
        />

        {/* Inner wrapper — capped tighter so the centered heading text and
            the 2-col panel/map grid below share the same visual gutters. */}
        <div
          style={{
            position: 'relative',
            zIndex: 6,
            width: '100%',
            maxWidth: '1100px',
            marginInline: 'auto',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
            <div className="contact-map-badge" style={{ display: 'inline-block', marginBottom: '1.25rem' }}>
              <Badge label={contactMapContent.badge} />
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
                  className="contact-map-heading-word"
                  style={{ display: 'inline-block', willChange: 'transform, opacity, filter' }}
                >
                  {word}
                </span>
              ))}
            </h2>
            <p
              className="contact-map-sub"
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
              {contactMapContent.subhead}
            </p>
          </div>

          {/* CSS-driven responsive grid — avoids the JS useMediaQuery
              hydration race that was leaving the map stacked under the
              address panel on desktop. */}
          <div className="contact-map-grid">
            <div
              className="contact-map-panel"
              style={{
                position: 'relative',
                background: 'var(--color-carbon)',
                border: '1px solid rgba(168,240,255,0.12)',
                padding: 'clamp(1.5rem, 2.5vw, 2.25rem)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                willChange: 'transform, opacity',
              }}
            >
              <div
                aria-hidden="true"
                className="contact-map-panel-line"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background:
                    'linear-gradient(to right, transparent, var(--color-beam), var(--color-beam-glow), transparent)',
                  transformOrigin: 'left center',
                  willChange: 'transform',
                }}
              />

              <div className="contact-map-panel-el" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span
                  aria-hidden="true"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '42px',
                    height: '42px',
                    background: 'rgba(255,61,90,0.12)',
                    border: '1px solid rgba(255,61,90,0.3)',
                    color: 'var(--color-red-team)',
                    flexShrink: 0,
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 22s-7-5-7-12a7 7 0 0 1 14 0c0 7-7 12-7 12Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: 'var(--color-text-primary)',
                    margin: 0,
                  }}
                >
                  CyCraft HQ — Bangalore
                </h3>
              </div>

              <div className="contact-map-panel-el">
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--color-text-tertiary)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Address
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-base)',
                    color: 'var(--color-text-primary)',
                    lineHeight: 1.55,
                  }}
                >
                  {contactMapContent.address.line1}
                  <br />
                  {contactMapContent.address.line2}
                </div>
              </div>

              <div className="contact-map-panel-el">
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--color-text-tertiary)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Office Hours
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.55,
                  }}
                >
                  {contactMapContent.hours}
                </div>
              </div>

              <a
                className="contact-map-panel-el"
                href={contactMapContent.directionsHref}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  marginTop: 'auto',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.55rem',
                  padding: '0.95rem 1.5rem',
                  background: 'transparent',
                  color: 'var(--color-beam)',
                  border: '1px solid var(--color-beam)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'background 0.25s, color 0.25s, box-shadow 0.25s',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.background = 'var(--color-beam)';
                  el.style.color = 'var(--color-void)';
                  el.style.boxShadow = '0 0 24px var(--color-beam-glow)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.background = 'transparent';
                  el.style.color = 'var(--color-beam)';
                  el.style.boxShadow = 'none';
                }}
              >
                Get Directions
                <span aria-hidden="true">›</span>
              </a>
            </div>

            {/* Map iframe — wrapped so we can scale/rotate the wrap without distorting the iframe */}
            <div
              className="contact-map-frame"
              style={{
                position: 'relative',
                border: '1px solid rgba(168,240,255,0.12)',
                overflow: 'hidden',
                willChange: 'transform, opacity',
              }}
            >
              <div
                className="contact-map-iframe-wrap"
                style={{
                  position: 'absolute',
                  inset: 0,
                  willChange: 'transform',
                }}
              >
                <iframe
                  src={contactMapContent.embedSrc}
                  title="CyCraft office location"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    border: 0,
                    filter:
                      'invert(0.92) hue-rotate(180deg) brightness(0.92) contrast(0.95) saturate(0.85)',
                  }}
                />
              </div>
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background:
                    'linear-gradient(to right, transparent, var(--color-beam), var(--color-beam-glow), transparent)',
                  zIndex: 1,
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
