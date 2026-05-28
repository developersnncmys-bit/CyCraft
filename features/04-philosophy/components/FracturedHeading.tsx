'use client';
/* FracturedHeading — characters start with random rotations/offsets,
 * reassemble to correct positions on scroll via GSAP.
 * GSAP targets: .fh-char (set by SplitType in the hook) */
import { useRef } from 'react';

interface FracturedHeadingProps {
  children: string;
  as?: 'h2' | 'p';
  className?: string;
  style?: React.CSSProperties;
}

export function FracturedHeading({
  children,
  as: Tag = 'p',
  className,
  style,
}: FracturedHeadingProps) {
  const ref = useRef<HTMLElement>(null);

  return (
    <Tag
      ref={ref as React.RefObject<HTMLHeadingElement & HTMLParagraphElement>}
      className={`fractured-heading-el${className ? ` ${className}` : ''}`}
      data-text={children}
      style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        color: 'var(--color-text-primary)',
        lineHeight: 1.2,
        willChange: 'transform',
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
