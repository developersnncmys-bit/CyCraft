'use client';
import type { CSSProperties } from 'react';

/* Shared decorative primitives for the research detail page sections.
 * Kept inline + tiny so each section can import what it needs without
 * pulling a bigger component tree. */

interface SectionMarkerProps {
  /** Two-digit chapter number, e.g. "03". */
  index: string;
  /** Uppercase token to display, e.g. "OVERVIEW". */
  label: string;
  className?: string;
  style?: CSSProperties;
}

/** `// 03_OVERVIEW` style chapter marker that sits above a section's h2. */
export function SectionMarker({ index, label, className, style }: SectionMarkerProps) {
  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.45rem',
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        letterSpacing: '0.22em',
        color: 'var(--color-beam)',
        textTransform: 'uppercase',
        marginBottom: '0.85rem',
        ...style,
      }}
    >
      <span aria-hidden="true" style={{ opacity: 0.55 }}>{'//'}</span>
      <span style={{ color: 'var(--color-text-tertiary)' }}>{index}</span>
      <span aria-hidden="true" style={{ opacity: 0.4 }}>_</span>
      <span>{label}</span>
      <span
        aria-hidden="true"
        style={{
          width: '22px',
          height: '1px',
          background: 'var(--color-beam)',
          boxShadow: '0 0 8px var(--color-beam-glow)',
          marginLeft: '0.25rem',
        }}
      />
    </div>
  );
}

/** Four decorative L-brackets at the corners of a relatively-positioned
 *  parent. Adds the cyber-style "framed" feel to plain card surfaces. */
export function CornerBrackets({
  size = 14,
  color = 'rgba(168,240,255,0.35)',
}: {
  size?: number;
  color?: string;
}) {
  const arm = `${size}px`;
  const thickness = '1px';
  const offset = '-1px';

  const baseCorner: CSSProperties = {
    position: 'absolute',
    width: arm,
    height: arm,
    pointerEvents: 'none',
  };

  return (
    <>
      <span
        aria-hidden="true"
        style={{
          ...baseCorner,
          top: offset,
          left: offset,
          borderTop: `${thickness} solid ${color}`,
          borderLeft: `${thickness} solid ${color}`,
        }}
      />
      <span
        aria-hidden="true"
        style={{
          ...baseCorner,
          top: offset,
          right: offset,
          borderTop: `${thickness} solid ${color}`,
          borderRight: `${thickness} solid ${color}`,
        }}
      />
      <span
        aria-hidden="true"
        style={{
          ...baseCorner,
          bottom: offset,
          left: offset,
          borderBottom: `${thickness} solid ${color}`,
          borderLeft: `${thickness} solid ${color}`,
        }}
      />
      <span
        aria-hidden="true"
        style={{
          ...baseCorner,
          bottom: offset,
          right: offset,
          borderBottom: `${thickness} solid ${color}`,
          borderRight: `${thickness} solid ${color}`,
        }}
      />
    </>
  );
}

/** Animated horizontal scan beam at the top of a section. Plays once on
 *  scroll-into-view via the existing `useSectionEnterBeam` hook from
 *  the home/_shared bundle. The element itself is intentionally absolutely
 *  positioned so it doesn't take layout space. */
export function SectionScanBeam() {
  return (
    <div
      aria-hidden="true"
      className="section-enter-beam"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background:
          'linear-gradient(to right, transparent, var(--color-beam), transparent)',
        boxShadow: '0 0 14px var(--color-beam-glow)',
        transformOrigin: 'left center',
        zIndex: 5,
        pointerEvents: 'none',
      }}
    />
  );
}
