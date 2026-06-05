'use client';
/* Blog Detail Hero — cinematic full-bleed.
 *
 * Mirrors the research-detail header design language:
 *   L0 — full-bleed cover image (or category-tinted aurora when absent)
 *   L1 — vertical darkening gradient (top-light → bottom-void) for legibility
 *   L2 — subtle scan-line texture over the image
 *   L3 — content: back link top-left, glass chip + white title + deck + meta
 *        anchored to the bottom of the section so they sit over the deepest
 *        part of the gradient
 *
 * No framed card around the cover. No corner brackets. The impact comes from
 * edge-to-edge imagery + typography hierarchy + a single accent rail that
 * runs above the back link to echo the rest of the cinema system.
 *
 * Push down via `marginTop: 4rem` so the image starts below the fixed navbar
 * instead of slipping behind it.
 */
import { useRef } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { WordSplit } from '@/features/home/_shared/wordSplit';
import type { BlogPost, BlogCategory } from '@/content/blog/feed';

const PRELOADER_SELECTOR = '[aria-label="Loading CyCraft"]';

const categoryAccent = (category: BlogCategory) => {
  switch (category) {
    case 'Malware':
    case 'Threat Intel':
      return 'var(--color-red-team)';
    case 'Web Security':
    case 'Cloud Security':
      return 'var(--color-beam)';
    case 'Reverse Engineering':
      return 'var(--color-blue-team)';
    case 'Industry News':
      return 'var(--color-terminal)';
  }
};

const categoryAccentRgb = (category: BlogCategory) => {
  switch (category) {
    case 'Malware':
    case 'Threat Intel':
      return '255,61,90';
    case 'Web Security':
    case 'Cloud Security':
      return '168,240,255';
    case 'Reverse Engineering':
      return '61,168,255';
    case 'Industry News':
      return '0,255,148';
  }
};

const formatDate = (iso: string) => {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
};

interface BlogDetailHeroProps {
  post: BlogPost;
  /** Optional one-line deck under the title; falls back to the feed
   *  excerpt when no detail entry exists for the slug yet. */
  deck?: string;
  /** Optional hero cover image. Drop the file under
   *  `/public/images/blog/<slug>/cover.jpg` (or similar) and point
   *  `src` at it. When absent, a category-tinted aurora fills the
   *  hero instead. */
  cover?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
}

