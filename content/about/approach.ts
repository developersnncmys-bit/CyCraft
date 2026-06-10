export interface ApproachPillar {
  id: string;
  number: string;
  title: string;
  description: string;
}

/**
 * Content (v1.3) — Section 5 "Our Learning Approach": Learn. Practice. Apply.
 * Excel. Four sequential steps replace the previous three pillars. The
 * `aboutApproachContent` shape (badge / heading / description / pillars[])
 * stays identical so the section's animation timeline keeps firing — the
 * existing pillar-card render is array-driven and accommodates a 4th step
 * naturally.
 */
export const aboutApproachContent = {
  badge: 'OUR LEARNING APPROACH',
  heading: 'Learn. Practice. Apply. Excel.',
  description:
    'A four-stage journey that turns curiosity into capability and capability into career readiness.',
  pillars: [
    {
      id: 'discover',
      number: '1',
      title: 'Discover',
      description: 'Build strong foundational knowledge and technical understanding.',
    },
    {
      id: 'experience',
      number: '2',
      title: 'Experience',
      description: 'Participate in practical labs, simulations, projects, and challenges.',
    },
    {
      id: 'collaborate',
      number: '3',
      title: 'Collaborate',
      description: 'Work with mentors, peers, and industry experts on meaningful initiatives.',
    },
    {
      id: 'achieve',
      number: '4',
      title: 'Achieve',
      description: 'Develop skills, confidence, and professional readiness for future careers.',
    },
  ] satisfies readonly ApproachPillar[],
} as const;
