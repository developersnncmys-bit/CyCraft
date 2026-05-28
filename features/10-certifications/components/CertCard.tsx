interface CertCardProps {
  name: string;
  description: string;
  advanced: boolean;
}

export function CertCard({ name, description, advanced }: CertCardProps) {
  return (
    <div
      style={{
        flexShrink: 0,
        width: '260px',
        padding: '1.5rem',
        border: '1px solid rgba(168,240,255,0.1)',
        background: 'var(--color-carbon)',
        position: 'relative',
      }}
    >
      {advanced && (
        <span
          style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            letterSpacing: '0.15em',
            color: 'var(--color-beam)',
            border: '1px solid rgba(168,240,255,0.3)',
            padding: '2px 6px',
            textTransform: 'uppercase',
          }}
        >
          ADVANCED
        </span>
      )}
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          color: 'var(--color-beam)',
          marginBottom: '0.5rem',
          letterSpacing: '0.05em',
        }}
      >
        {advanced ? '* ' : ''}{name}
      </p>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.5,
          margin: 0,
        }}
      >
        {description}
      </p>
    </div>
  );
}
