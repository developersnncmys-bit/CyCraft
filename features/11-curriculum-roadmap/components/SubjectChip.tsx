interface SubjectChipProps {
  label: string;
}

export function SubjectChip({ label }: SubjectChipProps) {
  return (
    <span
      className="subject-chip-el"
      style={{
        display: 'inline-block',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.65rem',
        letterSpacing: '0.05em',
        color: 'var(--color-text-secondary)',
        background: 'rgba(168,240,255,0.04)',
        border: '1px solid rgba(168,240,255,0.1)',
        padding: '3px 8px',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}
