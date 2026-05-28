'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap/register';
import { CertCard } from './CertCard';
import type { certificationsContent } from '@/content/certifications';

type Cert = (typeof certificationsContent.certifications)[number];

interface CertTickerProps {
  certs: readonly Cert[];
  footerNote: string;
}

export function CertTicker({ certs, footerNote }: CertTickerProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;

      // Duplicate cards to create seamless infinite loop
      const totalWidth = track.scrollWidth / 2;

      tweenRef.current = gsap.to(track, {
        x: -totalWidth,
        duration: 30,
        ease: 'none',
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
        },
      });
    },
    { scope: trackRef },
  );

  const handleMouseEnter = () => tweenRef.current?.pause();
  const handleMouseLeave = () => tweenRef.current?.resume();

  const doubled = [...certs, ...certs];

  return (
    <div style={{ marginTop: 'clamp(3rem, 6vh, 5rem)' }}>
      {/* Ticker strip */}
      <div
        style={{ overflow: 'hidden', position: 'relative' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label="Certification scroll — hover to pause"
      >
        {/* Fade edges */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '80px',
            height: '100%',
            background: 'linear-gradient(to right, var(--color-void), transparent)',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '80px',
            height: '100%',
            background: 'linear-gradient(to left, var(--color-void), transparent)',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />

        <div
          ref={trackRef}
          style={{ display: 'flex', gap: '1.5rem', width: 'max-content', padding: '0.5rem 0' }}
        >
          {doubled.map((cert, i) => (
            <CertCard
              key={`${cert.id}-${i}`}
              name={cert.name}
              description={cert.description}
              advanced={cert.advanced}
            />
          ))}
        </div>
      </div>

      {/* Footer note */}
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-disabled)',
          textAlign: 'center',
          marginTop: '2rem',
          paddingInline: 'var(--section-padding)',
          lineHeight: 1.6,
        }}
      >
        {footerNote}
      </p>
    </div>
  );
}
