'use client';
/**
 * Contact page — 5 pinned cinematic acts (~17.5 viewports of scroll,
 * 8–10 minutes deliberate pacing). Each act boundary uses one of the
 * five ActTransition variants for full-screen masked reveals between
 * sections. CinemaBackground (mounted in RootLayout) drives the
 * page-wide background color drift from #000 → faint blue → faint red →
 * #000 across the whole document scroll.
 *
 * Sections are STATICALLY imported, not lazy-loaded. With pinned
 * scrub timelines that each reserve 300-400% of viewport in pin-spacer,
 * ScrollTrigger needs to see every section's real height at first
 * measurement — otherwise later sections mount after the initial
 * refresh and their pin-spacers don't get accounted for, causing
 * earlier-section pins to overlap with later ones in the viewport.
 */
import { useEffect } from 'react';
import { ScrollTrigger } from '@/lib/gsap/register';
import ContactHero from '@/features/contact/01-hero';
import ContactFormSection from '@/features/contact/02-form';
import ContactInquiries from '@/features/contact/03-inquiries';
import ContactMap from '@/features/contact/04-map';
import ContactSocials from '@/features/contact/05-socials';
import HomeFooter from '@/features/home/11-footer';
import { ActTransition } from '@/components/layout/ActTransition';

export default function ContactPage() {
  // Force a second ScrollTrigger refresh once the page has fully
  // painted — defends against any late layout shifts (font swap, iframe
  // load) that would otherwise leave stale pin measurements.
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <>
      {/* Act I — Open the channel */}
      <ContactHero />

      {/* I → II — beam fires forward, white flash dissolves into form */}
      <ActTransition targetSelector="#contact-form" type="i-to-ii" />

      {/* Act II — Send Us a Message */}
      <ContactFormSection />

      {/* II → III — radial iris (camera lens) */}
      <ActTransition targetSelector="#contact-inquiries" type="ii-to-iii" />

      {/* Act III — Inquiry channels */}
      <ContactInquiries />

      {/* III → IV — diagonal cyan slash sweeps to the map */}
      <ActTransition targetSelector="#contact-map" type="iii-to-iv" />

      {/* Act IV — Find the lab (map) */}
      <ContactMap />

      {/* IV → V — red curtain close foreshadows the social finale */}
      <ActTransition targetSelector="#contact-socials" type="iv-to-v" />

      {/* Act V — Join the signal (socials) */}
      <ContactSocials />

      {/* V → VI — vertical curtain split into the footer */}
      <ActTransition targetSelector="footer[id='contact']" type="v-to-vi" />

      <HomeFooter />
    </>
  );
}
