/**
 * Research detail page — /research/[id]
 *
 * Server component (no 'use client'): awaits the Promise-typed `params`
 * (this Next.js version made params async — see
 *  node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.md).
 * Looks up the entry in `researchDetailsContent`; 404s if missing.
 * Each section is a client component that consumes a static `detail`
 * prop, so this server page does no extra round-trips.
 *
 * generateStaticParams pre-renders all six known research tracks at build
 * time. Any unknown id falls through to the runtime branch and 404s.
 */
import { notFound } from 'next/navigation';
import { researchDetailsContent } from '@/content/research/details';
import ResearchDetailHeader from '@/features/research-detail/01-header';
import ResearchDetailStats from '@/features/research-detail/02-stats';
import ResearchDetailOverview from '@/features/research-detail/03-overview';
import ResearchDetailTeam from '@/features/research-detail/04-team';
import ResearchDetailCta from '@/features/research-detail/05-cta';
import HomeFooter from '@/features/home/11-footer';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return Object.keys(researchDetailsContent).map((id) => ({ id }));
}

export default async function ResearchDetailPage({ params }: PageProps) {
  const { id } = await params;
  const detail = researchDetailsContent[id];
  if (!detail) notFound();

  return (
    <>
      <ResearchDetailHeader detail={detail} />
      <ResearchDetailStats detail={detail} />
      <ResearchDetailOverview detail={detail} />
      <ResearchDetailTeam detail={detail} />
      <ResearchDetailCta />
      <HomeFooter />
    </>
  );
}
