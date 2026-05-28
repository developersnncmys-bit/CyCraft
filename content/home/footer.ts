export const homeFooterContent = {
  brand: 'CyCraft',
  tagline:
    'Leading cybersecurity training institute providing practical, hands-on education with internship and placement opportunities.',
  columns: [
    {
      title: 'Quick Links',
      links: [
        { label: 'Home', href: '/' },
        { label: 'Courses', href: '#courses' },
        { label: 'About', href: '#about' },
        { label: 'Research', href: '#research' },
      ],
    },
    {
      title: 'Programs',
      links: [
        { label: 'Practical Training', href: '#training' },
        { label: 'Internship Programs', href: '#internships' },
        { label: 'Placement Assistance', href: '#placement' },
        { label: 'Industry Certifications', href: '#certifications' },
      ],
    },
  ],
  contact: {
    email: 'support@cycraft.in',
    phone: '+91 7259787316',
    address: '12, Peenya 2nd Stage, Bangalore 560058',
    gst: 'GST: 29DNAPM8368B1ZS',
  },
  socials: [
    { label: 'LinkedIn', href: 'https://linkedin.com/company/cycraft' },
    { label: 'Instagram', href: 'https://instagram.com/cycraft' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms & Conditions', href: '/terms' },
  ],
  get copyright() {
    return `© ${new Date().getFullYear()} CyCraft. All rights reserved.`;
  },
} as const;
