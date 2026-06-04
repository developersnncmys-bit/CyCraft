export interface GalleryStat {
  id: string;
  value: number;
  suffix: string;
  label: string;
}

export const galleryStatsContent = {
  badge: 'PUBLIC FOOTPRINT',
  heading: 'CyCraft on the Road',
  description:
    'Every figure on this page is grounded in an event we co-hosted with a partner campus, corporate, or community chapter.',
  /** Mirrors the Research-page stats verbatim — the EthicalByte gallery
   *  shows the same four counters at this position, so the public numbers
   *  match across both pages. */
  stats: [
    { id: 'papers', value: 25, suffix: '+', label: 'Published Papers' },
    { id: 'projects', value: 15, suffix: '+', label: 'Active Projects' },
    { id: 'partnerships', value: 30, suffix: '+', label: 'Partnerships' },
    { id: 'researchers', value: 100, suffix: '+', label: 'Researchers' },
  ] satisfies readonly GalleryStat[],
} as const;
