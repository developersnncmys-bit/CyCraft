'use client';
/**
 * Research page — autoplay hero + 5 pinned cinematic acts + footer.
 *
 *   Act I   — Hero (autoplay fade-in on load, light scrub parallax, NOT pinned)
 *   Act II  — Focus (pinned, 6-card walk with image zoom on active card)
 *   Act III — Stats (pinned, counter ignite)
 *   Act IV  — Publications (pinned, 3 papers)
 *   Act V   — Pillars (pinned, red/cyan duality with icon rotate-in)
 *   Act VI  — CTA (pinned, beam crescendo close)
 *   Footer  — shared HomeFooter
 *
 * Visual styling (typography, spacing, palette) mirrors the About page so
 * the two pages feel like part of the same publication. Hero stays
 * unpinned so the page opens with the same cadence as the rest of the
 * site (preloader → word-by-word reveal) — the cinematic pin chain begins
 * at Focus and carries through CTA.
 *
 * Static imports so ActTransition can measure section heights on first
 * paint — same reason CoursesPage avoids dynamic imports.
 */
import { useEffect } from 'react';
import { ScrollTrigger } from '@/lib/gsap/register';
import ResearchHero from '@/features/research/01-hero';
import ResearchFocus from '@/features/research/02-focus';
import ResearchStats from '@/features/research/03-stats';
import ResearchPublications from '@/features/research/04-publications';
import ResearchPillars from '@/features/research/05-pillars';
import ResearchCta from '@/features/research/06-cta';
import HomeFooter from '@/features/home/11-footer';
import { ActTransition } from '@/components/layout/ActTransition';

export default function ResearchPage() {
  useEffect(() => {
    // Pinned sections measure their height on first ScrollTrigger setup; a
    // delayed refresh after fonts/images settle keeps the pin boundaries
    // accurate.
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <>
      <ResearchHero />

      {/* I → II — beam fires forward, white flash into the focus grid */}
      <ActTransition targetSelector="#research-focus" type="i-to-ii" />

      <ResearchFocus />

      {/* II → III — radial iris (camera lens) into the counter band */}
      <ActTransition targetSelector="#research-stats" type="ii-to-iii" />

      <ResearchStats />

      {/* III → IV — diagonal cyan slash into the publications */}
      <ActTransition targetSelector="#publications" type="iii-to-iv" />

      <ResearchPublications />

      {/* IV → V — red curtain close into the pillars */}
      <ActTransition targetSelector="#research-pillars" type="iv-to-v" />

      <ResearchPillars />

      {/* V → VI — vertical curtain split into the closing CTA */}
      <ActTransition targetSelector="#research-cta" type="v-to-vi" />

      <ResearchCta />

      <HomeFooter />
    </>
  );
}
