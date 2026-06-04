export const contactInquiriesContent = {
  badge: 'INQUIRY CHANNELS',
  heading: 'Which channel fits you?',
  subhead:
    'Pick the inquiry type for the fastest response — your message routes straight to the right desk.',
  items: [
    {
      key: 'admissions',
      title: 'Admissions Inquiry',
      description:
        'Course details, B.Tech program eligibility, scholarships, batch start dates, and the full admission workflow.',
      bullets: [
        'B.Tech Cyber Intelligence Engineering',
        'Certification & training programs',
        'Eligibility, fees, and scholarships',
      ],
      cta: {
        label: 'Talk to Admissions',
        // Scrolls back up to the in-page form (sits inside the same
        // /contact route at #contact-form). Was a raw mailto: that bounced
        // users out to their email client — the on-site form captures the
        // inquiry into Admin per PRD §3.10.
        href: '#contact-form',
      },
      accent: 'beam' as const,
    },
    {
      key: 'partnerships',
      title: 'Partnership Inquiry',
      description:
        'Hiring partnerships, corporate training, research collaborations, CSR programs, and campus engagements.',
      bullets: [
        'Hiring & placement partnerships',
        'Corporate cybersecurity training',
        'Research & CTF collaborations',
      ],
      cta: {
        label: 'Start a Partnership',
        href: '#contact-form',
      },
      accent: 'red' as const,
    },
  ],
} as const;
