'use client';
/**
 * Courses page — 4 acts + footer.
 *
 *   Act I   — Hero (autoplay reveal, NOT pinned, mirrors AboutHero)
 *   Act II  — Catalog (free-scroll grid + level filters; 21 courses, so a
 *             pinned scrub would trap the user — they need to browse)
 *   Act III — Learning Path Customisation (pinned cinematic, 3 pillars)
 *   Act IV  — Guidance CTA (pinned, schedule consultation)
 *   Footer  — shared HomeFooter
 *
 * Apply Now modal — opens automatically when the URL carries `?apply=1`.
 * This lets other surfaces (e.g. the home CTF section) deep-link directly
 * into the "apply" intent: `/courses?apply=1` lands here, modal pops over
 * the catalogue. Closing the modal strips the param so refreshing or
 * sharing the URL doesn't immediately re-open it.
 *
 * Static imports (not dynamic) — pinned scrub timelines require every
 * section's real height at first measurement, same reasoning as Contact.
 */
import { Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { ScrollTrigger } from '@/lib/gsap/register';
import CoursesHero from '@/features/courses/01-hero';
import CoursesCatalog from '@/features/courses/02-catalog';
import CoursesLearningPath from '@/features/courses/03-learning-path';
import CoursesGuidance from '@/features/courses/04-guidance';
import HomeFooter from '@/features/home/11-footer';
import { ActTransition } from '@/components/layout/ActTransition';

const ApplyModal = dynamic(() => import('@/features/22-apply-modal'), { ssr: false });

// `useSearchParams` requires a Suspense boundary in Next 14+ when used in
// client components rendered into a server-component tree. Wrap the param-
// reader in its own component so the rest of the page can render while the
// query params resolve.
function ApplyModalGate() {
  const searchParams = useSearchParams();
  // The URL `?apply=1` is a one-shot SIGNAL: read it on first mount,
  // open the modal, then strip it from the URL via window.history so the
  // Next.js router never sees the change. From that point on, the modal
  // is managed by local state. This avoids `router.replace` on close —
  // which was incidentally triggering a full-tree reconciliation that
  // re-applied the Preloader's style prop and flashed it back on screen.
  const [open, setOpen] = useState(() => searchParams.get('apply') === '1');

  useEffect(() => {
    if (!open) return;
    if (typeof window === 'undefined') return;
    if (window.location.search.includes('apply=')) {
      const url = new URL(window.location.href);
      url.searchParams.delete('apply');
      const qs = url.searchParams.toString();
      window.history.replaceState(
        null,
        '',
        qs ? `${url.pathname}?${qs}` : url.pathname,
      );
    }
  }, [open]);

  return <ApplyModal isOpen={open} onClose={() => setOpen(false)} />;
}

export default function CoursesPage() {
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <>
      <CoursesHero />

      {/* I → II — beam fires forward, white flash into the catalogue */}
      <ActTransition targetSelector="#courses-catalog" type="i-to-ii" />

      <CoursesCatalog />

      {/* II → III — radial iris (camera lens) into the learning-path triad */}
      <ActTransition targetSelector="#courses-learning-path" type="ii-to-iii" />

      <CoursesLearningPath />

      {/* III → IV — diagonal cyan slash into the final CTA */}
      <ActTransition targetSelector="#courses-guidance" type="iii-to-iv" />

      <CoursesGuidance />

      {/* IV → V — vertical curtain split into the footer */}
      <ActTransition targetSelector="footer[id='contact']" type="v-to-vi" />

      <HomeFooter />

      <Suspense fallback={null}>
        <ApplyModalGate />
      </Suspense>
    </>
  );
}
