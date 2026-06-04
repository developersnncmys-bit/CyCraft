export interface Publication {
  id: string;
  title: string;
  venue: string;
  authors: string;
  date: string;
  citations: number;
  href: string;
}

export const researchPublicationsContent = {
  badge: 'PEER-REVIEWED OUTPUT',
  heading: 'Latest Publications',
  description:
    'Peer-reviewed research published in leading journals and conferences across information security, applied cryptography, and systems research.',
  publications: [
    {
      id: 'ml-intrusion-detection',
      title: 'Machine Learning for Intrusion Detection: A Comparative Study',
      venue: 'International Journal of Cybersecurity Research',
      authors: 'Dr. Sarah Chen, Dr. Michael Roberts',
      date: '2024-03-01',
      citations: 45,
      href: '#',
    },
    {
      id: 'securing-iot-ecosystems',
      title: 'Securing IoT Ecosystems: Challenges and Solutions',
      venue: 'IEEE Conference on Security and Privacy',
      authors: 'Prof. James Wilson, Dr. Emily Brown',
      date: '2024-01-01',
      citations: 32,
      href: '#',
    },
    {
      id: 'blockchain-identity-management',
      title: 'Blockchain-Based Identity Management for Enhanced Security',
      venue: 'ACM Transactions on Information Security',
      authors: 'Dr. Rajesh Kumar, Dr. Lisa Anderson',
      date: '2023-11-01',
      citations: 28,
      href: '#',
    },
  ] satisfies readonly Publication[],
} as const;
