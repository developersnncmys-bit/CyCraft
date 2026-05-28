'use client';

import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import { gsap } from '@/lib/gsap/register';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';

interface ActTransitionProps {
  /**
   * Selector for the target (next-act) section. The transition scrubs across
   * the scroll window between the previous section's unpin and the target's
   * pin (`top bottom` → `top top` on the target).
   */
  targetSelector: string;
  type: 'i-to-ii' | 'ii-to-iii' | 'iii-to-iv' | 'iv-to-v' | 'v-to-vi';
}

/**
 * Act boundary overlay. CINEMA_SPEC §6.2 / §6.3.
 *
 * Five variants — all full-screen masked reveals choreographed to the
 * scroll window between the previous section's unpin and the target's pin.
 * Desktop-only; mobile falls back to a natural scroll between sections.
 *
 *   i-to-ii   — Beam fires forward, white flash dissolves into next section.
 *   ii-to-iii — Radial mask wipe (circle iris) from centre outward.
 *   iii-to-iv — Diagonal cyan slash sweeps the viewport.
 *   iv-to-v   — Red-shift overlay: dual red curtains close + dissolve.
 *   v-to-vi   — Vertical curtain split (twin panels open from centre).
 */
export function ActTransition({ targetSelector, type }: ActTransitionProps) {
  const beamRef = useRef<HTMLDivElement>(null);
  const whiteRef = useRef<HTMLDivElement>(null);
  const irisRef = useRef<HTMLDivElement>(null);
  const slashRef = useRef<HTMLDivElement>(null);
  const redLeftRef = useRef<HTMLDivElement>(null);
  const redRightRef = useRef<HTMLDivElement>(null);
  const curtainLeftRef = useRef<HTMLDivElement>(null);
  const curtainRightRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();

  useGSAP(
    () => {
      if (!isDesktop) return;

      const target = document.querySelector(targetSelector);
      if (!target) return;

      const baseTrigger = {
        trigger: target,
        start: 'top bottom',
        end: 'top top',
        scrub: 0.5,
      };

      if (type === 'i-to-ii') {
        if (!beamRef.current || !whiteRef.current) return;
        gsap
          .timeline({ scrollTrigger: baseTrigger })
          .fromTo(
            beamRef.current,
            { scale: 1, opacity: 0 },
            { scale: 50, opacity: 1, duration: 0.5, ease: 'power2.in' },
            0,
          )
          .fromTo(
            whiteRef.current,
            { opacity: 0 },
            { opacity: 0.9, duration: 0.3, ease: 'power2.in' },
            0.3,
          )
          .to(beamRef.current, { opacity: 0, duration: 0.3, ease: 'power1.out' }, 0.4)
          .to(whiteRef.current, { opacity: 0, duration: 0.4, ease: 'power2.out' }, 0.6);
      }

      if (type === 'ii-to-iii') {
        if (!irisRef.current) return;
        // Circular iris closes inward then reopens — feels like a camera lens
        gsap
          .timeline({ scrollTrigger: baseTrigger })
          .fromTo(
            irisRef.current,
            {
              opacity: 0,
              clipPath: 'circle(150% at 50% 50%)',
            },
            {
              opacity: 1,
              clipPath: 'circle(0% at 50% 50%)',
              duration: 0.55,
              ease: 'power2.inOut',
            },
            0,
          )
          .to(
            irisRef.current,
            {
              clipPath: 'circle(150% at 50% 50%)',
              opacity: 0,
              duration: 0.45,
              ease: 'power2.out',
            },
            0.55,
          );
      }

      if (type === 'iii-to-iv') {
        if (!slashRef.current) return;
        // Diagonal cyan slash sweeps from off-screen top-left to bottom-right
        gsap
          .timeline({ scrollTrigger: baseTrigger })
          .fromTo(
            slashRef.current,
            { xPercent: -130, yPercent: -10, opacity: 0 },
            {
              xPercent: -30,
              yPercent: 0,
              opacity: 1,
              duration: 0.45,
              ease: 'power2.in',
            },
            0,
          )
          .to(
            slashRef.current,
            {
              xPercent: 130,
              yPercent: 10,
              opacity: 0,
              duration: 0.55,
              ease: 'power2.out',
            },
            0.45,
          );
      }

      if (type === 'iv-to-v') {
        if (!redLeftRef.current || !redRightRef.current) return;
        // Twin red curtains close from the edges and dissolve
        gsap
          .timeline({ scrollTrigger: baseTrigger })
          .fromTo(
            redLeftRef.current,
            { xPercent: -100, opacity: 0.85 },
            { xPercent: 0, duration: 0.5, ease: 'power2.in' },
            0,
          )
          .fromTo(
            redRightRef.current,
            { xPercent: 100, opacity: 0.85 },
            { xPercent: 0, duration: 0.5, ease: 'power2.in' },
            0,
          )
          .to(
            [redLeftRef.current, redRightRef.current],
            { opacity: 0, duration: 0.5, ease: 'power2.out' },
            0.5,
          );
      }

      if (type === 'v-to-vi') {
        if (!curtainLeftRef.current || !curtainRightRef.current) return;
        // Vertical curtain split — twin panels close to centre then open
        gsap
          .timeline({ scrollTrigger: baseTrigger })
          .fromTo(
            curtainLeftRef.current,
            { xPercent: -100, opacity: 1 },
            { xPercent: 0, duration: 0.45, ease: 'power3.in' },
            0,
          )
          .fromTo(
            curtainRightRef.current,
            { xPercent: 100, opacity: 1 },
            { xPercent: 0, duration: 0.45, ease: 'power3.in' },
            0,
          )
          .to(curtainLeftRef.current, { xPercent: -100, duration: 0.55, ease: 'power3.out' }, 0.45)
          .to(curtainRightRef.current, { xPercent: 100, duration: 0.55, ease: 'power3.out' }, 0.45);
      }
    },
    { dependencies: [isDesktop, targetSelector, type] },
  );

  const baseOverlay = {
    position: 'fixed' as const,
    inset: 0,
    zIndex: 199,
    pointerEvents: 'none' as const,
    willChange: 'transform, opacity, clip-path',
  };

  return (
    <>
      {type === 'i-to-ii' && (
        <>
          <div
            ref={beamRef}
            aria-hidden="true"
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              width: '4px',
              height: '120px',
              marginTop: '-60px',
              marginLeft: '-2px',
              background: 'var(--color-beam-core)',
              boxShadow:
                '0 0 16px var(--color-beam), 0 0 40px var(--color-beam-glow), 0 0 80px var(--color-beam-glow)',
              opacity: 0,
              zIndex: 200,
              pointerEvents: 'none',
              transformOrigin: 'center center',
              willChange: 'transform, opacity',
            }}
          />
          <div
            ref={whiteRef}
            aria-hidden="true"
            style={{
              ...baseOverlay,
              background: '#ffffff',
              opacity: 0,
            }}
          />
        </>
      )}

      {type === 'ii-to-iii' && (
        <div
          ref={irisRef}
          aria-hidden="true"
          style={{
            ...baseOverlay,
            background:
              'radial-gradient(circle at 50% 50%, rgba(5,8,14,0.95) 0%, rgba(0,0,0,1) 70%)',
            opacity: 0,
            clipPath: 'circle(150% at 50% 50%)',
          }}
        />
      )}

      {type === 'iii-to-iv' && (
        <div
          ref={slashRef}
          aria-hidden="true"
          style={{
            ...baseOverlay,
            background:
              'linear-gradient(115deg, transparent 0%, transparent 35%, rgba(168,240,255,0.18) 45%, rgba(168,240,255,0.6) 50%, rgba(168,240,255,0.18) 55%, transparent 65%, transparent 100%)',
            boxShadow: '0 0 80px rgba(168,240,255,0.4)',
            opacity: 0,
            transform: 'translate(-130%, -10%)',
          }}
        />
      )}

      {type === 'iv-to-v' && (
        <>
          <div
            ref={redLeftRef}
            aria-hidden="true"
            style={{
              ...baseOverlay,
              right: '50%',
              background:
                'linear-gradient(to right, rgba(80,15,25,0.95) 0%, rgba(255,61,90,0.75) 100%)',
              transform: 'translateX(-100%)',
              opacity: 0,
            }}
          />
          <div
            ref={redRightRef}
            aria-hidden="true"
            style={{
              ...baseOverlay,
              left: '50%',
              background:
                'linear-gradient(to left, rgba(80,15,25,0.95) 0%, rgba(255,61,90,0.75) 100%)',
              transform: 'translateX(100%)',
              opacity: 0,
            }}
          />
        </>
      )}

      {type === 'v-to-vi' && (
        <>
          <div
            ref={curtainLeftRef}
            aria-hidden="true"
            style={{
              ...baseOverlay,
              right: '50%',
              background: 'linear-gradient(to right, #000000 60%, rgba(0,0,0,0.85) 100%)',
              transform: 'translateX(-100%)',
            }}
          />
          <div
            ref={curtainRightRef}
            aria-hidden="true"
            style={{
              ...baseOverlay,
              left: '50%',
              background: 'linear-gradient(to left, #000000 60%, rgba(0,0,0,0.85) 100%)',
              transform: 'translateX(100%)',
            }}
          />
        </>
      )}
    </>
  );
}
