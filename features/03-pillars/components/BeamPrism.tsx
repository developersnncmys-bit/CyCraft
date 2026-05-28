/* BeamPrism — the showpiece of the page.
 *
 * Geometry (CINEMA_SPEC §7.3):
 *   - Descend beam: vertical line from section top to the prism point (top 30%).
 *   - Prism gem: small diamond at the descent endpoint.
 *   - Three rails: SVG <line> elements that draw themselves via stroke-dashoffset.
 *     Fan from a single point at the prism, two side rails angle ±26°, all 280
 *     SVG units long. pathLength="1" normalises so strokeDasharray="1" /
 *     strokeDashoffset 1→0 reveals each line from top to bottom.
 *   - Continuation beam: vertical line below the prism that emerges during the
 *     reform window (0.80–1.00) as a foreshadow into the philosophy section.
 *
 * Rails sit inside an SVG with viewBox 1000×280 and preserveAspectRatio
 * "xMidYMin meet". The SVG scales to container width; lines remain centred. */
export function BeamPrism() {
  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', top: '22%', left: 0, right: 0, height: '78%', pointerEvents: 'none' }}
    >
      {/* Descend beam — short connector above the gem, clear of the headline */}
      <div
        className="pillars-descend-beam"
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          marginLeft: '-1px',
          width: '2px',
          height: '14%',
          background:
            'linear-gradient(to bottom, rgba(168, 240, 255, 0.55), var(--color-beam))',
          boxShadow: '0 0 10px var(--color-beam-glow), 0 0 4px var(--color-beam)',
          transformOrigin: 'top center',
          transform: 'scaleY(0)',
          opacity: 0,
          willChange: 'transform, opacity',
        }}
      />

      {/* Prism gem — sits just below the headline / description, above the rails */}
      <div
        className="beam-prism-gem"
        style={{
          position: 'absolute',
          top: 'calc(14% - 6px)',
          left: '50%',
          marginLeft: '-6px',
          width: '12px',
          height: '12px',
          background: 'var(--color-beam)',
          transform: 'rotate(45deg) scale(0)',
          boxShadow: '0 0 16px var(--color-beam-glow), 0 0 40px var(--color-beam)',
          opacity: 0,
          willChange: 'transform, opacity',
        }}
      />

      {/* Rails SVG — anchored to prism point.
          Rails shortened from 280 → 180 units so they terminate above the
          card row instead of crossing into the cards visually. */}
      <svg
        className="prism-svg"
        width="100%"
        height="180"
        viewBox="0 0 1000 180"
        preserveAspectRatio="xMidYMin meet"
        style={{ position: 'absolute', top: '14%', left: 0, right: 0 }}
      >
        <defs>
          <linearGradient id="prism-rail-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-beam)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--color-beam)" stopOpacity="0" />
          </linearGradient>
          <filter id="prism-rail-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        {/* Soft glow under-layer for each rail (no animation) */}
        <g filter="url(#prism-rail-glow)" opacity="0.55">
          <line x1="500" y1="0" x2="421" y2="162" stroke="var(--color-beam-glow)" strokeWidth="3" className="prism-rail-glow-0" pathLength="1" strokeDasharray="1" strokeDashoffset="1" />
          <line x1="500" y1="0" x2="500" y2="180" stroke="var(--color-beam-glow)" strokeWidth="3" className="prism-rail-glow-1" pathLength="1" strokeDasharray="1" strokeDashoffset="1" />
          <line x1="500" y1="0" x2="579" y2="162" stroke="var(--color-beam-glow)" strokeWidth="3" className="prism-rail-glow-2" pathLength="1" strokeDasharray="1" strokeDashoffset="1" />
        </g>

        {/* Sharp core line — the rail itself */}
        <line className="prism-rail-0" x1="500" y1="0" x2="421" y2="162" stroke="url(#prism-rail-gradient)" strokeWidth="2" pathLength="1" strokeDasharray="1" strokeDashoffset="1" strokeLinecap="round" />
        <line className="prism-rail-1" x1="500" y1="0" x2="500" y2="180" stroke="url(#prism-rail-gradient)" strokeWidth="2" pathLength="1" strokeDasharray="1" strokeDashoffset="1" strokeLinecap="round" />
        <line className="prism-rail-2" x1="500" y1="0" x2="579" y2="162" stroke="url(#prism-rail-gradient)" strokeWidth="2" pathLength="1" strokeDasharray="1" strokeDashoffset="1" strokeLinecap="round" />
      </svg>

      {/* Continuation beam — emerges below the prism during reform (0.80–1.00) */}
      <div
        className="pillars-continuation-beam"
        style={{
          position: 'absolute',
          top: 'calc(14% + 6px)',
          left: '50%',
          marginLeft: '-1px',
          width: '2px',
          height: '86%',
          background: 'linear-gradient(to bottom, var(--color-beam), transparent)',
          boxShadow: '0 0 8px var(--color-beam-glow)',
          transformOrigin: 'top center',
          transform: 'scaleY(0)',
          opacity: 0,
          willChange: 'transform, opacity',
        }}
      />
    </div>
  );
}
