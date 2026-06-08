'use client';
/**
 * Page-wide cinematic background-color shift, scrubbed against full document
 * scroll. Two stacked overlays:
 *
 *   • Tint layer  — narrative-act color wash (mix-blend overlay).
 *   • Vignette layer — radial darkening that breathes per act.
 *
 * Acts (CINEMA_SPEC §4):
 *   I   Dormancy    deep black
 *   II  Ignition    cyan beam wash
 *   III Divergence  red/blue duality
 *   IV  Architecture violet-indigo
 *   V   Proof       terminal green
 *   VI  Invitation  cyan release
 *
 * Stronger magnitudes than the previous BTechAtmosphere — colors are double
 * the alpha so the page actually reads as "going somewhere" tonally.
 */
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import { gsap } from '@/lib/gsap/register';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';

// Alphas tuned subtle — the tint is a *hue shift*, not a light source. Earlier
// values (0.14–0.30) under `mix-blend-mode: screen` blew out the dark void
// into a washed-out cyan-grey. New scheme uses `overlay` blend (preserves
// midtones, only colors highlights) at ~⅓ the alpha so each act *reads* as
// its color without lightening the page.
const TINT_STOPS = [
  { p: 0.00, color: 'rgba(0,0,0,0)' },
  { p: 0.06, color: 'rgba(168,240,255,0.05)' },
  { p: 0.18, color: 'rgba(168,240,255,0.08)' },
  { p: 0.28, color: 'rgba(255,61,90,0.06)' },
  { p: 0.40, color: 'rgba(61,168,255,0.07)' },
  { p: 0.52, color: 'rgba(140,80,255,0.08)' },
  { p: 0.66, color: 'rgba(0,255,148,0.06)' },
  { p: 0.80, color: 'rgba(168,240,255,0.08)' },
  { p: 1.00, color: 'rgba(168,240,255,0.10)' },
] as const;

// Vignette darkens the EDGES of the viewport across the whole page —
// reinforces the "framed scene" feel without lightening anything.
const VIGNETTE_STOPS = [
  { p: 0.00, color: 'rgba(0,0,0,0.70)' },
  { p: 0.18, color: 'rgba(0,0,0,0.55)' },
  { p: 0.40, color: 'rgba(0,0,0,0.60)' },
  { p: 0.66, color: 'rgba(0,0,0,0.50)' },
  { p: 1.00, color: 'rgba(0,0,0,0.65)' },
] as const;

export function FilmAtmosphere() {
  const tintRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  useGSAP(
    () => {
      const tint = tintRef.current;
      const vignette = vignetteRef.current;
      if (!tint || !vignette) return;

      if (!isDesktop) {
        gsap.set(tint, { backgroundColor: 'rgba(0,0,0,0)' });
        gsap.set(vignette, { boxShadow: 'inset 0 0 200px rgba(0,0,0,0.4)' });
        return;
      }

      const tintTl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 2.4,
        },
      });
      for (let i = 1; i < TINT_STOPS.length; i++) {
        const prev = TINT_STOPS[i - 1];
        const next = TINT_STOPS[i];
        tintTl.to(tint, {
          backgroundColor: next.color,
          duration: (next.p - prev.p) * 100,
          ease: 'none',
        });
      }

      const vigTl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 3,
        },
      });
      for (let i = 1; i < VIGNETTE_STOPS.length; i++) {
        const prev = VIGNETTE_STOPS[i - 1];
        const next = VIGNETTE_STOPS[i];
        vigTl.to(vignette, {
          // Drive a CSS variable so the radial-gradient alpha animates.
          '--film-vignette-color': next.color,
          duration: (next.p - prev.p) * 100,
          ease: 'none',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);
      }
    },
    { dependencies: [isDesktop] },
  );

  return (
    <>
      {/* Color wash — sits above content backgrounds, beneath text. */}
      <div
        ref={tintRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 8900,
          pointerEvents: 'none',
          mixBlendMode: 'overlay',
          backgroundColor: 'rgba(0,0,0,0)',
          willChange: 'background-color',
        }}
      />
      {/* Vignette frame — radial darkening of the edges, breathes per act. */}
      <div
        ref={vignetteRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9000,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse at center, transparent 55%, var(--film-vignette-color, rgba(0,0,0,0.55)) 100%)',
          willChange: 'background',
          // CSS variable for the vignette outer color, animated by GSAP.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...({ '--film-vignette-color': 'rgba(0,0,0,0.55)' } as any),
        }}
      />
    </>
  );
}
