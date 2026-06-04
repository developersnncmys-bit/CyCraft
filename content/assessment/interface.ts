/**
 * Static preview of the exam-taking interface. This isn't a working quiz —
 * the real engine lives inside the LMS portal (PRD §4.5). The mock here is
 * a hand-crafted, animated still-frame that shows what the candidate sees:
 * timer + question + four options + navigation panel + footer controls.
 */
export type NavQuestionState = 'current' | 'answered' | 'flagged' | 'unanswered';

export interface NavQuestion {
  n: number;
  state: NavQuestionState;
}

export const assessmentInterfaceContent = {
  badge: 'ASSESSMENT INTERFACE',
  heading: 'A Calm, Proctored Test Surface',
  description:
    'Timer prominent, one question per screen, distraction-free navigation. Same chrome whether you’re sitting an aptitude quiz or a final certification exam.',
  /** Frame header. */
  examName: 'Final Certification — Ethical Hacking',
  timer: '00:14:32',
  questionNumber: 'Question 12 of 80',
  progressPercent: 15,
  /** The sample MCQ shown front-and-centre in the mockup. */
  question:
    'Which of the following best describes a stored cross-site scripting (XSS) vulnerability?',
  options: [
    {
      letter: 'A',
      text: 'Malicious script is reflected back to the user inside an HTTP response without being persisted on the server.',
      state: 'idle',
    },
    {
      letter: 'B',
      text: 'Malicious script is saved on the server and rendered to other users when they view the affected page.',
      state: 'selected',
    },
    {
      letter: 'C',
      text: 'The attacker manipulates DOM properties on the client to inject script that the server never sees.',
      state: 'idle',
    },
    {
      letter: 'D',
      text: 'A request is forged so that the victim’s browser sends an authenticated request to an unintended endpoint.',
      state: 'idle',
    },
  ] as const,
  /** The right-hand navigation grid. 80 squares would be visual noise —
   *  the mock walks the user through the first 20 with a mix of states. */
  navQuestions: [
    { n: 1, state: 'answered' },
    { n: 2, state: 'answered' },
    { n: 3, state: 'answered' },
    { n: 4, state: 'flagged' },
    { n: 5, state: 'answered' },
    { n: 6, state: 'answered' },
    { n: 7, state: 'unanswered' },
    { n: 8, state: 'answered' },
    { n: 9, state: 'answered' },
    { n: 10, state: 'flagged' },
    { n: 11, state: 'answered' },
    { n: 12, state: 'current' },
    { n: 13, state: 'unanswered' },
    { n: 14, state: 'unanswered' },
    { n: 15, state: 'unanswered' },
    { n: 16, state: 'unanswered' },
    { n: 17, state: 'unanswered' },
    { n: 18, state: 'unanswered' },
    { n: 19, state: 'unanswered' },
    { n: 20, state: 'unanswered' },
  ] satisfies readonly NavQuestion[],
  navLegend: [
    { state: 'answered' as const, label: 'Answered' },
    { state: 'current' as const, label: 'Current' },
    { state: 'flagged' as const, label: 'Flagged' },
    { state: 'unanswered' as const, label: 'Unanswered' },
  ],
  footerButtons: {
    previous: 'Previous',
    flag: 'Flag for Review',
    next: 'Next Question',
  },
} as const;
