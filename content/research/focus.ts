export type ResearchCategory =
  | 'AI & SECURITY'
  | 'IOT SECURITY'
  | 'BLOCKCHAIN'
  | 'CLOUD SECURITY'
  | 'CRYPTOGRAPHY'
  | 'HUMAN FACTORS';

export interface ResearchFocus {
  id: string;
  year: string;
  category: ResearchCategory;
  title: string;
  description: string;
  href: string;
}

export const researchFocusContent = {
  badge: 'ACTIVE RESEARCH',
  heading: 'Frontiers We Are Pushing',
  description:
    'Six active research tracks span the entire defensive-to-offensive cybersecurity spectrum — every track is funded, peer-reviewed, and tied to a published artifact.',
  focuses: [
    {
      id: 'ai-threat-detection',
      year: '2024',
      category: 'AI & SECURITY',
      title: 'Advanced Threat Detection Using Machine Learning',
      description:
        'Developing next-generation threat detection systems using deep learning algorithms to identify zero-day exploits and advanced persistent threats.',
      href: '#publications',
    },
    {
      id: 'iot-security-framework',
      year: '2024',
      category: 'IOT SECURITY',
      title: 'IoT Device Security Framework',
      description:
        'Creating comprehensive security frameworks for Internet of Things devices, focusing on authentication, encryption, and secure communications.',
      href: '#publications',
    },
    {
      id: 'blockchain-cybersecurity',
      year: '2023',
      category: 'BLOCKCHAIN',
      title: 'Blockchain for Cybersecurity Applications',
      description:
        'Exploring the use of distributed ledger technology to enhance data integrity, secure identity management, and prevent tampering.',
      href: '#publications',
    },
    {
      id: 'cloud-security-automation',
      year: '2024',
      category: 'CLOUD SECURITY',
      title: 'Cloud Security Automation',
      description:
        'Automating security controls and compliance monitoring in multi-cloud environments using infrastructure as code and policy as code.',
      href: '#publications',
    },
    {
      id: 'quantum-safe-cryptography',
      year: '2023',
      category: 'CRYPTOGRAPHY',
      title: 'Quantum-Safe Cryptography',
      description:
        'Researching post-quantum cryptographic algorithms to prepare for the era of quantum computing and ensure long-term data security.',
      href: '#publications',
    },
    {
      id: 'social-engineering-defense',
      year: '2024',
      category: 'HUMAN FACTORS',
      title: 'Social Engineering Defense Mechanisms',
      description:
        'Studying psychological aspects of social engineering attacks and developing training programs to build human firewall capabilities.',
      href: '#publications',
    },
  ] satisfies readonly ResearchFocus[],
} as const;
