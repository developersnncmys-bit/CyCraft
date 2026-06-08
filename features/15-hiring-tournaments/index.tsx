'use client';
/* Hiring Tournaments — Act V, Section 15 of 22.
 * Film-mode: pinned ~220vh. Centre "YOU" node + 8 radial role beams. */
import { useRef } from 'react';
import { SectionWrapper } from '@/components/core/SectionWrapper/SectionWrapper';
import { Badge } from '@/components/ui/Badge';
import { hiringTournamentsContent } from '@/content/hiring-tournaments';
import { RoleNode } from './components/RoleNode';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { useFilmReveal } from '@/lib/gsap/filmReveal';

const RADIUS = 130;

export default function HiringTournamentsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isTablet = useMediaQuery('(min-width: 768px)');
  useFilmReveal(sectionRef, { pin: '+=220%' });

  return (
    <SectionWrapper ref={sectionRef} id="hiring" act={5}>
      <div
        className="film-bg-deep"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-10%',
          zIndex: 0,
          background:
            'radial-gradient(ellipse at 50% 60%, rgba(168,240,255,0.12), transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(0,255,148,0.05), transparent 60%)',
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
            'repeating-linear-gradient(0deg, transparent, transparent 6px, rgba(168,240,255,0.02) 6px, rgba(168,240,255,0.02) 7px)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="film-camera ht-camera-el"
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
            paddingTop: 'clamp(4rem, 7vh, 5rem)',
            paddingBottom: 'clamp(1.5rem, 3vh, 2.5rem)',
            paddingInline: 'var(--section-padding)',
          }}
        >
          <div className="section-container" style={{ textAlign: 'center', marginBottom: 'clamp(4rem, 8vh, 6rem)' }}>
            <div className="film-fade ht-badge-el" data-at="0.05" style={{ display: 'inline-block' }}>
              <Badge label={hiringTournamentsContent.badge} />
            </div>
            <h2
              className="film-fade ht-heading-el"
              data-at="0.10"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.25rem, 2.4vw, 2rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: 'var(--color-text-primary)',
                margin: '0.75rem 0 0.5rem',
                lineHeight: 1.1,
              }}
            >
              {hiringTournamentsContent.heading}
            </h2>
            <p
              className="film-fade ht-desc-el"
              data-at="0.14"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-secondary)',
                margin: '0 auto',
                lineHeight: 1.5,
                whiteSpace: 'nowrap',
              }}
            >
              {hiringTournamentsContent.description}
            </p>
          </div>

          {isTablet ? (
            <div
              className="section-container film-fade"
              data-at="0.20"
              data-dur="0.20"
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
                  <div
                    key={role.id}
                    className="film-fade role-beam-el"
                    data-at={`${0.25 + i * 0.04}`}
                    data-dur="0.06"
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: `${len}px`,
                      height: '1px',
                      background: `linear-gradient(to right, ${color}, transparent)`,
                      transform: `rotate(${rotDeg}deg)`,
                      transformOrigin: 'left center',
                      opacity: 0.4,
                    }}
                  />
                );
              })}
              <div
                className="film-image-zoom centre-node-el"
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: '1px solid rgba(168,240,255,0.5)',
                  background: 'rgba(168,240,255,0.08)',
                  boxShadow: '0 0 32px rgba(168,240,255,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--color-beam)', letterSpacing: '0.1em' }}>YOU</span>
              </div>
              {hiringTournamentsContent.roles.map((role, i) => (
                /* No per-role film-fade wrapper — that applied a transform
                   that broke RoleNode's absolute radial positioning by
                   creating a new containing block. The constellation div
                   above wears film-fade so the whole hex composition fades
                   in as one. */
                <RoleNode
                  key={role.id}
                  label={role.label}
                  domain={role.domain}
                  team={role.team}
                  angle={i * 45 - 90}
                  radius={RADIUS}
                />
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
