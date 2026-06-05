'use client';
/* Research Detail — Team (cinematic glass cards).
 *
 * Larger avatar cards with backdrop-blur glass effect. Each card has a
 * big circular avatar with the member's initial + name + role + a hover
 * cyan lift. Section header is the mono `05 — TEAM` eyebrow.
 */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { WordSplit } from '@/features/home/_shared/wordSplit';
import type { ResearchDetail } from '@/content/research/details';
import { researchDetailLabels } from '@/content/research/details';

export default function ResearchDetailTeam({ detail }: { detail: ResearchDetail }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      if (reducedMotion) {
        gsap.set(['.rd-team-el', '.rd-team-heading [data-word]'], {
          opacity: 1,
          y: 0,
          yPercent: 0,
          filter: 'none',
        });
        return;
      }

      const trigger = {
        trigger: root,
        start: 'top 82%',
        toggleActions: 'play none none reset',
      } as ScrollTrigger.Vars;

      gsap.fromTo(
        '.rd-team-heading [data-word]',
        { opacity: 0, yPercent: 60, filter: 'blur(6px)' },
        {
          opacity: 1,
          yPercent: 0,
          filter: 'blur(0px)',
          duration: 0.65,
          stagger: 0.05,
          ease: 'power3.out',
          scrollTrigger: trigger,
        },
      );

      gsap.fromTo(
        '.rd-team-el',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.1,
          delay: 0.3,
          ease: 'power3.out',
          scrollTrigger: trigger,
        },
      );
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  if (detail.team.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      id="research-detail-team"
      aria-label={researchDetailLabels.teamHeading}
      style={{
        position: 'relative',
        paddingTop: 'clamp(3rem, 7vh, 5rem)',
        paddingBottom: 'clamp(3rem, 7vh, 5rem)',
        paddingInline: 'var(--section-padding)',
      }}
    >
      <div className="section-container">
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.22em',
            color: 'var(--color-beam)',
            textTransform: 'uppercase',
            marginBottom: '0.85rem',
          }}
        >
          05 — Team
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            color: 'var(--color-text-primary)',
            margin: '0 0 clamp(1.75rem, 3vh, 2.5rem)',
            lineHeight: 1.15,
          }}
        >
          <WordSplit
            text={researchDetailLabels.teamHeading}
            style={{ display: 'inline' }}
            className="rd-team-heading"
          />
        </h2>

        <style>{`
          .rd-team-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 1.25rem;
          }
          @media (max-width: 1023px) {
            .rd-team-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          }
          @media (max-width: 639px) {
            .rd-team-grid { grid-template-columns: 1fr; }
          }
        `}</style>

        <div className="rd-team-grid">
          {detail.team.map((member) => (
            <article
              key={member.name}
              className="rd-team-el"
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '1.25rem',
                padding: 'clamp(1.5rem, 3vw, 2rem)',
                background: 'rgba(13,16,20,0.55)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(20px) saturate(140%)',
                WebkitBackdropFilter: 'blur(20px) saturate(140%)',
                boxShadow: '0 18px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
                willChange: 'transform, opacity',
                transition: 'transform 0.3s, border-color 0.3s, box-shadow 0.3s, background 0.3s',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                const card = e.currentTarget;
                card.style.transform = 'translateY(-4px)';
                card.style.borderColor = 'rgba(168,240,255,0.35)';
                card.style.boxShadow =
                  '0 24px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 28px rgba(168,240,255,0.12)';
                const avatar = card.querySelector<HTMLElement>('.rd-team-avatar');
                if (avatar) {
                  avatar.style.transform = 'scale(1.05)';
                  avatar.style.boxShadow = '0 0 36px rgba(168,240,255,0.45)';
                  avatar.style.borderColor = 'rgba(168,240,255,0.6)';
                }
                const name = card.querySelector<HTMLElement>('.rd-team-name');
                if (name) name.style.color = 'var(--color-beam)';
              }}
              onMouseLeave={(e) => {
                const card = e.currentTarget;
                card.style.transform = 'translateY(0)';
                card.style.borderColor = 'rgba(255,255,255,0.08)';
                card.style.boxShadow =
                  '0 18px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)';
                const avatar = card.querySelector<HTMLElement>('.rd-team-avatar');
                if (avatar) {
                  avatar.style.transform = 'scale(1)';
                  avatar.style.boxShadow = '0 0 22px rgba(168,240,255,0.25)';
                  avatar.style.borderColor = 'rgba(168,240,255,0.35)';
                }
                const name = card.querySelector<HTMLElement>('.rd-team-name');
                if (name) name.style.color = 'var(--color-text-primary)';
              }}
            >
              <span
                aria-hidden="true"
                className="rd-team-avatar"
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  background:
                    'radial-gradient(circle at 30% 30%, rgba(168,240,255,0.55) 0%, rgba(168,240,255,0.12) 60%, rgba(13,16,20,0.4) 100%)',
                  border: '1px solid rgba(168,240,255,0.35)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.65rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  flexShrink: 0,
                  boxShadow: '0 0 22px rgba(168,240,255,0.25)',
                  transition: 'transform 0.3s, border-color 0.3s, box-shadow 0.3s',
                }}
              >
                {member.initial}
              </span>

              <div style={{ minWidth: 0, width: '100%' }}>
                <div
                  className="rd-team-name"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.05rem, 1.3vw, 1.2rem)',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    letterSpacing: '-0.01em',
                    lineHeight: 1.25,
                    marginBottom: '0.4rem',
                    transition: 'color 0.3s',
                  }}
                >
                  {member.name}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: '0.22em',
                    color: 'rgba(255,255,255,0.55)',
                    textTransform: 'uppercase',
                  }}
                >
                  {member.role}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
