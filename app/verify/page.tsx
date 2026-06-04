'use client';
/**
 * Verify page — autoplay hero + 4 pinned cinematic acts + footer.
 *
 *   Act I   — Hero (autoplay reveal on load, NOT pinned)
 *   Act II  — Verify Form (pinned, stateful lookup + inline result card)
 *   Act III — How It Works (pinned, 3 steps)
 *   Act IV  — QR-based Verification (pinned, two-column with QR mockup)
 *   Act V   — CTA close (pinned, beam crescendo, dual CTA)
 *   Footer  — shared HomeFooter
 *
 * The Form section uses `useSearchParams` to support QR-code deep-links
 * (/verify?id=CYC-2024-0142). React requires `useSearchParams` callers to
 * sit inside a <Suspense> boundary so the page can statically render the
 * surrounding shell while the search-param-dependent subtree streams in.
 *
 * Static imports so ActTransition can measure section heights on first
 * paint — same reason CoursesPage / ResearchPage avoid dynamic imports.
 */
import { Suspense, useEffect } from 'react';
import { ScrollTrigger } from '@/lib/gsap/register';
import VerifyHero from '@/features/verify/01-hero';
import VerifyForm from '@/features/verify/02-form';
import VerifyHowItWorks from '@/features/verify/03-how-it-works';
import VerifyQr from '@/features/verify/04-qr';
import VerifyCta from '@/features/verify/05-cta';
import HomeFooter from '@/features/home/11-footer';
import { ActTransition } from '@/components/layout/ActTransition';

function VerifyFormFallback() {
  // Matches the form section's vertical footprint so the ScrollTrigger pin
  // window doesn't shift when the real form mounts and replaces this.
  return <div style={{ minHeight: '100vh' }} />;
}

export default function VerifyPage() {
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <>
      <VerifyHero />

      <ActTransition targetSelector="#verify-form" type="i-to-ii" />

      <Suspense fallback={<VerifyFormFallback />}>
        <VerifyForm />
      </Suspense>

      <ActTransition targetSelector="#verify-how-it-works" type="ii-to-iii" />

      <VerifyHowItWorks />

      <ActTransition targetSelector="#verify-qr" type="iii-to-iv" />

      <VerifyQr />

      <ActTransition targetSelector="#verify-cta" type="v-to-vi" />

      <VerifyCta />

      <HomeFooter />
    </>
  );
}
