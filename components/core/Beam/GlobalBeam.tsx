'use client';

import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import { gsap } from '@/lib/gsap/register';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import styles from './GlobalBeam.module.css';

/**
 * Root-level cross-section beam. CINEMA_SPEC.md Section 5.
 *
 * Phase 1: scaffolding only — the master scroll timeline advances phase-state
 * custom properties; visual mode rendering (split rails, red/blue divergence,
 * highway, network, etc.) is wired section-by-section in later phases.
 *
 * Per-section beams (e.g. .hero-beam-el) remain in place during Phase 1.
 * Each migrated section retires its local beam in favour of this one.
 */
export function GlobalBeam() {
  const beamRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();

  useGSAP(
    () => {
      const beam = beamRef.current;
      if (!beam) return;

      if (!isDesktop) {
        gsap.set(beam, { opacity: 0 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      });

      tl
        // 0–10%  Hero: cursor wakes, beam expands vertically
        .fromTo(
          beam,
          { '--gb-wake': 0, '--gb-height': '0vh', opacity: 0 },
          { '--gb-wake': 1, '--gb-height': '60vh', opacity: 0, duration: 0.10, ease: 'none' },
          0,
        )
        // 10–20% Achievements: stretch to full, ignite intensity
        .to(beam, { '--gb-height': '100vh', '--gb-intensity': 1, duration: 0.10, ease: 'none' })
        // 20–30% Pillars: prism split begins
        .to(beam, { '--gb-split-progress': 1, duration: 0.10, ease: 'none' })
        // 30–40% Philosophy / Program Overview: hold at steady state
        .to(beam, { '--gb-steady': 1, duration: 0.10, ease: 'none' })
        // 40–50% Tracks: permanent red/blue split
        .to(beam, { '--gb-red-blue-split': 1, duration: 0.10, ease: 'none' })
        // 50–60% Research / Projects / Specializations: inside Hacker House
        .to(beam, { '--gb-inside-mode': 1, duration: 0.10, ease: 'none' })
        // 60–80% Curriculum / Evolution / Battlegrounds: highway
        .to(beam, { '--gb-highway-mode': 1, duration: 0.20, ease: 'none' })
        // 80–92% Comparison / Hiring / Placements / Campus: network
        .to(beam, { '--gb-network-mode': 1, duration: 0.12, ease: 'none' })
        // 92–100% CTA: collapse back to cursor
        .to(beam, { '--gb-collapse-to-cursor': 1, duration: 0.08, ease: 'none' });
    },
    { dependencies: [isDesktop] },
  );

  return <div ref={beamRef} aria-hidden="true" className={styles.globalBeam} />;
}
