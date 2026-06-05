import type { ResearchCategory } from './focus';

export interface ResearchTeamMember {
  name: string;
  role: string;
  /** Single-letter avatar fallback when there's no photo. */
  initial: string;
}

export interface ResearchDetail {
  /** Matches the id in researchFocusContent.focuses. */
  id: string;
  category: ResearchCategory;
  year: string;
  title: string;
  /** Hero image URL. Use a remote URL or a path under /public. */
  heroImage: string;
  /** Used as the alt text for the hero image. */
  heroImageAlt: string;
  stats: {
    papers: number;
    citations: number;
    leads: number;
  };
  /** Intro paragraph (no markdown — plain text). */
  overview: string;
  keyAreas: readonly string[];
  /** Findings + impact paragraph. */
  findings: string;
  /** Partnerships paragraph (plain text). */
  partnerships: string;
  team: readonly ResearchTeamMember[];
  /** When true, this entry is a stub — page renders a "content forthcoming"
   *  message in place of the overview/findings/partnerships and hides the
   *  team section. Stats still render so the page doesn't look empty. */
  placeholder?: boolean;
}

/** Card 0 — fully populated from the EthicalByte reference. */
const aiThreatDetection: ResearchDetail = {
  id: 'ai-threat-detection',
  category: 'AI & SECURITY',
  year: '2024',
  title: 'Advanced Threat Detection Using Machine Learning',
  heroImage:
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80',
  heroImageAlt: 'Abstract neural-network visualisation symbolising AI threat detection',
  stats: { papers: 7, citations: 342, leads: 3 },
  overview:
    'Our Advanced Threat Detection project focuses on leveraging machine learning and artificial intelligence to identify sophisticated cyber threats in real-time. This research explores the intersection of cybersecurity and AI to develop systems that can detect previously unknown attack patterns.',
  keyAreas: [
    'Deep learning models for anomaly detection',
    'Real-time threat analysis and classification',
    'Zero-day exploit identification',
    'Advanced persistent threat (APT) detection',
  ],
  findings:
    'Our research has shown a 94% accuracy rate in detecting unknown threats compared to 72% with traditional signature-based systems. The models are trained on millions of attack samples from real-world incidents.',
  partnerships:
    'This research is conducted in collaboration with leading cybersecurity firms and government agencies. Our findings have been published in top-tier security conferences including Black Hat, DEF CON, and IEEE Symposium on Security and Privacy.',
  team: [
    { name: 'Dr. Sarah Chen',     role: 'Lead Researcher', initial: 'S' },
    { name: 'Dr. Michael Roberts',role: 'Lead Researcher', initial: 'M' },
    { name: 'Prof. David Kumar',  role: 'Lead Researcher', initial: 'D' },
  ],
};

/** Card 1 — fully populated from the EthicalByte reference. */
const iotSecurityFramework: ResearchDetail = {
  id: 'iot-security-framework',
  category: 'IOT SECURITY',
  year: '2024',
  title: 'IoT Device Security Framework',
  heroImage:
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80',
  heroImageAlt: 'Microchip on a circuit board — symbolising IoT device security',
  stats: { papers: 5, citations: 287, leads: 3 },
  overview:
    'The IoT Device Security Framework project addresses the unique challenges of securing billions of connected devices globally. With the explosion of IoT adoption, security must be built into every layer of the system.',
  keyAreas: [
    'Lightweight encryption protocols for resource-constrained devices',
    'Secure authentication and key management',
    'Network segmentation and anomaly detection',
    'Firmware security and update mechanisms',
  ],
  findings:
    'Our framework has been adopted by leading IoT manufacturers and device producers. We provide guidelines for secure by design principles that reduce security incidents by 87%.\n\nImpact: Over 2 million devices now run on our secure framework, protecting critical infrastructure in healthcare, manufacturing, and smart cities globally.',
  partnerships: '',
  team: [
    { name: 'Prof. James Wilson',  role: 'Lead Researcher', initial: 'J' },
    { name: 'Dr. Emily Brown',     role: 'Lead Researcher', initial: 'E' },
    { name: 'Dr. Alexander Lee',   role: 'Lead Researcher', initial: 'A' },
  ],
};

/** Card 2 — fully populated from the EthicalByte reference. */
const blockchainCybersecurity: ResearchDetail = {
  id: 'blockchain-cybersecurity',
  category: 'BLOCKCHAIN',
  year: '2023',
  title: 'Blockchain for Cybersecurity Applications',
  heroImage:
    'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1600&q=80',
  heroImageAlt:
    'Abstract blockchain visualisation — interconnected nodes representing a distributed ledger',
  stats: { papers: 6, citations: 265, leads: 3 },
  overview:
    'This research investigates how blockchain technology can provide immutable records for security events and create transparent audit trails that cannot be tampered with. We explore both permissioned and permissionless blockchain architectures.',
  keyAreas: [
    'Distributed identity management systems',
    'Tamper-proof audit logs using blockchain',
    'Smart contracts for security policy enforcement',
    'Zero-knowledge proofs for authentication',
  ],
  findings:
    'Our implementation of blockchain-based identity management has reduced credential-related breaches by 96% in pilot programs with major financial institutions.\n\nFuture Directions: We are exploring quantum-resistant cryptography for blockchain systems to ensure long-term security even in the era of quantum computing.',
  partnerships: '',
  team: [
    { name: 'Dr. Rajesh Kumar',  role: 'Lead Researcher', initial: 'R' },
    { name: 'Dr. Lisa Anderson', role: 'Lead Researcher', initial: 'L' },
    { name: 'Prof. Maria Garcia',role: 'Lead Researcher', initial: 'M' },
  ],
};

