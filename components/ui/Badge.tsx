import { cn } from '@/lib/utils/cn';

interface BadgeProps {
  label: string;
  className?: string;
}

export function Badge({ label, className }: BadgeProps) {
  return (
    <span
      className={cn('font-mono text-xs uppercase tracking-[0.15em]', className)}
      style={{
        // Block instead of inline-block so the label takes its full
        // container width and wraps cleanly. A previous inline-block
        // attempt with max-width:100% wasn't wrapping long labels like
        // "CYBERSECURITY · TRAINING · RESEARCH" — switching to block
        // is the simpler, guaranteed-correct layout.
        display: 'block',
        color: 'var(--color-beam)',
        borderBottom: '1px solid rgba(168,240,255,0.3)',
        paddingBottom: '2px',
        maxWidth: '100%',
        whiteSpace: 'normal',
        wordSpacing: 'normal',
        overflowWrap: 'break-word',
      }}
    >
      // {label}
    </span>
  );
}
