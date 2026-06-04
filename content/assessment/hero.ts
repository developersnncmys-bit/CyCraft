export const assessmentHeroContent = {
  badge: 'ASSESSMENT_ENGINE',
  headlinePrefix: 'Cybersecurity',
  headlineAccent: 'Assessments',
  tagline:
    'Aptitude tests, technical screenings, lab challenges, and certification exams — proctored, timed, and tied directly to your CyCraft credential.',
  pills: [
    { label: 'Proctored', icon: 'lock' },
    { label: 'Timed', icon: 'bolt' },
    { label: 'Certified', icon: 'prompt' },
  ],
  terminalLines: [
    '> engine.load("examination")',
    '> proctoring: tab-lock | fullscreen | copy-paste block',
    '> grading: instant | percentile | certificate-trigger',
  ],
  primaryCta: { label: 'Start Assessment' },
  secondaryCta: { label: 'View Sample Exam', href: '#assessment-interface' },
} as const;
