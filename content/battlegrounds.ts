export const battlegroundsContent = {
  badge: 'LIVE ENVIRONMENTS',
  heading: 'HANDS-ON BATTLEGROUNDS',
  description:
    'Practical simulation environments built for real-world dominance. Train in the exact same environments used by elite security firms.',
  labs: [
    {
      id: 'red-team',
      title: 'Red Team Lab',
      description: 'Simulate sophisticated adversary attacks and master offensive infiltration techniques.',
      team: 'red' as const,
    },
    {
      id: 'llm-red',
      title: 'LLM Red Teaming & AI Defense',
      description: 'Master adversarial machine learning. Infiltrate LLMs and defend against prompt injections.',
      team: 'blue' as const,
    },
    {
      id: 'malware',
      title: 'Malware Sandboxing',
      description: 'Reverse-engineer malicious payloads in isolated, high-security virtual environments.',
      team: 'red' as const,
    },
    {
      id: 'iot',
      title: 'IoT Hardware Hacking',
      description: 'Break into the physical layer. Analyze firmware and exploit connected hardware devices.',
      team: 'red' as const,
    },
    {
      id: 'blockchain',
      title: 'Blockchain Security Forge',
      description: 'Audit smart contracts and explore vulnerabilities in decentralized protocols.',
      team: 'blue' as const,
    },
    {
      id: 'forensics',
      title: 'Digital Forensics Bay',
      description: 'Learn to track digital footprints and recover data from compromised systems.',
      team: 'blue' as const,
    },
    {
      id: 'cloud',
      title: 'Cloud Security Range',
      description: 'Secure complex cloud architectures across AWS, Azure, and Google Cloud.',
      team: 'blue' as const,
    },
    {
      id: 'web-api',
      title: 'Web & API Security Arena',
      description: 'Conquer the OWASP Top 10 and exploit flaws in modern web services and microarchitecture.',
      team: 'red' as const,
    },
    {
      id: 'wireless',
      title: 'Wireless Exploitation',
      description: 'Master the art of breaking and securing radio-based communications and Wi-Fi.',
      team: 'red' as const,
    },
  ],
} as const;
