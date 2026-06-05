'use client';
/**
 * Blog Post Detail page — dynamic route at /blog/<slug>.
 *
 * Single shared template that resolves content from two sources:
 *   1. content/blog/feed.ts — base record (title, excerpt, category,
 *      author, date, read time). Required: a 404 is shown if the slug
 *      isn't in the feed.
 *   2. content/blog/posts/<slug>.ts — long-form body, tags, sources.
 *      Optional: when no detail entry is registered yet, the page still
 *      renders the hero + metadata using feed data alone and the body
 *      shows a "publishing soon" placeholder.
 *
 * Sections (top → bottom):
 *   I.   Hero    — back link, category chip, title, deck, author/date/read
 *   II.  Body    — content-block renderer (paragraph, heading, list,
 *                  quote, callout, code, divider) + tags + sources
 *   III. Related — three other posts (same category first, then recent)
 *   Footer — shared HomeFooter
 */
import { useParams, notFound } from 'next/navigation';
import { blogFeedContent } from '@/content/blog/feed';
import { getBlogPostDetail } from '@/content/blog/posts';
import BlogDetailHero from '@/features/blog-detail/01-hero';
import BlogDetailBody from '@/features/blog-detail/02-body';
import BlogDetailInteractions from '@/features/blog-detail/04-interactions';
import BlogDetailRelated from '@/features/blog-detail/03-related';
import HomeFooter from '@/features/home/11-footer';

export default function BlogDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;

  if (!slug) notFound();

  const post = blogFeedContent.posts.find((p) => p.slug === slug);
  if (!post) notFound();

  // Detail entry is OPTIONAL — posts without one still render the hero
  // + body placeholder using feed data.
  const detail = getBlogPostDetail(slug);

  return (
    <>
      <BlogDetailHero post={post} deck={detail?.deck} cover={post.cover} />
      <BlogDetailBody
        body={detail?.body ?? null}
        tags={detail?.tags ?? []}
        sources={detail?.sources ?? []}
      />
      <BlogDetailInteractions slug={slug} />
      <BlogDetailRelated currentSlug={slug} category={post.category} />
      <HomeFooter />
    </>
  );
}
