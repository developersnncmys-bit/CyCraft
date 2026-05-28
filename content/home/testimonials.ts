export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
}

export const testimonialsContent = {
  badge: 'STUDENT VOICES',
  heading: 'Proof of Work',
  description:
    "Placements, projects, paychecks — outcomes from CyCraft alumni now working at India's top security teams.",
  testimonials: [
    {
      id: 't1',
      quote:
        'The hands-on lab time at CyCraft is what set me apart in interviews. I walked into my first SOC role already comfortable with the tooling.',
      name: 'Priya Menon',
      role: 'Security Analyst',
      company: 'Microland',
    },
    {
      id: 't2',
      quote:
        'My CyCraft internship turned into a full-time offer at HPE before I even graduated. The mentors push you to ship real work, not just learn theory.',
      name: 'Arjun Iyer',
      role: 'Junior Pentester',
      company: 'Hewlett Packard Enterprise',
    },
    {
      id: 't3',
      quote:
        'I came in knowing only basic networking. Two years in, I had CVE credits to my name. The research wing genuinely treats undergrads as researchers.',
      name: 'Faisal Khan',
      role: 'Vulnerability Researcher',
      company: 'BSides Bangalore Speaker',
    },
    {
      id: 't4',
      quote:
        'The placement support is unreal. They prepped me for technical and behavioural rounds for weeks. I cleared all four offers I interviewed for.',
      name: 'Anika Reddy',
      role: 'Cloud Security Engineer',
      company: 'Bank of Ceylon',
    },
  ] satisfies readonly Testimonial[],
} as const;
