export const ctfChallengeContent = {
  badge: 'INTERACTIVE CHALLENGE',
  heading: 'Challenge Your Hacking Skills',
  description:
    'Try our interactive CTF (Capture The Flag) challenge to get a taste of real security testing.',
  prompt: 'cycraft@challenge:~$',
  welcomeLines: [
    'Welcome to CyCraft Security Challenge',
    'Test your penetration testing knowledge',
  ] as const,
  startCta: { label: 'START CHALLENGE', href: '#ctf' },
  followUp:
    'Want to master these security challenges and become an ethical hacker?',
  followUpCta: {
    label: 'Explore Penetration Testing Courses',
    href: '#courses',
  },
} as const;
