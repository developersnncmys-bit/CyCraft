'use client';
/* Individual stat node — GSAP targets .stat-value-el for counter animation */
interface StatWaypointProps {
  value: number;
  suffix: string;
  label: string;
  index: number;
}

export function StatWaypoint({ value, suffix, label, index }: StatWaypointProps) {
  return (
    <div
      className={`stat-waypoint-el stat-waypoint-${index}`}
      data-target={value}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        opacity: 0,
        willChange: 'transform, opacity',
      }}
    >
      {/* Glow ring behind the number */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(168,240,255,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative' }}>
        <span
          className="stat-value-el"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700,
            color: 'var(--color-beam)',
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
            fontFeatureSettings: '"zero" 0',
            display: 'block',
            textShadow: '0 0 30px var(--color-beam-glow)',
          }}
        >
          0
        </span>
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: '-0.6em',
            top: 0,
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1rem, 2vw, 1.5rem)',
            fontWeight: 700,
            color: 'var(--color-beam)',
          }}
        >
          {suffix}
        </span>
      </div>

      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-tertiary)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>

      {/* Beam-lit bottom line — fills when active */}
      <div
        className="stat-underline-el"
        style={{
          width: '40px',
          height: '1px',
          background: 'var(--color-beam)',
          opacity: 0.3,
          transform: 'scaleX(0)',
          transformOrigin: 'left',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
