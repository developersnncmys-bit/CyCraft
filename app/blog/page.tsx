'use client';
/**
 * Blog page — 3 acts + footer.
 *
 *   Act I   — Hero (autoplay reveal, NOT pinned)
 *   Act II  — Feed (free-scroll grid + featured + category filter)
 *   Act III — Subscribe CTA (pinned cinematic)
 *   Footer  — shared HomeFooter
 *
 * Static imports — pinned scrub timelines need every section's real
 * height at first measurement, same reasoning as /contact and /courses.
 */
import { useEffect } from 'react';
import { ScrollTrigger } from '@/lib/gsap/register';
import BlogHero from '@/features/blog/01-hero';
import BlogFeed from '@/features/blog/02-feed';
import BlogSubscribe from '@/features/blog/03-subscribe';
import HomeFooter from '@/features/home/11-footer';
import { ActTransition } from '@/components/layout/ActTransition';

export default function BlogPage() {
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <>
      <BlogHero />

      {/* I → II — beam fires forward, white flash into the feed */}
      <ActTransition targetSelector="#blog-feed" type="i-to-ii" />

      <BlogFeed />

      {/* II → III — radial iris into the subscribe CTA */}
      <ActTransition targetSelector="#blog-subscribe" type="ii-to-iii" />

      <BlogSubscribe />

      {/* III → IV — vertical curtain split into the footer */}
      <ActTransition targetSelector="footer[id='contact']" type="v-to-vi" />

      <HomeFooter />
    </>
  );
}
