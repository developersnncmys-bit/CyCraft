'use client';
// Sections load statically (not lazy/client-only) so the whole pinned layout —
// every section's GSAP pin-spacer — initialises in one pass. Lazy `ssr: false`
// imports mounted at staggered times, forcing repeated ScrollTrigger refreshes
// that jumped/glitched the section-to-section handoffs.
import HeroSection from '@/features/01-hero';
import AchievementsSection from '@/features/02-achievements';
import PillarsSection from '@/features/03-pillars';
import PhilosophySection from '@/features/04-philosophy';
import ProgramOverviewSection from '@/features/05-program-overview';
import TracksSection from '@/features/06-tracks';
import ResearchWingSection from '@/features/07-research-wing';
import ProjectsSection from '@/features/08-projects';
import SpecializationsSection from '@/features/09-specializations';
import CertificationsSection from '@/features/10-certifications';
import CurriculumRoadmapSection from '@/features/11-curriculum-roadmap';
import LearningEvolutionSection from '@/features/12-learning-evolution';
import BattlegroundsSection from '@/features/13-battlegrounds';
import ComparisonSection from '@/features/14-comparison';
import HiringTournamentsSection from '@/features/15-hiring-tournaments';
import PlacementsSection from '@/features/16-placements';
import CampusSection from '@/features/17-campus';
import AdmissionSection from '@/features/18-admission';
import EligibilitySection from '@/features/19-eligibility';
import PartnersSection from '@/features/20-partners';
import CTAFooterSection from '@/features/21-cta-footer';
import { ActTransition } from '@/components/layout/ActTransition';
import { BTechAtmosphere } from '@/components/layout/BTechAtmosphere';

export default function BTechPage() {
  return (
    <>
      <BTechAtmosphere />

      {/* Act I — Dormancy */}
      <HeroSection />
      <AchievementsSection />

      {/* Act I → II boundary — beam fires forward + white fade */}
      <ActTransition targetSelector="#pillars" type="i-to-ii" />

      {/* Act II — Ignition */}
      <PillarsSection />
      <PhilosophySection />
      <ProgramOverviewSection />

      {/* Act III — Divergence */}
      <TracksSection />
      <ResearchWingSection />
      <ProjectsSection />
      <SpecializationsSection />

      {/* Act IV — Architecture */}
      <CertificationsSection />
      <CurriculumRoadmapSection />
      <LearningEvolutionSection />
      <BattlegroundsSection />

      {/* Act V — Proof */}
      <ComparisonSection />
      <HiringTournamentsSection />
      <PlacementsSection />
      <CampusSection />

      {/* Act VI — Invitation */}
      <AdmissionSection />
      <EligibilitySection />
      <PartnersSection />
      <CTAFooterSection />
    </>
  );
}
