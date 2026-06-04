export interface HomeStat {
  id: string;
  value: number;
  suffix: string;
  label: string;
}

export const homeStatsContent = {
  badge: 'BY THE NUMBERS',
  heading: 'Trusted by a Growing Cybersecurity Community',
  description:
    'Every number is a real outcome — a student placed, a CVE filed, a project shipped.',
  stats: [
    { id: 'students', value: 5000, suffix: '+', label: 'Students Trained' },
    { id: 'placement', value: 95, suffix: '%', label: 'Placement Rate' },
    { id: 'partners', value: 50, suffix: '+', label: 'Industry Partners' },
    { id: 'years', value: 10, suffix: '+', label: 'Years of Excellence' },
  ] satisfies readonly HomeStat[],
} as const;
