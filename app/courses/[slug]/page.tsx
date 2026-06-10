/**
 * Course Detail page — dynamic route at /courses/<slug>.
 *
 * Server component so `generateStaticParams` can pre-render every known
 * course at build time (required by `output: 'export'`). Resolves the
 * Promise-typed `params` (see node_modules/next/dist/docs for the App
 * Router async-params convention) and passes plain props down to the
 * client section components.
 *
 * Page flow (4 acts, no pinned animations — cinematic CyCraft scroll
 * reveals only):
 *
 *   I    — Mission Briefing       (replaces full-bleed image hero)
 *   II   — Curriculum Timeline    (vertical numbered timeline)
 *   III  — Operator Profile       (HUD-panelled prereqs + outcomes)
 *   IV   — Deployment             (apply CTA + enquiry form on its own)
 *
 * Content sources:
 *   1. content/courses/catalog.ts — base record. Required: a 404 is
 *      shown if the slug isn't in the catalogue.
 *   2. content/courses/details/<slug>.ts — long-form fields (long
 *      description, syllabus, prerequisites, outcomes). Optional —
 *      each section degrades gracefully when missing.
 */
import { notFound } from 'next/navigation';
import { coursesCatalogContent } from '@/content/courses/catalog';
import { getCourseDetail } from '@/content/courses/details';
import { ActTransition } from '@/components/layout/ActTransition';
import CourseHero from '@/features/course-detail/01-hero';
import CourseCurriculum from '@/features/course-detail/03-curriculum';
import OperatorProfile from '@/features/course-detail/04-operator-profile';
import CourseDeployment from '@/features/course-detail/05-deployment';
import HomeFooter from '@/features/home/11-footer';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  // Return every catalog course (including external-URL ones). With
  // `output: 'export'`, this function must produce at least one entry,
  // and Next pre-renders each. External-URL courses render as 404 below
  // since their content lives on the partner site; this is acceptable
  // because the catalog cards link straight to the partner URL and the
  // internal detail route is unreachable through normal navigation.
  return coursesCatalogContent.courses.map((c) => ({ slug: c.slug }));
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const course = coursesCatalogContent.courses.find((c) => c.slug === slug);
  // External-URL courses (EC-Council partner pages) don't have internal
  // detail content — if a user hits the detail route directly via deep
  // link, render the standard 404. Catalog cards bypass this route by
  // linking to `externalUrl` directly.
  if (!course || course.externalUrl) notFound();

  const details = getCourseDetail(slug);

  // Each section receives `key={slug}` so React tears down + remounts on
  // every navigation between course detail pages, instead of treating
  // them as the same component instance with new props. Without the key,
  // useGSAP's cleanup/setup runs but ScrollTrigger and the preloader-
  // gated playEntry can land in an in-between state where the reveal
  // animations don't fire on the second/third visit.
  return (
    <>
      <CourseHero key={`hero-${slug}`} course={course} longDescription={details?.longDescription} />

      {/* I → II — beam fires forward, white flash dissolves into curriculum */}
      <ActTransition targetSelector="#cd-curriculum" type="i-to-ii" />

      <CourseCurriculum key={`cur-${slug}`} course={course} syllabus={details?.syllabus ?? null} />

      {/* II → III — radial iris from centre outward into operator profile */}
      <ActTransition targetSelector="#cd-operator-profile" type="ii-to-iii" />

      <OperatorProfile
        key={`op-${slug}`}
        prerequisites={details?.prerequisites ?? []}
        outcomes={details?.outcomes ?? []}
      />

      {/* III → IV — diagonal cyan slash into deployment */}
      <ActTransition targetSelector="#cd-deployment" type="iii-to-iv" />

      <CourseDeployment key={`dep-${slug}`} course={course} />
      <HomeFooter />
    </>
  );
}
