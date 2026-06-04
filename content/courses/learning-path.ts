export const coursesLearningPathContent = {
  badge: 'CUSTOMIZE_PATH',
  headingPrefix: 'Learning Path',
  headingAccent: 'Customization',
  terminalCommand: '$ ./customize_your_learning_journey.sh',
  pillars: [
    {
      key: 'self-paced',
      icon: 'prompt',
      title: 'Self-Paced',
      description:
        'Learn at your own speed with lifetime access to all course materials and updates.',
    },
    {
      key: 'live-labs',
      icon: 'bolt',
      title: 'Live Labs',
      description:
        'Hands-on penetration testing environments with real infrastructure and scenarios.',
    },
    {
      key: 'certified',
      icon: 'lock',
      title: 'Certified',
      description:
        'Industry-recognized certifications upon completion with verified credentials.',
    },
  ],
} as const;
