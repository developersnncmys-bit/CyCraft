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
import { Suspense, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
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
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL is the source of truth — modal is open while ?apply=1 is set.
  // Closing strips the param via router.replace, which re-renders this
  // component with `open === false`. Avoids the lint warning about
  // calling setState from inside useEffect (and avoids the bug where
  // an internal `open` state could drift from the URL).
  const open = searchParams.get('apply') === '1';

  const handleClose = () => {
    const next = new URLSearchParams(searchParams.toString());
    next.delete('apply');
    const qs = next.toString();
    router.replace(qs ? `/courses?${qs}` : '/courses', { scroll: false });
  };

  return <ApplyModal isOpen={open} onClose={handleClose} />;
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
