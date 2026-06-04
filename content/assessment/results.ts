export interface SectionScore {
  id: string;
  label: string;
  scorePct: number;
}

export const assessmentResultsContent = {
  badge: 'RESULTS & ANALYTICS',
  heading: 'Instant Scorecard, Long-Term Record',
  description:
    'Every submission renders a per-section scorecard, percentile band, attempt history, and certificate eligibility — exportable to CSV/PDF from the Admin Panel.',
  /** Headline card data. */
  scorecard: {
    candidate: 'Sample Candidate',
    examName: 'Final Certification — Ethical Hacking',
    overallScore: 84,
    overallTarget: 100,
    passPct: 70,
    status: 'PASSED',
    percentile: 92,
    timeTaken: '01:42:15',
    attempt: 'Attempt 1 of 3',
    certificateEligible: true,
  },
  /** Per-section breakdown shown beneath the headline number. */
  sections: [
    { id: 'recon', label: 'Reconnaissance & OSINT', scorePct: 88 },
    { id: 'web', label: 'Web Application Security', scorePct: 91 },
    { id: 'network', label: 'Network Penetration', scorePct: 75 },
    { id: 'crypto', label: 'Cryptography Basics', scorePct: 82 },
    { id: 'report', label: 'Reporting & Disclosure', scorePct: 86 },
  ] satisfies readonly SectionScore[],
  /** Three small stat tiles below the breakdown. */
  highlights: [
    { id: 'percentile', value: '92nd', label: 'Percentile' },
    { id: 'time', value: '01:42', label: 'Time Taken' },
    { id: 'attempt', value: '1 / 3', label: 'Attempt' },
  ],
} as const;
