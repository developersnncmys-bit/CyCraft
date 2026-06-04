'use client';
/**
 * Course Detail page — dynamic route at /courses/<slug>.
 *
 * Single shared template that resolves content from two sources:
 *   1. content/courses/catalog.ts — base record (title, level, weeks,
 *      price, short description). Required: a 404 is shown if the slug
 *      isn't in the catalogue.
 *   2. content/courses/details/<slug>.ts — long-form fields (long
 *      description, syllabus, prerequisites, outcomes). Optional: when
 *      no detail entry is registered yet, the page still renders the
 *      hero + enquiry form using catalogue data alone and the syllabus
 *      column shows a friendly "being finalised" notice.
 *
 * Sections (top → bottom):
 *   I.  Hero        — back link, title, long description, meta pills
 *   II. Mascot      — gradient visual centrepiece (per-slug accent)
 *   III. Syllabus + sticky Enquire Now form
 *   IV. Prerequisites + Learning Outcomes (only when at least one list
 *       has content)
 *   Footer — shared HomeFooter
 */
import { useParams, notFound } from 'next/navigation';
import { coursesCatalogContent } from '@/content/courses/catalog';
import { getCourseDetail } from '@/content/courses/details';
import CourseHero from '@/features/course-detail/01-hero';
import CourseMascot from '@/features/course-detail/02-mascot';
import CourseSyllabusForm from '@/features/course-detail/03-syllabus-form';
import CoursePrereqOutcomes from '@/features/course-detail/04-prereq-outcomes';
import HomeFooter from '@/features/home/11-footer';

export default function CourseDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;

  if (!slug) notFound();

  const course = coursesCatalogContent.courses.find((c) => c.slug === slug);
  if (!course) notFound();

  // Detail entry is OPTIONAL — courses without one still render the
  // hero + form using catalogue data.
  const details = getCourseDetail(slug);

  return (
    <>
      <CourseHero course={course} longDescription={details?.longDescription} />
      <CourseMascot course={course} />
      <CourseSyllabusForm course={course} syllabus={details?.syllabus ?? null} />
      <CoursePrereqOutcomes
        prerequisites={details?.prerequisites ?? []}
        outcomes={details?.outcomes ?? []}
      />
      <HomeFooter />
    </>
  );
}
