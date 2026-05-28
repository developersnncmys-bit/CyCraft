'use client';
/* Hiring Tournaments — Act V, Section 15 of 22
 * Cinema mode: pinned 300vh. Centre node ignites → 8 beams fire outward →
 * 8 role nodes materialise in radial pattern. CINEMA_SPEC §2.2. */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap/register';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { Badge } from '@/components/ui/Badge';
import { hiringTournamentsContent } from '@/content/hiring-tournaments';
import { RoleNode } from './components/RoleNode';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { makePinnedTimeline, PIN_DURATIONS } from '@/lib/gsap/cinemaConfig';

const RADIUS = 130;

export default function HiringTournamentsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isTablet = useMediaQuery('(min-width: 768px)');
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const container = sectionRef.current;
      if (!container) return;

      const nodes = container.querySelectorAll<HTMLElement>('.role-node-el');
      const beams = container.querySelectorAll<HTMLElement>('.role-beam-el');
      const centre = container.querySelector<HTMLElement>('.centre-node-el');

      if (reducedMotion) {
        gsap.set([...nodes], { opacity: 1 });
        gsap.set(beams, { scaleX: 1 });
        if (centre) gsap.set(centre, { scale: 1 });
        gsap.set(['.ht-heading-el', '.ht-badge-el', '.ht-desc-el'], { opacity: 1 });
        return;
      }

      if (!isDesktop) {
        gsap.timeline({
          scrollTrigger: { trigger: container, start: 'top 65%', toggleActions: 'play none none reset' },
        })
          .fromTo(centre, { scale: 0 }, { scale: 1, duration: 0.5, ease: 'back.out(1.7)' }, 0)
          .fromTo(beams, { scaleX: 0 }, { scaleX: 1, stagger: 0.08, duration: 0.4, ease: 'power2.out' }, 0.3)
          .to(nodes, { opacity: 1, stagger: 0.08, duration: 0.4, ease: 'power2.out' }, 0.4);
        return;
      }

      gsap.set('.ht-heading-el', { opacity: 0, y: 24 });
      gsap.set('.ht-badge-el',   { opacity: 0 });
      gsap.set('.ht-desc-el',    { opacity: 0, y: 16 });
      if (centre) gsap.set(centre, { scale: 0 });
      gsap.set(beams, { scaleX: 0 });
      gsap.set(nodes, { opacity: 0, scale: 0.85 });
      gsap.set('.ht-camera-el', { scale: 1, opacity: 1 });

      const tl = makePinnedTimeline({
        trigger: container,
        end: PIN_DURATIONS.hiringTournaments,
        scrub: 1,
        enabled: true,
      });

      tl.to('.ht-badge-el',   { opacity: 1, duration: 0.05, ease: 'power2.out' }, 0)
        .to('.ht-heading-el', { opacity: 1, y: 0, duration: 0.08, ease: 'power3.out' }, 0.02)
        .to('.ht-desc-el',    { opacity: 1, y: 0, duration: 0.06, ease: 'power2.out' }, 0.06)
        // Centre node ignites
        .to(centre,           { scale: 1, duration: 0.10, ease: 'back.out(1.7)' }, 0.15)
        // 8 beams fire outward in radial stagger
        .to(beams,            { scaleX: 1, stagger: 0.02, duration: 0.10, ease: 'power2.out' }, 0.25)
        // 8 role nodes materialise at beam endpoints
        .to(nodes,            { opacity: 1, scale: 1, stagger: 0.02, duration: 0.10, ease: 'back.out(1.4)' }, 0.40)
        // Pin exit
        .to('.ht-camera-el',  { scale: 0.98, duration: 0.10, ease: 'power2.inOut' }, 0.90);
    },
    { scope: sectionRef, dependencies: [reducedMotion, isDesktop, isTablet] },
  );

  return (
    <SectionWrapper ref={sectionRef} id="hiring" act={5}>
      <div
        className="ht-camera-el"
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
            paddingTop: 'clamp(4rem, 7vh, 5rem)',
            paddingBottom: 'clamp(1.5rem, 3vh, 2.5rem)',
            paddingInline: 'var(--section-padding)',
          }}
        >
          {/* Header */}
          <div className="section-container" style={{ textAlign: 'center', marginBottom: 'clamp(4rem, 8vh, 6rem)' }}>
            <div className="ht-badge-el" style={{ display: 'inline-block' }}>
              <Badge label={hiringTournamentsContent.badge} />
            </div>
            <h2
              className="ht-heading-el"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.25rem, 2.4vw, 2rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: 'var(--color-text-primary)',
                margin: '0.75rem 0 0.5rem',
                lineHeight: 1.1,
                willChange: 'transform, opacity',
              }}
            >
              {hiringTournamentsContent.heading}
            </h2>
            <p
              className="ht-desc-el"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-secondary)',
                margin: '0 auto',
                lineHeight: 1.5,
                whiteSpace: 'nowrap',
                willChange: 'opacity',
              }}
            >
              {hiringTournamentsContent.description}
            </p>
          </div>

          {isTablet ? (
            <div
              className="section-container"
              aria-label="Career role constellation"
              style={{ position: 'relative', height: `${RADIUS * 2 + 70}px`, maxWidth: '700px', margin: '0 auto' }}
            >
              {hiringTournamentsContent.roles.map((role, i) => {
                const angle = (i * 45 - 90) * (Math.PI / 180);
                const x2 = Math.round(RADIUS * Math.cos(angle));
                const y2 = Math.round(RADIUS * Math.sin(angle));
                const len = Math.sqrt(x2 * x2 + y2 * y2);
                const rotDeg = (Math.atan2(y2, x2) * 180) / Math.PI;
                const color = role.team === 'red' ? 'var(--color-red-team)' : 'var(--color-blue-team)';
                return (
                  <div key={role.id} className="role-beam-el" aria-hidden="true"
                    style={{ position: 'absolute', top: '50%', left: '50%', width: `${len}px`, height: '1px', background: `linear-gradient(to right, ${color}, transparent)`, transform: `rotate(${rotDeg}deg) scaleX(0)`, transformOrigin: 'left center', opacity: 0.4 }} />
                );
              })}
              <div className="centre-node-el" aria-hidden="true"
                style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) scale(0)', width: '44px', height: '44px', borderRadius: '50%', border: '1px solid rgba(168,240,255,0.4)', background: 'rgba(168,240,255,0.06)', boxShadow: '0 0 24px rgba(168,240,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--color-beam)', letterSpacing: '0.1em' }}>YOU</span>
              </div>
              {hiringTournamentsContent.roles.map((role, i) => (
                <RoleNode key={role.id} label={role.label} domain={role.domain} team={role.team} angle={i * 45 - 90} radius={RADIUS} />
              ))}
            </div>
          ) : (
            <div className="section-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1px', background: 'rgba(168,240,255,0.04)' }}>
              {hiringTournamentsContent.roles.map((role) => {
                const color = role.team === 'red' ? 'var(--color-red-team)' : 'var(--color-blue-team)';
                return (
                  <div key={role.id} style={{ padding: '1.25rem', background: 'var(--color-void)' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>{role.domain}</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', lineHeight: 1.4 }}>{role.label}</div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </SectionWrapper>
  );
}
