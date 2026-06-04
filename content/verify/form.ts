export const verifyFormContent = {
  badge: 'VERIFY CREDENTIAL',
  heading: 'Look Up a Certificate',
  description:
    'Enter the certificate ID printed on the credential or embedded in its QR code. We will confirm the candidate, course, and issuance details against our registry.',
  inputLabel: 'Certificate ID',
  inputPlaceholder: 'e.g. CYC-2024-0142',
  buttonLabel: 'Verify Certificate',
  buttonBusyLabel: 'Verifying…',
  /** Visible hint sitting under the form, with sample IDs the demo accepts. */
  hintLabel: 'Try a sample:',
  sampleIds: ['CYC-2024-0142', 'CYC-2024-0287', 'CYC-2025-0023'],
  /** Empty state — shown before the first lookup. */
  emptyState: {
    title: 'Awaiting Lookup',
    body: 'The result of your search will appear here. Nothing is stored or logged.',
  },
  /** Not-found state — shown when the ID does not match any record. */
  notFoundState: {
    title: 'Certificate Not Found',
    body: 'We could not find a certificate matching that ID. Double-check the format and try again.',
  },
  /** Labels reused inside the result card. */
  result: {
    statusValid: 'Valid',
    statusRevoked: 'Revoked',
    statusExpired: 'Expired',
    fieldCandidate: 'Candidate',
    fieldCourse: 'Course',
    fieldCompletion: 'Completion Date',
    fieldIssue: 'Issue Date',
    fieldGrade: 'Grade',
    fieldId: 'Certificate ID',
  },
} as const;
