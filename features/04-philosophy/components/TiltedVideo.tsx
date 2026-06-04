'use client';
/* TiltedVideo — CSS-3D-tilted video/placeholder frame.
 * GSAP target: .tilted-video-el (rotateY: -15 → 0 on scroll) */
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';

interface TiltedVideoProps {
  mp4: string;
  poster: string;
  label: string;
}

export function TiltedVideo({ mp4, poster, label }: TiltedVideoProps) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return (
    <div
      style={{
        perspective: '1000px',
        // Match the text column's flex pattern. Both columns share the row
        // when they fit (≈50/50), and the video grows to 100% when the
        // parent wrap kicks in — which fixes the "empty right half" that
        // the previous `width: 50%` left behind after wrapping.
        flex: '1 1 min(480px, 100%)',
        minWidth: 0,
        width: isDesktop ? undefined : '100%',
      }}
    >
      <div
        className="tilted-video-el"
        style={{
          position: 'relative',
          aspectRatio: '16 / 9',
          border: '1px solid rgba(168, 240, 255, 0.12)',
          background: 'var(--color-carbon)',
          transform: isDesktop ? 'rotateY(-15deg)' : 'none',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          overflow: 'hidden',
        }}
      >
        {/* Corner accent lines */}
        {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((pos) => (
          <div
            key={pos}
            aria-hidden="true"
            style={{
              position: 'absolute',
              [pos.includes('top') ? 'top' : 'bottom']: 0,
              [pos.includes('left') ? 'left' : 'right']: 0,
              width: '20px',
              height: '20px',
              borderTop: pos.includes('top') ? '1px solid var(--color-beam)' : 'none',
              borderBottom: pos.includes('bottom') ? '1px solid var(--color-beam)' : 'none',
              borderLeft: pos.includes('left') ? '1px solid var(--color-beam)' : 'none',
              borderRight: pos.includes('right') ? '1px solid var(--color-beam)' : 'none',
              opacity: 0.5,
            }}
          />
        ))}

        {/* Desktop: autoplay muted loop. Mobile: poster shown, tap-to-play. */}
        <video
          src={mp4}
          poster={poster}
          {...(isDesktop ? { autoPlay: true, loop: true } : {})}
          muted
          playsInline
          controls={!isDesktop}
          preload="metadata"
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
          aria-label={label}
        />

        {/* Scan lines overlay on the video */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.02) 3px, rgba(255,255,255,0.02) 4px)',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
}
