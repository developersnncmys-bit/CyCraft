import { cn } from '@/lib/utils/cn';

interface BadgeProps {
  label: string;
  className?: string;
}

export function Badge({ label, className }: BadgeProps) {
  return (
    <span
      className={cn('inline-block font-mono text-xs uppercase tracking-[0.15em]', className)}
      style={{
        color: 'var(--color-beam)',
        borderBottom: '1px solid rgba(168,240,255,0.3)',
        paddingBottom: '2px',
      }}
    >
      // {label}
    </span>
  );
}
