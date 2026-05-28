'use client';

import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import { gsap } from '@/lib/gsap/register';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';

/**
 * 12-stop continuous background gradient driven by overall page scroll progress.
 * Source: CINEMA_SPEC.md Section 3.1.
 */
const STOPS = [
  { progress: 0.00, color: '#000000' },
  { progress: 0.10, color: '#020408' },
  { progress: 0.20, color: '#050810' },
  { progress: 0.30, color: '#060406' },
  { progress: 0.40, color: '#0a0a0a' },
  { progress: 0.50, color: '#0d0608' },
  { progress: 0.55, color: '#0a0410' },
  { progress: 0.65, color: '#020812' },
  { progress: 0.75, color: '#050608' },
  { progress: 0.85, color: '#030610' },
  { progress: 0.92, color: '#000008' },
  { progress: 1.00, color: '#000000' },
] as const;

export function CinemaBackground() {
  const bgRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();

  useGSAP(
    () => {
      const bg = bgRef.current;
      if (!bg) return;

      if (!isDesktop) {
        gsap.set(bg, { backgroundColor: '#000000' });
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
        tl.to(bg, {
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
      ref={bgRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        backgroundColor: '#000000',
        pointerEvents: 'none',
        willChange: 'background-color',
      }}
    />
  );
}
