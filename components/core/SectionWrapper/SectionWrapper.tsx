'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';
import type { Act } from '@/lib/constants/narrative';

interface SectionWrapperProps {
  id: string;
  act: Act;
  className?: string;
  children: React.ReactNode;
  minHeight?: string;
}

export const SectionWrapper = forwardRef<HTMLElement, SectionWrapperProps>(
  function SectionWrapper({ id, act: _act, className, children, minHeight = '100vh' }, ref) {
    return (
      <section
        ref={ref}
        id={id}
        data-act={_act}
        className={cn('relative overflow-hidden', className)}
        // `height` (not `min-height`) so pinned sections are EXACTLY one
        // viewport tall. With `min-height`, any flow-positioned child made
        // the section grow past 100vh, which compounded into GSAP's
        // pin-spacer (height = section + pinDistance) and read as a black
        // tail of empty scroll after each pin released. Prop name kept as
        // `minHeight` since no caller overrides it — saves a rename pass.
        style={{ height: minHeight, background: 'var(--color-void)' }}
      >
        {/* Atmospheric grid */}
        <div
          aria-hidden="true"
          className="absolute inset-0 grid-atmosphere pointer-events-none"
          style={{ zIndex: 0 }}
        />
        {/* Inner wrapper takes full section height so absolute children fill correctly */}
        <div className="relative" style={{ zIndex: 1, height: minHeight }}>
          {children}
        </div>
      </section>
    );
  },
);
