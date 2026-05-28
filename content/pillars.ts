export const pillarsContent = {
  badge: 'PROGRAM PILLARS',
  heading: 'WHY THIS DEGREE?',
  description:
    'Designed for the next generation of security professionals, combining three critical pillars of modern technology.',
  pillars: [
    {
      id: 'integrated',
      title: 'Integrated Security',
      description:
        'Cybersecurity, IoT, and Blockchain consolidated into one industry-ready undergraduate program.',
      icon: 'shield-check' as const,
      team: 'neutral' as const,
    },
    {
      id: 'hands-on',
      title: 'Hands-on Excellence',
      description:
        'Intensive laboratory work every semester with real-world security scenarios and hardware.',
      icon: 'cpu' as const,
      team: 'neutral' as const,
    },
    {
      id: 'offensive-defensive',
      title: 'Offensive & Defensive',
      description:
        'Master both Red Team (Offensive) and Blue Team (Defensive) strategies for complete coverage.',
      icon: 'swords' as const,
      team: 'split' as const,
    },
  ],
} as const;
