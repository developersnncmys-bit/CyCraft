'use client';
/* Download Certificate Retrieval — pinned cinematic email-lookup form.
 *
 * Sits between Hero and Categories. Honors the EthicalByte reference site's
 * "Download Your Certificate" feature (email → certificate link) while the
 * rest of the page satisfies PRD §3.6 (resource library).
 *
 * 250% pin. Beats (0–1):
 *   0.00–0.05  Top scan beam draws across
 *   0.00–0.18  Heading words stagger up from blur
 *   0.18–0.30  Sub-heading + description fade in
 *   0.30–0.50  Form card slides up, input glows in
 *   0.50–0.62  Submit button settles
 *   0.62–0.78  Footnote + verify link fade in
 *   0.78–0.92  Decorative beam glow pool intensifies
 *   0.92–1.00  Camera pulls back to release into Categories
 *
 * Form behaviour: client-side validation only (no backend). On valid email
 * the success state shows a confirmation message. Real submission will
 * wire up to the LMS Certificate Management API (PRD §4.5.5 / §5.2 admin
 * controls).
 */
import { useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { Badge } from '@/components/ui/Badge';
import { downloadCertificateContent } from '@/content/download/certificate';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function DownloadCertificate() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();

  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'success' | 'error'>('idle');

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setState('error');
      return;
    }
    setState('success');
  };

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      if (reducedMotion) {
        gsap.set(
          [
            '.download-cert-word',
            '.download-cert-sub',
            '.download-cert-desc',
            '.download-cert-card',
            '.download-cert-input',
            '.download-cert-submit',
            '.download-cert-footnote',
            '.download-cert-scan',
            '.download-cert-glow',
          ],
          { opacity: 1, y: 0, scaleX: 1, scale: 1, filter: 'none' },
        );
        return;
      }

      if (!isDesktop) {
        const trigger = {
          trigger: root,
          start: 'top 80%',
          toggleActions: 'play none none reset',
        } as ScrollTrigger.Vars;
        gsap.fromTo(
          '.download-cert-word',
          { opacity: 0, yPercent: 60, filter: 'blur(8px)' },
          { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.04, scrollTrigger: trigger },
        );
        gsap.fromTo(
          '.download-cert-sub, .download-cert-desc',
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, delay: 0.3, scrollTrigger: trigger },
        );
        gsap.fromTo(
          '.download-cert-card',
          { opacity: 0, y: 30, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7, delay: 0.45, ease: 'power3.out', scrollTrigger: trigger },
        );
        gsap.fromTo(
          '.download-cert-footnote',
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, delay: 0.7, scrollTrigger: trigger },
        );
        return;
      }

      gsap.set('.download-cert-word', { opacity: 0, yPercent: 70, filter: 'blur(10px)' });
      gsap.set(['.download-cert-sub', '.download-cert-desc'], { opacity: 0, y: 16 });
      gsap.set('.download-cert-card', { opacity: 0, y: 40, scale: 0.95 });
      gsap.set('.download-cert-input', { opacity: 0, x: -12 });
      gsap.set('.download-cert-submit', { opacity: 0, scale: 0.94 });
      gsap.set('.download-cert-footnote', { opacity: 0, y: 12 });
      gsap.set('.download-cert-scan', { scaleX: 0, transformOrigin: 'left center' });
      gsap.set('.download-cert-glow', { opacity: 0.25, scale: 1 });
      gsap.set('.download-cert-camera', { scale: 1, transformOrigin: 'center center' });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_DURATIONS.downloadCertificate,
        scrub: 1,
        enabled: true,
      });

      tl.to('.download-cert-scan', { scaleX: 1, duration: 0.18, ease: 'power3.out' }, 0.02);
      tl.to(
        '.download-cert-word',
        { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.18, stagger: 0.035, ease: 'power3.out' },
        0.00,
      );
      tl.to('.download-cert-sub', { opacity: 1, y: 0, duration: 0.10, ease: 'power2.out' }, 0.20);
      tl.to('.download-cert-desc', { opacity: 1, y: 0, duration: 0.10, ease: 'power2.out' }, 0.25);
      tl.to(
        '.download-cert-card',
        { opacity: 1, y: 0, scale: 1, duration: 0.18, ease: 'power3.out' },
        0.32,
      );
      tl.to('.download-cert-input', { opacity: 1, x: 0, duration: 0.12, ease: 'power2.out' }, 0.40);
      tl.to(
        '.download-cert-submit',
        { opacity: 1, scale: 1, duration: 0.12, ease: 'back.out(1.6)' },
        0.50,
      );
      tl.to('.download-cert-footnote', { opacity: 1, y: 0, duration: 0.12, ease: 'power2.out' }, 0.62);

      tl.to(
        '.download-cert-glow',
        { opacity: 0.55, scale: 1.15, duration: 0.18, ease: 'power2.inOut' },
        0.78,
      );
      tl.to('.download-cert-camera', { scale: 0.97, duration: 0.08, ease: 'power2.inOut' }, 0.92);
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  const headingWords = downloadCertificateContent.heading.trim().split(/\s+/).filter(Boolean);
  const isError = state === 'error';
  const isSuccess = state === 'success';

  return (
    <section
      ref={sectionRef}
      id="download-certificate"
      aria-label={downloadCertificateContent.heading}
      style={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        background:
          'radial-gradient(ellipse at center, rgba(168,240,255,0.08) 0%, rgba(13,16,20,0.4) 35%, var(--color-void) 80%)',
      }}
    >
      <style>{`
        @media (max-width: 767px) {
          #download-certificate         { min-height: auto !important; }
          .download-cert-camera         {
            min-height: auto !important;
            justify-content: flex-start !important;
            padding-top: clamp(4rem, 10vh, 7rem) !important;
            padding-bottom: clamp(4rem, 10vh, 7rem) !important;
          }
        }
        .download-cert-input-el:focus {
          border-color: var(--color-beam) !important;
          box-shadow: 0 0 18px rgba(168,240,255,0.18) !important;
          outline: none !important;
        }
      `}</style>

      <div
        className="download-cert-glow"
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '1100px',
          height: '720px',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse, rgba(168,240,255,0.20) 0%, rgba(168,240,255,0.05) 40%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          zIndex: 0,
          pointerEvents: 'none',
          willChange: 'transform, opacity',
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.015) 3px, rgba(255,255,255,0.015) 4px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <div
        aria-hidden="true"
        className="download-cert-scan"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background:
            'linear-gradient(to right, transparent, rgba(168,240,255,0.7), transparent)',
          boxShadow: '0 0 14px var(--color-beam-glow)',
          transformOrigin: 'left center',
          zIndex: 10,
          pointerEvents: 'none',
          willChange: 'transform',
        }}
      />

      <div
        className="download-cert-camera"
        style={{
          position: 'relative',
          zIndex: 2,
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
          className="section-container"
          style={{ textAlign: 'center', maxWidth: '720px', marginInline: 'auto' }}
        >
          <div style={{ display: 'inline-block', marginBottom: '1.5rem' }}>
            <Badge label={downloadCertificateContent.badge} />
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 4vw, 3rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              color: 'var(--color-text-primary)',
              margin: '0 0 1rem',
              lineHeight: 1.1,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0.3em',
            }}
          >
            {headingWords.map((word, i) => (
              <span
                key={`${word}-${i}`}
                className="download-cert-word"
                style={{
                  display: 'inline-block',
                  color: word.toLowerCase() === 'certificate' ? 'var(--color-beam)' : undefined,
                  textShadow:
                    word.toLowerCase() === 'certificate'
                      ? '0 0 24px var(--color-beam-glow)'
                      : undefined,
                  willChange: 'transform, opacity, filter',
                }}
              >
                {word}
              </span>
            ))}
          </h2>

          <p
            className="download-cert-sub"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              letterSpacing: '0.18em',
              color: 'var(--color-beam)',
              textTransform: 'uppercase',
              margin: '0 0 1.25rem',
            }}
          >
            {downloadCertificateContent.subheading}
          </p>

          <p
            className="download-cert-desc"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-base)',
              color: 'var(--color-text-secondary)',
              margin: '0 auto 2.5rem',
              lineHeight: 1.65,
              maxWidth: '560px',
            }}
          >
            {downloadCertificateContent.description}
          </p>

          {/* Form card */}
          <form
            className="download-cert-card"
            onSubmit={onSubmit}
            noValidate
            style={{
              position: 'relative',
              padding: 'clamp(1.5rem, 3vw, 2.25rem)',
              background: 'rgba(13,16,20,0.7)',
              border: '1px solid rgba(168,240,255,0.2)',
              boxShadow: '0 18px 48px rgba(0,0,0,0.55), 0 0 32px rgba(168,240,255,0.06)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              willChange: 'transform, opacity',
            }}
          >
            <label
              htmlFor="download-cert-email"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.22em',
                color: 'var(--color-text-tertiary)',
                textTransform: 'uppercase',
                textAlign: 'left',
              }}
            >
              Email Address
            </label>

            <input
              id="download-cert-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (state !== 'idle') setState('idle');
              }}
              placeholder={downloadCertificateContent.emailPlaceholder}
              aria-invalid={isError}
              aria-describedby={isError ? 'download-cert-error' : isSuccess ? 'download-cert-success' : undefined}
              className="download-cert-input download-cert-input-el"
              style={{
                width: '100%',
                padding: '0.95rem 1.1rem',
                background: 'rgba(5,6,8,0.7)',
                border: `1px solid ${isError ? 'var(--color-red-team)' : 'rgba(168,240,255,0.2)'}`,
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
                letterSpacing: '0.02em',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                willChange: 'transform, opacity',
              }}
            />

            <button
              type="submit"
              className="download-cert-submit"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                padding: '1rem 1.5rem',
                background: 'var(--color-beam)',
                color: 'var(--color-void)',
                border: '1px solid var(--color-beam)',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: '0 0 28px rgba(77,217,255,0.4)',
                transition: 'transform 0.25s, box-shadow 0.25s',
                willChange: 'transform, opacity',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.transform = 'translateY(-2px)';
                el.style.boxShadow = '0 0 40px rgba(77,217,255,0.6)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = '0 0 28px rgba(77,217,255,0.4)';
              }}
            >
              {downloadCertificateContent.submitLabel}
              <span aria-hidden="true">›</span>
            </button>

            {isError && (
              <p
                id="download-cert-error"
                role="alert"
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                  color: 'var(--color-red-team-glow)',
                  textAlign: 'left',
                }}
              >
                {downloadCertificateContent.errorMessage}
              </p>
            )}

            {isSuccess && (
              <p
                id="download-cert-success"
                role="status"
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                  color: 'var(--color-terminal)',
                  textAlign: 'left',
                }}
              >
                {'> '}
                {downloadCertificateContent.successMessage}
              </p>
            )}
          </form>

          <p
            className="download-cert-footnote"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-tertiary)',
              margin: '1.75rem 0 0',
              lineHeight: 1.5,
            }}
          >
            {downloadCertificateContent.footnote}{' '}
            <Link
              href={downloadCertificateContent.verifyLink.href}
              style={{
                color: 'var(--color-beam)',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
              }}
            >
              {downloadCertificateContent.verifyLink.label}
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
