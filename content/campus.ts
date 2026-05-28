export const campusContent = {
  badge: 'CAMPUS & LOCATION',
  heading: 'OUR PROGRAM IS OFFERED AT',
  location: 'S-VYASA Deemed University, Bangalore',
  accreditations: [
    'NAAC A+ ACCREDITED',
    'UGC CATEGORY-1 UNIVERSITY',
    'DEEMED-TO-BE UNIVERSITY',
    'EST. 1986',
    'AICTE APPROVED',
  ],
  features: [
    {
      id: 'residential',
      title: 'Fully Residential Program',
      description:
        'A complete immersive living and learning experience where peers become family.',
    },
    {
      id: 'techpark',
      title: 'Inside 100-Acre Tech Park',
      description:
        'Located within a massive innovation hub, surrounded by real-world tech companies.',
    },
    {
      id: 'infra',
      title: 'World-Class Infrastructure',
      description:
        'Access to high-tech labs, modern lecture halls, and collaborative workspaces.',
    },
    {
      id: 'security',
      title: 'Secure Gated Campus',
      description:
        '24/7 security with integrated hostel and mess facilities for complete peace of mind.',
    },
  ],
  video: {
    mp4: '/videos/campus-tour.mp4',
    poster: '/videos/hero-poster.jpg',
  },
} as const;
