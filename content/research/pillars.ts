export type ResearchPillarTone = 'beam' | 'red-team' | 'terminal';

export interface ResearchPillar {
  id: string;
  tone: ResearchPillarTone;
  icon: 'lab' | 'badge' | 'network';
  title: string;
  description: string;
}

export const researchPillarsContent = {
  badge: 'WHY OUR RESEARCH MATTERS',
  heading: 'Three Pillars of a Living Lab',
  description:
    'Our research wing operates as a working lab, not a publication mill — every track ships an artifact you can read, run, or audit.',
  pillars: [
    {
      id: 'innovation-lab',
      tone: 'red-team',
      icon: 'lab',
      title: 'Innovation Lab',
      description:
        'State-of-the-art facility for security research, malware analysis, and vulnerability assessment.',
    },
    {
      id: 'industry-recognition',
      tone: 'beam',
      icon: 'badge',
      title: 'Industry Recognition',
      description:
        'Recognized leader in cybersecurity research with partnerships across Fortune 500 companies.',
    },
    {
      id: 'collaborative-research',
      tone: 'red-team',
      icon: 'network',
      title: 'Collaborative Research',
      description:
        'Working with universities and government agencies on next-generation security solutions.',
    },
  ] satisfies readonly ResearchPillar[],
} as const;
