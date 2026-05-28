import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline';
  as?: 'button' | 'a';
  href?: string;
}

const base =
  'inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-beam)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer';

const variants = {
  primary:
    'px-6 py-3 border border-[var(--color-beam)] text-[var(--color-beam)] bg-transparent hover:bg-[var(--color-beam)] hover:text-[var(--color-void)] hover:shadow-[0_0_20px_var(--color-beam-glow)]',
  ghost:
    'px-4 py-2 text-[var(--color-beam)] bg-transparent hover:underline underline-offset-4',
  outline:
    'px-6 py-3 border border-white text-white bg-transparent hover:bg-white/10',
};

const isInternalRoute = (href: string) => href.startsWith('/') && !href.startsWith('//');

export function Button({
  variant = 'primary',
  as: Tag = 'button',
  href,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(base, variants[variant], className);

  if (Tag === 'a' && href) {
    if (isInternalRoute(href)) {
      return (
        <Link href={href} className={classes}>
          {children}
          <span aria-hidden="true">›</span>
        </Link>
      );
    }
    return (
      <a href={href} className={classes}>
        {children}
        <span aria-hidden="true">›</span>
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
      <span aria-hidden="true">›</span>
    </button>
  );
}
