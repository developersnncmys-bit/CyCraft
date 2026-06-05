export const homeFooterContent = {
  brand: 'CyCraft',
  tagline:
    'Leading cybersecurity training institute providing practical, hands-on education with internship and placement opportunities.',
  columns: [
    {
      title: 'Quick Links',
      links: [
        { label: 'Home', href: '/' },
        { label: 'Courses', href: '/courses' },
        { label: 'About', href: '/about' },
        { label: 'Research', href: '/research' },
      ],
    },
    {
      title: 'Programs',
      /** All four "Programs" entries live on existing pages:
       *    Practical Training       → /courses  (hands-on course catalogue)
       *    Internship Programs      → /btech    (PRD §3.2 internship & placement)
       *    Placement Assistance     → /btech    (same section as above)
       *    Industry Certifications  → /assessment (exam engine + cert exams) */
      links: [
        { label: 'Practical Training', href: '/courses' },
        { label: 'Internship Programs', href: '/btech' },
        { label: 'Placement Assistance', href: '/btech' },
        { label: 'Industry Certifications', href: '/assessment' },
      ],
    },
  ],
  contact: {
    email: 'support@cycraft.in',
    phone: '+91 7259787316',
    address: '12, Peenya 2nd Stage, Bangalore 560058',
  },
  socials: [
    { label: 'LinkedIn', href: 'https://linkedin.com/company/cycraft' },
    { label: 'Instagram', href: 'https://instagram.com/cycraft' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms & Conditions', href: '/terms' },
  ],
  credit: {
    prefix: 'Developed by',
    label: 'Nakshatra Namaha Creations',
    href: 'https://www.nakshatranamahacreations.com/',
  },
  get copyright() {
    return `© ${new Date().getFullYear()} CyCraft. All rights reserved.`;
  },
} as const;
