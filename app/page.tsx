'use client';
import dynamic from 'next/dynamic';
import HomeHero from '@/features/home/01-hero';
import { ActTransition } from '@/components/layout/ActTransition';

const placeholder = (height = '100vh') => () => <div style={{ minHeight: height }} />;

const AboutPreview = dynamic(() => import('@/features/home/02-about-preview'), {
  loading: placeholder(),
  ssr: false,
});
const FeaturedPrograms = dynamic(() => import('@/features/home/03-featured-programs'), {
  loading: placeholder(),
  ssr: false,
});
const WhyChoose = dynamic(() => import('@/features/home/04-why-choose'), {
  loading: placeholder(),
  ssr: false,
});
const HomeStats = dynamic(() => import('@/features/home/05-stats'), {
  loading: placeholder(),
  ssr: false,
});
const CtfChallenge = dynamic(() => import('@/features/home/06-ctf-challenge'), {
  loading: placeholder(),
  ssr: false,
});
const HomeResearch = dynamic(() => import('@/features/home/07-research'), {
  loading: placeholder(),
  ssr: false,
});
const Testimonials = dynamic(() => import('@/features/home/08-testimonials'), {
  loading: placeholder(),
  ssr: false,
});
const HomePartners = dynamic(() => import('@/features/home/09-partners'), {
  loading: placeholder(),
  ssr: false,
});
const FinalCta = dynamic(() => import('@/features/home/10-final-cta'), {
  loading: placeholder(),
  ssr: false,
});
const HomeFooter = dynamic(() => import('@/features/home/11-footer'), {
  loading: placeholder('40vh'),
  ssr: false,
});

export default function HomePage() {
  return (
    <>
      {/* Act I — Welcome */}
      <HomeHero />

      {/* I → II — beam fires forward + white flash */}
      <ActTransition targetSelector="#about-preview" type="i-to-ii" />

      {/* Act II — Identity */}
      <AboutPreview />
      <FeaturedPrograms />
      <WhyChoose />

      {/* II → III — into the dramatic stats scene */}
      <ActTransition targetSelector="#stats" type="i-to-ii" />

      {/* Act III — Proof */}
      <HomeStats />

      {/* III → IV — into the CTF moment */}
      <ActTransition targetSelector="#ctf" type="i-to-ii" />

      <CtfChallenge />
      <HomeResearch />
      <Testimonials />
      <HomePartners />
      <FinalCta />
      <HomeFooter />
    </>
  );
}
