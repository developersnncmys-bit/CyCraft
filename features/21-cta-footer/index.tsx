'use client';
/* Final CTA + Footer — Act VI, Section 21 of 22 — THE CONVERGENCE
 * Red + blue beams arc inward to meet at the APPLY button location; headline
 * materialises; button forms from the converged beam point. Played once on
 * enter (NOT pinned): as the last section, a scrub-pin left a post-pin
 * duplicate of the content, so this settles as a single clean final screen. */
import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap/register';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { ctaFooterContent } from '@/content/cta-footer';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';

const ApplyModal = dynamic(() => import('@/features/22-apply-modal'), { ssr: false });

export default function CTAFooterSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const container = sectionRef.current;
      if (!container) return;

      const headline = container.querySelector<HTMLElement>('.cta-headline-el');
      const desc = container.querySelector<HTMLElement>('.cta-desc-el');
      const btn = container.querySelector<HTMLElement>('.cta-btn-el');
      const disclaimer = container.querySelector<HTMLElement>('.cta-disclaimer-el');
      const redBeam = container.querySelector<HTMLElement>('.cta-red-beam-el');
      const blueBeam = container.querySelector<HTMLElement>('.cta-blue-beam-el');
      const convergeGlow = container.querySelector<HTMLElement>('.cta-converge-glow-el');

      if (reducedMotion) {
        gsap.set([headline, desc, btn, disclaimer].filter(Boolean), { opacity: 1, y: 0, scale: 1 });
        gsap.set([redBeam, blueBeam, convergeGlow].filter(Boolean), { opacity: 1 });
        return;
      }

      if (!isDesktop) {
        gsap.timeline({
          scrollTrigger: { trigger: container, start: 'top 65%', toggleActions: 'play none none reset' },
        })
          .fromTo(headline, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0)
          .fromTo(desc, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.3)
          .fromTo(btn, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }, 0.5)
          .fromTo(disclaimer, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.7);
        return;
      }

      // ── Desktop ── THE CONVERGENCE, scrub-pinned. The composed CTA scrolls
      // out of the viewport naturally after pin release — the footer (which
      // sits absolute-bottom of the section, outside the camera) is the last
      // thing visible at the end of the page.
      gsap.set(headline, { opacity: 0, y: 30 });
      gsap.set(desc, { opacity: 0, y: 20 });
      gsap.set(btn, { opacity: 0, scale: 0.85 });
      gsap.set(disclaimer, { opacity: 0 });
      if (redBeam) gsap.set(redBeam, { opacity: 0, scaleY: 0, transformOrigin: 'top right' });
      if (blueBeam) gsap.set(blueBeam, { opacity: 0, scaleY: 0, transformOrigin: 'top left' });
      if (convergeGlow) gsap.set(convergeGlow, { opacity: 0, scale: 0 });
      gsap.set('.cta-camera-el', { scale: 1, opacity: 1 });

      // Non-pinning scrub trigger — the section is the LAST on the page,
      // so any pinSpacing extends the document past the visible content
      // and leaves an extra "blank scroll" tail at the bottom. Original
      // intent (per the file header) was "played once on enter (NOT
      // pinned)"; this scrubs across the section's natural entry window
      // (top bottom → top top, i.e. one viewport of scroll) so the
      // animations land synchronously with the section reaching the top,
      // and the page ends exactly when the CTA composition does.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'top top',
          scrub: 1,
          // `invalidateOnRefresh` removed — all tween values are static
          // literals (scaleY, opacity, scale, y, duration), no function-based
          // properties to re-evaluate. Was contributing to pause/jerk at
          // refresh events. Trigger window is `top bottom → top top` (one
          // viewport of scroll), which doesn't depend on dynamic measurement.
        },
      });

      // Red + Blue beams arc inward and meet at centre
      if (redBeam)  tl.to(redBeam,  { opacity: 0.9, scaleY: 1, duration: 0.20, ease: 'power2.out' }, 0);
      if (blueBeam) tl.to(blueBeam, { opacity: 0.9, scaleY: 1, duration: 0.20, ease: 'power2.out' }, 0);

      // Convergence glow flares at the meeting point
      if (convergeGlow) {
        tl.to(convergeGlow, { opacity: 1, scale: 1, duration: 0.12, ease: 'back.out(2)' }, 0.22);
      }

      // Beams dim slightly as they "feed" into the glow
      if (redBeam)  tl.to(redBeam,  { opacity: 0.4, duration: 0.15, ease: 'power2.inOut' }, 0.30);
      if (blueBeam) tl.to(blueBeam, { opacity: 0.4, duration: 0.15, ease: 'power2.inOut' }, 0.30);

      // Headline materialises from the glow, then desc, button, disclaimer
      tl.to(headline, { opacity: 1, y: 0, duration: 0.20, ease: 'power3.out' }, 0.32);
      tl.to(desc,     { opacity: 1, y: 0, duration: 0.15, ease: 'power2.out' }, 0.46);
      tl.to(btn,      { opacity: 1, scale: 1, duration: 0.15, ease: 'back.out(1.6)' }, 0.58);
      tl.to(disclaimer, { opacity: 1, duration: 0.15, ease: 'power2.out' }, 0.72);
    },
    { scope: sectionRef, dependencies: [reducedMotion, isDesktop] },
  );

  return (
    <>
      <SectionWrapper ref={sectionRef} id="cta" act={6}>
        {/* Mobile-only padding rescue. On narrow viewports the bottom
            footer (CyCraft address + Privacy/Terms + copyright) wraps to
            ~200px tall and sits as `position: absolute; bottom: 0` with an
            opaque void background. The centered CTA content above uses
            `min-height: 100vh` + flex-center, so the APPLY NOW button
            lands in the bottom portion of the centered area and gets
            covered. Reserving bottom space here lifts the centered block
            above the footer. */}
        <style>{`
          @media (max-width: 768px) {
            .cta-content-wrap-el {
              padding-bottom: clamp(11rem, 28vh, 14rem) !important;
            }
          }
        `}</style>
        <div
          className="cta-camera-el"
          style={{
            position: 'absolute',
            inset: 0,
            transformOrigin: 'center center',
            willChange: 'transform, opacity',
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

          {/* Red beam — arcs from upper-left into centre */}
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
              transform: 'rotate(35deg) scaleY(0)',
              opacity: 0,
              zIndex: 1,
              willChange: 'transform, opacity',
            }}
          />

          {/* Blue beam — arcs from upper-right into centre */}
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
              transform: 'rotate(-35deg) scaleY(0)',
              opacity: 0,
              zIndex: 1,
              willChange: 'transform, opacity',
            }}
          />

          {/* Convergence glow — pools where the beams meet. Clamps so it
              doesn't overflow narrow viewports. */}
          <div
            className="cta-converge-glow-el"
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) scale(0)',
              width: 'clamp(280px, 70vw, 600px)',
              height: 'clamp(180px, 40vw, 300px)',
              maxWidth: '100vw',
              background: 'radial-gradient(ellipse, rgba(168,240,255,0.10) 0%, transparent 70%)',
              pointerEvents: 'none',
              zIndex: 2,
              willChange: 'transform, opacity',
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
              className="cta-headline-el"
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
                opacity: 0,
                willChange: 'transform, opacity',
              }}
            >
              {ctaFooterContent.heading}
            </h2>

            <p
              className="cta-desc-el"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-lg)',
                color: 'var(--color-text-secondary)',
                maxWidth: '480px',
                margin: 0,
                lineHeight: 1.55,
                opacity: 0,
                willChange: 'transform, opacity',
              }}
            >
              {ctaFooterContent.description}
            </p>

            <button
              className="cta-btn-el"
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
                opacity: 0,
                animation: 'glow-pulse 3s ease-in-out infinite',
                position: 'relative',
                willChange: 'transform, opacity',
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
              className="cta-disclaimer-el"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-disabled)',
                maxWidth: '480px',
                lineHeight: 1.6,
                opacity: 0,
                margin: 0,
                willChange: 'opacity',
              }}
            >
              {ctaFooterContent.disclaimer}
            </p>
          </div>
        </div>

        {/* Footer — outside camera so it doesn't fade with pin exit
            (CTA section has no pin exit anyway — it's the page's resting state) */}
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
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--color-beam)', marginBottom: '0.25rem' }}>
                CyCraft
              </div>
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
