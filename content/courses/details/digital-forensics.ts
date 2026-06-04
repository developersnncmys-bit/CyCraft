import type { CourseDetail } from './types';

export const digitalForensicsDetail: CourseDetail = {
  slug: 'digital-forensics',
  longDescription:
    'Practical digital forensics: disk, memory, network and incident artifacts analysis.',
  syllabus: [
    'Master the Foundations of Computer Forensics & Digital Evidence',
    'Understand the Role, Ethics & Legal Boundaries of Forensic Experts',
    'Explore Digital Evidence Principles — Chain of Custody & Locard’s Law',
    'Dive into Core System Architecture — Windows, Linux & macOS',
    'Analyse File Systems — NTFS, FAT, EXT4 & HFS+ Recovery Techniques',
    'Design & Implement Forensic Readiness and Incident Response Plans',
    'Acquire & Preserve Digital Evidence with Precision Imaging Methods',
    'Leverage Industry Tools — EnCase, FTK, Autopsy & Volatility',
    'Perform Live Forensics — RAM, Process & Network Analysis',
    'Recover Deleted Data & Conduct Deep File Carving Operations',
    'Investigate Email Trails & Browser Artifacts for Digital Clues',
    'Master Mobile Forensics — Android, iOS & App Data Analysis',
    'Execute Network Forensics — Capture, Inspect & Trace Intrusions',
    'Navigate Legal Frameworks — GDPR, HIPAA & Expert Testimony Ethics',
    'Write Court-Ready Forensic Reports & Present Expert Testimony',
    'Engage in Real-World Case Studies — Learn from Landmark Investigations',
    'Apply Best Practices — ISO/IEC 27037 & NIST SP 800-86 Standards',
  ],
  prerequisites: [
    'Familiarity with OS internals',
    'Interest in investigations',
  ],
  outcomes: [
    'Perform forensic triage',
    'Recover evidence reliably',
    'Produce court-ready reports',
  ],
};
