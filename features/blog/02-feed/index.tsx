'use client';
/* Blog Feed — interactive grid (NOT pinned).
 *
 * Featured post sits at the top in a wider 2-up layout when present, then
 * the rest of the feed flows in a 3-up responsive grid. Category chips
 * filter the visible subset; cards re-stagger on filter change.
 *
 * Like the Courses catalog, this isn't pinned — readers need to browse
 * freely. We just use one scroll-trigger reveal for the header + filters,
 * then a card-stagger as the grid enters the viewport.
 */
import { useMemo, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { Badge } from '@/components/ui/Badge';
import { WordSplit } from '@/features/home/_shared/wordSplit';
import { blogFeedContent, type BlogPost, type BlogCategory } from '@/content/blog/feed';
import { blogSearch } from '@/features/blog/_shared/blogSearch';

type CategoryFilter = (typeof blogFeedContent.categoryFilters)[number];

const categoryAccent = (category: BlogCategory) => {
  // Defensive / research-y categories stay on beam. Offensive-leaning
  // categories (Malware, Threat Intel) pick up red so the feed reads at
  // a glance — same offence/defence duality as the Courses cards.
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

const formatDate = (iso: string) => {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
};

function ClockIcon() {
  return (
    <svg
      width="12"
      height="12"
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
      width="14"
      height="14"
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

function PostCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  const accent = categoryAccent(post.category);
  const accentRgb =
    accent === 'var(--color-red-team)'
      ? 'rgba(255,61,90,0.18)'
      : accent === 'var(--color-blue-team)'
      ? 'rgba(61,168,255,0.18)'
      : accent === 'var(--color-terminal)'
      ? 'rgba(0,255,148,0.18)'
      : 'rgba(168,240,255,0.18)';

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="blog-post-card"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: featured ? 'row' : 'column',
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
        el.style.transform = 'translateY(-6px)';
        el.style.borderColor = accent;
        el.style.boxShadow = `0 18px 40px rgba(0,0,0,0.45), 0 0 28px ${accentRgb}`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(0)';
        el.style.borderColor = 'rgba(168,240,255,0.10)';
        el.style.boxShadow = 'none';
      }}
    >
      {/* Cover panel — placeholder until imagery is supplied */}
      <div
        aria-hidden="true"
        style={{
          position: 'relative',
          flex: featured ? '0 0 45%' : 'unset',
          height: featured ? 'auto' : '200px',
          minHeight: featured ? '320px' : '200px',
          background: `linear-gradient(135deg, ${
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
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: featured ? '0.95rem' : '0.85rem',
            color: accent,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            opacity: 0.6,
          }}
        >
          {post.category}
        </span>
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(255,255,255,0.025) 4px, rgba(255,255,255,0.025) 5px)',
          }}
        />
        {featured && (
          <span
            style={{
              position: 'absolute',
              top: '1rem',
              left: '1rem',
              padding: '0.3rem 0.7rem',
              background: 'var(--color-beam)',
              color: 'var(--color-void)',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            Featured
          </span>
        )}
      </div>

      <div
        style={{
          flex: 1,
          padding: 'clamp(1.25rem, 2.2vw, 2rem)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.55rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: accent,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: accent,
              boxShadow: `0 0 8px ${accent}`,
            }}
          />
          {post.category}
        </span>

        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: featured ? 'clamp(1.35rem, 2vw, 1.6rem)' : '1.25rem',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            margin: 0,
            lineHeight: 1.25,
            letterSpacing: '-0.02em',
          }}
        >
          {post.title}
        </h3>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-base)',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.65,
            margin: 0,
          }}
        >
          {post.excerpt}
        </p>

        <div
          style={{
            marginTop: 'auto',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--color-text-tertiary)',
            letterSpacing: '0.08em',
          }}
        >
          <span style={{ display: 'inline-flex', flexDirection: 'column', gap: '0.15rem' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>{post.author}</span>
            <span>{formatDate(post.publishedAt)}</span>
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <ClockIcon /> {post.readMinutes} min
          </span>
        </div>

        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            color: accent,
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          Read More <ArrowIcon />
        </span>
      </div>
    </Link>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className="blog-feed-filter"
      style={{
        padding: '0.55rem 1rem',
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        background: active ? 'var(--color-beam)' : 'transparent',
        color: active ? 'var(--color-void)' : 'var(--color-text-secondary)',
        border: `1px solid ${active ? 'var(--color-beam)' : 'rgba(168,240,255,0.22)'}`,
        cursor: 'pointer',
        transition: 'background 0.2s, color 0.2s, border-color 0.2s',
        willChange: 'transform, opacity',
      }}
      onMouseEnter={(e) => {
        if (active) return;
        (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-beam)';
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-beam)';
      }}
      onMouseLeave={(e) => {
        if (active) return;
        (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-secondary)';
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(168,240,255,0.22)';
      }}
    >
      {label}
    </button>
  );
}

export default function BlogFeed() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');

  // Bridge the hero's search input into the feed's filter via the shared
  // blogSearch store. useSyncExternalStore is React's purpose-built API
  // for "subscribe to a mutable external value" — no effect cascade, and
  // SSR-safe via the third (server snapshot) argument.
  const searchQuery = useSyncExternalStore(
    blogSearch.subscribe,
    () => blogSearch.current,
    () => '',
  );

  const featuredPost = useMemo(
    () => blogFeedContent.posts.find((p) => p.featured) ?? null,
    [],
  );

  const normalisedQuery = searchQuery.trim().toLowerCase();
  const isSearching = normalisedQuery.length > 0;

  const matchesQuery = (p: BlogPost) =>
    p.title.toLowerCase().includes(normalisedQuery) ||
    p.excerpt.toLowerCase().includes(normalisedQuery) ||
    p.category.toLowerCase().includes(normalisedQuery);

  const visiblePosts = useMemo(() => {
    return blogFeedContent.posts.filter((p) => {
      // While searching, the featured post is shown inline (no special slot)
      // so users see every match in one grid.
      if (!isSearching && p.featured) return false;
      const categoryOk = activeCategory === 'All' || p.category === activeCategory;
      const queryOk = !isSearching || matchesQuery(p);
      return categoryOk && queryOk;
    });
    // matchesQuery is derived from normalisedQuery, no need to list separately
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, normalisedQuery, isSearching]);

  // Featured slot only shows on the unfiltered, unsearched landing view.
  // Once the user narrows the feed, the featured post is folded back into
  // the regular grid (see visiblePosts above) so they see every match in
  // one place.
  const showFeatured =
    !isSearching && activeCategory === 'All' && featuredPost !== null;

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      if (reducedMotion) {
        gsap.set(
          [
            '.blog-feed-badge',
            '.blog-feed-heading [data-word]',
            '.blog-feed-sub [data-word]',
            '.blog-feed-filter',
            '.blog-post-card',
          ],
          { opacity: 1, y: 0, scale: 1, filter: 'none' },
        );
        return;
      }

      const headerTrigger = {
        trigger: root,
        start: 'top 80%',
        toggleActions: 'play none none reset',
      };
      gsap.fromTo(
        '.blog-feed-badge',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, scrollTrigger: headerTrigger },
      );
      gsap.fromTo(
        '.blog-feed-heading [data-word]',
        { opacity: 0, yPercent: 60, filter: 'blur(8px)' },
        {
          opacity: 1,
          yPercent: 0,
          filter: 'blur(0px)',
          duration: 0.7,
          stagger: 0.04,
          delay: 0.15,
          scrollTrigger: headerTrigger,
        },
      );
      gsap.fromTo(
        '.blog-feed-sub [data-word]',
        { opacity: 0, y: 8, filter: 'blur(4px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.4,
          stagger: 0.015,
          delay: 0.45,
          scrollTrigger: headerTrigger,
        },
      );
      gsap.fromTo(
        '.blog-feed-filter',
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.04,
          delay: 0.55,
          scrollTrigger: headerTrigger,
        },
      );

      const cards = gridRef.current?.querySelectorAll<HTMLElement>('.blog-post-card');
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.07,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reset',
            },
          },
        );
      }
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  // Re-stagger when filter changes
  useGSAP(
    () => {
      if (reducedMotion) return;
      const cards = gridRef.current?.querySelectorAll<HTMLElement>('.blog-post-card');
      if (!cards || cards.length === 0) return;
      gsap.fromTo(
        cards,
        { opacity: 0, y: 18, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
          stagger: 0.04,
          ease: 'power2.out',
          onComplete: () => ScrollTrigger.refresh(),
        },
      );
    },
    { scope: sectionRef, dependencies: [activeCategory, normalisedQuery] },
  );

  return (
    <section
      ref={sectionRef}
      id="blog-feed"
      aria-label="Blog feed"
      style={{
        position: 'relative',
        background: 'transparent',
        paddingTop: 'clamp(4rem, 9vh, 7rem)',
        paddingBottom: 'clamp(4rem, 8vh, 6rem)',
        overflow: 'hidden',
      }}
    >
      <style>{`
        .blog-feed-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(1.25rem, 2.4vw, 2rem);
        }
        @media (max-width: 1024px) {
          .blog-feed-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 640px) {
          .blog-feed-grid { grid-template-columns: 1fr; }
        }
        .blog-feed-featured-wrap {
          display: block;
          margin-bottom: clamp(1.5rem, 3vw, 2.5rem);
        }
        @media (max-width: 768px) {
          .blog-feed-featured-wrap .blog-post-card {
            flex-direction: column !important;
          }
          .blog-feed-featured-wrap .blog-post-card > div:first-child {
            flex: unset !important;
            min-height: 200px !important;
          }
        }
      `}</style>

      <div className="section-container" style={{ position: 'relative', zIndex: 2 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            maxWidth: '880px',
            marginBottom: 'clamp(2.5rem, 5vw, 3.5rem)',
          }}
        >
          <div className="blog-feed-badge" style={{ alignSelf: 'flex-start' }}>
            <Badge label={blogFeedContent.badge} />
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-display-md)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              color: 'var(--color-text-primary)',
              margin: 0,
              lineHeight: 1.08,
            }}
          >
            <WordSplit className="blog-feed-heading" text={blogFeedContent.heading} />
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            <WordSplit className="blog-feed-sub" text={blogFeedContent.subhead} />
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Filter by blog category"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '0.6rem',
            marginBottom: 'clamp(2rem, 4vw, 3rem)',
          }}
        >
          <span
            aria-hidden="true"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.22em',
              color: 'var(--color-text-tertiary)',
              textTransform: 'uppercase',
              marginRight: '0.4rem',
            }}
          >
            Category /
          </span>
          {blogFeedContent.categoryFilters.map((filter) => (
            <FilterChip
              key={filter}
              label={filter}
              active={activeCategory === filter}
              onClick={() => setActiveCategory(filter)}
            />
          ))}
          <span
            style={{
              marginLeft: 'auto',
              alignSelf: 'center',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.18em',
              color: 'var(--color-text-tertiary)',
              textTransform: 'uppercase',
            }}
          >
            {isSearching && (
              <button
                type="button"
                onClick={() => blogSearch.set('')}
                style={{
                  padding: '0.3rem 0.6rem',
                  background: 'transparent',
                  border: '1px solid rgba(168,240,255,0.22)',
                  color: 'var(--color-beam)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Clear search ×
              </button>
            )}
            {visiblePosts.length + (showFeatured ? 1 : 0)} /{' '}
            {blogFeedContent.posts.length} Posts
          </span>
        </div>

        {showFeatured && featuredPost && (
          <div className="blog-feed-featured-wrap">
            <PostCard post={featuredPost} featured />
          </div>
        )}

        <div ref={gridRef} className="blog-feed-grid">
          {visiblePosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        {visiblePosts.length === 0 && !showFeatured && (
          <div
            style={{
              padding: '3rem 1.5rem',
              textAlign: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-tertiary)',
              letterSpacing: '0.08em',
              border: '1px dashed rgba(168,240,255,0.18)',
            }}
          >
            {isSearching
              ? `// No dispatches match "${searchQuery.trim()}" — try a different query or clear filters.`
              : '// No dispatches under this category yet. Check back soon.'}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 'clamp(2.5rem, 5vw, 4rem)',
          }}
        >
          <Link
            href={blogFeedContent.viewAllCta.href}
            className="blog-feed-view-all"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '1rem 2.25rem',
              background: 'var(--color-beam)',
              color: 'var(--color-void)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-base)',
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              boxShadow: '0 0 24px rgba(168,240,255,0.35)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.transform = 'translateY(-2px)';
              el.style.boxShadow = '0 0 36px rgba(168,240,255,0.55)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.transform = 'translateY(0)';
              el.style.boxShadow = '0 0 24px rgba(168,240,255,0.35)';
            }}
          >
            {blogFeedContent.viewAllCta.label}
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
