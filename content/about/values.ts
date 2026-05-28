export type ValueIcon = 'shield' | 'target' | 'badge' | 'users';

export interface AboutValue {
  id: string;
  icon: ValueIcon;
  title: string;
  description: string;
}

export const aboutValuesContent = {
  badge: 'CORE VALUES',
  heading: 'Our Core Values',
  description: 'The principles that guide everything we do.',
  values: [
    {
      id: 'practical',
      icon: 'shield',
      title: 'Practical Excellence',
      description:
        'We believe in learning by doing. Every course includes extensive hands-on labs and real-world projects.',
    },
    {
      id: 'industry',
      icon: 'target',
      title: 'Industry Focused',
      description:
        'Our curriculum is designed with input from cybersecurity professionals to meet current industry needs.',
    },
    {
      id: 'certification',
      icon: 'badge',
      title: 'Certification Ready',
      description:
        'Our programs prepare you for leading industry certifications from CompTIA, EC-Council, and more.',
    },
    {
      id: 'career',
      icon: 'users',
      title: 'Career Support',
      description:
        'Comprehensive placement assistance including resume building, interview prep, and job placement.',
    },
  ] satisfies readonly AboutValue[],
} as const;
