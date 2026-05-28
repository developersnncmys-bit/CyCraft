export interface HomePartner {
  id: string;
  name: string;
  logo: string;
}

export const homePartnersContent = {
  badge: 'OUR ECOSYSTEM',
  heading: 'Our Clients and Partners',
  description:
    'Collaborating with industry leaders to provide world-class training and opportunities.',
  /** 8 partners arranged as a clean 4 × 2 grid on desktop.
      NOTE: Cisco.png and Vodafone.png in /public are mislabelled (their
      contents are the Miles Education logo), so they're intentionally not
      used here — swapped for Sapthagiri + Star Certification. */
  partners: [
    { id: 'microland', name: 'Microland', logo: '/images/partners/Microland.png' },
    { id: 'reva', name: 'REVA University', logo: '/images/partners/reva-university.png' },
    { id: 'vit', name: 'VIT Chennai', logo: '/images/partners/VIT-chennai.png' },
    { id: 'amrita', name: 'Amrita Vishwa Vidyapeetham', logo: '/images/partners/Amrita-vishwa-vidhyapeetham.png' },
    { id: 'sapthagiri', name: 'Sapthagiri NPS University', logo: '/images/partners/Sapthagiri-NPS-university.png' },
    { id: 'mcafee', name: 'McAfee', logo: '/images/partners/McAffe.png' },
    { id: 'starcert', name: 'Star Certification', logo: '/images/partners/Star-certification.png' },
    { id: 'miles', name: 'Miles Education', logo: '/images/partners/Miles-education.png' },
  ] satisfies readonly HomePartner[],
} as const;
