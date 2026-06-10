export interface AboutStat {
  id: string;
  value: number;
  suffix: string;
  label: string;
}

/**
 * Content (v1.3) — Section 4 "Our Impact": Creating Measurable Outcomes.
 * Six dynamic counters replace the previous four.
 *
 * Dev note (per spec): "Stats should be dynamic/editable from CMS. Update
 * values as milestones are reached." Numbers below are reasonable starting
 * placeholders — adjust here (or wire to a CMS source) as real numbers come
 * in. The animation timeline that drives the counter ignition queries by
 * count, so adding two more cards composes naturally into the existing grid.
 */
export const aboutStatsContent = {
  badge: 'OUR IMPACT',
  heading: 'Creating Measurable Outcomes',
  description:
    'Every figure tracks a real partnership outcome — a student trained, an institution served, a future career launched.',
  stats: [
    { id: 'students-trained', value: 5000, suffix: '+', label: 'Students Trained' },
    { id: 'inst-partnerships', value: 25, suffix: '+', label: 'Institutional Partnerships' },
    { id: 'workshops', value: 150, suffix: '+', label: 'Workshops Conducted' },
    { id: 'experts-engaged', value: 75, suffix: '+', label: 'Industry Experts Engaged' },
    { id: 'projects-mentored', value: 300, suffix: '+', label: 'Projects Mentored' },
    { id: 'placement-stories', value: 200, suffix: '+', label: 'Placement Success Stories' },
  ] satisfies readonly AboutStat[],
} as const;
