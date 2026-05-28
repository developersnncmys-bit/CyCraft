'use client';
/* HackerHouse — CSS 3D rotating cyber-shield
 * Hex shield + orbiting threat nodes + scan sweep + pulse rings.
 * Pure SVG + CSS keyframes. No external libs, no layout overflow. */

export function HackerHouse() {
  return (
    <div
      className="hacker-house-el"
      style={{ position: 'relative', width: '260px', height: '300px', margin: '0 auto', willChange: 'transform' }}
    >
      <style>{`
        @keyframes hh-orbit {
          from { transform: rotate(0deg) translateX(108px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(108px) rotate(-360deg); }
        }
        @keyframes hh-orbit-rev {
          from { transform: rotate(0deg) translateX(76px) rotate(0deg); }
          to   { transform: rotate(-360deg) translateX(76px) rotate(360deg); }
        }
        @keyframes hh-sway {
          0%,100% { transform: rotateX(10deg) rotateY(-6deg); }
          50%     { transform: rotateX(14deg) rotateY(6deg); }
        }
        @keyframes hh-ring-1 {
          0%   { transform: scale(0.9); opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes hh-ring-2 {
          0%   { transform: scale(0.9); opacity: 0.4; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes hh-scan {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes hh-blink {
          0%,100% { opacity: 1; } 50% { opacity: 0; }
        }
        @keyframes hh-pulse-dot {
          0%,100% { opacity: 1; box-shadow: 0 0 6px currentColor; }
          50%     { opacity: 0.5; box-shadow: 0 0 12px currentColor; }
        }
      `}</style>

      {/* 3D perspective tilt — slow sway to feel holographic */}
      <div style={{ perspective: '600px', perspectiveOrigin: '50% 40%', width: '100%', height: '100%' }}>
        <div style={{ animation: 'hh-sway 7s ease-in-out infinite', transformStyle: 'preserve-3d', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

          {/* ── Shield SVG ── */}
          <svg viewBox="0 0 240 270" style={{ width: '240px', height: '270px', overflow: 'visible' }} aria-label="Cyber defence shield">
            <defs>
              {/* Hex shield clip */}
              <clipPath id="shield-clip">
                <polygon points="120,8 210,55 210,175 120,222 30,175 30,55" />
              </clipPath>
              {/* Glow filters */}
              <filter id="sh-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="sh-glow-sm" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>

              {/* Hex grid pattern inside the shield */}
              <pattern id="hex-pattern" x="0" y="0" width="20" height="23.1" patternUnits="userSpaceOnUse">
                <polygon points="10,0 20,5.77 20,17.32 10,23.1 0,17.32 0,5.77"
                  fill="none" stroke="rgba(168,240,255,0.07)" strokeWidth="0.5" />
              </pattern>

              {/* Radial gradient fill for shield body */}
              <radialGradient id="shield-fill" cx="50%" cy="45%" r="60%">
                <stop offset="0%" stopColor="rgba(168,240,255,0.06)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.0)" />
              </radialGradient>
            </defs>

            {/* Pulse rings behind shield */}
            <polygon points="120,8 210,55 210,175 120,222 30,175 30,55"
              fill="none" stroke="rgba(168,240,255,0.3)" strokeWidth="1"
              style={{ transformOrigin: '120px 115px', animation: 'hh-ring-1 2.4s ease-out infinite' }} />
            <polygon points="120,8 210,55 210,175 120,222 30,175 30,55"
              fill="none" stroke="rgba(168,240,255,0.2)" strokeWidth="1"
              style={{ transformOrigin: '120px 115px', animation: 'hh-ring-2 2.4s ease-out infinite 0.8s' }} />

            {/* Shield body */}
            <polygon points="120,8 210,55 210,175 120,222 30,175 30,55"
              fill="url(#shield-fill)" />

            {/* Hex grid inside */}
            <rect x="30" y="8" width="180" height="214" fill="url(#hex-pattern)" clipPath="url(#shield-clip)" />

            {/* Shield border — glowing */}
            <polygon points="120,8 210,55 210,175 120,222 30,175 30,55"
              fill="none" stroke="#a8f0ff" strokeWidth="1.5"
              filter="url(#sh-glow)" />
            <polygon points="120,8 210,55 210,175 120,222 30,175 30,55"
              fill="none" stroke="rgba(168,240,255,0.4)" strokeWidth="0.5" />

            {/* Rotating scan line (conic sweep inside shield) */}
            <g style={{ transformOrigin: '120px 115px', animation: 'hh-scan 4s linear infinite' }} clipPath="url(#shield-clip)">
              <line x1="120" y1="115" x2="120" y2="8"
                stroke="rgba(168,240,255,0.35)" strokeWidth="1" filter="url(#sh-glow-sm)" />
              <polygon points="120,115 108,8 132,8"
                fill="rgba(168,240,255,0.04)" />
            </g>

            {/* ── Centre lock icon ── */}
            <g filter="url(#sh-glow)">
              {/* Lock body */}
              <rect x="106" y="110" width="28" height="22" rx="3"
                fill="rgba(168,240,255,0.12)" stroke="#a8f0ff" strokeWidth="1.2" />
              {/* Lock shackle */}
              <path d="M111,110 L111,103 Q120,96 129,103 L129,110"
                fill="none" stroke="#a8f0ff" strokeWidth="1.2" />
              {/* Keyhole */}
              <circle cx="120" cy="119" r="3.5" fill="rgba(168,240,255,0.3)" stroke="#a8f0ff" strokeWidth="0.8" />
              <rect x="118.5" y="119" width="3" height="6" rx="0.5" fill="#a8f0ff" />
            </g>

            {/* ── Threat indicators on shield perimeter ── */}
            {/* Top-right threat */}
            <g filter="url(#sh-glow-sm)">
              <circle cx="185" cy="68" r="5" fill="rgba(255,61,90,0.15)" stroke="#ff3d5a" strokeWidth="1">
                <animate attributeName="r" values="5;8;5" dur="1.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.4;1" dur="1.8s" repeatCount="indefinite" />
              </circle>
              <circle cx="185" cy="68" r="2.5" fill="#ff3d5a" />
            </g>
            {/* Bottom-left threat */}
            <g filter="url(#sh-glow-sm)">
              <circle cx="58" cy="162" r="4" fill="rgba(255,61,90,0.15)" stroke="#ff3d5a" strokeWidth="1">
                <animate attributeName="r" values="4;7;4" dur="2.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.3;1" dur="2.2s" repeatCount="indefinite" />
              </circle>
              <circle cx="58" cy="162" r="2" fill="#ff3d5a" />
            </g>
            {/* Top threat label */}
            <text x="192" y="58" fill="rgba(255,61,90,0.8)" fontSize="6" fontFamily="'JetBrains Mono',monospace" letterSpacing="0.1em">BREACH</text>
            <text x="192" y="66" fill="rgba(255,61,90,0.8)" fontSize="6" fontFamily="'JetBrains Mono',monospace" letterSpacing="0.1em">ATTEMPT</text>

            {/* ── Attack lines ── */}
            <line x1="185" y1="68" x2="130" y2="108" stroke="rgba(255,61,90,0.3)" strokeWidth="0.8" strokeDasharray="4 3">
              <animate attributeName="stroke-dashoffset" from="0" to="-28" dur="1s" repeatCount="indefinite" />
            </line>
            <line x1="58" y1="162" x2="110" y2="122" stroke="rgba(255,61,90,0.3)" strokeWidth="0.8" strokeDasharray="4 3">
              <animate attributeName="stroke-dashoffset" from="0" to="-28" dur="1.4s" repeatCount="indefinite" />
            </line>

            {/* BLOCKED labels on the lines */}
            <text x="148" y="84" fill="rgba(0,255,148,0.7)" fontSize="5.5" fontFamily="'JetBrains Mono',monospace" letterSpacing="0.1em">BLOCKED</text>
            <text x="70" y="145" fill="rgba(0,255,148,0.7)" fontSize="5.5" fontFamily="'JetBrains Mono',monospace" letterSpacing="0.1em">BLOCKED</text>

            {/* Shield label */}
            <text x="120" y="146" textAnchor="middle" fill="rgba(168,240,255,0.5)" fontSize="6" fontFamily="'JetBrains Mono',monospace" letterSpacing="0.12em">DEFENSE ACTIVE</text>

            {/* Bottom status */}
            <text x="120" y="248" textAnchor="middle" fill="rgba(168,240,255,0.3)" fontSize="6" fontFamily="'JetBrains Mono',monospace" letterSpacing="0.12em">
              CYCRAFT · RED TEAM OPS
            </text>
          </svg>

        </div>
      </div>

      {/* Glow pool beneath shield */}
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: '-12px', left: '50%',
        transform: 'translateX(-50%)',
        width: '160px', height: '30px',
        background: 'radial-gradient(ellipse, rgba(168,240,255,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}
