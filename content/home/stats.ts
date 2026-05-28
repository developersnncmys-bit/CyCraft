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
    { id: 'students', value: 2400, suffix: '+', label: 'Students Trained' },
    { id: 'certs', value: 1800, suffix: '+', label: 'Certifications Issued' },
    { id: 'research', value: 35, suffix: '+', label: 'Research Papers' },
    { id: 'projects', value: 120, suffix: '+', label: 'Security Projects' },
  ] satisfies readonly HomeStat[],
} as const;
