export type HowItWorksIcon = 'id' | 'check' | 'record';

export interface HowItWorksStep {
  id: string;
  icon: HowItWorksIcon;
  step: string;
  title: string;
  description: string;
}

export const verifyHowItWorksContent = {
  badge: 'HOW VERIFICATION WORKS',
  heading: 'Three Steps, Verified in Seconds',
  description:
    'Every CyCraft certificate is signed at issuance and recorded against a public lookup ID. Anyone can confirm authenticity in seconds — no account required.',
  steps: [
    {
      id: 'enter',
      icon: 'id',
      step: '01',
      title: 'Enter the ID',
      description:
        'Type the certificate ID printed on the credential, or scan the QR code on the document to auto-fill the form.',
    },
    {
      id: 'lookup',
      icon: 'check',
      step: '02',
      title: 'Lookup Against Registry',
      description:
        'The ID is matched against our signed certificate registry. Lookups are anonymous and rate-limited at the edge.',
    },
    {
      id: 'verify',
      icon: 'record',
      step: '03',
      title: 'See the Record',
      description:
        'A valid match returns the candidate name, course, dates, and grade. Revoked or expired credentials are clearly flagged.',
    },
  ] satisfies readonly HowItWorksStep[],
} as const;
