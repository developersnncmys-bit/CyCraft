'use client';
/* Mac-style terminal chrome wrapping TerminalText.
 * When typing completes, fires onComplete to reveal the detail cards. */
import { TerminalText } from '@/components/core/TerminalText/TerminalText';

interface TerminalWindowProps {
  prompt: string;
  lines: readonly string[];
  onComplete?: () => void;
  /** When false, holds the terminal idle (chrome visible, no typing). */
  start?: boolean;
}

const DOT_COLORS = ['#ff5f56', '#ffbd2e', '#27c93f'] as const;

export function TerminalWindow({ prompt, lines, onComplete, start = true }: TerminalWindowProps) {
  return (
    <div
      style={{
        background: 'var(--color-carbon)',
        border: '1px solid rgba(168, 240, 255, 0.1)',
        maxWidth: '680px',
        margin: '0 auto',
        boxShadow: '0 0 60px rgba(168, 240, 255, 0.04), 0 20px 60px rgba(0,0,0,0.5)',
      }}
      role="region"
      aria-label="Terminal — program overview"
    >
      {/* Title bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '10px 14px',
          borderBottom: '1px solid rgba(168, 240, 255, 0.06)',
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        {DOT_COLORS.map((color) => (
          <div
            key={color}
            aria-hidden="true"
            style={{ width: '10px', height: '10px', borderRadius: '50%', background: color }}
          />
        ))}
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--color-text-disabled)',
            marginLeft: '8px',
            letterSpacing: '0.05em',
          }}
        >
          root@cycraft — bash
        </span>
      </div>

      {/* Terminal body */}
      <div style={{ padding: '0.9rem 1.25rem', minHeight: '130px' }}>
        {/* Prompt line (static) */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-terminal-dim)',
            marginBottom: '0.5rem',
          }}
        >
          {prompt}
        </div>

        {/* Animated terminal output */}
        <TerminalText
          lines={lines as unknown as string[]}
          speed={30}
          startDelay={0.3}
          onComplete={onComplete}
          variant="glow"
          start={start}
        />
      </div>
    </div>
  );
}
