'use client';
/* Course Detail — Act IV — Operator Profile.
 *
 * Replaces the previous "Prerequisites / Learning Outcomes" pair of
 * check-bullet cards (which read as generic course-page boilerplate).
 * Two HUD-chromed panels side-by-side: ENTRY_REQUIREMENTS on the left,
 * OPERATOR_OUTCOMES on the right. Each item is laid out as a terminal
 * line ("> requirement_01: ...") in mono. Corner brackets, monospace,
 * scan lines — clearly within the CyCraft cinematic vocabulary.
 */
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

interface OperatorProfileProps {
  prerequisites: readonly string[];
  outcomes: readonly string[];
}

const pad2 = (n: number) => n.toString().padStart(2, '0');

function CornerBracket({
  position,
  color,
}: {
  position: 'tl' | 'tr' | 'bl' | 'br';
  color: string;
}) {
  const SIZE = 14;
  const off = -1;
  const base: React.CSSProperties = {
    position: 'absolute',
    width: `${SIZE}px`,
    height: `${SIZE}px`,
    borderColor: color,
    borderStyle: 'solid',
  };
  switch (position) {
    case 'tl':
      return <span aria-hidden="true" style={{ ...base, top: off, left: off, borderWidth: '2px 0 0 2px' }} />;
    case 'tr':
      return <span aria-hidden="true" style={{ ...base, top: off, right: off, borderWidth: '2px 2px 0 0' }} />;
    case 'bl':
      return <span aria-hidden="true" style={{ ...base, bottom: off, left: off, borderWidth: '0 0 2px 2px' }} />;
    case 'br':
      return <span aria-hidden="true" style={{ ...base, bottom: off, right: off, borderWidth: '0 2px 2px 0' }} />;
  }
}

