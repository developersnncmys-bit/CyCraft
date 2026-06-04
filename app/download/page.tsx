'use client';
/**
 * Download page — autoplay hero + 6 pinned cinematic acts + footer.
 *
 *   Act I    — Hero (autoplay reveal, NOT pinned, dual CTA into vault)
 *   Act II   — Certificate Retrieval (pinned, email→certificate form,
 *              honours EthicalByte reference site's primary action)
 *   Act III  — Categories (4 vaults: Study / Research / Tools / Restricted)
 *   Act IV   — Featured Files (top-10 download cascade table)
 *   Act V    — Tools showcase (6 toolkit cards, 3×2 grid)
 *   Act VI   — Access tiers (Public / Member / Premium triptych)
 *   Act VII  — CTA close (browse courses + talk to admissions)
 *   Footer   — shared HomeFooter
 *
 * The page is the marketing surface for the resource library (PRD §3.6).
 * File entries, categories, tools, and access tiers all live under
 * `content/download/` so the future Admin CMS can swap them without
 * touching feature code. The Certificate Retrieval section is a feature
 * the EthicalByte reference site treats as the page's headline — honoured
 * by giving it the slot right after the hero.
 *
 * Static imports so ActTransition can measure section heights on first
 * paint — same reason CoursesPage / AssessmentPage avoid dynamic imports.
 */
import { useEffect } from 'react';
import { ScrollTrigger } from '@/lib/gsap/register';
import DownloadHero from '@/features/download/01-hero';
import DownloadCertificate from '@/features/download/02-certificate';
import DownloadCategories from '@/features/download/03-categories';
import DownloadFiles from '@/features/download/04-files';
import DownloadTools from '@/features/download/05-tools';
import DownloadAccess from '@/features/download/06-access';
import DownloadCta from '@/features/download/07-cta';
import HomeFooter from '@/features/home/11-footer';
import { ActTransition } from '@/components/layout/ActTransition';

export default function DownloadPage() {
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <>
      <DownloadHero />

      <ActTransition targetSelector="#download-certificate" type="i-to-ii" />

      <DownloadCertificate />

      <ActTransition targetSelector="#download-categories" type="ii-to-iii" />

      <DownloadCategories />

      <ActTransition targetSelector="#download-files" type="iii-to-iv" />

      <DownloadFiles />

      <ActTransition targetSelector="#download-tools" type="iv-to-v" />

      <DownloadTools />

      <ActTransition targetSelector="#download-access" type="v-to-vi" />

      <DownloadAccess />

      <ActTransition targetSelector="#download-cta" type="i-to-ii" />

      <DownloadCta />

      <HomeFooter />
    </>
  );
}
