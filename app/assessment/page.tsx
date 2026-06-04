'use client';
/**
 * Assessment page — autoplay hero + 5 pinned cinematic acts + footer.
 *
 *   Act I   — Hero (autoplay reveal, NOT pinned, dual CTA to exam portal)
 *   Act II  — Categories (pinned, 4 tracks: Aptitude / Technical / Lab / Cert)
 *   Act III — Interface Preview (pinned, full mock exam UI walk-through)
 *   Act IV  — Results Scorecard (pinned, score counter + section bars)
 *   Act V   — Leaderboard (pinned, top-10 cascade with podium badges)
 *   Act VI  — CTA close (pinned, opens external exam portal)
 *   Footer  — shared HomeFooter
 *
 * The page is a marketing surface for the LMS exam engine (PRD §3.5 +
 * §4.5). Every actionable button on the page (Hero primary + CTA primary)
 * opens `assessmentConfig.examPortalUrl` in a new tab — swap that URL
 * once the real portal is provisioned and every CTA updates.
 *
 * Static imports so ActTransition can measure section heights on first
 * paint — same reason CoursesPage / ResearchPage / VerifyPage avoid
 * dynamic imports.
 */
import { useEffect } from 'react';
import { ScrollTrigger } from '@/lib/gsap/register';
import AssessmentHero from '@/features/assessment/01-hero';
import AssessmentCategories from '@/features/assessment/02-categories';
import AssessmentInterface from '@/features/assessment/03-interface';
import AssessmentResults from '@/features/assessment/04-results';
import AssessmentLeaderboard from '@/features/assessment/05-leaderboard';
import AssessmentCta from '@/features/assessment/06-cta';
import HomeFooter from '@/features/home/11-footer';
import { ActTransition } from '@/components/layout/ActTransition';

export default function AssessmentPage() {
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <>
      <AssessmentHero />

      <ActTransition targetSelector="#assessment-categories" type="i-to-ii" />

      <AssessmentCategories />

      <ActTransition targetSelector="#assessment-interface" type="ii-to-iii" />

      <AssessmentInterface />

      <ActTransition targetSelector="#assessment-results" type="iii-to-iv" />

      <AssessmentResults />

      <ActTransition targetSelector="#assessment-leaderboard" type="iv-to-v" />

      <AssessmentLeaderboard />

      <ActTransition targetSelector="#assessment-cta" type="v-to-vi" />

      <AssessmentCta />

      <HomeFooter />
    </>
  );
}
