export type BadgeTier = 'gold' | 'silver' | 'bronze' | 'standard';

export interface LeaderboardEntry {
  rank: number;
  name: string;
  course: string;
  scorePct: number;
  badge: BadgeTier;
}

export const assessmentLeaderboardContent = {
  badge: 'TOP SCORERS',
  heading: 'Leaderboard — Last 30 Days',
  description:
    'Top candidates across all final certification exams. Refreshed nightly; full per-course rankings live inside the LMS student dashboard.',
  /** Hardcoded top-10 placeholder data — swap with the real query once the
   *  Admin Panel ships Certificate Management (PRD §5.2). */
  entries: [
    { rank: 1, name: 'Aarav Sharma', course: 'Advanced Ethical Hacking', scorePct: 98, badge: 'gold' },
    { rank: 2, name: 'Priya Patel', course: 'Cloud Security Fundamentals', scorePct: 96, badge: 'silver' },
    { rank: 3, name: 'Rohan Verma', course: 'Web Application Security', scorePct: 95, badge: 'bronze' },
    { rank: 4, name: 'Ananya Iyer', course: 'Malware Analysis', scorePct: 93, badge: 'standard' },
    { rank: 5, name: 'Vikram Singh', course: 'Network Penetration Testing', scorePct: 92, badge: 'standard' },
    { rank: 6, name: 'Meera Krishnan', course: 'Cryptography Essentials', scorePct: 91, badge: 'standard' },
    { rank: 7, name: 'Karan Mehta', course: 'Advanced Ethical Hacking', scorePct: 90, badge: 'standard' },
    { rank: 8, name: 'Ishaan Reddy', course: 'Reverse Engineering', scorePct: 89, badge: 'standard' },
    { rank: 9, name: 'Sneha Joshi', course: 'Incident Response', scorePct: 88, badge: 'standard' },
    { rank: 10, name: 'Aditya Rao', course: 'Cloud Security Fundamentals', scorePct: 87, badge: 'standard' },
  ] satisfies readonly LeaderboardEntry[],
  columns: {
    rank: 'Rank',
    name: 'Candidate',
    course: 'Course',
    score: 'Score',
  },
} as const;
