'use client';
/* Final CTA + Footer — Act VI, Section 21 of 22 — THE CONVERGENCE.
 * Film-mode: pinned ~120vh. Red+blue beams arc inward to a convergence
 * glow → headline materialises → button forms. Pin is intentionally shorter
 * than other sections to avoid a blank scroll tail at end of document. */
import { useRef, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap/register';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { ctaFooterContent } from '@/content/cta-footer';
import { useFilmReveal } from '@/lib/gsap/filmReveal';

const ApplyModal = dynamic(() => import('@/features/22-apply-modal'), { ssr: false });

export default function CTAFooterSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useFilmReveal(sectionRef, { pin: '+=120%' });

  // Beam convergence — plays once on section enter (non-scrub), separate from
  // the film-mode scrub timeline so it can use back.out and other elastic
  // eases for the dramatic CTA payoff moment.
  useGSAP(
    () => {
      const container = sectionRef.current;
      if (!container) return;
      const redBeam = container.querySelector<HTMLElement>('.cta-red-beam-el');
      const blueBeam = container.querySelector<HTMLElement>('.cta-blue-beam-el');
      const convergeGlow = container.querySelector<HTMLElement>('.cta-converge-glow-el');

      if (redBeam) gsap.set(redBeam, { opacity: 0, scaleY: 0, transformOrigin: 'top right' });
      if (blueBeam) gsap.set(blueBeam, { opacity: 0, scaleY: 0, transformOrigin: 'top left' });
      if (convergeGlow) gsap.set(convergeGlow, { opacity: 0, scale: 0 });

      gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top 75%',
          toggleActions: 'play none none reset',
        },
      })
        .to(redBeam, { opacity: 0.9, scaleY: 1, duration: 0.9, ease: 'power2.out' }, 0)
        .to(blueBeam, { opacity: 0.9, scaleY: 1, duration: 0.9, ease: 'power2.out' }, 0)
        .to(convergeGlow, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)' }, 0.5)
        .to(redBeam, { opacity: 0.4, duration: 0.6, ease: 'power2.inOut' }, 0.8)
        .to(blueBeam, { opacity: 0.4, duration: 0.6, ease: 'power2.inOut' }, 0.8);
    },
    { scope: sectionRef },
  );

  return (
    <>
      <SectionWrapper ref={sectionRef} id="cta" act={6}>
        <style>{`
          .cta-content-wrap-el {
            padding-bottom: clamp(9rem, 20vh, 12rem) !important;
          }
          @media (max-width: 768px) {
            .cta-content-wrap-el {
              padding-bottom: clamp(11rem, 28vh, 14rem) !important;
            }
          }
        `}</style>

        <div
          className="film-bg-deep"
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '-10%',
            zIndex: 0,
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(168,240,255,0.18), transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(255,61,90,0.06), transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(61,168,255,0.06), transparent 55%)',
            pointerEvents: 'none',
          }}
        />
        <div
          className="film-bg-mid"
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '-5%',
            zIndex: 0,
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 6px, rgba(168,240,255,0.025) 6px, rgba(168,240,255,0.025) 7px)',
            pointerEvents: 'none',
          }}
        />

        <div
          className="film-camera cta-camera-el"
          style={{
            position: 'absolute',
            inset: 0,
            transformOrigin: 'center center',
            willChange: 'transform',
          }}
        >
          {/* Vignette */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse at center, transparent 20%, var(--color-void) 80%)',
              zIndex: 2, pointerEvents: 'none',
            }}
          />

          {/* Red beam */}
          <div
            className="cta-red-beam-el"
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '10%',
              left: '20%',
              width: '2px',
              height: '40%',
              background: 'linear-gradient(to bottom, transparent, var(--color-red-team))',
              boxShadow: '0 0 12px var(--color-red-team-glow)',
              transform: 'rotate(35deg)',
              opacity: 0,
              zIndex: 1,
              willChange: 'transform, opacity',
            }}
          />

          {/* Blue beam */}
          <div
            className="cta-blue-beam-el"
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '10%',
              right: '20%',
              width: '2px',
              height: '40%',
              background: 'linear-gradient(to bottom, transparent, var(--color-blue-team))',
              boxShadow: '0 0 12px var(--color-blue-team-glow)',
              transform: 'rotate(-35deg)',
              opacity: 0,
              zIndex: 1,
              willChange: 'transform, opacity',
            }}
          />

          {/* Convergence glow */}
          <div
            className="cta-converge-glow-el"
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'clamp(280px, 70vw, 600px)',
              height: 'clamp(180px, 40vw, 300px)',
              maxWidth: '100vw',
              background: 'radial-gradient(ellipse, rgba(168,240,255,0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
              zIndex: 2,
              willChange: 'transform, opacity',
              opacity: 0,
            }}
          />

          <div
            className="cta-content-wrap-el"
            style={{
              position: 'relative', zIndex: 3,
              minHeight: '100vh',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              textAlign: 'center',
              paddingInline: 'var(--section-padding)',
              paddingTop: 'clamp(4rem, 7vh, 5rem)',
              paddingBottom: 'clamp(2rem, 4vh, 3rem)',
              gap: '1.5rem',
            }}
          >
            <h2
              className="film-fade cta-headline-el"
              data-at="0.30"
              data-dur="0.20"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 3.5vw, 3rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: 'var(--color-text-primary)',
                maxWidth: '800px',
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              {ctaFooterContent.heading}
            </h2>

            <p
              className="film-fade cta-desc-el"
              data-at="0.45"
              data-dur="0.15"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-lg)',
                color: 'var(--color-text-secondary)',
                maxWidth: '480px',
                margin: 0,
                lineHeight: 1.55,
              }}
            >
              {ctaFooterContent.description}
            </p>

            <button
              className="film-fade cta-btn-el"
              data-at="0.58"
              data-dur="0.16"
              onClick={() => setModalOpen(true)}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-base)',
                letterSpacing: '0.2em',
                color: 'var(--color-void)',
                background: 'var(--color-beam)',
                border: 'none',
                padding: '1rem 2.5rem',
                cursor: 'pointer',
                textTransform: 'uppercase',
                animation: 'glow-pulse 3s ease-in-out infinite',
                position: 'relative',
              }}
            >
              {ctaFooterContent.cta.label}
              <span
                aria-hidden="true"
                style={{
                  display: 'inline-block',
                  marginLeft: '0.4em',
                  animation: 'cursor-blink 1s step-end infinite',
                }}
              >
                ▮
              </span>
            </button>

            <p
              className="film-fade cta-disclaimer-el"
              data-at="0.74"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-disabled)',
                maxWidth: '480px',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {ctaFooterContent.disclaimer}
            </p>
          </div>
        </div>

        {/* Footer — outside camera so it stays at section bottom */}
        <footer
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 4,
            borderTop: '1px solid rgba(168,240,255,0.06)',
            padding: '1.25rem var(--section-padding)',
            background: 'var(--color-void)',
          }}
        >
          <div
            className="section-container"
            style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              {/* Brand mark — replaces the prior 'CyCraft' mono-text label. */}
              <Image
                src="/logo.png"
                alt="CyCraft"
                width={1700}
                height={1269}
                sizes="120px"
                style={{ height: '80px', width: 'auto', display: 'block', flexShrink: 0 }}
              />
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-text-disabled)', margin: 0, maxWidth: '280px', lineHeight: 1.5 }}>
                {ctaFooterContent.footer.address}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                {ctaFooterContent.footer.links.map((l) => (
                  <a key={l.label} href={l.href} style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', letterSpacing: '0.1em', textDecoration: 'none' }}>
                    {l.label}
                  </a>
                ))}
              </div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--color-text-disabled)', margin: 0, letterSpacing: '0.08em' }}>
                {ctaFooterContent.footer.copyright}
              </p>
            </div>
          </div>
        </footer>
      </SectionWrapper>

      <ApplyModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
