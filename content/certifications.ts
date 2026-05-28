export const certificationsContent = {
  heading: 'GLOBAL CERTIFICATIONS',
  description:
    'Graduate with more than just a degree. Our curriculum prepares you for world-renowned industry certifications.',
  footerNote:
    '* These represent advanced or management-level certifications. The B.Tech program lays the foundation for you to pursue these post-graduation or after gaining initial experience.',
  certifications: [
    {
      id: 'comptia',
      name: 'CompTIA Security+',
      description: 'Industry-standard certification covering core cybersecurity skills and knowledge.',
      advanced: false,
    },
    {
      id: 'ceh',
      name: 'Certified Ethical Hacker (CEH)',
      description: 'EC-Council certification focusing on ethical hacking methodologies and tools.',
      advanced: false,
    },
    {
      id: 'cissp',
      name: 'CISSP (ISC)²',
      description: 'Gold standard for cybersecurity professionals, covering security and risk management.',
      advanced: true,
    },
    {
      id: 'cissp-adv',
      name: 'CISSP — Advanced',
      description: 'Advanced certification for senior-level cybersecurity roles and management.',
      advanced: true,
    },
    {
      id: 'giac',
      name: 'GIAC Certifications',
      description: 'Specialized certifications in penetration testing, forensics, and security administration.',
      advanced: true,
    },
    {
      id: 'oscp',
      name: 'OSCP',
      description: 'Highly sought-after, rigorous hands-on penetration testing certification.',
      advanced: true,
    },
  ],
} as const;
