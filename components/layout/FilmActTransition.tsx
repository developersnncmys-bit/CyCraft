'use client';
/**
 * Full-screen masked reveal between two btech narrative acts. Mounted at
 * an act boundary, the overlay's progress is driven by scroll across the
 * window between the previous section's pin release and the target section's
 * pin engage (i.e. ScrollTrigger `top bottom` → `top top` on the target).
 *
 * Five variants, each timed differently:
 *
 *   beam-burst   — Act I → II   beam expands from centre, white flash.
 *   iris         — Act II → III camera-lens iris closes then reopens.
 *   slash        — Act III → IV diagonal cyan slash sweeps the viewport.
 *   curtain-red  — Act IV → V   twin red curtains close + dissolve.
 *   split        — Act V → VI   black panels close to centre then split open.
 *
 * Stronger than the original `ActTransition` — overlays cover the entire
 * viewport (z-index above content but below modal layers), use sharper
 * easing curves, and the "hold" beat at centre is fully opaque so the
 * sectional handoff feels like a scene cut, not a fade-overlap.
 */
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import { gsap } from '@/lib/gsap/register';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';

export type FilmTransitionType =
  | 'beam-burst'
  | 'iris'
  | 'slash'
  | 'curtain-red'
  | 'split';

interface Props {
  /** CSS selector for the section the transition reveals INTO. */
  targetSelector: string;
  type: FilmTransitionType;
}

