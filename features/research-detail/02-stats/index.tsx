'use client';
/* Research Detail — Stats strip (cinematic glass cards).
 *
 * 3 stat cards float UP via negative margin-top so they overlap the
 * bottom edge of the hero header. Glass effect: translucent background +
 * backdrop-filter blur. Counter animation on the numerals.
 */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import type { ResearchDetail } from '@/content/research/details';
import { researchDetailLabels } from '@/content/research/details';

type StatKey = 'papers' | 'citations' | 'leads';

function StatIcon({ kind }: { kind: StatKey }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
  if (kind === 'papers') {
    return (
      <svg {...common}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="13" y2="17" />
      </svg>
    );
  }
  if (kind === 'citations') {
    return (
      <svg {...common}>
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export default function ResearchDetailStats({ detail }: { detail: ResearchDetail }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const stats: ReadonlyArray<{ key: StatKey; value: number; label: string }> = [
    { key: 'papers',    value: detail.stats.papers,    label: researchDetailLabels.statLabels.papers },
    { key: 'citations', value: detail.stats.citations, label: researchDetailLabels.statLabels.citations },
    { key: 'leads',     value: detail.stats.leads,     label: researchDetailLabels.statLabels.leads },
  ];

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const cards = root.querySelectorAll<HTMLElement>('.rd-stat-card');

      if (reducedMotion) {
        cards.forEach((c) => {
          const target = Number(c.dataset.target ?? 0);
          const valueEl = c.querySelector<HTMLElement>('.rd-stat-value');
          if (valueEl) valueEl.textContent = target.toLocaleString();
          gsap.set(c, { opacity: 1, y: 0 });
        });
        return;
      }

      cards.forEach((c, i) => {
        const target = Number(c.dataset.target ?? 0);
        const valueEl = c.querySelector<HTMLElement>('.rd-stat-value');

        gsap.fromTo(
          c,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            delay: i * 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: root,
              start: 'top 90%',
              toggleActions: 'play none none reset',
            } as ScrollTrigger.Vars,
          },
        );

        if (valueEl && target > 0) {
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 1.6,
            delay: i * 0.12 + 0.2,
            ease: 'power2.out',
            onUpdate() {
              valueEl.textContent = Math.round(obj.val).toLocaleString();
            },
            scrollTrigger: {
              trigger: root,
              start: 'top 85%',
              toggleActions: 'play none none reset',
            } as ScrollTrigger.Vars,
          });
        } else if (valueEl) {
          valueEl.textContent = '0';
        }
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="research-detail-stats"
      aria-label="Research statistics"
      style={{
        position: 'relative',
        zIndex: 5,
        /* Glass cards overlap the bottom edge of the hero by ~5rem. The
         * header's bottom padding (clamp(8rem,16vh,12rem)) keeps the
         * title comfortably above this overlap zone — see 01-header. */
        marginTop: 'clamp(-5rem, -7vh, -4rem)',
        paddingBottom: 'clamp(2rem, 5vh, 3.5rem)',
        paddingInline: 'var(--section-padding)',
      }}
    >
      <div className="section-container">
        <style>{`
          .rd-stats-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 1rem;
          }
          @media (max-width: 767px) {
            .rd-stats-grid { grid-template-columns: 1fr; }
          }
        `}</style>

        <div className="rd-stats-grid">
          {stats.map((s) => (
            <article
              key={s.key}
              className="rd-stat-card"
              data-target={s.value}
              style={{
                position: 'relative',
                padding: 'clamp(1.5rem, 3vw, 2rem)',
                background: 'rgba(13,16,20,0.55)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(20px) saturate(140%)',
                WebkitBackdropFilter: 'blur(20px) saturate(140%)',
                boxShadow: '0 18px 48px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                willChange: 'transform, opacity',
                transition: 'transform 0.3s, border-color 0.3s, box-shadow 0.3s',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                const card = e.currentTarget;
                card.style.transform = 'translateY(-4px)';
                card.style.borderColor = 'rgba(168,240,255,0.35)';
                card.style.boxShadow =
                  '0 24px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 28px rgba(168,240,255,0.1)';
              }}
              onMouseLeave={(e) => {
                const card = e.currentTarget;
                card.style.transform = 'translateY(0)';
                card.style.borderColor = 'rgba(255,255,255,0.08)';
                card.style.boxShadow =
                  '0 18px 48px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)';
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(168,240,255,0.08)',
                  border: '1px solid rgba(168,240,255,0.25)',
                  color: 'var(--color-beam)',
                }}
              >
                <StatIcon kind={s.key} />
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.85rem, 3.4vw, 2.5rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  color: '#ffffff',
                  lineHeight: 1,
                }}
              >
                <span className="rd-stat-value">0</span>
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
                {s.label}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
