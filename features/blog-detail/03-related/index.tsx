'use client';
/* Blog Detail Related — three other posts.
 *
 * Picks same-category posts first (excluding the current slug), then
 * fills the rest with the most recent posts overall. Always shows
 * exactly three cards on desktop, two on tablet, one on mobile.
 *
 * Cards reuse the design language from the feed grid — gradient cover
 * panel tinted by category accent, mono badge, body title, meta strip —
 * but are tightened so the related section reads as an in-page
 * recommendation, not a second feed.
 */
import { useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap/register';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { WordSplit } from '@/features/home/_shared/wordSplit';
import { Badge } from '@/components/ui/Badge';
import {
  blogFeedContent,
  type BlogPost,
  type BlogCategory,
} from '@/content/blog/feed';

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
      return 'rgba(255,61,90,0.18)';
    case 'Web Security':
    case 'Cloud Security':
      return 'rgba(168,240,255,0.18)';
    case 'Reverse Engineering':
      return 'rgba(61,168,255,0.18)';
    case 'Industry News':
      return 'rgba(0,255,148,0.18)';
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

function ClockIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function RelatedCard({ post }: { post: BlogPost }) {
  const accent = categoryAccent(post.category);
  const accentRgb = categoryAccentRgb(post.category);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="bd-related-card"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-carbon)',
        border: '1px solid rgba(168,240,255,0.10)',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'transform 0.3s, border-color 0.3s, box-shadow 0.3s',
        willChange: 'transform, opacity',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(-4px)';
        el.style.borderColor = accent;
        el.style.boxShadow = `0 14px 30px rgba(0,0,0,0.40), 0 0 22px ${accentRgb}`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(0)';
        el.style.borderColor = 'rgba(168,240,255,0.10)';
        el.style.boxShadow = 'none';
      }}
    >
      {/* Cover — Pexels image when present, otherwise the gradient placeholder */}
      <div
        aria-hidden="true"
        style={{
          position: 'relative',
          height: '140px',
          background: post.cover
            ? 'var(--color-carbon)'
            : `linear-gradient(135deg, ${
                accent === 'var(--color-red-team)'
                  ? 'rgba(255,61,90,0.22), rgba(255,61,90,0.05)'
                  : accent === 'var(--color-blue-team)'
                  ? 'rgba(61,168,255,0.22), rgba(61,168,255,0.05)'
                  : accent === 'var(--color-terminal)'
                  ? 'rgba(0,255,148,0.22), rgba(0,255,148,0.05)'
                  : 'rgba(168,240,255,0.22), rgba(168,240,255,0.05)'
              })`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {post.cover ? (
          <Image
            src={post.cover.src}
            alt={post.cover.alt}
            fill
            sizes="(max-width: 1024px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: accent,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              opacity: 0.6,
            }}
          >
            {post.category}
          </span>
        )}
        {/* Darkening overlay so chip + title remain legible */}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: post.cover
              ? 'linear-gradient(180deg, rgba(5,6,8,0.20) 0%, rgba(5,6,8,0.55) 100%)'
              : 'transparent',
          }}
        />
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(255,255,255,0.025) 4px, rgba(255,255,255,0.025) 5px)',
          }}
        />
      </div>

      <div
        style={{
          flex: 1,
          padding: '1.25rem 1.4rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            color: accent,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: accent,
              boxShadow: `0 0 6px ${accent}`,
            }}
          />
          {post.category}
        </span>

        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.95rem',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            margin: 0,
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
          }}
        >
          {post.title}
        </h3>

        <div
          style={{
            marginTop: 'auto',
            paddingTop: '0.85rem',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.6rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            color: 'var(--color-text-tertiary)',
            letterSpacing: '0.08em',
          }}
        >
          <span>{formatDate(post.publishedAt)}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <ClockIcon /> {post.readMinutes}m
          </span>
        </div>
      </div>
    </Link>
  );
}

interface BlogDetailRelatedProps {
  currentSlug: string;
  category: BlogCategory;
}

export default function BlogDetailRelated({
  currentSlug,
  category,
}: BlogDetailRelatedProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const relatedPosts = useMemo(() => {
    const others = blogFeedContent.posts.filter((p) => p.slug !== currentSlug);
    const sameCategory = others.filter((p) => p.category === category);
    const rest = others.filter((p) => p.category !== category);
    // Same-category posts ride at the front; recents fill the remainder.
    const merged: BlogPost[] = [...sameCategory, ...rest];
    return merged.slice(0, 3);
  }, [currentSlug, category]);

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const headingWords = root.querySelectorAll<HTMLElement>(
        '.bd-related-heading [data-word]',
      );
      const cards = root.querySelectorAll<HTMLElement>('.bd-related-card');
      const badge = root.querySelector<HTMLElement>('.bd-related-badge');

      if (reducedMotion) {
        gsap.set([badge, ...Array.from(cards), ...Array.from(headingWords)], {
          opacity: 1,
          y: 0,
          scale: 1,
          yPercent: 0,
          filter: 'none',
        });
        return;
      }

      // Replay every time the section enters the viewport — same recipe
      // as the article body. onEnter/onEnterBack restart, onLeave/
      // onLeaveBack reset.
      const trigger = {
        trigger: root,
        start: 'top 80%',
        toggleActions: 'restart reset restart reset',
      };

      gsap.fromTo(
        badge,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', scrollTrigger: trigger },
      );

      if (headingWords.length) {
        gsap.fromTo(
          headingWords,
          { opacity: 0, yPercent: 60, filter: 'blur(10px)' },
          {
            opacity: 1,
            yPercent: 0,
            filter: 'blur(0px)',
            duration: 0.75,
            stagger: 0.05,
            ease: 'power3.out',
            delay: 0.15,
            scrollTrigger: trigger,
          },
        );
      }

      gsap.fromTo(
        cards,
        { opacity: 0, y: 30, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          stagger: 0.08,
          delay: 0.35,
          ease: 'power3.out',
          scrollTrigger: trigger,
        },
      );
    },
    { scope: sectionRef, dependencies: [reducedMotion, currentSlug] },
  );

  if (relatedPosts.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      id="bd-related"
      aria-label="More from the feed"
      style={{
        position: 'relative',
        background: 'transparent',
        paddingTop: 'clamp(3rem, 6vh, 5rem)',
        paddingBottom: 'clamp(4rem, 8vh, 6rem)',
        borderTop: '1px solid rgba(168,240,255,0.08)',
      }}
    >
      <style>{`
        .bd-related-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(1rem, 2.2vw, 1.75rem);
        }
        @media (max-width: 1024px) {
          .bd-related-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 640px) {
          .bd-related-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="section-container" style={{ position: 'relative', zIndex: 2 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: 'clamp(2rem, 4vw, 3rem)',
          }}
        >
          <div className="bd-related-badge" style={{ alignSelf: 'flex-start' }}>
            <Badge label="MORE_DISPATCHES" />
          </div>
          <h2
            className="bd-related-heading"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.15rem, 2.2vw, 1.7rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: 'var(--color-text-primary)',
              margin: 0,
              lineHeight: 1.15,
            }}
          >
            <WordSplit text="Keep reading the feed" />
          </h2>
        </div>

        <div className="bd-related-grid">
          {relatedPosts.map((post) => (
            <RelatedCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
