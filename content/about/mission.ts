export type MissionIcon = 'trending' | 'globe' | 'shield' | 'badge' | 'cap' | 'wrench';

export interface MissionFeature {
  id: string;
  icon: MissionIcon;
  label: string;
}

/**
 * Content (v1.3) — Section 2 "Why CyCraft": Building Future-Ready Professionals.
 * The existing structure (badge + heading + paragraphs + card with feature list)
 * is preserved so the section's animation timeline keeps firing — only the
 * copy changes. Six new features replace the previous four; icon palette
 * extended with `cap` and `wrench` to cover the new categories.
 */
export const aboutMissionContent = {
  badge: 'WHY CYCRAFT',
  heading: 'Building Future-Ready Professionals',
  paragraphs: [
    'Educational institutions face the challenge of preparing students for a rapidly evolving technology landscape. CyCraft helps bridge this gap through practical learning experiences, expert mentorship, and industry-relevant programs.',
  ],
  card: {
    title: 'What Sets Us Apart',
    features: [
      { id: 'inst-focus', icon: 'badge', label: 'Institution-focused learning solutions' },
      { id: 'curriculum', icon: 'trending', label: 'Industry-aligned curriculum' },
      { id: 'hands-on', icon: 'wrench', label: 'Hands-on practical sessions' },
      { id: 'workshops', icon: 'cap', label: 'Technology workshops and bootcamps' },
      { id: 'career', icon: 'globe', label: 'Career readiness initiatives' },
      { id: 'research', icon: 'shield', label: 'Innovation and research support' },
    ] satisfies readonly MissionFeature[],
  },
} as const;
