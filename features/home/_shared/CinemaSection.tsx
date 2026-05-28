'use client';
import { forwardRef, type ReactNode, type CSSProperties } from 'react';
import { cn } from '@/lib/utils/cn';

interface CinemaSectionProps {
  id: string;
  ariaLabel?: string;
  /** When pinned, this is the outer "track" height that the inner camera pins through. */
  className?: string;
  /** Inline style override on the outer track. */
  style?: CSSProperties;
  /** The pinned camera viewport — 100vh, holds while outer track scrolls. */
  cameraClassName?: string;
  cameraStyle?: CSSProperties;
  children: ReactNode;
}

/**
 * Outer track + inner pinned camera.
 *
 * The outer <section> is the trigger and provides the scroll length. The
 * inner `.cinema-camera` is 100vh tall and is what gets pinned by GSAP.
 * Per-section hooks call `makePinnedTimeline({ trigger: outerRef, end: PIN_DURATIONS.xxx })`
 * and target `.cinema-camera` for the pin element via:
 *   ScrollTrigger.create({ trigger, pin: '.cinema-camera', ... })
 *
 * However `makePinnedTimeline` pins the trigger itself (not a child). For
 * home sections we'll let `makePinnedTimeline` pin the trigger element.
 * Pass the outer ref to it.
 */
export const CinemaSection = forwardRef<HTMLElement, CinemaSectionProps>(
  function CinemaSection(
    { id, ariaLabel, className, style, cameraClassName, cameraStyle, children },
    ref,
  ) {
    return (
      <section
        ref={ref}
        id={id}
        aria-label={ariaLabel}
        className={cn('relative', className)}
        style={{ minHeight: '100vh', ...style }}
      >
        <div
          className={cn('cinema-camera relative w-full', cameraClassName)}
          style={{
            minHeight: '100vh',
            overflow: 'hidden',
            ...cameraStyle,
          }}
        >
          {children}
        </div>
      </section>
    );
  },
);
