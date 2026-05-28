'use client';
/* desktop: autoplay muted loop; mobile: poster image via next/image */
import Image from 'next/image';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';

interface HeroVideoProps {
  mp4: string;
  webm: string;
  poster: string;
}

export function HeroVideo({ mp4, webm, poster }: HeroVideoProps) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return (
    <>
      {/* video / poster layer — opacity starts at 0, GSAP fades in */}
      <div
        className="hero-video-el"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          opacity: 0,
          willChange: 'opacity',
        }}
      >
        {isDesktop ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={poster}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            aria-hidden="true"
          >
            <source src={webm} type="video/webm" />
            <source src={mp4} type="video/mp4" />
          </video>
        ) : (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Image src={poster} alt="" fill style={{ objectFit: 'cover' }} priority />
          </div>
        )}
      </div>

      {/* Grayscale overlay — mix-blend-mode:color with grey desaturates the video on scroll */}
      <div
        className="hero-grayscale-el"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 3,
          background: '#808080',
          mixBlendMode: 'color',
          opacity: 0,
          pointerEvents: 'none',
          willChange: 'opacity',
        }}
      />
    </>
  );
}
