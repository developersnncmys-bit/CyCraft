'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { homeFooterContent } from '@/content/home/footer';
import { SectionEnterBeam, useSectionEnterBeam } from '@/features/home/_shared/SectionEnterBeam';
import { WordSplit } from '@/features/home/_shared/wordSplit';

const isInternalRoute = (href: string) => href.startsWith('/') && !href.startsWith('//');

function IconMail() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
function IconPhone() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.3 1.78.56 2.62a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.46-1.13a2 2 0 0 1 2.11-.45c.84.26 1.72.44 2.62.56A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}
function IconPin() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s-7-5-7-12a7 7 0 0 1 14 0c0 7-7 12-7 12Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
export default function HomeFooter() {
  const sectionRef = useRef<HTMLElement>(null);

  useSectionEnterBeam(sectionRef);

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const trigger: ScrollTrigger.Vars = {
        trigger: root,
        start: 'top 95%',
        // Play once and stay composed. The `reset` action on leaveBack
        // was snapping every footer element back to opacity:0 whenever
        // a layout shift above the footer caused the trigger to compute
        // a stale "leaveBack" — leaving the footer area as blank space
        // even though the markup was rendered.
        toggleActions: 'play none none none',
      };

      // Brand mark — slow reveal
      gsap.fromTo(
        '.home-footer-brand',
        { opacity: 0, y: 16, letterSpacing: '0.3em' },
        {
          opacity: 1,
          y: 0,
          letterSpacing: '0.06em',
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: trigger,
        },
      );

      // Tagline words
      gsap.fromTo(
        '.home-footer-tagline [data-word]',
        { opacity: 0, y: 6, filter: 'blur(3px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.4,
          stagger: 0.018,
          ease: 'power2.out',
          delay: 0.35,
          scrollTrigger: trigger,
        },
      );

      // Link columns (Quick Links, Programs, Contact Info)
      gsap.fromTo(
        '.home-footer-col-el',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.12,
          ease: 'power3.out',
          delay: 0.5,
          scrollTrigger: trigger,
        },
      );

      // Bottom bar — copyright + legal wipe in last
      gsap.fromTo(
        '.home-footer-bottom-el',
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          delay: 1.0,
          scrollTrigger: trigger,
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <footer
      ref={sectionRef}
      id="contact"
      aria-label="Site footer"
      style={{
        position: 'relative',
        background: 'var(--color-void)',
        paddingTop: 'clamp(4rem, 8vh, 6rem)',
        paddingBottom: '2rem',
        paddingInline: 'var(--section-padding)',
        borderTop: '1px solid rgba(168,240,255,0.08)',
        overflow: 'hidden',
      }}
    >
      <SectionEnterBeam />

      {/* Explicit 4-col layout at desktop so Contact Info sits on the same
          row as Brand / Quick Links / Programs. Wider lanes for Brand and
          Contact (more text content); narrower lanes for the two link
          columns. Falls back to 2-col at tablet and 1-col at mobile. */}
      <style>{`
        .home-footer-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1.4fr;
          gap: clamp(2rem, 4vw, 3rem);
          margin-bottom: 3rem;
        }
        @media (max-width: 960px) {
          .home-footer-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 560px) {
          .home-footer-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="section-container">
        <div className="home-footer-grid">
          {/* Brand column */}
          <div>
            <div
              className="home-footer-brand"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.5rem',
                color: 'var(--color-beam)',
                fontWeight: 700,
                marginBottom: '1rem',
                letterSpacing: '0.06em',
              }}
            >
              {homeFooterContent.brand}
            </div>
            <p
              className="home-footer-tagline"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-tertiary)',
                margin: 0,
                lineHeight: 1.6,
                maxWidth: '280px',
              }}
            >
              <WordSplit text={homeFooterContent.tagline} />
            </p>
          </div>

          {/* Link columns */}
          {homeFooterContent.columns.map((col) => (
            <div key={col.title} className="home-footer-col-el">
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  marginBottom: '1rem',
                  letterSpacing: '-0.01em',
                }}
              >
                {col.title}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {col.links.map((l) => {
                  const linkProps = {
                    style: {
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-tertiary)',
                      textDecoration: 'none' as const,
                      transition: 'color 0.2s',
                    },
                    onMouseEnter: (e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.currentTarget.style.color = 'var(--color-beam)';
                    },
                    onMouseLeave: (e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.currentTarget.style.color = 'var(--color-text-tertiary)';
                    },
                  };
                  return (
                    <li key={l.label}>
                      {isInternalRoute(l.href) ? (
                        <Link href={l.href} {...linkProps}>
                          {l.label}
                        </Link>
                      ) : (
                        <a href={l.href} {...linkProps}>
                          {l.label}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {/* Contact column */}
          <div className="home-footer-col-el">
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: '1rem',
                letterSpacing: '-0.01em',
              }}
            >
              Contact Info
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <span style={{ color: 'var(--color-red-team)', marginTop: '2px' }}>
                  <IconMail />
                </span>
                <a
                  href={`mailto:${homeFooterContent.contact.email}`}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-text-secondary)',
                    textDecoration: 'none',
                  }}
                >
                  {homeFooterContent.contact.email}
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <span style={{ color: 'var(--color-red-team)', marginTop: '2px' }}>
                  <IconPhone />
                </span>
                <a
                  href={`tel:${homeFooterContent.contact.phone.replace(/\s+/g, '')}`}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-text-secondary)',
                    textDecoration: 'none',
                  }}
                >
                  {homeFooterContent.contact.phone}
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <span style={{ color: 'var(--color-red-team)', marginTop: '2px' }}>
                  <IconPin />
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.5,
                  }}
                >
                  {homeFooterContent.contact.address}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="home-footer-bottom-el"
          style={{
            borderTop: '1px solid rgba(168,240,255,0.06)',
            paddingTop: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--color-text-disabled)',
              letterSpacing: '0.08em',
            }}
          >
            {homeFooterContent.copyright}
          </div>

          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--color-text-disabled)',
              letterSpacing: '0.08em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span>{homeFooterContent.credit.prefix}</span>
            <a
              href={homeFooterContent.credit.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--color-beam)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-beam-core)';
                (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-beam)';
                (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'none';
              }}
            >
              {homeFooterContent.credit.label}
            </a>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
            {homeFooterContent.legal.map((l) => {
              const legalStyle = {
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--color-text-tertiary)',
                textDecoration: 'none' as const,
                letterSpacing: '0.12em',
                textTransform: 'uppercase' as const,
              };
              return isInternalRoute(l.href) ? (
                <Link key={l.label} href={l.href} style={legalStyle}>
                  {l.label}
                </Link>
              ) : (
                <a key={l.label} href={l.href} style={legalStyle}>
                  {l.label}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
