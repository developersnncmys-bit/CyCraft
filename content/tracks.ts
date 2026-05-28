export const tracksContent = {
  heading: "THE ACHIEVER'S TRACKS",
  description: 'Pick a specialization. Train with experts. Dominate one global niche.',
  tracks: [
    {
      id: 'offensive',
      title: 'Offensive Security',
      description: 'Dominate global CTFs (Capture The Flag) and Bug Bounty platforms.',
      team: 'red' as const,
      icon: 'target' as const,
    },
    {
      id: 'devsecops',
      title: 'Cloud & DevSecOps',
      description: 'Secure enterprise infrastructure on AWS/GCP and automate defense.',
      team: 'blue' as const,
      icon: 'cloud' as const,
    },
    {
      id: 'malware',
      title: 'Malware & Forensics',
      description: 'Reverse engineer zero-days and lead critical incident response.',
      team: 'red' as const,
      icon: 'bug' as const,
    },
    {
      id: 'ai-security',
      title: 'AI Security',
      description:
        'Defend Large Language Models against prompt injections and poisoned data.',
      team: 'blue' as const,
      icon: 'cpu' as const,
    },
  ],
} as const;
