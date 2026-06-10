/**
 * Content (v1.3) — Section 6 "Academic Partnership Model": Supporting
 * Institutions at Every Stage.
 *
 * Repurposed from the old leadership-profile shape. Two parallel bullet
 * columns now sit inside the same section: how we partner (left) and why
 * institutions pick us (right). Type renamed to `PartnershipColumn`; the
 * original `LeadershipProfile` export retained as an alias so any out-of-tree
 * consumer keeps compiling (none currently exists in this repo).
 */
export interface PartnershipColumn {
  id: string;
  title: string;
  items: readonly string[];
}

/** @deprecated kept as an alias for any legacy import path. */
export type LeadershipProfile = PartnershipColumn;

export const aboutLeadershipContent = {
  badge: 'PARTNERSHIP MODEL',
  heading: 'Supporting Institutions at Every Stage',
  description: 'We collaborate with educational institutions through:',
  columns: [
    {
      id: 'partnership-activities',
      title: 'Partnership Activities',
      items: [
        'Industry-oriented training programs',
        'Technology Centers of Excellence',
        'Technical clubs and communities',
        'Faculty enablement initiatives',
        'Skill development programs',
        'Research and innovation activities',
        'Placement support initiatives',
        'Industry engagement opportunities',
      ],
    },
    {
      id: 'why-choose-cycraft',
      title: 'Why Institutions Choose CyCraft',
      items: [
        'Practical and application-focused learning',
        'Customized institutional solutions',
        'Industry expert mentorship',
        'Scalable training models',
        'Outcome-driven programs',
        'Long-term partnership approach',
        'Focus on employability and innovation',
      ],
    },
  ] satisfies readonly PartnershipColumn[],
} as const;
