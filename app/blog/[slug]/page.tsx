/**
 * Blog Post Detail page — dynamic route at /blog/<slug>.
 *
 * Server component so `generateStaticParams` can pre-render every known
 * post at build time (required by `output: 'export'`). Resolves the
 * Promise-typed `params` (see node_modules/next/dist/docs for the App
 * Router async-params convention) and passes plain props down to the
 * client section components.
 *
 * Content sources:
 *   1. content/blog/feed.ts — base record (title, excerpt, category,
 *      author, date, read time). Required: a 404 is shown if the slug
 *      isn't in the feed.
 *   2. content/blog/posts/<slug>.ts — long-form body, tags, sources.
 *      Optional: when no detail entry is registered yet, the page still
 *      renders the hero + metadata using feed data alone and the body
 *      shows a "publishing soon" placeholder.
 */
import { notFound } from 'next/navigation';
import { blogFeedContent } from '@/content/blog/feed';
import { getBlogPostDetail } from '@/content/blog/posts';
import BlogDetailHero from '@/features/blog-detail/01-hero';
import BlogDetailBody from '@/features/blog-detail/02-body';
import BlogDetailInteractions from '@/features/blog-detail/04-interactions';
import BlogDetailRelated from '@/features/blog-detail/03-related';
import HomeFooter from '@/features/home/11-footer';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogFeedContent.posts.map((p) => ({ slug: p.slug }));
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const post = blogFeedContent.posts.find((p) => p.slug === slug);
  if (!post) notFound();

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
