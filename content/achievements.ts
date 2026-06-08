export const achievementsContent = {
  badge: 'ACHIEVEMENTS',
  // Three-phrase morph swapped through during the section's first 20% of pin.
  // Phrases share a meaning shape (achievements / records / fieldwork) so the
  // morph reads as the same idea rotating through frames, not three unrelated
  // statements. Lengths kept within 4–6 words to avoid line-break shifts.
  headingMorphs: [
    'HISTORY MADE IN CYBER DEFENSE',
    'RECORDS SET. THREATS NEUTRALISED.',
    'OUR STUDENTS, ON THE FRONT LINE.',
  ],
  description:
    "While others watched livestreams, our students were actively securing critical infrastructure and presenting vulnerability research to the world's top security analysts at global conferences.",
  stats: [
    { value: 200, suffix: '+', label: 'Students Placed', depth: 2 as const },
    { value: 50, suffix: '+', label: 'Hiring Partners', depth: 4 as const },
    { value: 8, suffix: '', label: 'Semesters', depth: 3 as const },
    { value: 18, suffix: '', label: 'Months Experience', depth: 5 as const },
  ],
} as const;
