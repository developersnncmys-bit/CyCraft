export type ValueIcon =
  | 'shield'
  | 'target'
  | 'badge'
  | 'users'
  | 'school'
  | 'lock'
  | 'wrench'
  | 'cap'
  | 'lightbulb'
  | 'briefcase';

export interface AboutValue {
  id: string;
  icon: ValueIcon;
  title: string;
  description: string;
}

/**
 * Content (v1.3) — Section 3 "What We Do": Comprehensive Academic Partnership
 * Solutions. Six service cards replace the previous four "Core Values". The
 * `aboutValuesContent` shape stays identical (badge / heading / description /
 * values[]) so the existing animation timeline and grid auto-flow for the
 * cards still work — only copy + icon palette changes.
 */
export const aboutValuesContent = {
  badge: 'WHAT WE DO',
  heading: 'Comprehensive Academic Partnership Solutions',
  description:
    'Six end-to-end programs designed to equip institutions with everything they need to deliver future-ready learning experiences.',
  values: [
    {
      id: 'inst-training',
      icon: 'school',
      title: 'Institutional Training Programs',
      description: 'Customized learning programs designed for colleges and universities.',
    },
    {
      id: 'cyber-edu',
      icon: 'lock',
      title: 'Cybersecurity Education',
      description:
        'Training pathways covering cybersecurity fundamentals, offensive security, defensive security, cloud security, and digital forensics.',
    },
    {
      id: 'workshops',
      icon: 'wrench',
      title: 'Workshops & Bootcamps',
      description:
        'Interactive sessions led by industry professionals on emerging technologies and practical applications.',
    },
    {
      id: 'faculty-dev',
      icon: 'cap',
      title: 'Faculty Development Programs',
      description: 'Upskilling initiatives designed to empower educators with modern technical expertise.',
    },
    {
      id: 'research-support',
      icon: 'lightbulb',
      title: 'Innovation & Research Support',
      description:
        'Encouraging students to engage in research, innovation projects, competitions, and technical communities.',
    },
    {
      id: 'career-dev',
      icon: 'briefcase',
      title: 'Career Development Programs',
      description:
        'Interview preparation, resume building, portfolio development, and industry readiness initiatives.',
    },
  ] satisfies readonly AboutValue[],
} as const;
