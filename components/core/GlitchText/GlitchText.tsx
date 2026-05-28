'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils/cn';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

interface GlitchTextProps {
  children: React.ReactNode;
  className?: string;
}

export function GlitchText({ children, className }: GlitchTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    const schedule = () => {
      const delay = 4000 + Math.random() * 3000;
      return setTimeout(() => {
        const el = containerRef.current;
        if (!el) return;

        const redLayer = el.querySelector<HTMLElement>('[data-glitch="red"]');
        const cyanLayer = el.querySelector<HTMLElement>('[data-glitch="cyan"]');
        if (!redLayer || !cyanLayer) return;

        const offsetX = (Math.random() - 0.5) * 6;
        const offsetY = (Math.random() - 0.5) * 2;

        redLayer.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        cyanLayer.style.transform = `translate(${-offsetX}px, ${-offsetY}px)`;
        redLayer.style.opacity = '0.8';
        cyanLayer.style.opacity = '0.8';

        setTimeout(() => {
          if (!redLayer || !cyanLayer) return;
          redLayer.style.transform = 'translate(0,0)';
          cyanLayer.style.transform = 'translate(0,0)';
          redLayer.style.opacity = '0';
          cyanLayer.style.opacity = '0';
          timeoutId = schedule();
        }, 50);
      }, delay);
    };

    let timeoutId = schedule();
    return () => clearTimeout(timeoutId);
  }, [reducedMotion]);

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      {/* Red layer */}
      <span
        data-glitch="red"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          color: 'var(--color-red-team)',
          mixBlendMode: 'screen',
          opacity: 0,
          transition: 'transform 0.05s, opacity 0.05s',
          pointerEvents: 'none',
        }}
      >
        {children}
      </span>

      {/* Cyan layer */}
      <span
        data-glitch="cyan"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          color: 'var(--color-beam)',
          mixBlendMode: 'screen',
          opacity: 0,
          transition: 'transform 0.05s, opacity 0.05s',
          pointerEvents: 'none',
        }}
      >
        {children}
      </span>

      {/* Primary layer */}
      <span style={{ position: 'relative' }}>{children}</span>
    </div>
  );
}
