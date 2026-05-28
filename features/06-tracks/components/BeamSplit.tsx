/* BeamSplit — THE permanent red/blue split moment (Act III opening).
 * GSAP targets: .split-h-beam, .split-red-beam, .split-blue-beam */
export function BeamSplit() {
  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}
    >
      {/* Horizontal sweeping beam — grows from left to center then fades */}
      <div
        className="split-h-beam"
        style={{
          position: 'absolute',
          top: '42%',
          left: 0,
          width: '50%',
          height: '2px',
          background: 'linear-gradient(to right, transparent, var(--color-beam), var(--color-beam))',
          transformOrigin: 'left',
          transform: 'scaleX(0)',
          opacity: 0,
          willChange: 'transform, opacity',
        }}
      />

      {/* Red beam — diagonal upper-left from center */}
      <div
        className="split-red-beam"
        style={{
          position: 'absolute',
          top: '42%',
          left: '50%',
          width: '2px',
          height: '280px',
          background: 'linear-gradient(to bottom, var(--color-red-team), transparent)',
          boxShadow: '0 0 12px var(--color-red-team-glow)',
          transformOrigin: 'top center',
          transform: 'rotate(-35deg)',
          opacity: 0,
          willChange: 'transform, opacity',
        }}
      />

      {/* Blue beam — diagonal lower-right from center */}
      <div
        className="split-blue-beam"
        style={{
          position: 'absolute',
          top: '42%',
          left: '50%',
          width: '2px',
          height: '280px',
          background: 'linear-gradient(to bottom, var(--color-blue-team), transparent)',
          boxShadow: '0 0 12px var(--color-blue-team-glow)',
          transformOrigin: 'top center',
          transform: 'rotate(35deg)',
          opacity: 0,
          willChange: 'transform, opacity',
        }}
      />

      {/* Split flash point */}
      <div
        className="split-flash-el"
        style={{
          position: 'absolute',
          top: 'calc(42% - 5px)',
          left: 'calc(50% - 5px)',
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: 'var(--color-beam-core)',
          boxShadow: '0 0 20px var(--color-beam), 0 0 40px var(--color-beam-glow)',
          opacity: 0,
          willChange: 'transform, opacity',
        }}
      />
    </div>
  );
}
