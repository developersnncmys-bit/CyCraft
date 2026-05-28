/* 6-sided prism at the center of the specialization hex.
 * GSAP target: .prism-hex-el (rotate 60° on entry) */
export function Prism() {
  return (
    <div
      className="prism-hex-el"
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 5,
        willChange: 'transform',
      }}
    >
      <svg width="64" height="72" viewBox="0 0 64 72" fill="none">
        {/* Hex shape */}
        <polygon
          points="32,4 60,19 60,53 32,68 4,53 4,19"
          fill="rgba(168,240,255,0.06)"
          stroke="var(--color-beam)"
          strokeWidth="1.5"
        />
        {/* Inner hex */}
        <polygon
          points="32,14 52,25 52,47 32,58 12,47 12,25"
          fill="rgba(168,240,255,0.04)"
          stroke="rgba(168,240,255,0.3)"
          strokeWidth="1"
        />
        {/* Center glow dot */}
        <circle
          cx="32"
          cy="36"
          r="6"
          fill="var(--color-beam)"
          style={{ filter: 'drop-shadow(0 0 8px var(--color-beam-glow))' }}
        />
      </svg>
    </div>
  );
}
