export interface AboutStat {
  id: string;
  value: number;
  suffix: string;
  label: string;
}

export const aboutStatsContent = {
  badge: 'BY THE NUMBERS',
  heading: 'A Decade of Cybersecurity Excellence',
  description:
    'Every figure represents a real outcome — a student placed, a partnership forged, a defender shipped into industry.',
  stats: [
    { id: 'students', value: 5000, suffix: '+', label: 'Students Trained' },
    { id: 'placement', value: 95, suffix: '%', label: 'Placement Rate' },
    { id: 'partners', value: 50, suffix: '+', label: 'Industry Partners' },
    { id: 'years', value: 10, suffix: '+', label: 'Years of Excellence' },
  ] satisfies readonly AboutStat[],
} as const;
