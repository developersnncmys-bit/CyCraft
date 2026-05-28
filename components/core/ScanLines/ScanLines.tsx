import { cn } from '@/lib/utils/cn';

interface ScanLinesProps {
  className?: string;
}

export function ScanLines({ className }: ScanLinesProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('absolute inset-0 pointer-events-none', className)}
      style={{
        backgroundImage:
          'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.04) 3px, rgba(255,255,255,0.04) 4px)',
        zIndex: 1,
      }}
    />
  );
}
