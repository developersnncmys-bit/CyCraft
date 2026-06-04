'use client';

import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import { gsap } from '@/lib/gsap/register';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';

/**
 * Btech-only fixed-position color tint that scrubs across the page's total
 * scroll length. Each Act in the narrative gets its own subtle tint:
 *
 *   Act I  (Dormancy)    →  deep black, no tint
 *   Act II (Ignition)    →  cool cyan beam wash
 *   Act III (Divergence) →  red/blue duality
 *   Act IV (Architecture)→  violet/indigo
 *   Act V  (Proof)       →  terminal green
 *   Act VI (Invitation)  →  bright cyan release
 *
 * Sits above section backgrounds (which are opaque `var(--color-void)`) but
 * below interactive content, with `mix-blend-mode: overlay` so the tint
 * paints through the void without hiding what's on top.
 */
const STOPS = [
  { progress: 0.00, color: 'rgba(0,0,0,0)' },
  { progress: 0.08, color: 'rgba(168,240,255,0.08)' },
  { progress: 0.20, color: 'rgba(168,240,255,0.14)' },
  { progress: 0.32, color: 'rgba(255,61,90,0.10)' },
  { progress: 0.42, color: 'rgba(61,168,255,0.12)' },
  { progress: 0.55, color: 'rgba(140,80,255,0.10)' },
  { progress: 0.68, color: 'rgba(0,255,148,0.10)' },
  { progress: 0.82, color: 'rgba(168,240,255,0.14)' },
  { progress: 1.00, color: 'rgba(168,240,255,0.18)' },
] as const;

export function BTechAtmosphere() {
  const tintRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();

  useGSAP(
    () => {
      const tint = tintRef.current;
      if (!tint) return;

      if (!isDesktop) {
        gsap.set(tint, { backgroundColor: 'rgba(0,0,0,0)' });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 2,
        },
      });

      for (let i = 1; i < STOPS.length; i++) {
        const prev = STOPS[i - 1];
        const next = STOPS[i];
        tl.to(tint, {
          backgroundColor: next.color,
          duration: (next.progress - prev.progress) * 100,
          ease: 'none',
        });
      }
    },
    { dependencies: [isDesktop] },
  );

  return (
    <div
      ref={tintRef}
      aria-hidden="true"
      data-page="btech"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9000,
        pointerEvents: 'none',
        mixBlendMode: 'overlay',
        backgroundColor: 'rgba(0,0,0,0)',
        willChange: 'background-color',
      }}
    />
  );
}
