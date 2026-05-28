'use client';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import type { RefObject } from 'react';

/**
 * Animates a horizontal scan beam at the top of a section when it enters
 * the viewport. The beam expands from left to right via scaleX, signaling
 * the section is "opening". Designed to be paired with element-level reveal
 * animations inside the same section.
 */
export function useSectionEnterBeam(ref: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const beam = root.querySelector<HTMLElement>('.section-enter-beam');
      if (!beam) return;

      gsap.fromTo(
        beam,
        { scaleX: 0, opacity: 0.4 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: root,
            start: 'top 80%',
            toggleActions: 'play none none reset',
          } as ScrollTrigger.Vars,
        },
      );
    },
    { scope: ref },
  );
}

export function SectionEnterBeam() {
  return (
    <div
      aria-hidden="true"
      className="section-enter-beam"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background:
          'linear-gradient(to right, transparent, var(--color-beam), transparent)',
        boxShadow: '0 0 14px var(--color-beam-glow)',
        transformOrigin: 'left center',
        zIndex: 10,
        pointerEvents: 'none',
      }}
    />
  );
}
