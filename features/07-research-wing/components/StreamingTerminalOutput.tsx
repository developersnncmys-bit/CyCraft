'use client';
/* Continuously streams fake security tool output — creates the "alive workstation" effect.
 * Uses setInterval for content generation (not animation — compliant with spec rule). */
import { useEffect, useRef } from 'react';

interface StreamingTerminalOutputProps {
  lines: readonly string[];
}

const MAX_VISIBLE_LINES = 12;

export function StreamingTerminalOutput({ lines }: StreamingTerminalOutputProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Seed with first few lines immediately
    const seed = lines.slice(0, 4);
    seed.forEach((text) => {
      const el = document.createElement('div');
      el.textContent = text;
      container.appendChild(el);
    });
    indexRef.current = 4;

    const id = setInterval(() => {
      const text = lines[indexRef.current % lines.length];
      indexRef.current += 1;

      const el = document.createElement('div');
      el.textContent = `${text}`;
      container.appendChild(el);

      // Trim to max visible lines for perf
      while (container.children.length > MAX_VISIBLE_LINES) {
        container.removeChild(container.firstChild!);
      }

      // Keep scroll at bottom
      container.scrollTop = container.scrollHeight;
    }, 1400);

    return () => clearInterval(id);
  }, [lines]);

  return (
    <div
      ref={containerRef}
      aria-label="Live terminal output"
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        color: 'var(--color-terminal)',
        lineHeight: 1.7,
        overflow: 'hidden',
        maxHeight: '200px',
        wordBreak: 'break-all',
      }}
    />
  );
}
