interface RoleNodeProps {
  label: string;
  domain: string;
  team: 'red' | 'blue';
  angle: number;
  radius: number;
}

export function RoleNode({ label, domain, team, angle, radius }: RoleNodeProps) {
  const rad = (angle * Math.PI) / 180;
  const x = Math.round(radius * Math.cos(rad));
  const y = Math.round(radius * Math.sin(rad));
  const color = team === 'red' ? 'var(--color-red-team)' : 'var(--color-blue-team)';

  return (
    <div
      className="role-node-el"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
        opacity: 0,
        textAlign: 'center',
        whiteSpace: 'nowrap',
      }}
    >
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 10px ${color}`,
          margin: '0 auto 0.35rem',
        }}
      />
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.55rem',
          color: 'var(--color-text-tertiary)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: '0.2rem',
        }}
      >
        {domain}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.72rem',
          color: 'var(--color-text-primary)',
          lineHeight: 1.2,
        }}
      >
        {label}
      </div>
    </div>
  );
}
