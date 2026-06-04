'use client';
/**
 * Gallery page — autoplay hero + 4 pinned cinematic acts + footer.
 *
 *   Act I   — Hero (autoplay reveal, NOT pinned)
 *   Act II  — Events (pinned, 9 placeholder gradient cards cascade in)
 *   Act III — Videos (pinned, 4 thumbnail tiles with external YouTube links)
 *   Act IV  — Stats (pinned, 4 counters — events, attendees, cities, hours)
 *   Act V   — CTA close (pinned, "Host CyCraft at Your Campus")
 *   Footer  — shared HomeFooter
 *
 * The Events grid uses deterministic gradient placeholders cycled across
 * a 5-tone palette — once the Admin Panel ships media uploads (PRD §3.9),
 * each gradient cell can be swapped for the real album cover image and
 * the cascade timeline picks up the new content automatically.
 *
 * Static imports so ActTransition can measure section heights on first
 * paint — same reason every other cinema page avoids dynamic imports.
 */
import { useEffect } from 'react';
import { ScrollTrigger } from '@/lib/gsap/register';
import GalleryHero from '@/features/gallery/01-hero';
import GalleryEvents from '@/features/gallery/02-events';
import GalleryVideos from '@/features/gallery/03-videos';
import GalleryStats from '@/features/gallery/04-stats';
import GalleryCta from '@/features/gallery/05-cta';
import HomeFooter from '@/features/home/11-footer';
import { ActTransition } from '@/components/layout/ActTransition';

export default function GalleryPage() {
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <>
      <GalleryHero />

      <ActTransition targetSelector="#gallery-events" type="i-to-ii" />

      <GalleryEvents />

      <ActTransition targetSelector="#gallery-videos" type="ii-to-iii" />

      <GalleryVideos />

      <ActTransition targetSelector="#gallery-stats" type="iii-to-iv" />

      <GalleryStats />

      <ActTransition targetSelector="#gallery-cta" type="v-to-vi" />

      <GalleryCta />

      <HomeFooter />
    </>
  );
}
