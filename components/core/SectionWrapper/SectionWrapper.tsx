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
        style={{ minHeight, background: 'var(--color-void)' }}
      >
        {/* Atmospheric grid */}
        <div
          aria-hidden="true"
          className="absolute inset-0 grid-atmosphere pointer-events-none"
          style={{ zIndex: 0 }}
        />
        {/* Inner wrapper takes full section height so absolute children fill correctly */}
        <div className="relative" style={{ zIndex: 1, minHeight }}>
          {children}
        </div>
      </section>
    );
  },
);
