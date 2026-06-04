export interface ResearchStat {
  id: string;
  value: number;
  suffix: string;
  label: string;
}

export const researchStatsContent = {
  badge: 'BY THE NUMBERS',
  heading: 'Research at Scale',
  description:
    'Every figure is grounded in a published artifact, an active engagement, or a researcher in the field.',
  stats: [
    { id: 'papers', value: 25, suffix: '+', label: 'Published Papers' },
    { id: 'projects', value: 15, suffix: '+', label: 'Active Projects' },
    { id: 'partnerships', value: 30, suffix: '+', label: 'Partnerships' },
    { id: 'researchers', value: 100, suffix: '+', label: 'Researchers' },
  ] satisfies readonly ResearchStat[],
} as const;
