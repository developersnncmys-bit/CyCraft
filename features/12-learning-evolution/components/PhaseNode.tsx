'use client';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';

interface PhaseNodeProps {
  number: string;
  title: string;
  description: string;
  semesters: string;
  index: number;
  isLast: boolean;
}

const PHASE_COLORS = [
  'var(--color-beam)',
  'var(--color-red-team)',
  'var(--color-blue-team)',
  'var(--color-terminal)',
] as const;

export function PhaseNode({ number, title, description, semesters, index, isLast }: PhaseNodeProps) {
  const color = PHASE_COLORS[index % PHASE_COLORS.length];
  const isRight = index % 2 === 1;
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (!isDesktop) {
    /* Mobile: dot on left, content on right — all phases aligned same way */
    return (
      <div
        className="phase-node-el"
        style={{ display: 'flex', gap: '1rem', position: 'relative' }}
      >
        {/* Left: dot + connector */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
          <div
            className="phase-dot-el"
            style={{
              width: '14px', height: '14px', borderRadius: '50%',
              background: color, boxShadow: `0 0 12px ${color}`,
              flexShrink: 0, marginTop: '0.2rem',
            }}
          />
          {!isLast && (
            <div style={{
              width: '2px', flex: 1,
              background: `linear-gradient(to bottom, ${color}, rgba(168,240,255,0.1))`,
              marginTop: '4px', minHeight: '2rem',
            }} />
          )}
        </div>

        {/* Right: content */}
        <div style={{ paddingBottom: isLast ? 0 : '1rem', flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color, letterSpacing: '0.15em', marginBottom: '0.4rem' }}>
            PHASE {number} · SEM {semesters}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', marginBottom: '0.4rem', textTransform: 'uppercase', lineHeight: 1.2 }}>
            {title}
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 }}>
            {description}
          </p>
        </div>
      </div>
    );
  }

  /* Desktop: original 3-column alternating layout */
  return (
    <div
      className="phase-node-el"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 48px 1fr',
        gap: '0 1.5rem',
        position: 'relative',
      }}
    >
      {/* Left */}
      <div style={{ textAlign: 'right', paddingTop: '0.25rem' }}>
        {!isRight && <PhaseContent number={number} title={title} description={description} semesters={semesters} color={color} align="right" />}
      </div>

      {/* Centre */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="phase-dot-el" style={{ width: '16px', height: '16px', borderRadius: '50%', background: color, boxShadow: `0 0 16px ${color}, 0 0 32px ${color}40`, flexShrink: 0, marginTop: '0.25rem' }} />
        {!isLast && (
          <div style={{ width: '2px', flex: 1, background: `linear-gradient(to bottom, ${color}, rgba(168,240,255,0.1))`, marginTop: '4px' }} />
        )}
      </div>

      {/* Right */}
      <div style={{ paddingTop: '0.25rem' }}>
        {isRight && <PhaseContent number={number} title={title} description={description} semesters={semesters} color={color} align="left" />}
      </div>
    </div>
  );
}

function PhaseContent({ number, title, description, semesters, color, align }: {
  number: string; title: string; description: string; semesters: string; color: string; align: 'left' | 'right';
}) {
  return (
    <div style={{ textAlign: align }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color, letterSpacing: '0.2em', marginBottom: '0.5rem' }}>
        PHASE {number} · SEM {semesters}
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
        {title}
      </div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 }}>
        {description}
      </p>
    </div>
  );
}
