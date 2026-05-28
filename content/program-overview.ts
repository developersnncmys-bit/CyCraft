export const programOverviewContent = {
  heading: 'PROGRAM OVERVIEW',
  terminal: {
    prompt: '~ root@cycraft: /usr/info/summary',
    lines: [
      '>> INITIALIZING_PROGRAM_DATA...',
      '> FOCUS_AREAS: [RED_TEAM, BLUE_TEAM, IOT_SEC, BLOCKCHAIN_ARCH, AI_SECURITY]',
      '> LAB_INTENSITY: CRITICAL',
      '> READY_STATUS: 100%',
    ] as const,
  },
  details: [
    { label: 'Duration', value: '4 Years / 8 Semesters' },
    { label: 'Degree', value: 'Undergraduate B.Tech' },
    { label: 'Model', value: 'Hands-on Labs + Major Projects + Theory' },
    { label: 'Outcome', value: 'Industry-ready career pathways' },
  ] as const,
} as const;
