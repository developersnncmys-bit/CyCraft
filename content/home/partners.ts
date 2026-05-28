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
  /** 8 partners arranged as a clean 4 × 2 grid on desktop. */
  partners: [
    { id: 'microland', name: 'Microland', logo: '/images/partners/Microland.png' },
    { id: 'reva', name: 'REVA University', logo: '/images/partners/reva-university.png' },
    { id: 'vit', name: 'VIT Chennai', logo: '/images/partners/VIT-chennai.png' },
    { id: 'amrita', name: 'Amrita Vishwa Vidyapeetham', logo: '/images/partners/Amrita-vishwa-vidhyapeetham.png' },
    { id: 'cisco', name: 'Cisco', logo: '/images/partners/Cisco.png' },
    { id: 'mcafee', name: 'McAfee', logo: '/images/partners/McAffe.png' },
    { id: 'vodafone', name: 'Vodafone', logo: '/images/partners/Vodafone.png' },
    { id: 'miles', name: 'Miles Education', logo: '/images/partners/Miles-education.png' },
  ] satisfies readonly HomePartner[],
} as const;
