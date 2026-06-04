export const ctfChallengeContent = {
  badge: 'INTERACTIVE CHALLENGE',
  heading: 'Challenge Your Hacking Skills',
  description:
    'Try our interactive CTF (Capture The Flag) challenge to get a taste of real security testing.',
  prompt: 'cycraft@challenge:~$',
  // Default state: greeting + START CHALLENGE button.
  welcomeLines: [
    'Welcome to CyCraft Security Challenge',
    'Test your penetration testing knowledge',
  ] as const,
  startCta: { label: 'START CHALLENGE' },
  // Revealed when the user clicks START CHALLENGE. Empty strings render as
  // blank lines for visual spacing (matches the original ethicalbyte
  // ctf_challenge.sh output).
  challengeLines: [
    '$ ./ctf_challenge.sh',
    '> Initializing ethical hacking challenge...',
    '> [████████] 80% Complete',
    '',
    'CHALLENGE: Decode the security message',
    '',
    'Hint: Base64 encoded',
    '',
    'Challenge: RUFUQTogVGhlIHNlY3VyaXR5IHByb2Zlc3Npb24gbGlrZXMgaG90IHBlbmV0cmF0aW9uIHRlc3Rpbmcgc2NlbmFyaW9z',
    '',
    'Ready to test your skills? Enroll in our Advanced Penetration Testing course!',
  ] as const,
  followUp:
    'Want to master these security challenges and become an ethical hacker?',
  followUpCta: {
    label: 'Explore Penetration Testing Courses',
    href: '/courses',
  },
} as const;
