export const aboutFinalCtaContent = {
  heading: 'Join the Next Generation of Defenders',
  highlight: 'Next Generation of Defenders',
  description:
    'Start your cybersecurity career with a program built by practitioners, taught in real labs, and backed by a 50+ partner hiring network.',
  /** EXPLORE PROGRAMS → /courses (broader programme catalogue; matches the
   *  home-page final CTA's "START LEARNING" routing).
   *  CONTACT ADMISSIONS → /contact (was a raw mailto: that left the site;
   *  the on-site contact page captures the inquiry into Admin per PRD §3.10). */
  primary: { label: 'EXPLORE PROGRAMS', href: '/courses' },
  secondary: { label: 'CONTACT ADMISSIONS', href: '/contact' },
} as const;
