'use client';
/* Contact Form — pinned cinematic scene (Act II of /contact).
 *
 * 350% pin. Full-width single-column form (no info sidebar — that
 * content is covered by the Map section, Footer, and Inquiry CTAs).
 * Beats (0–1):
 *
 *   0.00–0.05  Section heading rises
 *   0.05–0.20  Form card slides in from below, beam expands across top
 *   0.15–0.45  Form fields stagger-fade in (Name/Email → Phone/Subject → Message → error → Send)
 *   0.45–0.80  Hold + parallax drift
 *   0.80–1.00  Camera pulls back (scale 0.96) into next act
 *
 * Three parallax layers drift through the entire pin (bg grid, scan
 * lines, central glow pool).
 */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { ContactForm } from '../components/ContactForm';
import { contactFormContent } from '@/content/contact/form';

export default function ContactFormSection() {
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
            '.contact-form-bg',
            '.contact-form-scan',
            '.contact-form-glow',
            '.contact-form-camera',
            '.contact-form-card',
            '.contact-form-heading',
            '.contact-form-field-row',
            '.contact-form-msg',
            '.contact-form-submit',
          ],
          { opacity: 1, x: 0, y: 0, scale: 1, clearProps: 'transform' },
        );
        return;
      }

      // Mobile — non-pinned reveal
      if (!isDesktop) {
        const trigger = {
          trigger: root,
          start: 'top 80%',
          toggleActions: 'play none none reset',
        };
        gsap.fromTo(
          '.contact-form-card',
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: trigger },
        );
        gsap.fromTo(
          '.contact-form-heading',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, delay: 0.2, scrollTrigger: trigger },
        );
        gsap.fromTo(
          '.contact-form-field-row, .contact-form-msg, .contact-form-submit',
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power2.out',
            delay: 0.35,
            scrollTrigger: trigger,
          },
        );
        return;
      }

      // Desktop cinematic — pinned scrub
      gsap.set('.contact-form-card', { opacity: 0, y: 40 });
      gsap.set('.contact-form-heading', { opacity: 0, y: 24, filter: 'blur(8px)' });
      gsap.set('.contact-form-field-row, .contact-form-msg, .contact-form-submit', {
        opacity: 0,
        y: 18,
      });
      gsap.set('.contact-form-camera', { scale: 1, transformOrigin: 'center center' });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_DURATIONS.contactForm,
        scrub: 1,
        enabled: true,
        invalidateOnRefresh: true,
      });

      // 0.00–0.05 Card lifts into view
      tl.to(
        '.contact-form-card',
        { opacity: 1, y: 0, duration: 0.1, ease: 'power3.out' },
        0,
      );

      // 0.05–0.15 Heading rises with blur clear
      tl.to(
        '.contact-form-heading',
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.1, ease: 'power3.out' },
        0.05,
      );

      // 0.15–0.45 Field rows stagger in (3 rows: Name/Email, Phone/Subject, Message)
      tl.to(
        '.contact-form-field-row',
        { opacity: 1, y: 0, duration: 0.12, stagger: 0.08, ease: 'power2.out' },
        0.15,
      );
      tl.to('.contact-form-msg', { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0.36);
      tl.to('.contact-form-submit', { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' }, 0.4);

      // Parallax — continuous through pin
      tl.to('.contact-form-bg', { yPercent: -6, scale: 1, duration: 1, ease: 'none' }, 0);
      tl.to('.contact-form-scan', { yPercent: -18, duration: 1, ease: 'none' }, 0);
      tl.to(
        '.contact-form-glow',
        { yPercent: -30, scale: 1.25, opacity: 0.7, duration: 1, ease: 'none' },
        0,
      );

      // 0.80–1.00 Camera pull-back
      tl.to('.contact-form-camera', { scale: 0.96, duration: 0.2, ease: 'power2.inOut' }, 0.8);
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="contact-form"
      aria-label="Send us a message"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      {/* Local responsive form-field row CSS */}
      <style>{`
        .contact-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        @media (max-width: 640px) {
          .contact-form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div
        className="contact-form-camera"
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
        {/* L0 grid */}
        <div
          aria-hidden="true"
          className="contact-form-bg"
          style={{
            position: 'absolute',
            inset: '-8%',
            zIndex: 1,
            transform: 'scale(1.04)',
            opacity: 0.6,
            pointerEvents: 'none',
            willChange: 'transform',
          }}
        />
        {/* L1 scan lines */}
        <div
          aria-hidden="true"
          className="contact-form-scan"
          style={{
            position: 'absolute',
            inset: '-5%',
            zIndex: 2,
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.015) 3px, rgba(255,255,255,0.015) 4px)',
            pointerEvents: 'none',
            willChange: 'transform',
          }}
        />
        {/* L2 glow pool */}
        <div
          aria-hidden="true"
          className="contact-form-glow"
          style={{
            position: 'absolute',
            top: '55%',
            left: '50%',
            width: '1200px',
            height: '800px',
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse, rgba(168,240,255,0.06) 0%, rgba(168,240,255,0.02) 45%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
            zIndex: 3,
            pointerEvents: 'none',
            willChange: 'transform, opacity',
          }}
        />

        {/* Inner wrapper — full-width single-column form */}
        <div
          style={{
            position: 'relative',
            zIndex: 6,
            width: '100%',
            maxWidth: '1280px',
            marginInline: 'auto',
          }}
        >
          <div
            className="contact-form-card"
            style={{
              position: 'relative',
              background: 'var(--color-carbon)',
              border: '1px solid rgba(168,240,255,0.12)',
              padding: 'clamp(1.75rem, 3.5vw, 3rem)',
              willChange: 'transform, opacity',
            }}
          >
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
              }}
            />
            <h2
              className="contact-form-heading"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 3.4vw, 2.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                textTransform: 'uppercase',
                color: 'var(--color-text-primary)',
                margin: '0 0 2rem',
                lineHeight: 1.1,
                willChange: 'transform, opacity, filter',
              }}
            >
              {contactFormContent.heading}
            </h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
