export const downloadCertificateContent = {
  badge: 'CERTIFICATE RETRIEVAL',
  heading: 'Download Your Certificate',
  subheading: 'Enter your email to retrieve your certificate(s).',
  description:
    'We look up every certificate ever issued against this address. You\'ll get a secure download link in your inbox within a few minutes. Lost the email? Just resubmit.',
  emailPlaceholder: 'Enter your email address',
  submitLabel: 'Check For Certificate',
  successMessage:
    'If a certificate exists for this address, a secure download link is on its way.',
  errorMessage: 'Please enter a valid email address.',
  footnote: 'Need to verify someone else\'s certificate? Use the Verify page instead.',
  verifyLink: { label: 'Go to Verify', href: '/verify' },
} as const;
