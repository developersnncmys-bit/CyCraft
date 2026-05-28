export type WhyChooseIcon = 'shield' | 'target' | 'users' | 'badge';

export interface WhyChooseFeature {
  id: string;
  icon: WhyChooseIcon;
  title: string;
  description: string;
}

export const whyChooseContent = {
  badge: 'WHY CYCRAFT',
  heading: 'Join Our Cybersecurity Engineering Program',
  description:
    'A university-style, engineering-focused curriculum that blends core engineering fundamentals with hands-on labs, capstone projects, and internship pathways — all designed to make you job-ready for roles in cybersecurity engineering, incident response, and security operations.',
  features: [
    {
      id: 'training',
      icon: 'shield',
      title: 'Practical Training',
      description:
        'Hands-on labs and real-world scenarios to build practical cybersecurity skills from day one.',
    },
    {
      id: 'internship',
      icon: 'target',
      title: 'Internship Programs',
      description:
        'Real industry experience through our extensive network of partner companies and organizations.',
    },
    {
      id: 'placement',
      icon: 'users',
      title: 'Placement Assistance',
      description:
        'Dedicated career support with interview prep, resume building, and direct placement opportunities.',
    },
    {
      id: 'certifications',
      icon: 'badge',
      title: 'Industry Certifications',
      description:
        'Prepare for leading certifications like CISSP, CEH, CompTIA Security+, and more.',
    },
  ] satisfies readonly WhyChooseFeature[],
} as const;
