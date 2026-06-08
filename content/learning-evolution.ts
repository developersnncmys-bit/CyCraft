export const learningEvolutionContent = {
  // Three-phrase morph swapped through during the section's first 18% of pin.
  // All three frame the same arc — eight semesters of guided ascent — with
  // shifting vocabulary so the morph reads as the same idea reframed three
  // ways, not three separate claims.
  headingMorphs: [
    'THE LEARNING EVOLUTION',
    'EIGHT SEMESTERS. ONE TRAJECTORY.',
    'FUNDAMENTALS TO FRONT LINE.',
  ],
  description: 'A precision-guided technical progression from fundamentals to elite specializations.',
  phases: [
    {
      id: 'phase-01',
      number: '01',
      title: 'The Foundation',
      description: 'Mastering C++, Data Structures, and Cybersecurity basics.',
      semesters: '1 – 2',
    },
    {
      id: 'phase-02',
      number: '02',
      title: 'Offensive Core',
      description: 'Ethical Hacking, Network Security, and Python automation.',
      semesters: '3 – 4',
    },
    {
      id: 'phase-03',
      number: '03',
      title: 'Hardware & Web3',
      description: 'IoT Pentesting, Smart Contract Auditing, and AI Security.',
      semesters: '5 – 6',
    },
    {
      id: 'phase-04',
      number: '04',
      title: 'High-Orbit Ops',
      description: 'DevSecOps, Zero Trust Architecture, and Major Project.',
      semesters: '7 – 8',
    },
  ],
} as const;
