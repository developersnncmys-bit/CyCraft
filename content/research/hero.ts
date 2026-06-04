export const researchHeroContent = {
  badge: 'RESEARCH_DIVISION',
  headlinePrefix: 'Research',
  headlineAccent: '& Innovation',
  tagline:
    'Exploring the frontiers of cybersecurity through cutting-edge research, vulnerability writeups, and innovative solutions used in the wild.',
  pills: [
    { label: 'Peer-Reviewed', icon: 'lock' },
    { label: 'Open Source', icon: 'bolt' },
    { label: 'Field-Tested', icon: 'prompt' },
  ],
  terminalLines: [
    '> wing.load("research")',
    '> domains: malware | web | cloud | reverse-eng | crypto',
    '> publications: peer-reviewed | open-access',
  ],
} as const;
