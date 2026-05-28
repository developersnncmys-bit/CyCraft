/* Individual program detail card with progress bar.
 * GSAP targets .detail-bar-el for the scaleX: 0→1 animation. */
interface ProgramDetailCardProps {
  label: string;
  value: string;
  index: number;
}

export function ProgramDetailCard({ label, value, index }: ProgramDetailCardProps) {
  return (
    <div
      className={`detail-card-el detail-card-${index}`}
      style={{
        padding: '0.9rem 1rem',
        border: '1px solid rgba(168, 240, 255, 0.08)',
        background: 'var(--color-carbon)',
        opacity: 0,
        willChange: 'transform, opacity',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-tertiary)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: '0.35rem',
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-primary)',
          fontWeight: 500,
          marginBottom: '0.5rem',
          lineHeight: 1.35,
        }}
      >
        {value}
      </div>

      {/* Progress bar — [──────────] 100% */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: 'var(--color-terminal-dim)',
        }}
      >
        <span aria-hidden="true">[</span>
        <div
          style={{
            flex: 1,
            height: '1px',
            background: 'rgba(168,240,255,0.15)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            className="detail-bar-el"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'var(--color-terminal)',
              transform: 'scaleX(0)',
              transformOrigin: 'left',
              willChange: 'transform',
            }}
          />
        </div>
        <span aria-hidden="true">] 100%</span>
      </div>
    </div>
  );
}
