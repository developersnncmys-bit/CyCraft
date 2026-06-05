export const homeHeroContent = {
  badge: 'CYBERSECURITY · TRAINING · RESEARCH',
  headlinePrefix: 'Join Advanced',
  headlineAccent: 'B.Tech in CyberSecurity, IoT and Blockchain',
  /** Swap headline revealed mid-pin. Lands as a punchline after the
      original headline visibly exits — so it reads as a beat, not a
      duplicate section. */
  headlineSwapPrefix: 'Beyond theory.',
  headlineSwapAccent: 'This is craft.',
  description:
    'Industry-leading cybersecurity education with hands-on labs, real-world projects, internships, and guaranteed placement assistance.',
  /** Per PRD §3.1 — three CTAs in the hero. */
  ctas: {
    primary: { label: 'EXPLORE COURSES', href: '/courses' },
    secondary: { label: 'JOIN PROGRAMS', href: '/btech' },
    tertiary: { label: 'RESEARCH LABS', href: '/research' },
  },
  terminalLines: [
    '> system_boot: complete',
    '> security_modules: loaded',
    '> beam_alignment: stable',
    '> awaiting_input...',
  ] as const,
} as const;
