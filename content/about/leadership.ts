export interface LeadershipProfile {
  id: string;
  name: string;
  role: string;
  bio: string;
  initials: string;
}

export const aboutLeadershipContent = {
  badge: 'LEADERSHIP',
  heading: 'Built by Practitioners',
  description:
    'CyCraft is led by security engineers, researchers, and educators who have shipped real systems and chased real threats — not classroom instructors.',
  leaders: [
    {
      id: 'founder',
      name: 'Founder & CEO',
      role: 'Cybersecurity Strategy · Curriculum',
      bio: 'A decade of hands-on offensive and defensive security, advising enterprises and shaping the cybersecurity workforce pipeline in India.',
      initials: 'F',
    },
    {
      id: 'cto',
      name: 'Chief Technology Officer',
      role: 'Research · Platform Engineering',
      bio: 'Leads CyCraft’s research wing and LMS platform; previously shipped security tooling and threat-intelligence products at scale.',
      initials: 'T',
    },
    {
      id: 'training',
      name: 'Director of Training',
      role: 'Lab Design · Mentorship',
      bio: 'Architects the hands-on labs, CTF challenges, and capstone projects that take students from theory to operational competence.',
      initials: 'D',
    },
  ] satisfies readonly LeadershipProfile[],
} as const;
