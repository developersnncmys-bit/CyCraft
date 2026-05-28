interface LabTileProps {
  title: string;
  description: string;
  team: 'red' | 'blue';
  index: number;
}

const ICONS: Record<string, string> = {
  'Red Team Lab': '⬡',
  'LLM Red Teaming & AI Defense': '⬡',
  'Malware Sandboxing': '⬡',
  'IoT Hardware Hacking': '⬡',
  'Blockchain Security Forge': '⬡',
  'Digital Forensics Bay': '⬡',
  'Cloud Security Range': '⬡',
  'Web & API Security Arena': '⬡',
  'Wireless Exploitation': '⬡',
};

export function LabTile({ title, description, team, index }: LabTileProps) {
  const color = team === 'red' ? 'var(--color-red-team)' : 'var(--color-blue-team)';
  const glow = team === 'red' ? 'var(--color-red-team-glow)' : 'var(--color-blue-team-glow)';
  void ICONS;

  return (
    <div
      className="lab-tile-el"
      role="listitem"
      style={{
        position: 'relative',
        padding: '0.65rem 0.85rem',
        border: `1px solid ${team === 'red' ? 'rgba(255,61,90,0.15)' : 'rgba(61,168,255,0.15)'}`,
        background: `${team === 'red' ? 'rgba(255,61,90,0.02)' : 'rgba(61,168,255,0.02)'}`,
        cursor: 'default',
        transition: 'border-color 0.3s, background 0.3s',
        animationDelay: `${index * 0.1}s`,
        minHeight: '100px',
        maxHeight: '130px',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = color;
        el.style.background = `${team === 'red' ? 'rgba(255,61,90,0.06)' : 'rgba(61,168,255,0.06)'}`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = team === 'red' ? 'rgba(255,61,90,0.15)' : 'rgba(61,168,255,0.15)';
        el.style.background = team === 'red' ? 'rgba(255,61,90,0.02)' : 'rgba(61,168,255,0.02)';
      }}
    >
      {/* Top row: pulsing indicator + team label, aligned at the top */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.3rem',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            display: 'inline-block',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: color,
            boxShadow: `0 0 6px ${glow}`,
            animation: `beam-pulse ${2 + (index % 3) * 0.4}s ease-in-out infinite`,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            letterSpacing: '0.15em',
            color,
            textTransform: 'uppercase',
            opacity: 0.7,
          }}
        >
          {team === 'red' ? 'RED' : 'BLUE'}
        </span>
      </div>

      <h3
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.78rem',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          margin: '0 0 0.2rem',
          letterSpacing: '0.02em',
          lineHeight: 1.2,
          minHeight: '2.2em', /* 2 lines reserved so descriptions align across the grid */
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.68rem',
          color: 'var(--color-text-secondary)',
          margin: 0,
          lineHeight: 1.35,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {description}
      </p>
    </div>
  );
}
