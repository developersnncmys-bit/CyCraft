export interface TeamGroup {
  id: string;
  title: string;
  description: string;
  count: string;
  tags: readonly string[];
}

export const aboutTeamContent = {
  badge: 'THE TEAM',
  heading: 'Mentors, Trainers & Researchers',
  description:
    'A bench of working professionals who teach the field as they live it — penetration testers, SOC analysts, malware reverse engineers, and security architects.',
  groups: [
    {
      id: 'mentors',
      title: 'Industry Mentors',
      description:
        'Senior practitioners from product security, red teams, and CISO offices who guide capstone projects and one-on-one career planning.',
      count: '25+',
      tags: ['Red Team', 'Blue Team', 'GRC', 'AppSec'],
    },
    {
      id: 'trainers',
      title: 'Hands-On Trainers',
      description:
        'Full-time instructors specialised in delivering immersive labs across web exploitation, cloud security, malware analysis, and incident response.',
      count: '15+',
      tags: ['Web', 'Cloud', 'Malware', 'IR'],
    },
    {
      id: 'researchers',
      title: 'Security Researchers',
      description:
        'Our research wing publishes CVEs, threat intelligence, and vulnerability writeups — and brings every new finding directly into the curriculum.',
      count: '8',
      tags: ['CVE', 'Threat Intel', 'Reverse Eng', 'Cloud'],
    },
  ] satisfies readonly TeamGroup[],
} as const;
