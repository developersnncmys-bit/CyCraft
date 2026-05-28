'use client';
import dynamic from 'next/dynamic';
import AboutHero from '@/features/about/01-hero';
import { ActTransition } from '@/components/layout/ActTransition';

const placeholder = (height = '100vh') => () => <div style={{ minHeight: height }} />;

const AboutStats = dynamic(() => import('@/features/about/02-stats'), {
  loading: placeholder('100vh'),
  ssr: false,
});
const AboutMission = dynamic(() => import('@/features/about/03-mission'), {
  loading: placeholder('100vh'),
  ssr: false,
});
const AboutValues = dynamic(() => import('@/features/about/04-values'), {
  loading: placeholder('100vh'),
  ssr: false,
});
const AboutApproach = dynamic(() => import('@/features/about/05-approach'), {
  loading: placeholder('100vh'),
  ssr: false,
});
const AboutLeadership = dynamic(() => import('@/features/about/06-leadership'), {
  loading: placeholder('100vh'),
  ssr: false,
});
const AboutTeam = dynamic(() => import('@/features/about/07-team'), {
  loading: placeholder('100vh'),
  ssr: false,
});
const AboutMilestones = dynamic(() => import('@/features/about/08-milestones'), {
  loading: placeholder('100vh'),
  ssr: false,
});
const AboutTimeline = dynamic(() => import('@/features/about/09-timeline'), {
  loading: placeholder('100vh'),
  ssr: false,
});
const AboutFinalCta = dynamic(() => import('@/features/about/10-final-cta'), {
  loading: placeholder('100vh'),
  ssr: false,
});
const HomeFooter = dynamic(() => import('@/features/home/11-footer'), {
  loading: placeholder('40vh'),
  ssr: false,
});

export default function AboutPage() {
  return (
    <>
      {/* Act I — Identity */}
      <AboutHero />

      {/* Act I → II — Beam fires forward, white flash */}
      <ActTransition targetSelector="#about-stats" type="i-to-ii" />

      {/* Act II — Proof of decade */}
      <AboutStats />
      <AboutMission />

      {/* Act II → III — Radial iris (camera lens) */}
      <ActTransition targetSelector="#about-values" type="ii-to-iii" />

      {/* Act III — Values, method, people */}
      <AboutValues />
      <AboutApproach />

      {/* Act III → IV — Diagonal cyan slash */}
      <ActTransition targetSelector="#about-leadership" type="iii-to-iv" />

      <AboutLeadership />
      <AboutTeam />

      {/* Act IV → V — Red curtain close (foreshadows CTA) */}
      <ActTransition targetSelector="#about-milestones" type="iv-to-v" />

      {/* Act V — Track record */}
      <AboutMilestones />

      {/* V → VI — Vertical curtain split */}
      <ActTransition targetSelector="#about-timeline" type="v-to-vi" />

      <AboutTimeline />

      {/* Final beam-and-flash into the CTA crescendo */}
      <ActTransition targetSelector="#about-cta" type="i-to-ii" />

      <AboutFinalCta />
      <HomeFooter />
    </>
  );
}
