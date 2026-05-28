export interface Milestone {
  id: string;
  label: string;
  value: string;
}

export const aboutMilestonesContent = {
  badge: 'ACHIEVEMENTS',
  heading: 'Certifications, Partnerships & Milestones',
  description:
    'A decade of training, research, and partnerships that compound into outcomes you can verify.',
  milestones: [
    { id: 'iso', label: 'Accreditation', value: 'ISO 27001 aligned curriculum' },
    { id: 'partners', label: 'Industry Network', value: '50+ hiring partners' },
    { id: 'cves', label: 'Research Output', value: '14 CVEs credited' },
    { id: 'certs', label: 'Certifications Prepared', value: 'CompTIA · EC-Council · ISC2' },
    { id: 'mou', label: 'Academic Alliances', value: 'MoUs with leading universities' },
    { id: 'awards', label: 'Recognition', value: 'Featured cybersecurity training partner' },
  ] satisfies readonly Milestone[],
} as const;
