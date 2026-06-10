'use client';
/**
 * About page (v1.3 content rewrite).
 *
 * Section order now follows the partner-facing narrative:
 *   1  Hero            — Empowering Institutions. Shaping Future Talent.
 *   2  Why CyCraft     — Building Future-Ready Professionals      (03-mission)
 *   3  What We Do      — Comprehensive Academic Partnership       (04-values)
 *   4  Our Impact      — Creating Measurable Outcomes             (02-stats)
 *   5  Our Approach    — Learn. Practice. Apply. Excel.           (05-approach)
 *   6  Partnership     — Supporting Institutions at Every Stage   (06-leadership)
 *   7  Vision          — Future-of-institutional-partnerships     (08-milestones)
 *   8  CTA             — Let's Build the Future Together          (10-final-cta)
 *
 * 07-team and 09-timeline are intentionally dropped — the v1.3 spec has no
 * copy for them. Files left on disk so they can be re-introduced later.
 */
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
const AboutMilestones = dynamic(() => import('@/features/about/08-milestones'), {
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
      {/* 1 — Hero */}
      <AboutHero />

      {/* Hero → Why CyCraft — beam fires forward, white flash */}
      <ActTransition targetSelector="#about-mission" type="i-to-ii" />

      {/* 2 — Why CyCraft */}
      <AboutMission />

      {/* → What We Do — radial iris */}
      <ActTransition targetSelector="#about-values" type="ii-to-iii" />

      {/* 3 — What We Do */}
      <AboutValues />

      {/* → Our Impact — diagonal cyan slash */}
      <ActTransition targetSelector="#about-stats" type="iii-to-iv" />

      {/* 4 — Our Impact */}
      <AboutStats />

      {/* → Our Approach — red curtain */}
      <ActTransition targetSelector="#about-approach" type="iv-to-v" />

      {/* 5 — Our Learning Approach */}
      <AboutApproach />

      {/* → Partnership Model — vertical curtain split */}
      <ActTransition targetSelector="#about-leadership" type="v-to-vi" />

      {/* 6 — Academic Partnership Model */}
      <AboutLeadership />

      {/* → Vision — radial iris reused as a softer hand-off */}
      <ActTransition targetSelector="#about-milestones" type="ii-to-iii" />

      {/* 7 — Vision for the Future */}
      <AboutMilestones />

      {/* → CTA — final beam-and-flash crescendo */}
      <ActTransition targetSelector="#about-cta" type="i-to-ii" />

      {/* 8 — Call to Action */}
      <AboutFinalCta />
      <HomeFooter />
    </>
  );
}