export default function BlogDetailHero({ post, deck, cover }: BlogDetailHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const accent = categoryAccent(post.category);
  const accentRgb = categoryAccentRgb(post.category);
  const summary = deck ?? post.excerpt;

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      if (reducedMotion) {
        gsap.set(
          [
            '.bd-hero-rail',
            '.bd-hero-back',
            '.bd-hero-chip',
            '.bd-hero-title [data-word]',
            '.bd-hero-deck [data-word]',
            '.bd-hero-meta-item',
          ],
          { opacity: 1, y: 0, x: 0, yPercent: 0, scaleX: 1, filter: 'none' },
        );
        gsap.set('.bd-hero-image', { scale: 1, opacity: 1 });
        return;
      }

      gsap.set('.bd-hero-title [data-word]', {
        opacity: 0,
        yPercent: 60,
        filter: 'blur(8px)',
      });
      gsap.set('.bd-hero-deck [data-word]', {
        opacity: 0,
        y: 6,
        filter: 'blur(3px)',
      });

      const playEntry = () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.fromTo(
          '.bd-hero-image',
          { opacity: 0, scale: 1.08 },
          { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' },
        )
          .fromTo(
            '.bd-hero-rail',
            { scaleX: 0 },
            { scaleX: 1, duration: 0.5 },
            '-=0.95',
          )
          .fromTo(
            '.bd-hero-back',
            { opacity: 0, x: -12 },
            { opacity: 1, x: 0, duration: 0.45 },
            '-=0.45',
          )
          .fromTo(
            '.bd-hero-chip',
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.4 },
            '-=0.4',
          )
          .to(
            '.bd-hero-title [data-word]',
            {
              opacity: 1,
              yPercent: 0,
              filter: 'blur(0px)',
              duration: 0.75,
              stagger: 0.05,
            },
            '-=0.3',
          )
          .to(
            '.bd-hero-deck [data-word]',
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 0.5,
              stagger: 0.018,
            },
            '-=0.45',
          )
          .fromTo(
            '.bd-hero-meta-item',
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.45, stagger: 0.08 },
            '-=0.3',
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

      // Scroll parallax on the cover image — same `yPercent + scale`
      // recipe as research-detail so the two pages feel related.
      const parallaxTween = gsap.to('.bd-hero-image', {
        yPercent: 12,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        } as ScrollTrigger.Vars,
      });

      return () => {
        observer?.disconnect();
        fallback?.kill();
        parallaxTween.scrollTrigger?.kill();
        parallaxTween.kill();
      };
    },
    { scope: sectionRef, dependencies: [reducedMotion, post.slug] },
  );

  return (
    <section
      ref={sectionRef}
      id="bd-hero"
      aria-label={post.title}
      style={{
        position: 'relative',
        /* Navbar is fixed h-16 (4rem) and transparent at the top. Push
         * the section so the hero image starts below it. */
        marginTop: '4rem',
        minHeight: 'clamp(380px, 70vh, 640px)',
        overflow: 'hidden',
        background: 'var(--color-void)',
      }}
    >
      {/* L0 — full-bleed backdrop */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="bd-hero-image"
            src={cover.src}
            alt={cover.alt}
            style={{
              width: '100%',
              height: '110%',
              objectFit: 'cover',
              display: 'block',
              willChange: 'transform, opacity',
            }}
            loading="eager"
          />
        ) : (
          <div
            className="bd-hero-image"
            style={{
              position: 'absolute',
              inset: '-10%',
              background: `radial-gradient(50% 50% at 25% 30%, rgba(${accentRgb},0.35), transparent 70%), radial-gradient(45% 45% at 80% 75%, rgba(168,240,255,0.18), transparent 70%), var(--color-deep-space)`,
              willChange: 'transform, opacity',
            }}
          />
        )}
      </div>

      {/* L1 — darkening gradient overlay (keeps text legible). When no
          cover is present we tint the bottom band with the category
          accent so the chip + title stay anchored. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: `linear-gradient(180deg, rgba(5,6,8,${cover ? 0.4 : 0.15}) 0%, rgba(5,6,8,${cover ? 0.55 : 0.35}) 45%, rgba(5,6,8,0.85) 80%, rgba(5,6,8,1) 100%)`,
          pointerEvents: 'none',
        }}
      />

      {/* L2 — scan-line texture */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.015) 3px, rgba(255,255,255,0.015) 4px)',
          pointerEvents: 'none',
        }}
      />

      {/* L3 — content */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          minHeight: 'clamp(380px, 70vh, 640px)',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: 'clamp(2rem, 5vh, 3.5rem)',
          paddingBottom: 'clamp(2.5rem, 6vh, 4rem)',
          paddingInline: 'var(--section-padding)',
        }}
      >
        {/* Top rail + back link group — gets a fixed minimum bottom gap
            so the red accent rail never crowds the red category chip
            anchored at the bottom of the section. */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            alignSelf: 'flex-start',
            marginBottom: 'clamp(2rem, 6vh, 4rem)',
          }}
        >
          <span
            className="bd-hero-rail"
            aria-hidden="true"
            style={{
              display: 'block',
              width: '48px',
              height: '2px',
              background: `linear-gradient(to right, ${accent}, transparent)`,
              boxShadow: `0 0 8px ${accent}`,
              transformOrigin: 'left center',
              willChange: 'transform',
            }}
          />
          <Link
            href="/blog"
            className="bd-hero-back"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.18em',
              color: '#ffffff',
              opacity: 0.85,
              textDecoration: 'none',
              textTransform: 'uppercase',
              willChange: 'transform, opacity',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.textShadow = `0 0 12px rgba(${accentRgb},0.55)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.85';
              e.currentTarget.style.textShadow = 'none';
            }}
          >
            <span aria-hidden="true">←</span>
            Back to Blog
          </Link>
        </div>

        <div
          className="section-container"
          style={{
            marginTop: 'auto',
            paddingInline: 0,
          }}
        >
          {/* Glass chip — category • date */}
          <div
            className="bd-hero-chip"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.7rem',
              padding: '0.4rem 0.85rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.22em',
              color: accent,
              textTransform: 'uppercase',
              marginBottom: '1.75rem',
              background: `rgba(${accentRgb},0.12)`,
              border: `1px solid rgba(${accentRgb},0.45)`,
              backdropFilter: 'blur(14px) saturate(140%)',
              WebkitBackdropFilter: 'blur(14px) saturate(140%)',
              boxShadow: `0 0 24px rgba(${accentRgb},0.20), inset 0 1px 0 rgba(255,255,255,0.08)`,
              willChange: 'transform, opacity',
            }}
          >
            <span>{post.category}</span>
            <span aria-hidden="true" style={{ opacity: 0.5 }}>
              •
            </span>
            <span>{formatDate(post.publishedAt)}</span>
          </div>

          {/* Title */}
          <h1
            className="bd-hero-title"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.65rem, 3.5vw, 3rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: '#ffffff',
              lineHeight: 1.08,
              margin: '0 0 1.25rem',
              maxWidth: '900px',
              textShadow: '0 4px 24px rgba(0,0,0,0.6)',
              overflowWrap: 'break-word',
              willChange: 'transform, opacity, filter',
            }}
          >
            <WordSplit text={post.title} style={{ display: 'inline' }} />
          </h1>

          {/* Deck */}
          <p
            className="bd-hero-deck"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.95rem, 1.35vw, 1.1rem)',
              color: 'rgba(255,255,255,0.78)',
              maxWidth: '720px',
              margin: '0 0 1.5rem',
              lineHeight: 1.6,
              textShadow: '0 2px 12px rgba(0,0,0,0.4)',
            }}
          >
            <WordSplit text={summary} />
          </p>

          {/* Meta row — author + read time. Date already lives in the
              chip above, so we don't repeat it here. */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '0.5rem 1.25rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.06em',
              color: 'rgba(255,255,255,0.65)',
            }}
          >
            <span
              className="bd-hero-meta-item"
              style={{ willChange: 'transform, opacity' }}
            >
              By {post.author}
            </span>
            <span
              aria-hidden="true"
              style={{
                width: '1px',
                height: '12px',
                background: 'rgba(255,255,255,0.18)',
              }}
            />
            <span
              className="bd-hero-meta-item"
              style={{ willChange: 'transform, opacity' }}
            >
              {post.readMinutes} min read
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
