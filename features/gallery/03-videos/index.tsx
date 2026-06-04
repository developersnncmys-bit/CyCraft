'use client';
/* Gallery Videos — pinned cinematic row of 4 video thumbnails.
 *
 * Each tile is a static gradient thumbnail with a play badge, duration
 * chip, and category tag. Clicking opens the external video URL in a new
 * tab — no embedded player, no extra deps. Swap the `href` values in
 * content/gallery/videos.ts once the real YouTube IDs are in.
 *
 * 250% pin. Beats (0–1):
 *   0.00–0.10  Badge enters
 *   0.05–0.18  Heading + description reveal
 *   0.25–0.40  Tile 1
 *   0.40–0.55  Tile 2
 *   0.55–0.70  Tile 3
 *   0.65–0.78  Tile 4
 *   0.85–1.00  Camera dollies in 4%
 */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { Badge } from '@/components/ui/Badge';
import { galleryVideosContent } from '@/content/gallery/videos';
import { galleryCardTones } from '@/content/gallery/events';

function PlayIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export default function GalleryVideos() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const tiles = root.querySelectorAll<HTMLElement>('.gallery-video-tile');

      if (reducedMotion) {
        gsap.set(
          [
            '.gallery-videos-badge',
            '.gallery-videos-heading',
            '.gallery-videos-desc',
            '.gallery-video-tile',
            '.gallery-video-play',
          ],
          { opacity: 1, y: 0, scale: 1 },
        );
        return;
      }

      if (!isDesktop) {
        gsap.fromTo(
          '.gallery-videos-badge, .gallery-videos-heading, .gallery-videos-desc',
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: root, start: 'top 78%', toggleActions: 'play none none reset' } as ScrollTrigger.Vars,
          },
        );
        tiles.forEach((t) => {
          gsap.fromTo(
            t,
            { opacity: 0, y: 36, scale: 0.95 },
            {
              opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out',
              scrollTrigger: { trigger: t, start: 'top 85%', toggleActions: 'play none none reset' } as ScrollTrigger.Vars,
            },
          );
        });
        return;
      }

      gsap.set(['.gallery-videos-badge', '.gallery-videos-desc'], { opacity: 0, y: 20 });
      gsap.set('.gallery-videos-heading', { opacity: 0, yPercent: 30 });
      gsap.set('.gallery-videos-camera', { scale: 1, transformOrigin: 'center center' });
      gsap.set(tiles, { opacity: 0, y: 36, scale: 0.92 });
      gsap.set('.gallery-video-play', { scale: 0.7 });

      const tl = makePinnedTimeline({
        trigger: root,
        end: PIN_DURATIONS.galleryVideos,
        scrub: 1,
        enabled: true,
      });

      tl.to('.gallery-videos-badge', { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0.02);
      tl.to('.gallery-videos-heading', { opacity: 1, yPercent: 0, duration: 0.12, ease: 'power3.out' }, 0.05);
      tl.to('.gallery-videos-desc', { opacity: 1, y: 0, duration: 0.10, ease: 'power2.out' }, 0.13);

      const STARTS = [0.25, 0.40, 0.55, 0.65];
      const DUR = 0.12;
      tiles.forEach((t, i) => {
        const start = STARTS[i] ?? STARTS[STARTS.length - 1];
        tl.to(t, { opacity: 1, y: 0, scale: 1, duration: DUR, ease: 'power3.out' }, start);
        const play = t.querySelector<HTMLElement>('.gallery-video-play');
        if (play) {
          tl.to(play, { scale: 1, duration: DUR, ease: 'back.out(2)' }, start + 0.02);
        }
      });

      tl.to(
        '.gallery-videos-camera',
        { scale: 1.03, duration: 0.10, ease: 'power2.inOut' },
        0.88,
      );
    },
    { scope: sectionRef, dependencies: [isDesktop, reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="gallery-videos"
      aria-label={galleryVideosContent.heading}
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <style>{`
        .gallery-videos-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1.5rem;
        }
        @media (max-width: 639px) {
          .gallery-videos-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div
        className="gallery-videos-camera"
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingInline: 'var(--section-padding)',
          paddingTop: 'clamp(5rem, 10vh, 8rem)',
          paddingBottom: 'clamp(5rem, 10vh, 8rem)',
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        <div
          className="section-container"
          style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 5vh, 3.5rem)' }}
        >
          <div className="gallery-videos-badge" style={{ display: 'inline-block' }}>
            <Badge label={galleryVideosContent.badge} />
          </div>
          <h2
            className="gallery-videos-heading"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3.2vw, 2.75rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              color: 'var(--color-text-primary)',
              margin: '1.5rem 0 1rem',
              lineHeight: 1.1,
            }}
          >
            {galleryVideosContent.heading}
          </h2>
          <p
            className="gallery-videos-desc"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '620px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            {galleryVideosContent.description}
          </p>
        </div>

        <div
          className="section-container gallery-videos-grid"
          style={{ maxWidth: '960px', marginInline: 'auto' }}
        >
          {galleryVideosContent.videos.map((video, i) => {
            const tone = galleryCardTones[i % galleryCardTones.length];
            return (
              <a
                key={video.id}
                href={video.href}
                target="_blank"
                rel="noopener noreferrer"
                className="gallery-video-tile"
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'rgba(13,16,20,0.4)',
                  border: '1px solid rgba(168,240,255,0.1)',
                  textDecoration: 'none',
                  color: 'inherit',
                  overflow: 'hidden',
                  transition: 'border-color 0.3s, box-shadow 0.3s',
                  willChange: 'transform, opacity',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = tone.accent;
                  el.style.boxShadow = `0 12px 32px rgba(0,0,0,0.5), 0 0 24px ${tone.accent}33`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = 'rgba(168,240,255,0.1)';
                  el.style.boxShadow = 'none';
                }}
              >
                {/* Thumbnail */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'relative',
                    aspectRatio: '16 / 9',
                    background: tone.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  {/* Concentric rings */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: '50%',
                      aspectRatio: '1 / 1',
                      border: `1px solid ${tone.accent}33`,
                      borderRadius: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: '80%',
                      aspectRatio: '1 / 1',
                      border: `1px solid ${tone.accent}1F`,
                      borderRadius: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  />

                  {/* Play badge */}
                  <div
                    className="gallery-video-play"
                    style={{
                      position: 'relative',
                      zIndex: 2,
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: 'rgba(13,16,20,0.85)',
                      border: `1.5px solid ${tone.accent}`,
                      boxShadow: `0 0 24px ${tone.accent}66`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: tone.accent,
                      paddingLeft: '4px',
                      willChange: 'transform',
                    }}
                  >
                    <PlayIcon />
                  </div>

                  {/* Tag chip */}
                  <span
                    style={{
                      position: 'absolute',
                      top: '0.85rem',
                      left: '0.85rem',
                      padding: '0.3rem 0.7rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      letterSpacing: '0.18em',
                      color: tone.accent,
                      border: `1px solid ${tone.accent}55`,
                      background: 'rgba(13,16,20,0.7)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {video.tag}
                  </span>

                  {/* Duration chip */}
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '0.85rem',
                      right: '0.85rem',
                      padding: '0.3rem 0.6rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                      background: 'rgba(5,6,8,0.85)',
                      border: '1px solid rgba(168,240,255,0.18)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {video.duration}
                  </span>
                </div>

                {/* Body */}
                <div
                  style={{
                    padding: '1.25rem 1.5rem 1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: 'var(--color-text-primary)',
                      margin: 0,
                      lineHeight: 1.25,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {video.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-secondary)',
                      margin: 0,
                      lineHeight: 1.55,
                    }}
                  >
                    {video.summary}
                  </p>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginTop: '0.4rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      fontWeight: 600,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: tone.accent,
                    }}
                  >
                    Watch on YouTube
                    <span aria-hidden="true">↗</span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