export default function OperatorProfile({ prerequisites, outcomes }: OperatorProfileProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const hasPrereq = prerequisites.length > 0;
  const hasOutcomes = outcomes.length > 0;

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const lines = root.querySelectorAll<HTMLElement>('.cd-op-line');
      const panels = root.querySelectorAll<HTMLElement>('.cd-op-panel');

      if (reducedMotion) {
        gsap.set(['.cd-op-badge', '.cd-op-heading', panels, lines], {
          opacity: 1,
          x: 0,
          y: 0,
          filter: 'none',
        });
        return;
      }

      gsap.set('.cd-op-badge', { opacity: 0, y: 10 });
      gsap.set('.cd-op-heading', { opacity: 0, y: 20 });
      gsap.set(panels, { opacity: 0, y: 24 });
      gsap.set(lines, { opacity: 0, x: -12 });

      const trigger = {
        trigger: root,
        start: 'top 78%',
        toggleActions: 'play none none none',
      } as ScrollTrigger.Vars;

      gsap.to('.cd-op-badge', {
        opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', scrollTrigger: trigger,
      });
      gsap.to('.cd-op-heading', {
        opacity: 1, y: 0, duration: 0.6, delay: 0.1, ease: 'power3.out', scrollTrigger: trigger,
      });
      gsap.to(panels, {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.1, delay: 0.2,
        ease: 'power3.out', scrollTrigger: trigger,
      });

      lines.forEach((line, i) => {
        gsap.to(line, {
          opacity: 1,
          x: 0,
          duration: 0.4,
          delay: 0.4 + i * 0.04,
          ease: 'power2.out',
          scrollTrigger: trigger,
        });
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  if (!hasPrereq && !hasOutcomes) return null;

  return (
    <section
      ref={sectionRef}
      id="cd-operator-profile"
      aria-label="Operator profile — prerequisites and outcomes"
      style={{
        position: 'relative',
        paddingTop: 'clamp(3rem, 7vh, 5rem)',
        paddingBottom: 'clamp(3rem, 7vh, 5rem)',
        background: 'transparent',
      }}
    >
      <style>{`
        @media (max-width: 600px) {
          /* Drop the body text below the prefix label on narrow phones so
             "requirement_01:" doesn't crowd the body on a single line. */
          .cd-op-prefix { display: block; margin-bottom: 0.15rem; }
        }
      `}</style>
      <div
        className="section-container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(2rem, 4vh, 3rem)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '780px' }}>
          <div className="cd-op-badge">
            <span
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--color-beam)',
                borderBottom: '1px solid rgba(168,240,255,0.3)',
                paddingBottom: '3px',
              }}
            >
              {'// OPERATOR_PROFILE / ACT_III'}
            </span>
          </div>

          <h2
            className="cd-op-heading"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.6rem, 3.4vw, 2.6rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--color-text-primary)',
              margin: 0,
              lineHeight: 1.15,
            }}
          >
            Before & after deployment
          </h2>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(1.25rem, 2.5vw, 2rem)',
            maxWidth: '880px',
          }}
        >
          {hasPrereq && (
            <OperatorPanel
              kind="entry"
              title="Entry Requirements"
              tag="ENTRY_REQUIREMENTS"
              prefix="requirement"
              items={prerequisites}
            />
          )}
          {hasOutcomes && (
            <OperatorPanel
              kind="outcome"
              title="Operator Outcomes"
              tag="OPERATOR_OUTCOMES"
              prefix="outcome"
              items={outcomes}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function OperatorPanel({
  kind,
  title,
  tag,
  prefix,
  items,
}: {
  kind: 'entry' | 'outcome';
  title: string;
  tag: string;
  prefix: string;
  items: readonly string[];
}) {
  const color = kind === 'entry' ? 'var(--color-beam)' : 'var(--color-terminal)';
  const fadedColor = kind === 'entry' ? 'rgba(168,240,255,0.22)' : 'rgba(0,255,148,0.28)';

  return (
    <div
      className="cd-op-panel"
      style={{
        position: 'relative',
        padding: 'clamp(1rem, 2.5vw, 1.75rem) clamp(1rem, 2.5vw, 1.75rem)',
        background: 'rgba(13,16,20,0.65)',
        border: `1px solid ${fadedColor}`,
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(0.9rem, 2vw, 1.1rem)',
        willChange: 'transform, opacity',
      }}
    >
      <CornerBracket position="tl" color={color} />
      <CornerBracket position="tr" color={color} />
      <CornerBracket position="bl" color={color} />
      <CornerBracket position="br" color={color} />

      {/* Header strip — mono tag + count. Wraps on narrow mobile so the
          two pieces don't collide. */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          columnGap: '0.75rem',
          rowGap: '0.25rem',
          padding: '0.4rem 0',
          borderBottom: `1px dashed ${fadedColor}`,
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color,
        }}
      >
        <span>{`// ${tag}`}</span>
        <span style={{ color: 'var(--color-text-tertiary)' }}>{pad2(items.length)} ITEMS</span>
      </div>

      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.2rem, 2.4vw, 1.6rem)',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: 'var(--color-text-primary)',
          margin: 0,
          lineHeight: 1.15,
        }}
      >
        {title}
      </h3>

      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(0.7rem, 2vw, 0.85rem)',
        }}
      >
        {items.map((item, i) => (
          <li
            key={`${prefix}-${i}`}
            className="cd-op-line"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.55rem',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-primary)',
              lineHeight: 1.55,
              willChange: 'transform, opacity',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                color,
                fontWeight: 700,
                flexShrink: 0,
                marginTop: '1px',
              }}
            >
              {'>'}
            </span>
            <span style={{ flex: 1, minWidth: 0, overflowWrap: 'anywhere' }}>
              <span
                className="cd-op-prefix"
                style={{
                  color: 'var(--color-text-tertiary)',
                  marginRight: '0.4rem',
                }}
              >
                {prefix}_{pad2(i + 1)}:
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)' }}>
                {item}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
