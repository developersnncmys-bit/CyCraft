export const homeFinalCtaContent = {
  heading: 'Ready to Start Your Cybersecurity Career?',
  highlight: 'Cybersecurity Career',
  description:
    'Join thousands of successful graduates who have launched their careers with CyCraft.',
  /** Per PRD §3.1 — three CTAs at the closing beat.
   *  JOIN CYCRAFT → B.Tech apply page (primary admission funnel)
   *  START LEARNING → Courses catalogue
   *  CONTACT US → Contact page */
  primary: { label: 'JOIN CYCRAFT', href: '/btech' },
  secondary: { label: 'START LEARNING', href: '/courses' },
  tertiary: { label: 'CONTACT US', href: '/contact' },
} as const;
