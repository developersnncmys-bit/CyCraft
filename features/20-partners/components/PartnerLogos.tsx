/* Inline SVG partner logos — monochrome white, brand colour on hover.
 * Swap for real files in /public/images/partners/ when client provides them. */

interface LogoProps { color?: string }

/* SeciQ — shield + lock + wordmark */
export const SeciQLogo = ({ color = 'white' }: LogoProps) => (
  <svg viewBox="0 0 120 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M6 6 L16 4 L26 6 L26 18 Q26 26 16 30 Q6 26 6 18 Z"
      stroke={color} strokeWidth="1.6" fill="none" strokeLinejoin="round"/>
    <rect x="12" y="15" width="8" height="7" rx="1" stroke={color} strokeWidth="1.4" fill="none"/>
    <path d="M13 15 Q13 11 16 11 Q19 11 19 15" stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round"/>
    <text x="34" y="25" fontFamily="'JetBrains Mono',monospace" fontWeight="700"
      fontSize="16" fill={color} letterSpacing="1">SECIQ</text>
  </svg>
);

/* IBM — bold wordmark (IBM's primary identity is their name in their typeface) */
export const IBMLogo = ({ color = 'white' }: LogoProps) => (
  <svg viewBox="0 0 72 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <text
      x="4" y="24"
      fontFamily="'Arial Black', 'Arial', sans-serif"
      fontWeight="900"
      fontSize="26"
      fill={color}
      letterSpacing="-1"
    >
      IBM
    </text>
  </svg>
);

/* Cisco — 6 rounded vertical bars in arch/wave shape + wordmark */
export const CiscoLogo = ({ color = 'white' }: LogoProps) => {
  // 6 bars, arch heights: 8, 14, 20, 20, 14, 8
  const bars = [
    { x: 0,  h: 8,  y: 9  },
    { x: 10, h: 14, y: 6  },
    { x: 20, h: 20, y: 3  },
    { x: 30, h: 20, y: 3  },
    { x: 40, h: 14, y: 6  },
    { x: 50, h: 8,  y: 9  },
  ];
  return (
    <svg viewBox="0 0 85 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {bars.map((b) => (
        <rect key={b.x} x={b.x} y={b.y} width="6" height={b.h} rx="3" fill={color}/>
      ))}
      <text x="0" y="34" fontFamily="sans-serif" fontWeight="600"
        fontSize="11" fill={color} letterSpacing="4">cisco</text>
    </svg>
  );
};

/* Google — clean G monogram + wordmark */
export const GoogleLogo = ({ color = 'white' }: LogoProps) => (
  <svg viewBox="0 0 100 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    {/* Google G: circle arc + inner horizontal bar */}
    <path d="M22 17 L14 17 A10 10 0 1 1 24 7" stroke={color} strokeWidth="3"
      strokeLinecap="round" fill="none"/>
    <line x1="18" y1="17" x2="24" y2="17" stroke={color} strokeWidth="3" strokeLinecap="round"/>
    <text x="32" y="23" fontFamily="sans-serif" fontWeight="400"
      fontSize="15" fill={color} letterSpacing="0">Google</text>
  </svg>
);

/* HP — "hp" wordmark in ellipse */
export const HPLogo = ({ color = 'white' }: LogoProps) => (
  <svg viewBox="0 0 64 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="32" cy="17" rx="28" ry="14" stroke={color} strokeWidth="1.5"/>
    {/* h */}
    <path d="M18 11 L18 23 M18 17 Q22 14 26 17 L26 23"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    {/* p */}
    <path d="M30 17 L30 26 M30 17 Q38 14 38 20 Q38 26 30 23"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

/* McAfee — shield with check + wordmark */
export const McAfeeLogo = ({ color = 'white' }: LogoProps) => (
  <svg viewBox="0 0 110 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M5 5 L17 3 L29 5 L29 19 Q29 28 17 32 Q5 28 5 19 Z"
      stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
    <path d="M10 17 L15 22 L24 12"
      stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <text x="36" y="23" fontFamily="sans-serif" fontWeight="700"
      fontSize="14" fill={color}>McAfee</text>
  </svg>
);

/* Vodafone — quotation-mark / speech-bubble icon + wordmark
 * Their actual logo: thick open arc (like a C) with a small circle at the tail */
export const VodafoneLogo = ({ color = 'white' }: LogoProps) => (
  <svg viewBox="0 0 115 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    {/* Large open arc — ~300° circle, opens at bottom-right */}
    <path d="M25 6 A12 12 0 1 0 34 28" stroke={color} strokeWidth="3.5"
      strokeLinecap="round" fill="none"/>
    {/* Tail dot */}
    <circle cx="34" cy="28" r="3" fill={color}/>
    <text x="44" y="23" fontFamily="sans-serif" fontWeight="600"
      fontSize="13" fill={color}>Vodafone</text>
  </svg>
);

export const PARTNER_LOGOS: Record<string, React.FC<LogoProps>> = {
  seciq:    SeciQLogo,
  ibm:      IBMLogo,
  cisco:    CiscoLogo,
  google:   GoogleLogo,
  hp:       HPLogo,
  mcafee:   McAfeeLogo,
  vodafone: VodafoneLogo,
};
