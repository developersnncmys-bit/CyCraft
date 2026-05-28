export type MissionIcon = 'trending' | 'globe' | 'shield' | 'badge';

export interface MissionFeature {
  id: string;
  icon: MissionIcon;
  label: string;
}

export const aboutMissionContent = {
  badge: 'OUR MISSION',
  heading: 'Our Mission',
  paragraphs: [
    'At CyCraft, we are dedicated to bridging the cybersecurity skills gap by providing world-class training that combines theoretical knowledge with practical application.',
    'Founded in 2014, we have trained thousands of students who now work at leading organizations worldwide. Our approach is simple: focus on practical skills, real-world scenarios, and career outcomes.',
    'We partner with industry leaders to ensure our curriculum stays current with the latest threats, technologies, and best practices in cybersecurity.',
  ],
  card: {
    title: 'Why Choose Us',
    features: [
      { id: 'curriculum', icon: 'trending', label: 'Industry-leading curriculum updated quarterly' },
      { id: 'network', icon: 'globe', label: 'Global network of partner companies' },
      { id: 'instructors', icon: 'shield', label: 'Instructors with real-world experience' },
      { id: 'placement', icon: 'badge', label: '95% student placement rate' },
    ] satisfies readonly MissionFeature[],
  },
} as const;
