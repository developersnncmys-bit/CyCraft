/**
 * Sample certificate registry — static demo for the public Verify page.
 *
 * Replace this list with an API lookup once the Admin Panel ships the
 * Certificate Management module (PRD §5.2). Until then, any ID that
 * matches one of the entries below resolves to a populated result; every
 * other input renders the "not found" state.
 *
 * IDs follow the CyCraft format: CYC-{YEAR}-{COURSE_TAG?}-{SEQ}.
 */
export type CertificateStatus = 'valid' | 'revoked' | 'expired';

export interface Certificate {
  id: string;
  candidateName: string;
  course: string;
  /** Slug used to deep-link back to the course page, if applicable. */
  courseSlug?: string;
  grade: string;
  completionDate: string;
  issueDate: string;
  status: CertificateStatus;
  /** Optional revocation reason — shown when status === 'revoked'. */
  revokedReason?: string;
}

export const verifyCertificates: readonly Certificate[] = [
  {
    id: 'CYC-2024-0142',
    candidateName: 'Aarav Sharma',
    course: 'Advanced Ethical Hacking',
    courseSlug: 'advanced-ethical-hacking',
    grade: 'A',
    completionDate: '2024-03-15',
    issueDate: '2024-03-20',
    status: 'valid',
  },
  {
    id: 'CYC-2024-0287',
    candidateName: 'Priya Patel',
    course: 'Cloud Security Fundamentals',
    courseSlug: 'cloud-security-fundamentals',
    grade: 'A+',
    completionDate: '2024-06-22',
    issueDate: '2024-06-28',
    status: 'valid',
  },
  {
    id: 'CYC-2023-EHCP-089',
    candidateName: 'Rohan Verma',
    course: 'Ethical Hacking & Penetration Testing',
    courseSlug: 'ethical-hacking-penetration-testing',
    grade: 'B+',
    completionDate: '2023-11-10',
    issueDate: '2023-11-15',
    status: 'valid',
  },
  {
    id: 'CYC-2024-MAL-0451',
    candidateName: 'Ananya Iyer',
    course: 'Malware Analysis & Reverse Engineering',
    courseSlug: 'malware-analysis-reverse-engineering',
    grade: 'A',
    completionDate: '2024-08-05',
    issueDate: '2024-08-12',
    status: 'valid',
  },
  {
    id: 'CYC-2025-0023',
    candidateName: 'Vikram Singh',
    course: 'Web Application Security',
    courseSlug: 'web-application-security',
    grade: 'A',
    completionDate: '2025-01-28',
    issueDate: '2025-02-03',
    status: 'revoked',
    revokedReason: 'Academic integrity violation reported and confirmed.',
  },
];

/**
 * Look up a certificate by ID. Comparison is case-insensitive and
 * whitespace-trimmed so users pasting from email/PDF aren't penalised
 * for stray characters.
 */
export function findCertificate(rawInput: string): Certificate | null {
  const needle = rawInput.trim().toUpperCase();
  if (!needle) return null;
  return verifyCertificates.find((c) => c.id.toUpperCase() === needle) ?? null;
}
