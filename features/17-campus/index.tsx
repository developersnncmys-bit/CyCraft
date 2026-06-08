'use client';
/* Campus & Location — Act V, Section 17 of 22.
 * Film-mode: pinned ~200vh. Video zooms in, badges + features stagger. */
import { useRef } from 'react';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { Badge } from '@/components/ui/Badge';
import { campusContent } from '@/content/campus';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { useFilmReveal } from '@/lib/gsap/filmReveal';

export default function CampusSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isTablet = useMediaQuery('(min-width: 1024px)');
  useFilmReveal(sectionRef, { pin: '+=200%' });

  return (
    <SectionWrapper ref={sectionRef} id="campus" act={5}>
      <div
        className="film-bg-deep"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-10%',
          zIndex: 0,
          background:
            'radial-gradient(ellipse at 30% 40%, rgba(168,240,255,0.10), transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(0,255,148,0.06), transparent 60%)',
          pointerEvents: 'none',
        }}
      />
      <div
        className="film-bg-mid"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-5%',
          zIndex: 0,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.018) 3px, rgba(255,255,255,0.018) 4px)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="film-camera cs-camera-el"
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        <div
          style={{
            position: 'relative',
            zIndex: 3,
            paddingTop: 'clamp(5rem, 9vh, 6rem)',
            paddingBottom: 'clamp(2rem, 4vh, 3rem)',
            paddingInline: 'var(--section-padding)',
          }}
        >
          <div
            className="section-container"
            style={{
              display: 'grid',
              gridTemplateColumns: isTablet ? '1fr 1fr' : '1fr',
              gap: 'clamp(1.5rem, 3vw, 2.5rem)',
              alignItems: 'center',
            }}
          >
            {/* Left — text content */}
            <div>
              <div className="film-fade cs-badge-el" data-at="0.05" style={{ display: 'inline-block' }}>
                <Badge label={campusContent.badge} />
              </div>
              <h2
                className="film-fade cs-heading-el"
                data-at="0.10"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.35rem, 2.4vw, 2rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-primary)',
                  margin: '0.65rem 0 0.35rem',
                  lineHeight: 1.08,
                }}
              >
                {campusContent.heading}
              </h2>
              <p
                className="film-fade cs-location-el"
                data-at="0.14"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-beam)',
                  fontWeight: 500,
                  margin: '0 0 0.75rem',
                }}
              >
                {campusContent.location}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.9rem' }}>
                {campusContent.accreditations.map((acc, i) => (
                  <span
                    key={acc}
                    className="film-fade accreditation-badge-el"
                    data-at={`${0.20 + i * 0.03}`}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6rem',
                      letterSpacing: '0.12em',
                      color: 'var(--color-text-tertiary)',
                      border: '1px solid rgba(168,240,255,0.12)',
                      padding: '2px 7px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {acc}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {campusContent.features.map((f, i) => (
                  <div key={f.id} className="film-fade campus-feature-el" data-at={`${0.35 + i * 0.07}`}>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '13px',
                        color: 'var(--color-beam)',
                        marginBottom: '0.1rem',
                      }}
                    >
                      {f.title}
                    </div>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '13px',
                        color: 'var(--color-text-secondary)',
                        margin: 0,
                        lineHeight: 1.4,
                      }}
                    >
                      {f.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — campus video, zooms in */}
            <div
              className="film-image-zoom"
              style={{
                position: 'relative',
                borderRadius: '2px',
                overflow: 'hidden',
                aspectRatio: '16/9',
                border: '1px solid rgba(168,240,255,0.1)',
              }}
            >
              <video
                className="campus-video-el"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={campusContent.video.poster}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                aria-label="Life at CyCraft campus"
              >
                <source src={campusContent.video.mp4} type="video/mp4" />
              </video>
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  boxShadow: 'inset 0 0 40px rgba(168,240,255,0.06)',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
