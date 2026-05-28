'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { cn } from '@/lib/utils/cn';
import styles from './ParallaxLayer.module.css';

/* Speed multipliers per depth level */
const DEPTH_SPEED: Record<1 | 2 | 3 | 4 | 5, number> = {
  1: 0.2,
  2: 0.5,
  3: 1.0,
  4: 1.2,
  5: 1.5,
};

interface ParallaxLayerProps {
  depth: 1 | 2 | 3 | 4 | 5;
  scrub?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function ParallaxLayer({
  depth,
  scrub = true,
  className,
  children,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  useGSAP(
    () => {
      if (!ref.current || reducedMotion || !isDesktop || !scrub) return;

      /* Depth 3 = natural scroll speed (no transform) */
      if (depth === 3) return;

      const speed = DEPTH_SPEED[depth];
      const direction = depth < 3 ? 1 : -1;
      const yPercent = direction * (1 - speed) * 30;

      gsap.to(ref.current, {
        yPercent,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        } as ScrollTrigger.Vars,
      });
    },
    { scope: ref, dependencies: [depth, reducedMotion, isDesktop, scrub] },
  );

  return (
    <div ref={ref} className={cn(styles.layer, className)}>
      {children}
    </div>
  );
}
