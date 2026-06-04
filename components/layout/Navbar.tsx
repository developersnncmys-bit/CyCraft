'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { scrollToTop } from '@/lib/scroll';

const ApplyModal = dynamic(() => import('@/features/22-apply-modal'), { ssr: false });

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'BTech', href: '/btech' },
  { label: 'Courses', href: '/courses' },
  { label: 'About', href: '/about' },
  { label: 'Assessment', href: '/assessment' },
  { label: 'Research', href: '/research' },
  { label: 'Blog', href: '/blog' },
  { label: 'Verify', href: '/verify' },
  { label: 'Contact', href: '/contact' },
] as const;

const isInternalRoute = (href: string) => href.startsWith('/') && !href.startsWith('//');

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const rafRef = useRef<number>(0);
  const pathname = usePathname();

  // Clicking the link for the page you're already on isn't a navigation, so the
  // route-change scroll reset never fires — jump to the top here instead.
  const handleSamePageNav = (href: string) => {
    if (pathname === href) scrollToTop();
  };

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 60);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-[999] transition-all duration-300',
        scrolled
          ? 'border-b border-[rgba(168,240,255,0.08)]'
          : 'border-b border-transparent',
      )}
      style={{
        background: scrolled ? 'rgba(5,6,8,0.96)' : 'transparent',
      }}
    >
      <div className="section-container flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/"
          className="font-mono text-sm tracking-widest uppercase"
          style={{ color: 'var(--color-beam)' }}
          aria-label="CyCraft home"
          onClick={() => handleSamePageNav('/')}
        >
          CyCraft
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const commonProps = {
              className:
                'font-mono text-xs tracking-widest uppercase transition-colors duration-200',
              style: { color: 'var(--color-text-secondary)' },
              onClick: () => handleSamePageNav(link.href),
              onMouseEnter: (e: React.MouseEvent<HTMLAnchorElement>) => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-beam)';
              },
              onMouseLeave: (e: React.MouseEvent<HTMLAnchorElement>) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  'var(--color-text-secondary)';
              },
            } as const;
            return isInternalRoute(link.href) ? (
              <Link key={link.href} href={link.href} {...commonProps}>
                {link.label}
              </Link>
            ) : (
              <a key={link.href} href={link.href} {...commonProps}>
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Apply CTA */}
        <button
          type="button"
          onClick={() => setApplyOpen(true)}
          className="hidden lg:inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase px-4 py-2 border bg-transparent transition-all duration-300 cursor-pointer"
          style={{
            borderColor: 'var(--color-beam)',
            color: 'var(--color-beam)',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.background = 'var(--color-beam)';
            el.style.color = 'var(--color-void)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.background = 'transparent';
            el.style.color = 'var(--color-beam)';
          }}
        >
          Apply 2026-27
        </button>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden font-mono text-xs"
          style={{ color: 'var(--color-beam)' }}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? '[×]' : '[≡]'}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="lg:hidden border-t"
          style={{
            background: 'rgba(5,6,8,0.98)',
            borderColor: 'rgba(168,240,255,0.08)',
          }}
        >
          <div className="section-container flex flex-col py-6 gap-4">
            {NAV_LINKS.map((link) => {
              const mobileProps = {
                className: 'font-mono text-sm tracking-widest uppercase',
                style: { color: 'var(--color-text-secondary)' },
                onClick: () => {
                  handleSamePageNav(link.href);
                  setMenuOpen(false);
                },
              } as const;
              return isInternalRoute(link.href) ? (
                <Link key={link.href} href={link.href} {...mobileProps}>
                  {link.label}
                </Link>
              ) : (
                <a key={link.href} href={link.href} {...mobileProps}>
                  {link.label}
                </a>
              );
            })}
            <button
              type="button"
              className="font-mono text-sm tracking-widest uppercase mt-2 text-left bg-transparent border-0 p-0 cursor-pointer"
              style={{ color: 'var(--color-beam)' }}
              onClick={() => {
                setMenuOpen(false);
                setApplyOpen(true);
              }}
            >
              Apply 2026-27 ›
            </button>
          </div>
        </nav>
      )}
    </header>
    <ApplyModal isOpen={applyOpen} onClose={() => setApplyOpen(false)} />
    </>
  );
}
