export type CategoryIcon = 'aptitude' | 'technical' | 'lab' | 'badge';

export interface AssessmentCategory {
  id: string;
  icon: CategoryIcon;
  /** Short tag rendered above the title, e.g. "PRE-ENROLLMENT". */
  tag: string;
  title: string;
  description: string;
  /** Stat strip rendered along the bottom of the card. */
  meta: {
    questions: string;
    duration: string;
    proctoring: string;
  };
}

export const assessmentCategoriesContent = {
  badge: 'ASSESSMENT CATEGORIES',
  heading: 'Four Tracks, One Engine',
  description:
    'Every assessment runs on the same proctored exam engine — only the question bank, time limit, and grading rubric change.',
  categories: [
    {
      id: 'aptitude',
      icon: 'aptitude',
      tag: 'PRE-ENROLLMENT',
      title: 'Aptitude Test',
      description:
        'Logical reasoning, basic security awareness, and English screening before you enrol in a track. Sets your starting course recommendation.',
      meta: {
        questions: '40 questions',
        duration: '45 minutes',
        proctoring: 'Basic',
      },
    },
    {
      id: 'technical',
      icon: 'technical',
      tag: 'MODULE QUIZ',
      title: 'Technical Screening',
      description:
        'MCQ + short-answer questions covering networking, web, malware, and crypto fundamentals. Used inside courses as module quizzes.',
      meta: {
        questions: '60 questions',
        duration: '75 minutes',
        proctoring: 'Standard',
      },
    },
    {
      id: 'lab',
      icon: 'lab',
      tag: 'PRACTICAL',
      title: 'Security Labs',
      description:
        'Hands-on challenges from the CyCraft lab environment — pivot a network, escalate privileges, decode a payload. Graded on artifact submission.',
      meta: {
        questions: '6 challenges',
        duration: '4 hours',
        proctoring: 'Standard',
      },
    },
    {
      id: 'certification',
      icon: 'badge',
      tag: 'FINAL EXAM',
      title: 'Certification Exam',
      description:
        'End-of-course examination tied to the candidate’s public certificate. Full proctoring, fixed attempt limit, results land on the Verify page.',
      meta: {
        questions: '80 questions',
        duration: '120 minutes',
        proctoring: 'Full',
      },
    },
  ] satisfies readonly AssessmentCategory[],
} as const;
