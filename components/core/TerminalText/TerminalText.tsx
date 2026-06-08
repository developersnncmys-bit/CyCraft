'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

interface TerminalTextProps {
  lines: string[];
  cursor?: boolean;
  speed?: number;
  startDelay?: number;
  onComplete?: () => void;
  variant?: 'mono' | 'glow';
  className?: string;
  /** When false, typing is held — useful for scroll-gated reveal. Defaults to true. */
  start?: boolean;
}

export function TerminalText({
  lines,
  cursor = true,
  speed = 25,
  startDelay = 0,
  onComplete,
  variant = 'mono',
  className,
  start = true,
}: TerminalTextProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [done, setDone] = useState(false);
  const reducedMotion = useReducedMotion();
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (reducedMotion) {
      setDisplayedLines(lines);
      setDone(true);
      onCompleteRef.current?.();
      return;
    }

    if (!start) return;

    const delay = setTimeout(() => {
      if (currentLine >= lines.length) {
        setDone(true);
        onCompleteRef.current?.();
        return;
      }

      const line = lines[currentLine];

      if (currentChar < line.length) {
        const t = setTimeout(() => {
          setDisplayedLines((prev) => {
            const next = [...prev];
            next[currentLine] = (next[currentLine] ?? '') + line[currentChar];
            return next;
          });
          setCurrentChar((c) => c + 1);
        }, 1000 / speed);
        return () => clearTimeout(t);
      } else {
        setCurrentLine((l) => l + 1);
        setCurrentChar(0);
      }
    }, currentLine === 0 && currentChar === 0 ? startDelay * 1000 : 0);

    return () => clearTimeout(delay);
  }, [currentLine, currentChar, lines, speed, startDelay, reducedMotion, start]);

  // Dual-layer 8px+20px shadow was too hot — terminal text read as a neon
  // blur on the program-overview section (sole consumer). Single 3px shadow
  // keeps the CRT/terminal character without lighting the surrounding pixels.
  const glowStyle: React.CSSProperties =
    variant === 'glow'
      ? { textShadow: '0 0 3px rgba(0,255,148,0.55)' }
      : {};

  return (
    <div
      className={cn('font-mono text-sm leading-relaxed', className)}
      style={{ color: 'var(--color-terminal)', ...glowStyle }}
      aria-label={lines.join(' ')}
    >
      {displayedLines.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
      {cursor && !done && (
        <span
          style={{ animation: 'cursor-blink 1s step-end infinite' }}
          aria-hidden="true"
        >
          ▊
        </span>
      )}
    </div>
  );
}
