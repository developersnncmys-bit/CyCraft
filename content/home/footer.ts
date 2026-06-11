export const homeFooterContent = {
  brand: 'CyCraft',
  tagline:
    'Leading cybersecurity training institute providing practical, hands-on education with internship and placement opportunities.',
  columns: [
    {
      title: 'Quick Links',
      // Research dropped — page is currently deprecated (also commented out
      // of the navbar NAV_LINKS in components/layout/Navbar.tsx). Replaced
      // with BTech so the flagship 4-year program has a Quick Links entry
      // alongside Home / Courses / About.
      links: [
        { label: 'Home', href: '/' },
        { label: 'BTech', href: '/btech' },
        { label: 'Courses', href: '/courses' },
        { label: 'About', href: '/about' },
      ],
    },
    {
      title: 'Programs',
      /** Programs entries are intentionally NOT linked — `disabled: true`
       * makes the footer renderer drop the anchor and emit a plain span.
       * The original target pages are recorded below in case linking gets
       * re-enabled in a future content pass.
       *    Practical Training       → /courses
       *    Internship Programs      → /btech
       *    Placement Assistance     → /btech
       *    Industry Certifications  → /assessment */
      links: [
        { label: 'Practical Training', href: '/courses', disabled: true },
        { label: 'Internship Programs', href: '/btech', disabled: true },
        { label: 'Placement Assistance', href: '/btech', disabled: true },
        { label: 'Industry Certifications', href: '/assessment', disabled: true },
      ],
    },
  ],
  contact: {
    email: 'info@cycraft.in',
    phone: '+91 7259787316',
    address: 'Sattva Global City, Mysore Road, Bengaluru, Karnataka 560059',
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
