'use client';
/* Blog Hero — autoplay reveal on load (NOT pinned).
 *
 * Same playbook as AboutHero / CoursesHero: waits for the preloader to
 * finish, then runs a word-by-word entry timeline. Aurora + glow are pure
 * beam (no red) because the blog has no "offensive" framing.
 */
import { useRef, useState } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap/register';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { Badge } from '@/components/ui/Badge';
import { WordSplit } from '@/features/home/_shared/wordSplit';
import { blogHeroContent } from '@/content/blog/hero';
import { blogSearch } from '@/features/blog/_shared/blogSearch';

const PRELOADER_SELECTOR = '[aria-label="Loading CyCraft"]';

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function RssIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 4a16 16 0 0 1 16 16" />
      <path d="M4 11a9 9 0 0 1 9 9" />
      <circle cx="5" cy="19" r="1.4" fill="currentColor" />
    </svg>
  );
}

export default function BlogHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [searchValue, setSearchValue] = useState('');

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const revealTargets = [
        '.blog-hero-badge',
        '.blog-hero-line-1 [data-word]',
        '.blog-hero-line-2 [data-word]',
        '.blog-hero-divider',
        '.blog-hero-tagline [data-word]',
        '.blog-hero-meta',
        '.blog-hero-terminal-line',
      ];

      if (reducedMotion) {
        gsap.set(revealTargets, { opacity: 1, y: 0, x: 0, scaleX: 1, filter: 'none' });
        return;
      }

      gsap.set(['.blog-hero-badge', '.blog-hero-terminal-line'], { opacity: 0, y: 18 });
      gsap.set('.blog-hero-line-1 [data-word], .blog-hero-line-2 [data-word]', {
        opacity: 0,
        yPercent: 60,
        filter: 'blur(10px)',
      });
      gsap.set('.blog-hero-divider', { scaleX: 0, transformOrigin: 'left center' });
      gsap.set('.blog-hero-tagline [data-word]', { opacity: 0, y: 8, filter: 'blur(4px)' });
      gsap.set('.blog-hero-meta', { opacity: 0, y: 10 });

      const playEntry = () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.to('.blog-hero-badge', { opacity: 1, y: 0, duration: 0.6 })
          .to(
            '.blog-hero-line-1 [data-word]',
            { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.05 },
            '-=0.3',
          )
          .to(
            '.blog-hero-line-2 [data-word]',
            { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.05 },
            '-=0.5',
          )
          .to('.blog-hero-divider', { scaleX: 1, duration: 0.5 }, '-=0.25')
          .to(
            '.blog-hero-tagline [data-word]',
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, stagger: 0.022 },
            '-=0.2',
          )
          .to('.blog-hero-meta', { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 }, '-=0.3')
          .to(
            '.blog-hero-terminal-line',
            { opacity: 1, y: 0, duration: 0.35, stagger: 0.12 },
            '-=0.2',
          );
      };

      const preloader = document.querySelector<HTMLElement>(PRELOADER_SELECTOR);
      let observer: MutationObserver | null = null;
      let fallback: gsap.core.Tween | null = null;

      if (preloader && getComputedStyle(preloader).display !== 'none') {
        observer = new MutationObserver(() => {
          if (getComputedStyle(preloader).display === 'none') {
            observer?.disconnect();
            fallback?.kill();
            gsap.delayedCall(0.35, playEntry);
          }
        });
        observer.observe(preloader, { attributes: true, attributeFilter: ['style'] });
        fallback = gsap.delayedCall(5, () => {
          observer?.disconnect();
          playEntry();
        });
      } else {
        gsap.delayedCall(0.35, playEntry);
      }

      const parallax = {
        trigger: root,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
      };
      gsap.to('.blog-hero-bg-layer', { yPercent: 12, ease: 'none', scrollTrigger: parallax });
      gsap.to('.blog-hero-mid-near', {
        yPercent: 25,
        scale: 1.15,
        opacity: 0.45,
        ease: 'none',
        scrollTrigger: parallax,
      });
      gsap.to('.blog-hero-fg', {
        yPercent: -10,
        opacity: 0.65,
        ease: 'none',
        scrollTrigger: parallax,
      });

      gsap.fromTo(
        '.blog-hero-aurora',
        { xPercent: -14, yPercent: 8, scale: 1.05, rotation: -6, opacity: 0.55 },
        {
          xPercent: 14,
          yPercent: -10,
          scale: 1.3,
          rotation: 6,
          opacity: 0.9,
          duration: 9,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        },
      );

      return () => {
        observer?.disconnect();
        fallback?.kill();
      };
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="blog-hero"
      aria-label="Blog"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'transparent',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        paddingTop: 'clamp(5rem, 10vh, 7rem)',
        paddingBottom: 'clamp(3rem, 6vh, 5rem)',
      }}
    >
      <div
        aria-hidden="true"
        className="blog-hero-bg-layer"
        style={{
          position: 'absolute',
          inset: '-10%',
          zIndex: 1,
          willChange: 'transform',
          pointerEvents: 'none',
        }}
      />

      <div
        aria-hidden="true"
        className="blog-hero-aurora"
        style={{
          position: 'absolute',
          inset: '-40%',
          zIndex: 1,
          background:
            'radial-gradient(45% 45% at 28% 38%, rgba(168,240,255,0.30), transparent 68%), radial-gradient(42% 42% at 74% 64%, rgba(77,217,255,0.26), transparent 68%), radial-gradient(40% 40% at 55% 80%, rgba(120,90,255,0.18), transparent 70%)',
          willChange: 'transform, opacity',
          pointerEvents: 'none',
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.018) 3px, rgba(255,255,255,0.018) 4px)',
          pointerEvents: 'none',
        }}
      />

      <div
        aria-hidden="true"
        className="blog-hero-mid-near"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '1100px',
          height: '720px',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse, rgba(168,240,255,0.08) 0%, rgba(168,240,255,0.025) 40%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          animation: 'hero-glow-breathe 5s ease-in-out infinite',
          zIndex: 3,
          willChange: 'transform, opacity',
          pointerEvents: 'none',
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 4,
          background:
            'radial-gradient(ellipse at center, transparent 40%, var(--color-void) 100%)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="blog-hero-fg section-container"
        style={{
          position: 'relative',
          zIndex: 6,
          width: '100%',
          textAlign: 'center',
          willChange: 'transform, opacity',
        }}
      >
        <div style={{ maxWidth: '960px', marginInline: 'auto' }}>
          <div className="blog-hero-badge" style={{ display: 'inline-block', marginBottom: '2rem' }}>
            <Badge label={blogHeroContent.badge} />
          </div>

          <h1
            style={{
              width: '100%',
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4.5vw, 4rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              lineHeight: 1.02,
              margin: 0,
              overflowWrap: 'break-word',
              willChange: 'transform, opacity, filter',
            }}
          >
            <WordSplit
              className="blog-hero-line-1"
              text={blogHeroContent.headlinePrefix}
              style={{ display: 'block', color: 'var(--color-text-primary)' }}
            />
            <WordSplit
              className="blog-hero-line-2"
              text={blogHeroContent.headlineAccent}
              style={{
                display: 'block',
                color: 'var(--color-beam)',
                textShadow: '0 0 28px var(--color-beam-glow)',
              }}
            />
          </h1>

          <div
            className="blog-hero-divider"
            aria-hidden="true"
            style={{
              width: '80px',
              height: '2px',
              background: 'var(--color-beam)',
              boxShadow: '0 0 12px var(--color-beam-glow)',
              margin: '2.25rem auto',
              transformOrigin: 'left center',
            }}
          />

          <p
            className="blog-hero-tagline"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '680px',
              margin: '0 auto 2.25rem',
              lineHeight: 1.65,
            }}
          >
            <WordSplit text={blogHeroContent.tagline} />
          </p>

          <form
            className="blog-hero-meta blog-hero-search"
            onSubmit={(e) => {
              e.preventDefault();
              blogSearch.set(searchValue);
              const feed = document.querySelector('#blog-feed');
              feed?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              maxWidth: '620px',
              padding: '0.3rem 0.3rem 0.3rem 1.1rem',
              border: '1px solid rgba(168,240,255,0.22)',
              background: 'rgba(13,16,20,0.55)',
              backdropFilter: 'blur(6px)',
              margin: '0 auto 2rem',
              willChange: 'transform, opacity',
              textAlign: 'left',
            }}
          >
            <span aria-hidden="true" style={{ color: 'var(--color-beam)', display: 'inline-flex' }}>
              <SearchIcon />
            </span>
            <input
              type="search"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                blogSearch.set(e.target.value);
              }}
              placeholder={blogHeroContent.searchPlaceholder}
              aria-label="Search recent articles"
              style={{
                flex: 1,
                padding: '0.7rem 0',
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-sm)',
                letterSpacing: '0.02em',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              aria-label="Search"
              style={{
                padding: '0.7rem 1.1rem',
                background: 'var(--color-beam)',
                color: 'var(--color-void)',
                border: 'none',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  '0 0 24px var(--color-beam-glow)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
              }}
            >
              Search
            </button>
          </form>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0.75rem',
              marginBottom: '2rem',
            }}
          >
            <span
              className="blog-hero-meta"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.55rem 1rem',
                border: '1px solid rgba(168,240,255,0.25)',
                background: 'rgba(168,240,255,0.04)',
                color: 'var(--color-beam)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
              }}
            >
              {blogHeroContent.meta.cadence}
            </span>
            <Link
              href={blogHeroContent.meta.feedHref}
              className="blog-hero-meta"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.55rem 1rem',
                border: '1px solid rgba(168,240,255,0.25)',
                background: 'transparent',
                color: 'var(--color-beam)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'background 0.2s, color 0.2s',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = 'var(--color-beam)';
                el.style.color = 'var(--color-void)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = 'transparent';
                el.style.color = 'var(--color-beam)';
              }}
            >
              <RssIcon />
              RSS Feed
            </Link>
          </div>

          <div
            aria-hidden="true"
            style={{
              display: 'inline-flex',
              flexDirection: 'column',
              gap: '0.25rem',
              border: '1px solid rgba(168,240,255,0.12)',
              background: 'rgba(13,16,20,0.6)',
              backdropFilter: 'blur(6px)',
              padding: '0.75rem 1.25rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--color-terminal)',
              letterSpacing: '0.04em',
              textAlign: 'left',
            }}
          >
            {blogHeroContent.terminalLines.map((line) => (
              <span key={line} className="blog-hero-terminal-line">
                {line}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '24%',
          background: 'linear-gradient(to bottom, transparent, var(--color-void))',
          zIndex: 5,
          pointerEvents: 'none',
        }}
      />
    </section>
  );
}
