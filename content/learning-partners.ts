/* Learning Partners — the four institute partnerships listed in the
 * btech brochure. `logo` paths point at files in /public/Learning-partners/.
 * If a file is missing, the section's PartnerTile falls back to a
 * styled-text tile with the institute's short name.
 */
export const learningPartnersContent = {
  badge: 'ACADEMIC ALLIANCES',
  heading: 'LEARNING PARTNERS',
  description:
    "Curriculum and capstone reviews co-developed with India's leading technology and management institutes.",
  partners: [
    {
      id: 'iit-ropar',
      name: 'IIT Ropar',
      fullName: 'Indian Institute of Technology Ropar',
      logo: '/Learning-partners/IIT Ropar.png',
    },
    {
      id: 'iim-sirmaur',
      name: 'IIM Sirmaur',
      fullName: 'Indian Institute of Management Sirmaur',
      logo: '/Learning-partners/IIT siramaur.png',
    },
    {
      id: 'iit-mandi',
      name: 'IIT Mandi',
      fullName: 'Indian Institute of Technology Mandi',
      logo: '/Learning-partners/IIT Mandi.png',
    },
    {
      id: 'iit-guwahati',
      name: 'IIT Guwahati',
      fullName: 'Indian Institute of Technology Guwahati',
      logo: '/Learning-partners/IIT Guwati.png',
    },
  ],
} as const;
