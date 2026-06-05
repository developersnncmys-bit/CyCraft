/**
 * Course Detail page — dynamic route at /courses/<slug>.
 *
 * Server component so `generateStaticParams` can pre-render every known
 * course at build time (required by `output: 'export'`). Resolves the
 * Promise-typed `params` (see node_modules/next/dist/docs for the App
 * Router async-params convention) and passes plain props down to the
 * client section components.
 *
 * Content sources:
 *   1. content/courses/catalog.ts — base record (title, level, weeks,
 *      price, short description). Required: a 404 is shown if the slug
 *      isn't in the catalogue.
 *   2. content/courses/details/<slug>.ts — long-form fields (long
 *      description, syllabus, prerequisites, outcomes). Optional: when
 *      no detail entry is registered yet, the page still renders the
 *      hero + enquiry form using catalogue data alone and the syllabus
 *      column shows a friendly "being finalised" notice.
 */
import { notFound } from 'next/navigation';
import { coursesCatalogContent } from '@/content/courses/catalog';
import { getCourseDetail } from '@/content/courses/details';
import CourseHero from '@/features/course-detail/01-hero';
import CourseSyllabusForm from '@/features/course-detail/03-syllabus-form';
import CoursePrereqOutcomes from '@/features/course-detail/04-prereq-outcomes';
import HomeFooter from '@/features/home/11-footer';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return coursesCatalogContent.courses.map((c) => ({ slug: c.slug }));
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const course = coursesCatalogContent.courses.find((c) => c.slug === slug);
  if (!course) notFound();

  const details = getCourseDetail(slug);

  return (
    <>
      <CourseHero course={course} longDescription={details?.longDescription} />
      <CourseSyllabusForm course={course} syllabus={details?.syllabus ?? null} />
      <CoursePrereqOutcomes
        prerequisites={details?.prerequisites ?? []}
        outcomes={details?.outcomes ?? []}
      />
      <HomeFooter />
    </>
  );
}
