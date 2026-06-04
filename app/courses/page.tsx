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
 * Static imports (not dynamic) — pinned scrub timelines require every
 * section's real height at first measurement, same reasoning as Contact.
 */
import { useEffect } from 'react';
import { ScrollTrigger } from '@/lib/gsap/register';
import CoursesHero from '@/features/courses/01-hero';
import CoursesCatalog from '@/features/courses/02-catalog';
import CoursesLearningPath from '@/features/courses/03-learning-path';
import CoursesGuidance from '@/features/courses/04-guidance';
import HomeFooter from '@/features/home/11-footer';
import { ActTransition } from '@/components/layout/ActTransition';

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
    </>
  );
}
