export const galleryHeroContent = {
  badge: 'TRAINING_GALLERY',
  headlinePrefix: 'Training &',
  headlineAccent: 'Contributions',
  tagline:
    'Workshops, hackathons, campus talks, and corporate engagements — the public record of CyCraft training delivered in person.',
  pills: [
    { label: 'Workshops', icon: 'lock' },
    { label: 'Hackathons', icon: 'bolt' },
    { label: 'Campus Talks', icon: 'prompt' },
  ],
  terminalLines: [
    '> registry.load("events")',
    '> categories: workshop | meetup | corporate | inaugural',
    '> footprint: 25+ cities | 5000+ attendees',
  ],
} as const;
