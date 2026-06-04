export interface FeaturedProgram {
  id: string;
  tag: string;
  title: string;
  description: string;
  duration: string;
  team: 'red' | 'blue' | 'neutral';
  cta: { label: string; href: string };
}

export const featuredProgramsContent = {
  badge: 'OUR PROGRAMS',
  heading: 'Pathways into Cybersecurity',
  description:
    'From a 4-year engineering degree to short-form certifications and paid internships — choose the pathway that fits where you are right now.',
  programs: [
    {
      id: 'btech',
      tag: 'DEGREE',
      title: 'B.Tech in Cyber Intelligence',
      description:
        'A 4-year undergraduate engineering degree in Cybersecurity, AI, and Cloud — built around 18 months of paid industry experience.',
      duration: '4 YEARS',
      team: 'neutral',
      cta: { label: 'EXPLORE B.TECH', href: '/btech' },
    },
    {
      id: 'cert',
      tag: 'CERTIFICATION',
      title: 'Professional Cert Tracks',
      description:
        'CISSP, OSCP, CEH, CompTIA Security+, and CyCraft-issued track certificates — every track vetted by working industry practitioners.',
      duration: '8 – 24 WEEKS',
      team: 'blue',
      cta: { label: 'VIEW COURSES', href: '/courses' },
    },
    {
      id: 'internship',
      tag: 'INTERNSHIP',
      title: 'Industry Internships',
      description:
        'Live offensive- and defensive-security engagements with our 35+ partner companies. Paid. Proof of work guaranteed in writing.',
      duration: '3 – 12 MONTHS',
      team: 'red',
      cta: { label: 'LEARN MORE', href: '/contact' },
    },
  ] satisfies readonly FeaturedProgram[],
} as const;
