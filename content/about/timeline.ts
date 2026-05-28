export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
}

export const aboutTimelineContent = {
  badge: 'THE JOURNEY',
  heading: 'How We Got Here',
  description:
    'From a small cybersecurity training cohort to an end-to-end platform spanning research, B.Tech, and industry placements.',
  events: [
    {
      id: '2014',
      year: '2014',
      title: 'CyCraft Founded',
      description:
        'Launched with a focus on practical, hands-on cybersecurity training — built around real labs instead of slide decks.',
    },
    {
      id: '2017',
      year: '2017',
      title: 'Industry Partnerships',
      description:
        'First wave of hiring partnerships established; placement support became a core part of every program.',
    },
    {
      id: '2019',
      year: '2019',
      title: 'Research Wing Launched',
      description:
        'Dedicated research division spun up — publishing CVEs, threat intelligence, and vulnerability writeups feeding straight into the curriculum.',
    },
    {
      id: '2022',
      year: '2022',
      title: 'LMS & Online Programs',
      description:
        'Protected video LMS, certification examinations, and remote-friendly cohorts opened CyCraft’s training to learners across India.',
    },
    {
      id: '2024',
      year: '2024',
      title: 'B.Tech in Cybersecurity',
      description:
        'Cyber Intelligence Engineering B.Tech program launched in partnership with S-VYASA University, Bangalore.',
    },
    {
      id: '2026',
      year: '2026',
      title: '5,000+ Defenders Shipped',
      description:
        'Crossed the 5,000-student mark with a 95% placement rate and a 50+ industry-partner network.',
    },
  ] satisfies readonly TimelineEvent[],
} as const;
