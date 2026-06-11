export const contactInfoContent = {
  heading: 'Contact Information',
  items: [
    {
      key: 'email',
      label: 'Email',
      value: 'info@cycraft.in',
      href: 'mailto:info@cycraft.in',
    },
    {
      key: 'phone',
      label: 'Phone',
      value: '+91 7259787316',
      href: 'tel:+917259787316',
    },
    {
      key: 'address',
      label: 'Address',
      value: 'Sattva Global City, Mysore Road\nBengaluru, Karnataka 560059',
      href: 'https://maps.google.com/?q=Sattva+Global+City+Mysore+Road+Bengaluru+560059',
    },
    {
      key: 'hours',
      label: 'Office Hours',
      value: 'Monday – Friday\n9:00 AM – 6:00 PM',
    },
  ] as const,
  schedule: {
    heading: 'Schedule a Visit',
    body: 'Want to connect with us? Schedule a call today!',
    cta: { label: 'Book a Call', href: 'mailto:info@cycraft.in?subject=Schedule%20a%20call' },
  },
} as const;
