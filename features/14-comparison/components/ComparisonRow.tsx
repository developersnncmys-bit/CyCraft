'use client';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';

interface ComparisonRowProps {
  label: string;
  traditional: string;
  cycraft: string;
}

export function ComparisonRow({ label, traditional, cycraft }: ComparisonRowProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (!isDesktop) {
    /* Mobile: stack label → traditional → cycraft vertically */
    return (
      <div
        className="comparison-row-el"
        style={{ opacity: 0, transform: 'translateY(16px)', borderBottom: '1px solid rgba(168,240,255,0.06)' }}
      >
        {/* Category label */}
        <div style={{ padding: '0.6rem 1rem', background: 'rgba(168,240,255,0.03)', borderBottom: '1px solid rgba(168,240,255,0.04)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.15em', color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>
            {label}
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          {/* Traditional */}
          <div style={{ padding: '0.9rem 1rem', borderRight: '1px solid rgba(168,240,255,0.04)', background: 'rgba(255,255,255,0.01)' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-disabled)', margin: 0, lineHeight: 1.5 }}>
              {traditional}
            </p>
          </div>
          {/* CyCraft */}
          <div style={{ padding: '0.9rem 1rem', background: 'rgba(168,240,255,0.02)' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', margin: 0, lineHeight: 1.5 }}>
              {cycraft}
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* Desktop: original 3-column layout */
  return (
    <div
      className="comparison-row-el"
      style={{ display: 'grid', gridTemplateColumns: '1fr 120px 1fr', gap: '0 1px', opacity: 0, transform: 'translateY(16px)' }}
    >
      <div style={{ padding: '0.85rem 1.25rem', background: 'rgba(255,255,255,0.01)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-disabled)', margin: 0, lineHeight: 1.5 }}>
          {traditional}
        </p>
      </div>
      <div style={{ width: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(168,240,255,0.03)', borderBottom: '1px solid rgba(168,240,255,0.06)', borderLeft: '1px solid rgba(168,240,255,0.06)', borderRight: '1px solid rgba(168,240,255,0.06)', padding: '0.5rem' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.15em', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', textAlign: 'center' }}>
          {label}
        </span>
      </div>
      <div style={{ padding: '0.85rem 1.25rem', background: 'rgba(168,240,255,0.02)', borderBottom: '1px solid rgba(168,240,255,0.06)' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', margin: 0, lineHeight: 1.5 }}>
          {cycraft}
        </p>
      </div>
    </div>
  );
}
