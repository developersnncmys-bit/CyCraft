/* Soft glowing column of light that GSAP scrubs downward through the stats
 * constellation. Layered: outer soft halo + inner faint track + crisp active
 * beam. The active beam grows top-to-bottom on scroll. */
export function BeamTracer() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: '50%',
        top: '40%',
        height: '38%',
        width: '60px',
        marginLeft: '-30px',
        zIndex: 2,
        pointerEvents: 'none',
      }}
    >
      {/* Outer soft halo — wide, very faint, full-height ambient glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 50% 100% at 50% 50%, rgba(168,240,255,0.12) 0%, rgba(168,240,255,0.04) 40%, transparent 75%)',
          filter: 'blur(6px)',
        }}
      />

      {/* Inner track — faint static line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '50%',
          width: '1px',
          marginLeft: '-0.5px',
          background:
            'linear-gradient(to bottom, transparent, rgba(168,240,255,0.18), transparent)',
        }}
      />

      {/* Active beam — crisp glowing core scaled by GSAP */}
      <div
        className="beam-tracer-active"
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          width: '1.5px',
          marginLeft: '-0.75px',
          height: '100%',
          background:
            'linear-gradient(to bottom, rgba(168,240,255,0.9), var(--color-beam) 50%, rgba(168,240,255,0.6))',
          boxShadow:
            '0 0 6px var(--color-beam), 0 0 14px var(--color-beam-glow), 0 0 28px rgba(168,240,255,0.35)',
          filter: 'blur(0.4px)',
          transform: 'scaleY(0)',
          transformOrigin: 'top center',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
