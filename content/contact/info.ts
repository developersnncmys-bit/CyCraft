export const contactInfoContent = {
  heading: 'Contact Information',
  items: [
    {
      key: 'email',
      label: 'Email',
      value: 'support@cycraft.in',
      href: 'mailto:support@cycraft.in',
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
      value: 'Peenya 2nd Stage\nBangalore 560058',
      href: 'https://maps.google.com/?q=Peenya+2nd+Stage+Bangalore+560058',
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
    cta: { label: 'Book a Call', href: 'mailto:support@cycraft.in?subject=Schedule%20a%20call' },
  },
} as const;