/** Card 3 — fully populated from the EthicalByte reference. */
const cloudSecurityAutomation: ResearchDetail = {
  id: 'cloud-security-automation',
  category: 'CLOUD SECURITY',
  year: '2024',
  title: 'Cloud Security Automation',
  heroImage:
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1600&q=80',
  heroImageAlt:
    'Server room interior with rows of illuminated racks — symbolising cloud infrastructure security',
  stats: { papers: 4, citations: 198, leads: 3 },
  overview:
    'Cloud Security Automation addresses the challenge of maintaining consistent security posture across multiple cloud providers. This research develops automated systems for threat detection and response in cloud environments.',
  keyAreas: [
    'Infrastructure as code security scanning',
    'Policy as code implementation and enforcement',
    'Automated compliance checking against industry standards',
    'Cloud-native threat detection and response',
  ],
  findings:
    'Our automation tools reduce cloud misconfigurations by 92% and detect security breaches 10x faster than manual processes. They support AWS, Azure, Google Cloud, and hybrid environments.\n\nAdoption: Fortune 500 companies use our research to secure over 50,000 cloud instances globally.',
  partnerships: '',
  team: [
    { name: 'Dr. Thomas Anderson', role: 'Lead Researcher', initial: 'T' },
    { name: 'Prof. Susan White',   role: 'Lead Researcher', initial: 'S' },
    { name: 'Dr. Robert Chen',     role: 'Lead Researcher', initial: 'R' },
  ],
};

/** Card 4 — fully populated from the EthicalByte reference. */
const quantumSafeCryptography: ResearchDetail = {
  id: 'quantum-safe-cryptography',
  category: 'CRYPTOGRAPHY',
  year: '2023',
  title: 'Quantum-Safe Cryptography',
  heroImage:
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80',
  heroImageAlt:
    'Stream of binary code on a dark background — symbolising encryption algorithms',
  stats: { papers: 8, citations: 412, leads: 3 },
  overview:
    'The quantum computing revolution poses an existential threat to current cryptographic systems. Our research develops and validates post-quantum cryptographic algorithms that remain secure even against quantum computers.',
  keyAreas: [
    'Lattice-based cryptography research',
    'Hash-based digital signatures',
    'Multivariate polynomial cryptography',
    'Quantum key distribution systems',
  ],
  findings:
    'We work closely with NIST on standardization of post-quantum cryptography algorithms. Our implementations have shown 99.9% compatibility with existing systems while providing quantum resistance.\n\nIndustry Adoption: Major financial institutions have begun transitioning to quantum-safe cryptography based on our research recommendations.',
  partnerships: '',
  team: [
    { name: 'Dr. Patricia Lee', role: 'Lead Researcher', initial: 'P' },
    { name: 'Prof. Marco Rossi', role: 'Lead Researcher', initial: 'M' },
    { name: 'Dr. Yuki Tanaka',  role: 'Lead Researcher', initial: 'Y' },
  ],
};

/** Card 5 — fully populated from the EthicalByte reference. */
const socialEngineeringDefense: ResearchDetail = {
  id: 'social-engineering-defense',
  category: 'HUMAN FACTORS',
  year: '2024',
  title: 'Social Engineering Defense Mechanisms',
  heroImage:
    'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1600&q=80',
  heroImageAlt:
    'Person at a computer with screen reflections — symbolising the human element in cybersecurity',
  stats: { papers: 5, citations: 276, leads: 3 },
  overview:
    'Human factors remain the weakest link in cybersecurity. Our research applies behavioral psychology to understand and defend against social engineering attacks through comprehensive training and awareness programs.',
  keyAreas: [
    'Phishing attack effectiveness studies',
    'Social engineering attack simulations',
    'Security awareness training effectiveness',
    'Behavioral nudges for security compliance',
  ],
  findings:
    'Our training programs reduce successful phishing attacks by 87% within the first year of implementation. We use gamification and real-time feedback to make security training engaging.\n\nResearch Findings: Users who receive our adaptive training are 15x less likely to fall for sophisticated social engineering attacks compared to traditional security training.',
  partnerships: '',
  team: [
    { name: 'Dr. Nicholas Brown',  role: 'Lead Researcher', initial: 'N' },
    { name: 'Prof. Jennifer Smith', role: 'Lead Researcher', initial: 'J' },
    { name: 'Dr. Carlos Rodriguez', role: 'Lead Researcher', initial: 'C' },
  ],
};

/** Detail entries indexed by `id`. Each id matches one of
 *  `researchFocusContent.focuses[].id`, so the focus card grid can link
 *  to `/research/${id}` and the lookup here will hit. */
export const researchDetailsContent: Record<string, ResearchDetail> = {
  [aiThreatDetection.id]: aiThreatDetection,
  [iotSecurityFramework.id]: iotSecurityFramework,
  [blockchainCybersecurity.id]: blockchainCybersecurity,
  [cloudSecurityAutomation.id]: cloudSecurityAutomation,
  [quantumSafeCryptography.id]: quantumSafeCryptography,
  [socialEngineeringDefense.id]: socialEngineeringDefense,
};

export const researchDetailLabels = {
  backToResearch: 'Back to Research',
  statLabels: {
    papers: 'Published Papers',
    citations: 'Research Citations',
    leads: 'Lead Researchers',
  },
  overviewHeading: 'Research Overview',
  keyAreasLabel: 'Key Areas',
  partnershipsLabel: 'Partnerships',
  teamHeading: 'Research Team',
  placeholderMessage:
    "We're preparing the detailed write-up for this research track — check back soon.",
  cta: {
    heading: 'Want to Learn More?',
    subline: 'Explore our comprehensive courses based on this research.',
    primary: { label: 'Browse Courses', href: '/courses' },
    secondary: { label: 'Talk to Admissions', href: '/contact' },
  },
} as const;