export function FilmActTransition({ targetSelector, type }: Props) {
  const beamRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const irisRef = useRef<HTMLDivElement>(null);
  const slashRef = useRef<HTMLDivElement>(null);
  const redLeftRef = useRef<HTMLDivElement>(null);
  const redRightRef = useRef<HTMLDivElement>(null);
  const splitLeftRef = useRef<HTMLDivElement>(null);
  const splitRightRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  useGSAP(
    () => {
      if (!isDesktop) return;
      const target = document.querySelector(targetSelector);
      if (!target) return;

      const trigger = {
        trigger: target,
        start: 'top bottom',
        end: 'top top',
        scrub: 0.5,
      };

      if (type === 'beam-burst' && beamRef.current && flashRef.current) {
        gsap
          .timeline({ scrollTrigger: trigger })
          .fromTo(
            beamRef.current,
            { scale: 1, opacity: 0 },
            { scale: 80, opacity: 1, duration: 0.45, ease: 'power2.in' },
            0,
          )
          .fromTo(
            flashRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.20, ease: 'power2.in' },
            0.35,
          )
          .to(beamRef.current, { opacity: 0, duration: 0.20, ease: 'power1.out' }, 0.45)
          .to(flashRef.current, { opacity: 0, duration: 0.35, ease: 'power2.out' }, 0.65);
      }

      if (type === 'iris' && irisRef.current) {
        gsap
          .timeline({ scrollTrigger: trigger })
          .fromTo(
            irisRef.current,
            { opacity: 0, clipPath: 'circle(150% at 50% 50%)' },
            { opacity: 1, clipPath: 'circle(0% at 50% 50%)', duration: 0.55, ease: 'power2.inOut' },
            0,
          )
          .to(
            irisRef.current,
            { clipPath: 'circle(150% at 50% 50%)', opacity: 0, duration: 0.45, ease: 'power2.out' },
            0.55,
          );
      }

      if (type === 'slash' && slashRef.current) {
        gsap
          .timeline({ scrollTrigger: trigger })
          .fromTo(
            slashRef.current,
            { xPercent: -150, yPercent: -10, opacity: 0 },
            { xPercent: -30, yPercent: 0, opacity: 1, duration: 0.45, ease: 'power2.in' },
            0,
          )
          .to(
            slashRef.current,
            { xPercent: 150, yPercent: 10, opacity: 0, duration: 0.55, ease: 'power2.out' },
            0.45,
          );
      }

      if (type === 'curtain-red' && redLeftRef.current && redRightRef.current) {
        gsap
          .timeline({ scrollTrigger: trigger })
          .fromTo(
            redLeftRef.current,
            { xPercent: -100, opacity: 0.9 },
            { xPercent: 0, duration: 0.50, ease: 'power3.in' },
            0,
          )
          .fromTo(
            redRightRef.current,
            { xPercent: 100, opacity: 0.9 },
            { xPercent: 0, duration: 0.50, ease: 'power3.in' },
            0,
          )
          .to(
            [redLeftRef.current, redRightRef.current],
            { opacity: 0, duration: 0.50, ease: 'power2.out' },
            0.50,
          );
      }

      if (type === 'split' && splitLeftRef.current && splitRightRef.current) {
        gsap
          .timeline({ scrollTrigger: trigger })
          .fromTo(
            splitLeftRef.current,
            { xPercent: -100, opacity: 1 },
            { xPercent: 0, duration: 0.45, ease: 'power3.in' },
            0,
          )
          .fromTo(
            splitRightRef.current,
            { xPercent: 100, opacity: 1 },
            { xPercent: 0, duration: 0.45, ease: 'power3.in' },
            0,
          )
          .to(splitLeftRef.current, { xPercent: -100, duration: 0.55, ease: 'power3.out' }, 0.45)
          .to(splitRightRef.current, { xPercent: 100, duration: 0.55, ease: 'power3.out' }, 0.45);
      }
    },
    { dependencies: [isDesktop, targetSelector, type] },
  );

  // Shared overlay base — fixed full viewport, transition layer between
  // content (lower) and modal/toast layers (higher).
  const base = {
    position: 'fixed' as const,
    inset: 0,
    zIndex: 9050,
    pointerEvents: 'none' as const,
    willChange: 'transform, opacity, clip-path',
  };

  return (
    <>
      {type === 'beam-burst' && (
        <>
          <div
            ref={beamRef}
            aria-hidden="true"
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              width: '4px',
              height: '160px',
              marginTop: '-80px',
              marginLeft: '-2px',
              background: 'var(--color-beam-core, #d6f7ff)',
              boxShadow:
                '0 0 20px var(--color-beam, #a8f0ff), 0 0 60px var(--color-beam-glow, rgba(168,240,255,0.6)), 0 0 120px var(--color-beam-glow, rgba(168,240,255,0.6))',
              opacity: 0,
              zIndex: 9051,
              pointerEvents: 'none',
              transformOrigin: 'center center',
              willChange: 'transform, opacity',
            }}
          />
          <div
            ref={flashRef}
            aria-hidden="true"
            style={{ ...base, background: '#ffffff', opacity: 0 }}
          />
        </>
      )}

      {type === 'iris' && (
        <div
          ref={irisRef}
          aria-hidden="true"
          style={{
            ...base,
            background:
              'radial-gradient(circle at 50% 50%, rgba(5,8,14,0.98) 0%, rgba(0,0,0,1) 70%)',
            opacity: 0,
            clipPath: 'circle(150% at 50% 50%)',
          }}
        />
      )}

      {type === 'slash' && (
        <div
          ref={slashRef}
          aria-hidden="true"
          style={{
            ...base,
            background:
              'linear-gradient(115deg, transparent 0%, transparent 35%, rgba(168,240,255,0.20) 45%, rgba(168,240,255,0.8) 50%, rgba(168,240,255,0.20) 55%, transparent 65%, transparent 100%)',
            boxShadow: '0 0 120px rgba(168,240,255,0.5)',
            opacity: 0,
            transform: 'translate(-150%, -10%)',
          }}
        />
      )}

      {type === 'curtain-red' && (
        <>
          <div
            ref={redLeftRef}
            aria-hidden="true"
            style={{
              ...base,
              right: '50%',
              background:
                'linear-gradient(to right, rgba(80,15,25,0.98) 0%, rgba(255,61,90,0.85) 100%)',
              transform: 'translateX(-100%)',
              opacity: 0,
            }}
          />
          <div
            ref={redRightRef}
            aria-hidden="true"
            style={{
              ...base,
              left: '50%',
              background:
                'linear-gradient(to left, rgba(80,15,25,0.98) 0%, rgba(255,61,90,0.85) 100%)',
              transform: 'translateX(100%)',
              opacity: 0,
            }}
          />
        </>
      )}

      {type === 'split' && (
        <>
          <div
            ref={splitLeftRef}
            aria-hidden="true"
            style={{
              ...base,
              right: '50%',
              background: 'linear-gradient(to right, #000 60%, rgba(0,0,0,0.9) 100%)',
              transform: 'translateX(-100%)',
            }}
          />
          <div
            ref={splitRightRef}
            aria-hidden="true"
            style={{
              ...base,
              left: '50%',
              background: 'linear-gradient(to left, #000 60%, rgba(0,0,0,0.9) 100%)',
              transform: 'translateX(100%)',
            }}
          />
        </>
      )}
    </>
  );
}
