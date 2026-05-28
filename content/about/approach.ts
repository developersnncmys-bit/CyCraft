export interface ApproachPillar {
  id: string;
  number: string;
  title: string;
  description: string;
}

export const aboutApproachContent = {
  badge: 'OUR APPROACH',
  heading: 'Our Approach',
  description:
    'We believe that effective cybersecurity education requires more than just lectures. Our three-pillar approach ensures students are truly prepared for their careers.',
  pillars: [
    {
      id: 'theory',
      number: '1',
      title: 'Theory',
      description:
        'Comprehensive coverage of cybersecurity fundamentals, frameworks, and concepts taught by industry experts.',
    },
    {
      id: 'practice',
      number: '2',
      title: 'Practice',
      description:
        'Hands-on labs, real-world scenarios, and capstone projects that turn knowledge into operational skill.',
    },
    {
      id: 'career',
      number: '3',
      title: 'Career',
      description:
        'Internships, interview preparation, and direct placement support with our network of industry partners.',
    },
  ] satisfies readonly ApproachPillar[],
} as const;
