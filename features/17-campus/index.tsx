'use client';
/* Campus & Location — Act V, Section 17 of 22
 * Cinema mode: pinned 200vh. Camera pulls back to reveal full campus video. */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap/register';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { Badge } from '@/components/ui/Badge';
import { campusContent } from '@/content/campus';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';

export default function CampusSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isTablet = useMediaQuery('(min-width: 1024px)');
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const container = sectionRef.current;
      if (!container) return;

      const video = container.querySelector<HTMLElement>('.campus-video-el');
      const badges = container.querySelectorAll<HTMLElement>('.accreditation-badge-el');
      const features = container.querySelectorAll<HTMLElement>('.campus-feature-el');

      if (reducedMotion) {
        if (video) gsap.set(video, { scale: 1 });
        gsap.set(badges, { opacity: 1, y: 0 });
        gsap.set(features, { opacity: 1, y: 0 });
        gsap.set(['.cs-heading-el', '.cs-badge-el', '.cs-location-el'], { opacity: 1 });
        return;
      }

      if (!isDesktop) {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: container, start: 'top 65%', toggleActions: 'play none none reset' },
        });
        if (video) tl.fromTo(video, { scale: 1.08 }, { scale: 1, duration: 1.2, ease: 'power2.out' }, 0);
        tl.fromTo(badges, { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.07, duration: 0.4 }, 0.3);
        tl.fromTo(features, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power2.out' }, 0.5);
        return;
      }

      // ── Desktop cinema ────────────────────────────────────────────────
      gsap.set('.cs-badge-el',    { opacity: 0 });
      gsap.set('.cs-heading-el',  { opacity: 0, y: 24 });
      gsap.set('.cs-location-el', { opacity: 0 });
      gsap.set(badges,            { opacity: 0, y: 10 });
      gsap.set(features,          { opacity: 0, y: 20 });
      if (video) gsap.set(video,  { scale: 1.12 });
      gsap.set('.cs-camera-el',   { scale: 1, opacity: 1 });

      const tl = makePinnedTimeline({
        trigger: container,
        end: PIN_DURATIONS.campus,
        scrub: 1,
        enabled: true,
        unpinned: true,
      });

      tl.to('.cs-badge-el',    { opacity: 1, duration: 0.05, ease: 'power2.out' }, 0)
        .to('.cs-heading-el',  { opacity: 1, y: 0, duration: 0.08, ease: 'power3.out' }, 0.02)
        .to('.cs-location-el', { opacity: 1, duration: 0.06, ease: 'power2.out' }, 0.06);
      if (video) {
        // Camera pulls back over the bulk of the pin
        tl.to(video, { scale: 1, duration: 0.50, ease: 'power2.out' }, 0.10);
      }
      tl.to(badges,   { opacity: 1, y: 0, stagger: 0.03, duration: 0.06, ease: 'power2.out' }, 0.20)
        .to(features, { opacity: 1, y: 0, stagger: 0.04, duration: 0.08, ease: 'power3.out' }, 0.30)
        .to('.cs-camera-el', { scale: 0.98, duration: 0.10, ease: 'power2.inOut' }, 0.90);
    },
    { scope: sectionRef, dependencies: [reducedMotion, isDesktop, isTablet] },
  );

  return (
    <SectionWrapper ref={sectionRef} id="campus" act={5}>
      <div
        className="cs-camera-el"
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: 'center center',
          willChange: 'transform, opacity',
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
              <div className="cs-badge-el" style={{ display: 'inline-block', willChange: 'opacity' }}>
                <Badge label={campusContent.badge} />
              </div>
              <h2
                className="cs-heading-el"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-primary)',
                  margin: '1rem 0 0.5rem',
                  lineHeight: 1.1,
                  willChange: 'transform, opacity',
                }}
              >
                {campusContent.heading}
              </h2>
              <p
                className="cs-location-el"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-lg)',
                  color: 'var(--color-beam)',
                  fontWeight: 500,
                  margin: '0 0 1rem',
                  willChange: 'opacity',
                }}
              >
                {campusContent.location}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                {campusContent.accreditations.map((acc) => (
                  <span
                    key={acc}
                    className="accreditation-badge-el"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6rem',
                      letterSpacing: '0.12em',
                      color: 'var(--color-text-tertiary)',
                      border: '1px solid rgba(168,240,255,0.12)',
                      padding: '3px 8px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {acc}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {campusContent.features.map((f) => (
                  <div key={f.id} className="campus-feature-el" style={{ opacity: 0, transform: 'translateY(20px)' }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--color-beam)',
                        marginBottom: '0.2rem',
                      }}
                    >
                      {f.title}
                    </div>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--color-text-secondary)',
                        margin: 0,
                        lineHeight: 1.55,
                      }}
                    >
                      {f.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — campus video */}
            <div
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
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', willChange: 'transform' }}
                aria-label="Life at CyCraft campus"
              >
                <source src={campusContent.video.mp4} type="video/mp4" />
              </video>
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  boxShadow: 'inset 0 0 40px rgba(168,240,255,0.04)',
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
