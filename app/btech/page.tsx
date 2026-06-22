'use client';
// Btech page — film-mode cinema. Every section (2-21) pins, scrubs against
// scroll, parallaxes its layers, and hands off via a full-screen masked
// reveal at every act boundary.
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
import LearningPartnersSection from '@/features/14a-learning-partners';
import HiringTournamentsSection from '@/features/15-hiring-tournaments';
import PlacementsSection from '@/features/16-placements';
import CampusSection from '@/features/17-campus';
import AdmissionSection from '@/features/18-admission';
import EligibilitySection from '@/features/19-eligibility';
import PartnersSection from '@/features/20-partners';
import CTAFooterSection from '@/features/21-cta-footer';
import { FilmAtmosphere } from '@/components/layout/FilmAtmosphere';
import { FilmActTransition } from '@/components/layout/FilmActTransition';

export default function BTechPage() {
  return (
    <>
      <FilmAtmosphere />

      {/* Act I — Dormancy */}
      <HeroSection />
      <AchievementsSection />

      {/* Act I → II */}
      <FilmActTransition targetSelector="#pillars" type="beam-burst" />

      {/* Act II — Ignition */}
      <PillarsSection />
      <PhilosophySection />
      <ProgramOverviewSection />

      {/* Act II → III */}
      <FilmActTransition targetSelector="#tracks" type="iris" />

      {/* Act III — Divergence */}
      <TracksSection />
      <ResearchWingSection />
      <ProjectsSection />
      <SpecializationsSection />

      {/* Act III → IV */}
      <FilmActTransition targetSelector="#certifications" type="slash" />

      {/* Act IV — Architecture */}
      <CertificationsSection />
      <CurriculumRoadmapSection />
      <LearningEvolutionSection />
      <BattlegroundsSection />

      {/* Act IV → V */}
      <FilmActTransition targetSelector="#comparison" type="curtain-red" />

      {/* Act V — Proof */}
      <ComparisonSection />
      <LearningPartnersSection />
      <HiringTournamentsSection />
      <PlacementsSection />
      <CampusSection />

      {/* Act V → VI */}
      <FilmActTransition targetSelector="#admission" type="split" />

      {/* Act VI — Invitation */}
      <AdmissionSection />
      <EligibilitySection />
      <PartnersSection />
      <CTAFooterSection />
    </>
  );
}
