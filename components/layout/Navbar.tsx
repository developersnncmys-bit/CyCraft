'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
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
  { label: 'Download', href: '/download' },
  // { label: 'Research', href: '/research' },
  { label: 'Blog', href: '/blog' },
  { label: 'Verify', href: '/verify' },
  { label: 'Gallery', href: '/gallery' },
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

  // Active-page detection. `/` matches exactly (otherwise it would match every
  // route since they all start with `/`). Other routes match either exactly or
  // as a path-segment prefix so nested pages (e.g. /courses/ethical-hacking)
  // still highlight their parent in the navbar.
  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
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

  // Auto-open the Apply modal once the preloader's boot sequence finishes.
  // The Preloader dispatches `cycraft:preloader-done` on a fresh page load;
  // we only listen for it (no fallback fire) so client-side navigations,
  // where the preloader is skipped, do not re-pop the modal.
  useEffect(() => {
    const onDone = () => setApplyOpen(true);
    window.addEventListener('cycraft:preloader-done', onDone, { once: true });
    return () => window.removeEventListener('cycraft:preloader-done', onDone);
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
        // Dark drop-shadow on the underside so the navbar reads as a layer
        // above the page rather than sitting flush. Fades in on scroll
        // alongside the background — at the top of the page the navbar is
        // transparent and a shadow there would look like a stray seam.
        boxShadow: scrolled
          ? '0 10px 28px rgba(0, 0, 0, 0.55), 0 2px 6px rgba(0, 0, 0, 0.35)'
          : 'none',
      }}
    >
      <div className="section-container flex items-center justify-between h-16">
        {/* Logo — shield-and-lock mark from /public/logo.png. priority=true so
            Next.js fetches it during initial paint instead of lazy-loading
            (above-the-fold). Intrinsic 1700×1269 (~1.34:1 aspect); rendered
            at 44px tall in the 64px-tall navbar. */}
        <Link
          href="/"
          className="inline-flex items-center"
          aria-label="CyCraft home"
          onClick={() => handleSamePageNav('/')}
        >
          {/* Logo fills the 64px navbar bar exactly. Setting height to 64px
              maximises the logo's visible size without expanding the bar's
              vertical bounds (which would push every other page's first-
              section content down by the extra navbar height). */}
          <Image
            src="/logo.png"
            alt="CyCraft"
            width={1700}
            height={1269}
            priority
            sizes="120px"
            style={{ height: '64px', width: 'auto', display: 'block' }}
          />
        </Link>

        {/* Desktop nav — shows from lg (1024px+). Spacing scales up with
            viewport: tight at lg so all 10 items fit on a 1366-wide laptop,
            opens up at xl/2xl where there's room for proper breathing room
            between links. */}
        <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-3 xl:gap-6 2xl:gap-8 mx-4 xl:mx-6 2xl:mx-8">
          {NAV_LINKS.map((link) => {
            const active = isActiveLink(link.href);
            // Active links: beam colour + a 2px beam underline with subtle
            // glow, so the current page is identifiable without relying on
            // colour alone (some users won't catch the secondary→beam shift
            // amidst other accents on the page).
            const restingColor = active
              ? 'var(--color-beam)'
              : 'var(--color-text-secondary)';
            const commonProps = {
              className:
                'font-mono text-[11px] xl:text-xs tracking-wider uppercase transition-colors duration-200 whitespace-nowrap',
              style: {
                color: restingColor,
                paddingBottom: '4px',
                borderBottom: active
                  ? '2px solid var(--color-beam)'
                  : '2px solid transparent',
                textShadow: active ? '0 0 12px var(--color-beam-glow)' : 'none',
              } as React.CSSProperties,
              'aria-current': active ? ('page' as const) : undefined,
              onClick: () => handleSamePageNav(link.href),
              onMouseEnter: (e: React.MouseEvent<HTMLAnchorElement>) => {
                if (active) return;
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-beam)';
              },
              onMouseLeave: (e: React.MouseEvent<HTMLAnchorElement>) => {
                if (active) return;
                (e.currentTarget as HTMLAnchorElement).style.color = restingColor;
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
          className="hidden lg:inline-flex items-center gap-2 font-mono text-[11px] xl:text-xs tracking-wider uppercase px-3 xl:px-4 py-2 border bg-transparent transition-all duration-300 cursor-pointer whitespace-nowrap"
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

        {/* Mobile hamburger — three-line SVG that morphs to an X when open */}
        <button
          type="button"
          className="lg:hidden inline-flex items-center justify-center w-11 h-11 -mr-2 cursor-pointer bg-transparent border-0"
          style={{ color: 'var(--color-beam)' }}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="square"
            aria-hidden="true"
          >
            <line
              x1="3"
              y1={menuOpen ? '12' : '6'}
              x2="21"
              y2={menuOpen ? '12' : '6'}
              style={{
                transform: menuOpen ? 'rotate(45deg)' : 'none',
                transformOrigin: '12px 12px',
                transition: 'transform 200ms ease, y1 200ms ease, y2 200ms ease',
              }}
            />
            <line
              x1="3"
              y1="12"
              x2="21"
              y2="12"
              style={{
                opacity: menuOpen ? 0 : 1,
                transition: 'opacity 150ms ease',
              }}
            />
            <line
              x1="3"
              y1={menuOpen ? '12' : '18'}
              x2="21"
              y2={menuOpen ? '12' : '18'}
              style={{
                transform: menuOpen ? 'rotate(-45deg)' : 'none',
                transformOrigin: '12px 12px',
                transition: 'transform 200ms ease, y1 200ms ease, y2 200ms ease',
              }}
            />
          </svg>
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
              const active = isActiveLink(link.href);
              // Mobile menu: active link gets beam colour + a left-edge
              // accent bar so it reads even at a glance, since there's no
              // hover state on touch and the items stack vertically.
              const mobileProps = {
                className: 'font-mono text-sm tracking-widest uppercase',
                style: {
                  color: active ? 'var(--color-beam)' : 'var(--color-text-secondary)',
                  paddingLeft: '0.85rem',
                  borderLeft: active
                    ? '2px solid var(--color-beam)'
                    : '2px solid transparent',
                  textShadow: active ? '0 0 10px var(--color-beam-glow)' : 'none',
                } as React.CSSProperties,
                'aria-current': active ? ('page' as const) : undefined,
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
